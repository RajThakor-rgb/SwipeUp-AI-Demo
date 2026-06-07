// ============================================================================
// THE RESULT ENGINE  —  server-side, the heart of the product
// ----------------------------------------------------------------------------
// One POST per attempt runs TWO Claude calls:
//   1. GENERATE — turn the student's prompt into an actual launch email.
//   2. JUDGE    — score that email against fixed criteria and return strict
//                 JSON: a score + one-line reason per criterion, plus a change
//                 (delta) to each dashboard metric, plus an overall band.
//
// The judge is kept stable: fixed criteria baked into the system prompt,
// temperature 0, and structured outputs so the JSON is guaranteed parseable —
// no prose, no markdown fences, no brittle hand-parsing.
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

// ---- JSON schema the judge must return (structured outputs) ----------------

// ---- Prompts ---------------------------------------------------------------
// The two calls are constrained by explicit JSON-shape instructions and parsed
// defensively (see extractJson). We deliberately depend only on the core
// Messages API — no preview parameters that could 400 in a live demo.

const GENERATE_SYSTEM = `You are Claude, the AI tool that ${COMPANY.legalName} runs its marketing copy through. You produce campaign copy on demand. You follow the brief you are given exactly — if the brief is vague, the output will be generic; if the brief is specific, the output will be sharp.

Return ONLY a JSON object. No commentary, no explanation, no markdown, no code fences. Exactly this shape:
{"subject": "<the email subject line>", "body": "<the short email body, plain text, line breaks allowed>"}`;

function generateUser(studentPrompt: string): string {
  return `A marketing associate has written the following prompt to brief you for an email. Follow it faithfully — including its weaknesses. Do not silently improve a vague brief.

THE ASSOCIATE'S PROMPT:
"""
${studentPrompt}
"""

Context you may use only if the prompt asks for it: ${COMPANY.name} is ${COMPANY.blurb} Situation: ${SITUATION}

Write the email now.`;
}

const JUDGE_SYSTEM = `You are the brand and performance reviewer at ${COMPANY.legalName}, a UK sustainable luxury fashion house. You evaluate campaign emails for the autumn collection launch, aimed at customers who bought once over a year ago and drifted.

${COMPANY.name}'s voice rules are: ${VOICE_RULES}.

Judge strictly and consistently against exactly these criteria (0-10 each):
${CRITERIA.map((c) => `- ${c.label}: ${c.hint}`).join("\n")}

Then project the impact on three campaign metrics as a delta (change) on each:
- engagement: campaign engagement score, currently ${METRICS.find((m) => m.id === "engagement")?.value}/100. Range of a single move: roughly -8 to +18.
- openRate: predicted email open rate %, currently ${METRICS.find((m) => m.id === "openRate")?.value}%. Range: roughly -3 to +9.
- clickThrough: predicted click-through %, currently ${METRICS.find((m) => m.id === "clickThrough")?.value}%. Range: roughly -0.4 to +1.6.

Rules for the move, do not break them:
- A weak, generic, or hype-filled email moves the metrics little or DOWN. Never reward effort or length on its own.
- Only a genuinely on-brand, specific, lapsed-customer-aware email earns a strong lift.
- Pressing submit must never guarantee a rise. If the email is bad, the numbers fall.
- Be consistent: the same email should always earn roughly the same scores.

Set band to "weak", "middling", or "strong" to match the overall quality.

Return ONLY a JSON object. No commentary, no markdown, no code fences. Exactly this shape:
{
  "band": "weak" | "middling" | "strong",
  "criteria": {
    ${CRITERIA.map((c) => `"${c.id}": { "score": <integer 0-10>, "reason": "<one short line>" }`).join(",\n    ")}
  },
  "metrics": {
    ${METRICS.map((m) => `"${m.id}": { "delta": <number, may be negative>, "reason": "<one short line>" }`).join(",\n    ")}
  }
}`;

function judgeUser(subject: string, body: string): string {
  return `Evaluate this autumn launch email.

SUBJECT: ${subject}

BODY:
${body}`;
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
  try {
    const json = await request.json();
    prompt = typeof json?.prompt === "string" ? json.prompt.trim() : "";
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
    // ---- Call 1: GENERATE the email from the student's prompt -------------
    // We instruct strict JSON in the system prompt and parse defensively, so
    // the loop can't break on a stray code fence or preamble.
    const genResp = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      temperature: 0.7, // a little room so prompt quality visibly changes the output
      system: GENERATE_SYSTEM,
      messages: [{ role: "user", content: generateUser(prompt) }],
    });

    const email = extractJson<{ subject: string; body: string }>(
      firstText(genResp),
    );

    // ---- Call 2: JUDGE the generated email -------------------------------
    const judgeResp = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      temperature: 0, // stable, repeatable judging
      system: JUDGE_SYSTEM,
      messages: [
        { role: "user", content: judgeUser(email.subject, email.body) },
      ],
    });

    const judgment = normalizeJudgment(
      extractJson<Judgment>(firstText(judgeResp)),
    );

    return NextResponse.json({ configured: true, email, judgment });
  } catch (err) {
    // Surface a clean message; keep the detail in the server log.
    console.error("[result-engine]", err);
    const status =
      err instanceof Anthropic.APIError ? err.status ?? 502 : 500;
    return NextResponse.json(
      {
        error:
          "The AI call failed. Check the API key and try again — the workstation is still fine to explore.",
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
 * present and well-typed, and the band is valid. The dashboard can then render
 * without any chance of NaN or undefined.
 */
function normalizeJudgment(raw: Judgment): Judgment {
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

  return { band, criteria, metrics };
}
