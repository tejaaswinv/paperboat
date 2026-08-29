"use client";

import { useState } from "react";

const initial = {
  name: "",
  email: "",
  city: "",
  role: "",
  team: "solo",
  idea: "",
  github: "",
  website: "",
  consent: false,
};

export default function RegistrationForm({ event }) {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState({ status: "idle", message: "" });

  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.consent) {
      setState({ status: "error", message: "Please tick the tiny consent box first." });
      return;
    }

    setState({ status: "loading", message: "folding your confirmation email…" });
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventSlug: event.slug }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed.");

      setState({
        status: "success",
        message: data.devBypass
          ? `You're on the list. Dev email bypass is ON, so no email was sent. Registration: ${data.registrationId}`
          : `You're on the list. Check ${form.email} for the confirmation. Registration: ${data.registrationId}`,
      });
      setForm(initial);
    } catch (error) {
      setState({ status: "error", message: error.message || "Something went wrong." });
    }
  }

  return (
    <form className="join-form" onSubmit={submit}>
      <div className="form-intro">
        <span className="tiny-doodle">✎</span>
        <p>no CV. no GPA. no “why should we select you?”</p>
      </div>

      <label>
        your name
        <input name="name" value={form.name} onChange={update} required maxLength={80} placeholder="Ada Lovelace-ish" />
      </label>

      <label>
        email
        <input name="email" type="email" value={form.email} onChange={update} required maxLength={160} placeholder="you@internet.com" />
      </label>

      <div className="form-grid">
        <label>
          where are you coming from?
          <input name="city" value={form.city} onChange={update} required maxLength={80} placeholder="Singapore / Chennai / Mars" />
        </label>
        <label>
          what do you mostly do?
          <select name="role" value={form.role} onChange={update} required>
            <option value="" disabled>pick a loose label</option>
            <option>developer</option>
            <option>designer</option>
            <option>student</option>
            <option>founder</option>
            <option>researcher</option>
            <option>hardware tinkerer</option>
            <option>curious human</option>
          </select>
        </label>
      </div>

      <fieldset>
        <legend>are you coming…</legend>
        <div className="radio-row">
          {[
            ["solo", "solo — adopt me into a team"],
            ["team", "with my tiny crew"],
            ["either", "either is lovely"],
          ].map(([value, label]) => (
            <label className="radio-card" key={value}>
              <input type="radio" name="team" value={value} checked={form.team === value} onChange={update} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        what might you build? <span className="muted">(can be nonsense)</span>
        <textarea name="idea" value={form.idea} onChange={update} maxLength={800} rows={4} placeholder="an agent that argues with my calendar…" />
      </label>

      <label>
        github / portfolio <span className="muted">(optional)</span>
        <input name="github" value={form.github} onChange={update} maxLength={220} placeholder="https://..." />
      </label>

      <input className="honeypot" tabIndex="-1" autoComplete="off" name="website" value={form.website} onChange={update} aria-hidden="true" />

      <label className="checkbox-row">
        <input type="checkbox" name="consent" checked={form.consent} onChange={update} />
        <span>You can email me about this event and the practical bits needed to attend.</span>
      </label>

      <button className="button button-big" disabled={state.status === "loading"} type="submit">
        {state.status === "loading" ? "folding the boat…" : "i'm in →"}
      </button>

      {state.message && <div className={`form-message ${state.status}`}>{state.message}</div>}
    </form>
  );
}
