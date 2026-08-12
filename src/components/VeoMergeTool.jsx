import React from "react";
import { Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Calendar, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Unlink, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function VeoMergeTool({
  selectedMedia,
  onSaveMedia,
  onTriggerCaptionFromMedia,
}) {
  const [loading, setLoading] = React.useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = React.useState("");
  const [generatedVideoBase64, setGeneratedVideoBase64] = React.useState("");
  const mediaArray = Array.isArray(selectedMedia)
    ? selectedMedia
    : [selectedMedia];
  const handleMerge = async () => {
    setLoading(true);
    try {
      const endpoint = "/api/merge-videos";
      const body = {
        videos: mediaArray.map((m2) => m2.base64Data),
      };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedVideoBase64(
        "data:" +
          (data.mimeType || "video/mp4") +
          ";base64," +
          data.videoBase64,
      );
      const res2 = await fetch("data:" + (data.mimeType || "video/mp4") + ";base64," + data.videoBase64);
      const blob = await res2.blob();
      setGeneratedVideoUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.image) {
        setResultImage(data.image);
      } else {
        alert("Failed to generate image: " + data.text);
      }
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleContinue = () => {
    if (!generatedVideoBase64) return;
    const newMedia = {
      id: "media_" + Date.now(),
      eventId: mediaArray[0]?.eventId || "default",
      base64Data: generatedVideoBase64,
      mimeType: "video/mp4",
      timestamp: Date.now(),
    };
    if (onSaveMedia) {
      onSaveMedia(newMedia);
    }
    if (onTriggerCaptionFromMedia) {
      onTriggerCaptionFromMedia(newMedia.eventId, newMedia.id);
    }
    window.selectedVideoForVeo = null;
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col gap-6 w-full">
      {
        <h2 className="text-xl font-bold text-gray-800">
          {mediaArray.length > 1
            ? "Merge Selected Videos"
            : "Apply & Save Clip"}
        </h2>
      }
      {
        <div className="flex flex-col gap-6">
          {
            <p className="text-sm font-semibold text-gray-600">{`Selected Media (${mediaArray.length})`}</p>
          }
          {
            <div className="flex flex-wrap gap-4">
              {mediaArray.map((mItem, idx) => (
                <div className="w-40 h-40 bg-black rounded-xl overflow-hidden relative">
                  {mItem.mimeType && mItem.mimeType.startsWith("video/") ? (
                    <video
                      src={mItem.base64Data}
                      className="w-full h-full object-cover"
                      muted={true}
                      autoPlay={true}
                      loop={true}
                    />
                  ) : (
                    <img
                      src={mItem.base64Data}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded">{`#${idx + 1}`}</div>
                  }
                </div>
              ))}
            </div>
          }
          {
            <button
              onClick={handleMerge}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50 self-start"
            >
              {loading
                ? "Merging Videos (this may take a moment)..."
                : "Merge Videos"}
            </button>
          }
        </div>
      }
      {generatedVideoUrl && (
        <div className="mt-6 border-t border-gray-100 pt-6 flex flex-col gap-4 animate-in fade-in">
          {
            <h3 className="text-lg font-bold text-gray-800">
              Merged Video Result
            </h3>
          }
          {
            <video
              src={generatedVideoUrl}
              controls={true}
              autoPlay={true}
              className="w-full rounded-xl bg-black max-h-[400px]"
            />
          }
          {
            <button
              onClick={handleContinue}
              className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-all selfnd shadow-lg flex items-center gap-2"
            >
              Continue to AI Caption Studio →
            </button>
          }
        </div>
      )}
    </div>
  );
}
export default VeoMergeTool;
