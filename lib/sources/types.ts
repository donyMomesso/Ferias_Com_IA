import type { ResearchCategory, ResearchFinding } from "../agents/types";
import type { TripRequest } from "../trips/types";

export type SourceProvider = "demo" | "serper" | "open-meteo" | "nominatim";

export type SearchQuery = {
  query: string;
  category: ResearchCategory;
  destination: string;
};

export type GeoLocation = {
  label: string;
  latitude: number;
  longitude: number;
  provider: SourceProvider;
};

export type DestinationWeather = {
  summary: string;
  averageTempC?: number;
  rainProbability?: string;
  provider: SourceProvider;
};

export type SourceSkill = {
  name: string;
  enabled: boolean;
  search?: (query: SearchQuery) => Promise<ResearchFinding[]>;
};

export type DestinationIntelligence = {
  request: TripRequest;
  location?: GeoLocation;
  weather?: DestinationWeather;
  findings: ResearchFinding[];
};
