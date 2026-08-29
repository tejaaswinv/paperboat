import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, getEvents } from "@/lib/events";

export function generateStaticParams() {
  return getEvents().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();
  const isOpen = event.status === "open";

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
              <div><dt>WHERE</dt><dd>{event.venue}</dd></div>
              <div><dt>FORMAT</dt><dd>24-hour build + tiny demos</dd></div>
              <div><dt>ROOM</dt><dd>{event.capacity} humans max</dd></div>
            </dl>
            <div className="ticket-barcode">|||| ||| || ||||| | ||||</div>
          </aside>
        </div>
      </section>

      <section className="section cream-section">
        <div className="shell detail-two-col">
          <div>
            <p className="eyebrow">the clock</p>
            <h2>24 hours, approximately.</h2>
            <div className="schedule-list">
              {event.schedule.map(([time, item]) => (
                <div key={`${time}-${item}`}><span>{time}</span><p>{item}</p></div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">if your brain is blank</p>
            <h2>steal a prompt.</h2>
            <div className="prompt-stack">
              {event.prompts.map((prompt, i) => <div className={`prompt-note p${i + 1}`} key={prompt}>“{prompt}”</div>)}
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <section className="section center final-cta">
          <div className="shell narrow">
            <p className="eyebrow">still reading?</p>
            <h2>You could have filled the form by now.</h2>
            <p className="big-copy">{event.spotsLeft} spots are shown in this starter build. Edit the event data when your real capacity is set.</p>
            <Link href={`/join/${event.slug}`} className="button button-big">fine, i'm joining →</Link>
          </div>
        </section>
      )}
    </>
  );
}
