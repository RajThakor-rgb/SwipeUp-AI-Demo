"use client";

// The Claude tool — a simple branded company panel (not a claude.ai clone).
// The associate briefs Claude, generates a draft, and the result engine runs
// two server-side calls (generate, then judge). On success we record the draft,
// move the dashboard, drop a human-voiced note from Priya into comms, and
// trigger the reaction beat. Framed as real company work — no "attempt" scoring.

import { useState } from "react";
import { COMPANY, MANAGER_REACTIONS, METRICS, PEOPLE, TASK } from "@/config/case";
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
  const hasDraft = state.attempts.length > 0;

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

      const metricsAfter: Record<string, number> = {};
      for (const m of METRICS) {
        const delta = result.judgment.metrics[m.id]?.delta ?? 0;
        metricsAfter[m.id] = clamp(state.metrics[m.id] + delta, m.min, m.max);
      }

      dispatch({
        type: "RECORD_ATTEMPT",
        attempt: { prompt, email: result.email, judgment: result.judgment, metricsAfter },
      });

      dispatch({
        type: "ADD_COMMS",
        message: {
          id: `comms-${Date.now()}`,
          from: PEOPLE.marketing.name,
          text: MANAGER_REACTIONS[result.judgment.band],
        },
      });

      dispatch({ type: "SET_INTERRUPTION", value: "reaction" });
      setPhase("idle");
    } catch {
      clearTimeout(toJudging);
      setError("Couldn't reach the AI service. Check your connection and retry.");
      setPhase("idle");
    }
  }

  return (
    <Window id="claude" title="Claude" glyph="✳" width={680} height={640}>
      <div className="claude">
        <div className="claude-head">
          <div className="ct-title">
            <span className="ct-mark" aria-hidden>✳</span>
            <div>
              <div className="ct-name">Claude</div>
              <div className="ct-org">{COMPANY.name} · company AI workspace</div>
            </div>
          </div>
        </div>

        {/* Task brief */}
        <div className="task-card">
          <div className="tc-label">Brief from {PEOPLE.marketing.name} · {PEOPLE.marketing.title}</div>
          <div className="tc-title">{TASK.title}</div>
          <div className="tc-text">{TASK.summary}</div>
          <div className="tc-rules">
            <b>Voice rules:</b> {TASK.voiceRules}
          </div>
        </div>

        <div className="claude-io">
          <div className="prompt-label">
            {hasDraft ? "Refine your brief to Claude" : "Brief Claude"}
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
              {busy ? "Working…" : hasDraft ? "Generate revised draft" : "Generate draft"}
            </button>
            {state.attempts.length >= 2 ? (
              <button
                className="btn ghost"
                onClick={() => dispatch({ type: "SET_INTERRUPTION", value: "debrief" })}
              >
                Wrap up &amp; review
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
                  ? "Claude is drafting the email…"
                  : "Priya's team is reviewing it…"}
              </div>
            </div>
          ) : latest ? (
            <div className="output">
              <div className="o-head">
                <span>Draft · autumn launch email</span>
                <span className="o-chip">awaiting review</span>
              </div>
              <div className="o-subject">{latest.email.subject}</div>
              <div className="o-body">{latest.email.body}</div>
            </div>
          ) : (
            <div className="output empty">
              <div className="loading-line muted">
                Your draft will appear here once Claude generates it.
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}
