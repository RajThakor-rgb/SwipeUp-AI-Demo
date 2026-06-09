"use client";

// ============================================================================
// STRESS TEST  —  the consequence + coaching loop
// ----------------------------------------------------------------------------
// Lives inside the build stage, below the live preview. The student runs their
// assistant against a panel of awkward customer messages, sees a scoreboard and
// per-scenario verdicts, and for each FAILURE must first DIAGNOSE which GUARD
// pillar would have prevented it before going back to the builder on the left.
//
// Pedagogy: the engine and this UI never tell the student the fix. The symptom
// names what went wrong in business terms; the diagnosis step makes the student
// exercise judgement; the Socratic coach line asks a question, never instructs.
// The student edits the builder, runs again, and watches the numbers move.

import { useState } from "react";

import { COPY } from "@/config/chatbot";
import type { ChatbotConfig } from "@/lib/chatbot";

import styles from "./chatbot.module.css";

// The five GUARD pillar names the diagnosis step offers, in framework order.
// These match the `pillar` values on the test scenarios.
const PILLARS: { name: string; note: string }[] = [
  {
    name: "Goal",
    note: "Goal keeps the assistant on the one job you built it for.",
  },
  {
    name: "Understanding",
    note: "Understanding is the real facts the assistant is allowed to speak from.",
  },
  {
    name: "Audience",
    note: "Audience and tone shape who it is speaking to and how it should sound.",
  },
  {
    name: "Rules",
    note: "Rules are the lines the assistant must never cross.",
  },
  {
    name: "Deflect",
    note: "Deflect is knowing when to step back and hand a moment to a person.",
  },
];

// ---- The shape the engine returns (mirrors app/api/chatbot/test/route.ts) ----

export interface Scoreboard {
  resolution: number;
  hallucinations: number;
  escalationAccuracy: number;
  csat: number;
}

interface ScenarioResult {
  id: string;
  customer: string;
  symptom: string;
  pillar: string;
  botReply: string;
  passed: boolean;
  hallucinated: boolean;
  escalated: boolean;
}

interface TestResponse {
  configured: boolean;
  message?: string;
  results?: ScenarioResult[];
  scoreboard?: Scoreboard;
  coach?: string;
  band?: "weak" | "middling" | "strong";
}

// ---- Scoreboard tile -------------------------------------------------------

function delta(curr: number, prev: number | undefined, betterWhenLower: boolean) {
  if (prev === undefined || curr === prev) return null;
  const diff = curr - prev;
  const improved = betterWhenLower ? diff < 0 : diff > 0;
  const sign = diff > 0 ? "+" : "";
  return (
    <span
      className={`${styles.tileDelta} ${
        improved ? styles.tileDeltaUp : styles.tileDeltaDown
      }`}
    >
      {sign}
      {diff}
    </span>
  );
}

function Tile({
  label,
  value,
  suffix,
  prev,
  betterWhenLower = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  prev?: number;
  betterWhenLower?: boolean;
}) {
  return (
    <div className={styles.tile}>
      <div className={styles.tileTop}>
        <span className={styles.tileValue}>
          {value}
          {suffix ? <span className={styles.tileSuffix}>{suffix}</span> : null}
        </span>
        {delta(value, prev, betterWhenLower)}
      </div>
      <div className={styles.tileLabel}>{label}</div>
    </div>
  );
}

// ---- Diagnosis step (one per failed scenario) ------------------------------

function Diagnosis({ correctPillar }: { correctPillar: string }) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === correctPillar;
  const note = PILLARS.find((p) => p.name === correctPillar)?.note ?? "";

  return (
    <div className={styles.diagnose}>
      <div className={styles.diagnosePrompt}>{COPY.diagnosePrompt}</div>
      <div className={styles.pillarRow}>
        {PILLARS.map((p) => {
          const isPicked = picked === p.name;
          const state =
            picked === null
              ? ""
              : p.name === correctPillar && isPicked
                ? styles.pillarRight
                : isPicked
                  ? styles.pillarWrong
                  : "";
          return (
            <button
              key={p.name}
              type="button"
              className={`${styles.pillarBtn} ${state}`}
              onClick={() => setPicked(p.name)}
            >
              {p.name}
            </button>
          );
        })}
      </div>
      {picked !== null ? (
        correct ? (
          <p className={styles.diagnoseOk}>
            Right, that is the pillar to strengthen. {note} Now decide for
            yourself what to change in the build.
          </p>
        ) : (
          <p className={styles.diagnoseNo}>
            Not quite. Look again at what the assistant actually did in this
            reply, then choose the pillar that would have prevented it.
          </p>
        )
      ) : null}
    </div>
  );
}

