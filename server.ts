import express from "express";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Resend } from 'resend';

async function startServer() {
  const app = express();
  const PORT = 3000;

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  // Compression middleware (Gzip / Brotli)
  app.use(compression({
    level: 6,
    threshold: 1024,
  }));

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
        model: "gemini-2.0-flash",
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

  // API route for booking confirmation email with Zoom link
  app.post("/api/booking/confirm", async (req, res) => {
    try {
      const { email, name, date, time, services } = req.body;

      if (!resend) {
        console.warn("RESEND_API_KEY is missing, skipping email");
        return res.json({ success: true, message: "Email skipped (no API key)" });
      }

      const zoomLink = process.env.VITE_ZOOM_MEETING_LINK || "https://zoom.us/j/your-meeting-id";
      
      const { data, error } = await resend.emails.send({
        from: 'Zetta Digital <onboarding@resend.dev>',
        to: [email],
        subject: 'Bestätigung: Dein Beratungsgespräch bei Zetta Digital',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
            <h1 style="color: #06b6d4;">Vielen Dank für deine Buchung!</h1>
            <p>Hallo ${name},</p>
            <p>wir freuen uns auf unser gemeinsames Gespräch am <strong>${date} um ${time} Uhr</strong>.</p>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0;">Deine Buchungsdetails:</h3>
              <p style="margin-bottom: 0;"><strong>Termin:</strong> ${date} um ${time} Uhr</p>
              <p style="margin-top: 8px;"><strong>Zoom Link:</strong> <a href="${zoomLink}" style="color: #06b6d4; font-weight: bold;">Hier dem Meeting beitreten</a></p>
            </div>

            <p>Solltest du den Termin nicht wahrnehmen können, gib uns bitte rechtzeitig Bescheid.</p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            <p style="font-size: 12px; color: #64748b;">Zetta Digital - Deine Agentur für digitale Exzellenz</p>
          </div>
        `,
      });

      if (error) {
        console.error("Email error:", error);
        return res.status(400).json({ error });
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send email" });
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
    // Production: serve from dist folder with optimal cache controls
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { 
      index: false,
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|woff|woff2)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    
    app.get('*', (req, res, next) => {
      // Avoid catching API routes or static files that should have been handled by static middleware
      if (req.path.startsWith('/api')) return next();
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
