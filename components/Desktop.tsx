"use client";

// The persistent desktop: a top menu bar (company + live clock + status), a
// wallpaper with app icons, a dock that launches apps and shows what's running,
// a quiet comms feed, and whichever windows are open. The shell stays put while
// the work inside it changes.

import { COMPANY } from "@/config/case";
import { TOOLS } from "@/config/tools";
import { useWorkstation, type WindowId } from "@/lib/state";
import { useClock } from "@/lib/useClock";
import ClaudeTool from "./ClaudeTool";
import Company from "./Company";
import DashboardPanel from "./DashboardPanel";
import Inbox from "./Inbox";

interface AppDef {
  id: WindowId;
  name: string;
  glyph: string;
  cls?: string;
}

const CORE_APPS: AppDef[] = [
  { id: "inbox", name: "Mail", glyph: "✉" },
  { id: "company", name: "Company", glyph: "🏛" },
  { id: "dashboard", name: "Dashboard", glyph: "▣" },
  { id: "claude", name: "Claude", glyph: "✳", cls: "is-claude" },
];

export default function Desktop() {
  const { state, dispatch } = useWorkstation();
  const now = useClock();
  const open = (id: WindowId) => dispatch({ type: "OPEN_WINDOW", id });

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="desktop-screen">
      {/* Top menu bar */}
      <div className="menubar">
        <div className="mb-left">
          <span className="mb-brand brand-script">{COMPANY.name}</span>
          <span className="mb-app">Workspace</span>
        </div>
        <div className="mb-right">
          <span className="mb-who">
            {COMPANY.newHire.name} · {COMPANY.newHire.role}
          </span>
          <span className="mb-icon">📶</span>
          <span className="mb-icon">🔋</span>
          <span className="mb-clock">
            {date} &nbsp;{time}
          </span>
        </div>
      </div>

      {/* Wallpaper + desktop icons */}
      <div className="desk">
        <div className="desk-icons">
          {CORE_APPS.map((a) => (
            <button key={a.id} className={`desk-icon ${a.cls ?? ""}`} onDoubleClick={() => open(a.id)} onClick={() => open(a.id)}>
              <span className="di-glyph">{a.glyph}</span>
              <span className="di-label">{a.name}</span>
            </button>
          ))}
          {TOOLS.filter((t) => !t.enabled).map((t) => (
            <div key={t.id} className="desk-icon locked" title={t.tagline}>
              <span className="di-glyph">{t.glyph}</span>
              <span className="di-label">{t.name}</span>
              <span className="di-lock">🔒 soon</span>
            </div>
          ))}
        </div>

        {/* Entry notification toast */}
        {state.notificationVisible ? (
          <button className="toast" onClick={() => open("inbox")}>
            <div className="toast-from">New email · Human Resources</div>
            <div className="toast-subject">Welcome to Velara — your first week</div>
            <div className="toast-cta">Open Mail →</div>
          </button>
        ) : null}

        {/* Comms feed */}
        <div className="comms">
          {state.comms.map((m) => (
            <div className="comms-msg" key={m.id}>
              <div className="cm-from">{m.from}</div>
              <div className="cm-text">{m.text}</div>
            </div>
          ))}
        </div>

        {/* Open windows */}
        {state.windows.inbox.open && !state.windows.inbox.minimized ? <Inbox /> : null}
        {state.windows.company.open && !state.windows.company.minimized ? <Company /> : null}
        {state.windows.dashboard.open && !state.windows.dashboard.minimized ? <DashboardPanel /> : null}
        {state.windows.claude.open && !state.windows.claude.minimized ? <ClaudeTool /> : null}
      </div>

      {/* Dock */}
      <div className="dock">
        {CORE_APPS.map((a) => {
          const w = state.windows[a.id];
          return (
            <button
              key={a.id}
              className={`dock-app ${a.cls ?? ""}`}
              title={a.name}
              onClick={() => open(a.id)}
            >
              <span className="da-glyph">{a.glyph}</span>
              {w.open ? <span className="da-dot" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
