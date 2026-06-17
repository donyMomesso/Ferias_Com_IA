import type { DestinationPhoto } from "../types/media";

function toWikiTitle(destination: string): string {
  return destination
    .split(/[-,]/)[0]
    .trim()
    .replace(/\s+/g, "_");
}

export async function fetchWikipediaHeroPhoto(destination: string): Promise<string | null> {
  const title = toWikiTitle(destination);
  const agents = "FeriasComIA/1.0 (contato@feriascomia.local)";

  // Try Portuguese Wikipedia first
  for (const lang of ["pt", "en"]) {
    try {
      const res = await fetch(
        `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { headers: { "User-Agent": agents }, next: { revalidate: 86400 } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const src = data.originalimage?.source || data.thumbnail?.source;
      if (src) return src.startsWith("//") ? "https:" + src : src;
    } catch {
      continue;
    }
  }
  return null;
}

export async function fetchWikipediaPhotos(
  destination: string,
  count = 9
): Promise<DestinationPhoto[]> {
  const title = toWikiTitle(destination);
  const agents = "FeriasComIA/1.0 (contato@feriascomia.local)";

  for (const lang of ["pt", "en"]) {
    try {
      const res = await fetch(
        `https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`,
        { headers: { "User-Agent": agents }, next: { revalidate: 86400 } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const photos = parseWikiMedia(data.items || [], count, destination);
      if (photos.length >= 2) return photos;
    } catch {
      continue;
    }
  }
  return [];
}

function toHttps(src: string): string {
  if (src.startsWith("//")) return "https:" + src;
  return src;
}

function parseWikiMedia(
  items: Record<string, unknown>[],
  count: number,
  alt: string
): DestinationPhoto[] {
  const SKIP = /flag_|logo_|icon_|coat_|seal_|\.svg|\.gif|locator|map_of|location_|blank_/i;

  return items
    .filter((item) => {
      const title = (item.title as string) || "";
      if (item.type !== "image") return false;
      if (SKIP.test(title)) return false;
      const srcset = item.srcset as Array<{ src: string; scale?: string; width?: number }> | undefined;
      return Array.isArray(srcset) && srcset.length > 0;
    })
    .slice(0, count)
    .map((item, i) => {
      const srcset = item.srcset as Array<{ src: string; scale?: string; width?: number }>;
      // Pick largest: prefer "2x" scale or highest width
      const largest =
        srcset.find((s) => s.scale === "2x") ||
        [...srcset].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0] ||
        srcset[srcset.length - 1];
      const thumb = srcset.find((s) => s.scale === "1x") || srcset[0];

      const caption = item.caption as { text?: string } | undefined;

      return {
        id: `wiki-${i}`,
        url: toHttps(largest?.src || ""),
        thumbUrl: toHttps(thumb?.src || largest?.src || ""),
        alt: caption?.text?.replace(/<[^>]+>/g, "").trim() || alt,
        photographer: "Wikimedia Commons",
        source: "wikimedia" as const
      } satisfies DestinationPhoto;
    })
    .filter((p) => p.url.startsWith("https://"));
}
