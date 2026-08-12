const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// find the exact setInterval block
const regex = /setInterval\(\(\) => \{[\s\S]*?\}, 15000\);/;

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

code = code.replace(regex, replace2);
fs.writeFileSync('server.ts', code);
