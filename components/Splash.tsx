"use client";

// The very first thing on opening the link: a SwipeUp AI Academy brand splash,
// shown before the University of Law portal (or before resuming a saved
// session). It moves on by itself after a beat, or on a click or key press.

import { useEffect, useState } from "react";
import { useWorkstation } from "@/lib/state";

export default function Splash() {
  const { dispatch } = useWorkstation();
  const [leaving, setLeaving] = useState(false);

  function advance() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => dispatch({ type: "END_SPLASH" }), 500);
  }

  useEffect(() => {
    const t = setTimeout(advance, 2600);
    function onKey() {
      advance();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`splash ${leaving ? "splash-out" : ""}`}
      onClick={advance}
      role="button"
      tabIndex={0}
      aria-label="Enter SwipeUp AI Academy"
    >
      <div className="splash-inner">
        <span className="splash-logo">S</span>
        <div className="splash-name">
          SwipeUp <em>AI Academy</em>
        </div>
        <div className="splash-tag">Learn by doing. Real company, real AI.</div>
      </div>
      <div className="splash-foot">Continue</div>
    </div>
  );
}
