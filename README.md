# Paper Boat AI — 24-hour builder event website

A playful Next.js event site inspired by the **nostalgic, illustrated storytelling feel** of Hector Beverages' Paper Boat website, but with original UI, copy and doodles for an independent AI builder community.

> Important: “Paper Boat AI” in this starter is presented as an independent community project and not affiliated with Hector Beverages / Paper Boat Drinks. If you plan to launch publicly under this name, do a trademark/name check first.

## Included

- Landing page with hand-drawn / paper-texture visual language
- Events listing page
- Dynamic event detail pages
- Dynamic “join event” registration form
- Resend API route that validates the registration, sends a participant confirmation, optionally notifies the organizer, and generates a registration ID
- Honeypot field for basic bot filtering
- Local email bypass so frontend development does not fail without a Resend key
- Responsive mobile layout

## 1. Install

```bash
npm install
```

## 2. Configure Resend

```bash
cp .env.example .env.local
```

Fill in:

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=Paper Boat <events@yourdomain.com>
ORGANIZER_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EMAIL_DEV_BYPASS=true
```

For real delivery, add and verify your sending domain in Resend, then use an address on that domain in `RESEND_FROM_EMAIL`. If you use `onboarding@resend.dev`, Resend's testing restrictions apply. A verified domain is the correct production setup.

`EMAIL_DEV_BYPASS=true` only bypasses email in local development. In production, missing Resend configuration returns a clear 503 error instead of pretending an email was sent.

## 3. Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## 4. Edit the event

All starter event content is in `lib/events.js`. Replace the placeholder date, venue, capacity, prompts and schedule with your real event information.

## 5. Deploy to Vercel

Push to GitHub, import the repository into Vercel, and add the same environment variables in **Project Settings → Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to your production URL.

## Registration storage

This starter deliberately keeps the backend minimal: **Resend is the system of record via the organizer notification email**, and no attendee database is created.

If you want an attendee dashboard, duplicate prevention, waitlists, check-in QR codes, or real capacity enforcement, add Supabase/Postgres and write the registration before sending the confirmation email.
