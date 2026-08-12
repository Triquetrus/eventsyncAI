import util from "util";
import express from "express";

import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
ffmpeg.setFfmpegPath(ffmpegStatic);
import fs from 'fs';
import os from 'os';


import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;


let vapidKey = process.env.VAPID_PUBLIC_KEY || "";
vapidKey = vapidKey.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
let vapidPriv = process.env.VAPID_PRIVATE_KEY || "";
vapidPriv = vapidPriv.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

try {
  webpush.setVapidDetails(
    'mailto:test@example.com',
    vapidKey,
    vapidPriv
  );
} catch(e) { console.log(e); }


// Background job runs every 15 seconds to check for scheduled event reminders
setInterval(async () => {
  if (!supabase) return;
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentHour = String(now.getHours()).padStart(2, "0");
  const currentMin = String(now.getMinutes()).padStart(2, "0");
  const currentTime = currentHour + ":" + currentMin;

  try {
    const { data: events, error } = await supabase
      .from('scheduled_events')
      .select('*')
      .eq('date', currentDate)
      .eq('time', currentTime)
      .eq('_backendNotified', false);
      
    if (error || !events || events.length === 0) return;

    for (const evt of events) {
      await supabase.from('scheduled_events').update({ _backendNotified: true }).eq('id', evt.id);
      const payload = JSON.stringify({
        title: "Event Starting Reminder!",
        message: `Reminder: ${evt.name} is scheduled for now (${evt.time}) at ${evt.location || 'the location'}.`
      });
      
      const { data: subs } = await supabase.from('push_subscriptions').select('*').eq('user_email', evt.user_email);
      if (subs) {
        for (const sub of subs) {
          try {
            await webpush.sendNotification(sub.subscription, payload);
          } catch(e) {
            console.error("Push fail", e);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error in scheduled event interval:", err);
  }
}, 15000);

async function verifyAuth(req, res, next) {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured on server" });
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing authorization header" });
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Unauthorized" });
  req.user = user;
  next();
}



// Lazy-initialize Gemini client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) { throw new Error("GEMINI_API_KEY environment variable is required"); }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  
function getErrorMessage(e: any): string {
  if (!e) return "An unknown error occurred";

  let message = "";
  if (typeof e === "string") {
    message = e;
  } else if (e.message) {
    message = e.message;
  } else if (e.error && e.error.message) {
    message = e.error.message;
  } else {
    try {
      message = JSON.stringify(e);
    } catch (err) {
      message = "An unknown error occurred";
    }
  }

  const lower = message.toLowerCase();
  if (
    lower.includes("429") ||
    lower.includes("resource_exhausted") ||
    lower.includes("quota") ||
    lower.includes("limit_exceeded") ||
    lower.includes("rate limit") ||
    lower.includes("exceeded your current quota") ||
    e?.status === 429 ||
    e?.code === 429
  ) {
    return "AI feature temporarily unavailable — usage limit reached. Please try again later.";
  }

  try {
    const jsonStart = message.indexOf('{');
    if (jsonStart !== -1) {
       const parsed = JSON.parse(message.substring(jsonStart));
       if (parsed.error && parsed.error.message) {
         const pMsg = parsed.error.message.toLowerCase();
         if (parsed.error.code === 429 || parsed.error.status === "RESOURCE_EXHAUSTED" || pMsg.includes("quota") || pMsg.includes("exceeded")) {
           return "AI feature temporarily unavailable — usage limit reached. Please try again later.";
         }
         message = parsed.error.message;
       }
    }
  } catch (err) {
    // Ignore parse error
  }
  return message;
}

async function resolveBase64AndMime(inputData: string, fallbackMime: string = "image/png"): Promise<{ base64: string; mimeType: string }> {
  if (!inputData) return { base64: "", mimeType: fallbackMime };
  
  let trimmed = inputData.trim();
  if (trimmed.startsWith("/")) {
    const PORT = process.env.PORT || 3000;
    trimmed = `http://localhost:${PORT}${trimmed}`;
  }
  
  // If it's a URL (http:// or https://)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const response = await fetch(trimmed);
      if (!response.ok) {
        throw new Error(`Failed to fetch media from URL (${response.status} ${response.statusText})`);
      }
      const contentType = response.headers.get("content-type") || fallbackMime;
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = contentType.split(";")[0].trim() || fallbackMime;
      return { base64, mimeType };
    } catch (err: any) {
      console.warn("Fetch failed in resolveBase64AndMime:", err?.message);
      return { base64: "", mimeType: fallbackMime };
    }
  }

  // If it's a data URL (data:image/png;base64,...)
  const match = trimmed.match(/^data:([^;]+);base64,(.+)$/s);
  if (match) {
    return {
      mimeType: match[1] || fallbackMime,
      base64: match[2].replace(/\s/g, "")
    };
  }

  // Otherwise assume it's pure base64 string
  const pure = trimmed.replace(/^data:[a-zA-Z0-9\/+-]+;base64,/, "").replace(/\s/g, "");
  return { base64: pure, mimeType: fallbackMime };
}

const app = express();
  const PORT = process.env.PORT || 3000;

  // Configure JSON parser with larger limits for base64 image uploads
  app.use(express.json({ limit: "15mb" }));

  // API endpoints
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.get("/api/vapidPublicKey", (req, res) => {
    res.send(vapidKey);
  });

  app.post("/api/subscribe", verifyAuth, async (req, res) => {
    try {
      const subscription = req.body;
      const user_email = req.user.email;
      await supabase.from('push_subscriptions').upsert({
        user_email,
        subscription,
        updated_at: new Date().toISOString()
      });
      res.status(201).json({});
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to save subscription" });
    }
  });

  app.post("/api/sync-events", verifyAuth, async (req, res) => {
    try {
      const newEvents = req.body.events || [];
      const user_email = req.user.email;
      
      for (const newEvt of newEvents) {
        await supabase.from('scheduled_events').upsert({
          id: newEvt.id,
          user_email,
          name: newEvt.name,
          date: newEvt.date,
          time: newEvt.time,
          location: newEvt.location,
          _backendNotified: newEvt._backendNotified || false,
          updated_at: new Date().toISOString()
        });
      }
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to sync events" });
    }
  });

  // Simple in-memory sliding window rate limiter for Gemini AI routes
  const aiRateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const aiRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const rawIp = (req.headers['x-forwarded-for'] as string || req.socket?.remoteAddress || '127.0.0.1');
    const ip = rawIp.split(',')[0].trim();
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 20; // max 20 requests per minute per IP

    const record = aiRateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
      aiRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: "Too many AI generation requests. Please wait a minute before trying again."
      });
    }

    record.count += 1;
    next();
  };

  // POST /api/generate-image
  app.post("/api/generate-image", aiRateLimiter, async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required." });

      const ai = getAI();
      let imageUrl: string | null = null;

      // Primary attempt: gemini-3.1-flash-lite-image and gemini-3.1-flash-image
      const imageModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];
      for (const modelName of imageModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [{ text: prompt || "A high quality event photo" }]
            },
            config: {
              imageConfig: { aspectRatio: '1:1' }
            }
          });

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                const mime = part.inlineData.mimeType || "image/jpeg";
                imageUrl = `data:${mime};base64,${part.inlineData.data}`;
                break;
              }
            }
          }
          if (imageUrl) break;
        } catch (imgErr: any) {
          console.warn(`Image model ${modelName} error:`, imgErr?.message);
        }
      }

      // Fallback attempt: gemini-3.6-flash producing custom high quality SVG artwork
      if (!imageUrl) {
        try {
          const svgResponse = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: {
              parts: [{
                text: `Create a clean, visually appealing, modern high-quality SVG vector graphic artwork representing this user prompt: "${prompt}". 
Output ONLY valid SVG code starting with <svg> and ending with </svg>. Do not include any markdown formatting, backticks, or explanations.`
              }]
            }
          });

          let rawSvg = svgResponse.text || "";
          rawSvg = rawSvg.replace(/```xml/gi, "").replace(/```svg/gi, "").replace(/```/g, "").trim();
          if (rawSvg.includes("<svg")) {
            const encodedSvg = encodeURIComponent(rawSvg);
            imageUrl = `data:image/svg+xml;utf8,${encodedSvg}`;
          }
        } catch (svgErr: any) {
          console.warn("SVG fallback generation error:", svgErr?.message);
        }
      }

      if (imageUrl) {
        return res.json({ image: imageUrl });
      }
      res.status(500).json({ error: "Failed to generate image. Please try again with a different prompt." });
    } catch (e: any) {
      console.error("Generate image failed:", e);
      const msg = getErrorMessage(e);
      res.status(msg.includes("limit reached") ? 429 : 500).json({ error: msg });
    }
  });

  // POST /api/edit-image
  app.post("/api/edit-image", aiRateLimiter, async (req, res) => {
    try {
      const { prompt, imageBase64, imageType } = req.body;
      if (!imageBase64) return res.status(400).json({ error: "Image input is required." });

      const ai = getAI();
      const { base64: pureBase64, mimeType } = await resolveBase64AndMime(imageBase64, imageType || "image/jpeg");

      let imageUrl: string | null = null;
      const userPrompt = prompt || "Enhance and edit this image as requested.";

      // Step 1: Analyze source image + edit prompt using gemini-3.6-flash to get detailed visual description
      let synthPrompt = userPrompt;
      if (pureBase64) {
        try {
          const visionAnalysis = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: {
              parts: [
                { inlineData: { data: pureBase64, mimeType } },
                { text: `You are a Gemini AI image editor. Examine this source image in detail (subjects, composition, lighting, style). The user requested these changes: "${userPrompt}". Describe a complete high-resolution updated image that maintains the main identity and subject of the original while seamlessly applying all requested edits. Output ONLY a single descriptive prompt paragraph.` }
              ]
            }
          });
          if (visionAnalysis.text) {
            synthPrompt = visionAnalysis.text.trim();
          }
        } catch (visionErr: any) {
          console.warn("Vision analysis warning:", visionErr?.message);
        }
      }

      // Step 2: Try Gemini image editing models
      const imageModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];
      for (const modelName of imageModels) {
        try {
          const parts: any[] = [];
          if (pureBase64) {
            parts.push({ inlineData: { data: pureBase64, mimeType } });
          }
          parts.push({ text: userPrompt });

          const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              imageConfig: { aspectRatio: '1:1' }
            }
          });

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                const mime = part.inlineData.mimeType || "image/jpeg";
                imageUrl = `data:${mime};base64,${part.inlineData.data}`;
                break;
              }
            }
          }
          if (imageUrl) break;
        } catch (imgErr: any) {
          console.warn(`Gemini edit model ${modelName} error:`, imgErr?.message);
        }
      }

      // Step 3: Fallback attempt with gemini-3.6-flash SVG vector output based on synthPrompt
      if (!imageUrl) {
        try {
          const svgResponse = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: {
              parts: [{
                text: `Generate a high-quality, full-color SVG image vector graphic representing this edited image concept: "${synthPrompt}". 
Output ONLY valid SVG code starting with <svg> and ending with </svg>. Do not include markdown tags or explanation.`
              }]
            }
          });

          let rawSvg = svgResponse.text || "";
          rawSvg = rawSvg.replace(/```xml/gi, "").replace(/```svg/gi, "").replace(/```/g, "").trim();
          if (rawSvg.includes("<svg")) {
            const encodedSvg = encodeURIComponent(rawSvg);
            imageUrl = `data:image/svg+xml;utf8,${encodedSvg}`;
          }
        } catch (svgErr: any) {
          console.warn("SVG edit fallback error:", svgErr?.message);
        }
      }

      if (imageUrl) {
        return res.json({ image: imageUrl });
      }

      res.status(500).json({ error: "Failed to produce edited image. Please try adjusting your prompt or uploading another image." });
    } catch (e: any) {
      console.error("Edit image failed:", e);
      const msg = getErrorMessage(e);
      res.status(msg.includes("limit reached") ? 429 : 500).json({ error: msg });
    }
  });

  app.post("/api/generate-caption", aiRateLimiter, async (req, res) => {
    try {
      const { eventType, tone, eventName, location, description, platform, imageBase64, imageType } = req.body;

      if (!eventName) {
        return res.status(400).json({ error: "Event name is required." });
      }

      const ai = getAI();
      const promptParts: any[] = [];

      // Build context prompt
      let textPrompt = `You are EventSync AI, a world-class social media assistant.
Generate 3 distinct alternative captions and matching sets of optimized hashtags for a social media post about the following event:
- Event Name: ${eventName}
- Event Type: ${eventType || "General"}
- Location: ${location || "Not specified"}
- Description: ${description || "No description provided"}
- Selected Tone: ${tone || "fun"}
- Target Social Platform: ${platform || "all"}

Please output the result strictly in JSON format as an object with the following schema:
{
  "captions": [
    {
      "text": "Caption text goes here",
      "hashtags": ["#tag1", "#tag2", "#tag3"],
      "explanation": "Why this caption works for the selected tone/platform"
    }
  ],
  "smartPrompts": [
    "Suggested photo opportunity prompt 1",
    "Suggested photo opportunity prompt 2"
  ]
}

Make sure the captions are optimized specifically for ${platform === "all" ? "a variety of platforms" : platform}.
- Instagram: visually engaging, conversational, friendly spacing, visual descriptions.
- LinkedIn: professional, insightful, structured, networking-friendly.
- Facebook: relatable, community-focused, readable, shares-encouraging.

Generate 3 captions reflecting the selected tone "${tone}".`;

      if (imageBase64) {
        const { base64: pureBase64, mimeType } = await resolveBase64AndMime(imageBase64, imageType || "image/png");
        promptParts.push({
          inlineData: {
            data: pureBase64,
            mimeType: mimeType,
          },
        });
        textPrompt += `\n\nCRITICAL: Analyze the attached media (image or video) for this event and make the captions directly reference the visual elements, action, setting, colors, and subject matter depicted in the media, creating a highly customized, authentic post!`;
      }

      promptParts.push(textPrompt);

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptParts,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response content received from Gemini API.");
      }

      let cleanText = responseText;
      const match = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanText = match[1];
      }
      const parsedJSON = JSON.parse(cleanText);
      return res.json(parsedJSON);
    } catch (error: any) {
      console.error("Caption generation failed:", error);
      const msg = getErrorMessage(error) || "An unexpected error occurred during caption generation.";
      return res.status(msg.includes("limit reached") ? 429 : 500).json({
        error: msg,
        details: error.toString(),
      });
    }
  });

    // POST /api/transcribe-audio
  app.post("/api/transcribe-audio", aiRateLimiter, async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64) return res.status(400).json({ error: "No audio data provided" });
      
      const ai = getAI();
      const { base64: pureBase64, mimeType: resolvedMime } = await resolveBase64AndMime(audioBase64, mimeType || "audio/webm");
      
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            inlineData: {
              data: pureBase64,
              mimeType: resolvedMime || "audio/webm"
            }
          },
          "Transcribe this voice note and convert it into clear, professional text to be used as context for social media captions. Output only the text."
        ]
      });
      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Audio transcription failed:", error);
      const msg = getErrorMessage(error) || "Failed to transcribe audio";
      return res.status(msg.includes("limit reached") ? 429 : 500).json({ error: msg });
    }
  });

  // POST /api/generate-prompts
  app.post("/api/generate-prompts", aiRateLimiter, async (req, res) => {
    try {
      const { eventType, eventName, location } = req.body;
      const ai = getAI();

      const textPrompt = `Generate a list of 5 creative, highly specific, event-based photo/video prompts to guide a user during their event.
- Event Name: ${eventName}
- Event Type: ${eventType || "General"}
- Location: ${location || "Not specified"}

These prompts should trigger before, during, and after the event (e.g. "Take a group photo by the entrance", "Capture a candid laugh during the speech", "Record a 5-second video of the crowd reacting").

Return your response strictly in JSON format as an array of strings:
[
  "Prompt 1",
  "Prompt 2",
  "Prompt 3",
  "Prompt 4",
  "Prompt 5"
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [textPrompt],
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsedJSON = JSON.parse(response.text || "[]");
      return res.json({ prompts: parsedJSON });
    } catch (error: any) {
      console.error("Prompts generation failed:", error);
      return res.status(500).json({
        error: getErrorMessage(error) || "Failed to generate smart prompts",
        details: error.toString(),
      });
    }
  });
  
  // POST /api/merge-videos
  // POST /api/merge-videos
  app.post("/api/merge-videos", aiRateLimiter, async (req, res) => {
    let tmpDir = '';
    try {
      const { videos, brightness = 100, contrast = 100, filter = 'normal', volume = 100 } = req.body;
      if (!videos || !Array.isArray(videos) || videos.length === 0) {
        return res.status(400).json({ error: "No videos provided" });
      }

      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'merge-'));
      const concatListPath = path.join(tmpDir, 'concat.txt');
      const outputPath = path.join(tmpDir, 'output.mp4');
      
      const normFiles: string[] = [];
      const ffprobe = util.promisify(ffmpeg.ffprobe);

      for (let i = 0; i < videos.length; i++) {
        const videoItem = videos[i];
        const base64String = typeof videoItem === 'string' ? videoItem : (videoItem.data || videoItem.base64Data || '');
        if (!base64String) {
          throw new Error("Invalid video data format at index " + i);
        }
        
        const b = typeof videoItem === 'object' && videoItem.brightness !== undefined ? videoItem.brightness : brightness;
        const c = typeof videoItem === 'object' && videoItem.contrast !== undefined ? videoItem.contrast : contrast;
        const f = typeof videoItem === 'object' && videoItem.filter !== undefined ? videoItem.filter : filter;
        const v = typeof videoItem === 'object' && videoItem.volume !== undefined ? videoItem.volume : volume;

        const isImage = base64String.startsWith('data:image/') || (typeof videoItem === 'object' && videoItem.mimeType && videoItem.mimeType.startsWith('image/'));
        const base64Data = base64String.replace(/^data:[^,]+,/, "");
        
        const ext = isImage ? '.png' : '.mp4';
        const rawFilePath = path.join(tmpDir, `raw_${i}${ext}`);
        fs.writeFileSync(rawFilePath, Buffer.from(base64Data, 'base64'));
        
        let hasAudio = false;
        if (!isImage) {
            try {
               const meta = await ffprobe(rawFilePath) as any;
               hasAudio = meta.streams && meta.streams.some((s: any) => s.codec_type === 'audio');
            } catch (err) {
               console.warn(`Could not probe file ${rawFilePath}, assuming no audio`);
            }
        }
        
        const normFilePath = path.join(tmpDir, `norm_${i}.mp4`);
        
        await new Promise((resolve, reject) => {
            let cmd = ffmpeg();
            
            if (isImage) {
               cmd = cmd.input(rawFilePath).inputOptions(['-loop', '1', '-t', '3']);
            } else {
               cmd = cmd.input(rawFilePath);
            }
            
            if (!hasAudio) {
               cmd = cmd.input('anullsrc=channel_layout=stereo:sample_rate=44100').inputOptions(['-f', 'lavfi']);
            }
            
            let vFilters = [
              'scale=1280:720:force_original_aspect_ratio=decrease',
              'pad=1280:720:(ow-iw)/2:(oh-ih)/2',
              'setsar=1',
              'fps=30'
            ];
            
            if (b !== 100 || c !== 100) {
               let valB = (b - 100) / 100.0;
               let valC = c / 100.0;
               vFilters.push(`eq=brightness=${valB}:contrast=${valC}`);
            }
            if (f === 'grayscale') vFilters.push('hue=s=0');
            if (f === 'sepia') vFilters.push('colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131');
            if (f === 'vintage') {
               vFilters.push('colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131');
               vFilters.push('eq=contrast=1.2');
            }
            
            let outOptions = [
                '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p',
                '-c:a', 'aac',
                '-ar', '44100',
                '-ac', '2'
            ];
            
            if (isImage || !hasAudio) {
               outOptions.push('-shortest');
            }
            
            cmd.videoFilters(vFilters);
            
            if (v !== 100 && hasAudio) {
               cmd.audioFilters(`volume=${v / 100.0}`);
            }
            
            cmd.outputOptions(outOptions)
              .output(normFilePath)
              .on('end', resolve)
              .on('error', (err, stdout, stderr) => {
                 console.error('Error normalizing clip ' + i + ':', stderr);
                 reject(new Error(`Error normalizing clip ${i}: ${err.message}`));
              })
              .run();
        });
        
        normFiles.push(normFilePath);
      }

      // Sequential Reel-style concatenation via ffmpeg complex filter concat
      await new Promise((resolve, reject) => {
        if (normFiles.length === 1) {
          fs.copyFileSync(normFiles[0], outputPath);
          return resolve(true);
        }

        let concatCmd = ffmpeg();
        normFiles.forEach((file) => {
          concatCmd = concatCmd.input(file);
        });

        let filterGraph = '';
        for (let i = 0; i < normFiles.length; i++) {
          filterGraph += `[${i}:v][${i}:a]`;
        }
        filterGraph += `concat=n=${normFiles.length}:v=1:a=1[outv][outa]`;

        concatCmd
          .complexFilter(filterGraph)
          .outputOptions([
            '-map', '[outv]',
            '-map', '[outa]',
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-ar', '44100',
            '-ac', '2',
            '-preset', 'fast'
          ])
          .output(outputPath)
          .on('end', resolve)
          .on('error', (err, stdout, stderr) => {
            console.error('ffmpeg concat filter stderr:', stderr);
            reject(new Error(err.message + '\nStderr: ' + stderr));
          })
          .run();
      });

      const resultBase64 = fs.readFileSync(outputPath, { encoding: 'base64' });
      res.json({ videoBase64: resultBase64, mimeType: "video/mp4" });
    } catch (error) {
      console.error('Error merging videos:', error);
      res.status(500).json({ error: error.message });
    } finally {
      if (tmpDir) {
         fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    }
  });


// POST /api/analyze-video

  app.post("/api/analyze-video", aiRateLimiter, async (req, res) => {
    try {
      const { prompt, videoBase64, videoType } = req.body;
      if (!videoBase64) return res.status(400).json({ error: "No video provided" });

      const ai = getAI();
      const { base64: pureBase64, mimeType: mime } = await resolveBase64AndMime(videoBase64, videoType || "video/mp4");

      let uploadedFile = null;
      let promptParts = [];
      
      if (mime.startsWith("video/")) {
         const tmpFile = path.join(os.tmpdir(), `upload_${Date.now()}.mp4`);
         fs.writeFileSync(tmpFile, Buffer.from(pureBase64, 'base64'));
         uploadedFile = await ai.files.upload({ file: tmpFile, config: { mimeType: mime } });
         
         let fileInfo = await ai.files.get({ name: uploadedFile.name });
         while (fileInfo.state === 'PROCESSING') {
           await new Promise(r => setTimeout(r, 2000));
           fileInfo = await ai.files.get({ name: uploadedFile.name });
         }
         if (fileInfo.state === 'FAILED') {
           throw new Error("Video processing failed");
         }
         
         promptParts.push({
           fileData: {
             fileUri: uploadedFile.uri,
             mimeType: mime
           }
         });
         fs.unlinkSync(tmpFile);
      } else {
         promptParts.push({
           inlineData: {
             data: pureBase64,
             mimeType: mime
           }
         });
      }
      
      promptParts.push(prompt || "Analyze this media.");

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptParts
      });
      
      if (uploadedFile) {
         try { await ai.files.delete({ name: uploadedFile.name }); } catch(e) {}
      }
      res.json({ text: response.text });
    } catch (e: any) {
      console.error("Video analysis failed:", e);
      const msg = getErrorMessage(e);
      res.status(msg.includes("limit reached") ? 429 : 500).json({ error: msg });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EventSync AI Server running on http://localhost:${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  [WARNING] GEMINI_API_KEY environment variable is not defined. AI features will require this key to be set in secrets.");
    }
  });
}

startServer().catch((err) => {
  console.error("Error starting EventSync server:", err);
});
