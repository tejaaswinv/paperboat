import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-auth";
import { normalizeEventInput } from "@/lib/admin-event-input";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

function authorized(request) {
  return verifyAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value);
}

export async function PUT(request, { params }) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 });

  const { slug } = await params;
  const ref = db.collection("events").doc(slug);
  const existing = await ref.get();
  if (!existing.exists) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const event = normalizeEventInput(await request.json(), { existingSlug: slug });
  if (!event.title) return NextResponse.json({ error: "Event title is required." }, { status: 400 });
  if (event.status === "open" && !event.startDate) {
    return NextResponse.json({ error: "Choose a start date before opening registration." }, { status: 400 });
  }

  await ref.set({
    ...event,
    createdAt: existing.data().createdAt || new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, event });
}

export async function DELETE(request, { params }) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 });

  const { slug } = await params;
  await db.collection("events").doc(slug).delete();
  return NextResponse.json({ ok: true });
}
