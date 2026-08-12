import React from "react";
import { Link, Unlink, Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Calendar, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function ConnectedAccountsTab({ accounts: r, onToggleConnect: e }) {
  const [t, s] = React.useState(null),
    [a, u] = React.useState(""),
    [c, p] = React.useState(""),
    [g, y] = React.useState(!0),
    E = (V) => {
      switch (V) {
        case "instagram":
          return "from-pink-500 to-rose-500 text-pink-400 border-pink-500/20";
        case "linkedin":
          return "from-blue-600 to-blue-700 text-blue-400 border-blue-500/20";
        case "facebook":
          return "from-indigo-600 to-indigo-700 text-indigo-400 border-indigo-500/20";
        default:
          return "from-gray-700 to-gray-800 text-gray-400 border-gray-700";
      }
    },
    w = (V) => {
      (s(V), u(""), p(""));
    },
    I = (V) => {
      e(V, a, c);
      s(null);
      u("");
      p("");
    };
  return (
    <div id="accounts-settings-view" className="flex-1 p-4 md:p-8 ">
      {
        <div id="accounts-header" className="mb-8">
          {
            <h2
              id="accounts-title"
              className="text-2xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
            >
              Social Accounts Integrations
            </h2>
          }
          {
            <p className="text-gray-500 text-sm mt-1">
              Social publishing integrations are planned for a future release.
            </p>
          }
        </div>
      }
      {
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {
            <div className="lg:col-span-8 flex flex-col gap-6">
              {
                <div className="bg-white border border-pink-100 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
                  {
                    <h3 className="font-bold text-sm text-pink-600 uppercase tracking-wider font-mono border-b border-pink-50 pb-3">
                      Integration Roadmap
                    </h3>
                  }
                  {
                    <div className="flex flex-col gap-4">
                      {r.map((V) => {
                        const z = E(V.platform);
                        return (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-pink-50/10 border border-pink-100 rounded-2xl gap-4 hover:border-pink-200 transition-all">
                            {
                              <div className="flex items-center gap-4">
                                {
                                  <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${z.split(" ")[0]} ${z.split(" ")[1]} p-0.5 shadow-md shadow-black/5`}
                                  >
                                    {
                                      <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                                        {V.platform === "instagram" && (
                                          <Instagram className="w-5 h-5 text-pink-500" />
                                        )}
                                        {V.platform === "linkedin" && (
                                          <Linkedin className="w-5 h-5 text-blue-500" />
                                        )}
                                        {V.platform === "facebook" && (
                                          <Facebook className="w-5 h-5 text-indigo-500" />
                                        )}
                                      </div>
                                    }
                                  </div>
                                }
                                {
                                  <div>
                                    {
                                      <div className="flex items-center gap-2">
                                        {
                                          <h4 className="font-bold text-sm text-gray-800 capitalize">
                                            {V.platform} Graph
                                          </h4>
                                        }
                                        {
                                          <span
                                            className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${V.isConnected ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-pink-50/50 text-pink-400 border border-pink-100/30"}`}
                                          >
                                            COMING SOON
                                          </span>
                                        }
                                      </div>
                                    }
                                    {
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        OAuth connection and direct publishing are not yet available.
                                      </p>
                                    }
                                  </div>
                                }
                              </div>
                            }
                            {
                              <div className="flex items-center gap-2 self-end sm:self-center">
                                {
                                  <button
                                    disabled
                                    className="bg-gray-100 text-gray-400 border border-gray-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-not-allowed"
                                  >
                                    {<Clock className="w-3.5 h-3.5" />}
                                    {<span>Coming Soon</span>}
                                  </button>
                                }
                              </div>
                            }
                          </div>
                        );
                      })}
                    </div>
                  }
                </div>
              }
            </div>
          }
          {
            <div className="lg:col-span-4 flex flex-col gap-6">
              {
                <div className="bg-white border border-pink-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                  {
                    <h4 className="font-bold text-pink-600 text-sm tracking-wider uppercase flex items-center gap-2">
                      {<ShieldCheck className="w-4 h-4 text-pink-500" />}
                      Developer Sandboxing
                    </h4>
                  }
                  {
                    <p className="text-xs text-gray-500 leading-relaxed">
                      When sandbox staging is active, social posts are simulated
                      and logs are safely stored within your cloud-synced
                      database to avoid live account spamming during testing.
                    </p>
                  }
                  {
                    <div className="border-t border-pink-50 pt-4 flex items-center justify-between">
                      {
                        <div>
                          {
                            <p className="text-xs font-bold text-gray-800">
                              Staging Mode
                            </p>
                          }
                          {
                            <p className="text-[10px] text-gray-400">
                              Enable to mock post publishing
                            </p>
                          }
                        </div>
                      }
                      {
                        <label className="relative inline-flex items-center cursor-pointer">
                          {
                            <input
                              type="checkbox"
                              checked={g}
                              onChange={() => y(!g)}
                              className="sr-only peer"
                            />
                          }
                          {
                            <div className="w-9 h-5 bg-pink-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500 peer-checked:after:bg-white" />
                          }
                        </label>
                      }
                    </div>
                  }
                </div>
              }
              {
                <div className="bg-gradient-to-br from-pink-50/20 to-white border border-pink-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                  {
                    <div className="flex gap-2.5">
                      {<Info className="w-4 h-4 text-pink-500 shrink-0" />}
                      {
                        <div>
                          {
                            <h5 className="text-xs font-bold text-gray-800">
                              How Direct Posting Works
                            </h5>
                          }
                          {
                            <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                              Direct publishing via Meta Graph and LinkedIn APIs
                              is planned after OAuth and account-security work is
                              complete.
                            </p>
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
      }
      {t && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          {
            <div className="bg-white border border-pink-100 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              {
                <div className="flex items-center gap-3 border-b border-pink-50 pb-4 mb-5">
                  {<Settings className="w-5 h-5 text-pink-500" />}
                  {
                    <div>
                      {
                        <h4 className="font-extrabold text-gray-800 text-sm capitalize">
                          {t} API Integration
                        </h4>
                      }
                      {
                        <p className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                          OAuth Credentials Handshake
                        </p>
                      }
                    </div>
                  }
                </div>
              }
              {
                <div className="flex flex-col gap-4 mb-5 items-center justify-center py-6">
                  {
                    <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-2">
                      {<Settings className="w-8 h-8 text-pink-500" />}
                    </div>
                  }
                  {
                    <p className="text-sm text-gray-600 text-center px-4">{`Click below to securely authenticate with ${t.charAt(0).toUpperCase() + t.slice(1)} via your browser. We don't store your API keys.`}</p>
                  }
                </div>
              }
              {
                <div className="flex justify-end gap-3 border-t border-pink-50 pt-4">
                  {
                    <button
                      onClick={() => s(null)}
                      className="px-4 py-2 border border-pink-100 text-xs text-gray-500 rounded-xl font-semibold hover:bg-pink-50/30 cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  }
                  {
                    <button
                      onClick={() => I(t)}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      Authorize Integration
                    </button>
                  }
                </div>
              }
            </div>
          }
        </div>
      )}
    </div>
  );
} // Web Push & SW initialization

export default ConnectedAccountsTab;
