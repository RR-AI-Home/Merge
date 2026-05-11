# Unity Client Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a first Unity proof that loads an exported merge theme and renders a simple board from shared platform data.

**Architecture:** The repo owns theme data and a tested exporter. The Unity project lives outside OneDrive under `E:\Projects\Merge\Unity\MergeClient` and uses generated resources plus programmatic C# scene setup.

**Tech Stack:** Node.js test runner, ESM scripts, Unity `6000.4.6f1`, C# runtime/editor scripts.

---

### Task 1: Theme Export Contract

**Files:**
- Create: `tests/unity-theme-export.test.js`
- Create: `scripts/export-unity-theme.mjs`

- [ ] Write a failing test that exports `cyber-syndicate` to a temp file, asserts a Unity payload shape, and asserts existing outputs are not overwritten.
- [ ] Run `node --test tests/unity-theme-export.test.js` and confirm it fails because the script does not exist.
- [ ] Implement the exporter with a reusable `exportUnityTheme()` function and CLI arguments.
- [ ] Run `node --test tests/unity-theme-export.test.js` and confirm it passes.

### Task 2: Unity Project Scaffold

**Files:**
- Create outside repo: `E:\Projects\Merge\Unity\MergeClient\Assets\MergePlatform\Editor\MergeClientProjectBuilder.cs`
- Create outside repo: `E:\Projects\Merge\Unity\MergeClient\Assets\MergePlatform\Runtime\MergeClientController.cs`
- Create outside repo: `E:\Projects\Merge\Unity\MergeClient\Assets\MergePlatform\Runtime\UnityMergeTheme.cs`
- Create outside repo: `E:\Projects\Merge\Unity\MergeClient\Assets\MergePlatform\Resources\Themes\cyber-syndicate.json`

- [ ] Create the Unity project with Unity `6000.4.6f1` in batch mode or scaffold the files if the project already exists.
- [ ] Export the `cyber-syndicate` theme into the Unity Resources folder.
- [ ] Add C# payload classes matching the exported JSON.
- [ ] Add a runtime controller that draws a simple 6x6 themed board.
- [ ] Add an editor builder that configures the scene and Android player settings.

### Task 3: Documentation And Verification

**Files:**
- Create: `docs/UNITY_CLIENT_SETUP.md`
- Modify: `package.json`

- [ ] Add a `unity:export-theme` script for the default `cyber-syndicate` export.
- [ ] Document project location, Unity executable path, export command, and Android SDK notes.
- [ ] Run `npm run verify`.
