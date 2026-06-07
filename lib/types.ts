// Shared types for the SwipeUp workstation shell and the result engine.
// Keep these stable: tools and cases plug into these shapes.

/** A dashboard metric the result engine can move. */
export interface Metric {
  id: string;
  label: string;
  /** Starting value. */
  value: number;
  /** Rendered after the value, e.g. "%", "/100". */
  suffix?: string;
  /** Number of decimals to display. */
  decimals?: number;
  /** Sensible floor/ceiling so a move can never run off the rails. */
  min: number;
  max: number;
  /** Initial trend shown before any attempt. */
  trend?: "up" | "down" | "flat";
}

/** One judging criterion shown in the result breakdown. */
export interface Criterion {
  id: string;
  label: string;
  hint: string;
}

/** An email in the inbox. Locked emails tease future tools — they cannot open. */
export interface EmailConfig {
  id: string;
  from: string;
  subject: string;
  preview: string;
  /** Markdown-ish plain body. Undefined for locked/teaser emails. */
  body?: string;
  /** Locked teaser email for a future tool — visible but not openable. */
  locked?: boolean;
  /** If present, opening this email reveals a link that opens the named tool/panel. */
  opensDashboard?: boolean;
  /** Emails that arrive after onboarding is read, rather than on entry. */
  arrivesAfterOnboarding?: boolean;
}

/** A tool installed on the workstation desktop. New tool = new entry here + an email. */
export interface ToolConfig {
  id: string;
  name: string;
  /** Single-character or short glyph used on the desktop icon. */
  glyph: string;
  tagline: string;
  /** Whether this tool is wired up. Locked tools show as "coming soon". */
  enabled: boolean;
}

// ---- Result engine wire types (mirror the JSON the judge returns) ----

export interface CriterionResult {
  score: number; // 0-10
  reason: string; // one line
}

export interface MetricDelta {
  delta: number; // can be negative
  reason: string; // one line
}

export interface Judgment {
  band: "weak" | "middling" | "strong";
  criteria: Record<string, CriterionResult>;
  metrics: Record<string, MetricDelta>;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

/** Full result of one attempt, returned by /api/claude. */
export interface AttemptResult {
  email: GeneratedEmail;
  judgment: Judgment;
}

/** One recorded attempt, kept for the improve loop and the debrief. */
export interface Attempt {
  prompt: string;
  email: GeneratedEmail;
  judgment: Judgment;
  /** Metric values AFTER this attempt was applied. */
  metricsAfter: Record<string, number>;
}
