# Session Start

> Start here for every session. Read [PROJECT_STATE.md](./PROJECT_STATE.md) next when full active context is needed.

---

## Default Agent Operating Mode

Use Superpowers-first operation by default. Before role-specific work, check whether a Superpowers skill applies, invoke it, and follow it. Then use the repo role docs for scope, ownership boundaries, required reading, validation, and reporting.

User instructions take priority over Superpowers and role docs. If the user asks for a different workflow, follow the user and call out any practical risk.

For routed role sessions, the startup order is:

1. Check and use relevant Superpowers skills.
2. Read [ROLES/communication.md](./ROLES/communication.md).
3. Read the matching role file under [ROLES/](./ROLES/).
4. Read this file.
5. Read [PROJECT_STATE.md](./PROJECT_STATE.md) when full active context is needed.

## Current Snapshot

**Project:** Merge platform / Merge Syndicate first playable  
**Phase:** Unity first playable polish and platform factory hardening  
**Repo source:** `C:\Users\badn3\OneDrive\Documents\Projects\Merge`  
**Unity project:** `E:\Projects\Merge\Unity\MergeClient`  
**Build/output root:** `E:\Projects\Merge`  
**Temp root:** `E:\tmp`

## Current State

- The repo is a platform/factory, not one mutable theme-switching game. Each shipped theme should become a separate standalone app with its own identity, save namespace, analytics stream, store metadata, and selected theme package.
- Browser/Node tooling proves the engine contracts, generated app identity, theme validation, and first playable loops quickly.
- Unity is the production mobile client target. The current Unity proof loads the `cyber-syndicate` theme and renders the board, producer crate, contracts, energy, local save, districts, collection, and bottom navigation in portrait.
- Java/backend services are planned later for accounts, cloud saves, liveops, offers, analytics delivery, and remote config. No database is required for the current local first playable proof.
- Unity projects, APK/AAB builds, Gradle outputs, Library folders, and caches should stay outside OneDrive under `E:\Projects`.

## Current Priority

1. Continue polishing the Unity first playable until the Board, Districts, Collection, and Shop placeholder screens feel like a production mobile merge game.
2. Preserve the platform contract: any engine update must keep all completed themes and generated apps working.
3. Keep docs current as decisions are made, especially when Unity architecture, theme contracts, or backend boundaries change.

## Agent Role Routing

- `@agent platform` -> [ROLES/platform_engineer.md](./ROLES/platform_engineer.md)
- `@agent unity` or `@agent client` -> [ROLES/unity_client_engineer.md](./ROLES/unity_client_engineer.md)
- `@agent backend` -> [ROLES/backend_engineer.md](./ROLES/backend_engineer.md)
- `@agent qa` -> [ROLES/qa_engineer.md](./ROLES/qa_engineer.md)
- `@agent render perf`, `@agent performance`, or `@agent rendering qa` -> [ROLES/render_performance_monitor.md](./ROLES/render_performance_monitor.md)
- `@agent security` or `@agent appsec` -> [ROLES/security_engineer.md](./ROLES/security_engineer.md)

Every role must first read [ROLES/communication.md](./ROLES/communication.md), then its role file, then this file. If the user says only "continue", follow the ordered work path below through that role's scope.

## Ordered Work Path

1. Execute [UNITY_FIRST_PLAYABLE_POLISH_SPRINT.md](./sprints/active/UNITY_FIRST_PLAYABLE_POLISH_SPRINT.md).
2. Execute [PLATFORM_FACTORY_FOUNDATION_SPRINT.md](./sprints/active/PLATFORM_FACTORY_FOUNDATION_SPRINT.md).
3. Keep `npm run verify` passing before and after shared engine/theme changes.
4. Sync verified Unity source into the live Unity project with `npm run unity:sync-source`.
5. Export theme data with `npm run unity:export-theme` after theme content changes.
6. Log QA evidence in [QA_RUNS.md](./QA_RUNS.md) and confirmed active defects in [BUGS.md](./BUGS.md).

## Doc Rules

- [PROJECT_STATE.md](./PROJECT_STATE.md) is the canonical active path.
- [TODO.md](./TODO.md) is current backlog only; completed items should not stay there.
- [BUGS.md](./BUGS.md) is confirmed active bugs only.
- [QA_RUNS.md](./QA_RUNS.md) is for QA pass logs, verification notes, blocked checks, and fixed confirmations.
- [CHANGELOG.md](./CHANGELOG.md) is user-facing history.
- [COMPLETED_WORK.md](./COMPLETED_WORK.md) is technical completion history.
- Before ending a docs/status task, move completed work out of `TODO.md`, `SESSION_START.md`, and `PROJECT_STATE.md`; leave those files focused on current state, active work, and active decisions.

## Technical Notes

- Do not auto-start long-running dev servers unless the user asks.
- Prefer `rg` for file and text search.
- Use `npm run verify` as the full repo confidence gate.
- Unity live project sync:

```powershell
npm run unity:sync-source
npm run unity:sync-packages
npm run unity:export-theme
```

- Unity editor version: `6000.4.6f1`.
- Android SDK path:

```powershell
$env:ANDROID_HOME="C:\Users\badn3\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT=$env:ANDROID_HOME
$env:Path="$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
```

---

**Last Updated:** 2026-05-12
