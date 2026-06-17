"use client";

import { listLocalPartners, listLocalTrips, listTripExpenses, listVisitedPlaces } from "../local/localDb";
import type { SavedTrip } from "../local/localDb";
import { tripKeyFromDestination } from "../local/tripComputer";
import type { PartnerProspect } from "../partners/types";
import { getInstallId, getSupabaseClient, isSupabaseConfigured } from "./supabase";

type SyncResult = {
  ok: boolean;
  message: string;
  counts?: {
    trips: number;
    partners: number;
    expenses: number;
    visitedPlaces: number;
  };
};

function tripPayload(installId: string, trip: SavedTrip) {
  return {
    install_id: installId,
    local_id: trip.id ? String(trip.id) : trip.title,
    title: trip.title,
    destination: trip.destination,
    request: trip.request,
    plan: trip.plan,
    agents: trip.agents,
    created_at: trip.createdAt,
    updated_at: trip.updatedAt
  };
}

function partnerPayload(installId: string, partner: PartnerProspect) {
  return {
    install_id: installId,
    local_id: partner.id ? String(partner.id) : partner.name,
    name: partner.name,
    destination: partner.destination,
    category: partner.category,
    description: partner.description,
    photo_url: partner.photoUrl,
    thumb_url: partner.thumbUrl,
    photo_alt: partner.photoAlt,
    photo_credit: partner.photoCredit,
    source: partner.source,
    confidence: partner.confidence,
    score: partner.score,
    status: partner.status,
    contact_hint: partner.contactHint,
    partnership_message: partner.partnershipMessage,
    created_at: partner.createdAt || new Date().toISOString(),
    updated_at: partner.updatedAt || new Date().toISOString()
  };
}

export async function backupLocalDataToSupabase(): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Supabase ainda não configurado. Adicione NEXT_PUBLIC_SUPABASE_ANON_KEY no .env."
    };
  }

  const supabase = getSupabaseClient();
  const installId = getInstallId();
  const trips = await listLocalTrips();
  const partners = await listLocalPartners();
  const expensesByTrip = await Promise.all(
    trips.map((trip) => listTripExpenses(tripKeyFromDestination(trip.destination)))
  );
  const placesByTrip = await Promise.all(
    trips.map((trip) => listVisitedPlaces(tripKeyFromDestination(trip.destination)))
  );
  const expenses = expensesByTrip.flat();
  const visitedPlaces = placesByTrip.flat();

  if (trips.length) {
    const { error } = await supabase
      .from("app_trips")
      .upsert(trips.map((trip) => tripPayload(installId, trip)), {
        onConflict: "install_id,local_id"
      });
    if (error) return { ok: false, message: error.message };
  }

  if (partners.length) {
    const { error } = await supabase
      .from("app_partners")
      .upsert(partners.map((partner) => partnerPayload(installId, partner)), {
        onConflict: "install_id,local_id"
      });
    if (error) return { ok: false, message: error.message };
  }

  if (expenses.length) {
    const { error } = await supabase.from("app_expenses").upsert(
      expenses.map((expense) => ({
        install_id: installId,
        local_id: expense.id ? String(expense.id) : `${expense.tripKey}-${expense.createdAt}`,
        trip_key: expense.tripKey,
        destination: expense.destination,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        paid_at: expense.paidAt,
        created_at: expense.createdAt
      })),
      { onConflict: "install_id,local_id" }
    );
    if (error) return { ok: false, message: error.message };
  }

  if (visitedPlaces.length) {
    const { error } = await supabase.from("app_visited_places").upsert(
      visitedPlaces.map((place) => ({
        install_id: installId,
        local_id: place.id ? String(place.id) : `${place.tripKey}-${place.createdAt}`,
        trip_key: place.tripKey,
        destination: place.destination,
        name: place.name,
        notes: place.notes,
        rating: place.rating,
        visited_at: place.visitedAt,
        created_at: place.createdAt
      })),
      { onConflict: "install_id,local_id" }
    );
    if (error) return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message: "Backup enviado para o Supabase.",
    counts: {
      trips: trips.length,
      partners: partners.length,
      expenses: expenses.length,
      visitedPlaces: visitedPlaces.length
    }
  };
}
