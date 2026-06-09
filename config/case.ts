// ============================================================================
// VELARA CASE CONTENT + ALL COPY
// ----------------------------------------------------------------------------
// The single place to edit the simulation: the university framing, the company,
// its departments and people, every email, the task, the analytics backend
// data, the judging criteria, the manager's voice, and the debrief.
// A new case is a new file shaped like this one.
// ============================================================================

import type {
  Criterion,
  Department,
  EmailConfig,
  Metric,
  Person,
} from "@/lib/types";

/** The Claude model used by the result engine. Confirmed current Sonnet model. */
export const MODEL = "claude-sonnet-4-6";

/** Academic framing, the student reaches the simulation through their university. */
export const UNIVERSITY = {
  name: "University of Law",
  programme: "SwipeUp AI Academy",
  unit: "Business Simulation · Applied AI for Marketing",
};

export const COMPANY = {
  name: "Velara",
  legalName: "Velara Ltd.",
  tagline: "Sustainable luxury, made to last.",
  founded: 2019,
  hq: "London, UK",
  blurb:
    "Velara is a UK sustainable luxury fashion house, founded in 2019. It runs two boutiques, in Mayfair and Knightsbridge, and a full e-commerce website that is fast becoming its busiest storefront. Collections are small-batch, made from certified materials, and sold at a high price point to a discerning clientele.",
  newHire: {
    name: "Raj",
    role: "Marketing Associate",
    team: "Marketing",
  },
};

/** The voice rules, used in copy, in the tool's hint, and in the judge prompt. */
export const VOICE_RULES =
  "understated, specific, sustainability-led, no hype words";

/** The situation the student is hired into. */
export const SITUATION =
  "Velara was built on the in-store experience, where staff know clients personally. Online, the brand sounds generic and its campaign emails do not sound like the brand. Engagement is sliding and the small marketing team is stretched.";

// ---- People & departments (the office) ----------------------------------

export const PEOPLE: Record<string, Person> = {
  hr: {
    name: "Hannah Brooks",
    title: "Head of People & Culture",
    department: "Human Resources",
    initials: "HB",
  },
  marketing: {
    name: "Priya Anand",
    title: "Marketing Director",
    department: "Marketing",
    initials: "PA",
  },
  md: {
    name: "Eleanor Vance",
    title: "Managing Director",
    department: "Management",
    initials: "EV",
  },
  ops: {
    name: "Tom Reilly",
    title: "Operations Lead",
    department: "Operations",
    initials: "TR",
  },
  cx: {
    name: "Sofia Marchetti",
    title: "Customer Experience Lead",
    department: "Customer Experience",
    initials: "SM",
  },
};

export const DEPARTMENTS: Department[] = [
  {
    name: "Management",
    lead: `${PEOPLE.md.name} · Managing Director`,
    blurb: "Sets strategy and signs off the season. Wants engagement back up.",
  },
  {
    name: "Marketing",
    lead: `${PEOPLE.marketing.name} · Marketing Director`,
    blurb:
      "Owns the brand voice and all campaigns. Your team. Reports to Management.",
  },
  {
    name: "Human Resources",
    lead: `${PEOPLE.hr.name} · Head of People & Culture`,
    blurb: "Onboards new hires and keeps the company running smoothly.",
  },
  {
    name: "Operations",
    lead: `${PEOPLE.ops.name} · Operations Lead`,
    blurb: "Runs fulfilment and the back office. Drowning in manual work.",
  },
  {
    name: "Customer Experience",
    lead: `${PEOPLE.cx.name} · CX Lead`,
    blurb: "Looks after clients post-purchase. Fielding order-status questions.",
  },
];

// ---- The task -----------------------------------------------------------

export const TASK = {
  title: "Autumn collection launch email",
  summary:
    "Write the launch email for the new autumn collection: a subject line and a short body, aimed at customers who bought once over a year ago and drifted, in Velara's voice.",
  voiceRules: VOICE_RULES,
};

// ---- Dashboard metrics (moved by the judge) -----------------------------

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
    history: [56, 54, 55, 50, 48, 45, 43, 41],
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
    history: [26, 25, 23, 22, 20, 19, 18, 17],
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
    history: [2.1, 2.0, 1.8, 1.7, 1.5, 1.4, 1.2, 1.1],
  },
];

/** Extra analytics shown on the dashboard to make it read like a real backend. */
export const ANALYTICS = {
  weekLabels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "Now"],
  channels: [
    { name: "Email", share: 34, color: "#9a7b4f" },
    { name: "Instagram", share: 28, color: "#5b6b8c" },
    { name: "Organic web", share: 22, color: "#6f8f6a" },
    { name: "Paid", share: 16, color: "#b08a6a" },
  ],
  audience: [
    { name: "Lapsed (12 mo+)", share: 46, target: true },
    { name: "Occasional", share: 34, target: false },
    { name: "Loyal", share: 20, target: false },
  ],
  campaigns: [
    { name: "Summer Linen Drop", sent: "12 Aug", open: "18%", ctr: "1.2%", status: "Underperforming" },
    { name: "Members Preview", sent: "28 Jul", open: "21%", ctr: "1.4%", status: "Flat" },
    { name: "Spring Restock", sent: "19 Jun", open: "17%", ctr: "1.0%", status: "Underperforming" },
    { name: "New Season Teaser", sent: "02 Jun", open: "16%", ctr: "0.9%", status: "Poor" },
  ],
  insight:
    "Open and click rates have slid for six straight campaigns. The biggest untapped group is lapsed customers (46%), people who bought once and drifted. They stopped opening because the emails stopped sounding like Velara.",
};

