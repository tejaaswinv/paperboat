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
      "From 8 PM to 8 PM the next day: build a software product with AI, ship it, and get real people to use it before the 24-hour clock runs out.",
    longDescription:
      "Paper Boat is a 24-hour AI build-and-growth challenge for developers, designers, students and serial side-project starters. The clock starts at 8 PM and ends at 8 PM the next day. Use AI tools, agents, APIs, open models, no-code or anything else that helps you move fast. Your goal is not just to finish a prototype — it is to ship a working software product and pull in as many real users as you can during the same 24 hours. Projects are judged on how well the product actually works and the number of users it reaches before time is called.",
    judging: [
      "Functionality — does the product work, and how complete/useful is it?",
      "Traction — how many real users did you acquire within the 24-hour window?",
    ],
    prompts: [
      "make a tool your 12-year-old self would use",
      "replace one boring workflow with an agent",
      "build a terrible idea extremely well",
      "make the internet feel human again",
    ],
    schedule: [
      ["19:00", "doors open + check-in + chai"],
      ["20:00", "24-hour clock starts — build begins"],
      ["00:00", "midnight checkpoint + user-acquisition plans"],
      ["08:00 +1", "breakfast + keep building + keep growing"],
      ["16:00 +1", "final four-hour push"],
      ["20:00 +1", "ship. growth window closes. hands off keyboard."],
      ["20:15 +1", "demos + judging on functionality and users acquired"],
    ],
    tags: ["AI", "agents", "software", "growth", "ship in 24h", "real users"],
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
      "A tiny first run to test the format: small room, fast builds, no corporate keynote, and a demo circle at the end.",
    prompts: ["talk to a PDF", "make a tiny multiplayer toy", "build with one API you've never used"],
    schedule: [
      ["20:00", "hello + build starts"],
      ["20:00 +1", "ship"],
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
