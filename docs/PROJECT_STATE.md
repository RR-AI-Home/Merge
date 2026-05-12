# Project State

> Canonical active path. Completed implementation history belongs in [COMPLETED_WORK.md](./COMPLETED_WORK.md), [CHANGELOG.md](./CHANGELOG.md), and [QA_RUNS.md](./QA_RUNS.md).
>
> Active defects live in [BUGS.md](./BUGS.md). Current backlog lives in [TODO.md](./TODO.md).

---

## Current Phase

**Phase:** Unity first playable polish / platform factory foundation  
**Primary game proof:** Merge Syndicate  
**Platform goal:** produce separate themed merge apps from the same validated merge engine  
**Client direction:** Unity mobile client for shipped apps  
**Tooling direction:** Node/browser tooling for fast platform, theme, and first-loop validation  
**Future backend direction:** Java/backend services for cloud features after the local first playable is stable

## Release Readiness

This project is not at release-candidate stage. The current target is a credible first playable that proves:

- one shared merge engine can support separate themed games;
- theme data can drive content without becoming a runtime theme switcher;
- Unity can render the production mobile client shape;
- existing themes keep working when the shared engine changes;
- browser proofs remain useful as fast validation harnesses.

The Unity Merge Syndicate proof now has the basic board loop, producer crate, drag/move/merge, contracts, energy, local save, district progression, collection discovery, bottom navigation, imported TMP font path, and mobile portrait layout. Visual polish is still active, and the current sprint focus is making the Unity Board screen match the saved mockup at [mockups/unity-first-playable-loop.html](./mockups/unity-first-playable-loop.html).

## Done This Phase

- Established the platform concept: one reusable engine, separate generated apps, no runtime theme switching.
- Created browser proofs for Merge Syndicate and Kingdom Lite as independent standalone app outputs.
- Added verification gates for themes, app identity, engine loops, playable browser apps, and Unity scaffold expectations.
- Added Unity client architecture docs and setup docs.
- Created the Unity MergeClient proof using TextMeshPro, portrait Canvas/uGUI layout, theme export, local saves, board interactions, contracts, districts, and collection.
- Confirmed engine compatibility rule: shared engine changes must keep previous completed themes working.
- Moved Unity project/build work outside OneDrive under `E:\Projects`.
- Added Android SDK setup notes and Unity TMP/font setup notes.

## Active Work

- [ ] Execute [UNITY_FIRST_PLAYABLE_POLISH_SPRINT.md](./sprints/active/UNITY_FIRST_PLAYABLE_POLISH_SPRINT.md).
- [ ] Execute [PLATFORM_FACTORY_FOUNDATION_SPRINT.md](./sprints/active/PLATFORM_FACTORY_FOUNDATION_SPRINT.md).
- [ ] Match the Unity Board screen to the saved browser mockup for spacing, clarity, color, buttons, contracts, tile readability, and bottom navigation before expanding polish to other screens.
- [ ] Improve Unity item icon uniqueness so chains such as `Chip -> Signal -> Processor` read as distinct item levels.
- [ ] Add the next Unity screens needed for a first playable: usable District progression, Collection, and a non-monetized Shop placeholder.
- [ ] Keep `npm run verify` passing after every engine/theme/client contract change.
- [ ] Decide when the first Android APK build should start, then output builds under `E:\Projects\Merge\Builds\Android`.
- [ ] Keep this docs set current as active decisions change.

## Active Decisions

- Shipped products should be separate standalone games, not one app with runtime theme switching.
- Unity owns production mobile presentation, input, animation, audio, tactile feedback, mobile build output, app identity packaging, and final mobile typography/rendering.
- The platform owns theme contracts, merge rules, producer rules, order/reward/progression contracts, validation, standalone app generation, and compatibility gates.
- The backend is not needed for the current local first playable. When introduced, it should own durable economy/account/liveops state and must preserve the same platform contracts.
- Browser prototypes stay in the repo as fast validation harnesses, not as the final mobile client.
- Unity projects, APK/AAB builds, Gradle outputs, Library folders, caches, and large generated artifacts stay out of OneDrive.
- Text quality is a production requirement. Gameplay UI should use TextMeshPro, high-resolution SDF assets, stable CanvasScaler settings, and explicit readable text boxes.

## Key References

- Unity setup: [UNITY_CLIENT_SETUP.md](./UNITY_CLIENT_SETUP.md)
- Unity architecture: [UNITY_CLIENT_ARCHITECTURE.md](./UNITY_CLIENT_ARCHITECTURE.md)
- Engine compatibility: [ENGINE_COMPATIBILITY.md](./ENGINE_COMPATIBILITY.md)
- Saved Unity mockup: [mockups/unity-first-playable-loop.html](./mockups/unity-first-playable-loop.html)
- Active sprint: [UNITY_FIRST_PLAYABLE_POLISH_SPRINT.md](./sprints/active/UNITY_FIRST_PLAYABLE_POLISH_SPRINT.md)
- Platform sprint: [PLATFORM_FACTORY_FOUNDATION_SPRINT.md](./sprints/active/PLATFORM_FACTORY_FOUNDATION_SPRINT.md)
- Current backlog: [TODO.md](./TODO.md)
- Active bugs: [BUGS.md](./BUGS.md)
- QA evidence: [QA_RUNS.md](./QA_RUNS.md)
- Session handoff: [SESSION_START.md](./SESSION_START.md)

## Update Rules

- Move completed implementation detail out of `TODO.md`, `SESSION_START.md`, and this file into [COMPLETED_WORK.md](./COMPLETED_WORK.md), [CHANGELOG.md](./CHANGELOG.md), or [QA_RUNS.md](./QA_RUNS.md).
- Keep this file focused on current state, active work, and active decisions.
- Update [BUGS.md](./BUGS.md) only for confirmed active bugs.
- Update [TODO.md](./TODO.md) only for current backlog or deferred follow-up.

---

**Last Updated:** 2026-05-12
