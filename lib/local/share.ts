"use client";

import type { SavedTrip } from "./localDb";
import type { TripPlan } from "../trips/types";

export function buildTripShareText(plan: TripPlan) {
  return [
    `${plan.titulo}`,
    "",
    `Destino: ${plan.destino}`,
    "",
    plan.resumo,
    "",
    "Roteiro:",
    ...plan.roteiro.map((item) => `- ${item}`),
    "",
    "Checklist:",
    ...plan.checklist.map((item) => `- ${item}`)
  ].join("\n");
}

export async function shareTrip(plan: TripPlan) {
  const text = buildTripShareText(plan);

  if (navigator.share) {
    await navigator.share({
      title: plan.titulo,
      text
    });
    return "Compartilhamento aberto.";
  }

  await navigator.clipboard.writeText(text);
  return "Roteiro copiado para a área de transferência.";
}

export function downloadTripJson(trip: SavedTrip) {
  const blob = new Blob([JSON.stringify(trip, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `ferias-com-ia-${trip.destination
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}.json`;
  link.click();

  URL.revokeObjectURL(url);
}
