"use client";

// Entry point. Wraps the experience in the workstation state provider and shows
// the login screen or the workstation, with the full-screen interruption beats
// layered on top.

import Interruption from "@/components/Interruption";
import LoginScreen from "@/components/LoginScreen";
import Workstation from "@/components/Workstation";
import { useWorkstation, WorkstationProvider } from "@/lib/state";

function Experience() {
  const { state } = useWorkstation();
  return (
    <>
      {state.screen === "login" ? <LoginScreen /> : <Workstation />}
      <Interruption />
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
