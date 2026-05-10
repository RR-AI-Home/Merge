# Retention Redesign Plan

> **Status:** Active design brief to land before Launch Prep.
>
> **Priority:** Retention first, monetization second, Launch Prep after both are shaped well enough for live tuning.
>
> **Depends on:**
> - [../specs/LEAGUE_DESIGN.md](../specs/LEAGUE_DESIGN.md)
> - [../FEATURES/DAILY_LOGIN_SYSTEM_SPEC.md](./DAILY_LOGIN_SYSTEM_SPEC.md)
> - [../roadmaps/MONETIZATION_ROADMAP.md](../roadmaps/MONETIZATION_ROADMAP.md)

---

## 1. Goal

Increase return frequency and session consistency without turning the game into a harsh energy-gated loop.

This redesign should:
- raise daily return intent
- create more same-day revisit moments
- improve week-1 and week-4 retention
- give rewarded ads better natural placements later
- keep the fair-play manager fantasy intact

This redesign should **not**:
- add pay-to-win progression
- solve retention mainly through hard lockouts
- force constant session interruption
- turn every system into a timer with no decision value

---

## 2. Current Design Read

The current game already has strong base retention ingredients:
- Challenge charges with rolling recovery
- daily-capped Training
- daily-capped Scouting
- Daily Login / Club Legacy planning
- Tower as an always-available fallback loop

The main weakness is not lack of systems. It is that too much of the current value is:
- batchable in one sitting
- resolved instantly
- not tied to a later payoff
- not surfaced as a strong "come back for this" promise

So the redesign focus is:
- more anticipation
- more staged payoffs
- more short-term goals
- slightly more meaningful daily decisions

Not:
- more generic waiting
- more aggressive hard caps

---

## 3. Retention Targets

### Daily Feel Target
- quick opener session in `1-3` minutes
- `3-4` meaningful sessions per day as the main target
- `20-30` minutes per day for a normal engaged player
- longer optional depth sessions through Tower or live matches

### Session Shape Target
1. **Open session**
   - claim daily reward
   - collect completed async results
   - see one clear recommended action
2. **Midday session**
   - use one Challenge charge or review one new report
3. **Later session**
   - collect finished training/scouting work
   - make one lineup or upgrade decision
4. **Optional depth session**
   - Tower push
   - live match
   - objective cleanup

### Product Rule
The game should always answer:
- what can I do now?
- what should I come back for later today?
- what am I working toward this week?

---

## 4. Core Design Principles

1. **Anticipation over punishment**
   Good retention comes from future payoff, not just blocked access.

2. **Decisions over taps**
   Return sessions should contain at least one interesting choice, not only collection.

3. **Light asynchronous management**
   Some systems should resolve over time so the club feels alive between sessions.

4. **One clear next step**
   The home surface should always point to the most valuable available action.

5. **Tower stays optional depth**
   Tower supports engagement depth, but Challenge and async management should drive daily return rhythm.

---

## 5. Concrete Redesign

### A. Add an Async Jobs Layer

This is the highest-value retention addition.

Working examples:
- training block in progress
- scouting analysis in progress
- recovery treatment in progress
- club project / sponsor task in progress later

#### Why
- creates scheduled return moments
- makes the club feel persistent
- adds value without pay-to-win
- gives notifications a future reason to exist

#### V1 Scope
- `Training Jobs`
- `Scouting Analysis Jobs`

#### Rules
- the player starts the job now
- the result resolves later
- the result should include one small decision or consequence when claimed
- timers should be short enough to support same-day return, not only next-day return

#### Suggested Timing Bands
- short job: `90m-3h`
- medium job: `6h-8h`
- daily rollover job: resolves at next reset

---

### B. Redesign Training Into Sessions + Results

Training should stop being only an instant stat-click loop.

#### Current Problem
- easy to batch
- low anticipation
- limited emotional payoff after the tap

#### Redesign
- player assigns players to training blocks
- each block finishes later
- result reveals:
  - stat gain
  - fatigue/injury outcome
  - optional focus branch for the next block

#### Example Daily Loop
- morning: assign `2-3` drills
- afternoon: collect results
- evening: reassign or rest players

#### Important
- keep one instant training action if needed for convenience/tutorial clarity
- move the meaningful progression gains into the async layer

---

### C. Redesign Scouting Into a Reveal Ladder

Scouting should become a staged intel system instead of a mostly instant report tap.

#### Redesign
- first action: request scout focus
- later: collect the first report
- repeated scouting on the same opponent unlocks deeper layers

#### Reveal Ladder
1. team identity / general profile
2. pitch and tactical tendencies
3. lineup and phase-risk hints based on already-visible or fair data

