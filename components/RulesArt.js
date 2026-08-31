export default function RulesArt() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "-8px",
        zIndex: 2,
        display: "grid",
        placeItems: "center",
        background: "#eaf7f8",
        overflow: "visible",
      }}
    >
      <img
        src="/paperboat-rules-cycle.png?v=layout-v2"
        alt="Paper Boat 24-hour AI challenge cycle with a 24h clock, AI coding laptop, paper boat, coffee cup, users, and functionality plus traction judging"
        width="900"
        height="900"
        loading="lazy"
        decoding="async"
        className="rules-art-image"
        style={{
          width: "min(122%, 520px)",
          maxWidth: "none",
          height: "auto",
          display: "block",
        }}
      />
    </div>
  );
}
