import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function profileFromUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.user_metadata?.full_name || user.email.split("@")[0],
    email: user.email,
    role: "User",
    image: user.user_metadata?.avatar_url || null,
  };
}

if (supabase) {
  window.supabaseAuth = {
    login: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }).then(({ error }) => {
        if (error) throw error;
      }),
    signup: (email, password) =>
      supabase.auth.signUp({ email, password }).then(({ error }) => {
        if (error) throw error;
      }),
    googleLogin: () => supabase.auth.signInWithOAuth({ provider: "google" }),
    logout: () => supabase.auth.signOut(),
    updateProfile: (name, image) =>
      supabase.auth.updateUser({ data: { full_name: name, avatar_url: image } }),
    onAuthStateChanged: (callback) => {
      supabase.auth.getSession().then(({ data }) => {
        callback(profileFromUser(data.session?.user));
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(profileFromUser(session?.user));
      });
      return () => sub.subscription.unsubscribe();
    },
  };
} else {
  let currentUser = null;
  window.supabaseAuth = {
    login: async (email, password) => {
      currentUser = { email, user_metadata: { full_name: email.split("@")[0] } };
      localStorage.setItem("eventsync_dummy_user", JSON.stringify(currentUser));
      if (window._authStateChanged) window._authStateChanged(profileFromUser(currentUser));
    },
    signup: async (email, password) => {
      currentUser = { email, user_metadata: { full_name: email.split("@")[0] } };
      localStorage.setItem("eventsync_dummy_user", JSON.stringify(currentUser));
      if (window._authStateChanged) window._authStateChanged(profileFromUser(currentUser));
    },
    googleLogin: async () => {
      currentUser = { email: "bsam64808@gmail.com", user_metadata: { full_name: "Bsam User", avatar_url: null } };
      localStorage.setItem("eventsync_dummy_user", JSON.stringify(currentUser));
      if (window._authStateChanged) window._authStateChanged(profileFromUser(currentUser));
    },
    logout: async () => {
      currentUser = null;
      localStorage.removeItem("eventsync_dummy_user");
      if (window._authStateChanged) window._authStateChanged(null);
    },
    updateProfile: async (name, image) => {
      if (currentUser) {
        currentUser.user_metadata = { full_name: name, avatar_url: image };
        localStorage.setItem("eventsync_dummy_user", JSON.stringify(currentUser));
        if (window._authStateChanged) window._authStateChanged(profileFromUser(currentUser));
      }
    },
    onAuthStateChanged: (callback) => {
      window._authStateChanged = callback;
      const stored = localStorage.getItem("eventsync_dummy_user");
      if (stored) {
        currentUser = JSON.parse(stored);
        setTimeout(() => callback(profileFromUser(currentUser)), 0);
      } else {
        setTimeout(() => callback(null), 0);
      }
      return () => { window._authStateChanged = null; };
    }
  };
}