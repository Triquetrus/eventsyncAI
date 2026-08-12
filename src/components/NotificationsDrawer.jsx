import React from "react";
import { Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Calendar, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Unlink, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function NotificationsDrawer({
  notifications: r,
  isOpen: e,
  onClose: t,
  onMarkRead: s,
  onMarkAllRead: a,
  onClearNotification: u,
  onActionTrigger: c,
  userProfile,
  onOpenProfile: op,
}) {
  const [alarmPermitted, setAlarmPermitted] = React.useState(() => {
    return localStorage.getItem("eventsync_alarm") === "true";
  });
  React.useEffect(() => {
    window.__alarmEnabled = alarmPermitted;
  }, [alarmPermitted]);
  const toggleAlarm = () => {
    const newVal = !alarmPermitted;
    window.__alarmEnabled = newVal;
    localStorage.setItem("eventsync_alarm", newVal);
    setAlarmPermitted(newVal);
    if (newVal) {
      if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission().then(() => {
          window.__initPush();
        });
      }
      if (window.__playAlarmSound) window.__playAlarmSound();
    }
  };
  if (!e) return null;
  const p = r.filter((g) => !g.isRead).length;
  return (
    <div
      id="notif-drawer-overlay"
      className="fixed inset-0 bg-black/30 z-50 flex justify-end backdrop-blur-xs"
    >
      {
        <div
          id="notif-drawer"
          className="w-full max-w-md bg-white border-l border-pink-100 h-screen flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250"
        >
          {
            <div className="p-5 border-b border-pink-50 flex items-center justify-between">
              {
                <div className="flex items-center gap-2.5">
                  {
                    <button
                      onClick={() => {
                        if (op) op();
                      }}
                      className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-md overflow-hidden cursor-pointer"
                    >
                      {userProfile?.image ? (
                        <img
                          src={userProfile.image}
                          className="w-full h-full object-cover"
                        />
                      ) : userProfile?.name ? (
                        userProfile.name.charAt(0)
                      ) : (
                        "A"
                      )}
                    </button>
                  }
                  {
                    <div className="relative">
                      {<Bell className="w-5 h-5 text-pink-500" />}
                      {p > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  }
                  {
                    <div>
                      {
                        <h3 className="font-extrabold text-gray-900 text-base">
                          Campaign Reminders
                        </h3>
                      }
                      {
                        <p className="text-[10px] text-pink-600 uppercase font-mono tracking-wider">
                          EventSync Assistant
                        </p>
                      }
                    </div>
                  }
                </div>
              }
              {
                <div className="flex gap-2 items-center">
                  {
                    <button
                      onClick={toggleAlarm}
                      className={
                        "flex items-center gap-1 p-1.5 px-2 rounded-lg border border-pink-100 cursor-pointer transition-colors text-[10px] uppercase font-bold " +
                        (alarmPermitted
                          ? "text-pink-600 bg-pink-50"
                          : "text-gray-400 hover:bg-pink-50/50")
                      }
                    >
                      {alarmPermitted ? "🔊" : "🔈"}
                      {<span>{alarmPermitted ? "Alarm On" : "Alarm Off"}</span>}
                    </button>
                  }
                  {
                    <button
                      onClick={t}
                      className="p-1.5 rounded-lg border border-pink-100 text-gray-400 hover:text-pink-600 hover:bg-pink-50/50 cursor-pointer transition-colors"
                    >
                      {<X className="w-4 h-4" />}
                    </button>
                  }
                </div>
              }
            </div>
          }
          {r.length > 0 && (
            <div className="px-5 py-3 bg-pink-50/10 border-b border-pink-50 flex justify-between items-center text-xs">
              {
                <span className="text-gray-500 font-medium">
                  {p} unread reminders
                </span>
              }
              {
                <button
                  onClick={a}
                  className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {<CheckCheck className="w-3.5 h-3.5" />}
                  {<span>Mark all as read</span>}
                </button>
              }
            </div>
          )}
          {
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {r.map((g) => (
                <div key={g.id}
                  onClick={() => !g.isRead && s(g.id)}
                  className={`p-4 rounded-xl border transition-all ${g.isRead ? "bg-pink-50/10 border-pink-50/50 opacity-75 hover:opacity-100" : "bg-pink-50/30 border-pink-100/60 shadow-sm shadow-pink-500/[0.02]"}`}
                >
                  {
                    <div className="flex justify-between items-start gap-2.5 mb-2">
                      {
                        <span
                          className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${g.type === "prompt" ? "bg-amber-550/10 text-amber-700 bg-amber-50 border border-amber-100" : g.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-pink-100/50 text-pink-700 border border-pink-200"}`}
                        >
                          {g.type === "prompt"
                            ? "SMART PROMPT"
                            : "EVENT ALERTS"}
                        </span>
                      }
                      {
                        <button
                          onClick={(y) => {
                            (y.stopPropagation(), u(g.id));
                          }}
                          className="text-gray-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                          title="Dismiss"
                        >
                          {<Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      }
                    </div>
                  }
                  {
                    <h4 className="font-bold text-sm text-gray-800">
                      {g.title}
                    </h4>
                  }
                  {
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {g.message}
                    </p>
                  }
                  {g.eventName && (
                    <span className="inline-block text-[10px] text-pink-600 font-mono mt-2 bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                      📍 {g.eventName}
                    </span>
                  )}
                  {g.type === "prompt" && g.eventId && (
                    <div className="mt-3.5 pt-3 border-t border-pink-50 flex justify-end">
                      {g.promptAction === "capture" ? (
                        <button
                          onClick={(y) => {
                            (y.stopPropagation(),
                              s(g.id),
                              c(g.eventId, "capture", g.message));
                          }}
                          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-pink-500/10"
                        >
                          {<Camera className="w-3.5 h-3.5" />}
                          {<span>Launch Camera</span>}
                        </button>
                      ) : (
                        <button
                          onClick={(y) => {
                            (y.stopPropagation(),
                              s(g.id),
                              c(g.eventId, "select"));
                          }}
                          className="bg-pink-50 hover:bg-pink-100/60 text-pink-600 border border-pink-100 font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {<FolderHeart className="w-3.5 h-3.5" />}
                          {<span>Go to folder</span>}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {r.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
                  {<Bell className="w-12 h-12 text-pink-200 mb-3" />}
                  {
                    <p className="text-gray-500 font-medium">
                      No alerts or reminders
                    </p>
                  }
                  {
                    <p className="text-xs text-gray-400 max-w-xs mt-1">
                      Smart prompts and scheduled calendar triggers appear here
                      during active event timelines.
                    </p>
                  }
                </div>
              )}
            </div>
          }
          {
            <div className="p-5 border-t border-pink-50 bg-pink-50/10 text-xs text-gray-500">
              {
                <div className="flex gap-2">
                  {<Clock className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />}
                  {
                    <p className="leading-normal">
                      Our background assistant checks your active event rosters
                      and feeds reminders 1 day before, 2 hours before, and live
                      smart prompt items during execution.
                    </p>
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
export default NotificationsDrawer;
