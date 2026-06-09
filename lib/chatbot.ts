// ============================================================================
// CHATBOT CONFIG + SYSTEM PROMPT COMPILER
// ----------------------------------------------------------------------------
// The shape of the no-code builder's output, and the function that turns that
// config into a real Velara support-bot system prompt. The same compiled prompt
// powers the live chat and is exported to the student as a portable artifact.
// ============================================================================

import { COMPANY } from "@/config/case";
import {
  GUARDRAIL_OPTIONS,
  KNOWLEDGE,
  TONE_PRESETS,
} from "@/config/chatbot";

/** The student's assistant, as assembled in the builder. */
export interface ChatbotConfig {
  name: string;
  /** Selected tone-preset ids (see TONE_PRESETS). */
  tone: string[];
  goal: string;
  /** Selected knowledge-item ids (see KNOWLEDGE). */
  knowledge: string[];
  /** Selected guardrail ids (see GUARDRAIL_OPTIONS). */
  guardrails: string[];
  escalation: boolean;
}

/** One turn in the live conversation. */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Sensible empty-ish starting point for the builder. */
export const DEFAULT_CONFIG: ChatbotConfig = {
  name: "Velara Concierge",
  goal: "",
  tone: [],
  knowledge: [],
  guardrails: [],
  escalation: false,
};

/**
 * Compile the builder config into a Velara support-bot system prompt.
 *
 * The prompt: states the bot's name and goal, sets the tone from the selected
 * presets, includes the FULL text of only the selected knowledge items, applies
 * the selected guardrail rules, and adds escalation instructions when enabled.
 * Crucially it pins the grounding rule: speak only from the provided knowledge,
 * never invent delivery dates, prices or discount codes.
 */
export function compileSystemPrompt(config: ChatbotConfig): string {
  const name = config.name.trim() || "Velara Concierge";
  const company = COMPANY.name;

  const sections: string[] = [];

  // Identity and goal.
  sections.push(
    `You are ${name}, the customer support assistant for ${company}, a UK sustainable luxury fashion house. You speak with customers on the ${company} website.`,
  );
  if (config.goal.trim()) {
    sections.push(`Your goal: ${config.goal.trim()}`);
  } else {
    sections.push(
      `Your goal: help customers with their questions about ${company} orders, shipping and returns.`,
    );
  }

  // Tone.
  const toneLabels = config.tone
    .map((id) => TONE_PRESETS.find((t) => t.id === id)?.label)
    .filter((l): l is string => Boolean(l));
  if (toneLabels.length) {
    sections.push(
      `Tone: ${toneLabels.join(", ").toLowerCase()}. Sound like a ${company} concierge, not a generic chatbot. Keep replies concise and in ${company}'s understated voice. Do not use exclamation marks or hype words.`,
    );
  } else {
    sections.push(
      `Tone: calm, understated and helpful. Keep replies concise and in ${company}'s voice. Do not use exclamation marks or hype words.`,
    );
  }

  // Knowledge (grounding source).
  const selectedKnowledge = config.knowledge
    .map((id) => KNOWLEDGE.find((k) => k.id === id))
    .filter((k): k is (typeof KNOWLEDGE)[number] => Boolean(k));
  if (selectedKnowledge.length) {
    sections.push(
      `KNOWLEDGE. The following is everything you know about ${company}. Treat it as your only source of facts.\n\n${selectedKnowledge
        .map((k) => k.content)
        .join("\n\n")}`,
    );
  } else {
    sections.push(
      `KNOWLEDGE. You have not been given any ${company} facts. You do not know any shipping times, returns rules, prices or order details. Do not invent them.`,
    );
  }

  // The core grounding rule (always present).
  sections.push(
    `GROUNDING RULE. Only state facts that appear in your knowledge above. If you do not have a fact, say you will check or connect the customer with the team, rather than inventing it. Never make up delivery dates, prices, discount codes or order details. A confident guess that turns out wrong is worse than saying you will find out.`,
  );

  // Guardrails.
  const rules = config.guardrails
    .map((id) => GUARDRAIL_OPTIONS.find((g) => g.id === id)?.rule)
    .filter((r): r is string => Boolean(r));
  if (rules.length) {
    sections.push(`RULES.\n${rules.map((r) => `- ${r}`).join("\n")}`);
  }

  // Escalation.
  if (config.escalation) {
    sections.push(
      `ESCALATION. For anything you cannot handle, an angry or upset customer, a damaged or lost order, a complaint, or any request outside your knowledge, do not improvise. Apologise where appropriate, stay calm, and offer to connect the customer with a member of the ${company} team.`,
    );
  }

  sections.push(
    `Keep every reply short and to the point. Do not use em dashes.`,
  );

  return sections.join("\n\n");
}
