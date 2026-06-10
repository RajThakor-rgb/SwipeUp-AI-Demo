"use client";

// ============================================================================
// SIMULATION STATE
// ----------------------------------------------------------------------------
// A learning platform, not a desktop. After the OS-style entry (portal -> boot
// -> lock), the student lands in the app: a course home with module tiles, a
// case view (with the dashboard inside it), and the Prompt Engineering module
// which runs a guided lesson: learn -> quiz gate -> practice -> consolidate.
// ============================================================================

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { METRICS } from "@/config/case";
import type { Attempt } from "@/lib/types";

// Where the session is persisted so a student can log off and resume later.
const STORAGE_KEY = "swipeup.session.v1";

export type Screen = "portal" | "boot" | "lock" | "app";
export type View = "home" | "case" | "module" | "chatbot";
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
  | { type: "LOG_OFF" }
  | { type: "HYDRATE"; value: Partial<State> }
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
      // Keep whatever view the student was last on, so logging back in resumes
      // them where they stopped. On a first login the view is already "home".
      return { ...state, screen: "app" };

    case "LOG_OFF":
      // Return to the lock screen but keep all progress; localStorage retains
      // it so the next sign-in lands back on the same view.
      return { ...state, screen: "lock" };

    case "HYDRATE":
      // Restore a saved session, tolerating older or partial saved shapes.
      return { ...initialState, ...action.value };

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
  const [hydrated, setHydrated] = useState(false);

  // Load any saved session once, on the client. We hydrate in an effect (not
  // during render) so the server and first client render match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "HYDRATE", value: JSON.parse(saved) });
    } catch {
      /* corrupt or unavailable storage, start fresh */
    }
    setHydrated(true);
  }, []);

  // Persist every change so progress survives a log off, refresh, or close.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be full or blocked, carry on */
    }
  }, [state, hydrated]);

  // Hold rendering until the saved session is restored, so a returning student
  // never sees a flash of the portal before resuming.
  if (!hydrated) return null;

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
