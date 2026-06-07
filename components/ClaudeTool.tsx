"use client";

// The Claude tool — a simple branded panel (not a clone of claude.ai). The
// student writes a prompt for the task, submits, and the result engine runs.
// On success we record the attempt, move the dashboard, drop a human-voiced
// manager message into comms, and trigger the full-screen reaction beat.

import { useState } from "react";
import {
  COMPANY,
  MANAGER_REACTIONS,
  METRICS,
  TASK,
} from "@/config/case";
import { useWorkstation } from "@/lib/state";
import type { AttemptResult } from "@/lib/types";
import Window from "./Window";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export default function ClaudeTool() {
  const { state, dispatch } = useWorkstation();
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<"idle" | "generating" | "judging">("idle");
  const [warn, setWarn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const latest = state.attempts[state.attempts.length - 1] ?? null;
  const busy = phase !== "idle";
  const attemptNumber = state.attempts.length + 1;

  async function submit() {
    if (!prompt.trim() || busy) return;
    setWarn(null);
    setError(null);
    setPhase("generating");
    // Reflect the two server-side calls in the loading copy.
    const toJudging = setTimeout(() => setPhase("judging"), 1400);

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
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

      // Apply metric deltas with clamping so a move can never run off the rails.
      const metricsAfter: Record<string, number> = {};
      for (const m of METRICS) {
        const delta = result.judgment.metrics[m.id]?.delta ?? 0;
        metricsAfter[m.id] = clamp(state.metrics[m.id] + delta, m.min, m.max);
      }

      dispatch({
        type: "RECORD_ATTEMPT",
        attempt: {
          prompt,
          email: result.email,
          judgment: result.judgment,
          metricsAfter,
        },
      });

      // Human-voiced manager message in comms, keyed to the band.
      dispatch({
        type: "ADD_COMMS",
        message: {
          id: `comms-${Date.now()}`,
          from: COMPANY.manager.name,
          text: MANAGER_REACTIONS[result.judgment.band],
        },
      });

      // The reaction beat: words first, numbers after.
      dispatch({ type: "SET_INTERRUPTION", value: "reaction" });
      setPhase("idle");
    } catch {
      clearTimeout(toJudging);
      setError("Couldn't reach the AI service. Check your connection and retry.");
      setPhase("idle");
    }
  }

  return (
    <Window id="claude" title="Claude" glyph="✳" sizeClass="size-claude">
      <div className="claude">
        <div className="claude-head">
          <div className="ct-title">
            <span aria-hidden>✳</span> Claude · {COMPANY.name} AI
          </div>
          <div className="ct-sub">
            Direct it, and judge what comes back. A tool is only as good as the
            brief it's given.
          </div>
        </div>

        {/* Task brief */}
        <div className="task-card">
          <div className="tc-label">Current task — from {COMPANY.manager.name}</div>
          <div className="tc-title">{TASK.title}</div>
          <div className="tc-text">{TASK.summary}</div>
          <div className="tc-rules">
            <b>Voice rules:</b> {TASK.voiceRules}
          </div>
        </div>

        <div className="claude-io">
          <div className="prompt-label">
            Your prompt to Claude
            {state.attempts.length > 0 ? " — revise it and resubmit" : ""}
          </div>
          <textarea
            className="prompt-box"
            placeholder="Tell Claude who it's writing as, who it's writing to, and what to avoid…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={busy}
          />

          <div className="claude-actions">
            <button className="btn dark" onClick={submit} disabled={busy || !prompt.trim()}>
              {busy ? "Working…" : attemptNumber === 1 ? "Generate" : "Try again"}
            </button>
            <span className="attempt-tag">Attempt {attemptNumber}</span>
            {state.attempts.length >= 2 ? (
              <button
                className="btn ghost"
                onClick={() => dispatch({ type: "SET_INTERRUPTION", value: "debrief" })}
              >
                Finish &amp; debrief
              </button>
            ) : null}
          </div>

          {warn ? <div className="notice warn">{warn}</div> : null}
          {error ? <div className="notice error">{error}</div> : null}

          {busy ? (
            <div className="output">
              <div className="loading-line">
                <span className="spinner" />
                {phase === "generating"
                  ? "Claude is writing the email…"
                  : "The team is reviewing it…"}
              </div>
            </div>
          ) : latest ? (
            <div className="output">
              <div className="o-head">Generated — autumn launch email</div>
              <div className="o-subject">{latest.email.subject}</div>
              <div className="o-body">{latest.email.body}</div>
            </div>
          ) : null}
        </div>
      </div>
    </Window>
  );
}
