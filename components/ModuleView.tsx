"use client";

// The Prompt Engineering module. A simple Learn -> Practise -> Review stepper
// (the PACK model stays internal; the student just sees plain-English steps),
// then the stage's content.

import { useWorkstation } from "@/lib/state";
import Consolidate from "./Consolidate";
import Learn from "./Learn";
import Practice from "./Practice";
import Quiz from "./Quiz";

const STEPS: { key: string; label: string; stages: string[] }[] = [
  { key: "learn", label: "Learn", stages: ["learn", "quiz"] },
  { key: "practise", label: "Practise", stages: ["practice"] },
  { key: "review", label: "Review", stages: ["consolidate"] },
];

export default function ModuleView() {
  const { state, dispatch } = useWorkstation();
  const activeIndex = STEPS.findIndex((s) => s.stages.includes(state.stage));

  return (
    <div className="module">
      <div className="module-head">
        <button className="back" onClick={() => dispatch({ type: "SET_VIEW", value: "home" })}>
          ← Home
        </button>
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s.key} className={`step ${i === activeIndex ? "active" : ""} ${i < activeIndex ? "done" : ""}`}>
              <span className="step-dot">{i < activeIndex ? "✓" : i + 1}</span>
              <span className="step-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="module-title">Prompt Engineering</div>
      </div>

      <div className="module-body">
        {state.stage === "learn" ? <Learn /> : null}
        {state.stage === "quiz" ? <Quiz /> : null}
        {state.stage === "practice" ? <Practice /> : null}
        {state.stage === "consolidate" ? <Consolidate /> : null}
      </div>
    </div>
  );
}
