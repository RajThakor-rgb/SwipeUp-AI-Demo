"use client";

// University portal — the academic framing (CESIM-style: you reach the
// simulation through your university). Launching here also requests real
// fullscreen so the rest feels like a dedicated machine, not a browser tab.

import { UNIVERSITY } from "@/config/case";
import { useWorkstation } from "@/lib/state";

export default function Portal() {
  const { dispatch } = useWorkstation();

  async function launch() {
    // Fullscreen must be triggered by a user gesture — this click qualifies.
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      /* some browsers/embeds block it — carry on regardless */
    }
    dispatch({ type: "SET_SCREEN", value: "boot" });
  }

  return (
    <div className="portal">
      <div className="portal-top">
        <div className="uol-mark">UL</div>
        <div className="uol-name">{UNIVERSITY.name}</div>
      </div>

      <div className="portal-card">
        <div className="portal-eyebrow">{UNIVERSITY.programme}</div>
        <h1>{UNIVERSITY.unit}</h1>
        <p className="portal-lead">
          You are about to enter a live business simulation. You will join a
          company as a new hire, receive a real brief, and use the company&apos;s
          AI tools to do the work — then watch the business respond.
        </p>

        <label className="portal-field">
          <span>University</span>
          <select defaultValue="uol" aria-label="Select your university">
            <option value="uol">{UNIVERSITY.name}</option>
          </select>
        </label>

        <label className="portal-field">
          <span>University login</span>
          <input
            type="email"
            placeholder="you@lawstudent.ac.uk"
            defaultValue="raj@lawstudent.ac.uk"
            onKeyDown={(e) => e.key === "Enter" && launch()}
          />
        </label>

        <button className="btn block lg" onClick={launch}>
          Launch simulation
        </button>
        <div className="portal-hint">
          Best experienced full-screen. Press <kbd>Esc</kbd> any time to exit.
        </div>
      </div>

      <div className="portal-foot">
        {UNIVERSITY.name} · in partnership with SwipeUp AI Academy
      </div>
    </div>
  );
}
