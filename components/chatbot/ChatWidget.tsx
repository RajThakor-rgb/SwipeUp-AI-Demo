"use client";

// The live support widget that overlays the Velara storefront. A brand bubble
// bottom-right toggles a chat panel. Messages POST to /api/chatbot with the
// current builder config, the conversation history, and the new message. The
// assistant reply (powered by the Claude API) comes back and is appended. The
// { configured: false } and error cases are shown as friendly bot messages so
// the demo never breaks.

import { useEffect, useRef, useState } from "react";
import type { ChatbotConfig, ChatMessage } from "@/lib/chatbot";
import styles from "./chatbot.module.css";

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12 20 4l-4 16-4-7-8-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.5V16H6.5A2.5 2.5 0 0 1 4 13.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChatWidget({ config }: { config: ChatbotConfig }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello, welcome to Velara. I can help with orders, shipping and returns. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const botName = config.name.trim() || "Velara Concierge";
  const initials = botName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // Keep the message list scrolled to the latest turn.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending, open]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const history = messages;
    const nextUser: ChatMessage = { role: "user", content: text };
    setMessages((m) => [...m, nextUser]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, history, message: text }),
      });
      const data = await res.json().catch(() => null);

      const reply =
        data && typeof data.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "Sorry, I could not reply just now. Please try again in a moment.";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry, I am having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.widget}>
      {open ? (
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <span className={styles.chatAvatar}>{initials || "V"}</span>
            <div className={styles.chatHeaderText}>
              <div className={styles.chatName}>{botName}</div>
              <div className={styles.chatStatus}>
                <span className={styles.statusDot} />
                Online now
              </div>
            </div>
            <button
              type="button"
              className={styles.chatClose}
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className={styles.chatList} ref={listRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.msgRow} ${
                  m.role === "user" ? styles.msgRowUser : ""
                }`}
              >
                <div
                  className={`${styles.msgBubble} ${
                    m.role === "user" ? styles.msgUser : styles.msgBot
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending ? (
              <div className={styles.msgRow}>
                <div className={styles.typing}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.chatInputRow}>
            <input
              className={styles.chatInput}
              value={input}
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              type="button"
              className={styles.chatSend}
              aria-label="Send message"
              disabled={sending || !input.trim()}
              onClick={send}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className={styles.bubbleBtn}
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <span className={styles.bubbleBtnLabel}>×</span>
        ) : (
          <ChatIcon />
        )}
      </button>
    </div>
  );
}
