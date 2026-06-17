import type { ResearchFinding } from "../agents/types";
import type { TripRequest } from "../trips/types";
import type { DestinationIntelligence, DestinationWeather, GeoLocation } from "./types";
import { runSearchSkill } from "./searchSkill";

async function geocodeDestination(destination: string): Promise<GeoLocation | undefined> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        destination
      )}`,
      {
        headers: {
          "User-Agent": "FeriasComIA/0.1 contato@feriascomia.local"
        }
      }
    );

    if (!response.ok) return undefined;

    const data = await response.json();
    const first = Array.isArray(data) ? data[0] : null;
    if (!first?.lat || !first?.lon) return undefined;

    return {
      label: first.display_name || destination,
      latitude: Number(first.lat),
      longitude: Number(first.lon),
      provider: "nominatim"
    };
  } catch {
    return undefined;
  }
}

async function fetchWeather(location: GeoLocation): Promise<DestinationWeather | undefined> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(location.latitude));
    url.searchParams.set("longitude", String(location.longitude));
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("timezone", "auto");

    const response = await fetch(url);
    if (!response.ok) return undefined;

    const data = await response.json();
    const maxTemps = data.daily?.temperature_2m_max || [];
    const minTemps = data.daily?.temperature_2m_min || [];
    const rain = data.daily?.precipitation_probability_max || [];

    const temps = [...maxTemps, ...minTemps].filter((value) => typeof value === "number");
    const averageTempC = temps.length
      ? Math.round(temps.reduce((sum, value) => sum + value, 0) / temps.length)
      : undefined;
    const maxRain = rain.length ? Math.max(...rain) : undefined;

    return {
      summary: "Previsão consultada para apoiar escolha de passeios e plano B.",
      averageTempC,
      rainProbability: typeof maxRain === "number" ? `até ${maxRain}%` : undefined,
      provider: "open-meteo"
    };
  } catch {
    return undefined;
  }
}

function weatherToFinding(weather: DestinationWeather): ResearchFinding {
  return {
    category: "clima",
    title: "Clima e plano B",
    description: `${weather.summary} Temperatura média estimada: ${
      weather.averageTempC ? `${weather.averageTempC}°C` : "não disponível"
    }. Probabilidade de chuva: ${weather.rainProbability || "não disponível"}.`,
    source: weather.provider,
    confidence: 0.78
  };
}

export async function buildDestinationIntelligence(
  request: TripRequest
): Promise<DestinationIntelligence> {
  const location = await geocodeDestination(request.destino);
  const weather = location ? await fetchWeather(location) : undefined;

  const searches = await Promise.all([
    runSearchSkill({
      query: "melhores hospedagens bem avaliadas",
      category: "hospedagem",
      destination: request.destino
    }),
    runSearchSkill({
      query: `melhores passeios para ${request.objetivo}`,
      category: "passeio",
      destination: request.destino
    }),
    runSearchSkill({
      query: "restaurantes locais família frutos do mar",
      category: "restaurante",
      destination: request.destino
    }),
    runSearchSkill({
      query: "guias locais passeios fornecedores contato",
      category: "fornecedor",
      destination: request.destino
    })
  ]);

  const findings = searches.flat();
  if (weather) findings.push(weatherToFinding(weather));

  return {
    request,
    location,
    weather,
    findings
  };
}
