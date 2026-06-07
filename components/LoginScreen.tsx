"use client";

// OS-style login. Visual only — no real authentication. Clicking sign in goes
// straight in and, shortly after, the first email notification appears.

import { COMPANY } from "@/config/case";
import { useWorkstation } from "@/lib/state";

export default function LoginScreen() {
  const { dispatch } = useWorkstation();

  function signIn() {
    dispatch({ type: "SIGN_IN" });
    // The welcome notification lands a beat after the desktop loads.
    setTimeout(() => dispatch({ type: "SHOW_NOTIFICATION" }), 1100);
  }

  const initials = COMPANY.newHire.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-avatar">{initials}</div>
        <h1>{COMPANY.newHire.name}</h1>
        <div className="role">
          {COMPANY.newHire.role} · {COMPANY.name}
        </div>
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          aria-label="Password"
          defaultValue="••••••••"
          onKeyDown={(e) => e.key === "Enter" && signIn()}
        />
        <button className="btn block" onClick={signIn}>
          Sign in
        </button>
        <div className="login-hint">
          <span className="brand-script">{COMPANY.name}</span> workstation ·
          demo environment
        </div>
      </div>
    </div>
  );
}
