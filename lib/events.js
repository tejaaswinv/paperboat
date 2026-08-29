import { defaultEvents } from "@/lib/default-events";
import { getAdminDb } from "@/lib/firebase-admin";

function plainEvent(slug, data) {
  const schedule = Array.isArray(data.schedule)
    ? data.schedule.map((item) =>
        Array.isArray(item)
          ? { time: String(item[0] || ""), label: String(item[1] || "") }
          : { time: String(item?.time || ""), label: String(item?.label || "") }
      )
    : [];

  const offlineFlow = Array.isArray(data.offlineFlow)
    ? data.offlineFlow.map((item) => ({
        time: String(item?.time || ""),
        label: String(item?.label || ""),
      }))
    : [];

  const showcase = Array.isArray(data.showcase)
    ? data.showcase.map((item) => ({
        name: String(item?.name || ""),
        project: String(item?.project || ""),
        url: String(item?.url || ""),
        outcome: String(item?.outcome || ""),
      }))
    : [];

  return {
    slug,
    number: String(data.number || "000"),
    title: String(data.title || "Untitled event"),
    eyebrow: String(data.eyebrow || "paper boat event"),
    status: String(data.status || "draft"),
    eventMode: String(data.eventMode || "online"),
    startDate: String(data.startDate || ""),
    date: String(data.date || "Date dropping soon"),
    dateShort: String(data.dateShort || "24 hrs"),
    timezone: String(data.timezone || "Asia/Singapore · GMT+8"),
    location: String(data.location || "Online"),
    venue: String(data.venue || "Online build room"),
    meetingUrl: String(data.meetingUrl || ""),
    capacity: Number(data.capacity || 0),
    spotsLeft:
      data.spotsLeft === null || data.spotsLeft === undefined
        ? null
        : Number(data.spotsLeft),
    description: String(data.description || ""),
    longDescription: String(data.longDescription || data.description || ""),
    topic: String(data.topic || ""),
    recap: String(data.recap || ""),
    judging: Array.isArray(data.judging) ? data.judging.map(String) : [],
    prompts: Array.isArray(data.prompts) ? data.prompts.map(String) : [],
    schedule,
    onlineGuide: Array.isArray(data.onlineGuide) ? data.onlineGuide.map(String) : [],
    offlineFlow,
    showcase,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

async function seedDefaultsOnce(db) {
  const markerRef = db.collection("_paperboat").doc("bootstrap");
  const marker = await markerRef.get();
  if (marker.exists) return;

  const existing = await db.collection("events").limit(1).get();
  const batch = db.batch();

  if (existing.empty) {
    for (const event of defaultEvents) {
      batch.set(db.collection("events").doc(event.slug), {
        ...event,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  batch.set(markerRef, {
    seeded: true,
    seededAt: new Date().toISOString(),
  });

  await batch.commit();
}

export async function getEvents() {
  const db = getAdminDb();
  if (!db) return defaultEvents;

  await seedDefaultsOnce(db);
  const snapshot = await db.collection("events").get();

  return snapshot.docs
    .map((doc) => plainEvent(doc.id, doc.data()))
    .sort((a, b) => {
      if (a.status === "open" && b.status !== "open") return -1;
      if (b.status === "open" && a.status !== "open") return 1;
      if (a.startDate && b.startDate) return a.startDate.localeCompare(b.startDate);
      return a.number.localeCompare(b.number);
    });
}

export async function getEvent(slug) {
  const db = getAdminDb();
  if (!db) return defaultEvents.find((event) => event.slug === slug);

  await seedDefaultsOnce(db);
  const doc = await db.collection("events").doc(slug).get();
  if (!doc.exists) return undefined;
  return plainEvent(doc.id, doc.data());
}
