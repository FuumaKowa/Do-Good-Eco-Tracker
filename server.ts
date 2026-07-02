import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limits for base64 food image uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Helper for lazy loading Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please add your Gemini API Key in the Secrets/Settings panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Robust retry and fallback runner for Gemini API model calls
async function runWithRetry<T>(
  fn: (modelName: string) => Promise<T>,
  models: string[] = ["gemini-2.5-flash", "gemini-2.5-flash-8b", "gemini-3.5-flash", "gemini-3.1-flash-lite"]
): Promise<T> {
  let lastError: any = null;
  
  for (const model of models) {
    let attempt = 0;
    const maxRetries = 2; // Retry twice per model before falling back to the next model
    
    while (attempt < maxRetries) {
      try {
        console.log(`Attempting Gemini API call with model: ${model} (Attempt ${attempt + 1}/${maxRetries})`);
        return await fn(model);
      } catch (error: any) {
        attempt++;
        lastError = error;
        const errMsg = error?.message || String(error);
        console.warn(`Attempt ${attempt} failed with model ${model}: ${errMsg}`);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 400;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    
    console.log(`Switching model from ${model} to the next available fallback model...`);
  }
  
  throw lastError || new Error("All Gemini model fallback attempts failed.");
}

// 9-Day Detox Program Plan constants
const PROGRAM_METADATA = {
  phases: [
    {
      name: "Phase 1: Day 1-3 (Adjustment Phase)",
      breakfast: "2 Boiled eggs, with warm water, sugar-free soy milk, or black coffee.",
      lunch: "Vegetable Soup (corn, tomato, tofu, enoki mushroom, assorted vegetables). Add brown rice if hungry.",
      dinner: "Do Good Enzyme ONLY (No solid food).",
      enzymeDosage: "2 sachets (10g) every 2 hours, 8 times daily. Total 16 sachets (80g).",
      enzymeSchedule: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM", "10:00 PM"],
      waterTarget: "2-3 Liters of warm water daily.",
    },
    {
      name: "Phase 2: Day 4-6 (Deep Detox Phase)",
      breakfast: "2 Boiled eggs only.",
      lunch: "Do Good Enzyme ONLY (No solid food).",
      dinner: "Do Good Enzyme ONLY (No solid food).",
      enzymeDosage: "2 sachets (10g) every 1 hour, 14 times daily. Total 28 sachets (140g).",
      enzymeSchedule: [
        "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
        "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
      ],
      waterTarget: "2-3 Liters of warm water daily (Highly recommended to drink plenty!).",
    },
    {
      name: "Phase 3: Day 7-9 (Restoration Phase)",
      breakfast: "2 Boiled eggs, with warm water, sugar-free soy milk, or black coffee.",
      lunch: "Vegetable Soup (corn, tomato, tofu, enoki mushroom, assorted vegetables). Add brown rice if needed.",
      dinner: "Do Good Enzyme ONLY (No solid food).",
      enzymeDosage: "2 sachets (10g) every 2 hours, 8 times daily. Total 16 sachets (80g).",
      enzymeSchedule: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM", "10:00 PM"],
      waterTarget: "2-3 Liters of warm water daily.",
    }
  ],
  avoidList: [
    "Fried foods",
    "Alcohol",
    "Milk tea",
    "High-sugar drinks",
    "Processed foods",
    "Cold/Iced drinks",
    "Late-night snacks"
  ],
  notRecommendedFor: [
    "Pregnant women",
    "Severe diabetes patients",
    "Kidney disease patients",
    "Severe stomach ulcer patients",
    "Long-term low blood sugar individuals",
    "Those undergoing major medical treatment"
  ]
};

// API: Analyze food image or description using Gemini
app.post("/api/analyze-food", async (req, res) => {
  try {
    const { image, text, currentDay, lang } = req.body;
    const isChinese = lang === "zh";
    const day = parseInt(currentDay) || 1;
    const phaseIndex = day <= 3 ? 0 : day <= 6 ? 1 : 2;
    const phase = PROGRAM_METADATA.phases[phaseIndex];

    const ai = getGeminiClient();

    let contentParts: any[] = [];
    let promptText = `
You are an expert nutritional analyst and detox coach specializing in the "Do Good 9-Day Internal Eco-Plan".
Analyze the food provided (either from the image or text description).

Current Context of the User:
- Day of 9-Day Detox Plan: Day ${day} (${phase.name})
- Today's Phase Diet Rules:
  * Breakfast: ${phase.breakfast}
  * Lunch: ${phase.lunch}
  * Dinner: ${phase.dinner}
  * Recommended Enzyme Dosage: ${phase.enzymeDosage}
- Strictly avoided foods: ${PROGRAM_METADATA.avoidList.join(", ")}
- User's Preferred Interface Language: ${isChinese ? "Chinese (简体中文)" : "English"}

${isChinese ? "IMPORTANT: Because the user's preferred language is Chinese, you MUST write the values for 'foodName', 'complianceMessage', 'enzymeDosageRecommendation', 'metabolicTip', and any entries in 'detectedAvoidedItems' in Chinese (简体中文). Keep the JSON keys exactly as they are." : ""}

Analyze this food:
1. Identify the food name.
2. Estimate nutrients: Calories (kcal), Protein (g), Carbohydrates (g), Fats (g). If it's the "Do Good Enzyme" itself, it has negligible calories but represents excellent compliance.
3. Determine if this food complies with today's Phase Diet Rules. (E.g. on Days 4-6, lunch should be enzyme only. If they eat normal lunch, it's non-compliant. On Days 1-3 and 7-9, lunch should be vegetable soup with optional brown rice).
4. Identify if any strictly avoided items (like fried food, alcohol, processed food, high-sugar drinks, iced drinks, etc.) are present in the food.
5. Create a personal compliance feedback message explaining why it complies or why it violates today's plan.
6. Provide an "enzymeDosageRecommendation" custom tip (e.g. "Take 2 sachets of Do Good Enzyme with warm water at your next scheduled hour: ${phase.enzymeSchedule[0]} to aid metabolism").
7. Provide a practical metabolic or lifestyle tip based on the food and detox plan.

You MUST respond strictly in JSON format matching this schema:
{
  "foodName": "Name of the food identified",
  "calories": 250, // estimated calories as an integer number
  "protein": 10, // estimated protein in grams as an integer
  "carbs": 35, // estimated carbs in grams as an integer
  "fat": 8, // estimated fat in grams as an integer
  "compliant": true, // boolean, whether this food is allowed for the CURRENT phase/meal.
  "complianceMessage": "Detailed message explaining why it's compliant or not with Day ${day}'s guidelines",
  "detectedAvoidedItems": ["list", "of", "avoided", "components", "found", "else", "empty", "array"],
  "enzymeDosageRecommendation": "Specific dosage guidelines matching Day ${day} and guidelines",
  "metabolicTip": "A useful, encouraging tip on water intake, metabolism, or detox guidelines"
}
`;

    contentParts.push({ text: promptText });

    if (image) {
      // image comes in as data:image/jpeg;base64,...
      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ error: "Invalid image format uploaded" });
      }
      const mimeType = match[1];
      const base64Data = match[2];
      contentParts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    } else if (text) {
      contentParts.push({ text: `Analyze the following described food: "${text}"` });
    } else {
      return res.status(400).json({ error: "No image or text description provided for analysis." });
    }

    const response = await runWithRetry(async (modelName) => {
      return await ai.models.generateContent({
        model: modelName,
        contents: { parts: contentParts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodName: { type: Type.STRING },
              calories: { type: Type.INTEGER },
              protein: { type: Type.INTEGER },
              carbs: { type: Type.INTEGER },
              fat: { type: Type.INTEGER },
              compliant: { type: Type.BOOLEAN },
              complianceMessage: { type: Type.STRING },
              detectedAvoidedItems: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              enzymeDosageRecommendation: { type: Type.STRING },
              metabolicTip: { type: Type.STRING }
            },
            required: [
              "foodName",
              "calories",
              "protein",
              "carbs",
              "fat",
              "compliant",
              "complianceMessage",
              "detectedAvoidedItems",
              "enzymeDosageRecommendation",
              "metabolicTip"
            ]
          }
        }
      });
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini nutritional analyst.");
    }

    const analysis = JSON.parse(resultText.trim());
    res.json(analysis);

  } catch (error: any) {
    console.error("Error analyzing food:", error);
    res.status(500).json({ error: error.message || "Failed to analyze food intake." });
  }
});

