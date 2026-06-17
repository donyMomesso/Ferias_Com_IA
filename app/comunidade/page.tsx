"use client";

import { useState } from "react";
import { CategoryFilter } from "../../components/comunidade/CategoryFilter";
import { EventCard } from "../../components/comunidade/EventCard";
import { GroupCard } from "../../components/comunidade/GroupCard";
import { communityCategories, demoEvents, demoGroups } from "../../lib/community/demo";

export default function ComunidadePage() {
  const [categoria, setCategoria] = useState("Viagem");
  const [busca, setBusca] = useState("");
  const [cidade, setCidade] = useState("");

  const grupos = demoGroups.filter((group) => {
    const byCategory = categoria ? group.category === categoria || categoria === "Viagem" : true;
    const bySearch = busca
      ? `${group.name} ${group.description}`.toLowerCase().includes(busca.toLowerCase())
      : true;
    const byCity = cidade ? group.city.toLowerCase().includes(cidade.toLowerCase()) : true;
    return byCategory && bySearch && byCity;
  });

  return (
    <main className="community-page">
      <section className="community-hero">
        <p className="eyebrow">Comunidade Férias com IA</p>
        <h1>Encontre grupos, eventos e viajantes no seu destino</h1>
        <p>
          Um espaço tipo Meetup para combinar passeios, conhecer fornecedores locais
          e descobrir experiências com pessoas que gostam do mesmo estilo de viagem.
        </p>
        <div className="community-search">
          <input placeholder="Interesse: pescaria, gastronomia, trilha..." value={busca} onChange={(event) => setBusca(event.target.value)} />
          <input placeholder="Cidade" value={cidade} onChange={(event) => setCidade(event.target.value)} />
        </div>
      </section>

      <section className="community-section">
        <CategoryFilter categories={communityCategories} selected={categoria} onSelect={setCategoria} />
      </section>

      <section className="community-section">
        <div className="community-section-heading">
          <h2>Grupos em destaque</h2>
          <a href="/comunidade/grupos">Ver todos</a>
        </div>
        <div className="community-grid">
          {grupos.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </section>

      <section className="community-section">
        <div className="community-section-heading">
          <h2>Próximos eventos</h2>
        </div>
        <div className="community-grid">
          {demoEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
