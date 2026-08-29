import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/events";

export const metadata = { title: "Events" };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = (await getEvents()).filter((event) => event.status !== "draft");

  return (
    <section className="page-hero events-page">
      <div className="shell">
        <p className="eyebrow">paper boat events</p>
        <h1>one internet.<br /><em>ridiculous ideas.</em></h1>
        <p className="page-lede">
          Paper Boat is online-first. Each edition gives you exactly 24 hours to build and grow a software product: 8 PM to 8 PM the next day, followed by one hour of demos, judging and results.
        </p>
        <div className="events-grid">
          {events.map((event) => <EventCard key={event.slug} event={event} />)}
        </div>
      </div>
    </section>
  );
}
