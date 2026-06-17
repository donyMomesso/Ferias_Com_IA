import Link from "next/link";
import type { CommunityGroupCard } from "../../lib/community/types";

export function GroupCard({ group }: { group: CommunityGroupCard }) {
  return (
    <article className="community-card">
      <div
        className="community-card-media"
        style={{
          backgroundImage: `url(${group.coverImage || "https://picsum.photos/seed/community-group/900/520"})`
        }}
      />
      <div className="community-card-body">
        <span className="community-pill">{group.category}</span>
        <h3>{group.name}</h3>
        <p>{group.description}</p>
        <div className="community-meta">
          <span>{group.city}{group.state ? ` - ${group.state}` : ""}</span>
          <span>{group.memberCount} membros</span>
        </div>
        {group.nextEvent && (
          <p className="community-next">
            Próximo: {group.nextEvent.title}
          </p>
        )}
        <Link className="community-link" href={`/comunidade/grupos/${group.id}`}>
          Ver grupo
        </Link>
      </div>
    </article>
  );
}
