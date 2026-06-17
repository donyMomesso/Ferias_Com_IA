export type PartnerStatus = "prospectado" | "contatado" | "aprovado" | "parceiro" | "rejeitado";

export type PartnerCategory =
  | "guia"
  | "passeio"
  | "restaurante"
  | "hospedagem"
  | "transfer"
  | "experiencia";

export type PartnerProspectRequest = {
  destination: string;
  objective?: string;
  categories?: PartnerCategory[];
};

export type PartnerProspect = {
  id?: number;
  name: string;
  destination: string;
  category: PartnerCategory;
  description: string;
  photoUrl?: string;
  thumbUrl?: string;
  photoAlt?: string;
  photoCredit?: string;
  source: string;
  confidence: number;
  score: number;
  status: PartnerStatus;
  contactHint?: string;
  partnershipMessage: string;
  createdAt?: string;
  updatedAt?: string;
};
