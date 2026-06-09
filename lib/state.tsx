"use client";

// ============================================================================
// SIMULATION STATE
// ----------------------------------------------------------------------------
// A learning platform, not a desktop. After the OS-style entry (portal -> boot
// -> lock), the student lands in the app: a course home with module tiles, a
// case view (with the dashboard inside it), and the Prompt Engineering module
// which runs a guided lesson: learn -> quiz gate -> practice -> consolidate.
// ============================================================================

import React, { createContext, useContext, useReducer } from "react";
import { METRICS } from "@/config/case";
import type { Attempt } from "@/lib/types";

export type Screen = "portal" | "boot" | "lock" | "app";
export type View = "home" | "case" | "module";
export type Stage = "learn" | "quiz" | "practice" | "consolidate";

export interface State {
  screen: Screen;
  view: View;
  stage: Stage;
  quizPassed: boolean;
  metrics: Record<string, number>;
  dashboardTouched: boolean;
  attempts: Attempt[];
  reflection: string;
}

const initialMetrics: Record<string, number> = Object.fromEntries(
  METRICS.map((m) => [m.id, m.value]),
);

const initialState: State = {
  screen: "portal",
  view: "home",
  stage: "learn",
  quizPassed: false,
  metrics: initialMetrics,
  dashboardTouched: false,
  attempts: [],
  reflection: "",
};

export type Action =
  | { type: "SET_SCREEN"; value: Screen }
  | { type: "ENTER_APP" }
  | { type: "SET_VIEW"; value: View }
  | { type: "OPEN_MODULE" }
  | { type: "SET_STAGE"; value: Stage }
  | { type: "PASS_QUIZ" }
  | { type: "RECORD_ATTEMPT"; attempt: Attempt }
  | { type: "SET_REFLECTION"; value: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.value };

    case "ENTER_APP":
      return { ...state, screen: "app", view: "home" };

    case "SET_VIEW":
      return { ...state, view: action.value };

    case "OPEN_MODULE":
      // If they already passed the quiz, drop them straight into practice.
      return {
        ...state,
        view: "module",
        stage: state.quizPassed ? "practice" : "learn",
      };

    case "SET_STAGE":
      return { ...state, view: "module", stage: action.value };

    case "PASS_QUIZ":
      return { ...state, quizPassed: true };

    case "RECORD_ATTEMPT":
      return {
        ...state,
        dashboardTouched: true,
        metrics: action.attempt.metricsAfter,
        attempts: [...state.attempts, action.attempt],
      };

    case "SET_REFLECTION":
      return { ...state, reflection: action.value };

    default:
      return state;
  }
}

const StateContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function WorkstationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

export function useWorkstation() {
  const ctx = useContext(StateContext);
  if (!ctx) {
    throw new Error("useWorkstation must be used within WorkstationProvider");
  }
  return ctx;
}
