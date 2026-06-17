"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { backupLocalDataToSupabase } from "../lib/cloud/sync";
import {
  addTripExpense,
  addVisitedPlace,
  deleteLocalTrip,
  deleteTripExpense,
  deleteVisitedPlace,
  listLocalTrips,
  listTripExpenses,
  listVisitedPlaces,
  saveTripLocally,
  type SavedTrip
} from "../lib/local/localDb";
import { downloadTripJson, shareTrip } from "../lib/local/share";
import {
  budgetPreset,
  calculateForecast,
  formatCurrency,
  tripKeyFromDestination,
  type ExpenseCategory,
  type TripExpense,
  type VisitedPlace
} from "../lib/local/tripComputer";
import {
  buildTripChecklists,
  loadChecklistState,
  saveChecklistState
} from "../lib/local/checklists";
import type { AgentResponse } from "../lib/local/types";
import type { DestinationPhoto, SocialPost } from "../lib/types/media";
import type { TripPlan, TripRequest } from "../lib/trips/types";
import type { BookingLinks } from "../lib/sources/bookingLinks";
import type { POI } from "../lib/sources/amadeusSkill";

const TripMap = dynamic(() => import("../components/TripMap"), { ssr: false });

const TRENDING = [
  { name: "Fernando de Noronha - PE", emoji: "🏝️", seed: "noronha-beach" },
  { name: "Bonito - MS", emoji: "🤿", seed: "bonito-lake" },
  { name: "Chapada Diamantina - BA", emoji: "🏔️", seed: "chapada-canyon" },
  { name: "Lençóis Maranhenses - MA", emoji: "🏜️", seed: "lencois-dunes" },
  { name: "Rio de Janeiro - RJ", emoji: "🌆", seed: "rio-janeiro" },
  { name: "Gramado - RS", emoji: "🍂", seed: "gramado-autumn" }
];

const TRENDING_DETAILS: Record<
  string,
  { price: string; promise: string; support: string }
> = {
  "Fernando de Noronha - PE": {
    price: "rota a partir de R$ 4.900",
    promise: "mar, trilhas e fotos que viram memoria de familia",
    support: "viajantes e guias locais para chegar com mais seguranca"
  },
  "Bonito - MS": {
    price: "rota a partir de R$ 2.800",
    promise: "flutuacao, natureza e passeios organizados por nivel",
    support: "rede de apoio para escolher agencias e horarios certos"
  },
  "Chapada Diamantina - BA": {
    price: "rota a partir de R$ 2.600",
    promise: "cachoeiras, mirantes e conexao real com a natureza",
    support: "grupos e guias ajudam quem acha que nao consegue fazer trilha"
  },
  "Lençóis Maranhenses - MA": {
    price: "rota a partir de R$ 3.200",
    promise: "lagoas, dunas e uma viagem que parece impossivel",
    support: "apoio para combinar transporte, passeios e hospedagem"
  },
  "LenÃ§Ã³is Maranhenses - MA": {
    price: "rota a partir de R$ 3.200",
    promise: "lagoas, dunas e uma viagem que parece impossivel",
    support: "apoio para combinar transporte, passeios e hospedagem"
  },
  "Rio de Janeiro - RJ": {
    price: "rota a partir de R$ 1.900",
    promise: "praia, cultura e experiencias para criar lacos",
    support: "dicas de regioes, deslocamento e programas mais seguros"
  },
  "Gramado - RS": {
    price: "rota a partir de R$ 2.300",
    promise: "friozinho, gastronomia e descanso para viver junto",
    support: "roteiro familiar com hospedagem, passeios e economia"
  }
};

const DESTINATION_SUGGESTIONS = [
  "Fernando de Noronha - PE",
  "Bonito - MS",
  "Chapada Diamantina - BA",
  "Lençóis Maranhenses - MA",
  "Lencois Maranhenses - MA",
  "Rio de Janeiro - RJ",
  "Gramado - RS",
  "Foz do Iguacu - PR",
  "Maceio - AL",
  "Porto de Galinhas - PE",
  "Jericoacoara - CE",
  "Cananeia - SP",
  "Praia da Maranduba - SP",
  "Ubatuba - SP",
  "Ilha Comprida - SP",
  "Campos do Jordao - SP",
  "Florianopolis - SC",
  "Balneario Camboriu - SC",
  "Pantanal - MS",
  "Capitolio - MG"
];

const EXTRA_DESTINATION_SUGGESTIONS = [
  "Sao Paulo - SP",
  "Ilhabela - SP",
  "Sao Sebastiao - SP",
  "Maresias - SP",
  "Caraguatatuba - SP",
  "Guaruja - SP",
  "Santos - SP",
  "Bertioga - SP",
  "Ribeirao Preto - SP",
  "Campinas - SP",
  "Aparecida - SP",
  "Socorro - SP",
  "Brotas - SP",
  "Paraty - RJ",
  "Angra dos Reis - RJ",
  "Buzios - RJ",
  "Arraial do Cabo - RJ",
  "Cabo Frio - RJ",
  "Petropolis - RJ",
  "Visconde de Maua - RJ",
  "Teresopolis - RJ",
  "Ouro Preto - MG",
  "Tiradentes - MG",
  "Monte Verde - MG",
  "Serra do Cipo - MG",
  "Belo Horizonte - MG",
  "Diamantina - MG",
  "Salvador - BA",
  "Porto Seguro - BA",
  "Trancoso - BA",
  "Itacare - BA",
  "Morro de Sao Paulo - BA",
  "Praia do Forte - BA",
  "Ilheus - BA",
  "Recife - PE",
  "Olinda - PE",
  "Carneiros - PE",
  "Maragogi - AL",
  "Sao Miguel dos Milagres - AL",
  "Penedo - AL",
  "Aracaju - SE",
  "Fortaleza - CE",
  "Canoa Quebrada - CE",
  "Aquiraz - CE",
  "Natal - RN",
  "Pipa - RN",
  "Joao Pessoa - PB",
  "Campina Grande - PB",
  "Sao Luis - MA",
  "Barreirinhas - MA",
  "Atins - MA",
  "Parnaiba - PI",
  "Delta do Parnaiba - PI",
  "Manaus - AM",
  "Presidente Figueiredo - AM",
  "Alter do Chao - PA",
  "Belem - PA",
  "Ilha do Marajo - PA",
  "Jalapao - TO",
  "Palmas - TO",
  "Brasilia - DF",
  "Pirenopolis - GO",
  "Chapada dos Veadeiros - GO",
  "Caldas Novas - GO",
  "Goiania - GO",
  "Cuiaba - MT",
  "Nobres - MT",
  "Chapada dos Guimaraes - MT",
  "Campo Grande - MS",
  "Corumba - MS",
  "Curitiba - PR",
  "Ilha do Mel - PR",
  "Morretes - PR",
  "Londrina - PR",
  "Joinville - SC",
  "Blumenau - SC",
  "Pomerode - SC",
  "Bombinhas - SC",
  "Garopaba - SC",
  "Praia do Rosa - SC",
  "Urubici - SC",
  "Porto Alegre - RS",
  "Bento Goncalves - RS",
  "Canela - RS",
  "Cambara do Sul - RS",
  "Torres - RS"
];

