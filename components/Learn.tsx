"use client";

// Learn (Prepare): teach two generic, widely used frameworks, CO-STAR and
// RISEN, then SHOW the difference with a before/after example before the
// student writes anything. Ends by sending them to the comprehension gate.

import { BEFORE_AFTER, FRAMEWORKS, LEARN_COPY } from "@/config/learn";
import { useWorkstation } from "@/lib/state";

export default function Learn() {
  const { dispatch } = useWorkstation();

  return (
    <div className="learn">
      <div className="learn-intro">
        <div className="li-eyebrow">Step 1 · Learn how prompting works</div>
        <h2>A good prompt removes the guesswork</h2>
        <p>{LEARN_COPY.intro}</p>
      </div>

      <div className="frameworks">
        {FRAMEWORKS.map((f) => (
          <div className="fw" key={f.id}>
            <div className="fw-head">
              <div className="fw-name">{f.name}</div>
              <div className="fw-tag">{f.tagline}</div>
            </div>
            <div className="fw-letters">
              {f.letters.map((l) => (
                <div className="fw-row" key={l.name}>
                  <span className="fw-letter">{l.letter}</span>
                  <span className="fw-text">
                    <b>{l.name}</b> {l.blurb}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Before / after infographic */}
      <div className="ba">
        <div className="ba-head">See the difference</div>
        <div className="ba-sub">{BEFORE_AFTER.topic}</div>
        <div className="ba-grid">
          <div className="ba-col weak">
            <div className="ba-label">{BEFORE_AFTER.weak.label}</div>
            <div className="ba-prompt">{BEFORE_AFTER.weak.prompt}</div>
            <div className="ba-arrow">↓ produces</div>
            <div className="ba-output">{BEFORE_AFTER.weak.output}</div>
            <div className="ba-note">{BEFORE_AFTER.weak.note}</div>
          </div>
          <div className="ba-col strong">
            <div className="ba-label">{BEFORE_AFTER.strong.label}</div>
            <div className="ba-prompt">{BEFORE_AFTER.strong.prompt}</div>
            <div className="ba-arrow">↓ produces</div>
            <div className="ba-output">{BEFORE_AFTER.strong.output}</div>
            <div className="ba-note">{BEFORE_AFTER.strong.note}</div>
          </div>
        </div>
      </div>

      <div className="learn-foot">
        <button className="btn dark lg" onClick={() => dispatch({ type: "SET_STAGE", value: "quiz" })}>
          I understand, test me →
        </button>
      </div>
    </div>
  );
}
