"use client";

import type { TripRequest } from "../trips/types";

export type ChecklistSection = {
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
  }>;
};

const baggageItems = [
  "Documentos pessoais",
  "Cartões, dinheiro e comprovantes de reserva",
  "Roupas leves",
  "Roupas de banho",
  "Calçado confortável",
  "Chinelo",
  "Necessaire",
  "Remédios de uso pessoal",
  "Protetor solar",
  "Repelente",
  "Carregadores",
  "Power bank",
  "Óculos de sol",
  "Boné ou chapéu",
  "Sacos para roupa molhada"
];

const fishingItems = [
  "Vara de pesca",
  "Molinete ou carretilha",
  "Linhas extras",
  "Anzóis variados",
  "Iscas naturais ou artificiais",
  "Alicate de contenção",
  "Alicate de bico",
  "Tesoura ou cortador de linha",
  "Caixa de pesca",
  "Licença de pesca, se aplicável",
  "Luvas",
  "Toalha pequena",
  "Capa de chuva",
  "Bolsa térmica",
  "Água e lanche",
  "Lanterna",
  "Kit de primeiros socorros"
];

function slug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildSection(id: string, title: string, items: string[]): ChecklistSection {
  return {
    id,
    title,
    items: items.map((label) => ({
      id: `${id}-${slug(label)}`,
      label
    }))
  };
}

export function isFishingTrip(request: TripRequest) {
  const text = `${request.objetivo} ${request.destino}`.toLowerCase();
  return text.includes("pesca") || text.includes("pescaria") || text.includes("pescar");
}

export function buildTripChecklists(request: TripRequest): ChecklistSection[] {
  const sections = [buildSection("bagagem", "Bagagem essencial", baggageItems)];

  if (isFishingTrip(request)) {
    sections.push(buildSection("pescaria", "Checklist de pescaria", fishingItems));
  }

  return sections;
}

export function checklistStorageKey(tripKey: string) {
  return `ferias-com-ia-checklist-${tripKey}`;
}

export function loadChecklistState(tripKey: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(checklistStorageKey(tripKey));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveChecklistState(tripKey: string, state: Record<string, boolean>) {
  localStorage.setItem(checklistStorageKey(tripKey), JSON.stringify(state));
}
