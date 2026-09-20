/**
 * Server-only image / video providers.
 * Keys stay in env — never import this from client components.
 */

export type GenResult = { url: string; provider: string };

export async function generateImage(prompt: string): Promise<GenResult> {
  const fal = process.env.FAL_KEY?.trim();
  if (fal) {
    const res = await fetch("https://fal.run/fal-ai/flux/dev", {
      method: "POST",
      headers: {
        Authorization: `Key ${fal}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_size: "landscape_4_3",
        num_images: 1,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`FAL_IMAGE_FAILED:${res.status}:${text.slice(0, 200)}`);
    }
    const data = (await res.json()) as {
      images?: { url: string }[];
    };
    const url = data.images?.[0]?.url;
    if (!url) throw new Error("FAL_IMAGE_NO_URL");
    return { url, provider: "fal" };
  }

  const openai = process.env.OPENAI_API_KEY?.trim();
  if (openai) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openai}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OPENAI_IMAGE_FAILED:${res.status}:${text.slice(0, 200)}`);
    }
    const data = (await res.json()) as { data?: { url?: string }[] };
    const url = data.data?.[0]?.url;
    if (!url) throw new Error("OPENAI_IMAGE_NO_URL");
    return { url, provider: "openai" };
  }

  const replicate = process.env.REPLICATE_API_TOKEN?.trim();
  if (replicate) {
    const res = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${replicate}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({ input: { prompt } }),
      }
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `REPLICATE_IMAGE_FAILED:${res.status}:${text.slice(0, 200)}`
      );
    }
    const data = (await res.json()) as { output?: string | string[] };
    const out = data.output;
    const url = Array.isArray(out) ? out[0] : out;
    if (!url) throw new Error("REPLICATE_IMAGE_NO_URL");
    return { url, provider: "replicate" };
  }

  throw new Error("NO_IMAGE_PROVIDER");
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
  return !!(
    process.env.FAL_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    process.env.REPLICATE_API_TOKEN?.trim()
  );
}

export function hasVideoProvider(): boolean {
  return !!process.env.FAL_KEY?.trim();
}
