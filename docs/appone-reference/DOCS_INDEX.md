# Documentation Index

> Core rule: start from the smallest current doc you need. Do not read historical sprint or archive docs unless the task needs that history.

## Start Here

- [SESSION_START.md](./SESSION_START.md) - first read for current handoff, phase, services, and immediate priorities.
- [PROJECT_STATE.md](./PROJECT_STATE.md) - current phase, active path, and release state.
- [AGENT_CALL_GUIDE.md](./AGENT_CALL_GUIDE.md) - concise prompts for calling each agent and confirming what they do.
- [ROLES/readme.md](./ROLES/readme.md) - agent role routing, including the Render Performance QA role for post-change rendering checks.
- [TODO.md](./TODO.md) - current backlog only.
- [BUGS.md](./BUGS.md) - confirmed active defects only.
- [QA_RUNS.md](./QA_RUNS.md) - run-by-run QA evidence and fixed confirmations.
- [CHANGELOG.md](./CHANGELOG.md) and [COMPLETED_WORK.md](./COMPLETED_WORK.md) - completed work history.

## Current Structure

- `reference/` - stable project, architecture, engine, workflow, and setup references.
- `specs/` - product and technical specs for systems or planned system changes.
- `FEATURES/` - feature-specific plans and product design docs.
- `roadmaps/` - forward-looking sequencing and monetization/retention planning.
- `sprints/active/` - sprint docs that still need reconciliation or may drive current work.
- `sprints/completed/` - implemented or closed sprint records.
- `RELEASE/` - launch prep, store submission, smoke checklist, and domain docs.
- `ROLES/` - agent role guides; current roles use Superpowers-first operation by default.
- `LEGAL/` - legal drafts.
- `qa/` - detailed QA reports.
- `security/` - security reports; start at [security/README.md](./security/README.md) for current status. Current audit/follow-through set is confirmed closed with nothing outstanding.
- `archive/` - historical docs only; do not treat these as active instructions.

## Reference Docs

- [reference/ARCHITECTURE_MAP.md](./reference/ARCHITECTURE_MAP.md) - generated screen/API/service/repo map.
- [reference/DEPLOYMENT_ARCHITECTURE.md](./reference/DEPLOYMENT_ARCHITECTURE.md) - Fly.io, Supabase, hosted web, and mobile release shape.
- [reference/LOCAL_DEVELOPMENT.md](./reference/LOCAL_DEVELOPMENT.md) - local backend, database, web, and mobile setup.
- [reference/MOBILE_APP.md](./reference/MOBILE_APP.md) - mobile app structure and common Expo commands.
- [reference/ENGINE.md](./reference/ENGINE.md) - match engine, player generation, and simulation rules.
- [reference/COMPONENT_QUICK_REFERENCE.md](./reference/COMPONENT_QUICK_REFERENCE.md) - shared UI component reference.
- [reference/CORE_GAME_FLOW.md](./reference/CORE_GAME_FLOW.md) - canonical manager journey for QA/product flow.
- [reference/DEBUGGING_SCRIPTS.md](./reference/DEBUGGING_SCRIPTS.md) - debugging and verification scripts.
- [reference/GIT_WORKFLOW.md](./reference/GIT_WORKFLOW.md) - git and multi-agent workflow rules.
- [reference/TECH_STACK.md](./reference/TECH_STACK.md) - current stack summary.

## Specs

- [specs/TOWER_SPEC.md](./specs/TOWER_SPEC.md) - Tower PVE mode spec.
- [specs/LEAGUE_DESIGN.md](./specs/LEAGUE_DESIGN.md) - daily league system design.
- [specs/REFACTOR_CHALLENGES.md](./specs/REFACTOR_CHALLENGES.md) - Challenge refactor notes.
- [specs/RATING_SYSTEM_PLAN.md](./specs/RATING_SYSTEM_PLAN.md) - implemented rating-system plan.
- [specs/BOWLING_VARIATIONS_PLAN.md](./specs/BOWLING_VARIATIONS_PLAN.md) - planned advanced bowling variations.

## Active Planning

