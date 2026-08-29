import Link from "next/link";

export default function EventCard({ event }) {
  const isOpen = event.status === "open";
  return (
    <article className={`event-card ${isOpen ? "event-open" : "event-past"}`}>
      <div className="event-card-top">
        <span className="event-number">#{event.number}</span>
        <span className={`status-pill ${isOpen ? "open" : "past"}`}>{isOpen ? "joining now" : "shipped"}</span>
      </div>
      <p className="eyebrow">{event.eyebrow}</p>
      <h3>{event.title}</h3>
      <p className="event-card-copy">{event.description}</p>
      <div className="event-meta">
        <span>◷ {event.date}</span>
        <span>⌖ {event.location}</span>
      </div>
      <div className="event-card-actions">
        <Link href={`/events/${event.slug}`} className="text-link">event details →</Link>
        {isOpen && <Link href={`/join/${event.slug}`} className="button button-small">join this boat</Link>}
      </div>
    </article>
  );
}
