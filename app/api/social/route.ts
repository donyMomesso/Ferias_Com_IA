import { NextResponse } from "next/server";
import { fetchSocialContent } from "../../../lib/sources/socialSkill";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q) return NextResponse.json({ posts: [] });

  const posts = await fetchSocialContent(q);
  return NextResponse.json({ posts });
}
