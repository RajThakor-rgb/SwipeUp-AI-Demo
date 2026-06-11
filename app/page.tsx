"use client";

// Entry point. The OS-style opening (portal -> boot -> lock) leads into the
// learning platform (AppShell): course home, the case, and the guided module.

import AppShell from "@/components/AppShell";
import Boot from "@/components/Boot";
import Lock from "@/components/Lock";
import Portal from "@/components/Portal";
import Splash from "@/components/Splash";
import { useWorkstation, WorkstationProvider } from "@/lib/state";

function Experience() {
  const { state } = useWorkstation();
  return (
    <>
      {state.screen === "splash" ? <Splash /> : null}
      {state.screen === "portal" ? <Portal /> : null}
      {state.screen === "boot" ? <Boot /> : null}
      {state.screen === "lock" ? <Lock /> : null}
      {state.screen === "app" ? <AppShell /> : null}
    </>
  );
}

export default function Page() {
  return (
    <WorkstationProvider>
      <Experience />
    </WorkstationProvider>
  );
}
