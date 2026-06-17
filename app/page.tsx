"use client";

import { useState } from "react";
import { gerarRoteiroDemo } from "../lib/roteiro";

export default function Home() {
  const [form, setForm] = useState({
    destino: "Cananéia - SP",
    datas: "12 a 19 de julho de 2026",
    pessoas: "2 adultos + 2 crianças",
    objetivo: "Família + pescaria + frutos do mar",
    orcamento: "Confortável econômico"
  });
  const [roteiro, setRoteiro] = useState("");

  function atualizar(campo: string, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function gerar() {
    setRoteiro(gerarRoteiroDemo(form));
  }

  return (
    <main className="container">
      <section className="hero">
        <div>
          <h1>🌴 Férias com IA</h1>
          <h2>Você escolhe o destino. A IA cria a experiência.</h2>
          <p>
            Monte roteiros completos com hospedagem, passeios, restaurantes,
            orçamento, checklist e contatos locais.
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

          <br /><br />
          <button className="btn" onClick={gerar}>Gerar roteiro</button>
        </div>
      </section>

      <section className="grid">
        <div className="card"><h3>🗓️ Roteiro</h3><p>Dia a dia organizado.</p></div>
        <div className="card"><h3>📍 Parceiros</h3><p>Guias, passeios e restaurantes locais.</p></div>
        <div className="card"><h3>📄 PDF</h3><p>Plano pronto para imprimir.</p></div>
      </section>

      {roteiro && <section style={{ marginTop: 24 }} className="resultado">{roteiro}</section>}
    </main>
  );
}
