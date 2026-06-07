"use client";

// The three full-screen beats that blur everything else — reserved, per the
// brief, for exactly: onboarding, the reaction after a draft, and the debrief.
// Everything else lives quietly in comms.

import { useEffect, useState } from "react";
import {
  COMPANY,
  DEBRIEF,
  EMAILS,
  MANAGER_REACTIONS,
  METRICS,
  PEOPLE,
} from "@/config/case";
import { useWorkstation } from "@/lib/state";

export default function Interruption() {
  const { state } = useWorkstation();
  if (!state.interruption) return null;
  return (
    <div className="overlay">
      <div className="sheet">
        {state.interruption === "onboarding" ? <Onboarding /> : null}
        {state.interruption === "reaction" ? <Reaction /> : null}
        {state.interruption === "debrief" ? <Debrief /> : null}
      </div>
    </div>
  );
}

// ---- Onboarding ---------------------------------------------------------

function Onboarding() {
  const { dispatch } = useWorkstation();
  const email = EMAILS.find((e) => e.id === "onboarding")!;

  // While they read, the task email arrives softly — a comms ping plus a new
  // unread email in the inbox. It never blocks the onboarding read.
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: "TASK_EMAIL_ARRIVED" });
      dispatch({
        type: "ADD_COMMS",
        message: {
          id: "comms-task-arrived",
          from: PEOPLE.marketing.name,
          text: "Your first job is in your inbox when you're ready, Raj.",
        },
      });
    }, 3400);
    return () => clearTimeout(t);
  }, [dispatch]);

  return (
    <>
      <div className="eyebrow">Onboarding · {email.department}</div>
      <h2>{email.subject}</h2>
      <div className="from">
        From {email.from} · to {COMPANY.newHire.name}
      </div>
      <div className="body">{email.body}</div>
      <div className="actions">
        <button
          className="btn dark"
          onClick={() => dispatch({ type: "SET_INTERRUPTION", value: null })}
        >
          Got it — let&apos;s go
        </button>
      </div>
    </>
  );
}

// ---- Reaction: words first, numbers after -------------------------------

function Reaction() {
  const { state, dispatch } = useWorkstation();
  const [showNumbers, setShowNumbers] = useState(false);
  const last = state.attempts[state.attempts.length - 1];

  useEffect(() => {
    const t = setTimeout(() => setShowNumbers(true), 1700);
    return () => clearTimeout(t);
  }, []);

  if (!last) return null;
  const strong = last.judgment.band === "strong";

  return (
    <>
      <div className="eyebrow">
        {PEOPLE.marketing.name} · {PEOPLE.marketing.title}
      </div>
      <h2>The team reviewed your draft</h2>
      <div className="reaction-quote">
        {MANAGER_REACTIONS[last.judgment.band]}
      </div>

      {showNumbers ? (
        <>
          <div className="from">Here&apos;s how the projections moved.</div>
          <div className="reveal-numbers">
            {METRICS.map((m) => {
              const dec = m.decimals ?? 0;
              const delta = Number(
                (last.judgment.metrics[m.id]?.delta ?? 0).toFixed(dec),
              );
              const dir = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
              const sign = delta > 0 ? "+" : "";
              return (
                <div className="reveal-card" key={m.id}>
                  <div className="rc-label">{m.label}</div>
                  <div className="rc-value">
                    {state.metrics[m.id].toFixed(m.decimals ?? 0)}
                    {m.suffix}
                  </div>
                  <div className={`rc-delta chg ${dir}`}>
                    {dir === "up" ? "▲" : dir === "down" ? "▼" : "■"}{" "}
                    {dir === "flat"
                      ? "no change"
                      : `${sign}${delta.toFixed(m.decimals ?? 0)}`}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="loading-line">
          <span className="spinner" /> tallying the impact…
        </div>
      )}

      <div className="actions">
        <button
          className="btn ghost"
          onClick={() => {
            dispatch({ type: "OPEN_WINDOW", id: "dashboard" });
            dispatch({ type: "SET_INTERRUPTION", value: null });
          }}
        >
          See the dashboard
        </button>
        {state.attempts.length >= 2 ? (
          <button
            className="btn ghost"
            onClick={() =>
              dispatch({ type: "SET_INTERRUPTION", value: "debrief" })
            }
          >
            Wrap up &amp; review
          </button>
        ) : null}
        <button
          className="btn dark"
          onClick={() => {
            dispatch({ type: "OPEN_WINDOW", id: "claude" });
            dispatch({ type: "SET_INTERRUPTION", value: null });
          }}
        >
          {strong ? "Refine further" : "Improve the brief"}
        </button>
      </div>
    </>
  );
}

// ---- Debrief: first vs improved, the one principle, a reflection --------

function Debrief() {
  const { state, dispatch } = useWorkstation();
  const first = state.attempts[0];
  const best = state.attempts[state.attempts.length - 1];
  const [saved, setSaved] = useState(false);

  if (!first || !best) return null;

  return (
    <>
      <div className="eyebrow">Session debrief</div>
      <h2>What moved the needle</h2>

      <div className="compare">
        <div className="col first">
          <div className="col-head">Your first draft</div>
          <div className="c-subject">{first.email.subject}</div>
          <div className="c-body">{first.email.body}</div>
        </div>
        <div className="col best">
          <div className="col-head">Your stronger draft</div>
          <div className="c-subject">{best.email.subject}</div>
          <div className="c-body">{best.email.body}</div>
        </div>
      </div>

      <div className="principle">
        <b>The one thing</b>
        {DEBRIEF.principle}
      </div>

      <div className="reflect-label">{DEBRIEF.reflectionPrompt}</div>
      <textarea
        className="prompt-box"
        placeholder="One sentence…"
        value={state.reflection}
        onChange={(e) => {
          setSaved(false);
          dispatch({ type: "SET_REFLECTION", value: e.target.value });
        }}
      />

      <div className="actions">
        {saved ? <span className="saved-tag">Saved ✓</span> : null}
        <button
          className="btn ghost"
          onClick={() => dispatch({ type: "SET_INTERRUPTION", value: null })}
        >
          Back to workstation
        </button>
        <button
          className="btn dark"
          onClick={() => setSaved(true)}
          disabled={!state.reflection.trim()}
        >
          Save reflection
        </button>
      </div>
    </>
  );
}