const ALL_DESTINATION_SUGGESTIONS = Array.from(
  new Set([...DESTINATION_SUGGESTIONS, ...EXTRA_DESTINATION_SUGGESTIONS])
);

const MONTHS = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro"
];

function formatDateLabel(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "";
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
}

function formatTripDates(start: string, end: string) {
  if (start && end) {
    const [startYear, startMonth, startDay] = start.split("-").map(Number);
    const [endYear, endMonth, endDay] = end.split("-").map(Number);
    if (startYear === endYear && startMonth === endMonth) {
      return `${startDay} a ${endDay} de ${MONTHS[startMonth - 1]} de ${startYear}`;
    }
    return `${formatDateLabel(start)} a ${formatDateLabel(end)}`;
  }
  if (start) return `A partir de ${formatDateLabel(start)}`;
  if (end) return `Ate ${formatDateLabel(end)}`;
  return "";
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatPtDateInput(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

function parsePtDateInput(value: string) {
  const clean = value.replace(/\D/g, "").slice(0, 8);
  if (clean.length < 8) return "";
  const day = clean.slice(0, 2);
  const month = clean.slice(2, 4);
  const year = clean.slice(4, 8);
  return `${year}-${month}-${day}`;
}

const TAB_LABELS: Record<string, string> = {
  roteiro: "📋 Roteiro",
  reserve: "✈️ Reserve",
  mapa: "🗺️ Mapa",
  fotos: "📸 Fotos",
  social: "💬 Experiências",
  checklist: "🎒 Checklist",
  bordo: "🧭 Bordo",
  agentes: "🤖 Agentes"
};

const DEFAULT_HERO = "/banner-hero.svg";

export default function Home() {
  const [form, setForm] = useState<TripRequest>({
    destino: "",
    datas: "",
    pessoas: "2 adultos",
    objetivo: "",
    orcamento: "Confortável econômico"
  });

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [destinoFocado, setDestinoFocado] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [adultos, setAdultos] = useState(2);
  const [criancas, setCriancas] = useState(0);
  const [quartos, setQuartos] = useState(1);
  const [idadesCriancas, setIdadesCriancas] = useState<string[]>([]);
  const [viajandoPets, setViajandoPets] = useState(false);
  const [roteiro, setRoteiro] = useState<TripPlan | null>(null);
  const [agentes, setAgentes] = useState<AgentResponse | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [salvos, setSalvos] = useState<SavedTrip[]>([]);
  const [erro, setErro] = useState("");
  const [status, setStatus] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [activeTab, setActiveTab] = useState("roteiro");
  const [heroUrl, setHeroUrl] = useState(DEFAULT_HERO);
  const [trendingImages, setTrendingImages] = useState<Record<string, string>>({});
  const [destinationPhotos, setDestinationPhotos] = useState<DestinationPhoto[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [bookingLinks, setBookingLinks] = useState<BookingLinks | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [gastos, setGastos] = useState<TripExpense[]>([]);
  const [lugaresVisitados, setLugaresVisitados] = useState<VisitedPlace[]>([]);
  const [orcamentoPrevisto, setOrcamentoPrevisto] = useState(7000);
  const [novoGasto, setNovoGasto] = useState({
    category: "alimentacao" as ExpenseCategory,
    description: "",
    amount: ""
  });
  const [novoLugar, setNovoLugar] = useState({
    name: "",
    notes: "",
    rating: "5"
  });
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [fotosCarregando, setFotosCarregando] = useState(false);
  const [socialCarregando, setSocialCarregando] = useState(false);
  const [backupCarregando, setBackupCarregando] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataInicioInputRef = useRef<HTMLInputElement | null>(null);
  const dataFimInputRef = useRef<HTMLInputElement | null>(null);
  const tripKey = tripKeyFromDestination(form.destino || roteiro?.destino || "viagem");
  const previsao = calculateForecast({
    plannedBudget: orcamentoPrevisto,
    expenses: gastos
  });
  const checklistSections = buildTripChecklists(form);
  const checklistTotal = checklistSections.reduce(
    (sum, section) => sum + section.items.length,
    0
  );
  const checklistDone = checklistSections.reduce(
    (sum, section) =>
      sum + section.items.filter((item) => checklistState[item.id]).length,
    0
  );
  const destinoNormalizado = normalizeText(form.destino);
  const destinationMatches = ALL_DESTINATION_SUGGESTIONS.filter((destination) =>
    normalizeText(destination).includes(destinoNormalizado)
  ).slice(0, 6);
  const destinoSelecionado = ALL_DESTINATION_SUGGESTIONS.some(
    (destination) => normalizeText(destination) === destinoNormalizado
  );
  const showDestinationAutocomplete =
    destinoFocado && form.destino.length > 0 && destinationMatches.length > 0;
  const showDestinationWarning =
    form.destino.length >= 3 && !destinoSelecionado;
  const guestsSummary = `${adultos} ${adultos === 1 ? "adulto" : "adultos"}${
    criancas > 0 ? ` · ${criancas} ${criancas === 1 ? "crianca" : "criancas"}` : ""
  } · ${quartos} ${quartos === 1 ? "quarto" : "quartos"}`;

  useEffect(() => {
    carregarSalvos();
    carregarComputadorDeBordo();
    setSocialCarregando(true);
    fetch("/api/social?q=Fernando+de+Noronha")
      .then((r) => r.json())
      .then((d) => setSocialPosts(d.posts || []))
      .catch(() => {})
      .finally(() => setSocialCarregando(false));

    Promise.all(
      TRENDING.map((destination) =>
        fetch(`/api/fotos?q=${encodeURIComponent(destination.name)}&mode=hero`)
          .then((response) => response.json())
          .then((data) => [destination.name, data.heroUrl || ""] as const)
          .catch(() => [destination.name, ""] as const)
      )
    ).then((entries) => {
      setTrendingImages(
        Object.fromEntries(entries.filter(([, url]) => Boolean(url)))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOrcamentoPrevisto(budgetPreset(form.orcamento));
  }, [form.orcamento]);

  useEffect(() => {
    carregarComputadorDeBordo();
    setChecklistState(loadChecklistState(tripKeyFromDestination(form.destino || "viagem")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.destino]);

  useEffect(() => {
    if (!form.destino || form.destino.length < 3) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/fotos?q=${encodeURIComponent(form.destino)}&mode=hero`)
        .then((r) => r.json())
        .then((d) => {
          if (d.heroUrl) setHeroUrl(d.heroUrl);
        })
        .catch(() => {});
    }, 700);
  }, [form.destino]);

  async function carregarSalvos() {
    const trips = await listLocalTrips();
    setSalvos(trips);
  }

  async function carregarComputadorDeBordo() {
    const key = tripKeyFromDestination(form.destino || roteiro?.destino || "viagem");
    const [expenses, places] = await Promise.all([
      listTripExpenses(key),
      listVisitedPlaces(key)
    ]);
    setGastos(expenses);
    setLugaresVisitados(places);
  }

  function atualizar(campo: keyof TripRequest, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function atualizarDatas(campo: "inicio" | "fim", valor: string) {
    const inicio = campo === "inicio" ? valor : dataInicio;
    let fim = campo === "fim" ? valor : dataFim;

    if (inicio && fim && fim < inicio) {
      fim = "";
      setDataFim("");
    }

    if (campo === "inicio") setDataInicio(valor);
    if (campo === "fim") setDataFim(valor);

    setForm((atual) => ({
      ...atual,
      datas: formatTripDates(inicio, fim)
    }));
  }

  function abrirCalendario(ref: { current: HTMLInputElement | null }) {
    const input = ref.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.click();
  }

  function atualizarViajantes(next: {
    adultos?: number;
    criancas?: number;
    quartos?: number;
    idades?: string[];
  }) {
    const nextAdultos = Math.max(1, next.adultos ?? adultos);
    const nextCriancas = Math.max(0, next.criancas ?? criancas);
    const nextQuartos = Math.max(1, next.quartos ?? quartos);
    const nextIdades = next.idades ?? idadesCriancas;

    setAdultos(nextAdultos);
    setCriancas(nextCriancas);
    setQuartos(nextQuartos);
    setIdadesCriancas(nextIdades.slice(0, nextCriancas));

    setForm((atual) => ({
      ...atual,
      pessoas: `${nextAdultos} ${nextAdultos === 1 ? "adulto" : "adultos"}${
        nextCriancas > 0
          ? ` + ${nextCriancas} ${nextCriancas === 1 ? "crianca" : "criancas"}`
          : ""
      } · ${nextQuartos} ${nextQuartos === 1 ? "quarto" : "quartos"}`
    }));
  }

  function escolherTrending(name: string, seed: string) {
    const knownDestination =
      ALL_DESTINATION_SUGGESTIONS.find(
        (destination) => normalizeText(destination) === normalizeText(name)
      ) ||
      ALL_DESTINATION_SUGGESTIONS.find((destination) => {
        const [city] = destination.split(" - ");
        return normalizeText(name).includes(normalizeText(city));
      }) ||
      name;

    setForm((atual) => ({ ...atual, destino: knownDestination }));
    if (trendingImages[knownDestination]) setHeroUrl(trendingImages[knownDestination]);
  }

  function selecionarDestino(destination: string) {
    setForm((atual) => ({ ...atual, destino: destination }));
    setDestinoFocado(false);
    if (trendingImages[destination]) setHeroUrl(trendingImages[destination]);
  }

  async function fetchMedia(destination: string) {
    setFotosCarregando(true);
    setSocialCarregando(true);
    try {
      const [fRes, sRes] = await Promise.all([
        fetch(`/api/fotos?q=${encodeURIComponent(destination)}`),
        fetch(`/api/social?q=${encodeURIComponent(destination)}`)
      ]);
      const [fData, sData] = await Promise.all([fRes.json(), sRes.json()]);
      setDestinationPhotos(fData.photos || []);
      setSocialPosts(sData.posts || []);
    } catch {
      // ignore
    } finally {
      setFotosCarregando(false);
      setSocialCarregando(false);
    }
  }

  async function gerar() {
    if (!form.destino) return;
    if (!destinoSelecionado) {
      setErro("Escolha um destino da sugestao para evitar erro de escrita.");
      setDestinoFocado(true);
      return;
    }
    setCarregando(true);
    setErro("");
    setStatus("");
    setRoteiro(null);
    setAgentes(null);
    setCoords(null);
    setActiveTab("roteiro");

    try {
      const response = await fetch("/api/roteiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Não foi possível gerar o roteiro.");

      setRoteiro(data.roteiro);
      setAgentes(data.agentes);
      if (data.coords) setCoords(data.coords);
      if (data.bookingLinks) setBookingLinks(data.bookingLinks);
      if (data.pois) setPois(data.pois);

      fetchMedia(form.destino);

      fetch(`/api/fotos?q=${encodeURIComponent(form.destino)}&mode=hero`)
        .then((r) => r.json())
        .then((d) => {
          if (d.heroUrl) setHeroUrl(d.heroUrl);
        })
        .catch(() => {});
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setCarregando(false);
    }
  }

  async function salvarNesteAparelho() {
    if (!roteiro) return;
    await saveTripLocally({
      title: roteiro.titulo,
      destination: roteiro.destino,
      request: form,
      plan: roteiro,
      agents: agentes
    });
    await carregarSalvos();
    setStatus("Roteiro salvo neste aparelho.");
  }

  async function compartilharAtual() {
    if (!roteiro) return;
    const message = await shareTrip(roteiro);
    setStatus(message);
  }

  function exportarAtual() {
    if (!roteiro) return;
    downloadTripJson({
      title: roteiro.titulo,
      destination: roteiro.destino,
      request: form,
      plan: roteiro,
      agents: agentes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  function abrirSalvo(trip: SavedTrip) {
    setForm(trip.request);
    setRoteiro(trip.plan);
    setAgentes(trip.agents);
    setCoords(null);
    setStatus(`Roteiro "${trip.title}" aberto.`);
    setActiveTab("roteiro");
    setOrcamentoPrevisto(budgetPreset(trip.request.orcamento));
    if (trip.request.destino) fetchMedia(trip.request.destino);
  }

  async function removerSalvo(id?: number) {
    if (!id) return;
    await deleteLocalTrip(id);
    await carregarSalvos();
    setStatus("Roteiro removido.");
  }

  async function fazerBackupSupabase() {
    setBackupCarregando(true);
    setErro("");
    setStatus("");

    try {
      const result = await backupLocalDataToSupabase();
      if (!result.ok) {
        setErro(result.message);
        return;
      }

      setStatus(
        `${result.message} Roteiros: ${result.counts?.trips || 0}, parceiros: ${
          result.counts?.partners || 0
        }, gastos: ${result.counts?.expenses || 0}, lugares: ${
          result.counts?.visitedPlaces || 0
        }.`
      );
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao enviar backup.");
    } finally {
      setBackupCarregando(false);
    }
  }

  function resetar() {
    setRoteiro(null);
    setAgentes(null);
    setCoords(null);
    setBookingLinks(null);
    setPois([]);
    setErro("");
    setStatus("");
    setActiveTab("roteiro");
    setHeroUrl(DEFAULT_HERO);
  }

  async function adicionarGasto() {
    const amount = Number(String(novoGasto.amount).replace(",", "."));
    if (!novoGasto.description.trim() || !amount || amount <= 0) {
      setErro("Informe descrição e valor do gasto.");
      return;
    }

    await addTripExpense({
      tripKey,
      destination: form.destino || roteiro?.destino || "Viagem",
      category: novoGasto.category,
      description: novoGasto.description.trim(),
      amount,
      paidAt: new Date().toISOString()
    });
    setNovoGasto({ category: "alimentacao", description: "", amount: "" });
    setErro("");
    setStatus("Gasto adicionado ao computador de bordo.");
    await carregarComputadorDeBordo();
  }

  async function removerGasto(id?: number) {
    if (!id) return;
    await deleteTripExpense(id);
    await carregarComputadorDeBordo();
    setStatus("Gasto removido.");
  }

  async function marcarLugarVisitado() {
    if (!novoLugar.name.trim()) {
      setErro("Informe o lugar visitado.");
      return;
    }

    await addVisitedPlace({
      tripKey,
      destination: form.destino || roteiro?.destino || "Viagem",
      name: novoLugar.name.trim(),
      notes: novoLugar.notes.trim() || undefined,
      rating: Number(novoLugar.rating) || undefined,
      visitedAt: new Date().toISOString()
    });
    setNovoLugar({ name: "", notes: "", rating: "5" });
    setErro("");
    setStatus("Lugar marcado como visitado.");
    await carregarComputadorDeBordo();
  }

  async function removerLugarVisitado(id?: number) {
    if (!id) return;
    await deleteVisitedPlace(id);
    await carregarComputadorDeBordo();
    setStatus("Lugar removido.");
  }

  function alternarChecklistItem(itemId: string) {
    setChecklistState((current) => {
      const next = {
        ...current,
        [itemId]: !current[itemId]
      };
      saveChecklistState(tripKey, next);
      return next;
    });
  }

  function renderDestinosSection() {
    return (
      <section className="section trending" id="destinos">
        <div className="section-header">
          <p className="eyebrow">Explore o Brasil</p>
          <h2>Destinos em alta agora</h2>
          <p className="section-sub">
            Rotas possiveis, custos estimados e rede de apoio para voce
            viajar com mais seguranca, mesmo achando que ainda esta longe.
          </p>
        </div>
        <div className="trending-grid">
          {TRENDING.map((d) => {
            const details = TRENDING_DETAILS[d.name];

            return (
              <button
                key={d.name}
                className="trending-card"
                onClick={() => escolherTrending(d.name, d.seed)}
                style={{
                  backgroundImage: trendingImages[d.name]
                    ? `url(${trendingImages[d.name]})`
                    : undefined
                }}
              >
                <div className="trending-overlay" />
                <div className="trending-info">
                  <div className="trending-topline">
                    <span className="trending-emoji">{d.emoji}</span>
                    <span className="trending-price">
                      {details?.price || "rota personalizada"}
                    </span>
                  </div>
                  <span className="trending-name">{d.name.split(" - ")[0]}</span>
                  <span className="trending-state">{d.name.split(" - ")[1]}</span>
                  <p className="trending-promise">
                    {details?.promise || "ferias planejadas com apoio real"}
                  </p>
                  <span className="trending-support">
                    {details?.support || "comunidade e fornecedores para ajudar"}
                  </span>
                  <span className="trending-action">Planejar essa viagem</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="travel-ecosystem">
          <span>Rede de apoio</span>
          <span>Fotos e mapas reais</span>
          <span>Custos estimados</span>
          <span>Fornecedores para conferir</span>
          <span>Comunidade de quem ja foi</span>
        </div>
      </section>
    );
  }

  return (
    <main>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          <img
            src="/logo-oficial.svg"
            alt="Férias com IA"
            className="brand-logo"
            style={{ height: 44, width: "auto" }}
          />
        </div>
        <div className="navbar-links">
          <a href="#destinos">Destinos</a>
          <a href="#comunidade">Comunidade</a>
          <a href="/guia-do-pescador">Guia do Pescador</a>
          <a href="#como-funciona">Como funciona</a>
        </div>
        <button
          className="btn-nav-cta"
          onClick={() =>
            document
              .getElementById("search-form")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Planejar viagem
        </button>
      </nav>

      {!roteiro ? (
        <>
          {/* ── HERO ── */}
          <section className="hero">
            <div
              className="hero-bg"
              style={{ backgroundImage: `url(${heroUrl})` }}
            />
            <div className="hero-overlay" />
            <div className="hero-content">
              <p className="hero-eyebrow">Seu agente de viagem de bolso</p>
              <h1 className="hero-title">
                IA que pesquisa, planeja
                <br />e traz experiências reais
              </h1>
              <p className="hero-subtitle">
                Roteiro completo com fotos, mapa interativo,
                <br />
                dicas de viajantes e orçamento — em segundos.
              </p>

              <div className="search-card travel-search-shell" id="search-form">
                <div className="travel-search-main">
                <div className="search-field-big search-segment destination-segment">
                  <label>Ponto de referencia</label>
                  <input
                    value={form.destino}
                    onChange={(e) => {
                      atualizar("destino", e.target.value);
                      setDestinoFocado(true);
                    }}
                    onFocus={() => setDestinoFocado(true)}
                    onBlur={() => setTimeout(() => setDestinoFocado(false), 120)}
                    autoComplete="off"
                    placeholder="Para onde?"
                  />
                  {showDestinationAutocomplete && (
                    <div className="destination-autocomplete">
                      {destinationMatches.map((destination) => (
                        <button
                          key={destination}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => selecionarDestino(destination)}
                        >
                          <span>{destination.split(" - ")[0]}</span>
                          <small>{destination.split(" - ")[1] || "Brasil"}</small>
                        </button>
                      ))}
                    </div>
                  )}
                  {showDestinationWarning && (
                    <span className="destination-warning">
                      Escolha uma sugestao para evitar destino escrito errado.
                    </span>
                  )}
                </div>

                <div className="search-row-3 search-segment-group">
                  <div className="search-field search-segment dates-segment">
                    <label>📅 Datas</label>
                    <div className="date-inputs">
                      <div className="date-picker-shell">
                        <button
                          type="button"
                          className="date-display"
                          onClick={() => abrirCalendario(dataInicioInputRef)}
                        >
                          {formatPtDateInput(dataInicio) || "Ida"}
                        </button>
                        <input
                          ref={dataInicioInputRef}
                          className="native-date-input"
                          type="date"
                          value={dataInicio}
                          lang="pt-BR"
                          onChange={(e) => atualizarDatas("inicio", e.target.value)}
                          aria-label="Data de ida"
                        />
                      </div>
                      <div className="date-picker-shell">
                        <button
                          type="button"
                          className="date-display"
                          onClick={() => abrirCalendario(dataFimInputRef)}
                        >
                          {formatPtDateInput(dataFim) || "Volta"}
                        </button>
                        <input
                          ref={dataFimInputRef}
                          className="native-date-input"
                          type="date"
                          value={dataFim}
                          min={dataInicio || undefined}
                          lang="pt-BR"
                          onChange={(e) => atualizarDatas("fim", e.target.value)}
                          aria-label="Data de volta"
                        />
                      </div>
                    </div>
                    <span className="date-helper">
                      {form.datas || "Escolha ida e volta no calendario"}
                    </span>
                  </div>
                  <div className="search-field search-segment guests-segment">
                    <label>👥 Viajantes</label>
                    <input
                      value={guestsSummary}
                      readOnly
                      onClick={() => setGuestPickerOpen((open) => !open)}
                      onFocus={() => setGuestPickerOpen(true)}
                      placeholder="Ex: 2 adultos + 1 criança"
                    />
                    {guestPickerOpen && (
                      <div className="guest-picker">
                        <div className="guest-row">
                          <strong>Adultos</strong>
                          <div className="stepper">
                            <button type="button" onClick={() => atualizarViajantes({ adultos: adultos - 1 })} disabled={adultos <= 1}>-</button>
                            <span>{adultos}</span>
                            <button type="button" onClick={() => atualizarViajantes({ adultos: adultos + 1 })}>+</button>
                          </div>
                        </div>
                        <div className="guest-row">
                          <strong>Criancas</strong>
                          <div className="stepper">
                            <button type="button" onClick={() => atualizarViajantes({ criancas: criancas - 1 })} disabled={criancas <= 0}>-</button>
                            <span>{criancas}</span>
                            <button type="button" onClick={() => atualizarViajantes({ criancas: criancas + 1 })}>+</button>
                          </div>
                        </div>
                        {criancas > 0 && (
                          <div className="children-ages">
                            {Array.from({ length: criancas }).map((_, index) => (
                              <select
                                key={index}
                                value={idadesCriancas[index] || ""}
                                onChange={(event) => {
                                  const next = [...idadesCriancas];
                                  next[index] = event.target.value;
                                  atualizarViajantes({ idades: next });
                                }}
                              >
                                <option value="">Idade</option>
                                {Array.from({ length: 18 }).map((__, age) => (
                                  <option key={age} value={String(age)}>{age} anos</option>
                                ))}
                              </select>
                            ))}
                          </div>
                        )}
                        <p className="guest-note">
                          Usamos estes dados para buscar hospedagens que acomodem todo o grupo e calcular melhor o orcamento.
                        </p>
                        <div className="guest-row">
                          <strong>Quartos</strong>
                          <div className="stepper">
                            <button type="button" onClick={() => atualizarViajantes({ quartos: quartos - 1 })} disabled={quartos <= 1}>-</button>
                            <span>{quartos}</span>
                            <button type="button" onClick={() => atualizarViajantes({ quartos: quartos + 1 })}>+</button>
                          </div>
                        </div>
                        <label className="guest-toggle">
                          <span>Viajando com pets?</span>
                          <input type="checkbox" checked={viajandoPets} onChange={(e) => setViajandoPets(e.target.checked)} />
                        </label>
                        <button type="button" className="guest-ok" onClick={() => setGuestPickerOpen(false)}>OK</button>
                      </div>
                    )}
                  </div>
                  <div className="search-field">
                    <label>💰 Orçamento</label>
                    <select
                      value={form.orcamento}
                      onChange={(e) => atualizar("orcamento", e.target.value)}
                    >
                      <option>Econômico</option>
                      <option>Confortável econômico</option>
                      <option>Premium</option>
                    </select>
                  </div>
                </div>

                <div className="search-objective">
                  <label>✨ O que você quer fazer / experienciar?</label>
                  <input
                    value={form.objetivo}
                    onChange={(e) => atualizar("objetivo", e.target.value)}
                    placeholder="Ex: praias desertas, mergulho, gastronomia local..."
                  />
                </div>

                  <button
                    className="btn-generate"
                    onClick={gerar}
                    disabled={carregando || !form.destino || !destinoSelecionado}
                  >
                  {carregando ? (
                    <>
                      <span className="spinner" />
                      Skills pesquisando para voce...
                    </>
                  ) : (
                    <>Pesquisar</>
                  )}
                </button>
                </div>

                {erro && <p className="msg-erro">{erro}</p>}
              </div>
            </div>
          </section>

          {/* ── TRENDING ── */}
          <section className="section trending" id="destinos">
            <div className="section-header">
              <p className="eyebrow">Explore o Brasil</p>
              <h2>Destinos em alta agora</h2>
              <p className="section-sub">
                Rotas possiveis, custos estimados e rede de apoio para voce
                viajar com mais seguranca, mesmo achando que ainda esta longe.
              </p>
            </div>
            <div className="trending-grid">
              {TRENDING.map((d) => {
                const details = TRENDING_DETAILS[d.name];

                return (
                  <button
                    key={d.name}
                    className="trending-card"
                    onClick={() => escolherTrending(d.name, d.seed)}
                    style={{
                      backgroundImage: trendingImages[d.name]
                        ? `url(${trendingImages[d.name]})`
                        : undefined
                    }}
                  >
                    <div className="trending-overlay" />
                    <div className="trending-info">
                      <div className="trending-topline">
                        <span className="trending-emoji">{d.emoji}</span>
                        <span className="trending-price">
                          {details?.price || "rota personalizada"}
                        </span>
                      </div>
                      <span className="trending-name">{d.name.split(" - ")[0]}</span>
                      <span className="trending-state">{d.name.split(" - ")[1]}</span>
                      <p className="trending-promise">
                        {details?.promise || "ferias planejadas com apoio real"}
                      </p>
                      <span className="trending-support">
                        {details?.support || "comunidade e fornecedores para ajudar"}
                      </span>
                      <span className="trending-action">Planejar essa viagem</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="travel-ecosystem">
              <span>Rede de apoio</span>
              <span>Fotos e mapas reais</span>
              <span>Custos estimados</span>
              <span>Fornecedores para conferir</span>
              <span>Comunidade de quem ja foi</span>
            </div>
          </section>

          {/* ── COMMUNITY CTA ── */}
          <section className="section home-community" id="comunidade">
            <div className="home-community-content">
              <div>
                <p className="eyebrow">Comunidade</p>
                <h2>Encontre grupos e eventos no destino da sua viagem</h2>
                <p>
                  Além do roteiro, descubra pessoas, encontros, passeios em grupo,
                  experiências gastronômicas e comunidades locais para viajar com
                  mais confiança.
                </p>
                <a className="home-community-cta" href="/comunidade">
                  Abrir Comunidade
                </a>
              </div>
              <div className="home-community-cards">
                <article>
                  <span>🎣</span>
                  <strong>Pescaria</strong>
                  <p>Grupos, barcos, guias e dicas locais.</p>
                </article>
                <article>
                  <span>🍽️</span>
                  <strong>Gastronomia</strong>
                  <p>Encontros em restaurantes e experiências regionais.</p>
                </article>
                <article>
                  <span>🗺️</span>
                  <strong>Passeios</strong>
                  <p>Eventos, trilhas e atividades para famílias.</p>
                </article>
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <div className="how-it-works" id="como-funciona">
            <div className="section-header">
              <p className="eyebrow">Como funciona</p>
              <h2>Da ideia ao roteiro em 3 passos</h2>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Diga o destino e suas preferências</h3>
                <p>
                  Informe para onde quer ir, quando, quantas pessoas e o que
                  gosta de fazer.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>A IA pesquisa e planeja por você</h3>
                <p>
                  Agentes de IA buscam hospedagens, passeios, clima, rotas e
                  experiências de viajantes reais.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Roteiro completo com mapa e fotos</h3>
                <p>
                  Receba itinerário dia a dia, mapa interativo, galeria de
                  fotos, orçamento e checklist.
                </p>
              </div>
            </div>
          </div>

          {/* ── SOCIAL PREVIEW ── */}
          <section className="section social-preview">
            <div className="section-header">
              <p className="eyebrow">Experiências reais</p>
              <h2>O que viajantes estão compartilhando</h2>
              <p className="section-sub">
                Posts de viajantes reais sobre destinos brasileiros
              </p>
            </div>
            {socialCarregando ? (
              <div className="loading-row">
                <div className="skeleton-card" />
                <div className="skeleton-card" />
                <div className="skeleton-card" />
              </div>
            ) : (
              <div className="social-grid">
                {socialPosts.map((post) => (
                  <SocialCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        /* ── RESULT VIEW ── */
        <>
          <div
            className="result-hero"
            style={{ backgroundImage: `url(${heroUrl})` }}
          >
            <div className="result-hero-overlay" />
            <div className="result-hero-content">
              <button className="btn-back" onClick={resetar}>
                ← Nova busca
              </button>
              <p className="hero-eyebrow">{roteiro.geradoPor}</p>
              <h1 className="result-title">{roteiro.titulo}</h1>
              <p className="result-dest">📍 {roteiro.destino}</p>
              <div className="result-actions-top">
                <button className="btn-action" onClick={salvarNesteAparelho}>
                  💾 Salvar
                </button>
                <button className="btn-action" onClick={compartilharAtual}>
                  🔗 Compartilhar
                </button>
                <button className="btn-action" onClick={exportarAtual}>
                  ⬇️ Exportar
                </button>
                <button className="btn-action" onClick={() => window.print()}>
                  🖨️ PDF
                </button>
              </div>
              {status && (
                <p className="msg-sucesso" style={{ marginTop: 12 }}>
                  {status}
                </p>
              )}
            </div>
          </div>

          <nav className="tabs-nav">
            {Object.entries(TAB_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`tab-btn${activeTab === key ? " active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="tab-panel">
            {/* ROTEIRO */}
            {activeTab === "roteiro" && (
              <div className="roteiro-layout">
                <div className="roteiro-main">
                  <p className="roteiro-resumo">{roteiro.resumo}</p>
                  <h3>Roteiro dia a dia</h3>
                  <div className="day-list">
                    {roteiro.roteiro.map((item, i) => (
                      <div key={i} className="day-card">
                        <div className="day-badge">{i + 1}</div>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="roteiro-sidebar">
                  <div className="sidebar-card">
                    <h4>✅ Checklist</h4>
                    <ul>
                      {roteiro.checklist.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="sidebar-card budget">
                    <h4>💰 Orçamento estimado</h4>
                    <p>{roteiro.orcamentoEstimado}</p>
                  </div>
                  <div className="sidebar-card">
                    <h4>🎯 Próximos passos</h4>
                    <ul>
                      {roteiro.proximosPassos.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* RESERVE */}
            {activeTab === "reserve" && (
              <div className="reserve-panel">
                <div className="reserve-hero">
                  <p className="eyebrow">Agente de viagem de bolso</p>
                  <h2>Reserve com os melhores do mercado</h2>
                  <p>
                    Links diretos para {roteiro?.destino} já pré-preenchidos com
                    seu destino e datas. Compare preços e escolha o melhor.
                  </p>
                </div>
                <div className="reserve-grid">
                  {bookingLinks && (
                    <>
                      <a
                        href={bookingLinks.googleFlights}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-card flights"
                      >
                        <div className="reserve-icon">✈️</div>
                        <div className="reserve-info">
                          <strong>Google Voos</strong>
                          <span>Compare passagens para {roteiro?.destino}</span>
                        </div>
                        <span className="reserve-cta">Buscar →</span>
                      </a>
                      <a
                        href={bookingLinks.skyscanner}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-card flights"
                      >
                        <div className="reserve-icon">🛫</div>
                        <div className="reserve-info">
                          <strong>Skyscanner</strong>
                          <span>Voos baratos e alertas de preço</span>
                        </div>
                        <span className="reserve-cta">Buscar →</span>
                      </a>
                      <a
                        href={bookingLinks.booking}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-card hotels"
                      >
                        <div className="reserve-icon">🏨</div>
                        <div className="reserve-info">
                          <strong>Booking.com</strong>
                          <span>Hotéis, pousadas e resorts em {roteiro?.destino}</span>
                        </div>
                        <span className="reserve-cta">Buscar →</span>
                      </a>
                      <a
                        href={bookingLinks.airbnb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-card hotels"
                      >
                        <div className="reserve-icon">🏡</div>
                        <div className="reserve-info">
                          <strong>Airbnb</strong>
                          <span>Casas e experiências locais autênticas</span>
                        </div>
                        <span className="reserve-cta">Buscar →</span>
                      </a>
                      <a
                        href={bookingLinks.googleHotels}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-card hotels"
                      >
                        <div className="reserve-icon">🔍</div>
                        <div className="reserve-info">
                          <strong>Google Hotéis</strong>
                          <span>Comparar todos os hotéis com avaliações</span>
                        </div>
                        <span className="reserve-cta">Buscar →</span>
                      </a>
                      <a
                        href={bookingLinks.tripadvisor}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-card experiences"
                      >
                        <div className="reserve-icon">⭐</div>
                        <div className="reserve-info">
                          <strong>TripAdvisor</strong>
                          <span>Avaliações, restaurantes e passeios</span>
                        </div>
                        <span className="reserve-cta">Ver →</span>
                      </a>
                      <a
                        href={bookingLinks.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-card experiences"
                      >
                        <div className="reserve-icon">📍</div>
                        <div className="reserve-info">
                          <strong>Google Maps</strong>
                          <span>Pontos turísticos e direções em {roteiro?.destino}</span>
                        </div>
                        <span className="reserve-cta">Explorar →</span>
                      </a>
                    </>
                  )}
                </div>
                {pois.length > 0 && (
                  <div className="pois-section">
                    <h3>📌 Atrações reais em {roteiro?.destino}</h3>
                    <p className="pois-sub">Pontos de interesse verificados</p>
                    <div className="pois-grid">
                      {pois.map((poi, i) => (
                        <div key={i} className="poi-card">
                          <div className="poi-category">{poi.category}</div>
                          <strong className="poi-name">{poi.name}</strong>
                          {poi.tags.length > 0 && (
                            <div className="poi-tags">
                              {poi.tags.map((tag) => (
                                <span key={tag} className="poi-tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MAPA */}
            {activeTab === "mapa" && (
              <div className="map-section">
                {coords ? (
                  <>
                    <p className="map-info">
                      📍 {roteiro.destino} &mdash; {coords.lat.toFixed(4)},{" "}
                      {coords.lng.toFixed(4)}
                    </p>
                    <TripMap destination={roteiro.destino} coords={coords} />
                    <p className="map-attribution">
                      © OpenStreetMap contributors
                    </p>
                  </>
                ) : (
                  <div className="no-map">
                    <p>📍 Coordenadas não disponíveis para este destino.</p>
                    <p style={{ marginTop: 8, fontSize: 14 }}>
                      Tente buscar com o estado, ex: &quot;Bonito - MS&quot;
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* FOTOS */}
            {activeTab === "fotos" && (
              <div>
                {fotosCarregando ? (
                  <div className="fotos-grid">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="foto-skeleton" />
                    ))}
                  </div>
                ) : destinationPhotos.length > 0 ? (
                  <div>
                    <div className="fotos-source-badge">
                      {destinationPhotos[0]?.source === "wikimedia" && (
                        <span className="source-real">📷 Fotos reais via Wikimedia Commons</span>
                      )}
                      {destinationPhotos[0]?.source === "pexels" && (
                        <span className="source-real">📷 Fotos reais via Pexels</span>
                      )}
                      {destinationPhotos[0]?.source === "unsplash" && (
                        <span className="source-real">📷 Fotos reais via Unsplash</span>
                      )}
                      {destinationPhotos[0]?.source === "picsum" && (
                        <span className="source-demo">
                          ⚠️ Imagens ilustrativas — configure <code>PEXELS_API_KEY</code> para fotos reais
                        </span>
                      )}
                    </div>
                    <div className="fotos-grid">
                      {destinationPhotos.map((foto) => (
                        <div key={foto.id} className="foto-card">
                          <img
                            src={foto.thumbUrl}
                            alt={foto.alt}
                            loading="lazy"
                          />
                          <div className="foto-overlay">
                            <span>{foto.photographer}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="empty-state">Nenhuma foto carregada.</p>
                )}
              </div>
            )}

            {/* SOCIAL */}
            {activeTab === "social" && (
              <div>
                {socialCarregando ? (
                  <div className="loading-row">
                    <div className="skeleton-card" />
                    <div className="skeleton-card" />
                    <div className="skeleton-card" />
                  </div>
                ) : socialPosts.length > 0 ? (
                  <div className="social-grid">
                    {socialPosts.map((post) => (
                      <SocialCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">
                    Nenhuma experiência encontrada.
                  </p>
                )}
              </div>
            )}

            {/* CHECKLIST */}
            {activeTab === "checklist" && (
              <div className="checklist-panel">
                <div className="checklist-header">
                  <div>
                    <p className="eyebrow">Preparação da viagem</p>
                    <h2>Checklist inteligente</h2>
                    <p>
                      Bagagem essencial para qualquer viagem. Se o objetivo
                      incluir pescaria, o app abre automaticamente uma lista
                      específica de pesca.
                    </p>
                  </div>
                  <div className="checklist-progress">
                    <strong>
                      {checklistDone}/{checklistTotal}
                    </strong>
                    <span>itens marcados</span>
                  </div>
                </div>

                <div className="checklist-grid">
                  {checklistSections.map((section) => (
                    <article key={section.id} className="checklist-card">
                      <h3>{section.title}</h3>
                      <div className="checklist-items">
                        {section.items.map((item) => (
                          <label key={item.id} className="checklist-item">
                            <input
                              type="checkbox"
                              checked={Boolean(checklistState[item.id])}
                              onChange={() => alternarChecklistItem(item.id)}
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* BORDO */}
            {activeTab === "bordo" && (
              <div className="board-panel">
                <div className="board-header">
                  <div>
                    <p className="eyebrow">Computador de bordo</p>
                    <h2>Custo da viagem em tempo real</h2>
                    <p>
                      Marque gastos e lugares visitados. O app compara o previsto
                      com o realizado e melhora a previsão da viagem.
                    </p>
                  </div>
                </div>

                <div className="budget-summary">
                  <label>
                    Orçamento previsto
                    <input
                      type="number"
                      min="0"
                      value={orcamentoPrevisto}
                      onChange={(event) =>
                        setOrcamentoPrevisto(Number(event.target.value))
                      }
                    />
                  </label>
                  <div>
                    <strong>{formatCurrency(previsao.spent)}</strong>
                    <span>gasto até agora</span>
                  </div>
                  <div>
                    <strong>{formatCurrency(previsao.remaining)}</strong>
                    <span>saldo previsto</span>
                  </div>
                  <div className={`forecast-status ${previsao.status}`}>
                    <strong>{formatCurrency(previsao.projectedTotal)}</strong>
                    <span>projeção final</span>
                  </div>
                </div>

                <div className="board-grid">
                  <article className="board-card">
                    <h3>Adicionar gasto</h3>
                    <select
                      value={novoGasto.category}
                      onChange={(event) =>
                        setNovoGasto((current) => ({
                          ...current,
                          category: event.target.value as ExpenseCategory
                        }))
                      }
                    >
                      <option value="alimentacao">Alimentação</option>
                      <option value="hospedagem">Hospedagem</option>
                      <option value="passeios">Passeios</option>
                      <option value="transporte">Transporte</option>
                      <option value="compras">Compras</option>
                      <option value="outros">Outros</option>
                    </select>
                    <input
                      placeholder="Descrição"
                      value={novoGasto.description}
                      onChange={(event) =>
                        setNovoGasto((current) => ({
                          ...current,
                          description: event.target.value
                        }))
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Valor"
                      value={novoGasto.amount}
                      onChange={(event) =>
                        setNovoGasto((current) => ({
                          ...current,
                          amount: event.target.value
                        }))
                      }
                    />
                    <button className="btn-action board-button" onClick={adicionarGasto}>
                      Adicionar gasto
                    </button>

                    <div className="board-list">
                      {gastos.length === 0 ? (
                        <p className="board-empty">Nenhum gasto marcado ainda.</p>
                      ) : (
                        gastos.map((gasto) => (
                          <div key={gasto.id} className="board-row">
                            <span>
                              <strong>{gasto.description}</strong>
                              {gasto.category}
                            </span>
                            <b>{formatCurrency(gasto.amount)}</b>
                            <button onClick={() => removerGasto(gasto.id)}>
                              Excluir
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </article>

                  <article className="board-card">
                    <h3>Marcar lugar visitado</h3>
                    <input
                      placeholder="Lugar, passeio ou restaurante"
                      value={novoLugar.name}
                      onChange={(event) =>
                        setNovoLugar((current) => ({
                          ...current,
                          name: event.target.value
                        }))
                      }
                    />
                    <input
                      placeholder="Observação"
                      value={novoLugar.notes}
                      onChange={(event) =>
                        setNovoLugar((current) => ({
                          ...current,
                          notes: event.target.value
                        }))
                      }
                    />
                    <select
                      value={novoLugar.rating}
                      onChange={(event) =>
                        setNovoLugar((current) => ({
                          ...current,
                          rating: event.target.value
                        }))
                      }
                    >
                      <option value="5">5 - Excelente</option>
                      <option value="4">4 - Bom</option>
                      <option value="3">3 - Médio</option>
                      <option value="2">2 - Fraco</option>
                      <option value="1">1 - Evitar</option>
                    </select>
                    <button
                      className="btn-action board-button"
                      onClick={marcarLugarVisitado}
                    >
                      Marcar visitado
                    </button>

                    <div className="board-list">
                      {lugaresVisitados.length === 0 ? (
                        <p className="board-empty">Nenhum lugar marcado ainda.</p>
                      ) : (
                        lugaresVisitados.map((lugar) => (
                          <div key={lugar.id} className="board-row">
                            <span>
                              <strong>{lugar.name}</strong>
                              {lugar.notes || "Sem observação"} - nota{" "}
                              {lugar.rating || "-"}
                            </span>
                            <button onClick={() => removerLugarVisitado(lugar.id)}>
                              Excluir
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                </div>
              </div>
            )}

            {/* AGENTES */}
            {activeTab === "agentes" && agentes && (
              <div className="agentes-panel">
                <div className="agentes-grid">
                  <div className="agent-card">
                    <h3>🏆 Melhores opções avaliadas</h3>
                    <ul>
                      {agentes.melhoresOpcoes.map((opt) => (
                        <li key={`${opt.category}-${opt.title}`}>
                          <span className="score-badge">{opt.score}/100</span>
                          {opt.title}
                          <p className="opt-reason">{opt.reason}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="agent-card">
                    <h3>📱 Contatos de fornecedores</h3>
                    {(agentes.fontesConfianca?.length ?? 0) > 0 && (
                      <div className="trust-source-list">
                        {agentes.fontesConfianca?.map((source) => (
                          <a
                            key={`${source.kind}-${source.name}`}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="trust-source"
                          >
                            <span className="trust-kind">{source.kind}</span>
                            <strong>{source.name}</strong>
                            <p>{source.description}</p>
                            <small>{source.verificationTip}</small>
                          </a>
                        ))}
                      </div>
                    )}
                    <ul>
                      {agentes.contatosFornecedores.map((draft) => (
                        <li key={draft.supplierName}>
                          <strong>{draft.supplierName}</strong>
                          <p className="opt-reason">{draft.message}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="agent-card">
                    <h3>⚡ Próximas ações</h3>
                    <ul>
                      {agentes.proximasAcoes.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="agent-card">
                    <h3>🛠️ Skills ativas</h3>
                    {(agentes.trabalhoSkills?.length ?? 0) > 0 ? (
                      <div className="skill-work-list">
                        {agentes.trabalhoSkills?.map((skill) => (
                          <article key={skill.id} className="skill-work-item">
                            <div className="skill-work-head">
                              <strong>{skill.name}</strong>
                              <span className={`skill-status ${skill.status}`}>
                                {skill.status === "done"
                                  ? "feito"
                                  : skill.status === "needs-review"
                                  ? "conferir"
                                  : "aguardando"}
                              </span>
                            </div>
                            <p>{skill.mission}</p>
                            <small>{skill.result}</small>
                            <em>{skill.clientBenefit}</em>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <ul>
                        {agentes.skillsUsadas.map((skill) => (
                          <li key={skill}>
                            <span className="skill-tag">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── SAVED TRIPS ── */}
      {roteiro && renderDestinosSection()}

      <section className="saved-section">
        <div className="section-header">
          <p className="eyebrow">Seus roteiros</p>
          <h2>Salvos neste aparelho</h2>
          <p className="section-sub">
            Guardados no navegador. Sem banco de dados central.
          </p>
          <button
            className="btn-nav-cta cloud-backup-btn"
            onClick={fazerBackupSupabase}
            disabled={backupCarregando}
          >
            {backupCarregando ? "Enviando backup..." : "Backup no Supabase"}
          </button>
          {erro && <p className="msg-erro">{erro}</p>}
          {status && <p className="msg-sucesso">{status}</p>}
        </div>
        {salvos.length === 0 ? (
          <p className="empty-state">
            Nenhum roteiro salvo ainda. Gere e salve seu primeiro roteiro!
          </p>
        ) : (
          <div className="saved-grid">
            {salvos.map((trip) => (
              <div key={trip.id} className="saved-card">
                <div
                  className="saved-photo"
                  style={{
                    backgroundImage: `url(https://picsum.photos/seed/${encodeURIComponent(
                      trip.destination
                    )}/400/200)`
                  }}
                />
                <div className="saved-info">
                  <h3>{trip.title}</h3>
                  <p>📍 {trip.destination}</p>
                  <span>
                    {new Date(trip.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="saved-btns">
                  <button onClick={() => abrirSalvo(trip)}>Abrir</button>
                  <button onClick={() => downloadTripJson(trip)}>
                    Exportar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => removerSalvo(trip.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function SocialCard({ post }: { post: SocialPost }) {
  const platformColor: Record<string, string> = {
    Reddit: "#ff4500",
    YouTube: "#ff0000",
    Instagram: "#c13584"
  };

  return (
    <article className="social-card">
      {post.thumbUrl && (
        <div className="social-thumb">
          <img src={post.thumbUrl} alt={post.title} loading="lazy" />
          {post.type === "youtube" && <span className="play-btn">▶</span>}
        </div>
      )}
      <div className="social-body">
        <div className="social-meta">
          <span
            className="platform-badge"
            style={{ background: platformColor[post.platform] ?? "#666" }}
          >
            {post.platform}
          </span>
          <span className="social-author">{post.author}</span>
          {post.subreddit && (
            <span className="subreddit">{post.subreddit}</span>
          )}
        </div>
        <h4 className="social-title">{post.title}</h4>
        <p className="social-text">{post.body}</p>
        {post.upvotes != null && (
          <span className="social-upvotes">
            👍 {post.upvotes.toLocaleString("pt-BR")}
          </span>
        )}
        {post.url && post.url !== "#" && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            Ver original →
          </a>
        )}
      </div>
    </article>
  );
}
