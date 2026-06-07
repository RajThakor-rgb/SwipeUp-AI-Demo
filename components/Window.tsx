"use client";

// A draggable, focusable desktop window: drag by the title bar, click to bring
// to front, close / minimise from the traffic-light buttons. Not a heavyweight
// window manager — just enough to feel like a real OS desktop.

import { useEffect, useRef, useState } from "react";
import type { WindowId } from "@/lib/state";
import { useWorkstation } from "@/lib/state";

let spawn = 0; // small cascade so opened windows don't stack exactly

export default function Window({
  id,
  title,
  glyph,
  width,
  height,
  defaultX,
  defaultY,
  canMinimize = true,
  children,
}: {
  id: WindowId;
  title: string;
  glyph?: string;
  width: number;
  height: number;
  defaultX?: number;
  defaultY?: number;
  canMinimize?: boolean;
  children: React.ReactNode;
}) {
  const { state, dispatch } = useWorkstation();
  const [pos, setPos] = useState(() => {
    const offset = (spawn++ % 5) * 26;
    return {
      x: defaultX ?? Math.max(20, (window.innerWidth - width) / 2 + offset),
      y: defaultY ?? 70 + offset,
    };
  });
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const z = 100 + state.zStack.indexOf(id);

  useEffect(() => {
    function move(e: PointerEvent) {
      if (!drag.current) return;
      const x = Math.min(
        window.innerWidth - 80,
        Math.max(-width + 120, e.clientX - drag.current.dx),
      );
      const y = Math.min(
        window.innerHeight - 60,
        Math.max(40, e.clientY - drag.current.dy),
      );
      setPos({ x, y });
    }
    function up() {
      drag.current = null;
      document.body.style.userSelect = "";
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [width]);

  function startDrag(e: React.PointerEvent) {
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    document.body.style.userSelect = "none";
    dispatch({ type: "FOCUS_WINDOW", id });
  }

  return (
    <div
      className="window"
      role="dialog"
      aria-label={title}
      style={{ left: pos.x, top: pos.y, width, height, zIndex: z }}
      onPointerDown={() => dispatch({ type: "FOCUS_WINDOW", id })}
    >
      <div className="window-bar" onPointerDown={startDrag}>
        <span className="win-dots">
          <button
            className="win-dot close"
            title="Close"
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => dispatch({ type: "CLOSE_WINDOW", id })}
          />
          <button
            className={`win-dot min ${canMinimize ? "" : "disabled"}`}
            title="Minimise"
            aria-label="Minimise"
            disabled={!canMinimize}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => dispatch({ type: "MINIMIZE_WINDOW", id })}
          />
          <span className="win-dot full" />
        </span>
        <span className="title">
          {glyph ? <span aria-hidden>{glyph}</span> : null}
          {title}
        </span>
        <span className="win-spacer" />
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
}
