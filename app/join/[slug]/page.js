import { notFound } from "next/navigation";
import RegistrationForm from "@/components/RegistrationForm";
import { getEvent } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  return { title: event ? `Join ${event.title}` : "Join" };
}

export default async function JoinPage({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event || event.status !== "open") notFound();

  const isOnline = event.eventMode === "online";
  const isHybrid = event.eventMode === "hybrid";
  const modeLabel = isOnline ? "online" : isHybrid ? "hybrid" : "offline / in person";
  const logisticsCopy = isOnline
    ? "Register here and we’ll email the private online build-room link and final logistics."
    : isHybrid
      ? "Register here and we’ll email the online room plus physical venue/check-in logistics."
      : "Register here and we’ll email the venue, check-in details and anything you need for the overnight build.";

  return (
    <section className="join-page">
      <div className="shell join-grid">
        <div className="join-copy">
          <p className="eyebrow">boarding paper boat #{event.number} · {modeLabel}</p>
          <h1>come make a thing.</h1>
          <p className="page-lede">
            {logisticsCopy} At 8 PM the clock starts; at 8 PM the next day building and user acquisition stop. Demos and results run from 8–9 PM.
          </p>
          <div className="join-summary">
            <div><span>◷</span><p><strong>{event.date}</strong><br />8 PM → 8 PM +1 · demos until 9 PM</p></div>
            <div><span>⌖</span><p><strong>{event.location}</strong><br />{isOnline ? "online room · private link by email" : event.venue}</p></div>
            <div><span>↗</span><p><strong>functionality + users</strong><br />build it, ship it, grow it</p></div>
          </div>
          <div className="join-doodle" aria-hidden="true">
            <span className="join-boat">△</span>
            <span className="join-wave">﹏﹏﹏﹏﹏</span>
          </div>
        </div>
        <RegistrationForm event={{ slug: event.slug }} />
      </div>
    </section>
  );
}
