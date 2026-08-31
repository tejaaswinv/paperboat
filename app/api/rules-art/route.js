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

export async function GET(request) {
  const origin = new URL(request.url).origin;

  try {
    const parts = await Promise.all(
      CHUNKS.map(async (file) => {
        const response = await fetch(`${origin}/rules-final2/${file}`, {
          cache: "force-cache",
        });

        if (!response.ok) {
          throw new Error(`Failed to load rules artwork chunk: ${file}`);
        }

        return (await response.text()).trim();
      })
    );

    // The first stored chunk contains a long repeated PNG scanline sequence.
    // GitHub's text transport collapsed three identical 12-character repeats
    // while the rest of the PNG payload was preserved. Restore those bytes
    // server-side before decoding so the browser always receives one valid PNG.
    const scanlineRepeat = "WLVq0aNGiRYs";
    const firstPart = parts[0].replace(
      "O3t6iRYs",
      `O3t6iRYs${scanlineRepeat.repeat(3)}`
    );

    const base64 = [firstPart, ...parts.slice(1)].join("");
    const image = Buffer.from(base64, "base64");

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
