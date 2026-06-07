// ============================================================================
// TOOL REGISTRY
// ----------------------------------------------------------------------------
// The desktop renders one icon per entry. The shell is tool-agnostic: adding a
// future tool means adding an entry here (and a teaser email in case.ts), not
// rebuilding the workstation. Only `claude` is enabled for v1.
// ============================================================================

import type { ToolConfig } from "@/lib/types";

export const TOOLS: ToolConfig[] = [
  {
    id: "claude",
    name: "Claude",
    glyph: "✳",
    tagline: "Velara's AI tool — direct it, judge what comes back.",
    enabled: true,
  },
  {
    id: "chatbot",
    name: "Customer Chatbot",
    glyph: "◎",
    tagline: "Coming soon — answer order questions automatically.",
    enabled: false,
  },
  {
    id: "automation",
    name: "Automation",
    glyph: "⚙",
    tagline: "Coming soon — kill the manual rekeying.",
    enabled: false,
  },
];
