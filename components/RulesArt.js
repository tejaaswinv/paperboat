"use client";

import { useEffect, useState } from "react";

const PARTS = Array.from({ length: 11 }, (_, index) =>
  `/rules-data/p${String(index).padStart(2, "0")}.txt?v=coffee-final`
);

export default function RulesArt() {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      try {
        const parts = await Promise.all(
          PARTS.map(async (url) => {
            const response = await fetch(url, { cache: "no-store" });
            if (!response.ok) throw new Error(`Could not load ${url}`);
            return (await response.text()).trim();
          })
        );

        if (!cancelled) {
          setSrc(`data:image/png;base64,${parts.join("")}`);
        }
      } catch (error) {
        console.error("Failed to load Paper Boat rules illustration", error);
      }
    }

    loadImage();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!src) {
    return <div style={{ width: "100%", aspectRatio: "1 / 1" }} aria-hidden="true" />;
  }

  return (
    <img
      src={src}
      alt="Paper Boat 24-hour AI challenge cycle with a 24h clock, AI coding laptop, paper boat, coffee cup, users, and functionality plus traction judging"
      width="900"
      height="900"
      loading="lazy"
      decoding="async"
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}
