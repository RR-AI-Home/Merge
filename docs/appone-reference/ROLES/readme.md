# Agent Roles

This folder defines the working roles for agents on Cricket Rivals. `SESSION_START.md` is the normal entry point; it routes `@agent ...` requests to the correct role file here.

## Superpowers-First Default

All agent roles use Superpowers-first operation by default. Before starting role-specific work, check whether a Superpowers skill applies to the user's task, invoke the relevant skill, and follow it. Then use these role docs to set domain scope, ownership boundaries, required reading, validation, and reporting.

User instructions override Superpowers and role docs. If the user explicitly requests a different workflow, follow the user and state any practical risk.

## Standard Role Flow

Every role follows the same startup order:

1. Check and use relevant Superpowers skills.
2. Read [communication.md](./communication.md).
3. Read the requested role file from this folder.
4. Read [../SESSION_START.md](../SESSION_START.md).
5. Read [../PROJECT_STATE.md](../PROJECT_STATE.md) when the task needs full active context.
6. Read role-specific supporting docs only when relevant.

Do not rely on old role prompts that mention numbered `PROJECT_STATE.md` sections. The active docs are now organized by headings and links, not stable section numbers.

## Role Routing

| User route | Role file | Use for |
|---|---|---|
| `@agent frontend` | [frontend_engineer.md](./frontend_engineer.md) | Web/mobile UI implementation, auth screens, app UX, client runtime behavior |
| `@agent backend` | [backend_engineer.md](./backend_engineer.md) | API, Prisma, services, simulation, Fly/Supabase backend work |
| `@agent frontend qa`, `@agent frontend-qa`, or `@agent qa frontend` | [frontend_qa.md](./frontend_qa.md) | Browser/mobile QA, UX audits, visual/layout regressions, player-flow testing |
| `@agent backend qa`, `@agent backend-qa`, or `@agent qa backend` | [backend_qa.md](./backend_qa.md) | API/state QA, persistence checks, validation drift, backend stale-code review |
| `@agent security` or `@agent appsec` | [security_engineer.md](./security_engineer.md) | Application security audit, OWASP mapping, API/WebSocket/auth/privacy review |
| `@agent render perf`, `@agent performance`, `@agent perf monitor`, or `@agent rendering qa` | [render_performance_monitor.md](./render_performance_monitor.md) | Render-performance QA after major mobile/UI changes, Live Match/friendly smoke, profiler/frame-pacing evidence, SVG/list/timer/state audits |

If the user names a role that does not exist, start with `SESSION_START.md`, then use the closest role above and state the assumption.

## Role File Standard

Each role file should keep these headings:

- Role
- Activation
- Mission
- Required Reading
- Primary Scope
- Out Of Scope
- Workflow
- Evidence And Reporting
- Documentation Updates
- Validation
- Example Prompt

## Documentation Rules

- `TODO.md`, `SESSION_START.md`, and `PROJECT_STATE.md` stay focused on current state and active work.
- Completed implementation details move to `COMPLETED_WORK.md`; user-facing changes move to `CHANGELOG.md`.
- Confirmed active bugs live only in `BUGS.md`.
- QA pass history lives in `QA_RUNS.md` and detailed reports under `docs/qa/`.
- Security audit reports should live under `docs/security/` and only confirmed active vulnerabilities that need engineering work should be copied into `BUGS.md`.

## Maintenance

Update these role files when the stack, deployment model, validation commands, or doc workflow changes. Keep the role docs practical and current; stale role instructions are worse than no role instructions.
