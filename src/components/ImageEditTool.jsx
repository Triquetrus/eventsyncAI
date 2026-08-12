import React from "react";
import { Sparkles, Wand2, Image as ImageIcon, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

function ImageEditTool({ events, allMedia, onSaveMedia }) {
  const [prompt2, setPrompt] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [resultImage, setResultImage2] = React.useState("");
  const [showEventFolders, setShowEventFolders] = React.useState(false);
  const [selectedEventId, setSelectedEventId] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const images = allMedia
    ? allMedia.filter(
        (m2) =>
          (m2.mimeType && m2.mimeType.startsWith("image/")) ||
          (m2.base64Data && m2.base64Data.startsWith("data:image/")) ||
          (m2.url && !m2.mimeType?.startsWith("video/")) ||
          m2.type === "image",
      )
    : [];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage({
          id: "upload_" + Date.now(),
          base64Data: ev.target.result,
          mimeType: file.type || "image/png",
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!prompt2 || !selectedImage) return;
    setLoading(true);
    setResultImage2("");
    try {
      const imgData = selectedImage.url || selectedImage.base64Data;
      const res = await fetch("/api/edit-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt2,
          imageBase64: imgData,
          imageType: selectedImage.mimeType || "image/png",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to edit image");
      if (data.image) {
        setResultImage2(data.image);
      } else {
        alert("Failed to get image from editor model");
      }
    } catch (e) {
      alert("Image Edit Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt2) return;
    setLoading(true);
    setResultImage2("");
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
      if (!res.ok || data.error) throw new Error(data.error || "Failed to generate image");
      if (data.image) {
        setResultImage2(data.image);
      } else {
        alert("Failed to generate image");
      }
    } catch (e) {
      alert("Generation Error: " + e.message);
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
      timestamp: new Date().toISOString(),
    };
    if (onSaveMedia) onSaveMedia(newMedia);
    alert("Edited image saved to your media gallery!");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-pink-600" />
          AI Image Editor & Synthesizer
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Select an image from gallery/events or upload a file, enter your desired modifications, and Gemini + Imagen will re-synthesize it.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Step 1: Select Base Image
        </label>
        
        <div className="flex gap-2 items-center flex-wrap">
          <button
            type="button"
            onClick={() => {
              setShowEventFolders(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              !showEventFolders ? "bg-pink-50 border-pink-300 text-pink-700 shadow-xs" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Gallery Images ({images.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setShowEventFolders(true);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              showEventFolders ? "bg-pink-50 border-pink-300 text-pink-700 shadow-xs" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Event Folders
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-dashed border-pink-300 bg-pink-50/50 hover:bg-pink-100/50 text-pink-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload New File
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>
        </div>

        {!showEventFolders ? (
          <div className="flex gap-2 overflow-x-auto p-3 border border-gray-200 rounded-xl bg-gray-50/50 min-h-[72px]">
            {images.length === 0 ? (
              <p className="text-xs text-gray-500 self-center">
                No gallery images found. Upload a file above to begin!
              </p>
            ) : (
              images.map((img) => {
                const src = img.url || img.base64Data;
                const isSelected = selectedImage?.id === img.id;
                return (
                  <img
                    key={img.id}
                    src={src}
                    alt="Gallery thumbnail"
                    referrerPolicy="no-referrer"
                    className={`h-14 w-14 object-cover rounded-lg cursor-pointer border-2 transition-all shrink-0 ${
                      isSelected ? "border-pink-600 scale-105 shadow-md ring-2 ring-pink-300" : "border-gray-200 hover:border-pink-300 opacity-80 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                );
              })
            )}
          </div>
        ) : (
          <div className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50/50 flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              {events && events.length > 0 ? (
                events.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() =>
                      setSelectedEventId(ev.id === selectedEventId ? null : ev.id)
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      selectedEventId === ev.id
                        ? "bg-pink-100 border-pink-300 text-pink-800 font-bold"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {ev.name || "Unnamed Event"}
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-400">No events found.</p>
              )}
            </div>
            {selectedEventId && (
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mt-1">
                {images.filter((mItem) => mItem.eventId === selectedEventId).length > 0 ? (
                  images
                    .filter((mItem) => mItem.eventId === selectedEventId)
                    .map((mItem) => {
                      const src = mItem.url || mItem.base64Data;
                      const isSelected = selectedImage?.id === mItem.id;
                      return (
                        <img
                          key={mItem.id}
                          onClick={() => setSelectedImage(mItem)}
                          src={src}
                          alt="Event thumbnail"
                          referrerPolicy="no-referrer"
                          className={`aspect-square object-cover rounded-lg cursor-pointer border-2 transition-all ${
                            isSelected ? "border-pink-600 scale-105 shadow-md ring-2 ring-pink-300" : "border-gray-200 hover:border-pink-300"
                          }`}
                        />
                      );
                    })
                ) : (
                  <div className="col-span-full text-xs text-gray-500">
                    No images found in this event.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Image Active Box */}
      {selectedImage && (
        <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedImage.url || selectedImage.base64Data}
              alt="Selected base"
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-cover rounded-lg border border-pink-300 bg-black shrink-0"
            />
            <div>
              <p className="text-xs font-bold text-gray-900">Base Image Selected</p>
              <p className="text-[11px] text-gray-500 truncate max-w-[200px]">
                {selectedImage.name || selectedImage.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="text-xs font-bold text-gray-400 hover:text-red-500 px-2 py-1 rounded bg-white border border-gray-200 hover:border-red-200 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Prompt Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Step 2: Describe Requested Edits / New Scene
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs md:text-sm resize-none"
          rows={3}
          placeholder="e.g. Change the background into a vibrant festival stage with warm sunset lighting and colorful confetti..."
          value={prompt2}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs md:text-sm"
          onClick={handleEdit}
          disabled={loading || !prompt2 || !selectedImage}
        >
          <Wand2 className="w-4 h-4" />
          {loading ? "Gemini Synthesizing Edit..." : "Generate Gemini Image Edit"}
        </button>

        <a
          href="https://imagegeneration-sigma.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs md:text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Generate New Scene &rarr;
        </a>
      </div>

      {!selectedImage && prompt2 && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Select a base image above for <strong>Gemini Image Editing</strong>, or click <strong>Generate New Scene</strong> to open the full AI Image Generator.</span>
        </div>
      )}

      {/* Result Display */}
      {resultImage && (
        <div className="mt-2 flex flex-col gap-4 p-4 border border-emerald-200 bg-emerald-50/50 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            AI Output Generated Successfully!
          </div>
          <img
            src={resultImage}
            alt="Result output"
            className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm"
          />
          <button
            type="button"
            className="bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors self-start cursor-pointer flex items-center gap-1.5"
            onClick={handleSave}
          >
            <ImageIcon className="w-4 h-4" /> Save to Event Gallery
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageEditTool;
