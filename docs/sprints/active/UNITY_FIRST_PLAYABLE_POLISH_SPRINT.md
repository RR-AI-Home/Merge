# Unity First Playable Polish Sprint

## Status

Active.

## Objective

Turn the Unity Merge Syndicate proof from a functional board into a first playable mobile screen that looks clear, sharp, readable, and intentionally designed.

## Current Baseline

- Unity client exists under `unity/MergeClient`.
- Live Unity project exists at `E:\Projects\Merge\Unity\MergeClient`.
- The Board screen supports producer taps, energy spend, item generation, drag-to-empty-slot, drag-to-merge, contract completion, local save/load, district progress, collection discovery, and bottom navigation.
- Text rendering uses TextMeshPro and imported/project TMP font assets.
- The approved browser mockup lives at [../../mockups/unity-first-playable-loop.html](../../mockups/unity-first-playable-loop.html).

## Work Items

- [ ] Continue Board screen visual parity with the approved mockup.
- [ ] Make contract cards readable with fixed text/action columns and no progress-bar overlap.
- [ ] Keep ready/claimable contracts visually obvious while preserving scroll reachability.
- [ ] Improve tile icon uniqueness and level readability.
- [ ] Refine HUD/resource pill spacing and copy length for portrait.
- [ ] Refine bottom navigation active/inactive states.
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

- User accepts the Board screen as first-playable quality.
- No known overlapping or unreadable gameplay text remains.
- All repo verification passes.
- Live Unity source is synced.
- QA notes are logged in [../../QA_RUNS.md](../../QA_RUNS.md).

---

**Last Updated:** 2026-05-12
