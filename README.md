# Merge Platform

White-label merge-game platform repo.

The goal is to build one reusable merge engine, then produce separate unlinked themed games from that engine. The player does not switch themes at runtime; each app output has its own identity, save data, analytics stream, and store presence.

## Current Foundation

- Shared packages live under `packages/`.
- Standalone game app shells live under `apps/`.
- Theme data lives under `themes/`.
- Regression scripts validate every completed theme before engine changes are considered safe.

## Client And Backend Direction

Production mobile clients should be built in Unity. Unity owns mobile rendering, interaction feel, animation, audio, device integration, and store builds.

The platform/backend remains separate from Unity. Shared rules, theme contracts, validation, app identity generation, liveops configuration, analytics schema, persistence contracts, and future backend services stay outside the Unity client. The current browser apps are fast validation harnesses, not the final production client target.

See [docs/UNITY_CLIENT_ARCHITECTURE.md](docs/UNITY_CLIENT_ARCHITECTURE.md) for the full decision.

## Commands

```bash
npm test
npm run create:game -- --slug merge-space-colony --name "Merge Space Colony" --theme-id space-colony --app-id com.mergeplatform.spacecolony --template sci-fi
npm run validate:themes
npm run smoke:apps
npm run verify:playable
npm run verify
```

## Local Workspace Notes

- Use `E:\tmp` for temporary local dry runs, generated scratch output, and other disposable workspace files.

## Creating a New Standalone Game

Use the generator to scaffold a new app/theme pair from the shared factory pattern:

```bash
npm run create:game -- --slug merge-space-colony --name "Merge Space Colony" --theme-id space-colony --app-id com.mergeplatform.spacecolony --template sci-fi
```

The generated app has its own app identity, save namespace, analytics stream, theme data, and browser entrypoint. It uses the shared merge app session and browser shell, with no runtime theme switcher. After generation, run `npm run verify`; theme validation, app identity smoke checks, and playable app checks will discover the new app automatically.

Supported starter templates:

- `cozy`
- `crime`
- `fantasy`
- `sci-fi`

Each template generates themed starter chains, producer naming, first order, event title, copy, icons, and color tokens while keeping the output contract-valid and playable.

For dry runs or tooling, add `--root-dir <path>` to write the scaffold into another directory.

No database is required for this prototype workflow. Standalone browser apps load static theme JSON and persist local prototype saves by app-specific browser storage keys. `npm run verify:playable` imports each standalone app session, loads its theme data, starts a save, taps the primary producer, and confirms the first loop is playable.

## Engine Compatibility Rule

Engine updates must keep all completed themes working. Run `npm run verify` before considering a shared engine change safe.

If a theme needs behavior that the engine does not support, treat that as a platform feature and validate it against every completed theme.

See [docs/ENGINE_COMPATIBILITY.md](docs/ENGINE_COMPATIBILITY.md) for the full rule.
