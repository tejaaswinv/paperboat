import Image from "next/image";

export default function DoodleScene() {
  return (
    <div className="doodle-scene">
      <Image
        src="/paperboat-hero.webp"
        alt="Paper Boat AI build challenge illustration with a laptop sailing in a paper boat"
        width={600}
        height={450}
        priority
        sizes="(max-width: 800px) 100vw, 55vw"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </div>
  );
}
