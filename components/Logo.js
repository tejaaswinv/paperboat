import Link from "next/link";

export default function Logo({ compact = false }) {
  return (
    <Link href="/" className="brand" aria-label="Paper Boat home">
      <svg viewBox="0 0 72 46" aria-hidden="true" className="brand-boat">
        <path d="M5 21 35 5l30 16-9 18H16L5 21Z" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinejoin="round" />
        <path d="m5 21 30 9 30-9M35 5v25M16 39l19-9 21 9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        <strong>paper boat</strong>
        {!compact && <small>build. ship. float.</small>}
      </span>
    </Link>
  );
}
