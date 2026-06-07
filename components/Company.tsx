"use client";

// The Company app, the new hire's orientation. What Velara is, the situation,
// the org structure and who runs what, and the brand voice rules. This is what
// gives the "I understand how this business works" footing before the task.

import {
  COMPANY,
  DEPARTMENTS,
  SITUATION,
  VOICE_RULES,
} from "@/config/case";
import Window from "./Window";

export default function Company() {
  return (
    <Window id="company" title="Company" glyph="🏛" width={600} height={580}>
      <div className="company">
        <div className="co-hero">
          <div className="co-name brand-script">{COMPANY.name}</div>
          <div className="co-tag">{COMPANY.tagline}</div>
          <div className="co-meta">
            Founded {COMPANY.founded} · {COMPANY.hq}
          </div>
        </div>

        <div className="co-section">
          <h3>About the company</h3>
          <p>{COMPANY.blurb}</p>
        </div>

        <div className="co-section">
          <h3>Where things stand</h3>
          <p className="co-situation">{SITUATION}</p>
        </div>

        <div className="co-section">
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
        </div>

        <div className="co-section">
          <h3>Brand voice: non-negotiable</h3>
          <div className="co-voice">{VOICE_RULES}</div>
          <p className="co-fine">
            Every word that leaves Velara follows these rules. They are how a
            client knows it&apos;s us.
          </p>
        </div>
      </div>
    </Window>
  );
}
