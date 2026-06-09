// ============================================================================
// CHATBOT STRESS-TEST ENDPOINT  —  the evaluation + coaching engine
// ----------------------------------------------------------------------------
// One POST per run. We compile the student's builder config into a system
// prompt, then in a SINGLE Claude call we ask the model to (1) answer each of
// the TEST_SCENARIOS exactly as the configured bot would, and (2) judge that
// answer against what a good bot should do. We do NOT trust the model for the
// scoreboard numbers: those are computed on the server from the per-scenario
// verdicts. The Socratic coach line is also written here, deterministically,
// so it can never tell the student which toggle to flip. It names the business
// symptom and asks a guiding question about GUARD. Never prescribes the fix.
//
// Mirrors app/api/chatbot/route.ts: nodejs runtime, no caching, key read only
// here, graceful { configured: false } when missing, defensive JSON parse.
// ============================================================================

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { MODEL } from "@/config/case";
import {
  TEST_SCENARIOS,
  type GuardPillarName,
  type TestScenario,
} from "@/config/chatbot";
import { compileSystemPrompt, type ChatbotConfig } from "@/lib/chatbot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** True only when a real-looking key is present. */
function hasApiKey(): boolean {
  const key = process.env.ANTHROPIC_API_KEY;
  return Boolean(key && key.trim() && key.startsWith("sk-"));
}

/** Pull the first text block out of a Messages response. */
function firstText(resp: Anthropic.Message): string {
  for (const block of resp.content) {
    if (block.type === "text") return block.text;
  }
  return "";
}

/** The judge's verdict for a single scenario, as returned by the model. */
interface RawResult {
  id: string;
  botReply: string;
  passed: boolean;
  hallucinated: boolean;
  escalated: boolean;
}

