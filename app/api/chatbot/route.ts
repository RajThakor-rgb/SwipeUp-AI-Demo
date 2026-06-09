// ============================================================================
// CHATBOT CHAT ENDPOINT  —  server-side, powers the live support widget
// ----------------------------------------------------------------------------
// One POST per message. We compile the student's builder config into a system
// prompt, replay the conversation, make a single Claude call, and return the
// reply. The API key is read ONLY here, from the environment, and never touches
// the client. If it is missing we return { configured: false } with a clean
// message so the widget degrades gracefully.
// ============================================================================

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { MODEL } from "@/config/case";
import {
  compileSystemPrompt,
  type ChatbotConfig,
  type ChatMessage,
} from "@/lib/chatbot";

// The Anthropic SDK expects the Node.js runtime.
export const runtime = "nodejs";
// Never cache, every conversation is fresh.
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

export async function POST(request: Request) {
  // Graceful degradation: no key, tell the widget cleanly and let it show a
  // friendly bot message rather than crashing.
  if (!hasApiKey()) {
    return NextResponse.json({
      configured: false,
      reply:
        "The AI is not connected yet. Ask your administrator to add the API key.",
    });
  }

  let config: ChatbotConfig;
  let history: ChatMessage[];
  let message: string;
  try {
    const json = await request.json();
    config = json?.config as ChatbotConfig;
    history = Array.isArray(json?.history) ? (json.history as ChatMessage[]) : [];
    message = typeof json?.message === "string" ? json.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!config || typeof config !== "object") {
    return NextResponse.json({ error: "Missing assistant config." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Empty message." }, { status: 400 });
  }

  const system = compileSystemPrompt(config);

  // Replay only well-formed turns, then add the new user message.
  const messages = [
    ...history
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0,
      )
      .map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
  ];

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      temperature: 0.4,
      system,
      messages,
    });

    const reply = firstText(resp).trim();
    if (!reply) throw new Error("Empty reply from model.");

    return NextResponse.json({ configured: true, reply });
  } catch (err) {
    console.error("[chatbot]", err);
    const status = err instanceof Anthropic.APIError ? err.status ?? 502 : 500;
    return NextResponse.json(
      { error: "The assistant could not reply just now. Please try again." },
      { status },
    );
  }
}
