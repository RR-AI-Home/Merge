# Engagement Time Expansion Phase Plan

> **Status:** Active sprint as of 2026-05-04. Phase 1 starts with mobile Challenge/Tower Managed Sim plus a skippable Match Reel.
>
> **Priority:** Raise quick-sim daily engagement from sub-minute completion toward a healthy mobile manager-session target without turning the game into a forced wait loop.
>
> **Depends on:**
> - [./RETENTION_REDESIGN_PLAN.md](./RETENTION_REDESIGN_PLAN.md)
> - [./RETENTION_REDESIGN_IMPLEMENTATION_PLAN.md](./RETENTION_REDESIGN_IMPLEMENTATION_PLAN.md)
> - [../PROJECT_STATE.md](../PROJECT_STATE.md)

---

## 1. Problem

The current live-match pacing can provide meaningful time when players choose full play, but the quick-sim path compresses the core daily loop too hard.

Current read:
- full live match: about `3.6` minutes from `20` overs per innings at a `900ms` ball interval
- immediate live capacity: `3` Challenge charges plus `3` Tower attempts, about `21.6` minutes if every match is played live
- quick-sim capacity: same match allowances, but each result is near-instant
- realistic all-quick daily core loop: roughly `1-5` minutes, depending on swap decisions and result review

That is too thin for a manager game. The fix should not be arbitrary delays. The fix should be short, meaningful decisions, a better result presentation layer, and connected follow-up systems.

---

## 2. Engagement Targets

### Normal Daily Session
- target: `8-12` minutes
- shape: collect, choose, sim/manage, review, set next action

### Engaged Daily Session
- target: `15-25` minutes
- shape: multiple managed sims, swaps/scouting/training decisions, optional Tower push

### Depth Session
- target: `30+` minutes only by choice
- shape: live matches, deeper squad management, optional long-form planning

### Rushed Player Path
- target: `2-4` minutes
- keep available through pure quick sim and fast collect flows

Design rule: increase value-per-minute, not friction-per-minute.

---

## 3. Product Principles

1. **Keep Quick Sim**
   Players need a low-friction path. Do not remove it.

2. **Make Managed Sim The Recommended Path**
   The default featured action should become `Managed Sim`, with `Quick Sim` as the fallback.

3. **Use Decisions, Not Waiting**
   Any added time should ask for judgment, reveal a consequence, or tee up the next action.

4. **Connect Every Result**
   A match result should point to a next step: swap, scout, train, recover, rematch, or objective progress.

5. **Reward Time With Clarity**
   Managed Sim should offer richer recap, better context, objective progress, and clearer player consequence detail than Quick Sim.

---

## 4. Mode Model

### Quick Sim

Purpose:
- rushed path
- low attention
- preserve existing daily allowance behavior

Target time:
- `5-15s` per match

Reward shape:
- normal result
- compact scorecard
- fewer highlight details
- no extra power reward

### Managed Sim

Purpose:
- default daily engagement path
- short interactive manager loop
- bridge between instant result and full live play

Target time:
- `45-90s` per match

Reward shape:
- full result
- match reel
- tactical readout
- player form/morale/fatigue notes
- objective progress
- richer swap/scouting/training follow-up

### Play Full

Purpose:
- optional depth
- full live-match experience

Target time:
- `3.6` minutes minimum by current engine timing, with real user time higher if paused/reviewed

Reward shape:
- full live presentation
- strongest narrative result context
- no pay-to-win difference over Managed Sim

---

## 5. Phase Plan

## Phase 1 - Managed Sim Match Reel

Goal: make the recommended quick-result path feel like a compact match, not a loading spinner.

Scope:
- add a `Managed Sim` action beside or above `Quick Sim`
- create a `Match Reel` result sequence with `5-8` beats:
  - toss / setup
  - powerplay state
  - midpoint pressure
  - key wicket or stand
  - death-over swing
  - final result
  - manager takeaway
- allow tap-to-skip or speed-up
- reuse existing scorecard/result payloads where possible

Target time contribution:
- `3-6` minutes/day if players use Managed Sim for `4-6` matches

Acceptance criteria:
- Challenge and Tower both support Managed Sim entry points on mobile first
- Quick Sim remains available and faster
- result modal can display a richer recap without blocking fast users
- analytics can distinguish `quick_sim`, `managed_sim`, and `play_full`

Out of scope:
- new match engine rules
- paid boosts
- new cricket formats

---

## Phase 2 - Pre-Match Manager Choices

Goal: add meaningful, low-cost judgment before a sim.

Scope:
- add `1-2` pre-match choices before Managed Sim:
  - batting intent: `Safe`, `Balanced`, `Attack`
  - bowling plan: `Contain`, `Normal`, `Wicket Hunt`
  - key focus: `Back opener`, `Protect strike bowler`, `Target rival star`
