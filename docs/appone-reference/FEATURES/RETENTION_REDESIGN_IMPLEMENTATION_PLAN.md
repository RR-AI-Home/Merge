# Retention Redesign Implementation Plan

> **Status:** Active implementation brief
>
> **Priority:** Retention-first product shaping before Launch Prep execution and before monetization placements expand further.
>
> **Depends on:**
> - [./RETENTION_REDESIGN_PLAN.md](./RETENTION_REDESIGN_PLAN.md)
> - [../roadmaps/MONETIZATION_ROADMAP.md](../roadmaps/MONETIZATION_ROADMAP.md)
> - [./DAILY_LOGIN_SYSTEM_SPEC.md](./DAILY_LOGIN_SYSTEM_SPEC.md)

---

## 1. Goal

Turn the retention redesign from a concept into a concrete build order that can move the game toward:
- `20-40` minutes of total daily play for an engaged player
- `2-4` sessions per day
- retention-first loop design that later supports rewarded ads naturally

This plan is meant to shape the next real product slice, not just future ideas.

---

## 2. Product Target

### Daily Engagement Target
- opener session: `1-3` minutes
- one or two return sessions: `4-8` minutes each
- one optional depth session: `8-20` minutes
- total target: `20-40` minutes/day

### Daily Phase Framing
The game should loosely support `3` daily phases:

1. **Open / first login**
   - collect what is ready
   - claim daily value
   - get immediate direction
2. **Core play session**
   - spend Challenge attention
   - make one meaningful squad or scouting decision
   - optionally extend into Tower or live play
3. **Return / re-engagement session**
   - collect completed jobs
   - react to new opportunities
   - line up the next payoff

This is framing, not a hard schedule. The point is to make same-day return feel natural.

### Session Mix Target
1. **Opener**
   - collect completed jobs
   - claim daily reward
   - use one clear immediate action
2. **Midday return**
   - spend one Challenge charge
   - collect one finished training/scouting result
3. **Later return**
   - reassign jobs
   - make one lineup/tactics decision
   - progress one daily objective
4. **Optional depth**
   - Tower push
   - live match
   - cleanup of objectives or squad decisions

### Core Product Rule
At every login, the game should answer:
- what is ready now?
- what finishes later today?
- what is the smartest next action?

### Loop Rule
Every meaningful action should open the next action.

Preferred loop shape:
- play
- receive payoff
- see new opportunity
- make next decision

Avoid:
- play
- clean resolution
- no urgency
- leave app

---

## 3. Current Design Gaps

The current loop has enough systems, but not enough scheduled payoff.

Main gaps:
- Training is too instant and too batchable
- Scouting is too instant and not reveal-driven enough
- Challenge has charges, but weak comeback framing after a match
- Dashboard does not orchestrate the day strongly enough
- Objectives are not yet giving short-term structure across systems

This means the game can produce time spent, but does not yet produce a strong repeatable return rhythm.

### What Has Already Landed
- shared async job model
- Training Jobs
- Scouting Jobs
- dashboard `Ready Now / Later Today / Best Next Action`
- daily objectives v1
- first-pass Challenge comeback framing
- Tower pacing pass with `3` daily attempts, `+3` legal reach, opponent-home conditions, and passive rival intel

This implementation brief now serves two purposes:
- preserve the target daily rhythm and product rules
- clarify the next retention follow-ups after the first live slice

---

## 4. First Implementation Slice

Lock the first retention implementation slice to:

1. **Async Training Jobs**
2. **Async Scouting Jobs**
3. **Dashboard return orchestration**
4. **Challenge comeback framing**
5. **Daily objectives v1**

Explicitly not in this first slice:
- sponsor ads
- rewarded ads
- premium checkout
- long-form narrative systems
- new match modes

Those should layer on top of a healthier base loop, not replace it.

---

## 5. Time Budget by System

### Training Jobs
- start action: `30-60s`
- claim action: `20-45s`
- reassign decision: `30-90s`
- target contribution: `2-4` minutes/day

### Scouting Jobs
- request action: `20-40s`
- collect report: `30-60s`
- apply report to tactics: `1-2` minutes
- target contribution: `2-5` minutes/day

### Challenge
- quick result match: `2-4` minutes including review
- live challenge: `6-12` minutes optional
- target contribution: `5-12` minutes/day

#### Important
Do not assume the core Challenge session itself should always be `20-40` minutes long.
That daily total should come from multiple moments across the day plus optional depth, not from forcing one long grind block.

### Objectives / Dashboard Returns
- collect + review + decide next action: `1-3` minutes/session
- target contribution: `3-8` minutes/day

### Tower Depth
- optional depth only
- target contribution: `5-12` minutes/day for players who opt into it
- paced by `3` daily attempts so it adds meaningful depth without becoming an infinite one-sit grind
- should feel like a strategic climb, not a background chore

---

## 6. System Design

### A. Training Jobs V1

