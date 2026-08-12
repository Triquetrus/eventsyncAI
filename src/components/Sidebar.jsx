import React from "react";
import { Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Calendar, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Unlink, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function Sidebar({
  currentTab: r,
  setCurrentTab: e,
  userProfile,
  unreadCount: t,
  activeEventName: s,
  onOpenNotifications: a,
  isMobileOpen: u = !1,
  onCloseMobile: c,
}) {
  const p = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "events",
      label: "Events & Prompts",
      icon: CalendarDays,
    },
    {
      id: "gallery",
      label: "Media & Studio",
      icon: Image,
    },
    {
      id: "genai",
      label: "AI Media Generator",
      icon: Sparkles,
    },
    {
      id: "captions",
      label: "AI Caption Studio",
      icon: Sparkles,
    },
  ];
  return (
    <aside
      id="sidebar-container"
      className={`
        ${u ? "flex" : "hidden"} md:flex
        fixed md:sticky top-0 bottom-0 left-0 z-50 w-64 bg-white overflow-y-auto border-r border-pink-100 flex-col h-screen shrink-0 md:top-0
      `}
    >
      {
        <div
          id="brand-header"
          className="p-6 border-b border-pink-100/80 flex items-center justify-between"
        >
          {
            <div className="flex items-center gap-3">
              {
                <div
                  id="logo-icon-container"
                  className="w-10 h-10 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/10"
                >
                  {
                    <Zap
                      className="w-5 h-5 text-white"
                      id="logo-icon-lightning"
                    />
                  }
                </div>
              }
              {
                <div>
                  {
                    <h1
                      id="brand-title"
                      className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-amber-600 bg-clip-text text-transparent"
                    >
                      EventSync AI
                    </h1>
                  }
                  {
                    <p
                      id="brand-subtitle"
                      className="text-[10px] text-pink-500 font-mono tracking-wider uppercase"
                    >
                      Social Assistant
                    </p>
                  }
                </div>
              }
            </div>
          }
          {
            <button
              onClick={c}
              className="md:hidden text-gray-400 hover:text-pink-600 p-1.5 rounded-lg border border-pink-100 hover:bg-pink-50/50 cursor-pointer"
              aria-label="Close sidebar menu"
            >
              {<X className="w-4 h-4" />}
            </button>
          }
        </div>
      }
      {s && (
        <div
          id="sidebar-active-event-card"
          className="mx-4 mt-4 p-3 bg-gradient-to-r from-pink-50 to-rose-50/50 border border-pink-100 rounded-xl flex flex-col gap-1 animate-glow"
        >
          {
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-600">
              {
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              }
              ACTIVE EVENT NOW
            </div>
          }
          {<p className="text-xs text-gray-700 font-medium truncate">{s}</p>}
        </div>
      )}
      {
        <nav
          id="sidebar-nav"
          className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto"
        >
          {p.map((g) => {
            const Icon = g.icon,
              E = r === g.id;
            return (
              <button key={g.id}
                id={`nav-btn-${g.id}`}
                onClick={() => e(g.id)}
                className={`w-full shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${E ? "bg-pink-50 text-pink-600 font-bold border-l-4 border-pink-500 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-pink-600"}`}
              >
                {
                  <div className="flex items-center gap-3">
                    {
                      <Icon
                        className={`w-4.5 h-4.5 ${E ? "text-pink-600" : "text-gray-400"}`}
                      />
                    }
                    {<span>{g.label}</span>}
                  </div>
                }
                {g.id === "dashboard" && t > 0 && (
                  <span
                    id="badge-unread-count"
                    className="px-1.5 py-0.5 text-[10px] font-bold bg-pink-500 text-white rounded-full"
                  >
                    {t}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      }
      {
        <div id="sidebar-footer" className="p-4 border-t border-pink-100">
          {
            <button
              id="btn-sidebar-notif-drawer"
              onClick={a}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-pink-50/30 hover:bg-pink-50 border border-pink-100/50 text-sm transition-all cursor-pointer"
            >
              {
                <div className="flex items-center gap-3 text-gray-700">
                  {
                    <div className="relative">
                      {<Bell className="w-4 h-4 text-pink-500" />}
                      {t > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                      )}
                    </div>
                  }
                  {<span className="font-medium">Notifications</span>}
                </div>
              }
              {
                <span className="text-xs text-pink-600 font-bold font-mono">
                  {t}
                </span>
              }
            </button>
          }
          {
            <div
              id="sidebar-user-section"
              onClick={() => e("profile")}
              className="mt-4 flex items-center gap-3 px-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              {
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-md overflow-hidden">
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
                </div>
              }
              {
                <div className="flex-1 min-w-0">
                  {
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {userProfile?.name || "anya.bandgar"}
                    </p>
                  }
                  {
                    <p className="text-[10px] text-gray-400 truncate">
                      {userProfile?.email || "anyabandgar458@gmail.com"}
                    </p>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </aside>
  );
}
export default Sidebar;
