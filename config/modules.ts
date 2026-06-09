// ============================================================================
// MODULES — the course landing tiles
// ----------------------------------------------------------------------------
// Prompt Engineering is the one unlocked module. The rest are locked and exist
// to show the roadmap: "master prompt engineering to unlock the next level."
// Adding a real module later = flipping `locked` and wiring its view.
// ============================================================================

export interface Module {
  id: string;
  name: string;
  glyph: string;
  blurb: string;
  locked: boolean;
  /** Shown on locked tiles. */
  unlockHint?: string;
}

export const MODULES: Module[] = [
  {
    id: "prompt",
    name: "Prompt Engineering",
    glyph: "✳",
    blurb: "Learn the frameworks the pros use, then direct an AI to fix a real company's campaign.",
    locked: false,
  },
  {
    id: "chatbot",
    name: "Chatbot Creation",
    glyph: "◎",
    blurb: "Design an AI assistant that answers customers without losing the brand's voice.",
    locked: true,
    unlockHint: "Unlocks after Prompt Engineering",
  },
  {
    id: "automation",
    name: "Workflow Automation",
    glyph: "⚙",
    blurb: "Chain AI steps together to kill repetitive manual work.",
    locked: true,
    unlockHint: "Unlocks after Prompt Engineering",
  },
  {
    id: "data",
    name: "Data Analysis",
    glyph: "▦",
    blurb: "Turn messy business data into decisions with AI.",
    locked: true,
    unlockHint: "Unlocks after Prompt Engineering",
  },
  {
    id: "insights",
    name: "Customer Insights",
    glyph: "◍",
    blurb: "Read what customers really feel and act on it.",
    locked: true,
    unlockHint: "Unlocks after Prompt Engineering",
  },
];
