"use client";

// The case study: who Velara is, the situation, how the company is organised,
// the brand voice, and the live dashboard (the problem made visible). From here
// the student starts the Prompt Engineering module.

import {
  COMPANY,
  DEPARTMENTS,
  SITUATION,
  VOICE_RULES,
} from "@/config/case";
import { useWorkstation } from "@/lib/state";
import Dashboard from "./Dashboard";

export default function CaseView() {
  const { dispatch } = useWorkstation();

  return (
    <div className="case">
      <button className="back" onClick={() => dispatch({ type: "SET_VIEW", value: "home" })}>
        ← Back to home
      </button>

      <div className="case-hero">
        <div className="ch-name brand-script">{COMPANY.name}</div>
        <div className="ch-tag">{COMPANY.tagline}</div>
        <div className="ch-meta">
          Founded {COMPANY.founded} · {COMPANY.hq}
        </div>
      </div>

      <div className="case-grid">
        <div className="case-col">
          <section className="case-card">
            <h3>About the company</h3>
            <p>{COMPANY.blurb}</p>
          </section>

          <section className="case-card">
            <h3>Where things stand</h3>
            <p className="case-situation">{SITUATION}</p>
          </section>

          <section className="case-card">
            <h3>How the company is organised</h3>
            <div className="org">
              {DEPARTMENTS.map((d) => (
                <div className="org-card" key={d.name}>
                  <div className="org-dept">{d.name}</div>
                  <div className="org-lead">{d.lead}</div>
                  <div className="org-blurb">{d.blurb}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="case-card">
            <h3>Brand voice: non-negotiable</h3>
            <div className="co-voice">{VOICE_RULES}</div>
            <p className="co-fine">Every word that leaves Velara follows these rules.</p>
          </section>
        </div>

        <div className="case-col">
          <section className="case-card no-pad">
            <Dashboard />
          </section>
        </div>
      </div>

      <div className="case-foot">
        <div>
          <div className="cf-title">Ready to fix it?</div>
          <div className="cf-text">
            The Prompt Engineering module will teach you the frameworks, then put
            you to work on Velara's autumn campaign.
          </div>
        </div>
        <button className="btn dark lg" onClick={() => dispatch({ type: "OPEN_MODULE" })}>
          Start Prompt Engineering →
        </button>
      </div>
    </div>
  );
}
