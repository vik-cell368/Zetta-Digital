import express from "express";
import path from "path";
import helmet from "helmet";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security headers - Reinforced for SSL/TLS environments
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev compatibility with Vite, but other headers remain
    crossOriginEmbedderPolicy: false
  }));

  app.use(express.json());

  // API route for translation
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguages } = req.body;
      
      if (!text || !targetLanguages || !Array.isArray(targetLanguages)) {
        return res.status(400).json({ error: "Missing text or targetLanguages" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const prompt = `Translate the following text into these languages: ${targetLanguages.join(", ")}. 
Return ONLY a valid JSON object where keys are the language codes and values are the translated strings. Do not include markdown formatting or backticks.
For example, if translating to 'de' and 'fr', return: {"de": "...", "fr": "..."}

Text to translate:
"${text}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const translatedText = response.text;
      
      let parsedResult;
      try {
        parsedResult = JSON.parse(translatedText || "{}");
      } catch (e) {
        console.error("Parse error:", e, translatedText);
        return res.status(500).json({ error: "Failed to parse translation response" });
      }

      res.json(parsedResult);
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
    // Production: serve from dist folder
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    
    app.get('*', (req, res, next) => {
      // Avoid catching API routes or static files that should have been handled by static middleware
      if (req.path.startsWith('/api')) return next();
      
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          console.error("Error sending index.html", err);
          res.status(500).send("Server Error");
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
