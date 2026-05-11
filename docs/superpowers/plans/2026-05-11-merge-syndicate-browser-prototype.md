# Merge Syndicate Browser Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local browser-playable Merge Syndicate prototype that runs on the shared merge engine and Cyber Syndicate theme data.

**Architecture:** Keep the playable behavior in a testable app controller under `apps/merge-syndicate/src/`, then render it through a dependency-light static web shell under `apps/merge-syndicate/web/`. The browser app loads the selected standalone game identity and theme bundle directly; it does not support runtime theme switching.

**Tech Stack:** Node ESM, `node:test`, existing shared packages, static HTML/CSS/JavaScript served locally.

---

### Task 1: App Session Controller

**Files:**
- Create: `apps/merge-syndicate/src/themeLoader.js`
- Create: `apps/merge-syndicate/src/gameSession.js`
- Test: `tests/merge-syndicate-session.test.js`

- [ ] Write failing tests for new save creation, producer taps, merge/order completion, and daily reward claiming.
- [ ] Run the targeted test and confirm it fails because `gameSession.js` does not exist.
- [ ] Implement the minimal controller using `merge-engine`, `economy-engine`, and `retention-engine`.
- [ ] Re-run targeted tests and confirm they pass.

### Task 2: Static Browser App

**Files:**
- Create: `apps/merge-syndicate/web/index.html`
- Create: `apps/merge-syndicate/web/styles.css`
- Create: `apps/merge-syndicate/web/app.js`
- Modify: `apps/merge-syndicate/src/gameSession.js`
- Test: `tests/merge-syndicate-web.test.js`

- [ ] Write failing tests proving required web assets exist and reference the app shell module.
- [ ] Implement a mobile-first UI with board cells, producer action, order panel, economy HUD, district progress, and log feedback.
- [ ] Re-run targeted tests and confirm they pass.

### Task 3: Verification

**Files:**
- Modify as needed based on test failures only.

- [ ] Run `npm run verify`.
- [ ] Serve `apps/merge-syndicate/web/` locally and inspect the prototype in the in-app browser.
- [ ] Commit the tested prototype.
