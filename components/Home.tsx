"use client";

// Course home: a welcome, a "understand the case" banner (the way into the
// business problem and its dashboard), and the module tiles. Prompt Engineering
// is unlocked; the rest are locked and show the roadmap.

import { COMPANY } from "@/config/case";
import { MODULES } from "@/config/modules";
import { useWorkstation } from "@/lib/state";

export default function Home() {
  const { state, dispatch } = useWorkstation();

  return (
    <div className="home">
      <div className="home-welcome">
        <div className="hw-eyebrow">Welcome back</div>
        <h1>
          Hello {COMPANY.newHire.name}. Ready to learn by doing?
        </h1>
        <p>
          You will join a real company, take on a real problem, and use AI to
          solve it, then watch the business react to your work. Start by
          understanding the company you are helping.
        </p>
      </div>

      {/* Case banner */}
      <button className="case-banner" onClick={() => dispatch({ type: "SET_VIEW", value: "case" })}>
        <div className="cb-left">
          <div className="cb-tag">Your case</div>
          <div className="cb-title">Understand {COMPANY.name}</div>
          <div className="cb-text">
            A luxury fashion brand whose campaigns are sliding. See the business,
            the problem, and the live dashboard before you begin.
          </div>
        </div>
        <div className="cb-cta">Open case →</div>
      </button>

      <div className="home-modules-head">
        <span>Modules</span>
        <span className="hm-note">Master one to unlock the next</span>
      </div>

      <div className="modules">
        {MODULES.map((m) => (
          <button
            key={m.id}
            className={`module-tile ${m.locked ? "locked" : ""}`}
            disabled={m.locked}
            onClick={() => {
              if (m.locked) return;
              if (m.id === "chatbot") dispatch({ type: "SET_VIEW", value: "chatbot" });
              else dispatch({ type: "OPEN_MODULE" });
            }}
          >
            <div className="mt-top">
              <span className="mt-glyph">{m.glyph}</span>
              {m.locked ? <span className="mt-lock">🔒</span> : <span className="mt-open">Start →</span>}
            </div>
            <div className="mt-name">{m.name}</div>
            <div className="mt-blurb">{m.blurb}</div>
            {m.locked ? (
              <div className="mt-hint">{m.unlockHint}</div>
            ) : (
              <div className="mt-progress">
                {state.attempts.length > 0 ? "In progress" : "Not started"}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
