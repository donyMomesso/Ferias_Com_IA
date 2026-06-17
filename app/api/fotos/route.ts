import { NextResponse } from "next/server";
import { fetchDestinationPhotos, heroPhotoUrl } from "../../../lib/sources/photosSkill";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const mode = searchParams.get("mode") || "gallery";

  if (!q) return NextResponse.json({ photos: [], heroUrl: "" });

  if (mode === "hero") {
    const heroUrl = await heroPhotoUrl(q);
    return NextResponse.json({ heroUrl });
  }

  const [photos, heroUrl] = await Promise.all([
    fetchDestinationPhotos(q, 9),
    heroPhotoUrl(q)
  ]);

  return NextResponse.json({ photos, heroUrl });
}
