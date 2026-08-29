import Link from "next/link";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/events">events</Link>
          <a href="/#how-it-works">how it works</a>
          <a href="/#rules">the non-rules</a>
          <Link href="/join/ship-something-weird" className="nav-cta">join the next one →</Link>
        </nav>
      </div>
    </header>
  );
}
