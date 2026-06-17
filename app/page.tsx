"use client";

import { useState } from "react";
import type { TripPlan, TripRequest } from "../lib/trips/types";

export default function Home() {
  const [form, setForm] = useState<TripRequest>({
    destino: "Cananéia - SP",
    datas: "12 a 19 de julho de 2026",
    pessoas: "2 adultos + 2 crianças",
    objetivo: "Família + pescaria + frutos do mar",
    orcamento: "Confortável econômico"
  });
  const [roteiro, setRoteiro] = useState<TripPlan | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function atualizar(campo: keyof TripRequest, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function gerar() {
    setCarregando(true);
    setErro("");
    setRoteiro(null);

    try {
      const response = await fetch("/api/roteiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível gerar o roteiro.");
      }

      setRoteiro(data.roteiro);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="container">
      <section className="hero">
        <div>
          <p className="eyebrow">MVP com central de IA</p>
          <h1>Férias com IA</h1>
          <h2>Você escolhe o destino. A IA cria a experiência.</h2>
          <p>
            Monte roteiros completos com passeios, orçamento, checklist,
            parceiros locais e base pronta para PDF.
          </p>
        </div>

        <div className="card">
          <label>Destino</label>
          <input value={form.destino} onChange={(e) => atualizar("destino", e.target.value)} />

          <label>Datas</label>
          <input value={form.datas} onChange={(e) => atualizar("datas", e.target.value)} />

          <label>Pessoas</label>
          <input value={form.pessoas} onChange={(e) => atualizar("pessoas", e.target.value)} />

          <label>Objetivo da viagem</label>
          <textarea value={form.objetivo} onChange={(e) => atualizar("objetivo", e.target.value)} />

          <label>Orçamento</label>
          <select value={form.orcamento} onChange={(e) => atualizar("orcamento", e.target.value)}>
            <option>Econômico</option>
            <option>Confortável econômico</option>
            <option>Premium</option>
          </select>

          <button className="btn" onClick={gerar} disabled={carregando}>
            {carregando ? "Gerando..." : "Gerar roteiro"}
          </button>

          {erro && <p className="erro">{erro}</p>}
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <h3>Roteiro</h3>
          <p>Dia a dia organizado pela central de IA.</p>
        </div>
        <div className="card">
          <h3>Parceiros</h3>
          <p>Estrutura pronta para guias, passeios e restaurantes locais.</p>
        </div>
        <div className="card">
          <h3>PDF</h3>
          <p>Base preparada para gerar o plano de viagem para impressão.</p>
        </div>
      </section>

      {roteiro && (
        <section className="resultado">
          <div className="resultado-header">
            <div>
              <p className="eyebrow">Gerado por: {roteiro.geradoPor}</p>
              <h2>{roteiro.titulo}</h2>
            </div>
            <strong>{roteiro.destino}</strong>
          </div>

          <p>{roteiro.resumo}</p>

          <h3>Roteiro dia a dia</h3>
          <ul>
            {roteiro.roteiro.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Checklist</h3>
          <ul>
            {roteiro.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Orçamento estimado</h3>
          <p>{roteiro.orcamentoEstimado}</p>

          <h3>Próximos passos</h3>
          <ul>
            {roteiro.proximosPassos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
