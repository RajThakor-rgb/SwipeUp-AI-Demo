"use client";

// The post-login learning platform shell: a clean header and the current view
// (course home, the case study, or the Prompt Engineering module).

import { COMPANY, UNIVERSITY } from "@/config/case";
import { useWorkstation } from "@/lib/state";
import { useClock } from "@/lib/useClock";
import CaseView from "./CaseView";
import Home from "./Home";
import ModuleView from "./ModuleView";

export default function AppShell() {
  const { state, dispatch } = useWorkstation();
  const now = useClock();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="app">
      <header className="appbar">
        <button className="appbar-brand" onClick={() => dispatch({ type: "SET_VIEW", value: "home" })}>
          <span className="ab-logo">S</span>
          <span className="ab-name">
            SwipeUp <em>AI Academy</em>
          </span>
        </button>

        <div className="appbar-mid">{UNIVERSITY.name}</div>

        <div className="appbar-right">
          <span className="ab-who">
            {COMPANY.newHire.name} · {COMPANY.newHire.role}
          </span>
          <span className="ab-avatar">
            {COMPANY.newHire.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="ab-clock">{time}</span>
        </div>
      </header>

      <main className="app-main">
        {state.view === "home" ? <Home /> : null}
        {state.view === "case" ? <CaseView /> : null}
        {state.view === "module" ? <ModuleView /> : null}
      </main>
    </div>
  );
}
