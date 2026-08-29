"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AdminDashboard.module.css";

const emptyEvent = {
  title: "",
  slug: "",
  number: "",
  status: "draft",
  eventMode: "online",
  startDate: "",
  date: "",
  dateShort: "24 hrs",
  timezone: "Asia/Singapore · GMT+8",
  location: "Online · worldwide",
  venue: "Online build room · link sent to registered builders",
  meetingUrl: "",
  capacity: "0",
  description: "",
  longDescription: "",
  tagsText: "AI, agents, software, growth, online, real users",
  promptsText: "",
  judgingText:
    "Functionality — does the product work, and how complete/useful is it?\nTraction — how many real users did you acquire inside the 24-hour window?",
  scheduleText:
    "19:30 | online room opens + introductions\n20:00 | 24-hour clock starts — build begins\n00:00 | midnight checkpoint + user-acquisition plans\n08:00 +1 | halfway checkpoint — keep building + keep growing\n16:00 +1 | final four-hour push\n20:00 +1 | ship. build + growth window closes.\n20:00–21:00 +1 | live demos + judging + results",
};

function eventToForm(event) {
  return {
    ...emptyEvent,
    ...event,
    capacity: String(event.capacity ?? 0),
    tagsText: (event.tags || []).join(", "),
    promptsText: (event.prompts || []).join("\n"),
    judgingText: (event.judging || []).join("\n"),
    scheduleText: (event.schedule || [])
      .map((item) => `${item.time || ""} | ${item.label || ""}`)
      .join("\n"),
  };
}

