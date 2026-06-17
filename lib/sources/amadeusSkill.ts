export interface POI {
  name: string;
  category: string;
  tags: string[];
  lat?: number;
  lng?: number;
  rank?: number;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAmadeusToken(): Promise<string | null> {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  try {
    const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.access_token) return null;

    cachedToken = {
      value: data.access_token,
      expiresAt: Date.now() + (Number(data.expires_in) - 60) * 1000
    };
    return cachedToken.value;
  } catch {
    return null;
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  SIGHTS: "Pontos Turísticos",
  NIGHTLIFE: "Vida Noturna",
  RESTAURANT: "Restaurantes",
  SHOPPING: "Compras",
  BEACH_PARK: "Praias e Parques",
  HISTORICAL: "Histórico",
  MUSEUM: "Museus",
  NATURE: "Natureza"
};

export async function fetchPOIs(lat: number, lng: number): Promise<POI[]> {
  const token = await getAmadeusToken();
  if (!token) return [];

  try {
    const res = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${lat}&longitude=${lng}&radius=20&page[limit]=12&sort=RELEVANCE`,
      { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.data || []).map((poi: Record<string, unknown>) => ({
      name: poi.name as string,
      category: CATEGORY_LABELS[(poi.category as string) || ""] || (poi.category as string) || "Atração",
      tags: Array.isArray(poi.tags) ? poi.tags.slice(0, 4) : [],
      lat: (poi.geoCode as Record<string, number>)?.latitude,
      lng: (poi.geoCode as Record<string, number>)?.longitude,
      rank: poi.rank as number | undefined
    }));
  } catch {
    return [];
  }
}
