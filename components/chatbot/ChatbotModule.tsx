"use client";

// The self-contained Chatbot Creation module. It owns its own internal stage
// (learn -> quiz -> build) and the ChatbotConfig the student assembles. The
// integrator only wires in an onHome callback; everything else lives here.
//
//   learn  -> ChatbotLearn  (GUARD teaching + before/after)
//   quiz   -> ChatbotQuiz   (comprehension gate)
//   build  -> Builder (left) + a browser-framed Velara site with the live
//             ChatWidget overlaid (right) + an export panel for the compiled
//             system prompt, the portable artifact the student leaves with.

import { useState } from "react";

import VelaraSite from "@/components/VelaraSite";
import { COPY } from "@/config/chatbot";
import {
  compileSystemPrompt,
  DEFAULT_CONFIG,
  type ChatbotConfig,
} from "@/lib/chatbot";

import Builder from "./Builder";
import ChatbotLearn from "./ChatbotLearn";
import ChatbotQuiz from "./ChatbotQuiz";
import ChatWidget from "./ChatWidget";
import Review from "./Review";
import StressTest, { type Scoreboard } from "./StressTest";
import styles from "./chatbot.module.css";

type Stage = "learn" | "quiz" | "build" | "review";

function Stepper({ stage }: { stage: Stage }) {
  // The quiz is part of Learn, so the visible stepper has three steps.
  const onLearn = stage === "learn" || stage === "quiz";
  const onBuild = stage === "build";
  const onReview = stage === "review";
  const learnDone = !onLearn;
  const buildDone = onReview;
  return (
    <div className={styles.stepper}>
      <div
        className={`${styles.step} ${
          onLearn ? styles.stepActive : styles.stepDone
        }`}
      >
        <span className={styles.stepNum}>{learnDone ? "✓" : "1"}</span>
        Learn
      </div>
      <span className={styles.stepConnector} />
      <div
        className={`${styles.step} ${
          onBuild ? styles.stepActive : buildDone ? styles.stepDone : ""
        }`}
      >
        <span className={styles.stepNum}>{buildDone ? "✓" : "2"}</span>
        Build
      </div>
      <span className={styles.stepConnector} />
      <div className={`${styles.step} ${onReview ? styles.stepActive : ""}`}>
        <span className={styles.stepNum}>3</span>
        Review
      </div>
    </div>
  );
}

function ExportPanel({ config }: { config: ChatbotConfig }) {
  const [copied, setCopied] = useState(false);
  const prompt = compileSystemPrompt(config);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.exportPanel}>
      <div className={styles.exportHead}>
        <span className={styles.exportTitle}>Your assistant's system prompt</span>
        <button className="btn ghost" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={styles.exportPre}>{prompt}</pre>
      <p className={styles.exportNote}>{COPY.exportNote}</p>
    </div>
  );
}

/** Fallback so Review never crashes if it is reached without a run. */
const EMPTY_SCORE: Scoreboard = {
  resolution: 0,
  hallucinations: 0,
  escalationAccuracy: 0,
  csat: 0,
};

/** Best = highest resolution, breaking ties on fewer hallucinations, then CSAT. */
function isBetter(candidate: Scoreboard, current: Scoreboard): boolean {
  if (candidate.resolution !== current.resolution)
    return candidate.resolution > current.resolution;
  if (candidate.hallucinations !== current.hallucinations)
    return candidate.hallucinations < current.hallucinations;
  return candidate.csat > current.csat;
}

export default function ChatbotModule({ onHome }: { onHome: () => void }) {
  const [stage, setStage] = useState<Stage>("learn");
  const [config, setConfig] = useState<ChatbotConfig>(DEFAULT_CONFIG);

  // Track the first run and the best run so the review can show the contrast.
  const [firstScore, setFirstScore] = useState<Scoreboard | null>(null);
  const [bestScore, setBestScore] = useState<Scoreboard | null>(null);

  const recordRun = (sb: Scoreboard) => {
    setFirstScore((prev) => prev ?? sb);
    setBestScore((prev) => (prev === null || isBetter(sb, prev) ? sb : prev));
  };

  return (
    <div className={styles.module}>
      <div className={styles.topbar}>
        <button className={styles.homeBtn} onClick={onHome}>
          ← Home
        </button>
        <Stepper stage={stage} />
      </div>

      {stage === "learn" ? (
        <ChatbotLearn onContinue={() => setStage("quiz")} />
      ) : null}

      {stage === "quiz" ? (
        <ChatbotQuiz onPass={() => setStage("build")} />
      ) : null}

      {stage === "build" ? (
        <>
          <section className={styles.panel} style={{ paddingBottom: 18 }}>
            <p className={styles.eyebrow}>Build · Velara support assistant</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: "0 0 6px" }}>
              Configure it, then talk to it live
            </h2>
            <p className={styles.buildHint} style={{ marginBottom: 0 }}>
              {COPY.buildIntro}
            </p>
          </section>

          <div className={styles.buildGrid}>
            <section className={styles.panel}>
              <Builder config={config} onChange={setConfig} />
            </section>

            <div className={styles.previewCol}>
              <div className={styles.browser}>
                <div className={styles.browserBar}>
                  <div className={styles.browserDots}>
                    <span className={styles.browserDot} />
                    <span className={styles.browserDot} />
                    <span className={styles.browserDot} />
                  </div>
                  <div className={styles.browserUrl}>velara.com</div>
                </div>
                <div className={styles.previewStage}>
                  <VelaraSite />
                  <ChatWidget config={config} />
                </div>
              </div>

              <StressTest
                config={config}
                onResult={recordRun}
                onReview={() => setStage("review")}
              />

              <ExportPanel config={config} />
            </div>
          </div>
        </>
      ) : null}

      {stage === "review" ? (
        <Review
          first={firstScore ?? bestScore ?? EMPTY_SCORE}
          best={bestScore ?? firstScore ?? EMPTY_SCORE}
          onRestart={() => setStage("build")}
          onHome={onHome}
        />
      ) : null}
    </div>
  );
}
