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
  const isPast = event.status === "past";
  const isOnline = event.eventMode === "online";
  const isHybrid = event.eventMode === "hybrid";
  const modeLabel = isOnline ? "Online" : isHybrid ? "Hybrid" : "Offline / in person";
  const modeGuide = isOnline ? event.onlineGuide : isHybrid ? event.onlineGuide : [];
  const physicalFlow = !isOnline ? event.offlineFlow : [];

  return (
    <>
      <section className="event-detail-hero">
        <div className="shell event-detail-grid">
          <div>
            <p className="eyebrow">paper boat #{event.number} · {modeLabel}</p>
            <h1>{event.title}</h1>
            <p className="page-lede">{event.longDescription}</p>
            {event.topic && <p className="big-copy"><strong>Challenge:</strong> {event.topic}</p>}
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
              <div><dt>MODE</dt><dd>{modeLabel}</dd></div>
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
            {isOnline ? (
              <>
                <p className="eyebrow">online survival guide</p>
                <h2>build early. share early.</h2>
                <div className="prompt-stack">
                  {(modeGuide.length ? modeGuide : event.judging).map((item, i) => (
                    <div className={`prompt-note p${(i % 4) + 1}`} key={item}>“{item}”</div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="eyebrow">offline flow</p>
                <h2>what happens in the room.</h2>
                {physicalFlow.length ? (
                  <div className="schedule-list">
                    {physicalFlow.map((item) => (
                      <div key={`${item.time}-${item.label}`}>
                        <span>{item.time}</span>
                        <p>{item.label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="prompt-stack">
                    {event.judging.map((item, i) => (
                      <div className={`prompt-note p${(i % 4) + 1}`} key={item}>“{item}”</div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {!isOnline && isHybrid && event.onlineGuide.length > 0 && (
        <section className="section why-section">
          <div className="shell narrow center">
            <p className="eyebrow">joining remotely?</p>
            <h2>the online workflow still applies.</h2>
          </div>
          <div className="shell three-cards">
            {event.onlineGuide.slice(0, 3).map((tip, i) => (
              <article className="story-card" key={tip}>
                <span className="card-number">0{i + 1}</span>
                <h3>remote tip</h3>
                <p>{tip}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {isPast && (
        <section className="section why-section">
          <div className="shell narrow center">
            <p className="eyebrow">after the boat came back</p>
            <h2>{event.topic || "what this edition was about"}</h2>
            <p className="big-copy">{event.recap || "The organizer has not published the full recap yet."}</p>
          </div>

          <div className="shell" style={{ marginTop: 60 }}>
            <p className="eyebrow">builders + what they shipped</p>
            {event.showcase.length ? (
              <div className="three-cards">
                {event.showcase.map((item, i) => (
                  <article className="story-card" key={`${item.name}-${item.project}-${i}`}>
                    <span className="card-number">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{item.project || "shipped project"}</h3>
                    <p><strong>{item.name || "Paper Boat builder"}</strong></p>
                    {item.outcome && <p>{item.outcome}</p>}
                    {item.url && <a href={item.url} className="text-link" target="_blank" rel="noreferrer">open the shipped product ↗</a>}
                  </article>
                ))}
              </div>
            ) : (
              <p className="big-copy">Participant and shipped-project details will appear here once the organizer publishes the event archive.</p>
            )}
          </div>
        </section>
      )}

      {isOpen && (
        <section className="section center final-cta">
          <div className="shell narrow">
            <p className="eyebrow">still reading?</p>
            <h2>Your 24 hours have not started yet.</h2>
            <p className="big-copy">
              Register now. {isOnline ? "The online room link" : "Final venue logistics"} will be sent to confirmed builders.
            </p>
            <Link href={`/join/${event.slug}`} className="button button-big">fine, i'm joining →</Link>
          </div>
        </section>
      )}
    </>
  );
}
