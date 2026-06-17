import type { SocialPost } from "../types/media";

export async function fetchSocialContent(destination: string): Promise<SocialPost[]> {
  const posts: SocialPost[] = [];

  try {
    const redditPosts = await fetchRedditPosts(destination);
    posts.push(...redditPosts);
  } catch {
    // ignore
  }

  const ytKey = process.env.YOUTUBE_API_KEY;
  if (ytKey) {
    try {
      const ytPosts = await fetchYoutubePosts(destination, ytKey);
      posts.push(...ytPosts);
    } catch {
      // ignore
    }
  }

  if (posts.length < 3) {
    posts.push(...generateDemoPosts(destination));
  }

  return posts.slice(0, 6);
}

async function fetchRedditPosts(destination: string): Promise<SocialPost[]> {
  const q = encodeURIComponent(`${destination} viagem`);
  const res = await fetch(
    `https://www.reddit.com/search.json?q=${q}&sort=hot&limit=5&type=link`,
    {
      headers: { "User-Agent": "ferias-com-ia/1.0 (travel planning app)" },
      next: { revalidate: 3600 }
    }
  );
  const data = await res.json();

  return (data.data?.children || [])
    .filter((c: Record<string, any>) => c.data.score > 5 && c.data.title)
    .slice(0, 3)
    .map((c: Record<string, any>) => ({
      id: c.data.id,
      type: "reddit" as const,
      platform: "Reddit",
      author: `u/${c.data.author}`,
      subreddit: `r/${c.data.subreddit}`,
      title: c.data.title,
      body: c.data.selftext?.slice(0, 250) || "Ver post completo no Reddit →",
      url: `https://reddit.com${c.data.permalink}`,
      thumbUrl:
        c.data.thumbnail?.startsWith("http") ? c.data.thumbnail : undefined,
      upvotes: c.data.score
    }));
}

async function fetchYoutubePosts(
  destination: string,
  key: string
): Promise<SocialPost[]> {
  const q = encodeURIComponent(`${destination} roteiro viagem dicas`);
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${key}&q=${q}&type=video&maxResults=3&part=snippet&videoDuration=medium&relevanceLanguage=pt`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();

  return (data.items || []).map((item: Record<string, any>) => ({
    id: item.id.videoId,
    type: "youtube" as const,
    platform: "YouTube",
    author: item.snippet.channelTitle,
    title: item.snippet.title,
    body: item.snippet.description?.slice(0, 200) || "",
    thumbUrl: item.snippet.thumbnails?.medium?.url,
    url: `https://youtube.com/watch?v=${item.id.videoId}`,
    videoId: item.id.videoId
  }));
}

function generateDemoPosts(destination: string): SocialPost[] {
  const d = destination.split(/[-,]/)[0].trim();

  return [
    {
      id: "ai-reddit-1",
      type: "reddit",
      platform: "Reddit",
      author: "u/mochileiro_br",
      subreddit: "r/brasil",
      title: `Fui para ${d} pela primeira vez — dicas e relato completo`,
      body: `Passei 6 dias em ${d} com orçamento médio e foi incrível. Fui em julho, clima perfeito. Os passeios saem em média R$120/pessoa. Reserve com antecedência na alta temporada!`,
      url: "#",
      upvotes: 347
    },
    {
      id: "ai-yt-1",
      type: "youtube",
      platform: "YouTube",
      author: "Viaje Mais Brasil",
      title: `${d} em 7 dias — Roteiro completo, hospedagem e quanto gastei`,
      body: `Tudo que você precisa saber para planejar sua viagem para ${d}. Preços atuais, melhores passeios e onde se hospedar em cada faixa de orçamento.`,
      thumbUrl: `https://picsum.photos/seed/${encodeURIComponent(d)}-yt/640/360`,
      url: "#",
      videoId: undefined
    },
    {
      id: "ai-ig-1",
      type: "ai",
      platform: "Instagram",
      author: "@trilhasdobrasil",
      title: `${d} me surpreendeu demais ✨`,
      body: `Vim sem grandes expectativas e ${d} simplesmente conquistou meu coração. A natureza, a comida, o povo… cada cantinho é uma foto! Já tô planejando a volta 🙌\n\n#viagem #${d.toLowerCase().replace(/\s/g, "")} #brasil #mochilando`,
      thumbUrl: `https://picsum.photos/seed/${encodeURIComponent(d)}-ig/400/400`,
      upvotes: 1284
    }
  ];
}