function formToPayload(form) {
  return {
    ...form,
    capacity: Number(form.capacity) || 0,
    tags: form.tagsText.split(",").map((x) => x.trim()).filter(Boolean),
    prompts: form.promptsText.split("\n").map((x) => x.trim()).filter(Boolean),
    judging: form.judgingText.split("\n").map((x) => x.trim()).filter(Boolean),
    schedule: form.scheduleText
      .split("\n")
      .map((line) => {
        const [time, ...rest] = line.split("|");
        return { time: time.trim(), label: rest.join("|").trim() };
      })
      .filter((item) => item.time || item.label),
  };
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(null);
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState(emptyEvent);
  const [editingSlug, setEditingSlug] = useState("");
  const [tab, setTab] = useState("events");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadData() {
    setMessage("");
    const eventResponse = await fetch("/api/admin/events", { cache: "no-store" });
    if (eventResponse.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (!eventResponse.ok) {
      const data = await eventResponse.json().catch(() => ({}));
      setMessage(data.error || "Could not load admin data.");
      setAuthenticated(true);
      return;
    }

    const eventData = await eventResponse.json();
    setEvents(eventData.events || []);
    setAuthenticated(true);

    const registrationResponse = await fetch("/api/admin/registrations", { cache: "no-store" });
    if (registrationResponse.ok) {
      const registrationData = await registrationResponse.json();
      setRegistrations(registrationData.registrations || []);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const registrationCounts = useMemo(() => {
    const counts = {};
    registrations.forEach((registration) => {
      counts[registration.eventSlug] = (counts[registration.eventSlug] || 0) + 1;
    });
    return counts;
  }, [registrations]);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data.error || "Could not sign in.");
      setBusy(false);
      return;
    }
    setPassword("");
    await loadData();
    setBusy(false);
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setEvents([]);
    setRegistrations([]);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function newEvent() {
    setEditingSlug("");
    setForm(emptyEvent);
    setMessage("");
  }

  function editEvent(event) {
    setEditingSlug(event.slug);
    setForm(eventToForm(event));
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveEvent(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch(
      editingSlug ? `/api/admin/events/${editingSlug}` : "/api/admin/events",
      {
        method: editingSlug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(form)),
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data.error || "Could not save event.");
      setBusy(false);
      return;
    }
    setMessage(editingSlug ? "Event updated." : "Event created.");
    setEditingSlug("");
    setForm(emptyEvent);
    await loadData();
    setBusy(false);
  }

  async function deleteEvent(slug) {
    if (!window.confirm("Delete this event? Registrations are kept separately.")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/events/${slug}`, { method: "DELETE" });
    if (response.ok) {
      await loadData();
      if (editingSlug === slug) newEvent();
    } else {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error || "Could not delete event.");
    }
    setBusy(false);
  }

  async function deleteRegistration(id) {
    if (!window.confirm("Delete this registration record?")) return;
    const response = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
    if (response.ok) {
      setRegistrations((items) => items.filter((item) => item.id !== id));
    }
  }

  if (authenticated === null) {
    return <div className={styles.panel}>Loading organizer console…</div>;
  }

  if (!authenticated) {
    return (
      <form className={styles.loginPanel} onSubmit={login}>
        <h2>Organizer login</h2>
        <p>The password is the <code>ADMIN_PASSWORD</code> environment variable.</p>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button className="button button-big" disabled={busy}>
          {busy ? "checking…" : "open console →"}
        </button>
        {message && <p className={styles.error}>{message}</p>}
      </form>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button type="button" className={tab === "events" ? styles.activeTab : ""} onClick={() => setTab("events")}>Events ({events.length})</button>
          <button type="button" className={tab === "registrations" ? styles.activeTab : ""} onClick={() => setTab("registrations")}>Registrations ({registrations.length})</button>
        </div>
        <button type="button" className={styles.linkButton} onClick={logout}>log out</button>
      </div>

      {message && <div className={styles.notice}>{message}</div>}

      {tab === "events" ? (
        <div className={styles.columns}>
          <form className={styles.panel} onSubmit={saveEvent}>
            <div className={styles.panelHeading}>
              <div>
                <span className={styles.kicker}>{editingSlug ? "editing event" : "new event"}</span>
                <h2>{editingSlug ? form.title || "Untitled" : "Schedule a Paper Boat"}</h2>
              </div>
              {editingSlug && <button type="button" className={styles.linkButton} onClick={newEvent}>cancel edit</button>}
            </div>

            <div className={styles.formGrid}>
              <label className={styles.full}>Event title<input name="title" value={form.title} onChange={updateField} required /></label>
              <label>Slug<input name="slug" value={form.slug} onChange={updateField} placeholder="auto-from-title" disabled={Boolean(editingSlug)} /></label>
              <label>Event number<input name="number" value={form.number} onChange={updateField} placeholder="auto" /></label>
              <label>Status<select name="status" value={form.status} onChange={updateField}><option value="draft">Draft</option><option value="open">Open registration</option><option value="past">Past</option></select></label>
              <label>Format<select name="eventMode" value={form.eventMode} onChange={updateField}><option value="online">Online</option><option value="hybrid">Hybrid</option><option value="in-person">In person</option></select></label>
              <label>Challenge start date<input type="date" name="startDate" value={form.startDate} onChange={updateField} /><small>8 PM start → 8 PM next day. Demos run until 9 PM.</small></label>
              <label>Display date<input name="date" value={form.date} onChange={updateField} placeholder="12 Sep 2026 · 8 PM" /></label>
              <label>Timezone<input name="timezone" value={form.timezone} onChange={updateField} /></label>
              <label>Capacity<input min="0" type="number" name="capacity" value={form.capacity} onChange={updateField} /><small>0 = no hard online cap.</small></label>
              <label>Location<input name="location" value={form.location} onChange={updateField} /></label>
              <label>Venue / room note<input name="venue" value={form.venue} onChange={updateField} /></label>
              <label className={styles.full}>Private meeting / Discord link<input name="meetingUrl" value={form.meetingUrl} onChange={updateField} placeholder="Stored in Firebase; not shown publicly by default" /></label>
              <label className={styles.full}>Short description<textarea name="description" value={form.description} onChange={updateField} rows="3" /></label>
              <label className={styles.full}>Full event description<textarea name="longDescription" value={form.longDescription} onChange={updateField} rows="5" /></label>
              <label className={styles.full}>Tags<input name="tagsText" value={form.tagsText} onChange={updateField} /><small>Comma separated.</small></label>
              <label className={styles.full}>Judging criteria<textarea name="judgingText" value={form.judgingText} onChange={updateField} rows="4" /><small>One criterion per line.</small></label>
              <label className={styles.full}>Prompt ideas<textarea name="promptsText" value={form.promptsText} onChange={updateField} rows="4" /><small>One prompt per line.</small></label>
              <label className={styles.full}>Schedule<textarea name="scheduleText" value={form.scheduleText} onChange={updateField} rows="8" /><small>Use <code>20:00 | challenge begins</code>.</small></label>
            </div>

            <button className="button button-big" disabled={busy}>{busy ? "saving…" : editingSlug ? "save changes →" : "schedule event →"}</button>
          </form>

          <div className={styles.stack}>
            <div className={styles.panel}>
              <span className={styles.kicker}>default clock</span>
              <h3>8 PM → 8 PM +1</h3>
              <p>Building and user acquisition run for exactly 24 hours. The following hour, 8–9 PM, is for demos, judging and results.</p>
            </div>

            {events.map((event) => (
              <article className={styles.eventCard} key={event.slug}>
                <div>
                  <span className={styles.status}>{event.status} · {event.eventMode}</span>
                  <h3>#{event.number} {event.title}</h3>
                  <p>{event.date} · {event.timezone}</p>
                  <p>{registrationCounts[event.slug] || 0} registrations</p>
                </div>
                <div className={styles.cardActions}>
                  <a href={`/events/${event.slug}`} target="_blank" rel="noreferrer">view</a>
                  <button type="button" onClick={() => editEvent(event)}>edit</button>
                  <button type="button" onClick={() => deleteEvent(event.slug)}>delete</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <div><span className={styles.kicker}>firebase registrations</span><h2>Everyone in the boat</h2></div>
          </div>
          {registrations.length === 0 ? <p>No registrations yet.</p> : (
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Builder</th><th>Event</th><th>Role</th><th>City</th><th>Email status</th><th /></tr></thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration.id}>
                      <td><strong>{registration.name}</strong><small>{registration.email}</small><small>{registration.registrationId}</small></td>
                      <td>{registration.eventTitle || registration.eventSlug}</td>
                      <td>{registration.role}</td>
                      <td>{registration.city}</td>
                      <td>{registration.emailStatus || "—"}</td>
                      <td><button type="button" className={styles.linkButton} onClick={() => deleteRegistration(registration.id)}>delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
