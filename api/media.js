'use strict';

/**
 * FLex LAB — Media Generation Routes
 *
 * Image: Gemini native multimodal output via generateContent()
 *        Model: gemini-2.0-flash-preview-image-generation
 *
 * Video: Veo 2 long-running operation via generateVideos()
 *        Model: veo-2.0-generate-001
 *        Video generation is async — this module polls until done.
 */

const { GoogleGenAI } = require('@google/genai');

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set. Add it to your .env file.');
}

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';
const VIDEO_MODEL = 'veo-2.0-generate-001';
const VIDEO_POLL_INTERVAL_MS = 10_000;

/**
 * Generate an image from a text prompt using Gemini's native image output.
 *
 * @param {string} prompt
 * @returns {Promise<{ mimeType: string, data: string }>}
 *   mimeType — e.g. "image/png"
 *   data     — base64-encoded image bytes
 */
async function generateImage(prompt) {
  const response = await client.models.generateContent({
    model: IMAGE_MODEL,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(
    (p) => p.inlineData?.mimeType?.startsWith('image/')
  );

  if (!imagePart) {
    const textFallback = parts.find((p) => p.text)?.text ?? '';
    throw new Error(
      `No image returned by ${IMAGE_MODEL}. Model said: "${textFallback}"`
    );
  }

  return {
    mimeType: imagePart.inlineData.mimeType,
    data: imagePart.inlineData.data, // base64
  };
}

/**
 * Generate a video from a text prompt using Veo 2.
 * Video generation is a long-running operation — this function polls
 * until complete and resolves with the video URI.
 *
 * @param {string} prompt
 * @param {{ numberOfVideos?: number, durationSeconds?: number }} [options]
 * @returns {Promise<{ uri: string }>}
 *   uri — GCS URI (gs://…) or HTTPS URL depending on your Google Cloud setup.
 *         If using the AI Studio free tier, the URI is a signed HTTPS URL.
 */
async function generateVideo(prompt, options = {}) {
  let operation = await client.models.generateVideos({
    model: VIDEO_MODEL,
    prompt,
    config: {
      numberOfVideos: options.numberOfVideos ?? 1,
      ...(options.durationSeconds && { durationSeconds: options.durationSeconds }),
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, VIDEO_POLL_INTERVAL_MS));
    operation = await client.operations.getVideosOperation({ operation });
  }

  const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!uri) {
    throw new Error(`Video generation completed but returned no URI. Full response: ${JSON.stringify(operation.response)}`);
  }

  return { uri };
}

module.exports = { generateImage, generateVideo };
