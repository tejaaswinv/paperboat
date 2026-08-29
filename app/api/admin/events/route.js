import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-auth";
import { normalizeEventInput } from "@/lib/admin-event-input";
import { getAdminDb } from "@/lib/firebase-admin";
import { getEvents } from "@/lib/events";

export const runtime = "nodejs";

function authorized(request) {
  return verifyAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value);
}

export async function GET(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const events = await getEvents();
  return NextResponse.json({ events });
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 });
  }

  const body = await request.json();
  const existingEvents = await getEvents();
  const maxNumber = existingEvents.reduce(
    (max, event) => Math.max(max, Number.parseInt(event.number, 10) || 0),
    0
  );

  const event = normalizeEventInput({
    ...body,
    number: body.number || String(maxNumber + 1).padStart(3, "0"),
  });

  if (!event.title || !event.slug) {
    return NextResponse.json({ error: "Event title and slug are required." }, { status: 400 });
  }
  if (event.status === "open" && !event.startDate) {
    return NextResponse.json({ error: "Choose a start date before opening registration." }, { status: 400 });
  }

  const ref = db.collection("events").doc(event.slug);
  const existing = await ref.get();
  if (existing.exists) {
    return NextResponse.json({ error: "An event with that slug already exists." }, { status: 409 });
  }

  await ref.set({ ...event, createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, event });
}
