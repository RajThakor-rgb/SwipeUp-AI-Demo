"use client";

// Practise (Engage): now that they know the frameworks, they do it for real on
// Velara's task. Each prompt is generated and judged; the dashboard reacts and
// a professor-voiced coach ties the result to the frameworks and nudges the next
// improvement. They iterate up to a few times, then move to the review.

import { useState } from "react";
import { METRICS, TASK } from "@/config/case";
import { FRAMEWORKS, type Framework } from "@/config/learn";
import { useWorkstation } from "@/lib/state";
import type { AttemptResult } from "@/lib/types";
import Dashboard from "./Dashboard";
import FrameworkModal from "./FrameworkModal";

const MAX_ATTEMPTS = 4;
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/** A short, professional SwipeUp encouragement tuned to progress. */
function encouragement(band: string, attemptNo: number, reachedMax: boolean): string {
  if (band === "strong") return "Outstanding. You've mastered the move.";
  if (reachedMax) return "Strong progress today. Let's review what you've learned.";
  if (attemptNo <= 1) return "Great first attempt. You're on the right track.";
  if (attemptNo === 2) return "You're improving. Keep refining.";
  return "Almost there. One more sharpening and it will land.";
}

export default function Practice() {
  const { state, dispatch } = useWorkstation();
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<"idle" | "generating" | "judging">("idle");
  const [warn, setWarn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFw, setOpenFw] = useState<Framework | null>(null);

  const latest = state.attempts[state.attempts.length - 1] ?? null;
  const busy = phase !== "idle";
  const attemptNo = state.attempts.length;
  const isStrong = latest?.judgment.band === "strong";
  const reachedMax = attemptNo >= MAX_ATTEMPTS;
  const canReview = isStrong || reachedMax;

  async function submit() {
    if (!prompt.trim() || busy) return;
    setWarn(null);
    setError(null);
    setPhase("generating");
    const toJudging = setTimeout(() => setPhase("judging"), 1400);

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, attempt: state.attempts.length + 1 }),
      });
      const data = await res.json();
      clearTimeout(toJudging);

      if (data.configured === false) {
        setWarn(data.message);
        setPhase("idle");
        return;
      }
      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Try again.");
        setPhase("idle");
        return;
      }

      const result = data as AttemptResult;
      const metricsAfter: Record<string, number> = {};
      for (const m of METRICS) {
        const delta = result.judgment.metrics[m.id]?.delta ?? 0;
        metricsAfter[m.id] = clamp(state.metrics[m.id] + delta, m.min, m.max);
      }
      dispatch({
        type: "RECORD_ATTEMPT",
        attempt: { prompt, email: result.email, judgment: result.judgment, metricsAfter },
      });
      setPhase("idle");
    } catch {
      clearTimeout(toJudging);
      setError("Couldn't reach the AI service. Check your connection and retry.");
      setPhase("idle");
    }
  }

  return (
    <div className="practice">
      {/* Left: brief + prompt + draft */}
      <div className="practice-left">
        <div className="brief">
          <div className="brief-tag">Your task</div>
          <div className="brief-title">{TASK.title}</div>
          <div className="brief-text">{TASK.summary}</div>
          <div className="brief-rules">
            <b>Velara's voice:</b> {TASK.voiceRules}
          </div>
        </div>

        <div className="fw-reminder">
          Need a reminder? Open a framework:
          {FRAMEWORKS.map((f) => (
            <button className="fw-chip" key={f.id} onClick={() => setOpenFw(f)}>
              {f.name}
            </button>
          ))}
        </div>

        <div className="prompt-label">
          {attemptNo === 0 ? "Write your prompt" : "Refine your prompt and try again"}
        </div>
        <textarea
          className="prompt-box"
          placeholder="Use the frameworks: give the AI the context, audience, tone and constraints it needs…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={busy}
        />

        <div className="practice-actions">
          <button className="btn dark" onClick={submit} disabled={busy || !prompt.trim() || isStrong || reachedMax}>
            {busy ? "Working…" : attemptNo === 0 ? "Generate & send" : "Send revised prompt"}
          </button>
          <span className="attempt-note">
            {attemptNo > 0 ? `Attempt ${attemptNo} of ${MAX_ATTEMPTS}` : `${MAX_ATTEMPTS} tries available`}
          </span>
          {canReview ? (
            <button className="btn ghost" onClick={() => dispatch({ type: "SET_STAGE", value: "consolidate" })}>
              See your review →
            </button>
          ) : null}
        </div>

        {warn ? <div className="notice warn">{warn}</div> : null}
        {error ? <div className="notice error">{error}</div> : null}

        {busy ? (
          <div className="output">
            <div className="loading-line">
              <span className="spinner" />
              {phase === "generating" ? "Claude is drafting the email…" : "Sending it and reading the market…"}
            </div>
          </div>
        ) : latest ? (
          <div className="output">
            <div className="o-head">
              <span>Draft · {TASK.title}</span>
              <span className={`o-band ${latest.judgment.band}`}>{latest.judgment.band}</span>
            </div>
            <div className="o-subject">{latest.email.subject}</div>
            <div className="o-body">{latest.email.body}</div>
          </div>
        ) : (
          <div className="output empty">
            <div className="loading-line muted">Your draft will appear here once you generate it.</div>
          </div>
        )}
      </div>

      {/* Right: coach + live dashboard */}
      <div className="practice-right">
        {latest ? (
          <div className={`coach band-${latest.judgment.band}`}>
            <div className="coach-head">
              <span className="coach-avatar">✳</span>
              <span className="coach-name">Your AI coach</span>
            </div>
            <div className="coach-text">{latest.judgment.coach}</div>
            {!isStrong ? (
              <div className="coach-open">
                Open a framework:
                {FRAMEWORKS.map((f) => (
                  <button className="fw-chip sm" key={f.id} onClick={() => setOpenFw(f)}>
                    {f.name}
                  </button>
                ))}
              </div>
            ) : null}
            {latest.judgment.focus?.length ? (
              <div className="coach-focus">
                <span className="cf-label">Focus on</span>
                {latest.judgment.focus.map((f, i) => (
                  <span className="cf-chip" key={i}>{f}</span>
                ))}
              </div>
            ) : null}
            {isStrong ? (
              <div className="coach-win">The market responded. Open your review to see what changed.</div>
            ) : reachedMax ? (
              <div className="coach-win">That is plenty of practice. Let's review what you learned.</div>
            ) : null}
            <div className="coach-encourage">
              <span className="ce-mark">S</span>
              SwipeUp Coach · {encouragement(latest.judgment.band, attemptNo, reachedMax)}
            </div>
          </div>
        ) : (
          <div className="coach idle">
            <div className="coach-head">
              <span className="coach-avatar">✳</span>
              <span className="coach-name">Your AI coach</span>
            </div>
            <div className="coach-text">
              Write your first prompt for the task. I'll send the email it
              produces, then show you how the market reacted and how to make it
              stronger.
            </div>
          </div>
        )}

        <div className="practice-dash">
          <Dashboard compact />
        </div>
      </div>

      {openFw ? <FrameworkModal framework={openFw} onClose={() => setOpenFw(null)} /> : null}
    </div>
  );
}
