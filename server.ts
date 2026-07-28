import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Initialize GenAI lazily or when available
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. AI Stylist Assistant Endpoint
app.post("/api/ai/stylist-chat", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // High-quality smart fallback if key is not configured
      const fallbackReplies = [
        `As your STYLORA AI fashion stylist, I recommend pairing pastel lavender layers with minimalist monochrome accents. For a ${context || "chic look"}, try an oversized structured blazer with wide-leg trousers to elevate your style score to 95+!`,
        `Based on current runway trends, metallic silver accessories combined with sustainable eco-cotton fabrics create an ultra-modern futuristic vibe!`,
        `For your wardrobe query: mixing high-street staples with vintage student marketplace items reduces your carbon footprint while maximizing outfit combinations!`,
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({ text: randomReply, isFallback: true });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are STYLORA's elite AI Fashion Stylist and Sustainable Luxury Concierge. 
Context: ${context || "General Fashion Query"}.
Provide inspiring, highly tailored advice on outfits, color matching, sustainable fashion, body shape styling, or marketplace recommendations. Keep responses sleek, friendly, luxury-focused, and concise (2-4 bullet points or short paragraphs).`,
      },
    });

    res.json({ text: response.text || "I'm analyzing your style request..." });
  } catch (error: any) {
    console.error("Stylist Chat Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate styling response" });
  }
});

// 2. Korean Personal Color Analysis
app.post("/api/ai/color-analysis", async (req, res) => {
  try {
    const { imageBase64, answers } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Dynamic tailored fallback response
      return res.json({
        season: "Summer Cool",
        undertone: "Cool Pink / Rosy Undertone",
        hairColor: "Ash Brown / Espresso",
        eyeColor: "Deep Hazel / Dark Brown",
        paletteName: "Ethereal Lavender & Soft Ice Blues",
        bestColors: [
          { name: "Dusty Lavender", hex: "#B39DDB" },
          { name: "Ice Blue", hex: "#E1F5FE" },
          { name: "Soft Mauve", hex: "#CE93D8" },
          { name: "Periwinkle", hex: "#9FA8DA" },
          { name: "Pure Sage", hex: "#C8E6C9" }
        ],
        avoidColors: [
          { name: "Mustard Yellow", hex: "#FBC02D" },
          { name: "Rust Orange", hex: "#E64A19" },
          { name: "Warm Olive", hex: "#827717" }
        ],
        jewelry: "Platinum, White Gold & Pearl Silver",
        makeup: "Berry lip tints, soft lavender blush, & cool-toned nude eyeshadows",
        hairSuggestions: "Ash Violet, Cool Black, or Frosted Mocha",
        isFallback: true
      });
    }

    const contents: any[] = [];
    if (imageBase64) {
      const mime = imageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents.push({
        inlineData: { mimeType: mime, data: base64Data },
      });
    }
    contents.push({
      text: `Analyze this selfie or color profile. User questionnaire: ${JSON.stringify(answers || {})}. Perform Korean Personal Color Analysis. Respond in valid JSON strictly matching the schema.`,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            season: { type: Type.STRING, description: "One of: Spring Warm, Summer Cool, Autumn Warm, Winter Cool" },
            undertone: { type: Type.STRING },
            hairColor: { type: Type.STRING },
            eyeColor: { type: Type.STRING },
            paletteName: { type: Type.STRING },
            bestColors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                },
              },
            },
            avoidColors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                },
              },
            },
            jewelry: { type: Type.STRING },
            makeup: { type: Type.STRING },
            hairSuggestions: { type: Type.STRING },
          },
          required: ["season", "undertone", "bestColors", "avoidColors", "jewelry", "makeup", "hairSuggestions"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Color Analysis Error:", error);
    res.status(500).json({ error: error?.message || "Color analysis failed" });
  }
});

// 3. Body Shape Analysis
app.post("/api/ai/body-shape", async (req, res) => {
  try {
    const { imageBase64, measurements } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        shape: "Hourglass",
        description: "Balanced bust and hips with a distinctly defined waistline. High visual harmony and versatile silhouette options.",
        proportions: { bust: 36, waist: 26, hips: 37 },
        recommendations: [
          { title: "Wrap Dresses & Belted Trench Coats", reason: "Emphasizes waist definition and preserves natural symmetry." },
          { title: "High-Waisted Wide Leg Trousers", reason: "Elongates leg line while maintaining balanced hips." },
          { title: "Structured Blazers with Fitted Waist", reason: "Adds modern architectural tailoring to silhouette." }
        ],
        avoidList: ["Overly boxy shapeless shift dresses", "Unstructured low-waist heavy tunics"],
        isFallback: true
      });
    }

    const contents: any[] = [];
    if (imageBase64) {
      const mime = imageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents.push({
        inlineData: { mimeType: mime, data: base64Data },
      });
    }
    contents.push({
      text: `Analyze body silhouette from image or measurements: ${JSON.stringify(measurements || {})}. Classify into Hourglass, Pear, Apple, Rectangle, or Inverted Triangle, and provide haute-couture styling rules. Respond in JSON.`,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shape: { type: Type.STRING },
            description: { type: Type.STRING },
            proportions: {
              type: Type.OBJECT,
              properties: {
                bust: { type: Type.NUMBER },
                waist: { type: Type.NUMBER },
                hips: { type: Type.NUMBER },
              },
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
              },
            },
            avoidList: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["shape", "description", "recommendations", "avoidList"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Body Shape Error:", error);
    res.status(500).json({ error: error?.message || "Body shape analysis failed" });
  }
});

// 4. AI Style Score Generator
app.post("/api/ai/style-score", async (req, res) => {
  try {
    const { outfitName, items, occasion } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        totalScore: 94,
        breakdown: {
          bodyMatch: 96,
          colorMatch: 95,
          trendScore: 92,
          occasionMatch: 94,
          sustainabilityScore: 95
        },
        feedback: "Exceptional visual balance! Combining sustainable organic linen with recycled silver hardware earns top marks. To reach 98+, consider swapping dark shoes for nude tinted leather.",
        isFallback: true
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Evaluate style score out of 100 for outfit '${outfitName || 'Curated Outfit'}' on occasion '${occasion || 'Runway Minimalist'}'. Items: ${JSON.stringify(items || [])}. Return JSON with breakdown and feedback.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalScore: { type: Type.NUMBER },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                bodyMatch: { type: Type.NUMBER },
                colorMatch: { type: Type.NUMBER },
                trendScore: { type: Type.NUMBER },
                occasionMatch: { type: Type.NUMBER },
                sustainabilityScore: { type: Type.NUMBER },
              },
            },
            feedback: { type: Type.STRING },
          },
          required: ["totalScore", "breakdown", "feedback"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Style Score Error:", error);
    res.status(500).json({ error: error?.message || "Failed to calculate style score" });
  }
});

// 5. AI Outfit Image Generation & Editing (Gemini Image Models with Resolution & Prompt support)
app.post("/api/ai/generate-outfit-image", async (req, res) => {
  try {
    const { prompt, sourceImageBase64, imageSize = "1K", aspectRatio = "3:4" } = req.body;
    const ai = getAIClient();

    if (!ai) {
      const fallbackImages = [
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
      ];
      const randomImg = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
      return res.json({
        imageUrl: randomImg,
        promptUsed: prompt,
        imageSize,
        aspectRatio,
        isFallback: true,
        message: "Demo preview generated. Configure GEMINI_API_KEY for live Gemini AI generation."
      });
    }

    const contentsParts: any[] = [];

    if (sourceImageBase64) {
      const mime = sourceImageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
      const base64Data = sourceImageBase64.replace(/^data:image\/\w+;base64,/, "");
      contentsParts.push({
        inlineData: { mimeType: mime, data: base64Data }
      });
    }

    contentsParts.push({
      text: `High-fashion luxury outfit photoshoot: ${prompt || "An haute-couture evening dress with delicate silk drapery"}. Studio lighting, clean background, ultra detailed fabric texture.`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: { parts: contentsParts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "3:4",
          imageSize: imageSize || "1K"
        }
      }
    });

    let generatedImageUrl = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Str = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || "image/png";
          generatedImageUrl = `data:${mimeType};base64,${base64Str}`;
          break;
        }
      }
    }

    if (!generatedImageUrl) {
      return res.status(500).json({ error: "No image output returned from Gemini AI model." });
    }

    res.json({
      imageUrl: generatedImageUrl,
      promptUsed: prompt,
      imageSize,
      aspectRatio
    });
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate outfit image" });
  }
});

// 6. AI Virtual Style Fit & Tailoring Diagnostic Endpoint
app.post("/api/ai/virtual-fit-analysis", async (req, res) => {
  try {
    const { bodyPhotoBase64, outfitPhotoBase64, garmentName, size, style } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        fitScore: 97,
        compatibilityTier: "Perfect Fit",
        silhouetteHarmony: "High geometric alignment with natural shoulder line and waist contour.",
        tailoringAdvice: "Hemline falls at ideal ankle break. Optional 0.5-inch waist cinch for extra sculpting.",
        fabricDrapeNotes: "Fluid vertical drape with optimal tension across bust and hips.",
        colorContrastRating: "Complements skin tone undertone with vibrant contrast.",
        isFallback: true
      });
    }

    const contents: any[] = [];
    if (bodyPhotoBase64) {
      const mime = bodyPhotoBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
      const base64Data = bodyPhotoBase64.replace(/^data:image\/\w+;base64,/, "");
      contents.push({ inlineData: { mimeType: mime, data: base64Data } });
    }
    if (outfitPhotoBase64) {
      const mime = outfitPhotoBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
      const base64Data = outfitPhotoBase64.replace(/^data:image\/\w+;base64,/, "");
      contents.push({ inlineData: { mimeType: mime, data: base64Data } });
    }

    contents.push({
      text: `Perform Virtual Style Fit & Tailoring Diagnostic for garment '${garmentName || 'Garment'}' in size '${size || 'M'}' with drape style '${style || 'Tailored Precision'}'. Analyze silhouette, proportions, drape, and tailoring needs. Return JSON.`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fitScore: { type: Type.NUMBER },
            compatibilityTier: { type: Type.STRING },
            silhouetteHarmony: { type: Type.STRING },
            tailoringAdvice: { type: Type.STRING },
            fabricDrapeNotes: { type: Type.STRING },
            colorContrastRating: { type: Type.STRING },
          },
          required: ["fitScore", "compatibilityTier", "silhouetteHarmony", "tailoringAdvice", "fabricDrapeNotes", "colorContrastRating"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Virtual Fit Analysis Error:", error);
    res.status(500).json({ error: error?.message || "Fit analysis failed" });
  }
});

// Start Express and Vite middleware
async function startServer() {
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
    console.log(`STYLORA server running on http://localhost:${PORT}`);
  });
}

startServer();
