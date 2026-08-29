const events = [
  {
    slug: "ship-something-weird",
    number: "001",
    title: "Ship Something Weird",
    eyebrow: "the next paper boat",
    status: "open",
    date: "Date dropping soon",
    dateShort: "24 hrs",
    location: "Singapore",
    venue: "Secret build room · revealed to confirmed builders",
    capacity: 60,
    spotsLeft: 27,
    description:
      "One room. One day. No pitch-deck theatre. Make an AI thing that makes you grin, then put it on the internet before the clock runs out.",
    longDescription:
      "Paper Boat is a tiny 24-hour build party for AI developers, designers, tinkerers, students, and people who keep making side projects at 2am. Come with an idea or steal one from the prompt wall. Build fast, ask strangers for help, ship something, demo it, go home with new friends.",
    prompts: [
      "make a tool your 12-year-old self would use",
      "replace one boring form with an agent",
      "build a terrible idea extremely well",
      "make the internet feel human again",
    ],
    schedule: [
      ["10:00", "doors open + chai + suspiciously ambitious ideas"],
      ["11:00", "24-hour clock starts"],
      ["14:00", "lunch + prompt swap"],
      ["19:30", "half-baked demos (optional, encouraged)"],
      ["00:00", "midnight maggi + bug confessions"],
      ["07:30", "breakfast + last-mile panic"],
      ["11:00", "ship. hands off keyboard."],
      ["11:30", "tiny demos, loud applause, zero judging"],
    ],
    tags: ["AI", "agents", "voice", "vision", "weird web", "hardware welcome"],
  },
  {
    slug: "hello-world",
    number: "000",
    title: "Hello, World",
    eyebrow: "the paper boat pilot",
    status: "past",
    date: "Pilot edition",
    dateShort: "shipped",
    location: "Singapore",
    venue: "A borrowed room + too much coffee",
    capacity: 24,
    spotsLeft: 0,
    description:
      "The messy little pilot where the rule was simple: if it can be demoed, it counts.",
    longDescription:
      "A tiny first run to test the format: small room, fast builds, no judging, no corporate keynote, and a demo circle at the end.",
    prompts: ["talk to a PDF", "make a tiny multiplayer toy", "build with one API you've never used"],
    schedule: [
      ["10:00", "hello"],
      ["11:00", "build"],
      ["11:00 +1", "ship"],
    ],
    tags: ["pilot", "AI", "weekend build"],
  },
];

export function getEvents() {
  return events;
}

export function getEvent(slug) {
  return events.find((event) => event.slug === slug);
}
