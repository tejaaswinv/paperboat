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

  return (
    <section className="join-page">
      <div className="shell join-grid">
        <div className="join-copy">
          <p className="eyebrow">boarding paper boat #{event.number}</p>
          <h1>come make a thing.</h1>
          <p className="page-lede">
            Paper Boat is online-first. Register here and we will email you the build-room link and logistics. At 8 PM the clock starts; at 8 PM the next day building and user acquisition stop.
          </p>
          <div className="join-summary">
            <div><span>◷</span><p><strong>{event.date}</strong><br />8 PM → 8 PM +1 · demos until 9 PM</p></div>
            <div><span>⌖</span><p><strong>{event.location}</strong><br />{event.venue}</p></div>
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
