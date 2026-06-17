"use client";

import { useState } from "react";
import { CategoryFilter } from "../../../components/comunidade/CategoryFilter";
import { GroupCard } from "../../../components/comunidade/GroupCard";
import { communityCategories, demoGroups } from "../../../lib/community/demo";

export default function GruposPage() {
  const [categoria, setCategoria] = useState("");
  const groups = categoria ? demoGroups.filter((group) => group.category === categoria) : demoGroups;

  return (
    <main className="community-page">
      <section className="community-section">
        <div className="community-section-heading">
          <div>
            <p className="eyebrow">Grupos</p>
            <h1>Comunidades por destino e interesse</h1>
          </div>
          <a className="community-create-link" href="/comunidade/grupos/criar">Criar grupo</a>
        </div>
        <CategoryFilter categories={["Todos", ...communityCategories]} selected={categoria || "Todos"} onSelect={(value) => setCategoria(value === "Todos" ? "" : value)} />
        <div className="community-grid with-sidebar">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </section>
    </main>
  );
}
