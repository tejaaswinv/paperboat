import Image from "next/image";

export default function DoodleScene() {
  return (
    <div className="doodle-scene">
      <Image
        src="/paperboat-hero.png"
        alt="Paper Boat AI build challenge illustration with a laptop sailing in a paper boat"
        width={900}
        height={536}
        priority
        unoptimized
        sizes="(max-width: 800px) 100vw, 55vw"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </div>
  );
}
