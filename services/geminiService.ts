
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const VIDEO_GENERATION_PROMPT = `
Transform this video into a clean flat vector animation style — simple, plain, and minimal. Keep the exact same motion, camera movement, and timing from the original video. Replace all visual textures, lighting, and depth with flat colors and clean shapes, as if drawn in Adobe Illustrator or Figma.

Maintain smooth outlines, subtle line weight, and balanced proportions. The characters and objects should look hand-drawn yet digitally precise — no gradients, no shadows, no textures. Only solid pastel tones, consistent color palette, and vector-like surfaces.

The animation should feel like a living illustration: every movement stays natural and continuous, without visual noise or artificial effects. No particle effects, no glow, no 3D rendering — just pure vector motion.

Use clean framing and static backgrounds; emphasize simplicity and form clarity. Keep the visual tone elegant, soft, and emotionally calm.

Keywords: flat vector | minimalist | plain illustration | clean outlines | solid pastel | no shading | smooth motion | illustrator style | video-to-video | same timing | no cinematic effect | simple motion | living drawing
`;

/**
 * Generates a vector-styled video based on an initial image frame.
 * @param firstFrameBase64 The Base64 encoded string of the first video frame.
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @returns A promise that resolves with the generated video as a Blob.
 */
export const generateVectorVideo = async (firstFrameBase64: string, mimeType: string): Promise<Blob> => {
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: VIDEO_GENERATION_PROMPT,
      image: {
        imageBytes: firstFrameBase64,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1
      }
    });

    while (!operation.done) {
      // Poll every 10 seconds
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error("Video generation succeeded, but no download link was provided.");
    }
    
    // The download link requires the API key to be appended
    const response = await fetch(`${downloadLink}&key=${API_KEY}`);
    
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to download the generated video. Status: ${response.status}. Body: ${errorBody}`);
    }

    const videoBlob = await response.blob();
    return videoBlob;

  } catch (error) {
    console.error("Error in generateVectorVideo:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during video generation.");
  }
};
