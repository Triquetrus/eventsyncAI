const EC = [];
const bC = [];
const AC = [];
const CC = [];
import React from "react";
import {
  Bell,
  BookmarkCheck,
  Bookmark,
  Briefcase,
  CalendarDays,
  Calendar,
  Camera,
  CheckCheck,
  Check,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Copy,
  MoreHorizontal,
  Eye,
  Facebook,
  FolderHeart,
  GraduationCap,
  Globe,
  Heart,
  Image,
  Info,
  Instagram,
  LayoutDashboard,
  Linkedin,
  ListTodo,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Plus,
  Repeat,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkle,
  Sparkles,
  SquarePen,
  Star,
  ThumbsUp,
  Trash2,
  Unlink,
  Upload,
  UserPlus,
  UserRoundCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import "./lib/supabaseClient";
import Sidebar from "./components/Sidebar";
import UserProfile from "./components/UserProfile";
import DashboardTab from "./components/DashboardTab";
import EventsTab from "./components/EventsTab";
import MediaGalleryTab from "./components/MediaGalleryTab";
import CaptionStudioTab from "./components/CaptionStudioTab";
import ConnectedAccountsTab from "./components/ConnectedAccountsTab";
import NotificationsDrawer from "./components/NotificationsDrawer";
import GenAITools from "./components/GenAITools";
import VeoMergeTool from "./components/VeoMergeTool";
import AnalyzeVideoTool from "./components/AnalyzeVideoTool";
import ImageEditTool from "./components/ImageEditTool";
import ImageGenerationTool from "./components/ImageGenerationTool";
import {
  getEvents,
  saveEvent,
  defaultEvents,
  getMedia,
  getCaptions,
  getNotifications, SC, TC, NC,
  saveToStorage,
  getFromStorage,
  setNotifications,
} from "./lib/db";
function App() {
  if (import.meta.env.DEV) {
    console.log("[DEBUG] App render", Date.now());
  }
  const [up, setUp] = React.useState(() => {
    const saved = localStorage.getItem("eventsync_user_profile");
    return saved ? JSON.parse(saved) : null;
  });
  const saveProfile = (newProfile) => {
    if (!newProfile) {
      setUp(null);
      localStorage.removeItem("eventsync_user_profile");
      return;
    }
    setUp((prev) => {
      if (
        prev &&
        prev.email === newProfile.email &&
        prev.name === newProfile.name &&
        prev.image === newProfile.image &&
        prev.role === newProfile.role
      ) {
        return prev;
      }
      localStorage.setItem("eventsync_user_profile", JSON.stringify(newProfile));
      return newProfile;
    });
  };
  const [r, e] = React.useState("dashboard"),
    [t, s] = React.useState([]),
    [a, u] = React.useState([]),
    [c, p] = React.useState([]),
    [g, y] = React.useState(() => {
      const J = localStorage.getItem("eventsync_social_accounts");
      return J ? JSON.parse(J) : EC;
    }),
    [E, w] = React.useState([]),
    [I, V] = React.useState(!1),
    [z, te] = React.useState(!1),
    [oe, pe] = React.useState([]),
    [Te, Ee] = React.useState(""),
    [me, Re] = React.useState(""),
    [be, k] = React.useState(""),
    [eventsFilter, setEventsFilter] = React.useState("all");

  const notificationsRef = React.useRef(E);
  notificationsRef.current = E;

  React.useEffect(() => {
    (async () => {
      if (!up) return;
      try {
        const ue = await getEvents();
        s(ue.filter((ev) => ev.userEmail === (up ? up.email : null)));
        const he = await getMedia();
        u(
          he.filter((m) =>
            ue
              .filter((ev) => ev.userEmail === (up ? up.email : null))
              .some((ev) => ev.id === m.eventId),
          ),
        );
        const we = await getCaptions();
        p(
          we.filter((c) =>
            ue
              .filter((ev) => ev.userEmail === (up ? up.email : null))
              .some((ev) => ev.id === c.eventId),
          ),
        );
        const Be = getNotifications();
        w(Be);
      } catch (ue) {
        console.warn("Error loading application data:", ue);
      }
    })();
  }, []);
  React.useEffect(() => {
    const timerId = setInterval(() => {
      if (!t || t.length === 0) return;
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentHour = String(now.getHours()).padStart(2, "0");
      const currentMin = String(now.getMinutes()).padStart(2, "0");
      const currentTime = currentHour + ":" + currentMin;
      t.forEach((evt) => {
        if (evt.date && evt.time) {
          const evtDateTime = new Date(`${evt.date}T${evt.time}`);
          const diffMs = now.getTime() - evtDateTime.getTime(); // 12 hours in ms = 12 * 60 * 60 * 1000 = 43200000
          if (diffMs >= 43200000) {
            // Delete expired event
            if (typeof TC === "function") {
              TC(evt.id).catch((e) =>
                console.warn("Failed deleting expired event", e),
              );
            }
            s((prev) => prev.filter((x) => x.id !== evt.id));
            w((prev) => {
              const updated = prev.filter((n) => n.eventId !== evt.id);
              typeof setNotifications === "function" &&
                setNotifications(updated);
              return updated;
            });
            return;
          }
        }
        if (evt.date === currentDate && evt.time === currentTime) {
          // Check if we already notified for this event recently using notificationsRef
          const currentNotifs = notificationsRef.current || [];
          const alreadyNotified = currentNotifs.find(
            (n) =>
              n.eventId === evt.id &&
              n.type === "alarm" &&
              now.getTime() - new Date(n.timestamp).getTime() < 60000,
          );
          if (!alreadyNotified) {
            if (window.__alarmEnabled && window.__playAlarmSound)
              window.__playAlarmSound();
            w((prev) => {
              const newNotif = {
                id: `notif-${Date.now()}`,
                eventId: evt.id,
                eventName: evt.name,
                title: "Event Starting Reminder!",
                message: `Reminder: ${evt.name} is scheduled for now (${evt.time}) at ${evt.location || "the location"}.`,
                timestamp: now.toISOString(),
                type: "alarm",
                isRead: false,
              };
              const updated = [newNotif, ...prev];
              typeof setNotifications === "function" &&
                setNotifications(updated);
              return updated;
            });
          }
        }
      });
    }, 15000);
    return () => clearInterval(timerId);
  }, [t]);
  React.useEffect(() => {
    if (window.__syncEventsWithBackend) {
      window.__syncEventsWithBackend(t);
    }
  }, [t]);
  React.useEffect(() => {
    const timerId = setInterval(() => {
      if (!t || t.length === 0) return;
      const now = new Date();
      let changed = false;
      const updatedEvents = t.map((evt) => {
        if (!evt.date) return evt;
        const timeStr = evt.time || "00:00";
        const start = new Date(`${evt.date}T${timeStr}:00`);
        if (isNaN(start.getTime())) return evt;

        let end;
        if (evt.endTime) {
          end = new Date(`${evt.date}T${evt.endTime}:00`);
          if (isNaN(end.getTime())) end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
          else if (end < start) end.setDate(end.getDate() + 1);
        } else {
          end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
        }

        const nowTime = now.getTime();
        let newStatus = evt.status;
        if (nowTime >= start.getTime() && nowTime <= end.getTime()) {
          if (evt.status === "upcoming") newStatus = "ongoing";
        } else if (nowTime > end.getTime()) {
          const isAtLeastOneDayOld = (nowTime - end.getTime()) > 24 * 60 * 60 * 1000;
          if (evt.status === "upcoming" || (evt.status === "ongoing" && isAtLeastOneDayOld)) {
            newStatus = "completed";
          }
        }

        if (newStatus !== evt.status) {
          changed = true;
          return {
            ...evt,
            status: newStatus,
          };
        }
        return evt;
      });
      if (changed) {
        s(updatedEvents);
      }
    }, 10000);
    return () => clearInterval(timerId);
  }, [t]);
  const C = async (J) => {
      try {
        const ue = await saveEvent(J);
        if (
          (s((he) => {
            const we = he.findIndex((Be) => Be.id === ue.id);
            if (we !== -1) {
              const Be = [...he];
              return ((Be[we] = ue), Be);
            }
            return [...he, ue];
          }),
          !J.id)
        ) {
          const he = {
            id: `notif-${Date.now()}`,
            eventId: ue.id,
            eventName: ue.name,
            title: "New Sync Schedule Activated!",
            message: `EventSync is ready for ${ue.name}. Start uploading campaign assets.`,
            timestamp: new Date().toISOString(),
            type: "success",
            isRead: !1,
          };
          if (window.__alarmEnabled && window.__playAlarmSound)
            window.__playAlarmSound();
          w((we) => {
            const Be = [he, ...we];
            return (setNotifications(Be), Be);
          });
        }
      } catch (ue) {
        console.warn("Failed to save event:", ue);
      }
    },
    O = async (J) => {
      let originalEvents;
      s((prev) => {
        originalEvents = prev;
        return prev.filter((he) => he.id !== J);
      });
      try {
        await TC(J);
      } catch (ue) {
        console.warn("Failed to delete event:", ue);
        if (originalEvents) s(originalEvents);
        alert(`Failed to delete event: ${ue.message || "Database error"}`);
      }
    },
    L = async (J) => {
      try {
        const ue = await SC(J);
        u((he) => {
          const we = he.findIndex((Be) => Be.id === ue.id);
          if (we !== -1) {
            const Be = [...he];
            return ((Be[we] = ue), Be);
          }
          return [...he, ue];
        });
        return ue;
      } catch (err) {
        console.error("Failed to save media:", err);
        alert(`Failed to save media: ${err.message || err.error_description || "Database or Storage error"}`);
        throw err;
      }
    },
    M = async (J) => {
      let originalMedia;
      u((prev) => {
        originalMedia = prev;
        return prev.filter((he) => he.id !== J);
      });
      try {
        await NC(J);
      } catch (ue) {
        console.warn("Failed to delete media:", ue);
        if (originalMedia) u(originalMedia);
        alert(`Failed to delete media: ${ue.message || "Database error"}`);
      }
    },
    P = async (J) => {
      try {
        const ue = await RC(J);
        p((we) => {
          const Be = we.findIndex((ct) => ct.id === ue.id);
          if (Be !== -1) {
            const ct = [...we];
            return ((ct[Be] = ue), ct);
          }
          return [ue, ...we];
        });
        const he = {
          id: `notif-${Date.now()}`,
          eventId: J.eventId,
          title: "Platform Post Shared!",
          message: `Direct campaign post has been uploaded successfully to your linked ${J.platform} page.`,
          timestamp: new Date().toISOString(),
          type: "success",
          isRead: !1,
        };
        if (window.__alarmEnabled && window.__playAlarmSound)
          window.__playAlarmSound();
        w((we) => {
          const Be = [he, ...we];
          return (setNotifications(Be), Be);
        });
      } catch (ue) {
        console.warn("Failed to save caption draft:", ue);
      }
    },
    R = (J, apiKey, apiSecret) => {
      y((ue) => {
        const he = ue.map((we) => {
          if (we.platform === J) {
            const Be = !we.isConnected;
            return {
              ...we,
              isConnected: Be,
              username: Be ? "eventsync.user" : "",
              apiKey: apiKey || we.apiKey || "",
              apiSecret: apiSecret || we.apiSecret || "",
            };
          }
          return we;
        });
        return (
          localStorage.setItem("eventsync_social_accounts", JSON.stringify(he)),
          he
        );
      });
    },
    rt = (J) => {
      w((ue) => {
        const he = ue.map((we) =>
          we.id === J
            ? {
                ...we,
                isRead: !0,
              }
            : we,
        );
        return (setNotifications(he), he);
      });
    },
    pt = () => {
      w((J) => {
        const ue = J.map((he) => ({
          ...he,
          isRead: !0,
        }));
        return (setNotifications(ue), ue);
      });
    },
    clearNotif = (J) => {
      w((ue) => {
        const he = ue.filter((we) => we.id !== J);
        return (setNotifications(he), he);
      });
    },
    ce = (J, ue, he) => {
      (Re(J), k(he || ""), e("gallery"), V(!1));
    },
    ne = (J, ue) => {
      // J is array of media objects, ue is eventId
      if (Array.isArray(J)) {
        pe(J);
        Ee(ue);
      } else {
        // Fallback if called with (eventId, mediaId)
        const selectedMediaObj = a.find((m) => m.id === ue);
        pe(selectedMediaObj ? [selectedMediaObj] : []);
        Ee(J);
      }
      e("captions");
    },
    De = (J, ue) => {
      (Re(J), k(ue || ""), e("gallery"));
    },
    Xe = () => {
      e("events");
    },
    N = E.filter((J) => !J.isRead).length,
    G = t.find((J) => J.status === "ongoing"),
    le = G == null ? void 0 : G.name;
  const [isLoginView, setIsLoginView] = React.useState(true);
  const [authError, setAuthError] = React.useState("");
  React.useEffect(() => {
    if (window.supabaseAuth) {
      const unsubscribe = window.supabaseAuth.onAuthStateChanged((user) => {
        if (user) {
          saveProfile({
            name: user.name || user.email.split("@")[0],
            email: user.email,
            role: "User",
            image: user.image,
          });
        } else {
          setUp(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);
  if (!up) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-50 to-rose-50 -skew-y-6 transform origin-top-left -z-10" />
        }
        {
          <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
            {
              <div className="flex flex-col items-center justify-center mb-8">
                {
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-pink-500/30">
                    {
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        {
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        }
                      </svg>
                    }
                  </div>
                }
                {
                  <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    {isLoginView ? "Sign in to EventSync" : "Create an account"}
                  </h2>
                }
                {
                  <p className="mt-2 text-center text-sm text-gray-500">
                    {isLoginView
                      ? "Welcome back! Please enter your details."
                      : "Get started managing events with AI."}
                  </p>
                }
              </div>
            }
            {
              <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
                {
                  <div>
                    {authError ? (
                      <div className="mb-6 text-sm font-medium text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-2">
                        {authError}
                      </div>
                    ) : null}
                    {
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setAuthError("");
                          const email = e.target.email.value;
                          const password = e.target.password.value;
                          if (isLoginView) {
                            window.supabaseAuth
                              .login(email, password)
                              .catch((err) => setAuthError(err.message));
                          } else {
                            window.supabaseAuth
                              .signup(email, password)
                              .catch((err) => setAuthError(err.message));
                          }
                        }}
                      >
                        {
                          <div className="space-y-5">
                            {
                              <div>
                                {
                                  <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                  >
                                    Email address
                                  </label>
                                }
                                {
                                  <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required={true}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white"
                                  />
                                }
                              </div>
                            }
                            {
                              <div>
                                {
                                  <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                  >
                                    Password
                                  </label>
                                }
                                {
                                  <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required={true}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white"
                                  />
                                }
                              </div>
                            }
                            {
                              <div className="pt-2">
                                {
                                  <button
                                    type="submit" 
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-black bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all transform hover:-translate-y-0.5"
                                  >
                                    {isLoginView ? "Sign in" : "Create account"}
                                  </button>
                                }
                              </div>
                            }
                          </div>
                        }
                      </form>
                    }
                    {
                      <div className="mt-8">
                        {
                          <div className="relative">
                            {
                              <div className="absolute inset-0 flex items-center">
                                {
                                  <div className="w-full border-t border-gray-200" />
                                }
                              </div>
                            }
                            {
                              <div className="relative flex justify-center text-sm">
                                {
                                  <span className="px-4 bg-white text-gray-500 font-medium">
                                    or continue with
                                  </span>
                                }
                              </div>
                            }
                          </div>
                        }
                        {
                          <div className="mt-6">
                            {
                              <button
                                onClick={() =>
                                  window.supabaseAuth
                                    .googleLogin()
                                    .catch((err) => setAuthError(err.message))
                                }
                                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all cursor-pointer"
                              >
                                {
                                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                    <path
                                      fill="#4285F4"
                                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                      fill="#34A853"
                                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                      fill="#FBBC05"
                                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                      fill="#EA4335"
                                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                  </svg>
                                }
                                {isLoginView ? "Sign in with Google" : "Sign up with Google"}
                              </button>
                            }
                          </div>
                        }
                      </div>
                    }
                    {
                      <div className="mt-8 text-center text-sm">
                        {
                          <span className="text-gray-500">
                            {isLoginView
                              ? "Don't have an account? "
                              : "Already have an account? "}
                          </span>
                        }
                        {
                          <button
                            onClick={() => {
                              setIsLoginView(!isLoginView);
                              setAuthError("");
                            }}
                            className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
                          >
                            {isLoginView ? "Sign up" : "Sign in"}
                          </button>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    );
  }
  return (
    <div
      id="eventsync-app-root"
      className="flex flex-col md:flex-row bg-[#fafafa] text-gray-800 h-screen overflow-hidden font-sans "
    >
      {
        <Sidebar
          userProfile={up}
          currentTab={r}
          setCurrentTab={(J, extra) => {
            (e(J), te(!1), J !== "gallery" && k(""));
            if (J === "events" && extra) setEventsFilter(extra);
            else if (J === "events") setEventsFilter("all");
          }}
          unreadCount={N}
          activeEventName={le}
          onOpenNotifications={() => {
            (V(!0), te(!1));
          }}
          isMobileOpen={z}
          onCloseMobile={() => te(!1)}
        />
      }
      {z && (
        <div
          className="fixed inset-0 z-[9940] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => te(false)}
          aria-hidden="true"
        />
      )}
      {
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-pink-100 shrink-0 sticky top-0 z-[9945] shadow-sm">
          {
            <div className="flex items-center gap-3">
              {
                <button
                  onClick={() => te((isOpen) => !isOpen)}
                  className="text-gray-600 hover:text-pink-600 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
                  aria-label="Toggle navigation menu"
                  aria-expanded={z}
                  aria-controls="sidebar-container"
                >
                  {z ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              }
              {
                <div className="flex items-center gap-2">
                  {
                    <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                      {<Zap className="w-4 h-4 text-white" />}
                    </div>
                  }
                  {
                    <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
                      EventSync AI
                    </span>
                  }
                </div>
              }
            </div>
          }
          {
            <div className="flex items-center gap-4">
              {
                <button
                  onClick={() => V(!0)}
                  className="relative p-2 text-gray-600 hover:text-pink-600 cursor-pointer"
                >
                  {<Bell className="w-5 h-5" />}
                  {N > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border border-white rounded-full" />
                  )}
                </button>
              }
              {
                <button
                  onClick={() => {
                    e("profile");
                    te(!1);
                  }}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-md overflow-hidden cursor-pointer"
                >
                  {up?.image ? (
                    <img
                      src={up.image}
                      className="w-full h-full object-cover"
                    />
                  ) : up?.name ? (
                    up.name.charAt(0)
                  ) : (
                    "A"
                  )}
                </button>
              }
            </div>
          }
        </header>
      }
      {
        <main
          id="app-workspace-viewport"
          className="flex-1 flex flex-col relative min-w-0 bg-[#fafafa] overflow-y-auto"
        >
          {r === "dashboard" && (
            <DashboardTab
              userProfile={up}
              events={t}
              media={a}
              captions={c}
              onNavigateToTab={(J) => {
                (e(J), J !== "gallery" && k(""));
              }}
              onSelectEventForCamera={De}
              onCreateEventClick={Xe}
            />
          )}
          {r === "profile" && (
            <UserProfile
              profile={up}
              setProfile={saveProfile}
              accounts={g}
              onToggleConnect={R}
            />
          )}
          {r === "events" && (
            <EventsTab
              events={t}
              onSaveEvent={C}
              onDeleteEvent={O}
              filter={eventsFilter}
              setFilter={setEventsFilter}
            />
          )}
          {r === "gallery" && (
            <MediaGalleryTab
              events={t}
              media={a}
              onSaveMedia={L}
              onDeleteMedia={M}
              onTriggerCaptionFromMedia={ne}
              presetEventId={me}
              presetPromptText={be}
            />
          )}
          {r === "captions" && (
            <CaptionStudioTab
              events={t}
              media={a}
              onSaveCaption={P}
              preselectedMedia={oe}
              preselectedEventId={Te}
              onNavigateToTab={(J) => {
                (e(J), J !== "gallery" && k(""));
              }}
            />
          )}
          {r === "genai" && (
            <GenAITools
              onNavigateToTab={(J) => {
                e(J);
                J !== "gallery" && k("");
              }}
              onSaveMedia={L}
              onTriggerCaptionFromMedia={ne}
              events={t}
              allMedia={a}
            />
          )}
        </main>
      }
      {
        <NotificationsDrawer
          userProfile={up}
          onOpenProfile={() => {
            e("profile");
            V(!1);
          }}
          notifications={E}
          isOpen={I}
          onClose={() => V(!1)}
          onMarkRead={rt}
          onMarkAllRead={pt}
          onClearNotification={clearNotif}
          onActionTrigger={ce}
        />
      }
    </div>
  );
}
export default App;


