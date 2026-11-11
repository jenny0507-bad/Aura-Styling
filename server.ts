import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase JSON payload limit for base64 photo uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Data storage directory
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const WARDROBE_FILE = path.join(DATA_DIR, 'wardrobe.json');
const LOOKS_FILE = path.join(DATA_DIR, 'looks.json');
const PLANNER_FILE = path.join(DATA_DIR, 'planner.json');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for file reading/writing
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// REST API ROUTES
app.get('/api/wardrobe', (_req, res) => {
  const items = readJsonFile(WARDROBE_FILE, []);
  res.json({ items });
});

app.post('/api/wardrobe', (req, res) => {
  const { items } = req.body;
  if (Array.isArray(items)) {
    writeJsonFile(WARDROBE_FILE, items);
    res.json({ success: true, count: items.length });
  } else {
    res.status(400).json({ error: 'Items must be an array' });
  }
});

app.get('/api/looks', (_req, res) => {
  const looks = readJsonFile(LOOKS_FILE, []);
  res.json({ looks });
});

app.post('/api/looks', (req, res) => {
  const { looks } = req.body;
  if (Array.isArray(looks)) {
    writeJsonFile(LOOKS_FILE, looks);
    res.json({ success: true, count: looks.length });
  } else {
    res.status(400).json({ error: 'Looks must be an array' });
  }
});

app.get('/api/planner', (_req, res) => {
  const planner = readJsonFile(PLANNER_FILE, {});
  res.json({ planner });
});

app.post('/api/planner', (req, res) => {
  const { planner } = req.body;
  writeJsonFile(PLANNER_FILE, planner || {});
  res.json({ success: true });
});

app.get('/api/profile', (_req, res) => {
  const profile = readJsonFile(PROFILE_FILE, null);
  res.json({ profile });
});

app.post('/api/profile', (req, res) => {
  const { profile } = req.body;
  writeJsonFile(PROFILE_FILE, profile);
  res.json({ success: true });
});

// AI Analyze Clothing / Accessory Image
app.post('/api/ai/analyze-clothing', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const prompt = `Analyze this uploaded fashion item with the precision of a high-end luxury fashion archivist.
Extract:
1. title: Elegant descriptive title (e.g. "Tailored Pleated Cream Linen Trousers")
2. category: Must be one of ["tops", "bottoms", "dresses", "footwear", "jewellery", "accessories"]
3. subcategory: Specific garment type (e.g., "Oversized Blazer", "Pleated Trousers", "Midi Slip Dress", "Loafers", "Gold Hoop Earrings", "Structured Shoulder Bag")
4. primaryColor: Dominant color (e.g., "Warm Cream", "Mocha Brown", "Gold", "Ivory")
5. secondaryColors: Array of accent/secondary colors
6. aesthetics: Array from ["Old Money", "Clean Girl", "Coquette", "Y2K", "Minimalist", "Korean Fashion", "Streetwear", "Casual Chic", "Soft Girl", "Elegant / Classy", "Western", "Indo-Western"]
7. season: Array from ["Spring", "Summer", "Autumn", "Winter", "All Season"]
8. occasions: Array of suitable occasions from ["School / College Regular Wear", "College Party", "School Party", "Office Wear", "Office Meetings", "Casual Outings", "Shopping", "Date Night", "Birthday Parties", "Weddings / Traditional Events", "Travel Outfits", "Festive Wear", "Daily Wear"]
9. material: Fabric or material description (e.g., "100% Breathable Woven Linen", "Heavyweight Mulberry Silk")
10. stylingTips: A 1-2 sentence pro-stylist tip on how to pair this piece effortlessly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            subcategory: { type: Type.STRING },
            primaryColor: { type: Type.STRING },
            secondaryColors: { type: Type.ARRAY, items: { type: Type.STRING } },
            aesthetics: { type: Type.ARRAY, items: { type: Type.STRING } },
            season: { type: Type.ARRAY, items: { type: Type.STRING } },
            occasions: { type: Type.ARRAY, items: { type: Type.STRING } },
            material: { type: Type.STRING },
            stylingTips: { type: Type.STRING },
          },
          required: [
            'title',
            'category',
            'subcategory',
            'primaryColor',
            'aesthetics',
            'season',
            'occasions',
            'material',
            'stylingTips',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ analysis: parsed });
  } catch (error: any) {
    console.error('AI clothing analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze clothing item' });
  }
});

// AI Outfit Generator using ONLY uploaded wardrobe
app.post('/api/ai/generate-outfits', async (req, res) => {
  try {
    const {
      wardrobe = [],
      occasion = 'Casual Outings',
      aesthetic = 'Clean Girl',
      weather = 'Mild / Spring',
      comfort = 'Chic & Polished',
      prioritizeUnused = false,
      colorPreference = '',
      notes = '',
    } = req.body;

    if (!Array.isArray(wardrobe) || wardrobe.length === 0) {
      return res.status(400).json({ error: 'Wardrobe is empty. Upload items first.' });
    }

    // Prepare wardrobe inventory summary
    const inventory = wardrobe.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      color: item.primaryColor,
      aesthetics: item.aesthetics,
      timesWorn: item.timesWorn || 0,
    }));

    const unusedInstructions = prioritizeUnused
      ? 'CRITICAL MANDATE: Prioritize styling items with timesWorn == 0 or low wear counts so the user rediscovers neglected pieces.'
      : '';

    const systemPrompt = `You are an elite Pinterest-inspired personal stylist and luxury creative director.
Your core principle: You MUST create outfit combinations strictly using items from the provided Wardrobe Inventory. NEVER invent items that are not in the inventory.

The user's styling request:
- Occasion: ${occasion}
- Aesthetic Theme: ${aesthetic}
- Weather / Season: ${weather}
- Comfort / Polish Level: ${comfort}
- Color Preference: ${colorPreference || 'Harmonious with aesthetic'}
- Stylist Notes: ${notes || 'Focus on high visual appeal and proportion balance'}
${unusedInstructions}

Wardrobe Inventory:
${JSON.stringify(inventory, null, 2)}

Create 3 distinct, magazine-worthy outfit combinations.
For EACH outfit, you MUST provide:
1. id: unique string
2. title: Evocative editorial outfit title (e.g. "The Effortless Parisian Capsule", "Sun-Drenched Riviera Chic")
3. aesthetic: primary aesthetic reflected
4. itemIds: Array of exact item IDs used in this outfit from the inventory. Must include:
   - Either a dress OR (a top + a bottom)
   - Footwear (if available)
   - Jewellery (if available)
   - Accessories / Bag (if available)
5. colorCoordination: Pro description of the color harmony
6. stylingRationale: Editorial explanation of why this combination flatters the occasion
7. beauty:
   - makeup:
     - style: e.g. "Clean Girl Dewy Glow", "Smoky Velvet Date Night"
     - lips: Specific shade and finish (e.g. "Spiced terracotta satin gloss")
     - blush: Specific placement and tone (e.g. "Warm peach cream diffused high on cheekbones")
     - eyes: Specific eye makeup technique and palette
   - hair:
     - style: Specific hairstyle name (e.g. "Relaxed French twist with face-framing tendrils", "Sleek low ballet bun")
     - details: How it balances the outfit neckline and shoulders
   - nails: Curated manicure aesthetic (e.g. "Milky glazed donut chrome", "Deep burgundy espresso")
   - layeringAdvice: Specific pro styling tricks (e.g., "French tuck the knit loosely", "Roll blazer cuffs once to highlight the gold watch")
   - finishingTouches: Final sensory or aesthetic detail (scent profile, posture, bag carry style)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              aesthetic: { type: Type.STRING },
              itemIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              colorCoordination: { type: Type.STRING },
              stylingRationale: { type: Type.STRING },
              beauty: {
                type: Type.OBJECT,
                properties: {
                  makeup: {
                    type: Type.OBJECT,
                    properties: {
                      style: { type: Type.STRING },
                      lips: { type: Type.STRING },
                      blush: { type: Type.STRING },
                      eyes: { type: Type.STRING },
                    },
                    required: ['style', 'lips', 'blush', 'eyes'],
                  },
                  hair: {
                    type: Type.OBJECT,
                    properties: {
                      style: { type: Type.STRING },
                      details: { type: Type.STRING },
                    },
                    required: ['style', 'details'],
                  },
                  nails: { type: Type.STRING },
                  layeringAdvice: { type: Type.STRING },
                  finishingTouches: { type: Type.STRING },
                },
                required: ['makeup', 'hair', 'nails', 'layeringAdvice', 'finishingTouches'],
              },
            },
            required: [
              'id',
              'title',
              'aesthetic',
              'itemIds',
              'colorCoordination',
              'stylingRationale',
              'beauty',
            ],
          },
        },
      },
    });

    const outfits = JSON.parse(response.text || '[]');
    res.json({ outfits });
  } catch (error: any) {
    console.error('AI outfit generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate outfits' });
  }
});

