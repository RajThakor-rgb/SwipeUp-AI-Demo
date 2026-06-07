"use client";

// Boot splash, the "starting a laptop" moment between the university portal
// and the OS lock screen.

import { useEffect } from "react";
import { COMPANY } from "@/config/case";
import { useWorkstation } from "@/lib/state";

export default function Boot() {
  const { dispatch } = useWorkstation();

  useEffect(() => {
    const t = setTimeout(
      () => dispatch({ type: "SET_SCREEN", value: "lock" }),
      2100,
    );
    return () => clearTimeout(t);
  }, [dispatch]);

  return (
    <div className="boot">
      <div className="boot-logo brand-script">{COMPANY.name}</div>
      <div className="boot-bar">
        <span />
      </div>
      <div className="boot-sub">Starting your workstation…</div>
    </div>
  );
}
