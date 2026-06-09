// ============================================================================
// THE RESULT ENGINE  —  server-side, the heart of the product
// ----------------------------------------------------------------------------
// One POST per attempt makes ONE Claude call that does both jobs in a single
// pass: (1) write the launch email from the student's prompt, then (2) judge
// that email and return strict JSON (band, coach, focus, per-criterion scores,
// and a delta per dashboard metric). One round trip keeps the demo snappy.
//
// The API key is read ONLY here, from the environment. It never touches the
// client. If it isn't set, we return { configured: false } so the UI can show
// a clean "AI not connected" message and the rest of the shell stays usable.
// ============================================================================

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  COMPANY,
  CRITERIA,
  METRICS,
  MODEL,
  SITUATION,
  VOICE_RULES,
} from "@/config/case";
import type { Judgment } from "@/lib/types";

// Run on the Node.js runtime (the Anthropic SDK expects it).
export const runtime = "nodejs";
// Never cache attempts — every prompt is fresh.
export const dynamic = "force-dynamic";

/** True only when a real-looking key is present. */
function hasApiKey(): boolean {
  const key = process.env.ANTHROPIC_API_KEY;
  return Boolean(key && key.trim() && key.startsWith("sk-"));
}

// ---- Prompt ----------------------------------------------------------------
// A single system prompt covers both jobs and pins one JSON shape. We instruct
// strict JSON and parse defensively (see extractJson), depending only on the
// core Messages API — no preview parameters that could 400 in a live demo.

const SYSTEM = `You have two jobs in one reply, for ${COMPANY.legalName}, a UK sustainable luxury fashion house preparing the autumn collection launch email, aimed at customers who bought once over a year ago and drifted. ${COMPANY.name}'s voice rules are: ${VOICE_RULES}.

JOB 1, WRITE THE EMAIL. As Claude, ${COMPANY.name}'s AI marketing tool, write the launch email from the student's brief. Follow the brief faithfully, including its weaknesses: if it is vague the email is generic, if it is specific the email is sharp. Never use em dashes. Avoid hype words and marketing buzzwords.

JOB 2, JUDGE THE EMAIL. Now act as an impartial brand and performance reviewer and judge the email you just wrote, strictly and on its own merits.
Score these criteria (0-10 each):
${CRITERIA.map((c) => `- ${c.label}: ${c.hint}`).join("\n")}
Project the impact on three metrics as a delta on each:
- engagement: currently ${METRICS.find((m) => m.id === "engagement")?.value}/100.
- openRate: currently ${METRICS.find((m) => m.id === "openRate")?.value}%.
- clickThrough: currently ${METRICS.find((m) => m.id === "clickThrough")?.value}%.

This is a TEACHING simulator that rewards iteration, so be demanding about the top band:
- WEAK (lazy or generic prompt: no audience, hype words, sale language, exclamation marks): rate "weak" and move DOWN or barely. engagement -6 to +1, openRate -3 to +1, clickThrough -0.4 to +0.1.
- MIDDLING (a real framework attempt, but the audience is only loosely drawn, OR the email is still a little generic, OR a constraint is missed): rate "middling". engagement +2 to +7, openRate +1 to +3, clickThrough +0.1 to +0.5. A student's FIRST framework attempt should usually land here.
- STRONG (the prompt is fully specified AND the email delivers: an explicit lapsed customer who bought once over a year ago and drifted, a clear tone, real constraints such as length, no hype and one call to action, and copy that is concrete, on-brand and speaks directly to that lapsed customer's gap): rate "strong" with a clear, satisfying lift. engagement +12 to +18, openRate +5 to +9, clickThrough +0.9 to +1.6.

Rules you must not break:
- Be demanding about "strong". It requires BOTH a fully specified prompt AND specific, on-brand copy. It is normal for a student to need two or three refinements to reach it. Do not award "strong" on a first decent attempt.
- Reserve "weak" for genuinely lazy prompts.
- Never reward pure length or effort alone.
- A bad prompt still falls. Submitting never guarantees a rise.
- Be consistent: the same email should always earn roughly the same scores.

You are a supportive professor, not a checker, and you teach by guiding, never by writing the prompt for the student. They are learning two frameworks: CO-STAR (Context, Objective, Style, Tone, Audience, Response) and RISEN (Role, Instructions, Steps, End goal, Narrowing), and can open either with a button on their screen. Write a "coach" message of 2 to 3 sentences in a warm tutor's voice. Always tie it to the business outcome. Then GRADUATE how much you reveal by the attempt number, and NEVER write example wording or anything they could paste:
- Attempt 1 or 2 (not strong): keep it light. Encourage them, then tell them to open the CO-STAR or RISEN framework with the button and find which element their prompt is missing. Do NOT name the element. Set "focus" to [].
- Attempt 3 (not strong): name one or two framework elements to add (for example Audience, Narrowing) and explain in general terms why they help. No example sentences. Put those names in "focus".
- Attempt 4 (not strong): name the elements and add a short conceptual hint for each, still no example wording and never the actual prompt. Put the names in "focus".
- Strong (any attempt): say what specifically worked and why. Set "focus" to [].

Do not use em dashes. Address the student as "you".

Return ONLY ONE JSON object. No commentary, no markdown, no code fences. Exactly this shape:
{
  "email": { "subject": "<the subject line>", "body": "<the short body, line breaks allowed>" },
  "band": "weak" | "middling" | "strong",
  "coach": "<2-3 sentence professor message, graduated to the attempt>",
  "focus": [ "<framework element name, only on attempt 3+ and not strong>" ],
  "criteria": {
    ${CRITERIA.map((c) => `"${c.id}": { "score": <integer 0-10>, "reason": "<one short line>" }`).join(",\n    ")}
  },
  "metrics": {
    ${METRICS.map((m) => `"${m.id}": { "delta": <number, may be negative>, "reason": "<one short line>" }`).join(",\n    ")}
  }
}`;

