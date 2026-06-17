import type { TripPlan, TripRequest } from "../trips/types";

export type AgentRole =
  | "planner"
  | "researcher"
  | "budgetAnalyst"
  | "localExpert"
  | "supplierAgent";

export type ResearchCategory =
  | "hospedagem"
  | "passeio"
  | "restaurante"
  | "transporte"
  | "clima"
  | "seguranca"
  | "fornecedor";

export type ResearchFinding = {
  category: ResearchCategory;
  title: string;
  description: string;
  source: string;
  confidence: number;
  estimatedCost?: string;
  locationHint?: string;
  contactHint?: string;
  requiresHumanValidation?: boolean;
};

export type ScoredOption = ResearchFinding & {
  score: number;
  reason: string;
  tradeoff: string;
};

export type SupplierContactDraft = {
  supplierName: string;
  channel: "whatsapp" | "email" | "telefone";
  destination: string;
  message: string;
  objective: string;
};

export type PlannerReport = {
  plan: TripPlan;
  findings: ResearchFinding[];
  bestOptions: ScoredOption[];
  supplierDrafts: SupplierContactDraft[];
  nextAgentActions: string[];
};

export type AgentContext = {
  request: TripRequest;
  now: Date;
};
