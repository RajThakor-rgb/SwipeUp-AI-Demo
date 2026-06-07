"use client";

// The marketing backend. Renders the live metric values from state, and after
// an attempt shows the change and the one-line reason beside each number. A
// brand-voice tile is derived from the latest voice-match score.

import { METRICS } from "@/config/case";
import { useWorkstation } from "@/lib/state";
import Window from "./Window";

export default function DashboardPanel() {
  const { state } = useWorkstation();
  const last = state.attempts[state.attempts.length - 1] ?? null;

  return (
    <Window
      id="dashboard"
      title="Marketing Dashboard"
      glyph="▣"
      sizeClass="size-dashboard"
    >
      <div className="dash">
        <h2>Campaign Performance</h2>
        <div className="sub">
          Projections from the work — not real sales.
          {!state.dashboardTouched
            ? " Weak and sliding. This is the problem you were hired into."
            : ""}
        </div>

        {METRICS.map((m) => {
          const value = state.metrics[m.id];
          const moved = last?.judgment.metrics[m.id];
          const delta = moved?.delta ?? 0;
          const dir = delta > 0.001 ? "up" : delta < -0.001 ? "down" : "flat";
          const sign = delta > 0 ? "+" : "";
          return (
            <div className="metric" key={m.id}>
              <div className="m-label">{m.label}</div>
              <div className="m-row">
                <span className="m-value">
                  {value.toFixed(m.decimals ?? 0)}
                  {m.suffix}
                </span>
                {state.dashboardTouched ? (
                  <span className={`m-change ${dir}`}>
                    {dir === "flat"
                      ? "no change"
                      : `${sign}${delta.toFixed(m.decimals ?? 0)}`}
                  </span>
                ) : (
                  <span className="m-trend">▼ trending down</span>
                )}
              </div>
              {moved ? <div className="m-reason">{moved.reason}</div> : null}
            </div>
          );
        })}

        {/* Derived brand-voice consistency tile */}
        <BrandVoiceTile />
      </div>
    </Window>
  );
}

function BrandVoiceTile() {
  const { state } = useWorkstation();
  const last = state.attempts[state.attempts.length - 1] ?? null;
  // Derive 0-100 from the latest voice-match score (0-10). Baseline before any attempt.
  const score = last
    ? Math.round((last.judgment.criteria.voiceMatch?.score ?? 0) * 10)
    : 38;

  return (
    <div className="metric voice">
      <div className="m-label">Brand-voice consistency</div>
      <div className="m-row">
        <span className="m-value">{score}%</span>
      </div>
      <div className="bar">
        <span style={{ width: `${score}%` }} />
      </div>
      <div className="m-reason">
        {last
          ? last.judgment.criteria.voiceMatch?.reason
          : "Derived from how closely the latest campaign matches Velara's voice."}
      </div>
    </div>
  );
}
