import { EventCard } from "../../../../components/comunidade/EventCard";
import { demoEvents, demoGroups } from "../../../../lib/community/demo";

export default async function GrupoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = demoGroups.find((item) => item.id === id) || demoGroups[0];
  const events = demoEvents.filter((event) => event.group.id === group.id);

  return (
    <main className="community-page">
      <section className="community-detail-hero" style={{ backgroundImage: `url(${group.coverImage})` }}>
        <div>
          <span className="community-pill">{group.category}</span>
          <h1>{group.name}</h1>
          <p>{group.city}{group.state ? ` - ${group.state}` : ""} · {group.memberCount} membros</p>
          <button className="community-create-link">Participar do grupo</button>
        </div>
      </section>
      <section className="community-section">
        <h2>Sobre o grupo</h2>
        <p className="community-copy">{group.description}</p>
      </section>
      <section className="community-section">
        <h2>Eventos</h2>
        <div className="community-grid">
          {events.length ? events.map((event) => <EventCard key={event.id} event={event} />) : <p>Nenhum evento cadastrado ainda.</p>}
        </div>
      </section>
    </main>
  );
}