- [sprints/active/MOBILE_RENDERING_PERFORMANCE_SPRINT.md](./sprints/active/MOBILE_RENDERING_PERFORMANCE_SPRINT.md) - active mobile rendering performance sprint and local profiling notes.
- [sprints/active/LIVE_MATCH_2D_25D_MATCH_DIRECTOR_SPRINT.md](./sprints/active/LIVE_MATCH_2D_25D_MATCH_DIRECTOR_SPRINT.md) - completed/source-reference mobile live-match 2D/2.5D match director sprint.
- [sprints/canceled/THREE_D_MATCH_DIRECTOR_SPRINT.md](./sprints/canceled/THREE_D_MATCH_DIRECTOR_SPRINT.md) - canceled Three.js source sprint; use as reusable design inventory, not the active task list.
- [roadmaps/MONETIZATION_ROADMAP.md](./roadmaps/MONETIZATION_ROADMAP.md) - monetization roadmap and future slices.
- [roadmaps/MONETIZATION_FOUNDATION_PLAN.md](./roadmaps/MONETIZATION_FOUNDATION_PLAN.md) - monetization foundation plan.
- [roadmaps/RETENTION_LIVE_OPS_READINESS.md](./roadmaps/RETENTION_LIVE_OPS_READINESS.md) - post-release retention/live-ops readiness.
- [sprints/completed/SCOUTING_SYSTEM_SPRINT.md](./sprints/completed/SCOUTING_SYSTEM_SPRINT.md) - completed scouting sprint record.

## Feature Plans

Feature plans remain in [FEATURES/](./FEATURES/). Completed feature plans move to [FEATURES/completed/](./FEATURES/completed/). Important current/recent docs include:

- [FEATURES/completed/LOGGED_IN_BRAND_VISIBILITY_PHASE_PLAN.md](./FEATURES/completed/LOGGED_IN_BRAND_VISIBILITY_PHASE_PLAN.md)
- [FEATURES/FRIEND_CHALLENGE_SYSTEM_PHASE_PLAN.md](./FEATURES/FRIEND_CHALLENGE_SYSTEM_PHASE_PLAN.md)
- [FEATURES/RETENTION_REDESIGN_PLAN.md](./FEATURES/RETENTION_REDESIGN_PLAN.md)
- [FEATURES/RETENTION_REDESIGN_IMPLEMENTATION_PLAN.md](./FEATURES/RETENTION_REDESIGN_IMPLEMENTATION_PLAN.md)
- [FEATURES/ENGAGEMENT_TIME_EXPANSION_PHASE_PLAN.md](./FEATURES/ENGAGEMENT_TIME_EXPANSION_PHASE_PLAN.md)
- [FEATURES/DAILY_LOGIN_SYSTEM_SPEC.md](./FEATURES/DAILY_LOGIN_SYSTEM_SPEC.md)
- [FEATURES/TOWER_REBALANCE_SPEC.md](./FEATURES/TOWER_REBALANCE_SPEC.md)
- [FEATURES/MULTI_FORMAT_EXPANSION_PLAN.md](./FEATURES/MULTI_FORMAT_EXPANSION_PLAN.md)

## Release Docs

- [RELEASE/README.md](./RELEASE/README.md)
- [RELEASE/LAUNCH_PREP_STATUS.md](./RELEASE/LAUNCH_PREP_STATUS.md)
- [RELEASE/CROSS_PLATFORM_SMOKE_CHECKLIST.md](./RELEASE/CROSS_PLATFORM_SMOKE_CHECKLIST.md)
- [RELEASE/STORE_METADATA_PACK.md](./RELEASE/STORE_METADATA_PACK.md)
- [RELEASE/PLAY_STORE_SUBMISSION_PREP.md](./RELEASE/PLAY_STORE_SUBMISSION_PREP.md)
- [RELEASE/APP_STORE_SUBMISSION_PREP.md](./RELEASE/APP_STORE_SUBMISSION_PREP.md)
- [RELEASE/DOMAIN_SETUP_LINEUPGAMES.md](./RELEASE/DOMAIN_SETUP_LINEUPGAMES.md)

## Historical Buckets

- [sprints/completed/](./sprints/completed/) - completed sprint records.
- [sprints/canceled/](./sprints/canceled/) - superseded sprint records preserved for reference.
- [archive/completed/](./archive/completed/) - completed implementation checklists, duplicate historical plans, and old summaries.
- [archive/reports/](./archive/reports/) - one-off investigation reports.
- [archive/](./archive/) - older historical docs from previous phases.

## Cleanup Audit

- [DOCS_CLEANUP_AUDIT_2026-05-07.md](./DOCS_CLEANUP_AUDIT_2026-05-07.md) records the cleanup scan, decisions, and follow-up recommendations.
