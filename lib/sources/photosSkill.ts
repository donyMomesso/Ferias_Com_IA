import type { DestinationPhoto } from "../types/media";
import {
  fetchWikipediaPhotos,
  fetchWikipediaHeroPhoto
} from "./wikipediaSkill";

// ─── Pexels (free, sign-up at pexels.com/api) ───────────────────────────────

async function fetchPexelsPhotos(
  destination: string,
  count: number
): Promise<DestinationPhoto[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(destination + " travel landscape")}&per_page=${count}&orientation=landscape`,
      { headers: { Authorization: key }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.photos?.length) return [];

    return data.photos.map((p: Record<string, Record<string, string>>, i: number) => ({
      id: `pexels-${p.id ?? i}`,
      url: p.src?.large2x || p.src?.large || p.src?.original || "",
      thumbUrl: p.src?.medium || p.src?.small || "",
      alt: (p.alt as unknown as string) || destination,
      photographer: (p.photographer as unknown as string) || "Pexels",
      source: "pexels" as const
    }));
  } catch {
    return [];
  }
}

// ─── Unsplash (free, sign-up at unsplash.com/developers) ────────────────────

async function fetchUnsplashPhotos(
  destination: string,
  count: number
): Promise<DestinationPhoto[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination + " travel")}&per_page=${count}&client_id=${key}&orientation=landscape`,
      { headers: { "Accept-Version": "v1" }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results?.length) return [];

    return data.results.map((p: Record<string, unknown>) => {
      const urls = p.urls as Record<string, string>;
      const user = p.user as Record<string, string>;
      return {
        id: p.id as string,
        url: `${urls.raw}&w=1200&auto=format&fit=crop`,
        thumbUrl: `${urls.raw}&w=400&auto=format&fit=crop`,
        alt: (p.alt_description as string) || destination,
        photographer: user.name || "Unsplash",
        source: "unsplash" as const
      };
    });
  } catch {
    return [];
  }
}

// ─── Picsum (demo fallback, NOT real destination photos) ─────────────────────

function picsumUrl(seed: string, w = 1200, h = 800): string {
  const hash = encodeURIComponent(seed.toLowerCase().replace(/\s+/g, "-"));
  return `https://picsum.photos/seed/${hash}/${w}/${h}`;
}

function picsumFallback(destination: string, count: number): DestinationPhoto[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `demo-${i}`,
    url: picsumUrl(`${destination}-photo-${i}`, 1200, 800),
    thumbUrl: picsumUrl(`${destination}-photo-${i}`, 400, 270),
    alt: `${destination} — foto ${i + 1}`,
    photographer: "Demo (imagem ilustrativa)",
    source: "picsum" as const
  }));
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function fetchDestinationPhotos(
  destination: string,
  count = 9
): Promise<DestinationPhoto[]> {
  // Priority: Pexels → Wikipedia → Unsplash → picsum demo
  const pexels = await fetchPexelsPhotos(destination, count);
  if (pexels.length >= 3) return pexels;

  const unsplash = await fetchUnsplashPhotos(destination, count);
  if (unsplash.length >= 2) return unsplash;

  const wiki = await fetchWikipediaPhotos(destination, count);
  if (wiki.length >= 2) return wiki;

  return picsumFallback(destination, count);
}

export async function heroPhotoUrl(destination: string): Promise<string> {
  // Pexels hero
  const pexels = await fetchPexelsPhotos(destination, 1);
  if (pexels[0]?.url) return pexels[0].url;

  // Unsplash hero
  const unsplash = await fetchUnsplashPhotos(destination, 1);
  if (unsplash[0]?.url) return unsplash[0].url;

  // Wikipedia hero
  const wiki = await fetchWikipediaHeroPhoto(destination);
  if (wiki) return wiki;

  return picsumUrl(`${destination}-hero`, 1600, 900);
}
