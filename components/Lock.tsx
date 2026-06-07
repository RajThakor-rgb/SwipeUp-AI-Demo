"use client";

// OS-style lock screen: wallpaper, live clock, the user (Raj) and a password
// field. Visual only — any password (or just Enter) signs in. On unlock the
// desktop loads and the first email notification lands a beat later.

import { useEffect, useState } from "react";
import { COMPANY } from "@/config/case";
import { useWorkstation } from "@/lib/state";
import { useClock } from "@/lib/useClock";

export default function Lock() {
  const { dispatch } = useWorkstation();
  const now = useClock();
  const [pw, setPw] = useState("••••••••");
  const [entering, setEntering] = useState(false);

  function unlock() {
    setEntering(true);
    setTimeout(() => {
      dispatch({ type: "SET_SCREEN", value: "desktop" });
      setTimeout(() => dispatch({ type: "SHOW_NOTIFICATION" }), 1300);
    }, 650);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") unlock();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const initials = COMPANY.newHire.name.slice(0, 2).toUpperCase();

  return (
    <div className={`lock ${entering ? "lock-out" : ""}`}>
      <div className="lock-clock">
        <div className="lock-time">{time}</div>
        <div className="lock-date">{date}</div>
      </div>

      <div className="lock-user">
        <div className="lock-avatar">{initials}</div>
        <div className="lock-name">{COMPANY.newHire.name}</div>
        <div className="lock-role">
          {COMPANY.newHire.role} · {COMPANY.name}
        </div>
        <div className="lock-pw">
          <input
            type="password"
            value={pw}
            autoFocus
            aria-label="Password"
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && unlock()}
          />
          <button className="lock-go" onClick={unlock} aria-label="Sign in">
            →
          </button>
        </div>
        <div className="lock-hint">Press Enter to sign in</div>
      </div>

      <div className="lock-foot brand-script">{COMPANY.name}</div>
    </div>
  );
}
