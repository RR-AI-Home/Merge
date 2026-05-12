# QA Runs

> **Purpose:** This is the working log for QA passes.
>
> Use [BUGS.md](./BUGS.md) for the canonical list of confirmed active bugs. Use this file for run-by-run findings, verification notes, blocked checks, and fixed confirmations.

---

## 2026-05-12 — Unity Board Mockup Alignment Pass

### Scope

- Unity `MergeClientController` Board screen layout.
- HUD spacing, resource pills, status lines, pause/reset buttons.
- Board panel, slot color, item card brightness, contract sizing, progress strips, action buttons, and bottom navigation.
- Scaffold tests for the approved first playable mockup direction.

### Findings

- `PASSED` targeted Unity scaffold subset after tests were updated to lock the new layout target.
- `PASSED` `npm run verify`.
- `PASSED` `npm run unity:sync-source`.
- `CONFIRMED` live Unity source under `E:\Projects\Merge\Unity\MergeClient` matches the verified repo source.
- `NOTE` User must exit and re-enter Unity Play Mode to see synced runtime UI changes.

### Bug Doc Updates

- No [BUGS.md](./BUGS.md) update. No confirmed active defect remains from this pass.

---

## 2026-05-12 — Docs System Bootstrap

### Scope

- Reuse the source project docs operating model for Merge.
- Convert active docs to Merge platform terminology.
- Add role routing, sprint docs, QA structure, and session-start workflow.

### Findings

- `ADDED` root active docs for session handoff, project state, bugs, QA runs, TODO, changelog, completed work, and docs index.
- `ADDED` role docs for platform, Unity client, backend, QA, render performance, and security work.
- `ADDED` sprint structure with active Unity polish and platform foundation sprint records.
- `REMOVED BY DESIGN` source-project simulation/release-specific content from active Merge docs.

### Bug Doc Updates

- No [BUGS.md](./BUGS.md) update. This is documentation setup, not a defect.

---

## 2026-05-12 — Unity Mockup Parity Sprint Update

### Scope

- Active Unity first playable sprint wording.
- Saved mockup reference path.
- Project state and backlog alignment.

### Findings

- `CONFIRMED` the approved mockup is saved at `docs/mockups/unity-first-playable-loop.html`.
- `UPDATED` the active Unity sprint so exact Board screen parity with the saved mockup is the current focus.
- `UPDATED` project state, backlog, and docs index to point at the saved mockup as the comparison source.

### Bug Doc Updates

- No [BUGS.md](./BUGS.md) update. This is sprint planning/documentation alignment, not a defect.

---

## Template

```md
## YYYY-MM-DD — [Frontend QA Run | Backend QA Run | Unity QA Run | Mixed QA Run]

### Scope
- screen / feature / environment / account

### Findings
- `NEW BUG` ...
- `CONFIRMED` ...
- `FIX VERIFIED` ...
- `EXPECTED` ...
- `BLOCKED` ...

### Bug Doc Updates
- Added Bug #...
- Updated Bug #...
- No BUGS.md changes
```
