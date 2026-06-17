export type TravelBudget = "Econômico" | "Confortável econômico" | "Premium";

export type TripRequest = {
  destino: string;
  datas: string;
  pessoas: string;
  objetivo: string;
  orcamento: TravelBudget | string;
};

export type TripPlan = {
  titulo: string;
  destino: string;
  resumo: string;
  roteiro: string[];
  checklist: string[];
  orcamentoEstimado: string;
  proximosPassos: string[];
  geradoPor: string;
};
