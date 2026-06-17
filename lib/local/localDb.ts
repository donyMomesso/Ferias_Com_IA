"use client";

import Dexie, { type Table } from "dexie";
import type { AgentResponse } from "./types";
import type { TripExpense, VisitedPlace } from "./tripComputer";
import type { PartnerProspect, PartnerStatus } from "../partners/types";
import type { TripPlan, TripRequest } from "../trips/types";

export type SavedTrip = {
  id?: number;
  title: string;
  destination: string;
  request: TripRequest;
  plan: TripPlan;
  agents: AgentResponse | null;
  createdAt: string;
  updatedAt: string;
};

class FeriasLocalDatabase extends Dexie {
  trips!: Table<SavedTrip, number>;
  partners!: Table<PartnerProspect, number>;
  expenses!: Table<TripExpense, number>;
  visitedPlaces!: Table<VisitedPlace, number>;

  constructor() {
    super("ferias_com_ia_local");

    this.version(1).stores({
      trips: "++id, destination, createdAt, updatedAt"
    });

    this.version(2).stores({
      trips: "++id, destination, createdAt, updatedAt",
      partners: "++id, destination, category, status, createdAt, updatedAt"
    });

    this.version(3).stores({
      trips: "++id, destination, createdAt, updatedAt",
      partners: "++id, destination, category, status, createdAt, updatedAt"
    });

    this.version(4).stores({
      trips: "++id, destination, createdAt, updatedAt",
      partners: "++id, destination, category, status, createdAt, updatedAt",
      expenses: "++id, tripKey, destination, category, paidAt, createdAt",
      visitedPlaces: "++id, tripKey, destination, visitedAt, createdAt"
    });
  }
}

export const localDb = new FeriasLocalDatabase();

export async function saveTripLocally(input: Omit<SavedTrip, "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();

  return localDb.trips.add({
    ...input,
    createdAt: now,
    updatedAt: now
  });
}

export async function listLocalTrips() {
  return localDb.trips.orderBy("createdAt").reverse().toArray();
}

export async function deleteLocalTrip(id: number) {
  return localDb.trips.delete(id);
}

export async function savePartnerLocally(input: Omit<PartnerProspect, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();

  return localDb.partners.add({
    ...input,
    createdAt: now,
    updatedAt: now
  });
}

export async function listLocalPartners() {
  return localDb.partners.orderBy("createdAt").reverse().toArray();
}

export async function updateLocalPartnerStatus(id: number, status: PartnerStatus) {
  return localDb.partners.update(id, {
    status,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteLocalPartner(id: number) {
  return localDb.partners.delete(id);
}

export async function addTripExpense(input: Omit<TripExpense, "id" | "createdAt">) {
  return localDb.expenses.add({
    ...input,
    createdAt: new Date().toISOString()
  });
}

export async function listTripExpenses(tripKey: string) {
  return localDb.expenses.where("tripKey").equals(tripKey).reverse().sortBy("paidAt");
}

export async function deleteTripExpense(id: number) {
  return localDb.expenses.delete(id);
}

export async function addVisitedPlace(input: Omit<VisitedPlace, "id" | "createdAt">) {
  return localDb.visitedPlaces.add({
    ...input,
    createdAt: new Date().toISOString()
  });
}

export async function listVisitedPlaces(tripKey: string) {
  return localDb.visitedPlaces.where("tripKey").equals(tripKey).reverse().sortBy("visitedAt");
}

export async function deleteVisitedPlace(id: number) {
  return localDb.visitedPlaces.delete(id);
}
