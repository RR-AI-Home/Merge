# Agent Roles

This folder defines the working roles for the Merge platform. [../SESSION_START.md](../SESSION_START.md) is the normal entry point; it routes `@agent ...` requests to the correct role file here.

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

## Role Routing

| User route | Role file | Use for |
|---|---|---|
| `@agent platform` | [platform_engineer.md](./platform_engineer.md) | Shared engine, theme contracts, app generation, verification gates |
| `@agent unity` or `@agent client` | [unity_client_engineer.md](./unity_client_engineer.md) | Unity mobile UI/client implementation, TextMeshPro, Canvas layout, input, Android build path |
| `@agent backend` | [backend_engineer.md](./backend_engineer.md) | Future backend services, accounts, cloud saves, liveops, analytics, remote config |
| `@agent qa` | [qa_engineer.md](./qa_engineer.md) | Browser/Unity QA, regression checks, docs evidence, bug confirmation |
| `@agent render perf`, `@agent performance`, or `@agent rendering qa` | [render_performance_monitor.md](./render_performance_monitor.md) | Mobile render-quality/performance review after UI or Unity changes |
| `@agent security` or `@agent appsec` | [security_engineer.md](./security_engineer.md) | Appsec/privacy review once backend, auth, purchases, or analytics are introduced |

If the user names a role that does not exist, start with [../SESSION_START.md](../SESSION_START.md), then use the closest role above and state the assumption.

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
- Security audit reports live under `docs/security/`; only confirmed active vulnerabilities that need engineering work should be copied into `BUGS.md`.

## Maintenance

Update these role files when the stack, deployment model, validation commands, Unity setup, backend plan, or doc workflow changes. Stale role instructions are worse than no role instructions.

