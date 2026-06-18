import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialization of the Gemini SDK Client
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the host environment settings.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// Helper to call Gemini with a stable retry wrapper for transient 503/UNAVAILABLE or high-load spikes
async function generateContentWithRetry(
  aiClient: GoogleGenAI,
  params: { model: string; contents: string; config: any },
  maxRetries = 3
): Promise<any> {
  let delay = 1000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await aiClient.models.generateContent(params);
    } catch (err: any) {
      const errMsg = String(err?.message || err || "").toLowerCase();
      const isTransient = 
        errMsg.includes("503") || 
        errMsg.includes("unavailable") || 
        errMsg.includes("high demand") || 
        errMsg.includes("overloaded") ||
        errMsg.includes("temporary") ||
        err?.status === 503;

      if (isTransient && attempt < maxRetries) {
        console.warn(`[Gemini API] Temporary 503 overload encountered on attempt ${attempt}/${maxRetries}. Retrying in ${delay}ms... details: ${err?.message || err}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff scaling
      } else {
        throw err;
      }
    }
  }
}

// Server-side AI Advisor endpoint
app.post("/api/chat", async (req, res): Promise<void> => {
  try {
    const { message, profile, footprint, savedCO2 } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: "GEMINI_API_KEY is not configured in the host environment settings." });
      return;
    }

    let aiClient: GoogleGenAI;
    try {
      aiClient = getGeminiClient();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Embed profile contexts into a detailed custom instruction prompt
    let systemInstruction = `You are a professional carbon footprint expert coach. 
The user is using ZeroCarbon to understand and decrease their environmental impact. 
`;

    if (footprint) {
      systemInstruction += `
User Annual Footprint: ${footprint.total} Tons CO2e/year.
Sector Breakdown:
- Diet/Food: ${footprint.breakdown?.food} t CO2e/year
- Travel/Transit: ${footprint.breakdown?.travel} t CO2e/year
- Home Energy: ${footprint.breakdown?.energy} t CO2e/year
- Secondary Shopping: ${footprint.breakdown?.shopping} t CO2e/year

Today they have logged actions and offset ${savedCO2 || 0} kg CO2 today.
`;
    }

    if (profile) {
      systemInstruction += `
User Lifestyle Profile:
- Diet choice: ${profile.diet}
- vehicleType: ${profile.vehicleType}
- publicTransit: ${profile.publicTransit}
- flights: ${profile.flights}
- homeSpace: ${profile.homeSize}
- energySource: ${profile.electricitySource}
- heatingOption: ${profile.heating}
- consumeristProfile: ${profile.shoppingHabits}
`;
    }

    systemInstruction += `
Provide friendly, actionable, factual climate advice, keeping in mind IPCC and EPA guidelines. 
Use markdown (bold text, bullet points) to format your response nicely. Don't be overly verbose. Be highly practical, encouraging, and clear.`;

    const response = await generateContentWithRetry(aiClient, {
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I was unable to formulate climate advice at this time.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    const status = err?.status || (String(err?.message || "").includes("503") ? 503 : 500);
    res.status(status).json({ error: err?.message || "Internal server error" });
  }
});

// Vite middleware for development, static file serving for production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
