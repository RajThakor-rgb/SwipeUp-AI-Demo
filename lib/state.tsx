"use client";

// ============================================================================
// WORKSTATION STATE
// ----------------------------------------------------------------------------
// One reducer drives the whole experience: which screen we're on, which panels
// are open/minimised, which emails have been read, the live dashboard values,
// the recorded attempts, the comms feed, and the three full-screen interruption
// beats (onboarding, reaction, debrief). Kept deliberately small and explicit.
// ============================================================================

import React, { createContext, useContext, useReducer } from "react";
import { METRICS } from "@/config/case";
import type { Attempt } from "@/lib/types";

export type WindowId = "inbox" | "dashboard" | "claude" | "debrief";
export type Interruption = "onboarding" | "reaction" | "debrief" | null;

export interface CommsMessage {
  id: string;
  from: string;
  text: string;
}

export interface State {
  screen: "login" | "workstation";
  /** Open panels and whether each is minimised. */
  windows: Record<WindowId, { open: boolean; minimized: boolean }>;
  /** Whether the entry email notification is still showing. */
  notificationVisible: boolean;
  readEmailIds: string[];
  /** The task email only appears after onboarding has been read. */
  taskEmailArrived: boolean;
  /** Live dashboard values, keyed by metric id. */
  metrics: Record<string, number>;
  /** Has the dashboard been moved at least once (controls trend display). */
  dashboardTouched: boolean;
  attempts: Attempt[];
  comms: CommsMessage[];
  /** Which full-screen beat is showing, if any. */
  interruption: Interruption;
  reflection: string;
}

const initialMetrics: Record<string, number> = Object.fromEntries(
  METRICS.map((m) => [m.id, m.value]),
);

const initialState: State = {
  screen: "login",
  windows: {
    inbox: { open: false, minimized: false },
    dashboard: { open: false, minimized: false },
    claude: { open: false, minimized: false },
    debrief: { open: false, minimized: false },
  },
  notificationVisible: false,
  readEmailIds: [],
  taskEmailArrived: false,
  metrics: initialMetrics,
  dashboardTouched: false,
  attempts: [],
  comms: [],
  interruption: null,
  reflection: "",
};

export type Action =
  | { type: "SIGN_IN" }
  | { type: "SHOW_NOTIFICATION" }
  | { type: "OPEN_WINDOW"; id: WindowId }
  | { type: "CLOSE_WINDOW"; id: WindowId }
  | { type: "MINIMIZE_WINDOW"; id: WindowId }
  | { type: "READ_EMAIL"; id: string }
  | { type: "TASK_EMAIL_ARRIVED" }
  | { type: "SET_INTERRUPTION"; value: Interruption }
  | { type: "RECORD_ATTEMPT"; attempt: Attempt }
  | { type: "ADD_COMMS"; message: CommsMessage }
  | { type: "SET_REFLECTION"; value: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, screen: "workstation" };

    case "SHOW_NOTIFICATION":
      return { ...state, notificationVisible: true };

    case "OPEN_WINDOW":
      return {
        ...state,
        // Opening the inbox from its notification dismisses the notification.
        notificationVisible:
          action.id === "inbox" ? false : state.notificationVisible,
        windows: {
          ...state.windows,
          [action.id]: { open: true, minimized: false },
        },
      };

    case "CLOSE_WINDOW":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { open: false, minimized: false },
        },
      };

    case "MINIMIZE_WINDOW":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], minimized: true },
        },
      };

    case "READ_EMAIL":
      return state.readEmailIds.includes(action.id)
        ? state
        : { ...state, readEmailIds: [...state.readEmailIds, action.id] };

    case "TASK_EMAIL_ARRIVED":
      return { ...state, taskEmailArrived: true };

    case "SET_INTERRUPTION":
      return { ...state, interruption: action.value };

    case "RECORD_ATTEMPT":
      return {
        ...state,
        dashboardTouched: true,
        metrics: action.attempt.metricsAfter,
        attempts: [...state.attempts, action.attempt],
      };

    case "ADD_COMMS":
      return { ...state, comms: [...state.comms, action.message] };

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
