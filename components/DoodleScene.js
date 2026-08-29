export default function DoodleScene() {
  return (
    <div className="doodle-scene" aria-hidden="true">
      <svg viewBox="0 0 900 540" role="img">
        <defs>
          <filter id="roughen">
            <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" />
          </filter>
        </defs>
        <g filter="url(#roughen)" strokeLinecap="round" strokeLinejoin="round">
          <path className="sky-line" d="M34 95c26-37 63-37 90 0 13-19 36-20 50 0M708 68c27-35 62-35 87 0 13-16 36-17 52 2" />
          <path className="bird-line" d="M160 63q12-13 24 0 12-13 24 0M666 112q10-10 20 0 10-10 20 0" />
          <g transform="translate(110 226)">
            <rect x="0" y="0" width="252" height="152" rx="12" className="laptop" />
            <rect x="22" y="22" width="208" height="94" rx="5" className="screen" />
            <path className="code" d="M42 49h54M42 69h84M42 89h32M115 49l-12 20 12 20M137 49l12 20-12 20M166 89h42" />
            <path className="ink" d="M-18 152h290l-22 25H5l-23-25Z" />
            <circle cx="211" cy="136" r="5" className="sticker" />
            <path className="sticker-line" d="m188 129-7 12 14 1Z" />
          </g>
          <g transform="translate(450 310)">
            <path className="boat-fill" d="M0 30 116 0l118 30-35 65H34L0 30Z" />
            <path className="ink" d="m0 30 116 30 118-30M116 0v60M34 95l82-35 83 35" />
            <path className="flag" d="M116 0v-76l70 22-70 25" />
            <text x="128" y="-48" className="flag-text">SHIP IT</text>
          </g>
          <g transform="translate(594 175)">
            <circle cx="70" cy="70" r="57" className="sun" />
            <path className="ink face" d="M50 66q7 7 14 0M82 66q7 7 14 0M61 88q16 16 32 0" />
            <path className="ray" d="M70 0v-28M70 140v28M0 70h-28M140 70h28M20 20 1 1M120 20l19-19" />
          </g>
          <path className="wave" d="M-10 450q48-31 96 0t96 0q48-31 96 0t96 0q48-31 96 0t96 0q48-31 96 0t96 0q48-31 96 0" />
          <path className="wave wave-two" d="M-10 488q48-31 96 0t96 0q48-31 96 0t96 0q48-31 96 0t96 0q48-31 96 0t96 0q48-31 96 0" />
          <text x="60" y="190" className="scribble">no decks.</text>
          <text x="700" y="296" className="scribble">24h!</text>
        </g>
      </svg>
    </div>
  );
}
