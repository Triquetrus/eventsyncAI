import React from "react";
import { Calendar, Pencil, Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Unlink, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function EventsTab({
  events: r,
  onSaveEvent: e,
  onDeleteEvent: t,
  filter: filterProp = "all",
  setFilter: setFilterProp,
}) {
  const [localFilter, setLocalFilter] = React.useState("all");
  const filter = setFilterProp ? filterProp : localFilter;
  const setFilter = setFilterProp || setLocalFilter;
  const [s, a] = React.useState(!1),
    [u, c] = React.useState(null),
    [p, g] = React.useState(!1),
    [y, E] = React.useState(""),
    [w, I] = React.useState(""),
    [V, z] = React.useState(""),
    [endTime, setEndTime] = React.useState(""),
    [te, oe] = React.useState(""),
    [pe, Te] = React.useState("general"),
    [Ee, me] = React.useState(""),
    [Re, be] = React.useState("upcoming"),
    [k, C] = React.useState([]),
    [O, L] = React.useState(""),
    M = [
      {
        value: "college",
        label: "College / University",
        icon: GraduationCap,
      },
      {
        value: "club",
        label: "Club / Student Org",
        icon: Users,
      },
      {
        value: "seminar",
        label: "Seminar / Webinar",
        icon: Briefcase,
      },
      {
        value: "wedding",
        label: "Wedding / Social",
        icon: Sparkle,
      },
      {
        value: "corporate",
        label: "Corporate Event",
        icon: BookmarkCheck,
      },
      {
        value: "general",
        label: "General Gathering",
        icon: HelpCircle,
      },
    ],
    P = () => {
      (c(null),
        E(""),
        I(new Date().toISOString().split("T")[0]),
        z("12:00"),
        setEndTime("14:00"),
        oe(""),
        Te("general"),
        me(""),
        be("upcoming"),
        C([]),
        a(!0));
    },
    R = (ne) => {
      (c(ne),
        E(ne.name),
        I(ne.date),
        z(ne.time),
        setEndTime(ne.endTime || ""),
        oe(ne.location),
        Te(ne.type),
        me(ne.description),
        be(ne.status),
        C(ne.smartPrompts || []),
        a(!0));
    },
    rt = async () => {
      if (!y) {
        alert(
          "Please enter an event name first so we can generate matching prompts!",
        );
        return;
      }
      g(!0);
      try {
        const ne = await fetch("/api/generate-prompts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName: y,
            eventType: pe,
            location: te,
          }),
        });
        if (ne.ok) {
          const De = await ne.json();
          De.prompts && De.prompts.length > 0 && C(De.prompts);
        } else
          console.warn("Failed to generate prompts via API, using fallbacks");
      } catch (ne) {
        console.warn(ne.message || ne);
      } finally {
        g(!1);
      }
    },
    pt = () => {
      O.trim() && (C([...k, O.trim()]), L(""));
    },
    X = (ne) => {
      C(k.filter((De, Xe) => Xe !== ne));
    },
    ce = async (ne) => {
      if ((ne.preventDefault(), !y || !w || !V)) {
        alert("Name, Date, and Time are required!");
        return;
      }
      let finalPrompts = k;
      if (!finalPrompts || finalPrompts.length === 0) {
        try {
          const res = await fetch("/api/generate-prompts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventName: y,
              eventType: pe,
              location: te,
            }),
          });
          if (res.ok) {
            const json = await res.json();
            if (json.prompts && json.prompts.length > 0)
              finalPrompts = json.prompts;
          }
        } catch (err) {
          console.warn(err);
        }
      }
      const De = {
        name: y,
        date: w,
        time: V,
        endTime: endTime,
        location: te,
        type: pe,
        description: Ee,
        status: Re,
        smartPrompts: finalPrompts,
        createdAt: u ? u.createdAt : new Date().toISOString(),
      };
      (await e(
        u
          ? {
              ...De,
              id: u.id,
            }
          : De,
      ),
        a(!1));
    };
  return (
    <div id="events-manager-view" className="flex-1 p-4 md:p-8 ">
      {
        <div
          id="events-header"
          className="flex justify-between items-center mb-8"
        >
          {
            <div>
              {
                <h2
                  id="events-title"
                  className="text-2xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                >
                  Event Synchronizer
                </h2>
              }
              {
                <p className="text-gray-500 text-sm mt-1">
                  Schedule events: r, trigger smart prompts, and organize marketing
                  schedules.
                </p>
              }
            </div>
          }
          {!s && (
            <button
              id="btn-open-creator-form"
              onClick={P}
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-pink-500/15 cursor-pointer"
            >
              {<Plus className="w-4 h-4" />}
              {<span>Create Event</span>}
            </button>
          )}
        </div>
      }
      {s ? (
        <div
          id="event-form-card"
          className="bg-white border border-pink-100 rounded-2xl p-6 max-w-3xl mx-auto mb-8 shadow-sm"
        >
          {
            <h3
              id="form-title"
              className="text-lg font-bold text-gray-800 mb-6 border-b border-pink-50 pb-3 flex items-center gap-2"
            >
              {<Sparkles className="w-5 h-5 text-pink-500" />}
              {u ? `Edit Event: ${u.name}` : "Plan New Social Sync Event"}
            </h3>
          }
          {
            <form onSubmit={ce} className="flex flex-col gap-6">
              {
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {
                    <div className="flex flex-col gap-2">
                      {
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Event Name *
                        </label>
                      }
                      {
                        <input
                          type="text"
                          required={!0}
                          placeholder="e.g., Annual Tech Fest 2026"
                          value={y}
                          onChange={(ne) => E(ne.target.value)}
                          className="bg-pink-50/10 border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                        />
                      }
                    </div>
                  }
                  {
                    <div className="flex flex-col gap-2">
                      {
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Event Type
                        </label>
                      }
                      {
                        <select
                          value={pe}
                          onChange={(ne) => Te(ne.target.value)}
                          className="bg-pink-50/10 border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-all cursor-pointer"
                        >
                          {M.map((ne) => (
                            <option key={ne.value} value={ne.value}>{ne.label}</option>
                          ))}
                        </select>
                      }
                    </div>
                  }
                </div>
              }
              {
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {
                    <div className="flex flex-col gap-2">
                      {
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Location / Venue
                        </label>
                      }
                      {
                        <input
                          type="text"
                          placeholder="e.g., Main Auditorium / Zoom"
                          value={te}
                          onChange={(ne) => oe(ne.target.value)}
                          className="bg-pink-50/10 border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                        />
                      }
                    </div>
                  }
                  {
                    <div className="flex flex-col gap-2">
                      {
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Current Status
                        </label>
                      }
                      {
                        <select
                          value={Re}
                          onChange={(ne) => be(ne.target.value)}
                          className="bg-pink-50/10 border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-all cursor-pointer"
                        >
                          {
                            <option value="upcoming">
                              Scheduled (Upcoming)
                            </option>
                          }
                          {<option value="ongoing">Live Now (Ongoing)</option>}
                          {
                            <option value="completed">
                              Concluded (Completed)
                            </option>
                          }
                        </select>
                      }
                    </div>
                  }
                </div>
              }
              {
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {
                    <div className="flex flex-col gap-2">
                      {
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Date *
                        </label>
                      }
                      {
                        <input
                          type="date"
                          required={!0}
                          value={w}
                          onChange={(ne) => I(ne.target.value)}
                          className="bg-pink-50/10 border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                        />
                      }
                    </div>
                  }
                  {
                    <div className="flex flex-col gap-2">
                      {
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Start Time *
                        </label>
                      }
                      {
                        <input
                          type="time"
                          required={!0}
                          value={V}
                          onChange={(ne) => z(ne.target.value)}
                          className="bg-pink-50/10 border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                        />
                      }
                    </div>
                  }
                  {
                    <div className="flex flex-col gap-2">
                      {
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          End Time
                        </label>
                      }
                      {
                        <input
                          type="time"
                          value={endTime}
                          onChange={(ne) => setEndTime(ne.target.value)}
                          className="bg-pink-50/10 border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                        />
                      }
                    </div>
                  }
                </div>
              }
              {
                <div className="flex flex-col gap-2">
                  {
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Description / Notes
                    </label>
                  }
                  {
                    <textarea
                      placeholder="Brief summary of event schedule, goals, or co-ordinators..."
                      value={Ee}
                      onChange={(ne) => me(ne.target.value)}
                      rows={3}
                      className="bg-pink-50/10 border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all resize-none"
                    />
                  }
                </div>
              }
              {
                <div className="border-t border-pink-50 pt-5 mt-2">
                  {
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      {
                        <div>
                          {
                            <h4 className="text-sm font-bold text-gray-800">
                              Real-Time Smart Prompts
                            </h4>
                          }
                          {
                            <p className="text-xs text-gray-500 mt-0.5">
                              Capturing prompts suggested to the user during
                              event execution.
                            </p>
                          }
                        </div>
                      }
                      {
                        <button
                          type="button"
                          onClick={rt}
                          disabled={p}
                          className="bg-pink-50 text-pink-600 border border-pink-100/80 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all hover:bg-pink-100/50 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
                        >
                          {
                            <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
                          }
                          {
                            <span>
                              {p
                                ? "AI Generating..."
                                : "AI Auto-Generate Prompts"}
                            </span>
                          }
                        </button>
                      }
                    </div>
                  }
                  {
                    <div className="flex flex-col gap-2 mb-4 max-h-41 overflow-y-auto pr-1">
                      {k.map((ne, De) => (
                        <div key={De} className="flex items-center justify-between p-2.5 bg-pink-50/20 rounded-lg border border-pink-100/50 text-xs">
                          {
                            <span className="text-gray-700 font-medium">
                              {ne}
                            </span>
                          }
                          {
                            <button
                              type="button"
                              onClick={() => X(De)}
                              className="text-gray-400 hover:text-rose-600 p-0.5 cursor-pointer"
                            >
                              {<Trash2 className="w-4 h-4" />}
                            </button>
                          }
                        </div>
                      ))}
                      {k.length === 0 && (
                        <p className="text-xs text-gray-500 italic py-2">
                          No custom prompts loaded yet. Type below or use AI
                          Auto-Generate.
                        </p>
                      )}
                    </div>
                  }
                  {
                    <div className="flex gap-2">
                      {
                        <input
                          type="text"
                          placeholder="Create custom capturing cue (e.g. 'Take a selfie with the panel')"
                          value={O}
                          onChange={(ne) => L(ne.target.value)}
                          className="flex-1 bg-pink-50/10 border border-pink-100 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400"
                        />
                      }
                      {
                        <button
                          type="button"
                          onClick={pt}
                          className="bg-white hover:bg-pink-50/50 text-pink-600 border border-pink-100 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Add Cue
                        </button>
                      }
                    </div>
                  }
                </div>
              }
              {
                <div className="flex justify-end gap-3 border-t border-pink-50 pt-5 mt-2">
                  {
                    <button
                      type="button"
                      onClick={() => a(!1)}
                      className="px-5 py-2.5 rounded-xl border border-pink-100 text-sm text-gray-500 hover:bg-pink-50/20 font-semibold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  }
                  {
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-pink-500/10 cursor-pointer transition-all"
                    >
                      {u ? "Save Changes" : "Create Sync Schedule"}
                    </button>
                  }
                </div>
              }
            </form>
          }
        </div>
      ) : (
        <div>
          {
            <div className="flex gap-2 mb-6">
              {
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${filter === "all" ? "bg-gray-800 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
                >
                  All Events
                </button>
              }
              {
                <button
                  onClick={() => setFilter("ongoing")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${filter === "ongoing" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-500 border border-gray-200"}`}
                >
                  Active Events
                </button>
              }
              {
                <button
                  onClick={() => setFilter("upcoming")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${filter === "upcoming" ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-500 border border-gray-200"}`}
                >
                  Upcoming Events
                </button>
              }
            </div>
          }
          {
            <div
              id="events-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {r
                .filter((ne) => filter === "all" || ne.status === filter)
                .map(
                  (ne) => (
                    ne.smartPrompts && ne.smartPrompts.length > 0,
                    (
                      <div key={ne.id}
                        id={`event-card-${ne.id}`}
                        onClick={() => R(ne)}
                        className="bg-white border border-pink-100/80 rounded-2xl p-5 flex flex-col justify-between hover:border-pink-300 transition-all shadow-sm hover:shadow-md cursor-pointer"
                      >
                        {
                          <div>
                            {
                              <div className="flex justify-between items-start gap-2 mb-3">
                                {
                                  <span
                                    className={`px-2 py-0.5 text-[10px] font-bold rounded border ${ne.status === "ongoing" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : ne.status === "completed" ? "bg-gray-50 text-gray-500 border-gray-100" : "bg-pink-50 text-pink-600 border-pink-100"}`}
                                  >
                                    {ne.status.toUpperCase()}
                                  </span>
                                }
                                {
                                  <span className="text-[10px] text-gray-400 font-mono capitalize">
                                    {ne.type}
                                  </span>
                                }
                              </div>
                            }
                            {
                              <h4 className="font-extrabold text-base text-gray-800 tracking-tight mb-2 truncate">
                                {ne.name}
                              </h4>
                            }
                            {
                              <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                {ne.description || "No description provided."}
                              </p>
                            }
                            {
                              <div className="flex flex-col gap-2 border-t border-pink-50 pt-4 text-xs text-gray-500 mb-4">
                                {
                                  <div className="flex items-center gap-2">
                                    {
                                      <Calendar className="w-3.5 h-3.5 text-pink-500" />
                                    }
                                    {
                                      <span className="font-mono">
                                        {ne.date}
                                      </span>
                                    }
                                  </div>
                                }
                                {
                                  <div className="flex items-center gap-2">
                                    {
                                      <Clock className="w-3.5 h-3.5 text-pink-500" />
                                    }
                                    {
                                      <span>
                                        {ne.time +
                                          (ne.endTime
                                            ? " - " + ne.endTime
                                            : "")}
                                      </span>
                                    }
                                  </div>
                                }
                                {
                                  <div className="flex items-center gap-2">
                                    {
                                      <MapPin className="w-3.5 h-3.5 text-pink-500" />
                                    }
                                    {
                                      <span className="truncate">
                                        {ne.location || "Online"}
                                      </span>
                                    }
                                  </div>
                                }
                              </div>
                            }
                          </div>
                        }
                        {
                          <div className="flex justify-between items-center border-t border-pink-50 pt-3 mt-1">
                            {
                              <span className="text-[10px] text-gray-400">
                                {ne.smartPrompts ? ne.smartPrompts.length : 0}{" "}
                                smart cues
                              </span>
                            }
                            {
                              <div className="flex items-center gap-1">
                                {
                                  <button
                                    onClick={(evt) => { evt.stopPropagation(); R(ne); }}
                                    className="p-2 text-gray-400 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition-all cursor-pointer"
                                    title="Edit Event"
                                  >
                                    {<Pencil className="w-4 h-4" />}
                                  </button>
                                }
                                {
                                  <button
                                    onClick={(evt) => { evt.stopPropagation(); t(ne.id); }}
                                    className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-pink-50 transition-all cursor-pointer"
                                    title="Delete Event"
                                  >
                                    {<Trash2 className="w-4 h-4" />}
                                  </button>
                                }
                              </div>
                            }
                          </div>
                        }
                      </div>
                    )
                  ),
                )}
              {r.filter((ne) => filter === "all" || ne.status === filter)
                .length === 0 && (
                <div className="col-span-full text-center py-16 border border-dashed border-pink-200 rounded-2xl bg-white">
                  {<Calendar className="w-12 h-12 text-pink-300 mx-auto mb-3" />}
                  {
                    <p className="text-gray-500 font-medium">
                      No events scheduled yet
                    </p>
                  }
                  {
                    <p className="text-xs text-gray-400 mt-1 mb-4">
                      Start by scheduling an upcoming event to sync social cues.
                    </p>
                  }
                  {
                    <button
                      onClick={P}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-pink-500/10 cursor-pointer"
                    >
                      Create Event Now
                    </button>
                  }
                </div>
              )}
            </div>
          }
        </div>
      )}
    </div>
  );
}
export default EventsTab;