#### Player Loop
1. choose player
2. choose drill/focus
3. start training job
4. come back later to collect result
5. decide whether to rest, retrain, or switch focus

#### Job Types
- short drill: `90m`
- standard drill: `3h`
- long block: `6h`

#### Result Payload
- stat gain
- fatigue cost
- small injury risk outcome
- morale reaction if relevant
- recommended next action

#### Design Rule
One instant training interaction may remain for tutorial clarity, but meaningful gains should move into job completion.

### B. Scouting Jobs V1

#### Player Loop
1. choose opponent / competition context
2. choose scout focus
3. wait for report
4. collect report
5. optionally deepen scouting on same target later

#### Focus Types
- general profile
- pitch/tactics lean
- lineup/phase risk

#### Timing Bands
- fast scout note: `2h`
- full scout report: `6h`
- deep follow-up: next same-day window or next reset, depending on balance

#### Result Rule
Scouting should reveal actionable but fair information. No hidden power numbers or guaranteed counter recommendations.

### C. Dashboard Orchestration V1

#### Priority Order
1. claimable finished job
2. available Challenge charge
3. objective close to completion
4. next job finishing soon
5. Tower depth suggestion

#### Dashboard Sections
- `Ready Now`
- `Later Today`
- `Best Next Action`
- `Today’s Progress`

#### Requirement
This must exist on both mobile and web with the same information hierarchy.

### D. Challenge Comeback Framing V1

Add:
- `next charge at`
- revenge marker after recent loss
- `best climb available`
- `featured rival` or `best target now`
- `near miss` pressure such as `1 win from Top 3`
- `bounce back` messaging after losses
- `come back later for another charge`
- post-result prompt that points to scouting, training, or next challenge

Challenge should become the main same-day return spine, not just a one-off button.

#### Post-Match Chain Requirement
After every Challenge result, the player should see one or more of:
- next suggested action
- revenge opportunity
- climb or milestone pressure
- job/objective tie-in

Examples:
- `Win again to reach Top 3`
- `Scout your next rival while this win is fresh`
- `Bounce back against the team above you for a morale swing`

### E. Daily Objectives V1

#### Scope
Start small with `3` daily objectives.

Examples:
- complete `1` Challenge
- collect `1` training job
- collect `1` scouting report
- win `1` Tower match

#### Rewards
- Legacy Tokens
- cosmetics/progression presentation rewards
- no gameplay power

### F. Tower Depth V1.5

Tower should now be treated as the optional depth branch that extends a day naturally after Challenge, not as a spam-anytime fallback.

#### Live Shape
- `3` daily attempts
- legal rival range capped to `+3`
- opponent-home pitch identity
- passive intel for pitch, tactical lean, and squad lean
- difficulty bands tuned around milestone anchors (`1`, `25`, `50`, `75`, `100`)

#### Product Rule
Tower should answer:
- `Is this climb worth one of my attempts?`
- `What kind of conditions am I walking into?`
- `Do I want to spend depth time here or return later to Challenge/jobs?`

#### Next Validation Need
Run live QA at levels `1`, `25`, `50`, `75`, and `100` to confirm:
- emotional difficulty feels right
- passive intel helps real decisions
- live play and quick-result feel aligned enough

---

## 7. Backend Implementation Plan

### A. Async Job Model

Add a shared job model instead of one-off tables for each system if possible.

Recommended shape:
- `id`
- `userId`
- `teamId`
- `jobType` (`TRAINING`, `SCOUTING`)
- `subjectId` (player or opponent target)
- `status` (`QUEUED`, `READY`, `CLAIMED`, `EXPIRED`, `CANCELLED`)
- `startedAt`
- `readyAt`
- `claimedAt`
- `payload`
- `resultPayload`

### B. Training-Specific Data
- player id
- drill/focus type
- duration band
- fatigue risk parameters
- reward/result values

### C. Scouting-Specific Data
- target team id
- mode context (`CHALLENGE`, `CUP`)
- scout focus
- reveal tier
- report payload

### D. API Families

#### Training Jobs
- `GET /training/jobs`
- `POST /training/jobs/start`
- `POST /training/jobs/:id/claim`

#### Scouting Jobs
- `GET /scouting/jobs`
- `POST /scouting/jobs/start`
- `POST /scouting/jobs/:id/claim`

#### Retention Summary
- `GET /retention/summary`
  - ready now
  - next finishes
  - charge state
  - objective progress
  - recommended action

#### Tower Summary Requirements
Retention and home-summary responses should continue to surface:
- Tower attempts remaining
- whether a legal Tower rival is immediately available
- whether Tower is being recommended as optional depth rather than mandatory daily pressure

### E. Objective Model

V1 can be generated daily rather than fully authored by CMS tools.

Need:
- objective type
- current progress
- target
- claimed state
- reward payload

---

## 8. Frontend / Mobile Implementation Plan

### A. Dashboard / Home

