// ============================================================================
// VELARA CASE CONTENT + ALL COPY
// ----------------------------------------------------------------------------
// This is the single place to edit the case. Everything the student reads —
// emails, the task, dashboard metrics, judging criteria, the manager's voice,
// and the debrief — lives here. A new case is a new file shaped like this one.
// ============================================================================

import type { Criterion, EmailConfig, Metric } from "@/lib/types";

/** The Claude model used by the result engine. Confirmed current Sonnet model. */
export const MODEL = "claude-sonnet-4-6";

export const COMPANY = {
  name: "Velara",
  legalName: "Velara Ltd.",
  blurb:
    "UK sustainable luxury fashion. Founded 2019. Boutiques in Mayfair and Knightsbridge plus a website. Small-batch collections, certified materials, high price point.",
  manager: {
    name: "Priya Anand",
    title: "Marketing Director",
  },
  newHire: {
    name: "Alex Morgan",
    role: "Marketing Associate",
  },
};

/** The voice rules — used in copy, in the tool's hint, and in the judge prompt. */
export const VOICE_RULES =
  "understated, specific, sustainability-led, no hype words";

/** The situation the student is hired into. */
export const SITUATION =
  "Velara was built on the in-store experience, where staff know clients personally. Online, the brand sounds generic and its campaign emails do not sound like the brand. Engagement is sliding and the small marketing team is stretched.";

/** The actual task brief shown inside the Claude tool. */
export const TASK = {
  title: "Autumn collection launch email",
  summary:
    "Write the launch email for the new autumn collection: a subject line and a short body, aimed at customers who bought once over a year ago and drifted, in Velara's voice.",
  voiceRules: VOICE_RULES,
};

// ---- Dashboard ----------------------------------------------------------

/**
 * The three metrics the judge moves. These are projections from the work,
 * not real sales. A brand-voice tile is derived from the voice-match score
 * in the dashboard component (not moved directly by the judge).
 */
export const METRICS: Metric[] = [
  {
    id: "engagement",
    label: "Campaign engagement score",
    value: 41,
    suffix: "/100",
    decimals: 0,
    min: 0,
    max: 100,
    trend: "down",
  },
  {
    id: "openRate",
    label: "Predicted email open rate",
    value: 17,
    suffix: "%",
    decimals: 0,
    min: 0,
    max: 100,
    trend: "down",
  },
  {
    id: "clickThrough",
    label: "Predicted click-through",
    value: 1.1,
    suffix: "%",
    decimals: 1,
    min: 0,
    max: 15,
    trend: "down",
  },
];

// ---- Judging criteria ---------------------------------------------------

export const CRITERIA: Criterion[] = [
  {
    id: "voiceMatch",
    label: "Voice match",
    hint: "Sounds like Velara, not generic luxury.",
  },
  {
    id: "relevance",
    label: "Relevance",
    hint: "Speaks to a lapsed customer who bought once and drifted.",
  },
  {
    id: "specificity",
    label: "Specificity",
    hint: "Concrete and particular, not vague.",
  },
  {
    id: "callToAction",
    label: "Call to action",
    hint: "Clear and on-brand.",
  },
  {
    id: "constraints",
    label: "Constraints",
    hint: "Respects the voice rules and stays short.",
  },
];

// ---- Emails -------------------------------------------------------------

export const EMAILS: EmailConfig[] = [
  {
    id: "onboarding",
    from: `${COMPANY.manager.name}, ${COMPANY.manager.title}`,
    subject: "Welcome to Velara",
    preview: "Welcome aboard. A quick note on how we work…",
    body: `Welcome aboard. You've joined the marketing team as an associate.

A quick note on how we work. We run all our copy and campaign work through Claude, our AI tool, so you'll be using it daily. It does the production. Your job is to direct it and judge what comes back, because a tool is only as good as the brief it's given.

Our brand guidelines are in your documents: ${VOICE_RULES}. Have a read, and I'll send your first job shortly.

— ${COMPANY.manager.name}`,
  },
  {
    id: "task",
    from: `${COMPANY.manager.name}, ${COMPANY.manager.title}`,
    subject: "First job, autumn launch email",
    preview: "Straight in at the deep end. Our autumn collection drops soon…",
    arrivesAfterOnboarding: true,
    opensDashboard: true,
    body: `Straight in at the deep end.

Our autumn collection drops soon and I need the launch email written. A subject line and a short body, aimed at customers who bought from us once over a year ago and drifted. It has to sound like us, not like every other luxury brand. Stick to the voice rules.

Before you start, have a look at where our campaigns are right now.

[Open the marketing dashboard]

It's not pretty. That's why you're here.

— ${COMPANY.manager.name}`,
  },
  // ---- Locked teasers for future tools (visible, not openable) ----
  {
    id: "locked-chatbot",
    from: "Customer Operations",
    subject: "Customers can't get order updates",
    preview: "Support is overwhelmed with 'where is my order' emails…",
    locked: true,
  },
  {
    id: "locked-automation",
    from: "Operations",
    subject: "The team is drowning in manual work",
    preview: "We're rekeying the same data across three systems…",
    locked: true,
  },
];

// ---- Manager reaction bands (keyed to the judge's overall band) ----------

export const MANAGER_REACTIONS: Record<
  "weak" | "middling" | "strong",
  string
> = {
  weak: "This still reads like every other luxury brand. A lapsed customer wouldn't feel spoken to, and the team flagged the voice. Take another pass. Be more specific, and drop the hype words.",
  middling:
    "Better. It's starting to sound like us and the open rate nudged up. It's still a bit generic in places. See if you can make it feel personal to someone who bought once and drifted.",
  strong:
    "This sounds like Velara. Understated, specific, no hype. The team's happy and the projections moved. Good work.",
};

// ---- Debrief ------------------------------------------------------------

export const DEBRIEF = {
  principle:
    "The prompts that worked told Claude who it was writing as, who it was writing to, and what to avoid. Vague in, vague out.",
  reflectionPrompt: "In a sentence, what changed between your two attempts?",
};
