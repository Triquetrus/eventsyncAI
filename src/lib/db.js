import { supabase } from "./supabaseClient";

const MEDIA_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "basket";

export const Ti = false;
export const sn = null;
export const oa = () => {};
export const b6 = async () => {};
export const E6 = async () => {};
export const ya = () => {};

export const EC = [
  { platform: "instagram", isConnected: !1 },
  { platform: "linkedin", isConnected: !1 },
  { platform: "facebook", isConnected: !1 },
],
  defaultEvents = [{
    id: "event-1",
    name: "AI Hackathon Demo Day",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    endTime: "23:59",
    location: "Tech Hub, Room 101",
    type: "college",
    description: "Annual university AI Hackathon final pitches and demo presentations. Showcase of Gemini and Firebase full-stack applications.",
    status: "ongoing",
    smartPrompts: ["Capture the energetic pitching team on stage", "Take a detailed macro shot of the prototype screen", "Record a 10-second reaction video of the judges smiling", "Snap a wide-angle photo of the entire audience cheering"],
    createdAt: new Date().toISOString()
  }, {
    id: "event-2",
    name: "Global Biotech Seminar",
    date: new Date(Date.now() + 864e5).toISOString().split("T")[0],
    time: "09:30",
    endTime: "18:00",
    location: "Grand Convention Center",
    type: "seminar",
    description: "Keynote sessions on modern genetic edits and biotech innovations. Attended by major international researchers.",
    status: "upcoming",
    smartPrompts: ["Take a portrait of the keynote speaker at the podium", "Capture networking interactions during the coffee break", "Snap the prominent research posters line-up"],
    createdAt: new Date().toISOString()
  }, {
    id: "event-3",
    name: "Fiona & David's Wedding",
    date: new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0],
    time: "17:00",
    endTime: "23:00",
    location: "The Rose Garden Sanctuary",
    type: "wedding",
    description: "A beautiful outdoor wedding ceremony followed by a grand evening banquet under the stars.",
    status: "upcoming",
    smartPrompts: ["Capture Fiona walking down the flower-petal aisle", "Snapshot of the couple's first toast together", "Take a fun, candid photo of guests dancing", "Emotional reaction of parents during the vows"],
    createdAt: new Date().toISOString()
  }],
  saveToStorage = (r, e) => {
    try {
      localStorage.setItem(`eventsync_${r}`, JSON.stringify(e));
    } catch (err) {
      console.warn("Storage quota exceeded", err.message || err);
      if (r === "media" && Array.isArray(e) && e.length > 5) {
        try {
          localStorage.setItem(`eventsync_${r}`, JSON.stringify(e.slice(-5)));
        } catch (e2) {}
      }
    }
  },
  getFromStorage = (r, e) => {
    const t = localStorage.getItem(`eventsync_${r}`);
    return t ? JSON.parse(t) : e;
  },
  getEvents = async () => {
    let up = null;
    try {
      up = JSON.parse(localStorage.getItem("eventsync_user_profile"));
    } catch (e) {}
    if (!up) return [];
    if (supabase) {
      try {
        const { data, error } = await supabase.from("events").select("*").eq("user_email", up.email);
        if (error) throw error;
        const t = data.map(row => ({ ...row.data, id: row.id, userEmail: row.user_email }));
        return saveToStorage("events", t), t;
      } catch (e) {
        console.warn("Supabase events error:", e);
      }
    }
    return getFromStorage("events", defaultEvents).filter(ev => ev.userEmail === up.email);
  },
  saveEvent = async r => {
    let up = null;
    try {
      up = JSON.parse(localStorage.getItem("eventsync_user_profile"));
    } catch (e) {}
    const e = r.id || `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      t = {
        ...r,
        id: e,
        createdAt: r.createdAt || new Date().toISOString(),
        userEmail: up ? up.email : ""
      };
    try {
      if (supabase) {
        await supabase.from("events").upsert({ id: e, user_email: t.userEmail, data: t });
      }
    } catch (u) {
      console.warn("Supabase event write failed, using local storage:", u);
    }
    const s = await getEvents(),
      a = s.findIndex(u => u.id === t.id);
    return a !== -1 ? s[a] = t : s.push(t), saveToStorage("events", s), t;
  },
  TC = async r => {
    if (supabase) {
      const { error } = await supabase.from("events").delete().eq("id", r);
      if (error) {
        console.warn("Supabase event delete failed:", error);
        throw error;
      }
    }
    const t = (await getEvents()).filter(s => s.id !== r);
    saveToStorage("events", t);
  },
  getMedia = async r => {
    let up = null;
    try {
      up = JSON.parse(localStorage.getItem("eventsync_user_profile"));
    } catch (e) {}
    if (!up) return [];
    if (supabase) {
      try {
        let q = supabase.from("media").select("*").eq("user_email", up.email);
        const { data, error } = await q;
        if (error) throw error;
        let u = data.map(row => ({ ...row.data, id: row.id, userEmail: row.user_email }));
        if (r) u = u.filter(m => m.eventId === r);
        return saveToStorage("media", u), u;
      } catch (t) {
        console.warn("Supabase media load error:", t);
      }
    }
    const e = getFromStorage("media", []);
    return (r ? e.filter(t => t.eventId === r) : e).filter(m => m.userEmail === up.email);
  },
  SC = async r => {
    let up = null;
    try {
      up = JSON.parse(localStorage.getItem("eventsync_user_profile"));
    } catch (e) {}
    const e = r.id || `med-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    let t = {
      ...r,
      id: e,
      userEmail: up ? up.email : "",
    };
    if (t.base64Data && typeof t.base64Data === "string" && t.base64Data.startsWith("data:")) {
      try {
        const mm = t.base64Data.match(/^data:([^;]+);base64,(.*)$/);
        if (mm) {
          const mime = mm[1];
          const res = await fetch(t.base64Data);
          const blob = await res.blob();
          const ext = mime.split("/")[1] || "bin";
          const path = `${t.userEmail || "anon"}/${e}.${ext}`;
          if (supabase) {
            const { error: upErr } = await supabase.storage
              .from(MEDIA_BUCKET)
              .upload(path, blob, {
                upsert: true,
                contentType: mime,
              });
            if (upErr) {
              console.warn("Supabase bucket upload warning:", upErr.message);
            } else {
              const { data: pub } = supabase.storage
                .from(MEDIA_BUCKET)
                .getPublicUrl(path);
              if (pub && pub.publicUrl) {
                t.base64Data = pub.publicUrl;
                t.url = pub.publicUrl;
                t.storagePath = path;
              }
            }
          }
        }
      } catch (se) {
        console.warn("Supabase storage upload error:", se);
      }
    }
    try {
      if (supabase) {
        const { error } = await supabase
          .from("media")
          .upsert({ id: e, user_email: t.userEmail, event_id: t.eventId || null, data: t });
        if (error) throw error;
      }
    } catch (u) {
      console.warn("Supabase media write error:", u);
      throw u;
    }
    const s = getFromStorage("media", []),
      a = s.findIndex(u => u.id === t.id);
    return a !== -1 ? s[a] = t : s.push(t), saveToStorage("media", s), t;
  },
  NC = async r => {
    try {
      const cur = getFromStorage("media", []).find(m => m.id === r);
      if (cur && cur.storagePath && supabase) {
        await supabase.storage
          .from(MEDIA_BUCKET)
          .remove([cur.storagePath]);
      }
    } catch (se) {}
    if (supabase) {
      const { error } = await supabase.from("media").delete().eq("id", r);
      if (error) {
        console.warn("Supabase media delete error:", error);
        throw error;
      }
    }
    const t = getFromStorage("media", []).filter(s => s.id !== r);
    saveToStorage("media", t);
  },
  getCaptions = async () => {
    let up = null;
    try {
      up = JSON.parse(localStorage.getItem("eventsync_user_profile"));
    } catch (e) {}
    if (!up) return [];
    if (supabase) {
      try {
        const { data, error } = await supabase.from("captions").select("*").eq("user_email", up.email);
        if (error) throw error;
        const u = data.map(row => ({ ...row.data, id: row.id, userEmail: row.user_email }));
        return saveToStorage("captions", u), u;
      } catch (t) {
        console.warn("Supabase captions load error:", t);
      }
    }
    const e = getFromStorage("captions", []);
    return e.filter(m => m.userEmail === up.email);
  },
  RC = async r => {
    let up = null;
    try {
      up = JSON.parse(localStorage.getItem("eventsync_user_profile"));
    } catch (e) {}
    const e = r.id || `cap-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      t = {
        ...r,
        id: e,
        userEmail: up ? up.email : ""
      };
    try {
      if (supabase) {
        await supabase.from("captions").upsert({ id: e, user_email: t.userEmail, data: t });
      }
    } catch (u) {
      console.warn("Supabase caption write error:", u);
    }
    const s = getFromStorage("captions", []),
      a = s.findIndex(u => u.id === t.id);
    return a !== -1 ? s[a] = t : s.push(t), saveToStorage("captions", s), t;
  },
  getNotifications = () => getFromStorage("notifications", [{
    id: "notif-1",
    eventId: "event-1",
    eventName: "AI Hackathon Demo Day",
    title: "Smart Camera Prompt!",
    message: "👉 Capture the energetic pitching team on stage! Let's get a picture with the team pointing at the screen.",
    timestamp: new Date(Date.now() - 3e5).toISOString(),
    type: "prompt",
    isRead: !1,
    promptAction: "capture"
  }, {
    id: "notif-2",
    eventId: "event-2",
    eventName: "Global Biotech Seminar",
    title: "Upcoming Event Sync",
    message: "The Biotech Seminar starts tomorrow at 09:30. Ensure your templates are set for professional LinkedIn postings.",
    timestamp: new Date(Date.now() - 36e5).toISOString(),
    type: "info",
    isRead: !0
  }]),
  setNotifications = r => {
    saveToStorage("notifications", r);
  };

export const getPosts = async () => {
  let up = null;
  try {
    up = JSON.parse(localStorage.getItem("eventsync_user_profile"));
  } catch (e) {}
  if (!up) return [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_email", up.email)
        .order("created_at", { ascending: false });
      if (!error && data) {
        const u = data.map(row => ({
          ...row.data,
          id: row.id,
          userEmail: row.user_email,
          createdAt: row.created_at || (row.data && row.data.createdAt),
        }));
        saveToStorage("posts_history", u);
        return u;
      }
    } catch (t) {
      console.warn("Supabase posts load error:", t);
    }
  }
  const e = getFromStorage("posts_history", []);
  return e
    .filter(m => m.userEmail === (up ? up.email : ""))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

export const savePostRecord = async (postData) => {
  let up = null;
  try {
    up = JSON.parse(localStorage.getItem("eventsync_user_profile"));
  } catch (e) {}
  const id = postData.id || `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const record = {
    ...postData,
    id,
    userEmail: up ? up.email : (postData.userEmail || ""),
    createdAt: postData.createdAt || new Date().toISOString(),
  };
  if (supabase) {
    try {
      await supabase.from("posts").upsert({
        id,
        user_email: record.userEmail,
        data: record,
        created_at: record.createdAt,
      });
    } catch (u) {
      console.warn("Supabase post record write error:", u);
    }
  }
  const s = getFromStorage("posts_history", []);
  const idx = s.findIndex(u => u.id === record.id);
  if (idx !== -1) {
    s[idx] = record;
  } else {
    s.unshift(record);
  }
  saveToStorage("posts_history", s);
  return record;
};
