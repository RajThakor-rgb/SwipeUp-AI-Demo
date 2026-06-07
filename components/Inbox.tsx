"use client";

// Full-screen inbox. One unread onboarding email, a task email that arrives
// after onboarding is read, and locked teaser emails for future tools that
// cannot be opened.

import { useState } from "react";
import { EMAILS } from "@/config/case";
import { useWorkstation } from "@/lib/state";
import Window from "./Window";

export default function Inbox() {
  const { state, dispatch } = useWorkstation();
  const [selected, setSelected] = useState<string | null>(null);

  // Build the visible list: hide the task email until it has "arrived".
  const visible = EMAILS.filter(
    (e) => !e.arrivesAfterOnboarding || state.taskEmailArrived,
  );

  function selectEmail(id: string, locked?: boolean) {
    if (locked) return;
    setSelected(id);

    // Opening the onboarding email for the first time is the full-screen
    // onboarding beat. Subsequent opens just show it in the reading pane.
    if (id === "onboarding" && !state.readEmailIds.includes("onboarding")) {
      dispatch({ type: "READ_EMAIL", id });
      dispatch({ type: "SET_INTERRUPTION", value: "onboarding" });
      return;
    }
    dispatch({ type: "READ_EMAIL", id });
  }

  const current = visible.find((e) => e.id === selected) ?? null;

  return (
    <Window id="inbox" title="Inbox" glyph="✉" sizeClass="size-inbox">
      <div className="inbox">
        <div className="inbox-list">
          <div className="inbox-head">Mail</div>
          {visible.map((email) => {
            const unread =
              !email.locked && !state.readEmailIds.includes(email.id);
            return (
              <button
                key={email.id}
                className={`mail-item ${email.locked ? "locked" : ""} ${
                  selected === email.id ? "active" : ""
                }`}
                onClick={() => selectEmail(email.id, email.locked)}
                aria-disabled={email.locked}
              >
                <div className="mail-from">
                  <span>{email.from}</span>
                  {email.locked ? (
                    <span className="lock-tag">🔒 locked</span>
                  ) : null}
                </div>
                <div className="mail-subject">
                  {unread ? <span className="unread-dot" /> : null}
                  {email.subject}
                </div>
                <div className="mail-preview">{email.preview}</div>
              </button>
            );
          })}
        </div>

        {current && current.body ? (
          <div className="mail-read">
            <div className="r-from">From: {current.from}</div>
            <div className="r-subject">{current.subject}</div>
            <div className="r-body">{renderBody(current.body)}</div>
            {current.opensDashboard ? (
              <button
                className="dash-link"
                onClick={() => dispatch({ type: "OPEN_WINDOW", id: "dashboard" })}
              >
                Open the marketing dashboard →
              </button>
            ) : null}
          </div>
        ) : (
          <div className="mail-empty">Select an email to read it.</div>
        )}
      </div>
    </Window>
  );
}

// Render the body, turning the "[Open the marketing dashboard]" placeholder
// line into nothing (the real button is rendered separately below the body).
function renderBody(body: string) {
  return body
    .split("\n")
    .filter((line) => !line.trim().startsWith("[Open the marketing dashboard]"))
    .join("\n");
}
