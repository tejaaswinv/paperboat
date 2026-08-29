import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET(request) {
  if (!verifyAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 });

  const snapshot = await db.collection("registrations").get();
  const registrations = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .slice(0, 500);

  return NextResponse.json({ registrations });
}
