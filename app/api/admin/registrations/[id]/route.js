import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function DELETE(request, { params }) {
  if (!verifyAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 });

  const { id } = await params;
  await db.collection("registrations").doc(id).delete();
  return NextResponse.json({ ok: true });
}
