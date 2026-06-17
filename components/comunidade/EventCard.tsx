import Link from "next/link";
import type { CommunityEventCard } from "../../lib/community/types";

export function EventCard({ event }: { event: CommunityEventCard }) {
  return (
    <article className="community-card">
      <div
        className="community-card-media"
        style={{
          backgroundImage: `url(${event.coverImage || "https://picsum.photos/seed/community-event/900/520"})`
        }}
      />
      <div className="community-card-body">
        <span className="community-pill">{event.group.category}</span>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="community-meta">
          <span>{new Date(event.date).toLocaleDateString("pt-BR")}</span>
          <span>{event.price === 0 ? "Gratuito" : event.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        </div>
        <p className="community-next">
          {event.isOnline ? "Online" : event.location || event.group.city} · {event.rsvpCount} vão
        </p>
        <Link className="community-link" href={`/comunidade/eventos/${event.id}`}>
          Ver evento
        </Link>
      </div>
    </article>
  );
}
