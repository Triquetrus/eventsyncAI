import React from "react";
import { Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Calendar, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Unlink, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function ImageGenerationTool({ onSaveMedia }) {
  const [prompt2, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resultImage, setResultImage2] = React.useState("");
  const handleGenerate = async () => {
    if (!prompt2) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt2,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.image) {
        setResultImage2(data.image);
      } else {
        alert("Failed to generate image: " + data.text);
      }
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSave = () => {
    if (!resultImage) return;
    const newMedia = {
      id: "media_" + Date.now(),
      base64Data: resultImage,
      mimeType: "image/jpeg",
      timestamp: /* @__PURE__ */ new Date().toISOString(),
    };
    if (onSaveMedia) onSaveMedia(newMedia);
    alert("Generated image saved to gallery!");
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col gap-6">
      {
        <h2 className="text-xl font-bold text-gray-800">
          Generate Image (Imagen 3)
        </h2>
      }
      {
        <div className="flex flex-col gap-2">
          {
            <label className="text-sm font-semibold text-gray-700">
              Generation Prompt
            </label>
          }
          {
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm resize-none"
              rows={3}
              placeholder="e.g. A futuristic city skyline at sunset..."
              value={prompt2}
              onChange={(e) => setPrompt(e.target.value)}
            />
          }
        </div>
      }
      {
        <button
          className="w-full text-white font-bold py-4 px-4 rounded-xl transition-colors disabled:opacity-50 shadow-md mt-4"
          style={{
            backgroundColor: "#ec4899",
          }}
          onClick={handleGenerate}
          disabled={loading || !prompt2}
        >
          {loading ? "Generating Image..." : "\u2728 Generate Image"}
        </button>
      }
      {resultImage && (
        <div className="mt-6 flex flex-col gap-4 p-4 border border-green-200 bg-green-50 rounded-xl">
          {
            <p className="text-sm font-semibold text-green-800">
              Generation Successful!
            </p>
          }
          {
            <img
              src={resultImage}
              className="w-full max-w-[200px] rounded-xl border border-gray-200 bg-white"
            />
          }
          {
            <button
              className="bg-gray-900 hover:bg-black text-white font-bold py-2 px-4 rounded-xl transition-colors self-start"
              onClick={handleSave}
            >
              Save to Gallery
            </button>
          }
        </div>
      )}
    </div>
  );
}
export default ImageGenerationTool;
