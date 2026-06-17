import type { ResearchFinding } from "../agents/types";
import type { SearchQuery } from "./types";

function buildDemoFinding(query: SearchQuery): ResearchFinding {
  return {
    category: query.category,
    title: `Pesquisa orientada: ${query.query}`,
    description:
      "Fonte demo usada enquanto uma chave de busca real não estiver configurada. O motor já sabe o que procurar e como classificar os resultados.",
    source: "search-demo",
    confidence: 0.55,
    locationHint: query.destination
  };
}

async function searchWithSerper(query: SearchQuery): Promise<ResearchFinding[]> {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    return [buildDemoFinding(query)];
  }

  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: `${query.query} ${query.destination}`,
      gl: "br",
      hl: "pt-br",
      num: 5
    })
  });

  if (!response.ok) {
    return [buildDemoFinding(query)];
  }

  const data = await response.json();
  const organic = Array.isArray(data.organic) ? data.organic : [];

  return organic.slice(0, 5).map((item: any): ResearchFinding => ({
    category: query.category,
    title: item.title || query.query,
    description: item.snippet || "Resultado encontrado na busca web.",
    source: item.link || "serper",
    confidence: 0.82,
    locationHint: query.destination
  }));
}

export async function runSearchSkill(query: SearchQuery): Promise<ResearchFinding[]> {
  const provider = process.env.SEARCH_PROVIDER || "demo";

  if (provider === "serper") {
    return searchWithSerper(query);
  }

  return [buildDemoFinding(query)];
}
