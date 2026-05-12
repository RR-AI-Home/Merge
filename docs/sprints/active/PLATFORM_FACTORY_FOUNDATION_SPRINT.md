# Platform Factory Foundation Sprint

## Status

Active.

## Objective

Keep the merge platform reusable so every new theme can become a separate standalone app using the same engine, validation gates, and Unity adapter path.

## Current Baseline

- Shared engine and theme tooling exist.
- Merge Syndicate and Kingdom Lite prove separate app identities in browser outputs.
- Unity consumes exported `cyber-syndicate` data.
- `npm run verify` checks engine behavior, theme contracts, standalone app identity, browser playability, and Unity scaffold expectations.

## Work Items

- [ ] Keep engine changes compatible with all completed themes.
- [ ] Define a theme creation checklist for new standalone games.
- [ ] Improve theme export docs for Unity.
- [ ] Define how generated Unity app identity, save namespace, analytics stream, and store metadata should be separated per theme.
- [ ] Add docs for upgrading previous themes when shared engine behavior changes.
- [ ] Decide the first backend contract slice only after local first playable quality is strong.

## Non-Goals

- Runtime theme switching.
- A database for local first playable.
- Liveops or monetization implementation before the core loop is stable.

## Validation

```powershell
npm run verify
```

## Done Criteria

- A new theme can be planned without changing the engine ad hoc.
- Existing themes remain covered by verification.
- Unity export path remains documented and repeatable.
- Active platform decisions are reflected in [../../PROJECT_STATE.md](../../PROJECT_STATE.md).

---

**Last Updated:** 2026-05-12