// ---- Result card -----------------------------------------------------------

function ResultCard({ r }: { r: ScenarioResult }) {
  return (
    <div className={`${styles.resultCard} ${r.passed ? "" : styles.resultFail}`}>
      <div className={styles.resultHead}>
        <span
          className={`${styles.verdict} ${
            r.passed ? styles.verdictPass : styles.verdictFail
          }`}
        >
          {r.passed ? "Held up" : "Slipped"}
        </span>
      </div>
      <div className={styles.resultBody}>
        <div className={styles.resultRow}>
          <span className={styles.resultWho}>Customer</span>
          <p className={styles.resultText}>{r.customer}</p>
        </div>
        <div className={styles.resultRow}>
          <span className={styles.resultWho}>Your assistant</span>
          <p className={styles.resultText}>{r.botReply}</p>
        </div>
      </div>
      {!r.passed ? (
        <>
          <p className={styles.symptom}>{r.symptom}</p>
          <Diagnosis correctPillar={r.pillar} />
        </>
      ) : null}
    </div>
  );
}

// ---- Main component --------------------------------------------------------

export default function StressTest({
  config,
  onResult,
  onReview,
}: {
  config: ChatbotConfig;
  onResult?: (scoreboard: Scoreboard) => void;
  onReview?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TestResponse | null>(null);
  const [prevScore, setPrevScore] = useState<Scoreboard | undefined>(undefined);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (loading) return;
    setLoading(true);
    setError(null);
    // The current scoreboard becomes the baseline for the next run's deltas.
    setPrevScore(data?.scoreboard);
    try {
      const res = await fetch("/api/chatbot/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const json = (await res.json().catch(() => null)) as TestResponse | null;
      if (!json) {
        setError("The customer test could not run just now. Please try again.");
        return;
      }
      setData(json);
      if (json.configured && json.scoreboard) {
        setAttempts((a) => a + 1);
        onResult?.(json.scoreboard);
      }
    } catch {
      setError("The customer test could not run just now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const sb = data?.scoreboard;
  const notConfigured = data && data.configured === false;

  return (
    <section className={styles.stressPanel}>
      <div className={styles.stressHead}>
        <div>
          <p className={styles.eyebrow}>Stress test · Will it hold up?</p>
          <h3 className={styles.stressTitle}>Run the customer test</h3>
        </div>
        {attempts > 0 ? (
          <span className={styles.attemptBadge}>
            Run {attempts}
          </span>
        ) : null}
      </div>

      <p className={styles.stressIntro}>{COPY.testIntro}</p>

      <div className={styles.stressActions}>
        <button className="btn dark" onClick={run} disabled={loading}>
          {loading
            ? "Sending the customers..."
            : attempts > 0
              ? "Run the test again"
              : "Run the customer test"}
        </button>
        {attempts > 0 && onReview ? (
          <button className="btn ghost" onClick={onReview}>
            Finish and review
          </button>
        ) : null}
      </div>

      {error ? <p className={styles.stressError}>{error}</p> : null}

      {notConfigured ? (
        <p className={styles.stressNotice}>{data?.message}</p>
      ) : null}

      {sb ? (
        <>
          <div className={styles.scoreboard}>
            <Tile
              label="First-contact resolution"
              value={sb.resolution}
              suffix="%"
              prev={prevScore?.resolution}
            />
            <Tile
              label="Hallucination incidents"
              value={sb.hallucinations}
              prev={prevScore?.hallucinations}
              betterWhenLower
            />
            <Tile
              label="Escalation accuracy"
              value={sb.escalationAccuracy}
              suffix="%"
              prev={prevScore?.escalationAccuracy}
            />
            <Tile
              label="CSAT"
              value={sb.csat}
              suffix="%"
              prev={prevScore?.csat}
            />
          </div>

          {data?.coach ? (
            <div className={styles.coach}>
              <span className={styles.coachMark}>Coach</span>
              <p className={styles.coachText}>{data.coach}</p>
            </div>
          ) : null}

          <div className={styles.results}>
            {(data?.results ?? []).map((r) => (
              <ResultCard key={r.id} r={r} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
