import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";

const CHUNKS = [
  "c000.txt",
  "c001.txt",
  "c01.txt",
  "c02.txt",
  "c1.txt",
  "c2.txt",
  "c3.txt",
  "c4.txt",
  "c5.txt",
];

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;

  try {
    const parts = await Promise.all(
      CHUNKS.map(async (file) => {
        const response = await fetch(`${origin}/rules-final2/${file}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load rules artwork chunk: ${file}`);
        }

        return (await response.text()).trim();
      })
    );

    const scanlineRepeat = "WLVq0aNGiRYs";
    const firstPart = parts[0].replace(
      "O3t6iRYs",
      `O3t6iRYs${scanlineRepeat.repeat(3)}`
    );

    const fixedParts = [firstPart, ...parts.slice(1)];
    const base64 = fixedParts.join("");
    const image = Buffer.from(base64, "base64");

    if (url.searchParams.get("debug") === "1") {
      return Response.json({
        chunks: CHUNKS.map((file, index) => ({
          file,
          originalLength: parts[index].length,
          finalLength: fixedParts[index].length,
          sha256: sha256(fixedParts[index]),
        })),
        base64Length: base64.length,
        base64Sha256: sha256(base64),
        imageLength: image.length,
        imageSha256: sha256(image),
      });
    }

    return new Response(image, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(image.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Unable to build Paper Boat rules artwork", error);
    return new Response("Rules artwork unavailable", { status: 500 });
  }
}
