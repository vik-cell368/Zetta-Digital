import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for translation
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguages } = req.body;
      
      if (!text || !targetLanguages || !Array.isArray(targetLanguages)) {
        return res.status(400).json({ error: "Missing text or targetLanguages" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Translate the following text into these languages: ${targetLanguages.join(", ")}. 
Return ONLY a valid JSON object where keys are the language codes and values are the translated strings. Do not include markdown formatting or backticks.
For example, if translating to 'de' and 'fr', return: {"de": "...", "fr": "..."}

Text to translate:
"${text}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const translatedText = response.text;
      let result;
      try {
        result = JSON.parse(translatedText || "{}");
      } catch (e) {
        return res.status(500).json({ error: "Failed to parse translation response" });
      }

      res.json(result);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate text" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
