"use client";

// The comprehension gate: a short check that the student understood the
// frameworks before they practise. Professor tone, never a hard fail: they fix
// and recheck until it clicks, then move on.

import { useMemo, useState } from "react";
import { LEARN_COPY, QUIZ } from "@/config/learn";
import { useWorkstation } from "@/lib/state";

/** Shuffle each question's options once per session so the correct answer is
 *  never in a fixed position. */
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

export default function Quiz() {
  const { dispatch } = useWorkstation();
  const questions = useMemo(shuffleQuiz, []);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const allCorrect = questions.every((q) => answers[q.id] === q.correctIndex);
  const passed = checked && allCorrect;

  return (
    <div className="quiz">
      <div className="learn-intro">
        <div className="li-eyebrow">Quick check</div>
        <h2>Have you got it?</h2>
        <p>Answer these and you are ready to use the frameworks for real.</p>
      </div>

      {questions.map((q, qi) => {
        const chosen = answers[q.id];
        const isCorrect = chosen === q.correctIndex;
        return (
          <div className="qcard" key={q.id}>
            <div className="q-num">Question {qi + 1}</div>
            <div className="q-text">{q.question}</div>
            <div className="q-options">
              {q.options.map((opt, oi) => {
                const state =
                  checked && oi === q.correctIndex
                    ? "right"
                    : checked && oi === chosen && oi !== q.correctIndex
                      ? "wrong"
                      : chosen === oi
                        ? "chosen"
                        : "";
                return (
                  <button
                    key={oi}
                    className={`q-opt ${state}`}
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
              <div className={`q-explain ${isCorrect ? "ok" : "no"}`}>
                {isCorrect ? "Correct. " : "Not quite. "}
                {q.explain}
              </div>
            ) : null}
          </div>
        );
      })}

      {passed ? (
        <div className="quiz-pass">
          <div className="qp-text">{LEARN_COPY.gatePassed}</div>
          <button
            className="btn dark lg"
            onClick={() => {
              dispatch({ type: "PASS_QUIZ" });
              dispatch({ type: "SET_STAGE", value: "practice" });
            }}
          >
            Start practising →
          </button>
        </div>
      ) : (
        <div className="quiz-foot">
          {checked && !allCorrect ? (
            <div className="quiz-retry">Close. Adjust the ones marked above and check again.</div>
          ) : null}
          <button className="btn dark" disabled={!allAnswered} onClick={() => setChecked(true)}>
            Check my answers
          </button>
        </div>
      )}
    </div>
  );
}
