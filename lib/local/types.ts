"use client";

import type { ScoredOption, SupplierContactDraft } from "../agents/types";

export type AgentResponse = {
  melhoresOpcoes: ScoredOption[];
  contatosFornecedores: SupplierContactDraft[];
  proximasAcoes: string[];
  skillsUsadas: string[];
};
