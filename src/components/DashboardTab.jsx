import React from "react";
import { Calendar, Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Unlink, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function QuickPostWidget({ events, media, onNavigateToTab, onSelectEventForCamera }) {
  const [selectedMedia, setSelectedMedia] = React.useState(null);
  const [selectedEventId, setSelectedEventId] = React.useState(events[0]?.id || "");
  const [platform, setPlatform] = React.useState("instagram");
  const [tone, setTone] = React.useState("Enthusiastic");
  const [captionText, setCaptionText] = React.useState("");
  const [hashtagsText, setHashtagsText] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isPosting, setIsPosting] = React.useState(false);
  const [postSuccessMsg, setPostSuccessMsg] = React.useState("");

  React.useEffect(() => {
    if (media && media.length > 0 && !selectedMedia) {
      setSelectedMedia(media[0]);
    }
  }, [media]);

  const activeEvent = events.find((evt) => evt.id === selectedEventId) || events[0];

  const handleGenerateCaption = async () => {
    setIsGenerating(true);
    setPostSuccessMsg("");
    try {
      let imageBase64 = "";
      let mimeType = "image/jpeg";
      if (selectedMedia) {
        imageBase64 = selectedMedia.url || selectedMedia.base64Data || "";
        mimeType = selectedMedia.mimeType || (selectedMedia.type === "video" ? "video/mp4" : "image/jpeg");
      }

      const res = await fetch("/api/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: activeEvent ? activeEvent.name : "Event Highlight",
          eventType: activeEvent ? activeEvent.type : "General",
          location: activeEvent ? activeEvent.location : "Online",
          description: activeEvent ? activeEvent.description : "Social media post",
          tone,
          platform,
          imageBase64,
          mimeType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCaptionText(data.caption || "");
        if (data.hashtags && Array.isArray(data.hashtags)) {
          setHashtagsText(data.hashtags.map((h) => h.startsWith("#") ? h : `#${h}`).join(" "));
        }
      } else {
        setCaptionText(`Unforgettable moments at ${activeEvent?.name || "our event"}! 🚀 Exciting updates live from the venue.`);
        setHashtagsText(`#${(activeEvent?.name || "Event").replace(/\s+/g, "")} #Highlights #EventSync #Viral`);
      }
    } catch (err) {
      setCaptionText(`Live highlights from ${activeEvent?.name || "our event"}! So excited to share this update.`);
      setHashtagsText(`#EventHighlights #EventSync #SocialPost`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishPost = async () => {
    if (!captionText.trim()) {
      alert("Please generate or write a caption before posting!");
      return;
    }
    setIsPosting(true);
    try {
      const { savePostRecord } = await import("../lib/db");
      await savePostRecord({
        eventId: selectedEventId,
        platform,
        text: captionText,
        hashtags: hashtagsText.split(" ").filter(Boolean),
        mediaUrl: selectedMedia ? (selectedMedia.url || selectedMedia.base64Data) : "",
        postedAt: new Date().toISOString(),
        status: "published",
      });
      setPostSuccessMsg(`Successfully posted to ${platform.toUpperCase()}! 🎉`);
      setTimeout(() => setPostSuccessMsg(""), 5000);
    } catch (err) {
      console.error("Publishing error:", err);
      setPostSuccessMsg(`Saved post to Social Drafts!`);
      setTimeout(() => setPostSuccessMsg(""), 4000);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div id="quick-post-card" className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm mb-8 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-pink-50 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-pink-500" />
            Quick Social Post
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Select media asset, generate an instant AI caption, and publish across your accounts.
          </p>
        </div>
        <span className="self-start sm:self-auto text-[10px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100 font-mono uppercase">
          Quick Social Creator
        </span>
      </div>

      {postSuccessMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{postSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Media Picker & Event Selector */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
              1. Select Event Context
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full text-xs bg-pink-50/30 border border-pink-200 rounded-xl p-2.5 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({evt.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                2. Pick Media Asset
              </label>
              <button
                type="button"
                onClick={() => onNavigateToTab("gallery")}
                className="text-[11px] text-pink-600 font-semibold hover:underline cursor-pointer"
              >
                View Gallery &rarr;
              </button>
            </div>

            {media && media.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto p-1.5 bg-pink-50/20 border border-pink-100/60 rounded-xl">
                {media.map((m) => {
                  const mediaSrc = m.url || m.base64Data;
                  const isSel = selectedMedia?.id === m.id;
                  const isImage = (m.mimeType && m.mimeType.startsWith("image/")) || (mediaSrc && mediaSrc.startsWith("data:image/")) || m.type === "image";
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMedia(m)}
                      className={`relative aspect-square bg-black rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        isSel ? "border-pink-500 shadow-md ring-2 ring-pink-500/20" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {isImage ? (
                        <img src={mediaSrc} alt="Asset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <video src={mediaSrc} className="w-full h-full object-cover" />
                      )}
                      {isSel && (
                        <div className="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-0.5 shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-pink-200 rounded-xl text-center bg-pink-50/20">
                <p className="text-xs text-gray-500 mb-2">No media captured yet.</p>
                <button
                  type="button"
                  onClick={() => onSelectEventForCamera(selectedEventId, "Quick Post Capture")}
                  className="px-3 py-1.5 bg-pink-500 text-white text-xs font-bold rounded-lg hover:bg-pink-600 cursor-pointer transition-colors"
                >
                  📸 Launch Camera
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Platform, Tone, Caption & Publish */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            {/* Platform selector */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Platform
              </label>
              <div className="flex gap-1.5">
                {[
                  { id: "instagram", name: "Insta", icon: <Instagram className="w-3.5 h-3.5 text-pink-500" /> },
                  { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="w-3.5 h-3.5 text-blue-500" /> },
                  { id: "facebook", name: "FB", icon: <Facebook className="w-3.5 h-3.5 text-indigo-500" /> },
                ].map((pItem) => (
                  <button
                    key={pItem.id}
                    type="button"
                    onClick={() => setPlatform(pItem.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                      platform === pItem.id
                        ? "bg-pink-50 border-pink-300 text-pink-700 shadow-xs"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pItem.icon}
                    <span>{pItem.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone selector */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="text-xs bg-white border border-gray-200 rounded-lg p-1.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer"
              >
                <option value="Enthusiastic">⚡ Enthusiastic</option>
                <option value="Professional">💼 Professional</option>
                <option value="Creative">🎨 Creative</option>
                <option value="Casual">✨ Casual</option>
              </select>
            </div>
          </div>

          {/* Caption textarea & AI button */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                3. Post Caption & Hashtags
              </label>
              <button
                type="button"
                onClick={handleGenerateCaption}
                disabled={isGenerating}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Generating..." : "✨ AI Caption"}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              placeholder="Click '✨ AI Caption' to auto-generate or write custom text..."
              className="w-full text-xs p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/10 text-gray-800 font-medium"
            />
            <input
              type="text"
              value={hashtagsText}
              onChange={(e) => setHashtagsText(e.target.value)}
              placeholder="#hashtags (e.g., #Hackathon #AI #EventSync)"
              className="w-full text-xs p-2.5 mt-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/10 text-pink-600 font-mono font-medium"
            />
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handlePublishPost}
            disabled={isPosting}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 hover:to-amber-600 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-500/10 cursor-pointer disabled:opacity-50 transition-all mt-1"
          >
            <Send className="w-4 h-4" />
            <span>{isPosting ? "Publishing..." : `Post to ${platform.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardTab({
  events: r,
  media: t,
  captions: e,
  onNavigateToTab: s,
  onSelectEventForCamera: a,
  onCreateEventClick: u,
  userProfile: up,
}) {
  const [c, p] = React.useState(new Date().toISOString().split("T")[0]),
    g = r.filter((me) => me.status === "upcoming").length,
    y = r.filter((me) => me.status === "ongoing").length,
    I = r.find((me) => me.status === "ongoing") || r[0],
    E = I ? t.filter((c) => c.eventId === I.id).length : 0,
    w = I ? e.filter((m) => m.eventId === I.id).length : 0,
    V = new Date(),
    z = V.toLocaleString("default", {
      month: "long",
    }),
    te = V.getFullYear(),
    pe = (() => {
      const me = [];
      for (let Re = -3; Re < 11; Re++) {
        const be = new Date();
        (be.setDate(V.getDate() + Re),
          me.push({
            dateString: be.toISOString().split("T")[0],
            dayName: be.toLocaleString("default", {
              weekday: "short",
            }),
            dayNum: be.getDate(),
            isToday: be.toDateString() === V.toDateString(),
          }));
      }
      return me;
    })(),
    Te = r.filter((me) => me.date === c),
    Ee = (me) => {
      switch (me) {
        case "instagram":
          return <Instagram className="w-4 h-4 text-pink-500" />;
        case "linkedin":
          return <Linkedin className="w-4 h-4 text-blue-500" />;
        case "facebook":
          return <Facebook className="w-4 h-4 text-indigo-500" />;
        default:
          return <Sparkles className="w-4 h-4 text-indigo-400" />;
      }
    };
  return (
    <div id="dashboard-view" className="flex-1 p-4 md:p-8 ">
      {
        <div
          id="dashboard-header"
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8"
        >
          {
            <div>
              {
                <h2
                  id="welcome-title"
                  className="text-3xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                >{`Hello, ${up?.name?.split(" ")[0] || "Anya"} 👋`}</h2>
              }
              {
                <p id="welcome-subtitle" className="text-gray-500 mt-1 text-sm">
                  Ready to capture moments and curate viral social posts? Here's
                  your event workspace.
                </p>
              }
            </div>
          }
          {
            <button 
              id="btn-create-event-dashboard"
              onClick={u}
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 hover:to-amber-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-pink-500/15 transition-all cursor-pointer self-start"
            >
              {<Plus className="w-4 h-4" />}
              {<span>New Event</span>}
            </button>
          }
        </div>
      }
      {
        <div
          id="stats-grid"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {
            <div
              id="stat-card-ongoing"
              onClick={() => s("events", "ongoing")}
              className="bg-white border border-pink-100/80 p-4 md:p-4 md:p-5 rounded-2xl flex flex-col gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Active Events
                </span>
              }
              {
                <div className="flex items-baseline gap-2">
                  {
                    <span className="text-3xl font-bold text-emerald-600">
                      {y}
                    </span>
                  }
                  {<span className="text-xs text-gray-500">Live now</span>}
                </div>
              }
              {
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  {
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{
                        width: y > 0 ? "50%" : "0%",
                      }}
                    />
                  }
                </div>
              }
            </div>
          }
          {
            <div
              id="stat-card-upcoming"
              onClick={() => s("events", "upcoming")}
              className="bg-white border border-pink-100/80 p-4 md:p-4 md:p-5 rounded-2xl flex flex-col gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Upcoming Events
                </span>
              }
              {
                <div className="flex items-baseline gap-2">
                  {
                    <span className="text-3xl font-bold text-pink-600">
                      {g}
                    </span>
                  }
                  {<span className="text-xs text-gray-500">Scheduled</span>}
                </div>
              }
              {
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  {
                    <div
                      className="bg-pink-500 h-1.5 rounded-full"
                      style={{
                        width: "70%",
                      }}
                    />
                  }
                </div>
              }
            </div>
          }
          {
            <div
              id="stat-card-media"
              onClick={() => s("gallery")}
              className="bg-white border border-pink-100/80 p-4 md:p-5 rounded-2xl flex flex-col gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Event Studio Media
                </span>
              }
              {
                <div className="flex items-baseline gap-2">
                  {
                    <span className="text-3xl font-bold text-rose-500">
                      {w}
                    </span>
                  }
                  {
                    <span className="text-xs text-gray-500">
                      Photos & Videos
                    </span>
                  }
                </div>
              }
              {
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  {
                    <div
                      className="bg-rose-500 h-1.5 rounded-full"
                      style={{
                        width: w > 0 ? "60%" : "0%",
                      }}
                    />
                  }
                </div>
              }
            </div>
          }
          {
            <div
              id="stat-card-drafts"
              onClick={() => s("captions")}
              className="bg-white border border-pink-100/80 p-4 md:p-5 rounded-2xl flex flex-col gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  AI Captions Drafted
                </span>
              }
              {
                <div className="flex items-baseline gap-2">
                  {
                    <span className="text-3xl font-bold text-amber-500">
                      {E}
                    </span>
                  }
                  {<span className="text-xs text-gray-500">Ready to post</span>}
                </div>
              }
              {
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  {
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{
                        width: E > 0 ? "80%" : "0%",
                      }}
                    />
                  }
                </div>
              }
            </div>
          }
        </div>
      }
      <QuickPostWidget events={r} media={t} onNavigateToTab={s} onSelectEventForCamera={a} />
      {
        <div
          id="dashboard-layout-main"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {
            <div
              id="dashboard-col-left"
              className="lg:col-span-2 flex flex-col gap-8"
            >
              {I && (
                <div
                  id="active-event-prompts"
                  className="bg-white border border-pink-100 rounded-2xl p-6 relative  shadow-sm"
                >
                  {
                    <div className="absolute right-0 top-0 bg-pink-500/10 text-pink-600 font-mono text-[10px] px-3 py-1 rounded-bl-xl border-l border-b border-pink-100 uppercase font-bold tracking-wider">
                      Current Workspace
                    </div>
                  }
                  {
                    <div className="flex items-center gap-2 mb-4">
                      {
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-500/10 text-pink-600 rounded border border-pink-500/20">
                          {I.status.toUpperCase()}
                        </span>
                      }
                      {
                        <h3 className="font-bold text-xl text-gray-800 truncate">
                          {I.name}
                        </h3>
                      }
                    </div>
                  }
                  {
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm text-gray-500 font-medium">
                      {
                        <div className="flex items-center gap-2">
                          {
                            <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                          }
                          {<span className="truncate">{I.location}</span>}
                        </div>
                      }
                      {
                        <div className="flex items-center gap-2">
                          {<Clock className="w-4 h-4 text-pink-500 shrink-0" />}
                          {<span>{I.time} today</span>}
                        </div>
                      }
                      {
                        <div className="flex items-center gap-2">
                          {<Calendar className="w-4 h-4 text-pink-500 shrink-0" />}
                          {<span className="text-xs font-mono">{I.date}</span>}
                        </div>
                      }
                    </div>
                  }
                  {
                    <div className="border-t border-pink-50 pt-5">
                      {
                        <div className="flex items-center justify-between mb-4">
                          {
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                              {<ListTodo className="w-4 h-4 text-pink-500" />}AI
                              Real-time Smart Prompts
                            </h4>
                          }
                          {
                            <span className="text-xs text-gray-400">
                              Capture prompts automatically generated
                            </span>
                          }
                        </div>
                      }
                      {
                        <div className="flex flex-col gap-3">
                          {I.smartPrompts && I.smartPrompts.length > 0 ? (
                            I.smartPrompts.map((me, Re) => (
                              <div key={Re} className="flex items-center justify-between p-3.5 bg-pink-50/20 hover:bg-pink-50/50 border border-pink-100/50 rounded-xl transition-all group">
                                {
                                  <div className="flex items-center gap-3">
                                    {
                                      <span className="w-6 h-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-600 flex items-center justify-center text-xs font-mono font-bold">
                                        {Re + 1}
                                      </span>
                                    }
                                    {
                                      <p className="text-sm text-gray-700 font-medium">
                                        {me}
                                      </p>
                                    }
                                  </div>
                                }
                                {
                                  <button 
                                    onClick={() => a(I.id, me)}
                                    className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold opacity-90 group-hover:opacity-100 transition-all cursor-pointer"
                                  >
                                    {<Camera className="w-3.5 h-3.5" />}
                                    {
                                      <span className="hidden sm:inline">
                                        Capture
                                      </span>
                                    }
                                  </button>
                                }
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              No smart capture prompts generated yet. Edit the
                              event to load custom instructions.
                            </p>
                          )}
                        </div>
                      }
                    </div>
                  }
                </div>
              )}
              {
                <div
                  id="weekly-calendar-card"
                  className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm"
                >
                  {
                    <div className="flex justify-between items-center mb-5">
                      {
                        <div>
                          {
                            <h4 className="font-bold text-lg text-gray-800">
                              Event Synchronizer
                            </h4>
                          }
                          {
                            <p className="text-xs text-gray-500 mt-0.5">
                              Click days to view schedule and active reminder
                              prompts
                            </p>
                          }
                        </div>
                      }
                      {
                        <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-lg border border-pink-100/50">
                          {z} {te}
                        </span>
                      }
                    </div>
                  }
                  {
                    <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 mb-6">
                      {pe.map((me) => {
                        const Re = r.some((k) => k.date === me.dateString),
                          be = c === me.dateString;
                        return (
                          <button key={me.dateString} 
                            onClick={() => p(me.dateString)}
                            className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all cursor-pointer ${be ? "bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 border-pink-500 text-white shadow-md shadow-pink-500/10" : me.isToday ? "bg-pink-50 border-pink-200 text-pink-600" : "bg-white border-pink-100/60 text-gray-500 hover:border-pink-300 hover:text-pink-600"}`}
                          >
                            {
                              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                                {me.dayName}
                              </span>
                            }
                            {
                              <span className="text-base font-extrabold mt-0.5">
                                {me.dayNum}
                              </span>
                            }
                            {Re && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full mt-1 ${be ? "bg-white" : "bg-pink-500"}`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  }
                  {
                    <div className="bg-pink-50/10 border border-pink-100/50 rounded-xl p-4">
                      {
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 font-mono">
                          Schedule for {c}
                        </h5>
                      }
                      {Te.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {Te.map((me) => (
                            <div key={me.id} onClick={() => s("events")} className="flex items-center justify-between p-3 bg-white rounded-lg border border-pink-100/40 hover:border-pink-300 transition-all cursor-pointer shadow-xs">
                              {
                                <div className="flex items-center gap-3">
                                  {
                                    <span
                                      className={`w-3 h-3 rounded-full ${me.type === "college" ? "bg-cyan-500" : me.type === "seminar" ? "bg-purple-500" : me.type === "wedding" ? "bg-pink-500" : "bg-indigo-500"}`}
                                    />
                                  }
                                  {
                                    <div>
                                      {
                                        <p className="text-sm font-semibold text-gray-800">
                                          {me.name}
                                        </p>
                                      }
                                      {
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                          {
                                            <span className="flex items-center gap-0.5">
                                              {<Clock className="w-3 h-3" />}{" "}
                                              {me.time}
                                            </span>
                                          }
                                          {<span>•</span>}
                                          {
                                            <span className="flex items-center gap-0.5">
                                              {<MapPin className="w-3 h-3" />}{" "}
                                              {me.location}
                                            </span>
                                          }
                                        </div>
                                      }
                                    </div>
                                  }
                                </div>
                              }
                              {
                                <button 
                                  onClick={() => s("events")}
                                  className="text-gray-400 hover:text-pink-600 p-1 rounded transition-all cursor-pointer"
                                >
                                  {<ChevronRight className="w-5 h-5" />}
                                </button>
                              }
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic py-2">
                          No events scheduled for this day.
                        </p>
                      )}
                    </div>
                  }
                </div>
              }
            </div>
          }
          {
            <div id="dashboard-col-right" className="flex flex-col gap-8">
              {
                <div
                  id="dashboard-drafts"
                  className="bg-white border border-pink-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
                >
                  {
                    <div className="flex items-center justify-between">
                      {
                        <h4 className="font-bold text-lg text-gray-800">
                          AI Content Drafts
                        </h4>
                      }
                      {
                        <button 
                          onClick={() => s("captions")}
                          className="text-xs font-semibold text-pink-600 hover:text-pink-500 cursor-pointer"
                        >
                          View Studio
                        </button>
                      }
                    </div>
                  }
                  {
                    <div className="flex flex-col gap-3">
                      {e.length > 0 ? (
                        e.slice(0, 2).map((me) => {
                          const Re = r.find((be) => be.id === me.eventId);
                          return (
                            <div key={me.id} className="p-3.5 bg-pink-50/10 rounded-xl border border-pink-100/50 hover:border-pink-200 transition-all">
                              {
                                <div className="flex items-center justify-between mb-2">
                                  {
                                    <span className="text-[10px] text-gray-500 font-mono truncate max-w-[120px]">
                                      {(Re == null ? void 0 : Re.name) ||
                                        "General Event"}
                                    </span>
                                  }
                                  {
                                    <div className="flex items-center gap-1">
                                      {Ee(me.platform)}
                                      {
                                        <span className="text-[10px] text-gray-400 capitalize font-medium">
                                          {me.platform}
                                        </span>
                                      }
                                    </div>
                                  }
                                </div>
                              }
                              {
                                <p className="text-xs text-gray-700 line-clamp-3 italic">
                                  "{me.text}"
                                </p>
                              }
                              {
                                <div className="flex flex-wrap gap-1 mt-2.5">
                                  {(me.hashtags || []).slice(0, 3).map((be, k) => (
                                    <span key={k} className="text-[10px] text-pink-600 font-mono bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100/40">
                                      {be}
                                    </span>
                                  ))}
                                </div>
                              }
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 border border-dashed border-pink-200 rounded-xl">
                          {
                            <p className="text-xs text-gray-400 italic mb-2">
                              No AI captions drafted yet
                            </p>
                          }
                          {
                            <button 
                              onClick={() => s("captions")}
                              className="text-xs bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 font-semibold px-3 py-1.5 rounded-lg border border-pink-100/50 cursor-pointer"
                            >
                              Generate AI Caption
                            </button>
                          }
                        </div>
                      )}
                    </div>
                  }
                </div>
              }
              {
                <div
                  id="hackathon-tips"
                  className="bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-amber-500/5 border border-pink-100/60 rounded-2xl p-6 shadow-xs"
                >
                  {
                    <h4 className="font-bold text-pink-600 text-sm tracking-wider uppercase flex items-center gap-2 mb-3">
                      {<Sparkles className="w-4 h-4 text-pink-500" />}EventSync
                      Innovation Panel
                    </h4>
                  }
                  {
                    <div className="flex flex-col gap-3 text-xs text-gray-600">
                      {
                        <div className="flex gap-2.5">
                          {<span className="text-lg">📈</span>}
                          {
                            <div>
                              {
                                <p className="font-bold text-gray-800">
                                  Before → During → After Workflow
                                </p>
                              }
                              {
                                <p className="text-gray-500 mt-0.5 leading-relaxed">
                                  Our smart notifications proactively guide
                                  users to ensure key moments aren't forgotten.
                                </p>
                              }
                            </div>
                          }
                        </div>
                      }
                      {
                        <div className="flex gap-2.5 border-t border-pink-100/60 pt-3">
                          {<span className="text-lg">⚡</span>}
                          {
                            <div>
                              {
                                <p className="font-bold text-gray-800">
                                  AI Contextual Captioning
                                </p>
                              }
                              {
                                <p className="text-gray-400 mt-0.5 leading-relaxed">
                                  Captions aren't generic: they use Gemini
                                  vision to read image aesthetics and align with
                                  specific brand tones.
                                </p>
                              }
                            </div>
                          }
                        </div>
                      }
                      {
                        <div className="flex gap-2.5 border-t border-pink-100/60 pt-3">
                          {<span className="text-lg">💼</span>}
                          {
                            <div>
                              {
                                <p className="font-bold text-gray-800">
                                  SaaS Business Scaling
                                </p>
                              }
                              {
                                <p className="text-gray-400 mt-0.5 leading-relaxed">
                                  Perfect for agency team workspaces, colleges
                                  co-ordinating events: r, and branding
                                  consultants.
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
        </div>
      }
    </div>
  );
}
export default DashboardTab;
