"use client";

// The no-code builder. A controlled form whose sections map one to one onto
// GUARD: Name, Goal (G), Tone (A), Knowledge (U), Rules (R), Escalation (D).
// Every change calls onChange with the next config; the live widget always
// reads the latest config, so the assistant updates as the student builds.

import {
  GUARDRAIL_OPTIONS,
  KNOWLEDGE,
  TONE_PRESETS,
} from "@/config/chatbot";
import type { ChatbotConfig } from "@/lib/chatbot";
import styles from "./chatbot.module.css";

function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function Switch({ on }: { on: boolean }) {
  return (
    <span className={`${styles.switch} ${on ? styles.switchOn : ""}`} aria-hidden="true">
      <span className={styles.switchKnob} />
    </span>
  );
}

export default function Builder({
  config,
  onChange,
}: {
  config: ChatbotConfig;
  onChange: (c: ChatbotConfig) => void;
}) {
  const set = (patch: Partial<ChatbotConfig>) => onChange({ ...config, ...patch });

  return (
    <div className={styles.builder}>
      {/* Name */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>Name your assistant</span>
        </div>
        <p className={styles.helper}>
          A name customers see in the chat header. Keep it on-brand.
        </p>
        <input
          className={styles.input}
          value={config.name}
          placeholder="Velara Concierge"
          onChange={(e) => set({ name: e.target.value })}
        />
      </div>

      {/* Goal (G) */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>G</span>
          <span className={styles.sectionTitle}>Goal</span>
        </div>
        <p className={styles.helper}>
          Say what the assistant is for in one line. A clear goal keeps it on
          task instead of wandering off topic.
        </p>
        <textarea
          className={styles.textarea}
          value={config.goal}
          placeholder="Help Velara customers with questions about their orders, shipping and returns, in the brand's voice."
          onChange={(e) => set({ goal: e.target.value })}
        />
      </div>

      {/* Tone / Audience (A) */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>A</span>
          <span className={styles.sectionTitle}>Audience and tone</span>
        </div>
        <p className={styles.helper}>
          Choose how it should sound. Velara customers expect a calm concierge,
          not a salesy chatbot. Pick one or more.
        </p>
        <div className={styles.chips}>
          {TONE_PRESETS.map((t) => {
            const on = config.tone.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                onClick={() => set({ tone: toggleId(config.tone, t.id) })}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Knowledge / Understanding (U) */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>U</span>
          <span className={styles.sectionTitle}>Understanding (knowledge)</span>
        </div>
        <p className={styles.helper}>
          Switch on the facts the assistant is allowed to use. Without knowledge
          it has nothing real to draw on, so it will guess.
        </p>
        <div className={styles.toggleCards}>
          {KNOWLEDGE.map((k) => {
            const on = config.knowledge.includes(k.id);
            return (
              <button
                key={k.id}
                type="button"
                className={`${styles.toggleCard} ${on ? styles.toggleCardOn : ""}`}
                onClick={() => set({ knowledge: toggleId(config.knowledge, k.id) })}
              >
                <span className={styles.toggleCardLabel}>{k.label}</span>
                <Switch on={on} />
              </button>
            );
          })}
        </div>
        {config.knowledge.length === 0 ? (
          <p className={styles.knowledgeWarn}>
            No knowledge selected. The assistant will not know any orders,
            shipping or returns facts, and will be tempted to invent them.
          </p>
        ) : null}
      </div>

      {/* Rules (R) */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>R</span>
          <span className={styles.sectionTitle}>Rules (guardrails)</span>
        </div>
        <p className={styles.helper}>
          Turn on the lines the assistant must never cross. Good rules keep a
          helpful bot from becoming a liability.
        </p>
        <div className={styles.toggleCards}>
          {GUARDRAIL_OPTIONS.map((g) => {
            const on = config.guardrails.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                className={`${styles.toggleCard} ${on ? styles.toggleCardOn : ""}`}
                onClick={() => set({ guardrails: toggleId(config.guardrails, g.id) })}
              >
                <span className={styles.toggleCardLabel}>{g.label}</span>
                <Switch on={on} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Deflect / Escalation (D) */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>D</span>
          <span className={styles.sectionTitle}>Deflect (escalate to a human)</span>
        </div>
        <p className={styles.helper}>
          Let the assistant hand off to a person when it should: an upset
          customer, a damaged order, anything outside its knowledge.
        </p>
        <div className={`${styles.toggleRow} ${config.escalation ? styles.toggleRowOn : ""}`}>
          <div>
            <div className={styles.toggleRowText}>Offer to connect to the Velara team</div>
            <div className={styles.toggleRowSub}>
              Recommended. A clean escalation builds trust.
            </div>
          </div>
          <button
            type="button"
            className={`${styles.switch} ${config.escalation ? styles.switchOn : ""}`}
            aria-pressed={config.escalation}
            aria-label="Toggle escalation to a human"
            onClick={() => set({ escalation: !config.escalation })}
          >
            <span className={styles.switchKnob} />
          </button>
        </div>
      </div>
    </div>
  );
}
