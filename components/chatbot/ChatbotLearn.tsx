"use client";

// Teaches GUARD: an intro that frames the CX problem, the five pillars as
// cards, and a concrete before/after showing an ungrounded bot inventing facts
// versus a grounded one that stays in scope and escalates. Ends with a button
// that advances to the comprehension quiz.

import { BEFORE_AFTER, COPY, GUARD } from "@/config/chatbot";
import styles from "./chatbot.module.css";

export default function ChatbotLearn({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className={styles.module} style={{ gap: 22 }}>
      <section className={`${styles.panel} ${styles.intro}`} style={{ maxWidth: "100%" }}>
        <p className={styles.eyebrow}>Customer Experience · Velara</p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, margin: "0 0 12px" }}>
          Build the assistant that answers Velara's customers
        </h1>
        <p style={{ color: "var(--ink-soft)", lineHeight: 1.62, margin: 0 }}>
          {COPY.intro}
        </p>
      </section>

      <section className={styles.panel}>
        <p className={styles.eyebrow}>The framework</p>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: "0 0 6px" }}>
          GUARD: five things every good support bot needs
        </h2>
        <p className={styles.buildHint} style={{ marginBottom: 4 }}>
          A chatbot is only as good as the brief behind it. GUARD is a simple way
          to remember what that brief must cover. The same five ideas apply to
          any assistant you build later, not just this one.
        </p>
        <div className={styles.guardGrid}>
          {GUARD.map((p) => (
            <div key={p.letter} className={styles.guardCard}>
              <span className={styles.guardLetter}>{p.letter}</span>
              <h3 className={styles.guardName}>{p.name}</h3>
              <p className={styles.guardBlurb}>{p.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <p className={styles.eyebrow}>See the difference</p>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: "0 0 6px" }}>
          Same question, two assistants
        </h2>
        <p className={styles.buildHint}>{BEFORE_AFTER.topic}</p>

        <div className={styles.baWrap}>
          <div className={`${styles.baCard} ${styles.baBad}`}>
            <p className={styles.baLabel}>{BEFORE_AFTER.weak.label}</p>
            <div className={`${styles.bubbleRow} ${styles.bubbleRowUser}`}>
              <div className={`${styles.bubble} ${styles.bubbleUser}`}>
                {BEFORE_AFTER.weak.customer}
              </div>
            </div>
            <div className={styles.bubbleRow}>
              <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                {BEFORE_AFTER.weak.reply}
              </div>
            </div>
            <p className={styles.baNote}>{BEFORE_AFTER.weak.note}</p>
          </div>

          <div className={`${styles.baCard} ${styles.baGood}`}>
            <p className={styles.baLabel}>{BEFORE_AFTER.strong.label}</p>
            <div className={`${styles.bubbleRow} ${styles.bubbleRowUser}`}>
              <div className={`${styles.bubble} ${styles.bubbleUser}`}>
                {BEFORE_AFTER.strong.customer}
              </div>
            </div>
            <div className={styles.bubbleRow}>
              <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                {BEFORE_AFTER.strong.reply}
              </div>
            </div>
            <p className={styles.baNote}>{BEFORE_AFTER.strong.note}</p>
          </div>

          <div className={`${styles.baCard} ${styles.baEscalate}`}>
            <p className={styles.baLabel}>{BEFORE_AFTER.escalation.label}</p>
            <div className={`${styles.bubbleRow} ${styles.bubbleRowUser}`}>
              <div className={`${styles.bubble} ${styles.bubbleUser}`}>
                {BEFORE_AFTER.escalation.customer}
              </div>
            </div>
            <div className={styles.bubbleRow}>
              <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                {BEFORE_AFTER.escalation.reply}
              </div>
            </div>
            <p className={styles.baNote}>{BEFORE_AFTER.escalation.note}</p>
          </div>
        </div>

        <div className={styles.continueRow}>
          <button className="btn dark lg" onClick={onContinue}>
            I understand, test me →
          </button>
        </div>
      </section>
    </div>
  );
}