- feed choices into existing tactics/plan inputs where practical
- show a post-match line explaining whether the choice helped, hurt, or was neutral

Target time contribution:
- `30-60s` per important match

Acceptance criteria:
- choices are visible, understandable, and optional
- choices have modest, stat-first impact or at least clear result framing
- UI avoids feeling like a full tactics screen before every match

Guardrails:
- no perfect recommendation engine
- no hidden pay-to-win modifier
- choices should never erase squad quality or rating differences

---

## Phase 3 - Post-Match Consequences

Goal: make results create next decisions.

Scope:
- after Managed Sim, surface a compact staff report:
  - form movement
  - morale movement
  - fatigue or recovery need
  - standout player
  - one recommended next action
- add simple follow-up hooks:
  - train a low-form player
  - rest a tired player
  - scout a rival
  - prepare a rematch
  - review swap options

Target time contribution:
- `2-4` minutes/day

Acceptance criteria:
- every Managed Sim has a clear next action
- the next action uses an existing system where possible
- copy stays manager-facing and avoids mechanical reward language

---

## Phase 4 - Richer Challenge Win Flow

Goal: make Challenge wins become the sticky daily decision moment.

Scope:
- improve swap presentation after a win:
  - show `3` clear swap choices or compare candidates more strongly
  - include scouting confidence and chemistry/form warning copy
  - add a concise rival/result reaction
  - offer a clean skip path
- tie swap decisions to daily objective progress and future rivalry hooks

Target time contribution:
- `1-3` minutes per Challenge win

Acceptance criteria:
- Challenge win flow feels valuable without forcing a long modal chain
- skip remains safe
- swap choice quality is understandable at a glance

---

## Phase 5 - Daily Objective Spine

Goal: turn the day into a short checklist of meaningful cross-system actions.

Scope:
- add or refine `3` daily objectives that encourage varied play:
  - complete `1` Managed Sim
  - win or attempt `1` Challenge
  - scout `1` upcoming opponent
  - train or recover `1` player
  - climb or attempt `1` Tower level
- surface objectives on Home/Compete without overcrowding
- connect objective completion into Club Identity or reward-track progress where fair

Target time contribution:
- `3-6` minutes/day

Acceptance criteria:
- objectives guide players toward the intended `8-12` minute normal session
- objectives do not require all systems every day
- objectives do not pressure users into monetized actions

---

## Phase 6 - Measurement And Tuning

Goal: prove whether the time expansion works.

Scope:
- add analytics events:
  - `managed_sim_started`
  - `managed_sim_completed`
  - `match_reel_skipped`
  - `pre_match_choice_selected`
  - `post_match_next_action_clicked`
  - `daily_objective_completed`
- track time-to-result and time-after-result
- compare Quick Sim, Managed Sim, and Play Full selection rates
- review day-1, day-3, and day-7 behavior once real data exists

Target outcome:
- normal users naturally land near `8-12` minutes/day
- engaged users land near `15-25` minutes/day
- rushed users can still complete essentials in `2-4` minutes

---

## 6. Recommended Build Order

1. Mobile Challenge Managed Sim + Match Reel
2. Mobile Tower Managed Sim + Match Reel
3. Shared result-recap model so web can follow
4. Pre-match choices for Managed Sim
5. Post-match staff report hooks
6. Challenge win/swap flow enrichment
7. Daily objective spine refinement
8. Analytics review and tuning

---

## 7. First Sprint Cut

If this plan becomes the active sprint, the first sprint should be:

**Sprint Goal:** Make Managed Sim the recommended mobile daily match path and raise all-quick daily engagement from near-instant completion to a meaningful `8-12` minute normal session path.

In scope:
- mobile Challenge `Managed Sim` action
- mobile Tower `Managed Sim` action
- `5-8` beat Match Reel component
- result modal integration
- analytics for mode choice and reel skipping
- keep current Quick Sim intact

Not in scope:
- complete objective redesign
- full web parity
- monetization changes
- new database-heavy consequence model unless already needed for result data

Exit criteria:
- a player can run `3` Challenge and `3` Tower attempts through Managed Sim
- the flow feels skippable but not empty
- a rushed player can still quick sim
- the product can measure which path players choose

---

## 8. Activation Rule

This plan became the current sprint on 2026-05-04 after Live Match Broadcast Highlights reached mobile_cricket_rivals/web parity, confirmed active bugs were cleared, and launch prep was confirmed as repo-complete except external publishing/store-console work.

Activate it only when:
- Live Match Broadcast Highlights is complete, deferred, or explicitly paused
- confirmed active bug cleanup is not blocking product work
- `PROJECT_STATE.md` and `SESSION_START.md` are updated together
