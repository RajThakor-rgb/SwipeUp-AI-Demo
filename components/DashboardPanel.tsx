"use client";

// The marketing analytics backend — built to read like a real BI dashboard.
// KPI tiles with sparklines and trends, a main trend chart that projects the
// move from the latest draft, channel + audience breakdowns, a campaigns table,
// and the headline problem spelled out. After a draft is judged, the deltas and
// reasons appear beside the numbers.

import { ANALYTICS, METRICS } from "@/config/case";
import { useWorkstation } from "@/lib/state";
import { AreaChart, Donut, Sparkline } from "./charts";
import Window from "./Window";

export default function DashboardPanel() {
  const { state } = useWorkstation();
  const last = state.attempts[state.attempts.length - 1] ?? null;

  // Brand-voice score (0-100) derived from the latest voice-match criterion.
  const voiceScore = last
    ? Math.round((last.judgment.criteria.voiceMatch?.score ?? 0) * 10)
    : 38;

  const engagementMetric = METRICS.find((m) => m.id === "engagement")!;
  const projected = state.dashboardTouched
    ? state.metrics["engagement"]
    : null;

  return (
    <Window
      id="dashboard"
      title="Marketing Analytics"
      glyph="▣"
      width={760}
      height={620}
    >
      <div className="dash">
        <div className="dash-top">
          <div>
            <h2>Campaign Performance</h2>
            <div className="sub">
              Velara · Marketing · last 8 weeks ·{" "}
              <span className="live-dot" /> live projections
            </div>
          </div>
          <div className="range-pill">Autumn campaign · planning</div>
        </div>

        {/* KPI tiles */}
        <div className="kpis">
          {METRICS.map((m) => {
            const value = state.metrics[m.id];
            const moved = last?.judgment.metrics[m.id];
            const dec = m.decimals ?? 0;
            const delta = Number((moved?.delta ?? 0).toFixed(dec));
            const dir = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
            const sign = delta > 0 ? "+" : "";
            return (
              <div className="kpi" key={m.id}>
                <div className="kpi-label">{m.label}</div>
                <div className="kpi-value">
                  {value.toFixed(m.decimals ?? 0)}
                  <span className="kpi-suffix">{m.suffix}</span>
                </div>
                <div className="kpi-foot">
                  {state.dashboardTouched ? (
                    <span className={`chg ${dir}`}>
                      {dir === "up" ? "▲" : dir === "down" ? "▼" : "■"}{" "}
                      {dir === "flat"
                        ? "no change"
                        : `${sign}${delta.toFixed(m.decimals ?? 0)}`}
                    </span>
                  ) : (
                    <span className="chg down">▼ trending down</span>
                  )}
                  <Sparkline data={m.history} color="#9a7b4f" />
                </div>
                {moved ? <div className="kpi-reason">{moved.reason}</div> : null}
              </div>
            );
          })}

          {/* Brand-voice KPI */}
          <div className="kpi voice">
            <div className="kpi-label">Brand-voice consistency</div>
            <div className="kpi-value">
              {voiceScore}
              <span className="kpi-suffix">%</span>
            </div>
            <div className="bar">
              <span style={{ width: `${voiceScore}%` }} />
            </div>
            <div className="kpi-reason">
              {last
                ? last.judgment.criteria.voiceMatch?.reason
                : "How closely campaigns match Velara's voice."}
            </div>
          </div>
        </div>

        {/* Main trend chart */}
        <div className="panel">
          <div className="panel-head">
            <span>Engagement score · trend</span>
            {projected != null ? (
              <span className="legend">
                <span className="legend-dash" /> your draft&apos;s projection
              </span>
            ) : null}
          </div>
          <AreaChart
            data={engagementMetric.history}
            labels={ANALYTICS.weekLabels}
            projected={projected}
          />
        </div>

        {/* Breakdown row */}
        <div className="dash-row">
          <div className="panel half">
            <div className="panel-head">
              <span>Engagement by channel</span>
            </div>
            <div className="donut-row">
              <Donut segments={ANALYTICS.channels} />
              <div className="legend-list">
                {ANALYTICS.channels.map((c) => (
                  <div className="leg" key={c.name}>
                    <span className="sw" style={{ background: c.color }} />
                    {c.name}
                    <b>{c.share}%</b>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel half">
            <div className="panel-head">
              <span>Audience mix</span>
            </div>
            <div className="audience">
              {ANALYTICS.audience.map((a) => (
                <div className="aud" key={a.name}>
                  <div className="aud-top">
                    <span>
                      {a.name}
                      {a.target ? <em className="tgt">your target</em> : null}
                    </span>
                    <b>{a.share}%</b>
                  </div>
                  <div className="bar">
                    <span
                      style={{
                        width: `${a.share}%`,
                        background: a.target ? "#9a7b4f" : "#ccc3b2",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insight callout */}
        <div className="insight">
          <div className="insight-tag">What needs fixing</div>
          {ANALYTICS.insight}
        </div>

        {/* Recent campaigns table */}
        <div className="panel">
          <div className="panel-head">
            <span>Recent campaigns</span>
          </div>
          <table className="camp-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Sent</th>
                <th>Open</th>
                <th>CTR</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ANALYTICS.campaigns.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td className="muted">{c.sent}</td>
                  <td>{c.open}</td>
                  <td>{c.ctr}</td>
                  <td>
                    <span className="status">{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Window>
  );
}
