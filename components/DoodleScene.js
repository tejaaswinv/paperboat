import Image from "next/image";

export default function DoodleScene() {
  return (
    <div
      className="doodle-scene"
      style={{
        width: "100%",
        maxWidth: 610,
        justifySelf: "end",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src="/paperboat-hero.png"
        alt="Paper Boat AI build challenge illustration with a laptop sailing in a paper boat"
        width={1088}
        height={648}
        priority
        unoptimized
        sizes="(max-width: 800px) 92vw, 610px"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
          imageRendering: "auto",
        }}
      />
    </div>
  );
}
