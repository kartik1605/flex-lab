'use strict';
require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

if (!process.env.GEMINI_API_KEY) {
  console.error('\n❌  GEMINI_API_KEY not found.\n   Create a .env file in the project root:\n   GEMINI_API_KEY=AIza...\n');
  process.exit(1);
}

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const OUT_DIR = path.join(__dirname, '..', 'images');
// Primary: nano-banana-pro-preview (Pro plan)
// Fallback: gemini-3.1-flash-image-preview
const MODEL_PRIMARY  = 'nano-banana-pro-preview';
const MODEL_FALLBACK = 'gemini-3.1-flash-image-preview';

// Brand palette (described in prompts so the model matches the theme)
// Dark bg: #04040a  Violet: #7c3aed  Cyan: #06b6d4
// Gold: #b8a47e    Rose: #f43f5e     Green: #10b981

const CARDS = [
  // ── PRINT LAB ──────────────────────────────────────────────────────────────
  {
    file: 'card-print-wedding.png',
    prompt: `Product photography, dark near-black background, premium wedding invitation
suite flat-lay: cream letterpress card, gold foil wax seal, sage ribbon.
Warm gold accent lighting on obsidian surface. Luxury editorial, no text visible.
Brand palette: deep black background, warm gold highlights #b8a47e.`,
  },
  {
    file: 'card-print-stickers.png',
    prompt: `Product photography, dark background, die-cut holographic sticker collection
fanned on matte black surface, iridescent purple and cyan sheen catching light.
Each sticker a different custom shape. Dark studio, macro lens.
Brand palette: black background, violet #7c3aed and cyan #06b6d4 iridescence.`,
  },
  {
    file: 'card-print-brochures.png',
    prompt: `Product photography, dark charcoal background, premium trifold brochure
unfolded on surface, crisp white pages with minimal clean layout, matte finish,
subtle teal cyan glow on edges. Overhead editorial angle.
Brand palette: dark background, teal cyan #06b6d4 accent edges.`,
  },
  {
    file: 'card-print-hangtags.png',
    prompt: `Product photography, dark background, three luxury retail swing hang-tags
on matte black surface, thick cotton board, rose gold cord, debossed text,
amber warm side light catching edges. Macro lens, editorial.
Brand palette: black background, rose #f43f5e cord, amber #f59e0b light.`,
  },
  {
    file: 'card-print-posters.png',
    prompt: `Product photography, dark background, rolled luxury large-format poster
partially unrolled on black surface showing a bold minimal amber-rose gradient
design, crisp clean edges, matte paper texture.
Brand palette: dark background, amber #f59e0b and rose #f43f5e gradient.`,
  },
  {
    file: 'card-print-packaging.png',
    prompt: `Product photography, near-black background, luxury rigid gift box
matte black finish, subtle emerald green foil detail, violet satin ribbon,
lid open revealing white tissue paper inside. Dark studio, elegant lighting.
Brand palette: black box, green #10b981 foil, violet #7c3aed ribbon.`,
  },
  {
    file: 'card-print-stationery.png',
    prompt: `Product photography, dark marble surface, corporate stationery flat-lay:
cream letterhead, matching envelope, business card, all with gold foil letterpress
crest and a thin violet accent line. Elegant overhead light.
Brand palette: dark surface, gold #b8a47e foil, violet #7c3aed stripe.`,
  },
  {
    file: 'card-print-calendars.png',
    prompt: `Product photography, dark background, premium hardback desk diary,
deep navy cover with gold embossed spine lettering, cream ribbon bookmark,
pages fanned slightly open. Warm golden side light.
Brand palette: dark background, navy with gold #b8a47e embossing.`,
  },
  {
    file: 'card-print-bizcards.png',
    prompt: `Product photography, dark slate surface, stack of matte black business
cards fanned slightly, gold letterpress text, rose-painted gold edges,
single dramatic side light. Macro lens, luxury moody editorial.
Brand palette: black cards, gold #b8a47e text, rose #f43f5e edges.`,
  },

  // ── EVENTS LAB ─────────────────────────────────────────────────────────────
  {
    file: 'card-events-corporate.png',
    prompt: `Product photography editorial, dark cinematic background, luxury corporate
conference stage with deep cyan-blue uplighting, minimal podium, dark auditorium
depth. Wide angle, dramatic moody lighting.
Brand palette: dark background, cyan #06b6d4 uplighting.`,
  },
  {
    file: 'card-events-wedding.png',
    prompt: `Editorial photography, dark elegant background, intimate wedding ceremony
altar with white floral arch, candles, warm rose-gold ambient glow in dark
hall. Cinematic depth of field, luxury.
Brand palette: dark background, rose #f43f5e and gold #b8a47e tones.`,
  },
  {
    file: 'card-events-activation.png',
    prompt: `Editorial photography, dark background, luxury brand pop-up booth with
violet purple LED neon signage, minimalist black structure, amber accent spots.
Cinematic moody commercial photography.
Brand palette: dark background, violet #7c3aed neon, amber #f59e0b accents.`,
  },
  {
    file: 'card-events-social.png',
    prompt: `Editorial photography, dark elegant venue background, birthday celebration
table with amber candle glow, gold balloon arch, dark moody intimate lighting,
luxury private event aesthetic.
Brand palette: dark background, amber #f59e0b candlelight, gold accents.`,
  },
];

