import Link from "next/link";
import DoodleScene from "@/components/DoodleScene";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/events";

export default function Home() {
  const nextEvent = getEvents().find((event) => event.status === "open");

  return (
    <>
      <section className="hero paper-section">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="kicker"><span>24 hours</span> · one tiny idea · absolutely no pitch deck</p>
            <h1>build something.<br /><em>ship it before sleep.</em></h1>
            <p className="hero-lede">
              Paper Boat is a not-too-serious AI build party for developers, designers, students and serial side-project starters.
            </p>
            <div className="hero-actions">
              <Link href="/join/ship-something-weird" className="button button-big">join the next boat →</Link>
              <Link href="/events" className="scribble-link">peek at events</Link>
            </div>
            <div className="micro-proof">
              <span>☕ chai included</span>
              <span>⌁ beginners welcome</span>
              <span>↗ you must ship</span>
            </div>
          </div>
          <DoodleScene />
        </div>
        <div className="hero-rip" />
      </section>

      <section className="section why-section" id="how-it-works">
        <div className="shell narrow center">
          <p className="eyebrow">why are we doing this?</p>
          <h2>Because side projects were more fun before they needed a business model.</h2>
          <p className="big-copy">
            Remember making weird little things just to see if they worked? That. Except now we have foundation models, cheap APIs and much faster ways to break production.
          </p>
        </div>
        <div className="shell three-cards">
          <article className="story-card tilt-left">
            <span className="card-number">01</span>
            <div className="mini-doodle">⌁</div>
            <h3>arrive with curiosity</h3>
            <p>Bring an idea, a half-idea, or absolutely nothing. Prompt cards and accidental teammates are provided.</p>
          </article>
          <article className="story-card tilt-right">
            <span className="card-number">02</span>
            <div className="mini-doodle">⌨</div>
            <h3>make for 24 hours</h3>
            <p>Use whatever helps: agents, APIs, open models, no-code, cardboard, solder, duct tape. It only needs to work enough.</p>
          </article>
          <article className="story-card tilt-left-light">
            <span className="card-number">03</span>
            <div className="mini-doodle">↗</div>
            <h3>put it on the internet</h3>
            <p>No judging panel. The finish line is a URL, repo, APK, video, hardware demo, or something equally undeniable.</p>
          </article>
        </div>
      </section>

      <section className="section event-highlight">
        <div className="shell split-heading">
          <div>
            <p className="eyebrow">the next one</p>
            <h2>get in the boat.</h2>
          </div>
          <p className="margin-note">small rooms &gt; giant conferences</p>
        </div>
        <div className="shell event-single">
          <EventCard event={nextEvent} />
        </div>
      </section>

      <section className="section rules-section" id="rules">
        <div className="shell rules-grid">
          <div className="rules-art" aria-hidden="true">
            <div className="moon">:)</div>
            <div className="paper-plane">➤</div>
            <div className="coffee">☕</div>
            <div className="dotted-path" />
          </div>
          <div>
            <p className="eyebrow">the non-rules</p>
            <h2>please do not make this feel like work.</h2>
            <ul className="rules-list">
              <li><span>01</span><p><strong>new builds only-ish.</strong> A forgotten repo, abandoned prototype, or fresh branch is fine. Just make meaningful new stuff here.</p></li>
              <li><span>02</span><p><strong>use AI shamelessly.</strong> This is not an exam. Use copilots, agents, generated UI, models, APIs and each other.</p></li>
              <li><span>03</span><p><strong>help people.</strong> If someone is stuck on the thing you know, unstick them. You can go back to your bug after.</p></li>
              <li><span>04</span><p><strong>ship something.</strong> Tiny and alive beats giant and “almost done.”</p></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="shell center narrow">
          <div className="tiny-boat">△</div>
          <p className="eyebrow">okay then</p>
          <h2>What would you make if nobody asked for a roadmap?</h2>
          <Link href="/join/ship-something-weird" className="button button-big">come build it →</Link>
        </div>
      </section>
    </>
  );
}
