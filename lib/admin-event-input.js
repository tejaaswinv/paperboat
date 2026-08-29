function clean(value, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanList(value, maxItems = 30, maxLength = 240) {
  const list = Array.isArray(value) ? value : [];
  return list.map((item) => clean(item, maxLength)).filter(Boolean).slice(0, maxItems);
}

function cleanSchedule(value) {
  const list = Array.isArray(value) ? value : [];
  return list
    .map((item) => ({ time: clean(item?.time, 40), label: clean(item?.label, 300) }))
    .filter((item) => item.time || item.label)
    .slice(0, 40);
}

function cleanShowcase(value) {
  const list = Array.isArray(value) ? value : [];
  return list
    .map((item) => ({
      name: clean(item?.name, 120),
      project: clean(item?.project, 160),
      url: clean(item?.url, 500),
      outcome: clean(item?.outcome, 200),
    }))
    .filter((item) => item.name || item.project)
    .slice(0, 100);
}

export function slugify(value) {
  return clean(value, 100)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function normalizeEventInput(body, { existingSlug = "" } = {}) {
  const title = clean(body.title, 120);
  const slug = existingSlug || slugify(body.slug || title);
  const status = ["draft", "open", "past"].includes(body.status) ? body.status : "draft";
  const eventMode = ["online", "hybrid", "in-person"].includes(body.eventMode) ? body.eventMode : "online";
  const capacity = Math.max(0, Math.min(100000, Number(body.capacity) || 0));

  return {
    slug,
    number: clean(body.number, 10),
    title,
    eyebrow: clean(body.eyebrow || "paper boat event", 80),
    status,
    eventMode,
    startDate: clean(body.startDate, 20),
    date: clean(body.date || "Date dropping soon · 8 PM start", 120),
    dateShort: clean(body.dateShort || "24 hrs", 40),
    timezone: clean(body.timezone || "Asia/Singapore · GMT+8", 80),
    location: clean(body.location || (eventMode === "online" ? "Online · worldwide" : ""), 120),
    venue: clean(body.venue || (eventMode === "online" ? "Online build room · link sent to registered builders" : ""), 220),
    meetingUrl: clean(body.meetingUrl, 500),
    capacity,
    spotsLeft: body.spotsLeft === null || body.spotsLeft === "" ? capacity || null : Math.max(0, Number(body.spotsLeft) || 0),
    description: clean(body.description, 700),
    longDescription: clean(body.longDescription || body.description, 3000),
    topic: clean(body.topic, 300),
    recap: clean(body.recap, 4000),
    judging: cleanList(body.judging, 12, 300),
    prompts: cleanList(body.prompts, 30, 300),
    schedule: cleanSchedule(body.schedule),
    onlineGuide: cleanList(body.onlineGuide, 30, 500),
    offlineFlow: cleanSchedule(body.offlineFlow),
    showcase: cleanShowcase(body.showcase),
    tags: cleanList(body.tags, 20, 80),
    updatedAt: new Date().toISOString(),
  };
}
