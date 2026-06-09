// ============================================================================
// LEARN CONTENT — generic prompt-engineering teaching (not case-specific)
// ----------------------------------------------------------------------------
// The "Prepare" step teaches two widely used, credible frameworks: CO-STAR and
// RISEN. Then a short comprehension gate checks understanding before the student
// applies them to the real Velara task. Edit all teaching copy here.
// ============================================================================

export interface FrameworkLetter {
  letter: string;
  name: string;
  blurb: string;
}

export interface Framework {
  id: string;
  name: string;
  tagline: string;
  letters: FrameworkLetter[];
}

export const FRAMEWORKS: Framework[] = [
  {
    id: "costar",
    name: "CO-STAR",
    tagline: "Great for written content: emails, posts, campaigns.",
    letters: [
      { letter: "C", name: "Context", blurb: "The background the AI needs to understand the situation." },
      { letter: "O", name: "Objective", blurb: "Exactly what you want it to do." },
      { letter: "S", name: "Style", blurb: "The kind of writing: editorial, plain, persuasive." },
      { letter: "T", name: "Tone", blurb: "The attitude: warm, formal, confident, understated." },
      { letter: "A", name: "Audience", blurb: "Who it is for. The single biggest lever on quality." },
      { letter: "R", name: "Response", blurb: "The format you want back: a short email, a list, a subject line." },
    ],
  },
  {
    id: "risen",
    name: "RISEN",
    tagline: "Great for tasks and reasoning: plans, analysis, steps.",
    letters: [
      { letter: "R", name: "Role", blurb: "Who the AI should act as. 'You are a senior copywriter.'" },
      { letter: "I", name: "Instructions", blurb: "The task, stated plainly." },
      { letter: "S", name: "Steps", blurb: "The steps to follow, if order matters." },
      { letter: "E", name: "End goal", blurb: "What a great result looks like." },
      { letter: "N", name: "Narrowing", blurb: "The constraints: length, what to avoid, must-haves." },
    ],
  },
];

/** A generic before/after, deliberately NOT about Velara, to teach the idea. */
export const BEFORE_AFTER = {
  topic: "A simple example: a welcome email for a meditation app",
  weak: {
    label: "Vague prompt",
    prompt: "Write a welcome email for our app.",
    output:
      "Subject: Welcome!\n\nThanks for signing up. Our app has lots of great features to help you. Get started today and let us know if you have questions!",
    note: "No audience, no tone, no goal. The AI guesses, and you get generic filler.",
  },
  strong: {
    label: "Engineered prompt (CO-STAR)",
    prompt:
      "Context: a meditation app for first-time meditators who feel anxious. Objective: welcome new free-trial users and get them to do their first 3-minute session. Style: plain and calm. Tone: warm, reassuring, no hype. Audience: beginners who are sceptical it will work. Response: a 70-word email with one clear call to action.",
    output:
      "Subject: Your first three minutes\n\nStarting something new can feel like a lot. So we have kept it simple: one session, three minutes, eyes open or closed. No streaks to keep, nothing to get right. Find a quiet moment today and press play. We will be here when you are ready.\n\nBegin your first session",
    note: "Audience, tone, goal and format are all set. The AI has what it needs, and the output is specific and human.",
  },
};

/** Comprehension gate. The student must answer correctly to move to the practical. */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  /** Shown after answering, in a professor voice. */
  explain: string;
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "In CO-STAR, which element defines who the message is for?",
    options: ["Context", "Audience", "Response", "Style"],
    correctIndex: 1,
    explain:
      "Audience. Telling the AI exactly who it is writing to is the single biggest lever on how good the output feels.",
  },
  {
    id: "q2",
    question: "In RISEN, what does the 'N' stand for?",
    options: ["Notes", "Narrowing", "Naming", "Negotiation"],
    correctIndex: 1,
    explain:
      "Narrowing: the constraints. Length, what to avoid, and must-haves keep the AI on the rails.",
  },
  {
    id: "q3",
    question: "Why does a framework like CO-STAR produce better results than a one-line prompt?",
    options: [
      "It makes the prompt longer.",
      "It gives the AI the context, audience and format it would otherwise have to guess.",
      "It uses special keywords the AI is trained on.",
      "It tells the AI to try harder.",
    ],
    correctIndex: 1,
    explain:
      "Exactly. A good prompt removes guesswork. You supply the context, audience and format, so the AI can focus on doing the task well.",
  },
];

export const LEARN_COPY = {
  intro:
    "Before you write a single prompt, learn how professionals structure them. A good prompt is not about clever words. It is about giving the AI what it needs so it does not have to guess.",
  gatePassed:
    "Nicely done. Now that you understand the frameworks, let's put them to work on a real business problem.",
};
