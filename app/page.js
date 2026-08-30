import Image from "next/image";
import Link from "next/link";
import DoodleScene from "@/components/DoodleScene";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await getEvents();
  const nextEvent = events.find((event) => event.status === "open");

  return (
    <>
      <section className="hero paper-section">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="kicker"><span>24 hours</span> · build it · ship it · grow it</p>
            <h1 style={{ lineHeight: ".96" }}>build something.<br /><em>get people using it.</em></h1>
            <p className="hero-lede">
              Paper Boat is an online-first AI build-and-growth challenge: start at 8 PM, ship a real software product by 8 PM the next day, and pull in as many users as you can before the clock stops.
            </p>
            <div className="hero-actions">
              {nextEvent ? (
                <Link href={`/join/${nextEvent.slug}`} className="button button-big">join the next boat →</Link>
              ) : (
                <Link href="/events" className="button button-big">see upcoming boats →</Link>
              )}
              <Link href="/events" className="scribble-link">peek at events</Link>
            </div>
            <div className="micro-proof">
              <span>⚡ AI tools encouraged</span>
              <span>⌁ online-first · exactly 24 hours</span>
              <span>↗ functionality + users win</span>
            </div>
          </div>
          <DoodleScene />
        </div>
        <div className="hero-rip" />
      </section>

      <section className="section why-section" id="how-it-works">
        <div className="shell narrow center">
          <p className="eyebrow">why are we doing this?</p>
          <h2>Because building is only half the fun. Shipping and finding users is the other half.</h2>
          <p className="big-copy">
            Join from wherever you are. You get one night and one day to turn an idea into a working software product. Use AI agents, APIs, open models, no-code or anything else that helps. Then put it in front of real people and see if they actually use it.
          </p>
        </div>
        <div className="shell three-cards">
          <article className="story-card tilt-left">
            <span className="card-number">01</span>
            <div className="mini-doodle">⌁</div>
            <h3>8 PM — start</h3>
            <p>The online room opens, the clock begins, and you start building. Solo or team is fine.</p>
          </article>
          <article className="story-card tilt-right">
            <span className="card-number">02</span>
            <div className="mini-doodle">⌨</div>
            <h3>build + launch</h3>
            <p>Use AI shamelessly. Get the software working, deploy it, and start finding real users while the clock is still running.</p>
          </article>
          <article className="story-card tilt-left-light">
            <span className="card-number">03</span>
            <div className="mini-doodle">↗</div>
            <h3>8 PM +1 — stop</h3>
            <p>Exactly 24 hours later, building and growth stop. From 8–9 PM, products are demoed and judged on functionality and users acquired.</p>
          </article>
        </div>
      </section>

      {nextEvent && (
        <section className="section event-highlight">
          <div className="shell split-heading">
            <div>
              <p className="eyebrow">the next one</p>
              <h2>get in the boat.</h2>
            </div>
            <p className="margin-note">online-first · 24 hours · real users</p>
          </div>
          <div className="shell event-single">
            <EventCard event={nextEvent} />
          </div>
        </section>
      )}

      <section className="section rules-section" id="rules">
        <div className="shell rules-grid">
          <div className="rules-art">
            <Image
              src="/paperboat-rules-cycle.png"
              alt="Paper Boat 24-hour AI build, ship and grow challenge cycle"
              width={900}
              height={900}
              unoptimized
              sizes="(max-width: 900px) 88vw, 520px"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <div>
            <p className="eyebrow">the rules</p>
            <h2>build fast. launch faster. make people care.</h2>
            <ul className="rules-list">
              <li><span>01</span><p><strong>the clock is real.</strong> The challenge starts at 8 PM and ends at 8 PM the following day — exactly 24 hours.</p></li>
              <li><span>02</span><p><strong>use AI shamelessly.</strong> Agents, copilots, generated UI, APIs, open models, no-code — anything that helps you build a better product faster.</p></li>
              <li><span>03</span><p><strong>get real users.</strong> Do not stop at localhost. Deploy it, share it, sell it, post it, DM it — get people genuinely using the product during the challenge.</p></li>
              <li><span>04</span><p><strong>functionality + traction.</strong> Judging is based on how well the product works and how many users you acquire inside the 24-hour window.</p></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="shell center narrow">
          <div className="tiny-boat">△</div>
          <p className="eyebrow">okay then</p>
          <h2>Can you go from zero to working product to real users in one day?</h2>
          {nextEvent && <Link href={`/join/${nextEvent.slug}`} className="button button-big">come build it →</Link>}
        </div>
      </section>
    </>
  );
}