function buildUser(studentPrompt: string, attempt: number): string {
  return `This is the student's attempt number ${attempt} of 4. Graduate your coaching to this attempt.

THE STUDENT'S PROMPT:
"""
${studentPrompt}
"""

Context for writing the email, use only if the prompt asks for it: ${COMPANY.name} is ${COMPANY.blurb} Situation: ${SITUATION}

Write the email, then judge it. Return the single JSON object.`;
}

// ---- Handler ---------------------------------------------------------------

export async function POST(request: Request) {
  // Graceful degradation: no key → tell the client cleanly, don't crash.
  if (!hasApiKey()) {
    return NextResponse.json({
      configured: false,
      message:
        "AI not connected. Add ANTHROPIC_API_KEY in Vercel (Project → Settings → Environment Variables) and redeploy. The rest of the workstation works without it.",
    });
  }

  let prompt: string;
  let attempt: number;
  try {
    const json = await request.json();
    prompt = typeof json?.prompt === "string" ? json.prompt.trim() : "";
    attempt = Number(json?.attempt);
    if (!Number.isFinite(attempt) || attempt < 1) attempt = 1;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json(
      { error: "Write a prompt before submitting." },
      { status: 400 },
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    // One call: write the email and judge it in a single pass.
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 1400,
      temperature: 0.5, // enough variation in the copy; stable enough to judge
      system: SYSTEM,
      messages: [{ role: "user", content: buildUser(prompt, attempt) }],
    });

    const parsed = extractJson<
      { email?: { subject?: string; body?: string } } & Judgment
    >(firstText(resp));

    const email = {
      subject: typeof parsed.email?.subject === "string" ? parsed.email.subject : "",
      body: typeof parsed.email?.body === "string" ? parsed.email.body : "",
    };
    if (!email.subject && !email.body) {
      throw new Error("No email in model response.");
    }

    const judgment = normalizeJudgment(parsed, attempt);

    return NextResponse.json({ configured: true, email, judgment });
  } catch (err) {
    // Surface a clean message; keep the detail in the server log.
    console.error("[result-engine]", err);
    const status = err instanceof Anthropic.APIError ? err.status ?? 502 : 500;
    return NextResponse.json(
      {
        error:
          "The AI call failed. Check the API key and try again. The workstation is still fine to explore.",
      },
      { status },
    );
  }
}

/** Pull the first text block out of a Messages response. */
function firstText(resp: Anthropic.Message): string {
  for (const block of resp.content) {
    if (block.type === "text") return block.text;
  }
  throw new Error("No text block in model response.");
}

/**
 * Parse JSON out of model text defensively: direct parse, then strip a markdown
 * code fence, then fall back to the first balanced { ... } slice. This makes the
 * loop robust even if the model wraps its JSON or adds a stray word.
 */
function extractJson<T>(text: string): T {
  const t = text.trim();
  try {
    return JSON.parse(t) as T;
  } catch {
    /* try the next strategy */
  }
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1].trim()) as T;
    } catch {
      /* try the next strategy */
    }
  }
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end > start) {
    return JSON.parse(t.slice(start, end + 1)) as T;
  }
  throw new Error("Could not parse JSON from model output.");
}

/**
 * Harden the judge output: guarantee every criterion and every metric is
 * present and well-typed, the band is valid, the coach is graduated, and focus
 * only appears on later attempts. The dashboard can then render without any
 * chance of NaN or undefined.
 */
function normalizeJudgment(raw: Judgment, attempt: number): Judgment {
  const band: Judgment["band"] =
    raw?.band === "weak" || raw?.band === "strong" ? raw.band : "middling";

  const criteria: Judgment["criteria"] = {};
  for (const c of CRITERIA) {
    const r = raw?.criteria?.[c.id];
    const score = Math.max(0, Math.min(10, Math.round(Number(r?.score) || 0)));
    criteria[c.id] = {
      score,
      reason: typeof r?.reason === "string" ? r.reason : "",
    };
  }

  const metrics: Judgment["metrics"] = {};
  for (const m of METRICS) {
    const r = raw?.metrics?.[m.id];
    const delta = Number(r?.delta);
    metrics[m.id] = {
      delta: Number.isFinite(delta) ? delta : 0,
      reason: typeof r?.reason === "string" ? r.reason : "",
    };
  }

  // Graduated fallback coaching, used only if the model returns no coach text.
  let fallbackCoach: string;
  if (band === "strong") {
    fallbackCoach =
      "Excellent. You gave the AI a clear audience, tone and constraints, and the market responded. That is the level.";
  } else if (attempt <= 2) {
    fallbackCoach =
      "After we sent this, the analytics barely moved. Open the CO-STAR or RISEN framework with the button and look for the element your prompt is missing, then try again.";
  } else if (attempt === 3) {
    fallbackCoach =
      "Closer, but the lift is small. Think about Audience and Narrowing: who exactly are you writing to, and what should the email avoid? Add those and run it again.";
  } else {
    fallbackCoach =
      "You are nearly there. Make the audience a specific lapsed customer and keep the constraints tight, short, no hype, one call to action. One more refinement should do it.";
  }
  const coach =
    typeof raw?.coach === "string" && raw.coach.trim()
      ? raw.coach.trim()
      : fallbackCoach;

  // Framework element names to revisit. Only on later attempts, never the prompt.
  let focus: string[] = [];
  if (band !== "strong" && attempt >= 3) {
    focus =
      Array.isArray(raw?.focus) && raw.focus.length
        ? raw.focus.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
        : ["Audience", "Narrowing"];
  }

  return { band, criteria, metrics, coach, focus };
}
