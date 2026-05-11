# Platform Factory Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the platform can produce two separate playable browser apps from the same merge app/session/browser shell.

**Architecture:** Extract reusable game-session behavior into `packages/merge-app-session`, extract reusable static browser behavior into `packages/merge-browser-shell`, then make `apps/merge-syndicate` and `apps/merge-kingdom-lite` thin standalone wrappers. Each app keeps its own identity, theme root, save namespace, and URL; there is no runtime theme selector.

**Tech Stack:** Node ESM, `node:test`, existing shared engines, static HTML/CSS/JavaScript.

---

### Task 1: Shared App Session Factory

**Files:**
- Create: `packages/merge-app-session/src/index.js`
- Modify: `apps/merge-syndicate/src/gameSession.js`
- Create: `apps/merge-kingdom-lite/src/themeLoader.js`
- Create: `apps/merge-kingdom-lite/src/gameSession.js`
- Test: `tests/platform-factory.test.js`

- [ ] Write failing tests proving Syndicate and Kingdom Lite create separate saves from the same session factory.
- [ ] Implement the shared session factory.
- [ ] Wrap it in each app-specific session module.

### Task 2: Shared Browser Shell

**Files:**
- Create: `packages/merge-browser-shell/src/index.js`
- Modify: `apps/merge-syndicate/web/app.js`
- Create: `apps/merge-kingdom-lite/web/index.html`
- Create: `apps/merge-kingdom-lite/web/styles.css`
- Create: `apps/merge-kingdom-lite/web/app.js`
- Test: `tests/platform-factory.test.js`

- [ ] Write failing tests proving both browser apps use the shared browser shell and keep separate save keys.
- [ ] Move reusable browser behavior into the shared shell.
- [ ] Add the Kingdom Lite standalone browser app entrypoint.

### Task 3: Verification

**Files:**
- Modify only based on verification failures.

- [ ] Run targeted platform factory tests.
- [ ] Run `npm run verify`.
- [ ] Open both standalone URLs in the browser and verify they boot with different themes and identities.
- [ ] Commit the platform factory proof.
