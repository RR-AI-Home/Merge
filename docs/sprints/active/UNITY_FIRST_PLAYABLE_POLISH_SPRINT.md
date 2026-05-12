# Unity First Playable Polish Sprint

## Status

Active.

## Objective

Make the Unity Merge Syndicate Board screen match the approved saved mockup as closely as Unity can reasonably support. The active sprint target is visual parity first: spacing, scale, color, typography, buttons, board slots, item tiles, contract cards, and bottom navigation should be treated as mismatches until they are intentionally matched or deliberately accepted as different.

## Current Baseline

- Unity client exists under `unity/MergeClient`.
- Live Unity project exists at `E:\Projects\Merge\Unity\MergeClient`.
- The Board screen supports producer taps, energy spend, item generation, drag-to-empty-slot, drag-to-merge, contract completion, local save/load, district progress, collection discovery, and bottom navigation.
- Text rendering uses TextMeshPro and imported/project TMP font assets.
- The approved browser mockup lives at [../../mockups/unity-first-playable-loop.html](../../mockups/unity-first-playable-loop.html).

## Comparison Source

Use this saved mockup as the sprint source of truth:

```text
docs\mockups\unity-first-playable-loop.html
```

When the local docs preview server is running, compare against:

```text
http://127.0.0.1:52347/unity-first-playable-loop.html
```

If the browser port changes, reopen the file from `docs/mockups/` or start a new local static server and use the same HTML file. Do not compare against memory or screenshots alone; use the saved mockup file as the reference.

## Work Items

- [ ] Match the Unity Board screen to the saved mockup top-to-bottom before expanding the sprint to other screens.
- [ ] Match HUD/resource pill spacing, title placement, status copy line breaks, and pause/reset button shape to the mockup.
- [ ] Match the board container, slot brightness, slot spacing, item tile size, item colors, and icon placement to the mockup.
- [ ] Match contract cards to the mockup, including fixed text/action columns, no progress-bar overlap, ready-state emphasis, and scroll reachability.
- [ ] Match bottom navigation button sizing, spacing, icon placement, active state, and label readability to the mockup.
- [ ] Improve tile icon uniqueness and level readability without breaking the mockup layout.
- [ ] Improve Districts and Collection screens to first-playable quality.
- [ ] Define the Shop placeholder screen without monetization commitments.
- [ ] Preserve `npm run verify` and `tests/unity-client-scaffold.test.js` coverage.

## Non-Goals

- Final monetization.
- Final art/audio pipeline.
- Backend/cloud save.
- APK/AAB release build unless explicitly pulled into the sprint.

## Validation

```powershell
npm test -- tests/unity-client-scaffold.test.js
npm run verify
npm run unity:sync-source
```

If theme data changes:

```powershell
npm run unity:export-theme
```

## Done Criteria

- User accepts the Board screen as matching the saved mockup closely enough for the first playable.
- Any remaining Unity-vs-mockup differences are listed and explicitly accepted.
- No known overlapping or unreadable gameplay text remains.
- All repo verification passes.
- Live Unity source is synced.
- QA notes are logged in [../../QA_RUNS.md](../../QA_RUNS.md).

---

**Last Updated:** 2026-05-12
