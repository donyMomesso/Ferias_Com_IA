"use client";

import type {
  ScoredOption,
  SkillWorkItem,
  SupplierContactDraft,
  TravelTrustSource
} from "../agents/types";

export type AgentResponse = {
  melhoresOpcoes: ScoredOption[];
  contatosFornecedores: SupplierContactDraft[];
  fontesConfianca?: TravelTrustSource[];
  trabalhoSkills?: SkillWorkItem[];
  proximasAcoes: string[];
  skillsUsadas: string[];
};
