"use client";

import { useState } from "react";

type RSVPStatus = "YES" | "NO" | "WAITLIST";

export function RSVPButton({
  eventId,
  userId = "demo-user"
}: {
  eventId: string;
  userId?: string;
}) {
  const [status, setStatus] = useState<RSVPStatus | null>(null);
  const [loading, setLoading] = useState(false);

  async function send(nextStatus: RSVPStatus) {
    setLoading(true);
    try {
      await fetch(`/api/eventos/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: nextStatus })
      });
      setStatus(nextStatus);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rsvp-actions">
      <button disabled={loading} className={status === "YES" ? "active" : ""} onClick={() => send("YES")}>
        Vou
      </button>
      <button disabled={loading} className={status === "NO" ? "active" : ""} onClick={() => send("NO")}>
        Não vou
      </button>
      <button disabled={loading} className={status === "WAITLIST" ? "active" : ""} onClick={() => send("WAITLIST")}>
        Espera
      </button>
    </div>
  );
}
