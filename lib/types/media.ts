export interface DestinationPhoto {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  source: "unsplash" | "picsum" | "wikimedia" | "pexels";
}

export interface SocialPost {
  id: string;
  type: "reddit" | "youtube" | "ai";
  platform: string;
  author: string;
  title: string;
  body: string;
  thumbUrl?: string;
  url?: string;
  upvotes?: number;
  videoId?: string;
  subreddit?: string;
}