// API: Chat coach to answer questions about the 9-Day Detox Plan or Enzyme dosage
app.post("/api/chat-coach", async (req, res) => {
  try {
    const { message, history, currentDay, lang } = req.body;
    const isChinese = lang === "zh";
    const ai = getGeminiClient();

    const systemInstruction = `
You are the "Do Good Eco Coach", an supportive, expert wellness guide for the "Do Good 9-Day Internal Eco-Plan".
Your goals:
1. Explain and guide the user through the 3 phases of the program:
   - Day 1-3 (Phase 1: Adjustment): Breakfast (2 boiled eggs), Lunch (Veggie soup), Dinner (Enzyme only). Enzyme dosage: 2 sachets every 2 hours, 8 times daily (16 sachets).
   - Day 4-6 (Phase 2: Deep Eco): Breakfast (2 boiled eggs), Lunch & Dinner (Enzyme only). Enzyme dosage: 2 sachets every 1 hour, 14 times daily (28 sachets). Lots of warm water.
   - Day 7-9 (Phase 3: Balance Restoration): Breakfast (2 boiled eggs), Lunch (Veggie soup), Dinner (Enzyme only). Enzyme dosage: 2 sachets every 2 hours, 8 times daily (16 sachets).
2. Help users stay motivated, answer questions about hunger pangs, warm water benefits (2-3 Liters), avoided list items (fried foods, alcohol, sugar, milk tea, cold drinks), and general metabolic health.
3. Be friendly, empathetic, professional, and clear. Avoid overly medical jargon, but give solid nutritional coaching.
4. Translate any program terms precisely. The user's current day is Day ${currentDay || 1}.
5. Encourage drinking warm water and adhering to Do Good Enzyme scheduling.

LANGUAGE DIRECTIVE:
${isChinese ? "IMPORTANT: The user has chosen Chinese (简体中文) as their language. You MUST respond, converse, give recommendations, and write all answers in Chinese (简体中文). Keep your tone caring, encouraging, and clear." : "You must converse and respond in English."}
`;

    // Map history to the required format
    // gemini chat takes custom structures or we can use chat sendMessage.
    // Let's create an ongoing chat and send the message with retry + fallback
    const response = await runWithRetry(async (modelName) => {
      const chat = ai.chats.create({
        model: modelName,
        history: history || [],
        config: {
          systemInstruction,
        }
      });
      return await chat.sendMessage({
        message: message || "Hello! Can you help me with my 9-Day Eco Plan?"
      });
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in chat coach:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with wellness coach." });
  }
});

// Serve program static metadata
app.get("/api/program-data", (req, res) => {
  res.json(PROGRAM_METADATA);
});

// Custom error handling middleware to ensure API routes always return JSON instead of HTML
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled API error:", err);
  if (req.path.startsWith("/api/")) {
    res.status(500).json({ error: err?.message || "Internal Server Error" });
  } else {
    next(err);
  }
});

// Vite & Static file hosting
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Do Good Eco Tracker server running on http://localhost:${PORT}`);
  });
}

initServer();
