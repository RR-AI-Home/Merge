# TODO

> Current backlog only. Completed work belongs in [COMPLETED_WORK.md](./COMPLETED_WORK.md), [CHANGELOG.md](./CHANGELOG.md), or [QA_RUNS.md](./QA_RUNS.md).
>
> Active path: [PROJECT_STATE.md](./PROJECT_STATE.md)  
> Session handoff: [SESSION_START.md](./SESSION_START.md)  
> Active bugs: [BUGS.md](./BUGS.md)

---

## Active Sprint Backlog

- [ ] Execute [UNITY_FIRST_PLAYABLE_POLISH_SPRINT.md](./sprints/active/UNITY_FIRST_PLAYABLE_POLISH_SPRINT.md).
- [ ] Execute [PLATFORM_FACTORY_FOUNDATION_SPRINT.md](./sprints/active/PLATFORM_FACTORY_FOUNDATION_SPRINT.md).
- [ ] Make the Unity Board screen match [mockups/unity-first-playable-loop.html](./mockups/unity-first-playable-loop.html) as closely as possible, especially spacing, tile clarity, button shape, contract layout, and bottom navigation.
- [ ] Make item levels visually unique inside each chain, starting with cyber items such as `Chip -> Signal -> Processor`, `Wire -> Relay -> Harness`, `Drone Shell -> Scout Drone -> Interceptor Drone`, and `Street Cache -> Encrypted Cache -> Vault`.
- [ ] Improve Districts and Collection screens from proof state into first-playable production quality.
- [ ] Define the first useful non-monetized Shop placeholder so the nav does not feel dead while monetization is deferred.
- [ ] Decide when to start the first Android APK build path and write outputs under `E:\Projects\Merge\Builds\Android`.
- [ ] Add a first-pass theme creation checklist for turning a new theme package into a separate standalone Unity app.

## Platform Backlog

- [ ] Keep all shared engine changes behind `npm run verify`.
- [ ] Add cross-runtime parity checks if merge rules are ported into C# for offline Unity play.
- [ ] Decide the backend contract shape for cloud saves, accounts, liveops, offers, analytics, and remote config.
- [ ] Add a release/build checklist once APK output begins.
- [ ] Add docs for how completed themes are upgraded when shared engine contracts change.

## Post-First-Playable Follow-Up

- [ ] Final art pipeline for theme-specific item icons, producers, UI skins, audio, and FX.
- [ ] Mobile performance pass on physical Android hardware.
- [ ] Analytics event schema for producer taps, merges, contract completion, energy friction, and session restarts.
- [ ] Liveops/event framework once the first local loop is strong.
- [ ] Monetization design after the non-paid first playable loop is stable.

---

**Last Updated:** 2026-05-12
