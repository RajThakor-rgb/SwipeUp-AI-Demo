"use client";

// The comprehension gate for the Chatbot module. Each question's options are
// shuffled once on mount so the correct answer is never in a fixed position.
// After checking, each question shows whether it was right plus an explanation.
// The student must get all of them right to pass; the tone is a professor's,
// never harsh. On pass, the student moves on to build.

import { useMemo, useState } from "react";
import { QUIZ } from "@/config/chatbot";
import styles from "./chatbot.module.css";

/** Shuffle each question's options once, tracking where the correct one lands. */
function shuffleQuiz() {
  return QUIZ.map((q) => {
    const opts = q.options.map((text, i) => ({ text, correct: i === q.correctIndex }));
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return {
      id: q.id,
      question: q.question,
      explain: q.explain,
      options: opts.map((o) => o.text),
      correctIndex: opts.findIndex((o) => o.correct),
    };
  });
}

export default function ChatbotQuiz({ onPass }: { onPass: () => void }) {
  const questions = useMemo(shuffleQuiz, []);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const allCorrect = questions.every((q) => answers[q.id] === q.correctIndex);
  const passed = checked && allCorrect;

  return (
    <div className={styles.module}>
      <section className={styles.panel} style={{ paddingBottom: 18 }}>
        <p className={styles.eyebrow}>Quick check</p>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: "0 0 6px" }}>
          Have you got GUARD?
        </h2>
        <p className={styles.buildHint} style={{ marginBottom: 0 }}>
          Answer these and you are ready to build Velara's assistant for real.
          Take your time, there is no penalty for trying again.
        </p>
      </section>

      <div className={styles.quiz}>
        {questions.map((q, qi) => {
          const chosen = answers[q.id];
          const isCorrect = chosen === q.correctIndex;
          return (
            <div className={styles.qcard} key={q.id}>
              <div className={styles.qNum}>Question {qi + 1}</div>
              <div className={styles.qText}>{q.question}</div>
              <div className={styles.qOptions}>
                {q.options.map((opt, oi) => {
                  let cls = styles.qOpt;
                  if (checked && oi === q.correctIndex) {
                    cls = `${styles.qOpt} ${styles.qRight}`;
                  } else if (checked && oi === chosen && oi !== q.correctIndex) {
                    cls = `${styles.qOpt} ${styles.qWrong}`;
                  } else if (chosen === oi) {
                    cls = `${styles.qOpt} ${styles.qChosen}`;
                  }
                  return (
                    <button
                      key={oi}
                      className={cls}
                      onClick={() => {
                        setChecked(false);
                        setAnswers((a) => ({ ...a, [q.id]: oi }));
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {checked && chosen !== undefined ? (
                <div
                  className={`${styles.qExplain} ${
                    isCorrect ? styles.qExplainOk : styles.qExplainNo
                  }`}
                >
                  {isCorrect ? "Correct. " : "Not quite. "}
                  {q.explain}
                </div>
              ) : null}
            </div>
          );
        })}

        {passed ? (
          <div className={styles.quizPass}>
            <div className={styles.quizPassText}>
              That is exactly it. You understand what a support bot needs and
              where it should step back. Now build Velara's.
            </div>
            <button className="btn dark lg" onClick={onPass}>
              Start building →
            </button>
          </div>
        ) : (
          <div className={styles.quizFoot}>
            {checked && !allCorrect ? (
              <div className={styles.quizRetry}>
                Close. Look again at the ones marked above, adjust them, and
                check once more.
              </div>
            ) : null}
            <button
              className="btn dark"
              disabled={!allAnswered}
              onClick={() => setChecked(true)}
            >
              Check my answers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
