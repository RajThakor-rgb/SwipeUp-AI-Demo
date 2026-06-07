# SwipeUp AI Academy — Velara demo

A clickable demo of SwipeUp AI Academy: a **simulated company workstation** a
student logs into like a new hire. They join Velara, get onboarded by email,
are handed a real problem, solve it with AI inside the system, and watch the
business react to their work.

v1 ships the full shell with **one company case (Velara)** and **one working
tool (Claude, for prompt engineering)** running the complete learning loop:
**Context → Task → Try → Result → Improve → Reflect.**

## The loop & the result engine

Every attempt runs **two Claude calls**, server-side, in
[`app/api/claude/route.ts`](app/api/claude/route.ts):

1. **Generate** — turns the student's prompt into an actual launch email.
2. **Judge** — scores that email against fixed criteria and returns **strict
   JSON** (structured outputs): a score + reason per criterion, plus a change
   to each dashboard metric, plus an overall band.

The dashboard moves by the judge's deltas (clamped to sane ranges). It can fall.
A weak prompt dips or barely moves; only an on-brand, specific, lapsed-customer
email earns a real lift. Pressing submit never guarantees a rise.

## Run locally

```bash
npm install
cp .env.example .env.local   # then paste your key into .env.local
npm run dev                  # http://localhost:3000
```

The key is read **only on the server**. Without it, the workstation is fully
clickable and the Claude tool shows a clear "AI not connected" message.

## Deploy (Vercel)

The repo is connected to Vercel. Push to the branch and Vercel builds it. Set
the API key once:

- Vercel → Project → **Settings → Environment Variables**
- Add `ANTHROPIC_API_KEY` = your key → redeploy.

## Where to edit things

| You want to change…                | Edit…                          |
| ---------------------------------- | ------------------------------ |
| Company, emails, task, copy        | `config/case.ts`               |
| Metrics, judging criteria, bands   | `config/case.ts`               |
| The Claude model                   | `MODEL` in `config/case.ts`    |
| The desktop tool icons             | `config/tools.ts`              |
| Generate / judge prompts & engine  | `app/api/claude/route.ts`      |

## Built to grow

The shell is **tool-agnostic**. A future tool (the locked "Customer Chatbot"
and "Automation" teaser emails) is a new entry in `config/tools.ts` plus an
email in `config/case.ts` — not a rebuild. The result engine, dashboard, comms,
and the three interruption beats (onboarding, reaction, debrief) are shared.

## Stack

Next.js (App Router) · TypeScript · `@anthropic-ai/sdk` · plain CSS. No auth
(login is visual only). Panels open/close/minimise — not a draggable window
manager, by design.