#### Why
- gives players a reason to come back for a report
- makes repeated scouting feel like progression
- builds pre-match anticipation naturally

#### Guardrail
- no hidden power info
- no predictive recommendation engine
- no exclusive match-winning secrets

---

### D. Make Challenge the Main Return Spine

Challenge should remain the primary same-day comeback loop.

#### Keep
- `3` charge structure
- rolling recovery cadence
- rivalry / climbing identity

#### Add
- revenge marker on recent losses
- pinned target or "next best climb" suggestion
- small streak / ladder milestone rewards
- visible "next charge at" and "best use now" copy
- post-result hooks that point to the next return moment

#### Product Intent
When a player finishes a Challenge, they should know:
- whether to scout next
- whether to prep a rematch later
- when their next charge is ready

This makes Challenge a spine instead of a one-off action.

---

### E. Add Daily and Weekly Objectives

This is the second highest-value lightweight system.

#### Purpose
Give players a structured reason to touch multiple existing loops.

#### Daily Objective Examples
- complete `1` Challenge
- collect `1` training result
- request or collect `1` scouting report
- win `1` Tower match

#### Weekly Objective Examples
- complete `5` Challenges
- finish `8` training jobs
- unlock `3` scouting insights
- reach a Tower milestone

#### Reward Types
- Legacy Tokens
- cosmetics
- presentation rewards
- prestige badges

No power rewards.

---

### F. Reframe Tower as Depth + Milestones

Tower is already the best optional repeatable depth loop. It should stay depth-first, but it now also needs clearer pacing and pre-match readability.

#### Add
- daily Tower milestone chest
- first win of day bonus
- "reach 2 new levels today" objective
- next milestone preview
- passive rival intel
- opponent-condition identity so the player prepares for the match, not just clicks into it

#### Pacing Shape
- `3` daily attempts is the current recommended pace
- legal rival window should stay tight enough that players cannot skip the climb in minutes
- Tower should extend a day naturally, not swallow the whole day or clear too fast

#### Do Not Add
- monetized retries
- progression skips
- infinite no-pressure spam that collapses the mode into a one-sitting clear

Tower should remain the player's "I still want to play" mode, not the only retention mechanism.

---

### G. Upgrade the Home / Dashboard to a Return Hub

Retention systems fail if players cannot read them quickly.

The dashboard should become the command center for:
- ready now
- finishing soon
- objective progress
- next recommended action

#### Home Priority Order
1. collectable completed jobs
2. available Challenge charge
3. daily claim / daily objective progress
4. Tower milestone progress
5. background club status

---

## 6. What Not to Add Right Now

Avoid before launch:
- generic stamina bars
- large new match modes
- long mandatory cooldown walls on everything
- too many new currencies
- heavy ad-driven retry loops
- systems that only delay without adding new decisions

---

## 7. Concrete Build Order

This should happen before Launch Prep.

### Phase 1 - Retention Foundation
- write retention event taxonomy
- define dashboard priority logic
- remove temporary unlimited-testing assumptions from retention balancing work

### Phase 2 - Async Jobs V1
- training jobs
- scouting jobs
- ready-to-collect surfaces on home and source screens
- notifications / reminder-ready state hooks

### Phase 3 - Challenge Return Spine
- next-charge clarity
- revenge / comeback marker
- target recommendation copy
- post-result next-step prompts

### Phase 4 - Objectives Layer
- daily objectives
- weekly objectives
- zero-power reward table

### Phase 5 - Tower Framing Pass
- daily milestone layer
- first win of day framing
- next milestone surfacing

### Phase 6 - Monetization Fit Follow-Through
- align rewarded placements with the stronger return moments
- keep ad prompts secondary to base retention value

Launch Prep should follow after these slices are designed tightly enough for execution and live tuning.

---

## 8. Suggested Metrics

Track before and after:
- D1 / D7 / D30 retention
- sessions per DAU
- average session length
- completed jobs per DAU
- Challenge charges spent per DAU
- time-to-second-session same day
- objective completion rate
- Tower first-win-of-day rate

---

## 9. Immediate Next Tasks

1. Define the async jobs data model and state machine
2. Define dashboard prioritization for `ready now`, `soon`, and `later today`
3. Convert Training into the first async pilot
4. Convert Scouting into the second async pilot
5. Add a retention event/analytics checklist before implementation

---

## 10. Recommendation

The game does **not** primarily need more hard caps.

It needs:
- one meaningful async layer
- one objective layer
- stronger Challenge comeback framing
- clearer home-screen orchestration

That is the most retention-positive route and also gives later ad placements a healthier foundation.
