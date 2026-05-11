# Merge Platform

White-label merge-game platform repo.

The goal is to build one reusable merge engine, then produce separate unlinked themed games from that engine. The player does not switch themes at runtime; each app output has its own identity, save data, analytics stream, and store presence.

## Current Foundation

- Shared packages live under `packages/`.
- Standalone game app shells live under `apps/`.
- Theme data lives under `themes/`.
- Regression scripts validate every completed theme before engine changes are considered safe.

## Commands

```bash
npm test
npm run validate:themes
npm run smoke:apps
npm run verify
```

## Engine Compatibility Rule

Engine updates must keep all completed themes working. Run `npm run verify` before considering a shared engine change safe.

If a theme needs behavior that the engine does not support, treat that as a platform feature and validate it against every completed theme.

See [docs/ENGINE_COMPATIBILITY.md](docs/ENGINE_COMPATIBILITY.md) for the full rule.
