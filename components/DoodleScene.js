import Image from "next/image";

export default function DoodleScene() {
  return (
    <div
      className="doodle-scene"
      style={{
        width: "100%",
        maxWidth: 640,
        aspectRatio: "1.68 / 1",
        justifySelf: "end",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Image
        src="/paperboat-hero.png"
        alt="Paper Boat AI build challenge illustration with a laptop sailing in a paper boat"
        width={2048}
        height={1024}
        priority
        unoptimized
        sizes="(max-width: 800px) 94vw, 640px"
        style={{
          position: "absolute",
          width: "188%",
          maxWidth: "none",
          height: "auto",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -52%)",
          display: "block",
          imageRendering: "auto",
        }}
      />
    </div>
  );
}
