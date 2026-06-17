import Link from "next/link";
import {
  checklistPesca,
  especiesPesca,
  piloteirosPesca
} from "../../lib/pesca/data";

export default function GuiaDoPescadorPage() {
  return (
    <main className="fishing-page">
      <header className="fishing-nav">
        <Link href="/" className="fishing-brand">
          <img src="/logos%20sem%20fundo.png" alt="Ferias com IA" />
        </Link>
        <nav>
          <Link href="/">Inicio</Link>
          <Link href="/comunidade">Comunidade</Link>
          <Link href="/guia-do-pescador">Guia do Pescador</Link>
        </nav>
      </header>

      <section className="fishing-hero">
        <div>
          <p className="eyebrow">App dentro do app</p>
          <h1>Guia do Pescador com IA</h1>
          <p>
            Estrategia de pesca para viagem: especies provaveis, iscas,
            equipamentos, horarios, leitura de sonar, checklist e contatos de
            piloteiros.
          </p>
          <div className="fishing-actions">
            <Link href="/#search-form">Planejar viagem de pesca</Link>
            <Link href="/comunidade">Encontrar grupo</Link>
          </div>
        </div>

        <aside className="fishing-index-card">
          <span>Indice de pesca IA</span>
          <h2>Porto XV - Bataguassu/MS</h2>
          <p>17 a 21 de abril de 2027</p>
          <div className="fish-score-list">
            {especiesPesca.map((especie) => (
              <div key={especie.nome}>
                <div className="fish-score-head">
                  <strong>{especie.nome}</strong>
                  <b>{especie.chance}%</b>
                </div>
                <div className="fish-score-bar">
                  <span style={{ width: `${especie.chance}%` }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="fishing-section">
        <div className="section-header">
          <p className="eyebrow">Estrategia por especie</p>
          <h2>Onde procurar, o que usar e quando insistir</h2>
        </div>
        <div className="fish-species-grid">
          {especiesPesca.map((especie) => (
            <article key={especie.nome} className="fish-card">
              <h3>{especie.nome}</h3>
              <p>
                <strong>Onde procurar:</strong> {especie.locais.join(", ")}
              </p>
              <p>
                <strong>Iscas:</strong> {especie.iscas.join(", ")}
              </p>
              <p>
                <strong>Equipamento:</strong> {especie.equipamento}
              </p>
              <p>
                <strong>Melhor horario:</strong> {especie.horario}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="fishing-section fishing-tools-grid">
        <article className="fish-card sonar-card">
          <h3>Sonar inteligente</h3>
          <p>
            Biblioteca para ensinar o pescador a identificar galhadas, pocos,
            cardumes, peixes suspensos, fundo duro e estruturas produtivas.
          </p>
          <div className="sonar-screen">
            <p>▁▂▃▅▇ peixe suspenso</p>
            <p>▇▇▆▅ fundo duro</p>
            <p>≋≋≋ cardume de iscas</p>
          </div>
        </article>

        <article className="fish-card">
          <h3>Checklist de pesca</h3>
          <div className="fish-checklist">
            {checklistPesca.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>

        <article className="fish-card">
          <h3>Piloteiros e parceiros</h3>
          <div className="pilot-list">
            {piloteirosPesca.map((piloteiro) => (
              <div key={piloteiro.nome} className="pilot-card">
                <strong>{piloteiro.nome}</strong>
                <p>{piloteiro.especialidade}</p>
                <span>
                  Nota {piloteiro.nota} · {piloteiro.saidas} saidas ·{" "}
                  {piloteiro.maiorPeixe}
                </span>
                <button type="button">Chamar no WhatsApp</button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
