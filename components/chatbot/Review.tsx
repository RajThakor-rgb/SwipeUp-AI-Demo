"use client";

// ============================================================================
// REVIEW  —  the student names the learning themselves
// ----------------------------------------------------------------------------
// The closing stage. It puts the student's FIRST run next to their BEST run so
// the contrast is undeniable, states the one principle (grounding + rules +
// escalation, augmentation not replacement), and ends with a reflection box
// where the student writes, in their own words, what they learned. The text is
// held in local state and "saved" in place, so the articulation is theirs.

import { useState } from "react";

import { COPY } from "@/config/chatbot";

import type { Scoreboard } from "./StressTest";
import styles from "./chatbot.module.css";

function CompareRow({
  label,
  first,
  best,
  suffix,
  betterWhenLower = false,
}: {
  label: string;
  first: number;
  best: number;
  suffix?: string;
  betterWhenLower?: boolean;
}) {
  const improved = betterWhenLower ? best < first : best > first;
  return (
    <div className={styles.compareRow}>
      <span className={styles.compareLabel}>{label}</span>
      <span className={styles.compareFirst}>
        {first}
        {suffix}
      </span>
      <span className={styles.compareArrow} aria-hidden="true">
        →
      </span>
      <span
        className={`${styles.compareBest} ${
          improved ? styles.compareUp : ""
        }`}
      >
        {best}
        {suffix}
      </span>
    </div>
  );
}

export default function Review({
  first,
  best,
  onRestart,
  onHome,
}: {
  first: Scoreboard;
  best: Scoreboard;
  onRestart?: () => void;
  onHome?: () => void;
}) {
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!reflection.trim()) return;
    setSaved(true);
  };

  return (
    <div className={styles.review}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>Review · What you built and what you learned</p>
        <h2 className={styles.reviewTitle}>
          You changed this with your own judgement
        </h2>

        <div className={styles.compareWrap}>
          <div className={styles.compareCol}>
            <div className={styles.compareHead}>
              <span className={styles.compareTagFirst}>First run</span>
              <span className={styles.compareTagBest}>Best run</span>
            </div>
            <CompareRow
              label="First-contact resolution"
              first={first.resolution}
              best={best.resolution}
              suffix="%"
            />
            <CompareRow
              label="Hallucination incidents"
              first={first.hallucinations}
              best={best.hallucinations}
              betterWhenLower
            />
            <CompareRow
              label="Escalation accuracy"
              first={first.escalationAccuracy}
              best={best.escalationAccuracy}
              suffix="%"
            />
            <CompareRow
              label="CSAT"
              first={first.csat}
              best={best.csat}
              suffix="%"
            />
          </div>
        </div>
      </section>

      <section className={styles.principlePanel}>
        <span className={styles.principleMark}>The principle</span>
        <p className={styles.principleText}>{COPY.reviewPrinciple}</p>
      </section>

      <section className={styles.panel}>
        <h3 className={styles.reflectTitle}>Your turn to put it into words</h3>
        <p className={styles.reflectQ}>{COPY.reflectionQuestion}</p>
        <textarea
          className={styles.reflectInput}
          value={reflection}
          placeholder="Write what made the difference, and what you will check for next time..."
          onChange={(e) => {
            setReflection(e.target.value);
            setSaved(false);
          }}
        />
        <div className={styles.reflectFoot}>
          <button
            className="btn dark"
            onClick={save}
            disabled={!reflection.trim()}
          >
            {saved ? "Saved" : "Save my reflection"}
          </button>
          {saved ? (
            <span className={styles.reflectSaved}>
              Saved. That sentence is the part no tool wrote for you.
            </span>
          ) : null}
        </div>
      </section>

      <div className={styles.reviewActions}>
        {onRestart ? (
          <button className="btn ghost" onClick={onRestart}>
            Tune the build again
          </button>
        ) : null}
        {onHome ? (
          <button className="btn" onClick={onHome}>
            Back to home
          </button>
        ) : null}
      </div>
    </div>
  );
}
