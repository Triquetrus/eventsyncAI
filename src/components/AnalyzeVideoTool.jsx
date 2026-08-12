import React from "react";
import { Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Calendar, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Unlink, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function AnalyzeVideoTool({ events, allMedia }) {
  const [prompt2, setPrompt] = React.useState("");
  const [mediaFile, setMediaFile] = React.useState(null);
  const [mediaBase64, setMediaBase64] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState("");
  const fileInputRef = React.useRef(null);
  const [showEventFolders, setShowEventFolders] = React.useState(false);
  const [selectedEventId, setSelectedEventId] = React.useState(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setMediaBase64(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const selectExistingMedia = (media) => {
    const data = media.url || media.base64Data;
    setMediaBase64(data);
    setMediaFile({
      name: media.name || "Event Media",
      type:
        media.mimeType ||
        (data && data.startsWith("data:image/")
          ? "image/jpeg"
          : media.type === "video" ? "video/mp4" : "image/jpeg"),
    });
    setShowEventFolders(false);
  };
  const handleAnalyze = async () => {
    if (!mediaBase64) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt2,
          videoBase64: mediaBase64,
          videoType: mediaFile?.type,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col gap-4">
      {
        <h2 className="text-lg font-bold text-gray-800">
          Analyze Media Content
        </h2>
      }
      {
        <div className="flex flex-col gap-4 items-start w-full">
          {
            <div className="flex gap-2 w-full flex-wrap">
              {
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-lg border border-gray-200"
                >
                  {mediaFile
                    ? `Selected: ${mediaFile.name}`
                    : "Upload Media to Analyze"}
                  {
                    <input
                      type="file"
                      accept="image/*,video/*"
                      ref={fileInputRef}
                      onChange={handleFile}
                      className="hidden"
                    />
                  }
                </button>
              }
              {
                <button
                  onClick={() => setShowEventFolders(!showEventFolders)}
                  className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-sm rounded-lg border border-pink-200 flex items-center gap-2"
                >
                  Select from Event Folders
                </button>
              }
            </div>
          }
          {showEventFolders && (
            <div className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col gap-4 max-h-64 overflow-y-auto">
              {
                <h3 className="font-semibold text-gray-700">
                  Event-wise Organised Folders
                </h3>
              }
              {
                <div className="flex flex-wrap gap-2">
                  {events &&
                    events.map((ev) => (
                      <button
                        onClick={() =>
                          setSelectedEventId(
                            ev.id === selectedEventId ? null : ev.id,
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedEventId === ev.id ? "bg-pink-100 border-pink-300 text-pink-800" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                      >
                        {ev.name || "Unnamed Event"}
                      </button>
                    ))}
                </div>
              }
              {selectedEventId && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                  {allMedia &&
                  allMedia.filter((mItem) => mItem.eventId === selectedEventId)
                    .length > 0 ? (
                    allMedia
                      .filter((mItem) => mItem.eventId === selectedEventId)
                      .map((mItem, idx) => {
                        const mediaSrc = mItem.url || mItem.base64Data;
                        const isImage = (mItem.mimeType && mItem.mimeType.startsWith("image/")) || (mediaSrc && mediaSrc.startsWith("data:image/")) || mItem.type === "image";
                        return (
                          <div
                            key={mItem.id || idx}
                            onClick={() => selectExistingMedia(mItem)}
                            className="aspect-square bg-black rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-pink-500"
                          >
                            {isImage ? (
                              <img
                                src={mediaSrc}
                                alt="Event media"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={mediaSrc}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <div className="col-span-full text-sm text-gray-500">
                      No media found in this event.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {mediaBase64 &&
            (mediaBase64.startsWith("data:image/") ? (
              <img
                src={mediaBase64}
                className="w-full max-h-64 rounded-xl object-contain bg-black"
              />
            ) : (
              <video
                src={mediaBase64}
                controls={true}
                className="w-full max-h-64 rounded-xl bg-black"
              />
            ))}
          {
            <textarea
              value={prompt2}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What do you want to know about this media? (e.g. 'Describe what is happening in this media.')"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-sm min-h-[100px]"
            />
          }
        </div>
      }
      {
        <button
          onClick={handleAnalyze}
          disabled={loading || !mediaBase64}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-2.5 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all self-start disabled:opacity-50"
        >
          {loading ? (
            "Analyzing Media..."
          ) : (
            <div className="flex items-center justify-center gap-2">
              {
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  }
                  {<path d="M5 3v4" />}
                  {<path d="M3 5h4" />}
                </svg>
              }
              Analyze Media
            </div>
          )}
        </button>
      }
      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap">
          {
            <strong className="block mb-2 text-pink-600">
              Analysis Result:
            </strong>
          }
          {result}
        </div>
      )}
    </div>
  );
}
export default AnalyzeVideoTool;
