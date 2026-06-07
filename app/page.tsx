"use client";

// Entry point. Wraps the simulation in state and routes between the startup
// screens (university portal → boot → OS lock → desktop), with the full-screen
// interruption beats layered on top of the desktop.

import Boot from "@/components/Boot";
import Desktop from "@/components/Desktop";
import Interruption from "@/components/Interruption";
import Lock from "@/components/Lock";
import Portal from "@/components/Portal";
import { useWorkstation, WorkstationProvider } from "@/lib/state";

function Experience() {
  const { state } = useWorkstation();
  return (
    <>
      {state.screen === "portal" ? <Portal /> : null}
      {state.screen === "boot" ? <Boot /> : null}
      {state.screen === "lock" ? <Lock /> : null}
      {state.screen === "desktop" ? <Desktop /> : null}
      {state.screen === "desktop" ? <Interruption /> : null}
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