// Extract retry-after seconds from a 429 error message
function parseRetryDelay(msg) {
  const match = msg.match(/retry(?:Delay)?"?\s*[=:]\s*"?(\d+)/i)
             || msg.match(/retry in (\d+)/i);
  return match ? (parseInt(match[1], 10) + 2) : 35;
}

async function tryGeminiNative(card, model) {
  const res = await client.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: card.prompt }] }],
    config: { responseModalities: ['IMAGE', 'TEXT'] },
  });
  const parts = res.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
  if (!img) {
    const txt = parts.find(p => p.text)?.text ?? '(no image returned)';
    throw new Error(txt.slice(0, 120));
  }
  return Buffer.from(img.inlineData.data, 'base64');
}

async function generateOne(card) {
  // 1. Try nano-banana-pro-preview
  try {
    const buf = await tryGeminiNative(card, MODEL_PRIMARY);
    fs.writeFileSync(path.join(OUT_DIR, card.file), buf);
    console.log(`  ✓  ${card.file} — nano-banana-pro (${(buf.length/1024).toFixed(0)} KB)`);
    return true;
  } catch (err) {
    const msg = err.message || '';
    const wait = parseRetryDelay(msg);
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      console.log(`  ↻  ${card.file} — rate limited, waiting ${wait}s then trying fallback…`);
      await new Promise(r => setTimeout(r, wait * 1000));
    } else {
      console.warn(`  ⚠  ${card.file} — primary: ${msg.slice(0, 100)}`);
    }
  }

  // 2. Fallback to gemini-3.1-flash-image-preview
  try {
    const buf = await tryGeminiNative(card, MODEL_FALLBACK);
    fs.writeFileSync(path.join(OUT_DIR, card.file), buf);
    console.log(`  ✓  ${card.file} — gemini-3.1-flash-image (${(buf.length/1024).toFixed(0)} KB)`);
    return true;
  } catch (err) {
    console.error(`  ✗  ${card.file}: both models failed — ${err.message.slice(0, 120)}`);
    return false;
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\nFLex LAB — Generating ${CARDS.length} card images via Gemini\n`);

  // Run sequentially to avoid rate-limit bursts
  let ok = 0;
  for (const card of CARDS) {
    const success = await generateOne(card);
    if (success) ok++;
    // Pause between requests to stay within per-minute limits
    if (ok < CARDS.length - 1) await new Promise(r => setTimeout(r, 4000));
  }

  console.log(`\nDone — ${ok}/${CARDS.length} images saved to images/\n`);
}

main();
