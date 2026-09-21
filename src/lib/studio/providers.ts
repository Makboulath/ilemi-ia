/**
 * Server-only image / video providers.
 * Keys stay in env — never import this from client components.
 */

export type GenResult = { url: string; provider: string };

function geminiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()
  );
}

/** Keep the user prompt intact — only light cleanup. */
export function enrichImagePrompt(prompt: string): string {
  return prompt.replace(/\s+/g, " ").trim().slice(0, 480);
}

/**
 * Free Pollinations (anonymous).
 * Free tier ≈ Sana/DreamShaper. Do NOT use enhance=true: it rewrites
 * prompts and often ignores the user's request.
 */
export function pollinationsImageUrl(prompt: string): GenResult {
  const clean = enrichImagePrompt(prompt);
  const seed = Date.now() % 100000;
  const params = new URLSearchParams({
    width: "1024",
    height: "1024",
    nologo: "true",
    enhance: "false",
    quality: "hd",
    model: "sana",
    seed: String(seed),
    private: "true",
    // Mild negatives only — no prompt rewrite
    negative_prompt:
      "blurry, lowres, watermark, text, logo, extra fingers, distorted face",
  });
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}` +
    `?${params.toString()}`;
  return { url, provider: "pollinations:sana+hd" };
}

/** Gemini native image generation (Google AI Studio). */
async function generateImageGemini(prompt: string): Promise<GenResult> {
  const key = geminiKey();
  if (!key) throw new Error("NO_GEMINI_KEY");

  const models = [
    "gemini-2.5-flash-image",
    "gemini-3.1-flash-lite-image",
    "gemini-3.1-flash-image",
  ];

  let lastErr = "GEMINI_IMAGE_FAILED";
  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: enrichImagePrompt(prompt) }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );
    const text = await res.text();
    if (!res.ok) {
      lastErr = `GEMINI_IMAGE_FAILED:${model}:${res.status}`;
      if (res.status === 429) break;
      continue;
    }
    let data: {
      candidates?: {
        content?: {
          parts?: {
            inlineData?: { mimeType?: string; data?: string };
          }[];
        };
      }[];
    };
    try {
      data = JSON.parse(text);
    } catch {
      lastErr = `GEMINI_IMAGE_BAD_JSON:${model}`;
      continue;
    }
    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      const mime = part.inlineData?.mimeType || "image/png";
      const b64 = part.inlineData?.data;
      if (b64) {
        return {
          url: `data:${mime};base64,${b64}`,
          provider: `gemini:${model}`,
        };
      }
    }
    lastErr = `GEMINI_IMAGE_NO_DATA:${model}`;
  }
  throw new Error(lastErr);
}

export async function generateImage(
  prompt: string,
  opts?: { preferFree?: boolean }
): Promise<GenResult> {
  const preferFree = opts?.preferFree === true;

  if (!preferFree && geminiKey()) {
    try {
      return await generateImageGemini(prompt);
    } catch {
      /* fall through to Pollinations */
    }
  }

  const fal = process.env.FAL_KEY?.trim();
  if (!preferFree && fal) {
    try {
      const res = await fetch("https://fal.run/fal-ai/flux/dev", {
        method: "POST",
        headers: {
          Authorization: `Key ${fal}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: enrichImagePrompt(prompt),
          image_size: "square_hd",
          num_images: 1,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { images?: { url: string }[] };
        const url = data.images?.[0]?.url;
        if (url) return { url, provider: "fal" };
      }
    } catch {
      /* fall through */
    }
  }

  return pollinationsImageUrl(prompt);
}

export async function generateVideo(prompt: string): Promise<GenResult> {
  const fal = process.env.FAL_KEY?.trim();
  if (fal) {
    const res = await fetch("https://fal.run/fal-ai/minimax/video-01-live", {
      method: "POST",
      headers: {
        Authorization: `Key ${fal}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.slice(0, 500),
        prompt_optimizer: true,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`FAL_VIDEO_FAILED:${res.status}:${text.slice(0, 200)}`);
    }
    const data = (await res.json()) as { video?: { url: string } };
    const url = data.video?.url;
    if (!url) throw new Error("FAL_VIDEO_NO_URL");
    return { url, provider: "fal" };
  }

  throw new Error("NO_VIDEO_PROVIDER");
}

export function hasImageProvider(): boolean {
  return true;
}

export function hasVideoProvider(): boolean {
  return !!process.env.FAL_KEY?.trim();
}
