import { notFound } from "next/navigation";
import RegistrationForm from "@/components/RegistrationForm";
import { getEvent, getEvents } from "@/lib/events";

export function generateStaticParams() {
  return getEvents().filter((event) => event.status === "open").map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = getEvent(slug);
  return { title: event ? `Join ${event.title}` : "Join" };
}

export default async function JoinPage({ params }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event || event.status !== "open") notFound();

  return (
    <section className="join-page">
      <div className="shell join-grid">
        <div className="join-copy">
          <p className="eyebrow">boarding paper boat #{event.number}</p>
          <h1>come make a thing.</h1>
          <p className="page-lede">This is a lightweight registration, not an application. We mainly need to know who to email and roughly how many extension boards to find.</p>
          <div className="join-summary">
            <div><span>◷</span><p><strong>{event.date}</strong><br />{event.dateShort} of building</p></div>
            <div><span>⌖</span><p><strong>{event.location}</strong><br />{event.venue}</p></div>
            <div><span>☺</span><p><strong>{event.capacity} max</strong><br />keep it small, keep it social</p></div>
          </div>
          <div className="join-doodle" aria-hidden="true">
            <span className="join-boat">△</span>
            <span className="join-wave">﹏﹏﹏﹏﹏</span>
          </div>
        </div>
        <RegistrationForm event={event} />
      </div>
    </section>
  );
}
