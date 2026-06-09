"use client";

// Review (Consolidate): make the lesson conscious. First attempt next to the
// strongest one, the one principle that moved the needle, and a short written
// reflection. Ends by returning home with the next module teased.

import { DEBRIEF } from "@/config/case";
import { useWorkstation } from "@/lib/state";

export default function Consolidate() {
  const { state, dispatch } = useWorkstation();
  const first = state.attempts[0];
  // "Best" = the highest-banded attempt, falling back to the last one.
  const order = { weak: 0, middling: 1, strong: 2 } as const;
  const best = [...state.attempts].sort(
    (a, b) => order[b.judgment.band] - order[a.judgment.band],
  )[0];

  if (!first || !best) {
    return (
      <div className="consolidate">
        <p>Complete at least one prompt to see your review.</p>
        <button className="btn dark" onClick={() => dispatch({ type: "SET_STAGE", value: "practice" })}>
          Back to practice
        </button>
      </div>
    );
  }

  return (
    <div className="consolidate">
      <div className="learn-intro">
        <div className="li-eyebrow">Step 3 · Review</div>
        <h2>What moved the needle</h2>
        <p>Here is your first instinct next to your strongest prompt. The difference is the lesson.</p>
      </div>

      <div className="compare">
        <div className="col first">
          <div className="col-head">Your first attempt</div>
          <div className="c-subject">{first.email.subject}</div>
          <div className="c-body">{first.email.body}</div>
        </div>
        <div className="col best">
          <div className="col-head">Your strongest attempt</div>
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
        onChange={(e) => dispatch({ type: "SET_REFLECTION", value: e.target.value })}
      />

      <div className="consolidate-foot">
        <div className="cf-done">
          <div className="cf-done-tag">Module complete</div>
          <div className="cf-done-text">
            You have used a real framework on a real business problem. The next
            module, Chatbot Creation, is now within reach.
          </div>
        </div>
        <button className="btn dark lg" onClick={() => dispatch({ type: "SET_VIEW", value: "home" })}>
          Back to home →
        </button>
      </div>
    </div>
  );
}
