"use client";

// A closeable popup that shows a framework's breakdown. Opened from the
// "frameworks" buttons in practice so the student can refresh their memory
// without leaving the task.

import type { Framework } from "@/config/learn";

export default function FrameworkModal({
  framework,
  onClose,
}: {
  framework: Framework;
  onClose: () => void;
}) {
  return (
    <div className="fw-overlay" onClick={onClose}>
      <div className="fw-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fw-modal-head">
          <div>
            <div className="fw-modal-name">{framework.name}</div>
            <div className="fw-modal-tag">{framework.tagline}</div>
          </div>
          <button className="fw-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="fw-modal-body">
          {framework.letters.map((l) => (
            <div className="fw-row" key={l.name}>
              <span className="fw-letter">{l.letter}</span>
              <span className="fw-text">
                <b>{l.name}</b> {l.blurb}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
