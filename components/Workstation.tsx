"use client";

// The persistent shell: a top bar with Velara branding and the new hire, a
// desktop with app icons, a comms feed top-right, a dock for minimised panels,
// and whichever panels are currently open. The shell stays put while the work
// inside it changes.

import { COMPANY } from "@/config/case";
import { TOOLS } from "@/config/tools";
import { useWorkstation, type WindowId } from "@/lib/state";
import ClaudeTool from "./ClaudeTool";
import DashboardPanel from "./DashboardPanel";
import Inbox from "./Inbox";

const WINDOW_LABELS: Record<WindowId, string> = {
  inbox: "Inbox",
  dashboard: "Dashboard",
  claude: "Claude",
  debrief: "Debrief",
};

export default function Workstation() {
  const { state, dispatch } = useWorkstation();

  const open = (id: WindowId) => dispatch({ type: "OPEN_WINDOW", id });

  const minimized = (Object.keys(state.windows) as WindowId[]).filter(
    (id) => state.windows[id].open && state.windows[id].minimized,
  );

  return (
    <div className="workstation">
      {/* Top bar */}
      <div className="topbar">
        <div className="brand">VELARA</div>
        <div className="who">
          <span className="pill">{COMPANY.newHire.name}</span>
          <span className="pill">{COMPANY.newHire.role}</span>
        </div>
        <div className="topbar-right">
          <button
            className="notif-bell"
            title="Notifications"
            onClick={() => open("inbox")}
          >
            ✉
            {state.notificationVisible ? <span className="dot" /> : null}
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="desktop">
        <div className="icons">
          {/* Mail is always on the desktop so the inbox can be reopened. */}
          <button className="app-icon" onClick={() => open("inbox")}>
            <span className="glyph">✉</span>
            <span className="label">Mail</span>
          </button>

          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              className={`app-icon ${tool.id === "claude" ? "is-claude" : ""} ${
                tool.enabled ? "" : "locked"
              }`}
              title={tool.tagline}
              onClick={() => {
                if (tool.id === "claude" && tool.enabled) open("claude");
              }}
              aria-disabled={!tool.enabled}
            >
              <span className="glyph">{tool.glyph}</span>
              <span className="label">{tool.name}</span>
              {!tool.enabled ? <span className="lock">🔒 soon</span> : null}
            </button>
          ))}
        </div>

        {/* Entry notification toast */}
        {state.notificationVisible ? (
          <div className="toast" onClick={() => open("inbox")}>
            <div className="toast-from">New email · {COMPANY.manager.name}</div>
            <div className="toast-subject">Welcome to Velara</div>
            <div className="toast-cta">Open inbox →</div>
          </div>
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

        {/* Open panels */}
        {state.windows.inbox.open && !state.windows.inbox.minimized ? (
          <Inbox />
        ) : null}
        {state.windows.dashboard.open &&
        !state.windows.dashboard.minimized ? (
          <DashboardPanel />
        ) : null}
        {state.windows.claude.open && !state.windows.claude.minimized ? (
          <ClaudeTool />
        ) : null}

        {/* Dock for minimised panels */}
        <div className="dock">
          {minimized.map((id) => (
            <button key={id} className="dock-item" onClick={() => open(id)}>
              {WINDOW_LABELS[id]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
