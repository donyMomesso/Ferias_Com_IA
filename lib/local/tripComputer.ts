"use client";

export type ExpenseCategory =
  | "hospedagem"
  | "alimentacao"
  | "passeios"
  | "transporte"
  | "compras"
  | "outros";

export type TripExpense = {
  id?: number;
  tripKey: string;
  destination: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paidAt: string;
  createdAt: string;
};

export type VisitedPlace = {
  id?: number;
  tripKey: string;
  destination: string;
  name: string;
  notes?: string;
  rating?: number;
  visitedAt: string;
  createdAt: string;
};

export type BudgetForecast = {
  plannedBudget: number;
  spent: number;
  remaining: number;
  projectedTotal: number;
  dailyAverage: number;
  status: "dentro" | "atencao" | "estourou";
};

export function tripKeyFromDestination(destination: string) {
  return destination
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function budgetPreset(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes("premium")) return 12000;
  if (normalized.includes("confort")) return 7000;
  return 4000;
}

export function calculateForecast(params: {
  plannedBudget: number;
  expenses: TripExpense[];
  tripDays?: number;
  elapsedDays?: number;
}): BudgetForecast {
  const spent = params.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const elapsedDays = Math.max(params.elapsedDays || 1, 1);
  const tripDays = Math.max(params.tripDays || 7, elapsedDays);
  const dailyAverage = spent / elapsedDays;
  const projectedTotal = Math.round(dailyAverage * tripDays);
  const remaining = params.plannedBudget - spent;
  const ratio = projectedTotal / params.plannedBudget;

  return {
    plannedBudget: params.plannedBudget,
    spent,
    remaining,
    projectedTotal,
    dailyAverage,
    status: spent > params.plannedBudget ? "estourou" : ratio > 0.9 ? "atencao" : "dentro"
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}
