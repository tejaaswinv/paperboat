# Paper Boat AI — 24-hour online-first builder challenge

Paper Boat is a Next.js event site for a simple challenge: use AI tools to build, ship, and grow a software product inside 24 hours.

The challenge runs **8 PM → 8 PM the next day**. Building and user acquisition stop at 8 PM. **8–9 PM** is reserved for demos, judging, and results.

> This project is independent and is not affiliated with Hector Beverages / Paper Boat Drinks. Do a trademark/name check before a public launch.

## Stack

- Next.js App Router
- Firebase / Firestore — events + registrations
- Firebase Admin SDK — server-only Firestore access
- Resend — registration confirmation emails
- Vercel-ready deployment

## Organizer console

Open:

```text
/admin
```

The organizer console lets you schedule events, edit dates/timezones/online-room details, publish or draft events, manage prompts/judging/schedules, and view registrations stored in Firebase.

`/admin` is protected by `ADMIN_PASSWORD`.

## 1. Install

```bash
npm install
```

## 2. Create Firebase

Create a Firebase project and enable **Cloud Firestore**.

Go to **Firebase Console → Project settings → Service accounts → Generate new private key** and add these to `.env.local`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

The website uses Firebase Admin only on the server. Browser access to Firestore is denied by `firestore.rules`.

If you use the Firebase CLI, deploy the included rules with:

```bash
firebase deploy --only firestore:rules
```

The two starter events are copied into Firestore once, the first time a Firebase-configured deployment reads the event collection.

## 3. Organizer password

```env
ADMIN_PASSWORD=use-a-long-random-password-here
```

Do not expose this value in a `NEXT_PUBLIC_` variable.

## 4. Configure Resend

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=Paper Boat <events@yourdomain.com>
ORGANIZER_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EMAIL_DEV_BYPASS=true
```

For production email, verify your sending domain in Resend.

## 5. Run

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
http://localhost:3000/admin
```

## Firestore collections

### `events`

Each event document uses its URL slug as the document ID and stores the title, number, status, format, date, timezone, location, online-room details, descriptions, judging criteria, prompts, schedule and tags.

### `registrations`

Every registration is saved to Firestore **before** Resend email delivery is attempted. One email can register only once for each event. The database also stores the generated registration ID and current email-delivery status.

## Vercel

Add all variables from `.env.example` under **Vercel → Project → Settings → Environment Variables**, then redeploy.

Never commit a Firebase private key, Resend API key, or admin password to GitHub.