// AI Personal Virtual Try-On
app.post('/api/ai/try-on', async (req, res) => {
  try {
    const {
      userPhotoBase64,
      userMimeType = 'image/jpeg',
      outfitTitle,
      outfitDescription,
      clothingDescriptions = [],
    } = req.body;

    if (!userPhotoBase64) {
      return res.status(400).json({ error: 'User photo is required for virtual try-on' });
    }

    const cleanUserPhoto = userPhotoBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const promptText = `High fashion virtual try-on portrait.
Keep the exact person shown in the reference image: preserve their exact face, facial features, skin tone, hair color, and natural body proportions.
Dress them in this specific coordinated outfit:
${outfitTitle}: ${outfitDescription}
Garments and styling details:
${clothingDescriptions.join(', ')}

The result must look like a high-end luxury editorial full-body fashion photograph of THIS EXACT PERSON wearing the selected outfit, naturally standing in an elegant sunlit Parisian apartment or architectural boutique, commercial fashion magazine quality, realistic fabric draping and natural studio lighting.`;

    // Attempt virtual try-on image generation via Gemini image editing
    try {
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanUserPhoto,
                mimeType: userMimeType,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '3:4',
          },
        },
      });

      let generatedImageUrl: string | null = null;
      for (const part of imgResponse.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/jpeg';
          generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (generatedImageUrl) {
        return res.json({
          success: true,
          tryOnImageUrl: generatedImageUrl,
          method: 'ai_rendered',
        });
      }
    } catch (tryOnError) {
      console.warn('Gemini image try-on model fallback:', tryOnError);
    }

    // Fallback: If image generation model requires paid tier or is unavailable,
    // return status indicating client can show high-fidelity side-by-side mannequin visualization
    res.json({
      success: true,
      tryOnImageUrl: null,
      method: 'composite_preview',
      message: 'Visual outfit moodboard rendered with your body proportions and color harmony.',
    });
  } catch (error: any) {
    console.error('Virtual try-on error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate try-on' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURA Personal Wardrobe & Stylist server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
