"use client";

// Simple open / close / minimise panel frame. Not a draggable window manager —
// deliberately, per the brief. Each panel chooses a size preset via `sizeClass`.

import type { WindowId } from "@/lib/state";
import { useWorkstation } from "@/lib/state";

export default function Window({
  id,
  title,
  glyph,
  sizeClass,
  canMinimize = true,
  children,
}: {
  id: WindowId;
  title: string;
  glyph?: string;
  sizeClass: string;
  canMinimize?: boolean;
  children: React.ReactNode;
}) {
  const { dispatch } = useWorkstation();

  return (
    <div className={`window ${sizeClass}`} role="dialog" aria-label={title}>
      <div className="window-bar">
        <span className="title">
          {glyph ? <span aria-hidden>{glyph}</span> : null}
          {title}
        </span>
        <span className="win-dots">
          <button
            className={`win-dot min ${canMinimize ? "" : "disabled"}`}
            title="Minimise"
            aria-label="Minimise"
            disabled={!canMinimize}
            onClick={() => dispatch({ type: "MINIMIZE_WINDOW", id })}
          />
          <button
            className="win-dot close"
            title="Close"
            aria-label="Close"
            onClick={() => dispatch({ type: "CLOSE_WINDOW", id })}
          />
        </span>
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
}