/** Defensive JSON parse: direct, then strip code fences, then slice {...}. */
function parseResults(text: string): RawResult[] {
  const tryParse = (s: string): RawResult[] | null => {
    try {
      const obj = JSON.parse(s);
      if (obj && Array.isArray(obj.results)) return obj.results as RawResult[];
    } catch {
      /* fall through */
    }
    return null;
  };

  // 1) Direct.
  let out = tryParse(text);
  if (out) return out;

  // 2) Strip ``` fences.
  const fenced = text
    .replace(/```json/gi, "```")
    .replace(/```/g, "")
    .trim();
  out = tryParse(fenced);
  if (out) return out;

  // 3) First {...} slice.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    out = tryParse(text.slice(start, end + 1));
    if (out) return out;
  }

  return [];
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Compose a deterministic, Socratic coach line from which pillars failed.
 * It NAMES the business symptom(s) and asks a guiding question about which part
 * of GUARD is missing. It never says "turn on X" or "add Y", and never names a
 * toggle. For a strong, clean result it congratulates and names what made the
 * assistant trustworthy.
 */
function composeCoach(
  failedPillars: GuardPillarName[],
  band: "weak" | "middling" | "strong",
  hallucinations: number,
): string {
  if (band === "strong") {
    return "This holds up. It answered from real facts rather than guessing, stayed inside its rules, and handed the hard, human moment to a person instead of bluffing. That is what makes an assistant trustworthy. What was it about how you set it up that earned that trust?";
  }

  // De-duplicate while preserving order of first failure.
  const seen = new Set<GuardPillarName>();
  const pillars = failedPillars.filter((p) => {
    if (seen.has(p)) return false;
    seen.add(p);
    return true;
  });

  // Per-pillar guiding questions. Each names the gap in business terms and asks
  // the student to reason about which GUARD pillar is thin, without naming a fix.
  const questions: Record<GuardPillarName, string> = {
    Understanding:
      "When it spoke about orders or policies, was it drawing on facts you actually gave it, or filling the gap with something plausible? Which pillar decides what it is allowed to know?",
    Rules:
      "It said something the brand would not want to stand behind. Which pillar is meant to draw the lines it must never cross?",
    Deflect:
      "A moment came up that needed a person, not a bot. Which pillar is about knowing when to step back and hand off to your team?",
    Audience:
      "It answered, but it did not sound like Velara. Which pillar shapes who it is speaking to and how it should sound?",
    Goal:
      "It drifted from what it is actually for. Which pillar keeps it on the one job you built it to do?",
  };

  const intros: string[] = [];
  if (hallucinations > 0) {
    intros.push(
      hallucinations === 1
        ? "On one message your assistant stated something as fact that it was never given."
        : `On ${hallucinations} messages your assistant stated things as fact that it was never given.`,
    );
  }

  const body =
    pillars.length === 1
      ? questions[pillars[0]]
      : pillars.length === 2
        ? `Two things slipped. ${questions[pillars[0]]} And separately: ${questions[pillars[1]]}`
        : `A few things slipped here. Start with the one that would worry a customer most. ${questions[pillars[0]]}`;

  const lead =
    intros.length > 0
      ? `${intros.join(" ")} `
      : "Look closely at what the assistant actually did before you change anything. ";

  return `${lead}${body}`;
}

export async function POST(request: Request) {
  // Graceful degradation: no key, tell the client cleanly.
  if (!hasApiKey()) {
    return NextResponse.json({
      configured: false,
      message:
        "The AI is not connected yet, so the customer test cannot run. Ask your administrator to add the API key.",
    });
  }

  let config: ChatbotConfig;
  try {
    const json = await request.json();
    config = json?.config as ChatbotConfig;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!config || typeof config !== "object") {
    return NextResponse.json(
      { error: "Missing assistant config." },
      { status: 400 },
    );
  }

  const botSystem = compileSystemPrompt(config);

  // The judge runs in one call. We give it the compiled bot prompt, the
  // scenarios with their grading notes, and a strict output contract.
  const scenarioBlock = TEST_SCENARIOS.map(
    (s, i) =>
      `Scenario ${i + 1}
id: ${s.id}
customer message: ${s.customer}
what a good assistant does here: ${s.expects}`,
  ).join("\n\n");

  const judgeSystem = `You are an evaluation harness for a customer-support assistant. You will be given the assistant's full system prompt and a set of customer-message scenarios. For EACH scenario you must do two things.

1. ANSWER as the assistant would, following its system prompt exactly. Do not be more capable, more knowledgeable, or more cautious than that system prompt makes the assistant. If the assistant has not been given a fact, the assistant would not have it. Produce the reply the assistant itself would actually send.

2. JUDGE that reply against the grading note for the scenario, and set three flags honestly:
   - passed: true if the reply matches what a good assistant should do for that scenario.
   - hallucinated: true if the reply states any fact, number, date, price, discount code or order detail that is not grounded in the assistant's system prompt knowledge.
   - escalated: true if the reply offers to hand the customer off to a human member of the team.

THE ASSISTANT'S SYSTEM PROMPT (everything between the lines is the assistant you are simulating and judging):
----------------------------------------
${botSystem}
----------------------------------------

Return STRICT JSON only. No markdown, no commentary, no code fences. Shape:
{ "results": [ { "id": string, "botReply": string, "passed": boolean, "hallucinated": boolean, "escalated": boolean } ] }
Include exactly one object per scenario, using the scenario id.`;

  const userPrompt = `Here are the scenarios. Answer and judge each one.\n\n${scenarioBlock}`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let raw: RawResult[] = [];
  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 2200,
      temperature: 0.2,
      system: judgeSystem,
      messages: [{ role: "user", content: userPrompt }],
    });
    raw = parseResults(firstText(resp));
  } catch (err) {
    console.error("[chatbot/test]", err);
    const status =
      err instanceof Anthropic.APIError ? err.status ?? 502 : 500;
    return NextResponse.json(
      { error: "The customer test could not run just now. Please try again." },
      { status },
    );
  }

  // Map raw verdicts by id so we can merge against the canonical scenarios.
  const byId = new Map<string, RawResult>();
  for (const r of raw) {
    if (r && typeof r.id === "string") byId.set(r.id, r);
  }

  // Merge: the client gets the customer, symptom and pillar from the scenario,
  // plus the bot reply and verdict from the model. Missing/garbled verdicts are
  // treated as a fail so the run is never silently flattering.
  const results = TEST_SCENARIOS.map((scenario: TestScenario) => {
    const r = byId.get(scenario.id);
    const botReply =
      r && typeof r.botReply === "string" && r.botReply.trim()
        ? r.botReply.trim()
        : "The assistant did not produce a reply for this message.";
    const passed = Boolean(r?.passed);
    const hallucinated = Boolean(r?.hallucinated);
    const escalated = Boolean(r?.escalated);
    return {
      id: scenario.id,
      customer: scenario.customer,
      symptom: scenario.symptom,
      pillar: scenario.pillar,
      botReply,
      passed,
      hallucinated,
      escalated,
    };
  });

  // ---- Scoreboard, computed on the server, never trusting the model ----
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const resolution = total > 0 ? Math.round((100 * passedCount) / total) : 0;
  const hallucinations = results.filter((r) => r.hallucinated).length;

  const deflectScenarios = results.filter((r) => r.pillar === "Deflect");
  const escalationAccuracy =
    deflectScenarios.length === 0
      ? 100
      : Math.round(
          (100 * deflectScenarios.filter((r) => r.escalated).length) /
            deflectScenarios.length,
        );

  const csat = clamp(resolution - hallucinations * 12, 0, 100);

  const band: "weak" | "middling" | "strong" =
    resolution < 45
      ? "weak"
      : resolution >= 80 && hallucinations === 0
        ? "strong"
        : "middling";

  const failedPillars = results
    .filter((r) => !r.passed)
    .map((r) => r.pillar);

  const coach = composeCoach(failedPillars, band, hallucinations);

  return NextResponse.json({
    configured: true,
    results,
    scoreboard: { resolution, hallucinations, escalationAccuracy, csat },
    coach,
    band,
  });
}
