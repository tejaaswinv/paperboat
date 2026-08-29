import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getEvent } from "@/lib/events";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 1000)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 160;
}

function makeRegistrationId(eventNumber) {
  const suffix = crypto.randomUUID().split("-")[0].toUpperCase();
  return `PB${eventNumber}-${suffix}`;
}

function registrationDocId(eventSlug, email) {
  return crypto.createHash("sha256").update(`${eventSlug}:${email}`).digest("hex");
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (clean(body.website, 120)) {
      return NextResponse.json({ ok: true, registrationId: "PB-OK" });
    }

    const event = await getEvent(clean(body.eventSlug, 100));
    if (!event || event.status !== "open") {
      return NextResponse.json({ error: "That event is not open for registration." }, { status: 400 });
    }

    const name = clean(body.name, 80);
    const email = clean(body.email, 160).toLowerCase();
    const city = clean(body.city, 80);
    const role = clean(body.role, 80);
    const team = clean(body.team, 30);
    const idea = clean(body.idea, 800);
    const github = clean(body.github, 220);
    const consent = Boolean(body.consent);

    if (!name || !city || !role || !isEmail(email)) {
      return NextResponse.json({ error: "Please fill the required details with a valid email." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Email consent is required so we can send event logistics." }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json(
        { error: "Registration storage is not configured yet. Add the Firebase environment variables." },
        { status: 503 }
      );
    }

    const docId = registrationDocId(event.slug, email);
    const ref = db.collection("registrations").doc(docId);
    const existing = await ref.get();
    if (existing.exists) {
      return NextResponse.json({
        ok: true,
        registrationId: existing.data().registrationId,
        alreadyRegistered: true,
      });
    }

    const registrationId = makeRegistrationId(event.number);
    const registration = {
      registrationId,
      eventSlug: event.slug,
      eventNumber: event.number,
      eventTitle: event.title,
      eventMode: event.eventMode,
      name,
      email,
      city,
      role,
      team,
      idea,
      github,
      consent,
      createdAt: new Date().toISOString(),
      emailStatus: "pending",
    };
    await ref.set(registration);

    const devBypass = process.env.NODE_ENV !== "production" && process.env.EMAIL_DEV_BYPASS === "true";

    if (!process.env.RESEND_API_KEY) {
      await ref.update({ emailStatus: devBypass ? "dev-bypass" : "not-configured" });
      if (devBypass) {
        console.log("[Paper Boat registration — email bypass]", registration);
        return NextResponse.json({ ok: true, registrationId, devBypass: true });
      }
      return NextResponse.json(
        {
          error: "You are registered, but confirmation email is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL.",
          registrationId,
          stored: true,
        },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || "Paper Boat <onboarding@resend.dev>";
    const organizer = process.env.ORGANIZER_EMAIL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const eventUrl = `${siteUrl}/events/${event.slug}`;
    const isOnline = event.eventMode === "online";
    const isHybrid = event.eventMode === "hybrid";
    const modeLabel = isOnline ? "Online" : isHybrid ? "Hybrid" : "Offline / in person";
    const logisticsCopy = isOnline
      ? "Your private online build-room link and final logistics will arrive by email."
      : isHybrid
        ? "Your online room link plus physical venue and check-in logistics will arrive by email."
        : "Your venue, check-in details and final in-person logistics will arrive by email.";

    const participantHtml = `
      <div style="background:#f6f0df;padding:36px 18px;font-family:Arial,sans-serif;color:#563b32">
        <div style="max-width:620px;margin:auto;background:#fffdf7;border:2px solid #563b32;border-radius:18px;padding:32px;box-shadow:8px 8px 0 #f0a45d">
          <p style="font-size:13px;letter-spacing:.12em;text-transform:uppercase">Paper Boat #${escapeHtml(event.number)}</p>
          <h1 style="font-size:34px;line-height:1.05;margin:10px 0 18px">you’re in the boat, ${escapeHtml(name)}.</h1>
          <p style="font-size:17px;line-height:1.6">We got your registration for <strong>${escapeHtml(event.title)}</strong>. ${escapeHtml(logisticsCopy)}</p>
          <div style="margin:26px 0;padding:20px;border:1px dashed #9d6654;border-radius:12px;background:#fff9ec">
            <p style="margin:0 0 8px"><strong>Registration:</strong> ${registrationId}</p>
            <p style="margin:0 0 8px"><strong>When:</strong> ${escapeHtml(event.date)}</p>
            <p style="margin:0 0 8px"><strong>Timezone:</strong> ${escapeHtml(event.timezone)}</p>
            <p style="margin:0 0 8px"><strong>Mode:</strong> ${escapeHtml(modeLabel)}</p>
            ${!isOnline ? `<p style="margin:0 0 8px"><strong>Location:</strong> ${escapeHtml(event.location)}</p>` : ""}
            <p style="margin:0"><strong>Format:</strong> 8 PM → 8 PM build + growth, then 8–9 PM demos/results</p>
          </div>
          <a href="${eventUrl}" style="display:inline-block;background:#ee7b48;color:#fff;text-decoration:none;padding:13px 20px;border-radius:999px;font-weight:700">event page →</a>
          <p style="font-size:14px;line-height:1.5;margin-top:28px;color:#80665d">Bring an idea, a laptop, and a plan to find real users before the 24-hour clock stops.</p>
        </div>
      </div>`;

    const organizerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:620px">
        <h2>New Paper Boat registration</h2>
        <p><strong>${escapeHtml(name)}</strong> joined <strong>${escapeHtml(event.title)}</strong>.</p>
        <table cellpadding="7" style="border-collapse:collapse">
          <tr><td><strong>ID</strong></td><td>${registrationId}</td></tr>
          <tr><td><strong>Mode</strong></td><td>${escapeHtml(modeLabel)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>City</strong></td><td>${escapeHtml(city)}</td></tr>
          <tr><td><strong>Role</strong></td><td>${escapeHtml(role)}</td></tr>
          <tr><td><strong>Team</strong></td><td>${escapeHtml(team)}</td></tr>
          <tr><td><strong>GitHub / portfolio</strong></td><td>${github ? escapeHtml(github) : "—"}</td></tr>
          <tr><td><strong>Idea</strong></td><td>${idea ? escapeHtml(idea) : "—"}</td></tr>
        </table>
      </div>`;

    const sends = [
      resend.emails.send({
        from,
        to: email,
        subject: `You’re in — Paper Boat #${event.number}`,
        html: participantHtml,
        replyTo: organizer || undefined,
      }),
    ];

    if (organizer) {
      sends.push(
        resend.emails.send({
          from,
          to: organizer,
          subject: `New registration · ${name} · Paper Boat #${event.number}`,
          html: organizerHtml,
          replyTo: email,
        })
      );
    }

    const results = await Promise.all(sends);
    const failed = results.find((result) => result.error);
    if (failed) {
      console.error("Resend error", failed.error);
      await ref.update({ emailStatus: "failed" });
      return NextResponse.json(
        {
          error: "Registration was saved, but the confirmation email could not be sent. Check your Resend sender/domain settings.",
          registrationId,
          stored: true,
        },
        { status: 502 }
      );
    }

    await ref.update({ emailStatus: "sent" });
    return NextResponse.json({ ok: true, registrationId, devBypass: false });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json({ error: "Could not register right now. Please try again." }, { status: 500 });
  }
}
