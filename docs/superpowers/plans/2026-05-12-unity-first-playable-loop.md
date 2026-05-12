# Unity First Playable Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Unity board proof into a first playable loop with session controls, real district progression, a collection book, and clearer item-level identity.

**Architecture:** Keep the repo-owned Unity source as the source of truth and continue programmatic UI construction in `MergeClientController`. Add lightweight screen state for `BOARD`, `DIST`, and `BOOK`, while keeping save/progression data in the existing local save model.

**Tech Stack:** Unity `6000.4.6f1`, C# uGUI/TextMeshPro, Node test runner scaffold checks.

---

### Task 1: Regression Tests

**Files:**
- Modify: `tests/unity-client-scaffold.test.js`

- [ ] Add assertions for session controls: pause button, reset save button, reset confirmation path, and save clearing via `PlayerPrefs.DeleteKey`.
- [ ] Add assertions for tab navigation state: `ActiveScreen`, `SetActiveScreen`, `CreateScreenRoot`, active nav buttons, and `BOARD`/`DIST`/`BOOK` click handlers.
- [ ] Add assertions for the DIST screen: district cards, current/locked styling, milestone progress bars.
- [ ] Add assertions for the BOOK screen: chain cards, discovered level state, item-level display helpers.
- [ ] Run `node --test tests\unity-client-scaffold.test.js` and confirm the new assertions fail before implementation.

### Task 2: Unity Screen State

**Files:**
- Modify: `unity/MergeClient/Assets/MergePlatform/Runtime/MergeClientController.cs`

- [ ] Add `ActiveScreen` state and root containers for board, districts, and collection.
- [ ] Parent board, producer, orders, and drag UI into the board screen root.
- [ ] Update bottom nav buttons to switch screens and visually mark the active tab.
- [ ] Keep SHOP disabled as a visible future tab with a status message only.

### Task 3: Session Controls

**Files:**
- Modify: `unity/MergeClient/Assets/MergePlatform/Runtime/MergeClientController.cs`

- [ ] Add compact `PAUSE` and `RESET` controls to the HUD/session area.
- [ ] Pause toggles `Time.timeScale` and changes status text.
- [ ] Reset clears the local save key and rebuilds the scene for fast prototype testing.

### Task 4: DIST Screen

**Files:**
- Modify: `unity/MergeClient/Assets/MergePlatform/Runtime/MergeClientController.cs`

- [ ] Render world map nodes from `theme.worldMap.nodes`.
- [ ] Show unlocked/current/locked district states based on `completedOrderIds.Count`.
- [ ] Add progress bars and milestone copy for the next district.

### Task 5: BOOK Screen and Item Identity

**Files:**
- Modify: `unity/MergeClient/Assets/MergePlatform/Runtime/MergeClientController.cs`

- [ ] Render one collection card per item chain.
- [ ] Track discovered item IDs from board contents and merge/product creation.
- [ ] Save and load discovered item IDs.
- [ ] Add clearer level display helpers so visible chain levels read as distinct items rather than repeated labels.

### Task 6: Verification and Sync

**Files:**
- Modify: `docs/UNITY_CLIENT_SETUP.md`
- Keep: `docs/mockups/unity-first-playable-loop.html`

- [ ] Run `node --test tests\unity-client-scaffold.test.js`.
- [ ] Run `npm run verify`.
- [ ] Run `npm run unity:sync-source`.
- [ ] Stage changed source, tests, docs, and mockup.
- [ ] Commit the completed pass.
