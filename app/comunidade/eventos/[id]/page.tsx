import { RSVPButton } from "../../../../components/comunidade/RSVPButton";
import { demoEvents } from "../../../../lib/community/demo";

export default async function EventoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = demoEvents.find((item) => item.id === id) || demoEvents[0];

  return (
    <main className="community-page">
      <section className="community-detail-hero" style={{ backgroundImage: `url(${event.coverImage})` }}>
        <div>
          <span className="community-pill">{event.group.category}</span>
          <h1>{event.title}</h1>
          <p>{new Date(event.date).toLocaleString("pt-BR")} · {event.location || "Online"}</p>
          <RSVPButton eventId={event.id} />
        </div>
      </section>
      <section className="community-section community-event-layout">
        <article>
          <h2>Sobre o evento</h2>
          <p className="community-copy">{event.description}</p>
        </article>
        <aside className="community-sidebox">
          <h3>Grupo organizador</h3>
          <p>{event.group.name}</p>
          <p>{event.rsvpCount} pessoas confirmadas</p>
          <p>{event.price === 0 ? "Gratuito" : event.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
        </aside>
      </section>
    </main>
  );
}
