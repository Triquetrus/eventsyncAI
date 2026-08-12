import React from "react";
import { Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Calendar, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Unlink, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function UserProfile({ profile, setProfile, accounts, onToggleConnect }) {
  const [name, setName] = React.useState(profile?.name || "Anya Bandgar");
  const [email, setEmail] = React.useState(
    profile?.email || "anyabandgar458@gmail.com",
  );
  const [role, setRole] = React.useState(
    profile?.role || "Strategic Campaign Manager at EventSync AI",
  );
  const [image, setImage] = React.useState(profile?.image || null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [activeSetting, setActiveSetting] = React.useState("general");
  const [password, setPassword] = React.useState("********");
  const [theme, setTheme] = React.useState(() => {
    try {
      return localStorage.getItem("themePreference") || "light";
    } catch (e) {
      return "light";
    }
  });
  const [showPfpMenu, setShowPfpMenu] = React.useState(false);
  React.useEffect(() => {
    try {
      localStorage.setItem("themePreference", theme);
    } catch (e) {}
    const styleId = "dark-theme-style";
    let styleEl = document.getElementById(styleId);
    if (theme === "dark") {
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        styleEl.innerHTML = `
          body, html, #root { background-color: #000000 !important; color: #ff1493 !important; }
          * { border-color: #ff1493 !important; }
          .bg-white, .bg-gray-50, .bg-gray-100, .bg-pink-50, .bg-gray-800, .bg-gray-900 { background-color: #050505 !important; box-shadow: 0 0 10px #ff149322 !important; }
          .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500, .text-gray-400 { color: #ff1493 !important; }
          h1, h2, h3, h4, h5, h6, span, p, label, button, input, textarea, a { color: #ff1493 !important; }
          button:hover, a:hover { color: #ff69b4 !important; border-color: #ff69b4 !important; box-shadow: 0 0 8px #ff69b488 !important; }
          svg, path, circle { stroke: #ff1493 !important; }
          .bg-gradient-to-r { background: linear-gradient(to right, #ff1493, #ff00ff) !important; color: #000000 !important; }
          .bg-gradient-to-r span, .bg-gradient-to-r h2 { color: #000000 !important; }
          input { background-color: #000 !important; color: #ff1493 !important; }
          .bg-clip-text { background-clip: unset !important; -webkit-background-clip: unset !important; text-fill-color: unset !important; -webkit-text-fill-color: unset !important; background: none !important; color: #ff1493 !important; }
        `;
        document.head.appendChild(styleEl);
      }
    } else {
      if (styleEl) styleEl.remove();
    }
  }, [theme]);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const size = Math.min(img.width, img.height);
          canvas.width = 150;
          canvas.height = 150;
          const startX = (img.width - size) / 2;
          const startY = (img.height - size) / 2;
          ctx.drawImage(img, startX, startY, size, size, 0, 0, 150, 150);
          setImage(canvas.toDataURL("image/jpeg", 0.8));
          setShowPfpMenu(false);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };
  const SettingsIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500 hover:text-pink-600 transition-colors cursor-pointer"
      onClick={() => setShowSettings(!showSettings)}
    >
      {<circle cx="12" cy="12" r="3" />}
      {
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      }
    </svg>
  );
  const PencilIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500 hover:text-pink-600 transition-colors cursor-pointer"
    >
      {<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />}
    </svg>
  );
  const BlankPfpIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400 opacity-80"
    >
      {<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />}
      {<circle cx="12" cy="7" r="4" />}
    </svg>
  );
  const ArrowLeftIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {<path d="m12 19-7-7 7-7" />}
      {<path d="M19 12H5" />}
    </svg>
  );
  return (
    <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full relative">
      {
        <div className="flex flex-col gap-6 mb-8">
          {
            <div className="flex flex-wrap justify-between items-center gap-4">
              {
                <div className="flex items-center gap-4">
                  {activeSetting !== "general" && (
                    <button
                      onClick={() => setActiveSetting("general")}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors cursor-pointer"
                      title="Back to Profile"
                    >
                      {<ArrowLeftIcon />}
                    </button>
                  )}
                  {
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      {activeSetting === "general"
                        ? "Profile Settings"
                        : activeSetting === "linkedaccounts"
                          ? "Linked Accounts"
                          : activeSetting.charAt(0).toUpperCase() +
                            activeSetting.slice(1)}
                    </h2>
                  }
                </div>
              }
              {
                <button
                  onClick={() => {
                    if (window.supabaseAuth) window.supabaseAuth.logout();
                    localStorage.removeItem("eventsync_user_profile");
                    window.location.reload();
                  }}
                  className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors px-4 py-2 border border-rose-100 bg-rose-50 rounded-lg cursor-pointer"
                >
                  Logout
                </button>
              }
            </div>
          }
          {
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-100">
              {["General", "Linked Accounts", "Security", "Appearance"].map(
                (tab) => (
                  <button key={tab}
                    onClick={() =>
                      setActiveSetting(tab.toLowerCase().replace(" ", ""))
                    }
                    className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeSetting === tab.toLowerCase().replace(" ", "") ? "text-pink-600 border-pink-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
          }
        </div>
      }
      {
        <div className="bg-white border border-pink-100 rounded-2xl p-8 shadow-sm flex flex-col gap-8 min-h-[400px]">
          {activeSetting === "general" && (
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {
                <div className="flex flex-col items-center gap-4">
                  {
                    <div className="relative w-[150px] h-[150px]">
                      {
                        <div className="w-full h-full rounded-full border-4 border-pink-50 overflow-hidden flex items-center justify-center bg-gray-100 shadow-sm">
                          {image ? (
                            <img
                              src={image}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BlankPfpIcon />
                          )}
                        </div>
                      }
                      {
                        <div
                          className="absolute bottom-2 right-2 bg-white rounded-full p-2.5 shadow-md border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer z-10"
                          onClick={() => setShowPfpMenu(!showPfpMenu)}
                        >
                          {<PencilIcon />}
                        </div>
                      }
                      {showPfpMenu && (
                        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg w-36 z-20 overflow-hidden flex flex-col">
                          {
                            <button
                              className="text-left px-4 py-3 text-sm font-semibold hover:bg-gray-50 text-gray-700 border-b border-gray-50 cursor-pointer"
                              onClick={() => {
                                if (image) {
                                  const newTab = window.open();
                                  newTab.document.body.innerHTML =
                                    '<img src="' +
                                    image +
                                    '" style="max-width: 100%;">';
                                } else {
                                  alert("No custom photo to view.");
                                }
                                setShowPfpMenu(false);
                              }}
                            >
                              View PFP
                            </button>
                          }
                          {
                            <button
                              className="text-left px-4 py-3 text-sm font-semibold hover:bg-gray-50 text-gray-700 border-b border-gray-50 cursor-pointer"
                              onClick={() => {
                                document
                                  .getElementById("profile-upload")
                                  ?.click();
                                setShowPfpMenu(false);
                              }}
                            >
                              Change
                            </button>
                          }
                          {
                            <button
                              className="text-left px-4 py-3 text-sm font-semibold hover:bg-red-50 text-red-600 cursor-pointer"
                              onClick={() => {
                                setImage(null);
                                setShowPfpMenu(false);
                              }}
                            >
                              Remove
                            </button>
                          }
                        </div>
                      )}
                    </div>
                  }
                  {
                    <input
                      id="profile-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  }
                </div>
              }
              {
                <div className="flex-1 flex flex-col gap-5">
                  {
                    <div>
                      {
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Full Name
                        </label>
                      }
                      {
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                        />
                      }
                    </div>
                  }
                  {
                    <div>
                      {
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                      }
                      {
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all text-gray-500"
                        />
                      }
                    </div>
                  }
                  {
                    <div>
                      {
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Role
                        </label>
                      }
                      {
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all text-gray-500"
                        />
                      }
                    </div>
                  }
                  {
                    <div className="pt-4">
                      {
                        <button
                          onClick={async () => {
                            try {
                              await window.supabaseAuth.updateProfile(name, image);
                            } catch (err) {
                              console.warn("Profile sync failed:", err);
                            }
                            if (setProfile)
                              setProfile({
                                name,
                                email,
                                role,
                                image,
                              });
                            alert("Profile updated!");
                          }}
                          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md cursor-pointer transition-all"
                        >
                          Save Changes
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          )}
          {activeSetting === "linkedaccounts" && (
            <div className="flex-1 flex flex-col gap-6">
              {
                <div>
                  {
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Linked Social Accounts
                    </h3>
                  }
                  {
                    <p className="text-sm text-gray-500">
                      Manage connections to your social profiles for direct
                      publishing.
                    </p>
                  }
                </div>
              }
              {accounts && typeof ConnectedAccountsTab !== "undefined" ? (
                <ConnectedAccountsTab
                  accounts={accounts}
                  onToggleConnect={onToggleConnect}
                />
              ) : (
                <p className="text-sm text-gray-400">
                  Accounts management not available.
                </p>
              )}
            </div>
          )}
          {activeSetting === "security" && (
            <div className="flex-1 flex flex-col gap-5">
              {
                <div>
                  {
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Security Settings
                    </h3>
                  }
                  {
                    <p className="text-sm text-gray-500">
                      Update your password and secure your account.
                    </p>
                  }
                </div>
              }
              {
                <div>
                  {
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                  }
                  {
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                    />
                  }
                </div>
              }
              {
                <div>
                  {
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                  }
                  {
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                    />
                  }
                </div>
              }
              {
                <div className="pt-4">
                  {
                    <button
                      onClick={() => alert("Password updated successfully!")}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md cursor-pointer transition-all"
                    >
                      Update Password
                    </button>
                  }
                </div>
              }
            </div>
          )}
          {activeSetting === "appearance" && (
            <div className="flex-1 flex flex-col gap-6">
              {
                <div>
                  {
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Appearance
                    </h3>
                  }
                  {
                    <p className="text-sm text-gray-500">
                      Customize the look and feel of your workspace.
                    </p>
                  }
                </div>
              }
              {
                <div className="flex flex-col gap-4">
                  {
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Theme Preference
                    </label>
                  }
                  {
                    <div className="flex gap-4">
                      {
                        <button
                          onClick={() => setTheme("light")}
                          className={
                            "flex-1 py-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer " +
                            (theme === "light"
                              ? "border-pink-500 bg-pink-50 text-pink-600"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                          }
                        >
                          {
                            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm" />
                          }
                          {
                            <span className="font-semibold text-sm">
                              Light Mode
                            </span>
                          }
                        </button>
                      }
                      {
                        <button
                          onClick={() => setTheme("dark")}
                          className={
                            "flex-1 py-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer " +
                            (theme === "dark"
                              ? "border-pink-500 bg-gray-900 text-pink-500"
                              : "border-gray-200 bg-gray-800 text-gray-300 hover:border-gray-400")
                          }
                        >
                          {
                            <div className="w-6 h-6 rounded-full bg-gray-900 border border-gray-600 shadow-sm" />
                          }
                          {
                            <span className="font-semibold text-sm">
                              Dark Mode
                            </span>
                          }
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          )}
        </div>
      }
    </div>
  );
}
export default UserProfile;
