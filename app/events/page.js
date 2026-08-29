import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/events";

export const metadata = { title: "Events" };

export default function EventsPage() {
  const events = getEvents();
  return (
    <section className="page-hero events-page">
      <div className="shell">
        <p className="eyebrow">paper boat events</p>
        <h1>tiny rooms.<br /><em>ridiculous ideas.</em></h1>
        <p className="page-lede">Each edition is 24-ish hours of making, borrowing chargers, asking for API keys, eating questionable midnight food, and actually shipping.</p>
        <div className="events-grid">
          {events.map((event) => <EventCard key={event.slug} event={event} />)}
        </div>
      </div>
    </section>
  );
}
