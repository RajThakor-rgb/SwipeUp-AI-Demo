"use client";

// ============================================================================
// WORKSTATION STATE
// ----------------------------------------------------------------------------
// One reducer drives the whole simulation: the boot/lock/desktop screens, the
// window manager (open / minimised / focus order for z-index), which emails are
// read, the live dashboard values, recorded attempts, the comms feed, and the
// three full-screen interruption beats (onboarding, reaction, debrief).
// ============================================================================

import React, { createContext, useContext, useReducer } from "react";
import { METRICS } from "@/config/case";
import type { Attempt } from "@/lib/types";

export type Screen = "portal" | "boot" | "lock" | "desktop";
export type WindowId = "inbox" | "dashboard" | "claude" | "company";
export type Interruption = "onboarding" | "reaction" | "debrief" | null;

export interface CommsMessage {
  id: string;
  from: string;
  text: string;
}

export interface State {
  screen: Screen;
  windows: Record<WindowId, { open: boolean; minimized: boolean }>;
  /** Focus order, last = top-most. Drives z-index. */
  zStack: WindowId[];
  notificationVisible: boolean;
  readEmailIds: string[];
  taskEmailArrived: boolean;
  metrics: Record<string, number>;
  dashboardTouched: boolean;
  attempts: Attempt[];
  comms: CommsMessage[];
  interruption: Interruption;
  reflection: string;
}

const initialMetrics: Record<string, number> = Object.fromEntries(
  METRICS.map((m) => [m.id, m.value]),
);

const initialState: State = {
  screen: "portal",
  windows: {
    inbox: { open: false, minimized: false },
    dashboard: { open: false, minimized: false },
    claude: { open: false, minimized: false },
    company: { open: false, minimized: false },
  },
  zStack: [],
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
  | { type: "SET_SCREEN"; value: Screen }
  | { type: "SHOW_NOTIFICATION" }
  | { type: "OPEN_WINDOW"; id: WindowId }
  | { type: "CLOSE_WINDOW"; id: WindowId }
  | { type: "MINIMIZE_WINDOW"; id: WindowId }
  | { type: "FOCUS_WINDOW"; id: WindowId }
  | { type: "READ_EMAIL"; id: string }
  | { type: "TASK_EMAIL_ARRIVED" }
  | { type: "SET_INTERRUPTION"; value: Interruption }
  | { type: "RECORD_ATTEMPT"; attempt: Attempt }
  | { type: "ADD_COMMS"; message: CommsMessage }
  | { type: "SET_REFLECTION"; value: string };

/** Move an id to the top of the focus stack. */
function raise(stack: WindowId[], id: WindowId): WindowId[] {
  return [...stack.filter((w) => w !== id), id];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.value };

    case "SHOW_NOTIFICATION":
      return { ...state, notificationVisible: true };

    case "OPEN_WINDOW":
      return {
        ...state,
        notificationVisible:
          action.id === "inbox" ? false : state.notificationVisible,
        windows: {
          ...state.windows,
          [action.id]: { open: true, minimized: false },
        },
        zStack: raise(state.zStack, action.id),
      };

    case "CLOSE_WINDOW":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { open: false, minimized: false },
        },
        zStack: state.zStack.filter((w) => w !== action.id),
      };

    case "MINIMIZE_WINDOW":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], minimized: true },
        },
      };

    case "FOCUS_WINDOW":
      return { ...state, zStack: raise(state.zStack, action.id) };

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