Add:
- `Ready Now` rail
- `Later Today` rail
- `Best Next Action` card
- `Today’s Progress` card

Do this on:
- web dashboard
- mobile dashboard/home

### B. Training Screen

Change from mostly instant-use management to:
- `Start Job`
- `In Progress`
- `Ready to Claim`
- `Assign Again`

### C. Scouting Screen

Change from mostly instant action to:
- request report
- pending report state
- claim report
- chain into tactics review

### D. Challenge Surface

Add:
- rank context
- next charge timing
- revenge marker
- best-climb suggestion
- near-miss pressure (`1 win from ...`)
- bounce-back messaging after losses
- clearer post-result next step

### E. Objectives Surface

V1 does not need its own screen first.
It can live as:
- dashboard card
- compact module inside compete/home

### F. Tower Surface

Must show clearly on web and mobile:
- attempts left today
- legal challenge window
- opponent home pitch identity
- passive rival intel
- a clear exhausted state when attempts hit `0`

Tower should feel legible and strategic before match start, not like a blind click ladder.

---

## 9. Analytics Plan

Track from day one:

### Core Events
- `training_job_started`
- `training_job_ready`
- `training_job_claimed`
- `scouting_job_started`
- `scouting_job_ready`
- `scouting_job_claimed`
- `objective_completed`
- `dashboard_ready_now_opened`
- `challenge_charge_spent`
- `challenge_return_prompt_seen`
- `tower_attempt_spent`
- `tower_attempts_exhausted`
- `tower_intel_viewed`
- `tower_level_cleared`

### Daily Rhythm Metrics
- time to second session same day
- jobs started per DAU
- jobs claimed per DAU
- claim latency
- challenge charges spent per DAU
- objective completion rate
- Tower attempts spent per DAU
- Tower attempts exhausted per DAU
- win rate at anchor levels `1`, `25`, `50`, `75`, `100`

---

## 10. Rollout Order

### Phase 1
- shared async job model
- training jobs backend
- dashboard `Ready Now` / `Later Today` scaffolding

### Phase 2
- training jobs UI on web/mobile
- claim loop + basic analytics

### Phase 3
- scouting jobs backend + UI
- tactics/report handoff

### Phase 4
- challenge comeback framing
- daily objectives v1

### Phase 5
- review timing, job counts, and daily pacing
- tune toward `20-40 min / 2-4 sessions`

### Phase 6
- plan `swap chase / collection` follow-up
- strengthen cosmetic visibility in match-intro / versus presentation

### Phase 7
- live Tower QA at levels `1`, `25`, `50`, `75`, and `100`
- adjust milestone pressure, rival clarity, and recommended-depth positioning based on feel

These are not first-slice retention blockers, but they are strong follow-ups once the base rhythm is healthier.

---

## 11. Acceptance Criteria

This slice is successful when:
- Training no longer resolves only as an instant progression tap
- Scouting creates a meaningful return moment before the report is consumed
- Dashboard clearly shows `ready now`, `later today`, and `best next action`
- Challenge tells players when and why to come back
- Daily objectives give lightweight structure without adding power creep
- Both web and mobile stay in sync on system state and information hierarchy
- Tower adds meaningful optional depth without becoming a five-minute clear or an infinite spam loop

---

## 12. Immediate Next Tasks

1. Fix the first structured frontend QA findings from web `:8081` so the new retention layer stops surfacing broken dashboard/challenge guidance
2. Run the paired backend QA pass on the same retention/dashboard flows before promoting any suspicious objective/state drift into `BUGS.md`
3. Tighten daily/weekly objectives further based on real queue/Tower pacing and live usage
4. Decide whether Tower needs one final endgame calibration tweak after the live anchor-level QA pass
5. Prepare the next retention follow-up slice after live tuning:
   - swap chase / collection follow-up
   - cosmetic visibility pass
   - daily login sponsor reward prep


---

## 13. Recommendation

Do not jump to ads or premium loop pressure yet.

The next highest-value retention move is:
- tune the already-landed async systems from live use
- sharpen comeback and recommendation language
- validate that Tower now behaves like healthy optional depth

That is the cleanest path to the desired session rhythm and gives monetization a healthier surface later.

---

## 14. Strong Follow-Ups After V1

### A. Swap Chase / Collection Layer

This is a strong medium-priority follow-up because the current Challenge swap loop is already one of the game’s best retention hooks.

Potential direction:
- show notable league players
- surface players the user has faced but does not own
- mark rivals as desirable targets
- make the player think `I want that player, so I should keep climbing`

This should come after the base return-rhythm systems are in, not before.

### B. Cosmetic Visibility Pass

Club Identity monetization will work better if cosmetics appear in more emotionally visible places.

Best follow-up surfaces:
- match intro / versus screen
- club presentation callouts before key matches
- richer result/report theming visibility

This should stay secondary to the retention foundation, but it is worth planning early because it improves both attachment and later monetization fit.
