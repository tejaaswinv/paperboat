import Link from "next/link";

export default function EventCard({ event }) {
  const isOpen = event.status === "open";
  const isPast = event.status === "past";
  const modeLabel = event.eventMode === "online" ? "online" : event.eventMode === "hybrid" ? "hybrid" : "offline";

  return (
    <article className={`event-card ${isOpen ? "event-open" : "event-past"}`}>
      <div className="event-card-top">
        <span className="event-number">#{event.number}</span>
        <span className={`status-pill ${isOpen ? "open" : "past"}`}>{isOpen ? "joining now" : "shipped"}</span>
      </div>
      <p className="eyebrow">{event.eyebrow}</p>
      <h3>{event.title}</h3>
      {isPast && event.topic && <p><strong>Topic:</strong> {event.topic}</p>}
      <p className="event-card-copy">{isPast && event.recap ? event.recap : event.description}</p>
      <div className="event-meta">
        <span>◷ {event.date}</span>
        <span>⌖ {modeLabel}</span>
        {isPast && event.showcase?.length > 0 && <span>↗ {event.showcase.length} shipped projects</span>}
      </div>
      <div className="event-card-actions">
        <Link href={`/events/${event.slug}`} className="text-link">{isPast ? "see the archive →" : "event details →"}</Link>
        {isOpen && <Link href={`/join/${event.slug}`} className="button button-small">join this boat</Link>}
      </div>
    </article>
  );
}