// ---- Judging criteria ---------------------------------------------------

export const CRITERIA: Criterion[] = [
  { id: "voiceMatch", label: "Voice match", hint: "Sounds like Velara, not generic luxury." },
  { id: "relevance", label: "Relevance", hint: "Speaks to a lapsed customer who bought once and drifted." },
  { id: "specificity", label: "Specificity", hint: "Concrete and particular, not vague." },
  { id: "callToAction", label: "Call to action", hint: "Clear and on-brand." },
  { id: "constraints", label: "Constraints", hint: "Respects the voice rules and stays short." },
];

// ---- Emails -------------------------------------------------------------

export const EMAILS: EmailConfig[] = [
  {
    id: "onboarding",
    from: PEOPLE.hr.name,
    department: PEOPLE.hr.department,
    subject: "Welcome to Velara: your first week",
    preview: "Welcome to the team, Raj. Here's everything you need to find your feet.",
    body: `Hi Raj,

Welcome to Velara, and welcome to the Marketing team. I'm Hannah, I look after People & Culture, so I'm your first port of call this week.

A bit about us, so you know where you've landed. Velara is a sustainable luxury fashion house, founded in 2019. We have two boutiques, in Mayfair and Knightsbridge, and a website that's becoming a bigger part of the business every season. Our collections are small-batch and made from certified materials, and our clients pay a premium because they trust what we stand for: quality that lasts, made responsibly.

How the company is set up. ${PEOPLE.md.name} (${PEOPLE.md.title}) runs the company and sets the strategy. You'll report into ${PEOPLE.marketing.name}, our ${PEOPLE.marketing.title}. She owns the brand voice and every campaign that goes out. Operations and Customer Experience sit alongside us. You can see the whole org in the Company app on your desktop.

How we work day to day. We run all our copy and campaign work through Claude, our company AI tool, and it's on your desktop. Claude does the production. Your job is to direct it well and judge what comes back, because a tool is only as good as the brief it's given. Our brand guidelines are simple but strict: ${VOICE_RULES}.

Priya will be in touch shortly with your first piece of work. Take a look around the desktop first. Open the Company app to get your bearings, and the Marketing Dashboard to see how our campaigns are doing.

Glad to have you with us.

Hannah Brooks
Head of People & Culture`,
  },
  {
    id: "ceo",
    from: PEOPLE.md.name,
    department: PEOPLE.md.department,
    subject: "A quick note from me",
    preview: "Welcome aboard. A line on why this season matters…",
    body: `Raj,

A quick hello from me. I don't email every new joiner, but Marketing matters to me right now, so I wanted to.

Velara is in good shape in our boutiques. In person, our team is exceptional. Online is where we're losing ground. Our emails have stopped sounding like us, and the numbers show it. This autumn launch is the moment to turn that around.

You're closer to the work than I am, so I'll stay out of the detail. But know that what your team produces this season has my full attention.

Eleanor Vance
Managing Director`,
  },
  {
    id: "task",
    from: PEOPLE.marketing.name,
    department: PEOPLE.marketing.department,
    subject: "Your first job: autumn launch email",
    preview: "Straight in at the deep end. Our autumn collection drops soon.",
    arrivesAfterOnboarding: true,
    opensDashboard: true,
    body: `Hi Raj,

Straight in at the deep end. That's how we learn here.

Our autumn collection drops soon and I need the launch email written. A subject line and a short body, aimed at customers who bought from us once over a year ago and then drifted away. It has to sound like us, not like every other luxury brand shouting about a sale. Stick to the voice rules: ${VOICE_RULES}.

Before you start, look at where our campaigns actually are right now.

[Open the marketing dashboard]

It's not pretty. Open and click rates have been sliding for months. That's exactly why you're here. Draft it in Claude, and I'll review what you produce.

Priya Anand
Marketing Director`,
  },
  // ---- Locked teasers for future tools (visible, not openable) ----
  {
    id: "locked-chatbot",
    from: PEOPLE.cx.name,
    department: PEOPLE.cx.department,
    subject: "Customers can't get order updates",
    preview: "Support is overwhelmed with 'where is my order' emails…",
    locked: true,
  },
  {
    id: "locked-automation",
    from: PEOPLE.ops.name,
    department: PEOPLE.ops.department,
    subject: "The team is drowning in manual work",
    preview: "We're rekeying the same data across three systems…",
    locked: true,
  },
];

// ---- Manager reaction bands (keyed to the judge's overall band) ----------

export const MANAGER_REACTIONS: Record<"weak" | "middling" | "strong", string> =
  {
    weak: "This still reads like every other luxury brand. A lapsed customer wouldn't feel spoken to, and the team flagged the voice. Take another pass. Be more specific, and drop the hype words.",
    middling:
      "Better. It's starting to sound like us and the open rate nudged up. It's still a bit generic in places. See if you can make it feel personal to someone who bought once and drifted.",
    strong:
      "This sounds like Velara. Understated, specific, no hype. The team's happy and the projections moved. Good work, Raj.",
  };

// ---- Debrief ------------------------------------------------------------

export const DEBRIEF = {
  principle:
    "The prompts that worked told Claude who it was writing as, who it was writing to, and what to avoid. Vague in, vague out.",
  reflectionPrompt: "In a sentence, what changed between your two drafts?",
};
