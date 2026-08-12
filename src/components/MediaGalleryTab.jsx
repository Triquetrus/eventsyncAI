import React from "react";
import { Maximize2, Minimize2, UploadCloud, Bell, BookmarkCheck, Bookmark, Briefcase, CalendarDays, Calendar, Camera, CheckCheck, Check, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Clock, Copy, MoreHorizontal, Eye, Facebook, FolderHeart, GraduationCap, Globe, Heart, Image, Info, Instagram, LayoutDashboard, Linkedin, ListTodo, Lock, MapPin, Menu, MessageCircle, MessageSquare, Plus, Repeat, Send, Settings, Share2, ShieldCheck, Sparkle, Sparkles, SquarePen, Star, ThumbsUp, Trash2, Unlink, Upload, UserPlus, UserRoundCheck, Users, X, Zap } from 'lucide-react';
function MediaGalleryTab({
  events: r,
  media: e,
  onSaveMedia: t,
  onDeleteMedia: s,
  onTriggerCaptionFromMedia: a,
  presetEventId: u,
  presetPromptText: c,
  onNavigateToTab: onNav,
}) {
  const [showEditor, setShowEditor] = React.useState(false);
  const [exportProgress, setExportProgress] = React.useState(0);
  const [isExporting, setIsExporting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("adjust");
  const [videoSettings, setVideoSettings] = React.useState({});
  const [activeVideoIndex, setActiveVideoIndex] = React.useState(0);
  const [mergedMedia, setMergedMedia] = React.useState(null);
  const getSettings = (idx) =>
    videoSettings[idx] || {
      filter: "normal",
      brightness: 100,
      contrast: 100,
      volume: 100,
    };
  const updateSetting = (key, val) =>
    setVideoSettings((prev) => ({
      ...prev,
      [activeVideoIndex]: {
        ...getSettings(activeVideoIndex),
        [key]: val,
      },
    }));
  const currSettings = getSettings(activeVideoIndex);
  const videoFilter = currSettings.filter;
  const videoBrightness = currSettings.brightness;
  const videoContrast = currSettings.contrast;
  const videoVolume = currSettings.volume;
  React.useEffect(() => {}, []);
  const mergeVideo = () => {
    const selectedMedia = ce.filter((m) => V.includes(m.id));
    if (selectedMedia.length > 0) {
      window.selectedVideoForVeo = selectedMedia;
    }
    if (onNav) {
      onNav("genai");
    } else {
      setShowEditor(true);
    }
  };
  var Xe;
  const [lightboxMedia, setLightboxMedia] = React.useState(null);
  const [p, g] = React.useState(
      u || ((Xe = r[0]) == null ? void 0 : Xe.id) || "",
    ),
    [y, E] = React.useState(!1),
    [w, I] = React.useState(null),
    [V, z] = React.useState([]),
    [te, oe] = React.useState("none"),
    [pe, Te] = React.useState(!1),
    [facingMode, setFacingMode] = React.useState("user"),
    [cameraCount, setCameraCount] = React.useState(0),
    [isRecording, setIsRecording] = React.useState(!1),
    [isFullScreenCam, setIsFullScreenCam] = React.useState(!1),
    mediaRecorderRef = React.useRef(null),
    recordedChunksRef = React.useRef([]),
    Ee = React.useRef(null),
    me = React.useRef(null);
  React.useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          setCameraCount(devices.filter((d) => d.kind === "videoinput").length);
        })
        .catch(() => {});
    }
  }, []);
  let Re = React.useRef(null);
  (React.useEffect(() => {
    u && g(u);
  }, [u]),
    React.useEffect(
      () => () => {
        w && w.getTracks().forEach((N) => N.stop());
      },
      [w],
    ));
  const handleCameraError = (err) => {
    console.warn("Camera inaccessible:", err);
    if (err && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
      alert("Camera permission was denied. Please allow camera and microphone access in your browser settings and try again.");
    } else if (err && (err.name === "NotFoundError" || err.name === "OverconstrainedError" || err.name === "DevicesNotFoundError")) {
      alert("No camera or microphone was found on this device.");
    } else if (err && (err.name === "NotReadableError" || err.name === "TrackStartError")) {
      alert("Your camera is already in use by another application. Close other apps using it and try again.");
    } else {
      alert("Camera failed to start. Please grant camera and microphone permissions, or open in a new tab.");
    }
  };

  const be = async () => {
      try {
        (E(!0), Te(!1));
        const N = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: {
              ideal: 640,
            },
            height: {
              ideal: 480,
            },
          },
          audio: true,
        });
        (I(N), Ee.current && (Ee.current.srcObject !== N && (Ee.current.srcObject = N), Ee.current.play().catch(() => {})));
      } catch (N) {
        handleCameraError(N);
        E(!1);
      }
    },
    k = () => {
      (w && (w.getTracks().forEach((N) => N.stop()), I(null)), E(!1));
    },
    flipCamera = async () => {
      const newMode = facingMode === "user" ? "environment" : "user";
      setFacingMode(newMode);
      if (w) {
        w.getTracks().forEach((tr) => tr.stop());
        I(null);
      }
      try {
        const N = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: newMode },
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: true,
        });
        I(N);
        if (Ee.current) {
          if (Ee.current.srcObject !== N) Ee.current.srcObject = N;
          Ee.current.play().catch(() => {});
        }
      } catch (e) {
        try {
          const N = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: newMode,
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            audio: true,
          });
          I(N);
          if (Ee.current) {
            if (Ee.current.srcObject !== N) Ee.current.srcObject = N;
            Ee.current.play().catch(() => {});
          }
        } catch (err) {
          handleCameraError(err);
          E(!1);
        }
      }
    },
    startRecording = () => {
      if (!w) return;
      recordedChunksRef.current = [];
      try {
        const mr = new MediaRecorder(w, {
          mimeType: "video/webm",
        });
        mr.ondataavailable = (ev) => {
          if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
        };
        mr.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, {
            type: "video/webm",
          });
          const reader = new FileReader();
          reader.onloadend = () => {
            t({
              eventId: p,
              base64Data: reader.result,
              mimeType: "video/webm",
              isHighlighted: false,
              timestamp: new Date().toISOString(),
            });
            k();
          };
          reader.readAsDataURL(blob);
        };
        mediaRecorderRef.current = mr;
        mr.start();
        setIsRecording(true);
      } catch (err) {
        console.warn(err.message || err);
      }
    },
    stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    },
    C = () => {
      if (pe) {
        const N = r.find((ue) => ue.id === p),
          G = (N == null ? void 0 : N.type) || "general";
        let le =
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80";
        G === "college"
          ? (le =
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80")
          : G === "club" || G === "personal"
            ? (le =
                "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80")
            : G === "wedding"
              ? (le =
                  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80")
              : G === "corporate" &&
                (le =
                  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80");
        const J = {
          eventId: p,
          base64Data: le,
          mimeType: "image/jpeg",
          isHighlighted: !1,
          timestamp: new Date().toISOString(),
        };
        (t(J), k());
        return;
      }
      if (Ee.current && me.current) {
        const N = Ee.current,
          G = me.current,
          le = G.getContext("2d");
        if (le) {
          ((G.width = N.videoWidth || 640),
            (G.height = N.videoHeight || 480),
            le.drawImage(N, 0, 0, G.width, G.height),
            te === "grayscale"
              ? (le.filter = "grayscale(100%)")
              : te === "sepia"
                ? (le.filter = "sepia(80%)")
                : te === "vibrant"
                  ? (le.filter = "saturate(180%) contrast(110%)")
                  : te === "cool" &&
                    (le.filter = "hue-rotate(20deg) saturate(120%)"));
          const J = G.toDataURL("image/jpeg"),
            ue = {
              eventId: p,
              base64Data: J,
              mimeType: "image/jpeg",
              isHighlighted: !1,
              timestamp: new Date().toISOString(),
            };
          (t(ue), k());
        }
      }
    },
    O = () => {
      var N;
      (N = Re.current) == null || N.click();
    },
    L = (N) => {
      var le;
      const G = (le = N.target.files) == null ? void 0 : le[0];
      if (G) {
        const J = new FileReader();
        ((J.onloadend = () => {
          const ue = J.result;
          t({
            eventId: p,
            base64Data: ue,
            mimeType: G.type,
            isHighlighted: !1,
            timestamp: new Date().toISOString(),
          });
        }),
          J.readAsDataURL(G));
      }
    },
    M = (N) => {
      N.preventDefault();
    },
    P = (N) => {
      var le;
      N.preventDefault();
      const G = (le = N.dataTransfer.files) == null ? void 0 : le[0];
      if (G && G.type.startsWith("image/")) {
        const J = new FileReader();
        ((J.onloadend = () => {
          const ue = J.result;
          t({
            eventId: p,
            base64Data: ue,
            mimeType: G.type,
            isHighlighted: !1,
            timestamp: new Date().toISOString(),
          });
        }),
          J.readAsDataURL(G));
      }
    },
    R = async (N) => {
      await t({
        ...N,
        isHighlighted: !N.isHighlighted,
      });
    },
    rt = (N) => {
      z((G) => (G.includes(N) ? G.filter((le) => le !== N) : [...G, N]));
    },
    pt = (N) => {
      V.length === N.length ? z([]) : z(N.map((G) => G.id));
    },
    X = () => {
      const N = e.filter((G) => V.includes(G.id));
      if (N.length === 0) {
        alert(
          "Please select at least one photo or video to generate captions.",
        );
        return;
      }
      a(N, p);
    },
    ce = e.filter((N) => N.eventId === p),
    ne = r.find((N) => N.id === p),
    De = () => {
      switch (te) {
        case "grayscale":
          return "grayscale";
        case "sepia":
          return "sepia";
        case "vibrant":
          return "saturate-150 contrast-110 brightness-105";
        case "cool":
          return "hue-rotate-15 saturate-125";
        default:
          return "";
      }
    };
  return (
    <div id="media-manager-view" className="flex-1 p-4 md:p-8 ">
      {
        <div
          id="media-header"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          {
            <div>
              {
                <h2
                  id="media-title"
                  className="text-2xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                >
                  Media & Event Studio
                </h2>
              }
              {
                <p className="text-gray-500 text-sm mt-1">
                  Capture direct WebRTC photos, upload assets, and curate
                  campaign highlights.
                </p>
              }
            </div>
          }
          {
            <div className="flex items-center gap-2">
              {
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Filter Workspace:
                </span>
              }
              {
                <select
                  value={p}
                  onChange={(N) => {
                    (g(N.target.value), z([]));
                  }}
                  className="bg-pink-50/10 border border-pink-100 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-pink-400 max-w-xs cursor-pointer"
                >
                  {r.map((N) => (
                    <option key={N.id} value={N.id}>{N.name}</option>
                  ))}
                </select>
              }
            </div>
          }
        </div>
      }
      {c && (
        <div
          id="camera-cue-alert"
          className="mb-6 p-4 bg-pink-50/40 border border-pink-100/80 rounded-xl flex items-center justify-between shadow-xs"
        >
          {
            <div className="flex items-center gap-3">
              {
                <span className="w-8 h-8 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center text-sm font-mono font-bold">
                  🎯
                </span>
              }
              {
                <div>
                  {
                    <p className="text-xs text-pink-600 font-semibold tracking-wider uppercase font-mono">
                      Current Live Prompt Cue
                    </p>
                  }
                  {<p className="text-sm text-gray-800 font-medium">{c}</p>}
                </div>
              }
            </div>
          }
          {!y && (
            <button
              onClick={be}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
            >
              {<Camera className="w-4 h-4" />}
              {<span>Launch Cam</span>}
            </button>
          )}
        </div>
      )}
      {
        <div
          id="capture-upload-grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {
            <div
              id="camera-card"
              className="bg-white border border-pink-100 rounded-2xl p-5 flex flex-col justify-between  relative min-h-[300px] shadow-sm"
            >
              {y ? (
                <div className="flex-1 flex flex-col justify-between h-full">
                  {
                    <div className="flex justify-between items-center mb-3">
                      {
                        <span className="text-xs font-semibold text-gray-700">
                          Active Camera Feed
                        </span>
                      }
                      {
                        <div className="flex gap-1">
                          {[
                            "none",
                            "vibrant",
                            "cool",
                            "sepia",
                            "grayscale",
                          ].map((N) => (
                            <button key={N}
                              type="button"
                              onClick={() => oe(N)}
                              className={`px-2 py-0.5 text-[9px] font-bold rounded capitalize cursor-pointer border transition-colors ${te === N ? "bg-gradient-to-tr from-pink-500 to-rose-500 border-pink-400 text-white" : "bg-pink-50/30 border-pink-100/50 text-gray-500 hover:border-pink-200"}`}
                            >
                              {N}
                            </button>
                          ))}
                        </div>
                      }
                    </div>
                  }
                  {
                    <div className="relative bg-gray-950 rounded-xl flex-1 flex items-center justify-center min-h-[180px] h-[300px] overflow-hidden">
                      {
                        <video
                          ref={(el) => {
                            Ee.current = el;
                            if (el && w && el.srcObject !== w) {
                              el.srcObject = w;
                              el.play().catch(() => {});
                            }
                          }}
                          autoPlay={!0}
                          playsInline={!0}
                          muted={!0}
                          className={`absolute inset-0 w-full h-full object-cover ${De()}`}
                        />
                      }
                      {<canvas ref={me} className="hidden" />}
                    </div>
                  }
                  {
                    <div className="flex justify-start items-center mt-4 gap-1.5 w-full min-w-0 overflow-x-auto pb-2 hide-scrollbar">
                      {
                        <button
                          type="button"
                          onClick={k}
                          className="px-2.5 py-2 border border-pink-100 text-[11px] sm:text-xs text-gray-500 rounded-lg font-semibold hover:bg-pink-50/30 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                        >
                          Close
                        </button>
                      }
                      {
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsFullScreenCam(true)}
                            className="bg-gray-800 hover:bg-gray-900 text-white text-[11px] sm:text-xs font-bold px-2.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1 whitespace-nowrap shrink-0 shadow-xs"
                            title="Expand to Full Screen View"
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-pink-400" />
                            <span>Full Screen</span>
                          </button>
                          {
                            <button
                              type="button"
                              onClick={C}
                              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/10 cursor-pointer transition-all whitespace-nowrap shrink-0"
                            >
                              {<Camera className="w-4 h-4" />}
                              {<span>Photo</span>}
                            </button>
                          }
                          {isRecording ? (
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="bg-red-500 hover:bg-red-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-2 rounded-lg cursor-pointer animate-pulse flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                            >
                              {<span>⏹️</span>}
                              {<span>Stop</span>}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={startRecording}
                              className="bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                            >
                              {<span>⏺️</span>}
                              {<span>Video</span>}
                            </button>
                          )}
                        </div>
                      }
                    </div>
                  }
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center py-10">
                  {
                    <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-100/50 text-pink-500 flex items-center justify-center mb-4 shadow-xs">
                      {<Camera className="w-7 h-7" />}
                    </div>
                  }
                  {
                    <h4 className="font-bold text-base text-gray-800">
                      In-App Live Camera
                    </h4>
                  }
                  {
                    <p className="text-xs text-gray-500 text-center max-w-xs mt-1 mb-5 leading-relaxed">
                      Capture instant media directly matching scheduled event
                      cues. Includes dynamic photo filters.
                    </p>
                  }
                  {
                    <button
                      onClick={be}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-pink-500/10 cursor-pointer transition-all"
                    >
                      Launch Media Camera
                    </button>
                  }
                </div>
              )}
            </div>
          }

      {/* Full Screen Camera View Modal Overlay */}
      {isFullScreenCam && y && (
        <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col justify-between p-4 md:p-6 text-white">
          <div className="flex justify-between items-center z-10 bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs md:text-sm font-bold text-pink-400">
                Live Full-Screen Camera View
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1">
                {["none", "vibrant", "cool", "sepia", "grayscale"].map((N) => (
                  <button
                    key={N}
                    type="button"
                    onClick={() => oe(N)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg capitalize cursor-pointer border transition-colors ${
                      te === N
                        ? "bg-pink-600 border-pink-400 text-white shadow-xs"
                        : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {N}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsFullScreenCam(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white cursor-pointer transition-colors"
                title="Exit Fullscreen"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden rounded-3xl bg-black border border-white/10 shadow-2xl">
            <video
              ref={(el) => {
                Ee.current = el;
                if (el && w && el.srcObject !== w) {
                  el.srcObject = w;
                  el.play().catch(() => {});
                }
              }}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${De()}`}
            />
          </div>

          <div className="flex justify-center items-center gap-4 z-10 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-xl mx-auto w-full">
            <button
              type="button"
              onClick={() => {
                setIsFullScreenCam(false);
                k();
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={C}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-pink-500/30 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Photo</span>
            </button>

            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer animate-pulse flex items-center gap-2"
              >
                <span>⏹️ Stop Recording</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-2"
              >
                <span>⏺️ Record Video</span>
              </button>
            )}
          </div>
        </div>
      )}
          {
            <div
              id="drop-upload-card"
              onDragOver={M}
              onDrop={P}
              className="bg-white border border-pink-200 border-dashed rounded-2xl p-5 flex flex-col justify-center items-center relative min-h-[300px] hover:border-pink-400 transition-all shadow-sm group"
            >
              {
                <input
                  type="file"
                  ref={Re}
                  onChange={L}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
              }
              {
                <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-100 text-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                  {<UploadCloud className="w-7 h-7" />}
                </div>
              }
              {
                <h4 className="font-bold text-base text-gray-800">
                  Upload from Gallery
                </h4>
              }
              {
                <p className="text-xs text-gray-500 text-center max-w-xs mt-1 mb-5 leading-relaxed">
                  Drag & drop files here, or browse local folders to import
                  existing event media.
                </p>
              }
              {
                <button
                  onClick={O}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-pink-500/10 cursor-pointer transition-all"
                >
                  Browse Files
                </button>
              }
            </div>
          }
        </div>
      }
      {
        <div
          id="gallery-container"
          className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm"
        >
          {
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-pink-50 pb-5 mb-5">
              {
                <div>
                  {
                    <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      {<FolderHeart className="w-5 h-5 text-pink-500" />}Event-wise
                      Organised Folder:{" "}
                      {(ne == null ? void 0 : ne.name) || "General"}
                    </h4>
                  }
                  {
                    <p className="text-xs text-gray-500 mt-0.5">
                      Select photos below to request optimized AI caption
                      generation.
                    </p>
                  }
                </div>
              }
              {
                <div className="flex flex-wrap items-center gap-2">
                  {ce.length > 0 && (
                    <React.Fragment>
                      {
                        <button
                          onClick={() => pt(ce)}
                          className="bg-white hover:bg-pink-50 border border-pink-100 text-gray-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          {V.length === ce.length
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      }
                      {
                        <button
                          onClick={X}
                          disabled={V.length === 0}
                          className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 hover:to-amber-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          {<Sparkles className="w-3.5 h-3.5" />}
                          {<span>Generate AI Caption ({V.length})</span>}
                        </button>
                      }
                      {V.length > 0 &&
                        (() => {
                          const selectedMedia = ce.filter((m) =>
                            V.includes(m.id),
                          );
                          return selectedMedia.some(
                            (m) =>
                              m.mimeType && m.mimeType.startsWith("video/"),
                          );
                        })() && (
                          <button
                            onClick={mergeVideo}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            Merge to Video
                          </button>
                        )}
                    </React.Fragment>
                  )}
                </div>
              }
            </div>
          }
          {
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ce.map((N) => {
                const G = V.includes(N.id);
                return (
                  <div key={N.id}
                    onClick={() => rt(N.id)}
                    className={`group relative aspect-square rounded-xl  border cursor-pointer transition-all ${G ? "border-pink-500 ring-2 ring-pink-500/30 scale-95" : "border-pink-100 hover:border-pink-300"}`}
                  >
                    {N.mimeType && N.mimeType.startsWith("video/") ? (
                      <video
                        src={N.base64Data}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        muted={true}
                        autoPlay={true}
                        loop={true}
                        playsInline={true}
                      />
                    ) : (
                      <img
                        src={N.base64Data}
                        alt="Captured moment"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {
                      <button
                        type="button"
                        onClick={(le) => {
                          (le.stopPropagation(), R(N));
                        }}
                        className={`absolute top-2 left-2 p-1.5 rounded-lg border text-xs backdrop-blur-md transition-all cursor-pointer ${N.isHighlighted ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-black/45 border-white/10 text-white/60 opacity-0 group-hover:opacity-100 hover:text-white"}`}
                      >
                        {
                          <Star
                            className="w-3.5 h-3.5"
                            fill={N.isHighlighted ? "currentColor" : "none"}
                          />
                        }
                      </button>
                    }
                    {
                      <button
                        type="button"
                        onClick={(le) => {
                          le.stopPropagation();
                          setLightboxMedia(N);
                        }}
                        className="absolute top-2 left-10 p-1.5 rounded-lg bg-black/45 border border-white/10 text-white/60 opacity-0 group-hover:opacity-100 hover:bg-pink-600/50 hover:border-pink-500/50 hover:text-white transition-all cursor-pointer"
                        title="Fullscreen / View Larger"
                      >
                        {<Eye className="w-3.5 h-3.5" />}
                      </button>
                    }
                    {
                      <button
                        type="button"
                        onClick={(le) => {
                          (le.stopPropagation(), s(N.id));
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/45 border border-white/10 text-white/60 opacity-0 group-hover:opacity-100 hover:bg-rose-600/30 hover:border-rose-500/40 hover:text-rose-400 transition-all cursor-pointer"
                      >
                        {<Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    }
                    {
                      <div
                        className={`absolute bottom-2 right-2 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${G ? "bg-gradient-to-tr from-pink-500 to-rose-500 border-pink-400 text-white" : "bg-black/50 border-white/20 text-transparent group-hover:text-white/40"}`}
                      >
                        {<Check className="w-3.5 h-3.5 stroke-[3px]" />}
                      </div>
                    }
                    {N.isHighlighted && (
                      <div className="absolute bottom-2 left-2 bg-amber-500/90 text-black text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase font-mono shadow-sm">
                        Campaign Star
                      </div>
                    )}
                  </div>
                );
              })}
              {ce.length === 0 && (
                <div className="col-span-full text-center py-12 border border-dashed border-pink-100 rounded-xl bg-pink-50/10">
                  {<Image className="w-10 h-10 text-pink-300 mx-auto mb-2" />}
                  {
                    <p className="text-gray-500 text-sm font-semibold">
                      Folder is empty
                    </p>
                  }
                  {
                    <p className="text-xs text-gray-400 mt-0.5 mb-4">
                      Start by launching camera or dropping files into this
                      workspace.
                    </p>
                  }
                  {
                    <button
                      onClick={be}
                      className="bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-100 text-xs px-3 py-1.5 rounded-lg cursor-pointer font-bold transition-colors"
                    >
                      Capture Photo
                    </button>
                  }
                </div>
              )}
            </div>
          }
        </div>
      }
      {showEditor &&
        (() => {
          if (mergedMedia) {
            return (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                {
                  <div className="bg-gray-900 border border-pink-500/30 rounded-2xl w-full max-w-2xl p-8 flex flex-col gap-6 shadow-2xl shadow-pink-500/20 overflow-hidden relative animate-in zoom-in-95 duration-300">
                    {
                      <h3 className="text-white text-2xl font-bold text-center">
                        Merged Video Ready
                      </h3>
                    }
                    {
                      <video
                        src={mergedMedia.base64Data}
                        className="w-full max-h-[50vh] object-contain bg-black rounded-xl ring-1 ring-white/10"
                        autoPlay={true}
                        loop={true}
                        controls={true}
                      />
                    }
                    {
                      <div className="flex justify-center gap-4 mt-2">
                        {
                          <button
                            onClick={() => {
                              setMergedMedia(null);
                            }}
                            className="px-6 py-3 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition"
                          >
                            Back to Editor
                          </button>
                        }
                        {
                          <button
                            onClick={() => {
                              if (t) t(mergedMedia);
                              if (a) a([mergedMedia], mergedMedia.eventId);
                              z([]);
                              setShowEditor(false);
                              setMergedMedia(null);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-sm font-bold hover:from-pink-600 hover:to-rose-700 transition shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                          >
                            Continue to AI Caption Studio →
                          </button>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            );
          }
          const selectedMedia = ce.filter((m) => V.includes(m.id));
          const priorityVideo = selectedMedia.find(
            (m) => m.mimeType && m.mimeType.startsWith("video/"),
          );
          return (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              {
                <div className="bg-gray-900 border border-pink-500/30 rounded-2xl w-full max-w-4xl p-8 flex flex-col gap-8 shadow-2xl shadow-pink-500/20 overflow-hidden relative">
                  {
                    <div className="flex flex-col gap-2 relative z-10">
                      {
                        <h3 className="text-white text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
                          AI Caption Studio: Video Editor
                        </h3>
                      }
                      {
                        <p className="text-gray-300 text-base">
                          Intelligently analyzing clips, applying seamless
                          transitions, and prioritizing primary subjects.
                        </p>
                      }
                    </div>
                  }
                  {!isExporting && (
                    <div className="flex gap-4 border-b border-gray-800 pb-2 z-10 relative">
                      {
                        <button
                          onClick={() => setActiveTab("adjust")}
                          className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === "adjust" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
                        >
                          Adjustments
                        </button>
                      }
                      {
                        <button
                          onClick={() => setActiveTab("filters")}
                          className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === "filters" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
                        >
                          Filters
                        </button>
                      }
                      {
                        <button
                          onClick={() => setActiveTab("audio")}
                          className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === "audio" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
                        >
                          Audio
                        </button>
                      }
                    </div>
                  )}
                  {
                    <div className="flex flex-col md:flex-row gap-6">
                      {
                        <div className="bg-black w-full md:w-2/3 aspect-[4/5] sm:aspect-video rounded-xl flex flex-col items-center justify-center border border-gray-800 relative overflow-hidden ring-1 ring-white/10 shadow-inner">
                          {
                            <div className="absolute inset-0 w-full h-full flex flex-col">
                              {
                                <div className="flex-1 relative w-full h-full">
                                  {selectedMedia.map((v, i) => {
                                    const setts = getSettings(i);
                                    const isActive = i === activeVideoIndex;
                                    return v.mimeType &&
                                      v.mimeType.startsWith("video/") ? (
                                      <video key={v.id}
                                        src={v.base64Data}
                                        className={`absolute inset-0 w-full h-full object-contain bg-black transition-opacity duration-300 ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                                        autoPlay={true}
                                        loop={true}
                                        muted={true}
                                        style={{
                                          filter: `${setts.filter === "grayscale" ? "grayscale(100%)" : setts.filter === "sepia" ? "sepia(100%)" : setts.filter === "vintage" ? "sepia(50%) contrast(120%)" : setts.filter === "invert" ? "invert(100%)" : setts.filter === "saturate" ? "saturate(200%)" : ""} brightness(${setts.brightness}%) contrast(${setts.contrast}%)`,
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={v.base64Data}
                                        className={`absolute inset-0 w-full h-full object-contain bg-black transition-opacity duration-300 ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                                        style={{
                                          filter: `${setts.filter === "grayscale" ? "grayscale(100%)" : setts.filter === "sepia" ? "sepia(100%)" : setts.filter === "vintage" ? "sepia(50%) contrast(120%)" : setts.filter === "invert" ? "invert(100%)" : setts.filter === "saturate" ? "saturate(200%)" : ""} brightness(${setts.brightness}%) contrast(${setts.contrast}%)`,
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              }
                              {
                                <div className="h-24 w-full bg-black/80 backdrop-blur-md border-t border-gray-800 p-2 flex gap-2 overflow-x-auto z-20">
                                  {selectedMedia.map((v, i) => {
                                    const isActive = i === activeVideoIndex;
                                    return (
                                      <div key={v.id}
                                        onClick={() => setActiveVideoIndex(i)}
                                        className={`flex-shrink-0 w-32 h-full relative cursor-pointer rounded-lg border-2 transition-all ${isActive ? "border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" : "border-transparent hover:border-gray-500 opacity-50 hover:opacity-100"}`}
                                      >
                                        {v.mimeType &&
                                        v.mimeType.startsWith("video/") ? (
                                          <video
                                            src={v.base64Data}
                                            className="w-full h-full object-cover rounded-md"
                                          />
                                        ) : (
                                          <img
                                            src={v.base64Data}
                                            className="w-full h-full object-cover rounded-md"
                                          />
                                        )}
                                        {
                                          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-bold px-1 rounded">
                                            {"Clip " + (i + 1)}
                                          </div>
                                        }
                                      </div>
                                    );
                                  })}
                                </div>
                              }
                            </div>
                          }
                          {isExporting ? (
                            <div className="flex flex-col items-center justify-center gap-6 w-full max-w-lg px-12 z-10 bg-black/60 p-8 rounded-2xl backdrop-blur-md border border-white/10">
                              {
                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 text-6xl font-black animate-pulse drop-shadow-lg">
                                  {exportProgress + "%"}
                                </div>
                              }
                              {
                                <div className="w-full bg-gray-900 rounded-full h-4 ring-1 ring-inset ring-white/10 overflow-hidden">
                                  {
                                    <div
                                      className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                                      style={{
                                        width: exportProgress + "%",
                                      }}
                                    />
                                  }
                                </div>
                              }
                              {
                                <p className="text-pink-100 text-sm font-medium tracking-wide uppercase">
                                  {exportProgress < 30
                                    ? "Analyzing priority video..."
                                    : exportProgress < 60
                                      ? "Applying AI transitions..."
                                      : exportProgress < 90
                                        ? "Enhancing audio sync..."
                                        : "Finalizing export..."}
                                </p>
                              }
                            </div>
                          ) : null}
                        </div>
                      }
                      {!isExporting && (
                        <div className="w-full md:w-1/3 flex flex-col gap-6 min-h-[180px]">
                          {activeTab === "adjust" && (
                            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300 min-h-[160px]">
                              {
                                <h4 className="text-white font-semibold text-sm">
                                  Adjustments
                                </h4>
                              }
                              {
                                <div className="flex flex-col gap-2">
                                  {
                                    <div className="flex justify-between text-xs">
                                      {
                                        <span className="text-gray-400">
                                          Brightness
                                        </span>
                                      }
                                      {
                                        <span className="text-white">
                                          {videoBrightness + "%"}
                                        </span>
                                      }
                                    </div>
                                  }
                                  {
                                    <input
                                      type="range"
                                      min="50"
                                      max="150"
                                      value={videoBrightness}
                                      onChange={(e) =>
                                        updateSetting(
                                          "brightness",
                                          parseInt(e.target.value),
                                        )
                                      }
                                      className="w-full accent-pink-500"
                                    />
                                  }
                                </div>
                              }
                              {
                                <div className="flex flex-col gap-2">
                                  {
                                    <div className="flex justify-between text-xs">
                                      {
                                        <span className="text-gray-400">
                                          Contrast
                                        </span>
                                      }
                                      {
                                        <span className="text-white">
                                          {videoContrast + "%"}
                                        </span>
                                      }
                                    </div>
                                  }
                                  {
                                    <input
                                      type="range"
                                      min="50"
                                      max="150"
                                      value={videoContrast}
                                      onChange={(e) =>
                                        updateSetting(
                                          "contrast",
                                          parseInt(e.target.value),
                                        )
                                      }
                                      className="w-full accent-pink-500"
                                    />
                                  }
                                </div>
                              }
                            </div>
                          )}
                          {activeTab === "filters" && (
                            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300 min-h-[160px]">
                              {
                                <h4 className="text-white font-semibold text-sm">
                                  Filters
                                </h4>
                              }
                              {
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    ["normal", "Normal"],
                                    ["grayscale", "B&W"],
                                    ["sepia", "Warm"],
                                    ["vintage", "Vintage"],
                                    ["invert", "Invert"],
                                    ["saturate", "Vivid"],
                                  ].map(([val, label]) => (
                                    <button key={val}
                                      onClick={() =>
                                        updateSetting("filter", val)
                                      }
                                      className={`py-3 px-1 rounded-lg text-xs font-semibold ${videoFilter === val ? "bg-pink-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              }
                            </div>
                          )}
                          {activeTab === "audio" && (
                            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300 min-h-[160px]">
                              {
                                <h4 className="text-white font-semibold text-sm">
                                  Audio Level
                                </h4>
                              }
                              {
                                <div className="flex flex-col gap-2">
                                  {
                                    <div className="flex justify-between text-xs">
                                      {
                                        <span className="text-gray-400">
                                          Volume
                                        </span>
                                      }
                                      {
                                        <span className="text-white">
                                          {videoVolume + "%"}
                                        </span>
                                      }
                                    </div>
                                  }
                                  {
                                    <input
                                      type="range"
                                      min="0"
                                      max="200"
                                      value={videoVolume}
                                      onChange={(e) =>
                                        updateSetting(
                                          "volume",
                                          parseInt(e.target.value),
                                        )
                                      }
                                      className="w-full accent-pink-500"
                                    />
                                  }
                                </div>
                              }
                            </div>
                          )}
                          {activeTab === "trim" && (
                            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                              {
                                <h4 className="text-white font-semibold text-sm">
                                  Timeline
                                </h4>
                              }
                              {
                                <div className="h-16 bg-gray-800 rounded-lg flex items-center justify-center relative">
                                  {
                                    <p className="text-gray-500 text-xs">
                                      Timeline scrubbing available in export
                                      mode
                                    </p>
                                  }
                                </div>
                              }
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  }
                  {
                    <div className="flex justify-end gap-4 relative z-10 mt-6">
                      {!isExporting && (
                        <button
                          onClick={() => setShowEditor(false)}
                          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-bold cursor-pointer transition-colors shadow-lg border border-gray-700"
                        >
                          Cancel
                        </button>
                      )}
                      {
                        <button
                          onClick={async () => {
                            if (isExporting) return;
                            setIsExporting(true);
                            setExportProgress(10);
                            try {
                              const videosList = selectedMedia;
                              const videosToMerge = videosList.map((m, i) => {
                                const s = getSettings(i);
                                return {
                                  data: m.base64Data,
                                  brightness: s.brightness,
                                  contrast: s.contrast,
                                  filter: s.filter,
                                  volume: s.volume,
                                };
                              });
                              const res = await fetch("/api/merge-videos", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  videos: videosToMerge,
                                }),
                              });
                              const data = await res.json();
                              if (data.error) {
                                alert(data.error);
                                setIsExporting(false);
                                setExportProgress(0);
                                return;
                              }
                              setExportProgress(100);
                              setTimeout(() => {
                                setIsExporting(false);
                                setExportProgress(0);
                                if (data.videoBase64) {
                                  const newMedia = {
                                    id: "media_" + Date.now(),
                                    base64Data:
                                      "data:" +
                                      (data.mimeType || "video/mp4") +
                                      ";base64," +
                                      data.videoBase64,
                                    mimeType: data.mimeType || "video/mp4",
                                    eventId: p,
                                    isHighlighted: false,
                                    timestamp: new Date().toISOString(),
                                  };
                                  setMergedMedia(newMedia);
                                }
                              }, 500);
                            } catch (e) {
                              alert(e);
                              setIsExporting(false);
                              setExportProgress(0);
                            }
                          }}
                          disabled={isExporting}
                          className={`px-8 py-3 ${isExporting ? "bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600" : "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]"} border border-transparent rounded-xl text-sm font-bold transition-all`}
                        >
                          {isExporting
                            ? "Processing..."
                            : selectedMedia.length > 1
                              ? "Start AI Merge"
                              : "Apply & Save Clip"}
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          );
        })()}
      {lightboxMedia && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxMedia(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxMedia(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2.5 rounded-full bg-gray-900/80 hover:bg-pink-600 text-white transition-colors cursor-pointer border border-white/20 shadow-lg"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
            {lightboxMedia.mimeType && lightboxMedia.mimeType.startsWith("video/") ? (
              <video
                src={lightboxMedia.base64Data}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain bg-black border border-white/10"
              />
            ) : (
              <img
                src={lightboxMedia.base64Data}
                alt="Expanded view"
                className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain border border-white/10"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="mt-4 flex items-center justify-between w-full max-w-2xl px-4 py-2.5 bg-gray-900/80 rounded-xl border border-white/10 text-white text-xs">
              <span className="font-mono text-gray-300">
                {lightboxMedia.mimeType || "image/png"}
              </span>
              {lightboxMedia.eventId && (
                <span className="text-pink-400 font-semibold truncate max-w-[250px]">
                  Event: {r.find((ev) => ev.id === lightboxMedia.eventId)?.name || lightboxMedia.eventId}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default MediaGalleryTab;
