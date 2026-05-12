# Known Bugs

> Canonical rule: this file lists confirmed active defects only. Fixed-and-verified items belong in [CHANGELOG.md](./CHANGELOG.md), [COMPLETED_WORK.md](./COMPLETED_WORK.md), or [QA_RUNS.md](./QA_RUNS.md).
>
> Current sprint summary lives in [PROJECT_STATE.md](./PROJECT_STATE.md). Session handoff starts in [SESSION_START.md](./SESSION_START.md).

---

## Active Bugs

None confirmed active.

## Watch Items

These are risks or polish concerns, not confirmed active bugs:

- Unity visual parity with the browser mockup still needs user review after each layout pass.
- Android APK build and physical device behavior are not yet verified.
- Shop is a placeholder and should not be treated as a production monetization flow.
- Backend/cloud-save assumptions are intentionally deferred until local first playable quality is stronger.

## Recently Verified

- 2026-05-12: Unity Board layout pass verified through `npm run verify` and synced to `E:\Projects\Merge\Unity\MergeClient`.
- 2026-05-12: Unity TextMeshPro setup no longer uses legacy `Text`, avoids obsolete wrapping APIs, and keeps the imported Cascadia TMP asset under Resources.
- 2026-05-12: Engine/theme/browser proof verification passed for Merge Syndicate and Kingdom Lite through `npm run verify`.

Resolved bug history belongs in [COMPLETED_WORK.md](./COMPLETED_WORK.md), [CHANGELOG.md](./CHANGELOG.md), and [QA_RUNS.md](./QA_RUNS.md). Do not add fixed items here unless they reappear as confirmed active defects.

---

**Last Updated:** 2026-05-12
