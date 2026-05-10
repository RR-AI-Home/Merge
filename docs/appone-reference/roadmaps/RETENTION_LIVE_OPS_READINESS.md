# Retention Live-Ops Readiness

Status: Ready for post-release planning

> Companion to [RETENTION_PROGRESSION_SPRINT.md](../sprints/completed/RETENTION_PROGRESSION_SPRINT.md).
> Purpose: document which retention hooks, reward beats, and analytics surfaces are already strong enough to support lightweight live-ops later without a large refactor.

---

## Ready Hooks

- Daily check-in already supports a base daily reward plus an optional sponsor follow-up.
- Challenge already supports charge-based return timing, featured-rival framing, scouting follow-through, and a challenge sponsor bonus after eligible wins.
- Tower already supports daily attempts, monthly reset framing, climb milestones, and an optional sponsor payout.
- Training and scouting already create delayed-return moments through ready reports, in-progress work, and Home/Challenge return cues.
- Home already aggregates these systems into `Club Rhythm`, `Ready Now`, `Later Today`, and next-action guidance.

## Ready Reward Beats

These cosmetic and progression beats are already good candidates for rotation, spotlighting, or seasonal framing:

- Weekly Check-In reward (`motto_seven_day_standard`)
- First Win reward (`border_first_roar`)
- 3 Wins reward (`title_match_analyst`)
- 5 Wins reward (`theme_result_tower_ascent`)
- 10 Wins reward (`frame_century_circle`)
- 3 Scouting Reports reward (`theme_report_league_pulse`)
- 7 Scouting Reports reward (`title_intel_director`)
- 5 Tower Matches reward (`motto_never_blink`)
- 3 Challenge Wins reward (`banner_rival_ladder`)
- 10 Training Sessions reward (`border_drill_circuit`)
- Top 10 League reward (`theme_result_promotion_chase`)

## Candidate Weekly/Event Wrappers

These are the lowest-risk event shapes because they lean on systems already in source:

1. Rival Response Week
- Spotlight revenge and bounce-back challenge messaging on Home and Challenge.
- Highlight challenge sponsor bonus and challenge-win cosmetic tracks.

2. Training Camp Week
- Spotlight training-volume rewards and the delayed-report loop.
- Pair with Home messaging that pushes “start now, come back later.”

3. Scout Surge Week
- Spotlight scouting report rewards and featured-rival prep.
- Pair with Challenge intel language and strategy-entry CTAs.

4. Tower Summit Week
- Spotlight Tower climb milestones, monthly reset urgency, and sponsor top-ups.
- Pair with Club Identity messaging that points to Tower cosmetic unlocks.

5. Club Look Week
- Spotlight owned-vs-locked-vs-shop clarity in Club Identity.
- Feature one unlock track and one shop shelf together without mixing equip flow into shop flow.

## Analytics And Tuning Hooks Already In Place

- Daily check-in analytics already track card views, reward claims, and sponsor-offer interactions.
- Tower analytics already track match-mode usage, reel skips, and sponsor-claim attempts/results.
- Challenge analytics already track match-mode usage and can absorb event-week metadata later.
- Retention summary data already feeds ready work, later-today windows, challenge-charge state, and next recommended action.
- Club Identity reward-progress fields already expose wins, scouting reports, Tower matches, challenge wins, training sessions, league position, and weekly check-in cycle progress.

## Recommended Next Additions Later

- Add explicit event impression / event claim analytics when live-ops actually launches.
- Add a lightweight server-side event config so Home, Challenge, Tower, and Club Identity can surface one promoted beat at a time.
- Add push-notification hooks only after production Expo credentials and player opt-out settings are ready.

## Current Read

The game does not need a heavy live-ops framework yet. It already has enough:

- return timers,
- reward tracks,
- cosmetic beats,
- sponsorship extras,
- progression cues,
- and analytics anchors

to support lightweight weekly spotlights once release traffic starts teaching us what players actually care about.

---

**Last Updated:** 2026-05-05
