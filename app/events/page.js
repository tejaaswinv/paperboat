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
        <h1>build live.<br /><em>leave a trail.</em></h1>
        <p className="page-lede">
          Most Paper Boats happen online. Open editions give you exactly 24 hours to build, launch and acquire users; finished editions turn into public archives showing the challenge topic, recap, builders and the products they shipped.
        </p>
        <div className="events-grid">
          {events.map((event) => <EventCard key={event.slug} event={event} />)}
        </div>
      </div>
    </section>
  );
}
