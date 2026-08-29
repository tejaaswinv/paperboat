import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event || event.status === "draft") return {};
  return { title: event.title, description: event.description };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event || event.status === "draft") notFound();

  const isOpen = event.status === "open";
  const isOnline = event.eventMode === "online";

  return (
    <>
      <section className="event-detail-hero">
        <div className="shell event-detail-grid">
          <div>
            <p className="eyebrow">paper boat #{event.number} · {event.location}</p>
            <h1>{event.title}</h1>
            <p className="page-lede">{event.longDescription}</p>
            <div className="tag-row">{event.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            {isOpen && <Link href={`/join/${event.slug}`} className="button button-big">join this event →</Link>}
          </div>
          <aside className="event-ticket">
            <div className="ticket-notch notch-one" />
            <div className="ticket-notch notch-two" />
            <p className="ticket-label">boarding card</p>
            <strong>PB / {event.number}</strong>
            <dl>
              <div><dt>WHEN</dt><dd>{event.date}</dd></div>
              <div><dt>TIMEZONE</dt><dd>{event.timezone}</dd></div>
              <div><dt>WHERE</dt><dd>{isOnline ? "Online" : event.venue}</dd></div>
              <div><dt>FORMAT</dt><dd>24h build + growth · 1h demos</dd></div>
            </dl>
            <div className="ticket-barcode">|||| ||| || ||||| | ||||</div>
          </aside>
        </div>
      </section>

      <section className="section cream-section">
        <div className="shell detail-two-col">
          <div>
            <p className="eyebrow">the clock</p>
            <h2>24 hours. exactly.</h2>
            <div className="schedule-list">
              {event.schedule.map((item) => (
                <div key={`${item.time}-${item.label}`}>
                  <span>{item.time}</span>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">how you win</p>
            <h2>working product. real users.</h2>
            <div className="prompt-stack">
              {(event.judging.length ? event.judging : event.prompts).map((item, i) => (
                <div className={`prompt-note p${(i % 4) + 1}`} key={item}>“{item}”</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <section className="section center final-cta">
          <div className="shell narrow">
            <p className="eyebrow">still reading?</p>
            <h2>Your 24 hours have not started yet.</h2>
            <p className="big-copy">
              Register now. The online room link and final event logistics will be sent to confirmed builders.
            </p>
            <Link href={`/join/${event.slug}`} className="button button-big">fine, i'm joining →</Link>
          </div>
        </section>
      )}
    </>
  );
}
