# Agent Call Guide

Use this as the quick reference for which Cricket Rivals agent to call and what each one is expected to do.

## Defaults

You do not need to tell routed agents to read the standard startup docs. Every role starts with relevant Superpowers skills, then `docs/ROLES/communication.md`, its role file, `docs/SESSION_START.md`, and `docs/PROJECT_STATE.md` when context is needed.

QA and security roles also read their bug, QA, security, and reference docs as defined in their role files. Only name a specific report when the task depends on that exact report.

## Quick Sprint Work

Use this when you want the right engineer to continue the current active path.

```md
@agent frontend

Continue with the current sprint.
```

```md
@agent backend

Continue with the current sprint.
```

## Frontend QA

Routes: `@agent frontend qa`, `@agent frontend-qa`, `@agent qa frontend`

Does: browser/mobile QA, UX review, visual/layout regression checks, navigation testing, player-flow validation. It reports confirmed bugs but does not fix code.

```md
@agent frontend qa

Run a full frontend QA pass for [flow/screen] on web :8081 using the web/browser agent.
Create a temporary QA user if needed.
Show findings on screen and write the full report to docs/qa/.
Update docs/QA_RUNS.md.
Add only confirmed active bugs to docs/BUGS.md.
Do not fix code.
```

## Backend QA

Routes: `@agent backend qa`, `@agent backend-qa`, `@agent qa backend`

Does: API/state/persistence QA, backend contract checks, simulation result checks, stale backend code review, duplicate backend logic review. It verifies backend truth before classifying defects and does not fix code.

```md
@agent backend qa

Run a backend QA pass for [flow/feature].
Verify API/state/persistence behavior.
Look for stale backend code and duplicate logic that can be shared.
Create a temporary QA user if needed.
Show findings on screen and write the full report to docs/qa/.
Update docs/QA_RUNS.md.
Add only confirmed active bugs to docs/BUGS.md.
Do not fix code.
```

## Security Audit

Routes: `@agent security`, `@agent appsec`

Does: application security audit, OWASP/MASVS review, privacy review, threat modeling, abuse review, and release-blocking security checks. It writes reports to `docs/security/`, not `docs/qa/`.

```md
@agent security

Run a security audit for [scope/feature/flow].
Prioritize real exploitable risks over generic hardening.
Check auth, authorization, API validation, WebSocket security, game-logic integrity, token handling, privacy, secrets, headers, rate limits, logging, and deployment risks as relevant.
Map findings to OWASP Top 10 and MASVS themes where useful.
Show findings on screen and write the full report to docs/security/.
Add only confirmed active vulnerabilities that require engineering work to docs/BUGS.md.
Do not fix code.
Do not run destructive exploit tests or aggressive production scanning.
```

For a full release-candidate security pass:

```md
@agent security

Run a release-candidate security audit for auth, API, WebSocket, privacy, mobile token handling, game-logic integrity, and deployment.
Prioritize Critical/High exploitable issues, map findings to OWASP, write the report to docs/security/, and add only confirmed active vulnerabilities to docs/BUGS.md.
Update docs/QA_RUNS.md if verification checks are run.
Update docs/PROJECT_STATE.md or docs/SESSION_START.md only if a finding blocks release.
Do not print secrets, tokens, API keys, DB passwords, or private user data.
Do not fix code.
Do not run destructive exploit tests or aggressive production scanning.
```

## Render Performance QA

Routes: `@agent render perf`, `@agent performance`, `@agent perf monitor`, `@agent rendering qa`

Does: post-change render-performance QA for mobile/UI work. It checks render churn, SVG/list cost, timers, state subscriptions, browser smoke, profiler/frame-pacing evidence, and physical Android blockers. It reports confirmed player-facing performance bugs but does not fix code.

```md
@agent render perf

Run a render-performance QA pass for [flow/screen/change area].
Focus on render churn, SVG/list cost, timers, state subscriptions, profiler/frame-pacing evidence, browser smoke, and physical Android blockers where relevant.
Show findings on screen and write the full report to docs/qa/.
Update docs/QA_RUNS.md.
Update the mobile rendering performance sprint notes if confidence or remaining risk changes.
Add only confirmed active player-facing performance bugs to docs/BUGS.md.
Do not fix code.
Do not claim Android FPS, thermals, battery, GPU overdraw, or memory behavior from web-only evidence.
```

## Fix Confirmed QA Bugs

Use engineering agents for fixes. Point them at the exact QA report they should work from.

```md
@agent frontend

Fix the confirmed frontend bugs from docs/qa/[report].md.

Rules:
- Start by listing the specific bugs you will fix from the report.
- Do not work on speculative QA notes unless they are confirmed or clearly reproducible.
- Keep fixes scoped and avoid unrelated refactors.
- Update docs/BUGS.md, docs/QA_RUNS.md, and docs/PROJECT_STATE.md only where the fix status changes.
- Run relevant checks/tests.
```

```md
@agent backend

Fix the confirmed backend bugs from docs/qa/[report].md.

Rules:
- Start by listing the specific bugs you will fix from the report.
- Use the QA report for repro steps, root-cause notes, stale-code findings, and duplicate-code cleanup opportunities.
- Fix active bugs first; only clean stale/duplicate code when it is directly related or low-risk.
- Keep changes scoped.
- Update docs/BUGS.md, docs/QA_RUNS.md, and docs/PROJECT_STATE.md only where the fix status changes.
- Run relevant checks/tests.
```

## Full Mobile Performance Optimization

Use `@agent frontend` for implementation. Use Render Performance QA afterward to review what changed.

```md
@agent frontend

Perform a full mobile rendering-performance audit and optimization pass across the whole game.
Prioritize Live Match/Broadcast/Match Director, then Challenge, Tower, Cup, Compete, Dashboard, rewards, Squad, tactics, training, scouting, and player lists.
Reduce unnecessary React re-renders, expensive SVG/render trees, JS thread work, bridge traffic, memory growth, GC spikes, Android overdraw, battery, and thermal pressure.
Use safe, measurable fixes only: React.memo, useMemo/useCallback, cached geometry, reduced SVG nodes, virtualized lists, throttled non-essential updates, cleaned timers/subscriptions, and smaller repo-consistent abstractions.
Do not change backend/simulation logic unless a frontend performance issue requires a small shared contract adjustment.
Run mobile validation: npm run check:syntax and npm run lint from mobile_cricket_rivals/.
Report implemented changes, estimated impact, remaining risks, and the next-priority fixes.
```

## Important Distinctions

- QA agents find and document issues; they do not fix code.
- Engineer agents fix or implement.
- Security reports go under `docs/security/`; QA and render-performance reports go under `docs/qa/`.
- `docs/BUGS.md` is only for confirmed active bugs or vulnerabilities requiring engineering work.
- Web/browser evidence is not enough to claim Android FPS, thermals, battery, GPU overdraw, or memory behavior.
