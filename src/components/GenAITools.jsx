import React from "react";
import VeoMergeTool from "./VeoMergeTool";
import AnalyzeVideoTool from "./AnalyzeVideoTool";
import ImageEditTool from "./ImageEditTool";
import { Sparkles, Image, Video, Wand2, Layers, ExternalLink } from 'lucide-react';

function GenAITools({
  onNavigateToTab,
  onSaveMedia,
  onTriggerCaptionFromMedia,
  events,
  allMedia,
}) {
  const selectedMedia = window.selectedVideoForVeo;
  const [activeTab, setActiveTab] = React.useState(() => 
    selectedMedia ? "video-merge" : "generate-ai"
  );

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-pink-500" />
          AI Media Generator & Video Tools
        </h1>
        <p className="text-gray-500 text-sm">
          Create, edit, merge, and analyze event media using advanced generative AI models.
        </p>
      </div>

      {/* Persistent top navigation bar for Gen AI options */}
      <div className="flex gap-2 mb-8 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200 self-start overflow-x-auto w-full">
        <button
          type="button"
          onClick={() => setActiveTab("generate-ai")}
          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "generate-ai"
              ? "bg-white shadow-sm text-pink-600 border border-pink-100"
              : "text-gray-600 hover:bg-gray-200/70"
          }`}
        >
          <Sparkles className="w-4 h-4 text-pink-500" />
          Generate with AI
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("edit-image")}
          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "edit-image"
              ? "bg-white shadow-sm text-pink-600 border border-pink-100"
              : "text-gray-600 hover:bg-gray-200/70"
          }`}
        >
          <Wand2 className="w-4 h-4 text-pink-500" />
          Edit Image
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("analyze")}
          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "analyze"
              ? "bg-white shadow-sm text-pink-600 border border-pink-100"
              : "text-gray-600 hover:bg-gray-200/70"
          }`}
        >
          <Image className="w-4 h-4 text-pink-500" />
          Analyze Media
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("video-merge")}
          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "video-merge"
              ? "bg-white shadow-sm text-pink-600 border border-pink-100"
              : "text-gray-600 hover:bg-gray-200/70"
          }`}
        >
          <Layers className="w-4 h-4 text-pink-500" />
          Merge Media
        </button>
      </div>

      {/* Tab contents */}
      {activeTab === "generate-ai" && (
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              Generate with AI
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Select an external AI generation tool below to craft high-resolution photos and videos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://imagegeneration-sigma.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border-2 border-pink-100 hover:border-pink-500 bg-gradient-to-br from-pink-50/50 to-rose-50/30 rounded-2xl transition-all shadow-xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                  <Image className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-pink-600 transition-colors flex items-center gap-1.5">
                  Generate Image
                  <ExternalLink className="w-4 h-4 text-pink-500 opacity-70 group-hover:opacity-100" />
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Open the specialized high-resolution AI Image Generator app to turn prompts into custom event artwork.
                </p>
              </div>
              <div className="mt-6 text-xs font-bold text-pink-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Image Generator &rarr;
              </div>
            </a>

            <a
              href="https://huggingface.co/spaces/AyushM11/text-to-video-app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border-2 border-purple-100 hover:border-purple-500 bg-gradient-to-br from-purple-50/50 to-pink-50/30 rounded-2xl transition-all shadow-xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-600 transition-colors flex items-center gap-1.5">
                  Generate Video
                  <ExternalLink className="w-4 h-4 text-purple-500 opacity-70 group-hover:opacity-100" />
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Open the Text-to-Video AI suite to generate motion video clips and cinematic promos.
                </p>
              </div>
              <div className="mt-6 text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Video Generator &rarr;
              </div>
            </a>
          </div>
        </div>
      )}

      {activeTab === "edit-image" && (
        <ImageEditTool
          events={events}
          allMedia={allMedia}
          onSaveMedia={onSaveMedia}
        />
      )}

      {activeTab === "analyze" && (
        <AnalyzeVideoTool events={events} allMedia={allMedia} />
      )}

      {activeTab === "video-merge" && (
        <VeoMergeTool
          selectedMedia={selectedMedia || []}
          onSaveMedia={onSaveMedia}
          onTriggerCaptionFromMedia={onTriggerCaptionFromMedia}
        />
      )}
    </div>
  );
}

export default GenAITools;
