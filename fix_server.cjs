const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target1 = `import webpush from "web-push";`;
const replace1 = `import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;
`;
code = code.replace(target1, replace1);

const target2 = `let subscriptions = [];
let scheduledEvents = [];

setInterval(() => {
  if (!scheduledEvents || scheduledEvents.length === 0) return;
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentHour = String(now.getHours()).padStart(2, "0");
  const currentMin = String(now.getMinutes()).padStart(2, "0");
  const currentTime = currentHour + ":" + currentMin;

  scheduledEvents.forEach((evt) => {
    if (evt.date === currentDate && evt.time === currentTime) {
      if (!evt._backendNotified) {
         evt._backendNotified = true;
         const payload = JSON.stringify({
            title: "Event Starting Reminder!",
            message: \`Reminder: \${evt.name} is scheduled for now (\${evt.time}) at \${evt.location || 'the location'}.\`
          });
         subscriptions.forEach(sub => {
           webpush.sendNotification(sub, payload).catch(e => console.error("Push fail", e));
         });
      }
    }
  });
}, 15000);`;

const replace2 = `setInterval(async () => {
  if (!supabase) return;
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentHour = String(now.getHours()).padStart(2, "0");
  const currentMin = String(now.getMinutes()).padStart(2, "0");
  const currentTime = currentHour + ":" + currentMin;

  try {
    const { data: events, error } = await supabase
      .from('scheduled_events')
      .select('*')
      .eq('date', currentDate)
      .eq('time', currentTime)
      .eq('_backendNotified', false);
      
    if (error || !events || events.length === 0) return;

    for (const evt of events) {
      await supabase.from('scheduled_events').update({ _backendNotified: true }).eq('id', evt.id);
      const payload = JSON.stringify({
        title: "Event Starting Reminder!",
        message: \`Reminder: \${evt.name} is scheduled for now (\${evt.time}) at \${evt.location || 'the location'}.\`
      });
      
      const { data: subs } = await supabase.from('push_subscriptions').select('*').eq('user_email', evt.user_email);
      if (subs) {
        for (const sub of subs) {
          try {
            await webpush.sendNotification(sub.subscription, payload);
          } catch(e) {
            console.error("Push fail", e);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error in scheduled event interval:", err);
  }
}, 15000);

// Middleware to verify Supabase token
async function verifyAuth(req, res, next) {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured on server" });
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing authorization header" });
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Unauthorized" });
  req.user = user;
  next();
}
`;
code = code.replace(target2, replace2);

const target3 = `  app.post("/api/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
  });

  app.post("/api/sync-events", (req, res) => {
    // Merge new events while keeping _backendNotified flag if it exists
    const newEvents = req.body.events || [];
    scheduledEvents = newEvents.map(newEvt => {
      const existing = scheduledEvents.find(e => e.id === newEvt.id);
      if (existing) {
        newEvt._backendNotified = existing._backendNotified;
      }
      return newEvt;
    });
    res.json({ success: true });
  });`;

const replace3 = `  app.post("/api/subscribe", verifyAuth, async (req, res) => {
    try {
      const subscription = req.body;
      const user_email = req.user.email;
      await supabase.from('push_subscriptions').upsert({
        user_email,
        subscription,
        updated_at: new Date().toISOString()
      });
      res.status(201).json({});
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to save subscription" });
    }
  });

  app.post("/api/sync-events", verifyAuth, async (req, res) => {
    try {
      const newEvents = req.body.events || [];
      const user_email = req.user.email;
      
      for (const newEvt of newEvents) {
        await supabase.from('scheduled_events').upsert({
          id: newEvt.id,
          user_email,
          name: newEvt.name,
          date: newEvt.date,
          time: newEvt.time,
          location: newEvt.location,
          _backendNotified: newEvt._backendNotified || false,
          updated_at: new Date().toISOString()
        });
      }
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to sync events" });
    }
  });`;
code = code.replace(target3, replace3);

fs.writeFileSync('server.ts', code);
