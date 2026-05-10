# Welcome / Onboarding Implementation Plan

> **Placement:** Before player-design pass and before monetization implementation.
>
> **Purpose:** Help first-time players understand the core loop quickly enough to finish setup, play a first match, and know where to go next.

---

## Goal

Create a guided first-session onboarding flow that:
- teaches the minimum viable game loop
- gets new players through draft and first setup successfully
- reduces confusion across Squad, Strategy, Challenge, Cup, and Compete
- increases early retention before monetization is added

This should be a **task-based guided flow**, not a slideshow.

---

## Core Principles

1. **Teach by doing**
   Every onboarding step should take the player to a real screen and ask for a real action.

2. **Keep it short**
   The full onboarding should feel like a first-session orientation, not a long tutorial campaign.

3. **Respect experienced users**
   Let players skip or dismiss non-critical instructional overlays after the key required setup steps.

4. **Never block core corrective actions**
   If a player needs to fix squad rules or draft composition, onboarding should help them reach the right screen rather than trapping them in modal text.

5. **Mobile-first clarity**
   The onboarding system should be optimized for touch, compact copy, and clear “next action” buttons.

---

## Recommended Flow

### Stage 0 — Account Created

Trigger:
- immediately after successful registration

Behavior:
- if `needsDraft = true`, route directly into Draft
- show one lightweight onboarding banner:
  - `Welcome to Cricket Rivals`
  - `Start by drafting your 15-player squad.`

No heavy modal here.

### Stage 1 — Draft Your Squad

Required:
- player must complete draft before entering the main shell

Teach points:
- build a 15-player squad
- need at least 2 wicket-keepers
- need at least 2 U21 players
- long hold players for details

UI:
- one small instruction card pinned near the top
- one dismissible hint on first long-hold / first invalid confirm

Completion:
- successful `draft-confirm`

### Stage 2 — Welcome to Your Club

Trigger:
- first successful draft completion

Show:
- short modal or bottom sheet
- explain the core loop in one screen:
  - `Build your squad`
  - `Set strategy`
  - `Play challenges`
  - `Climb League, Cup, and Tower`

Primary CTA:
- `Set Playing XI`

Secondary:
- `Skip Tour`

### Stage 3 — Set Playing XI

Screen:
- Squad / Playing XI

Teach points:
- choose 11 players
- need at least 1 wicket-keeper
- need at least 1 U21
- long hold any player for details

Completion:
- first successful XI save

Primary CTA after completion:
- `Review Strategy`

### Stage 4 — Review Strategy

Screen:
- Match Strategy

Teach points:
- batting intent changes scoring risk
- bowling phases change control vs wickets
- Cup strategy can be set separately later

Completion:
- first successful strategy save

Primary CTA after completion:
- `Open Compete`

### Stage 5 — Understand Compete

Screen:
- Compete hub

Teach points:
- `Challenge`: daily main PvP loop
- `League`: seasonal table progress
- `Cup`: knockout schedule
- `Tower`: solo progression

Primary CTA:
- `Play First Challenge`

### Stage 6 — First Challenge

Screen:
- Challenge

Teach points:
- scouting helps you prepare
- wins can unlock swaps
- this is the main repeatable daily mode

Completion:
- starting or finishing first challenge interaction

Primary CTA:
- `Finish Tour`

### Stage 7 — Complete

Show:
- lightweight completion state
- summary:
  - squad ready
  - strategy saved
  - compete modes unlocked

Optional CTA choices:
- `Go Home`
- `Open Compete`
- `Open Squad`

---

## Required vs Optional Steps

### Required Gates
- draft completion
- first XI save

### Soft Guidance
- first strategy save
- first compete hub visit
- first challenge introduction

This keeps onboarding useful without over-forcing it.

---

## Persistence Model

Add a persistent onboarding progress state per user.

Suggested fields:
- `onboardingVersion`
- `onboardingStage`
- `onboardingCompletedAt`
- `onboardingSkippedAt`

Suggested stage values:
- `draft_required`
- `post_draft_intro`
- `xi_required`
- `strategy_intro`
- `compete_intro`
- `challenge_intro`
- `completed`

Rules:
- onboarding should be resumable after app restart
- onboarding must survive logout/login
- versioning should allow future onboarding refreshes after major redesigns

---

## Backend / Data Work

### User fields
- add onboarding state fields to `User` or a dedicated onboarding table

### Endpoints

Recommended:
- `GET /user/onboarding`
- `POST /user/onboarding/stage`
- `POST /user/onboarding/complete`
- `POST /user/onboarding/skip`

Behavior:
- endpoints should be small and idempotent
- stage progression should not be trusted purely from client state

### Auto progression hooks

Backend should advance onboarding state after:
- successful draft confirmation
- successful XI save
- successful strategy save

This prevents client-only drift.

---

## Frontend / Mobile Work

### Shared system pieces
- onboarding progress hook
- guided spotlight / tooltip component
- small instructional banner component
- full-screen welcome modal / bottom sheet
- “next recommended action” CTA pattern

### Mobile surfaces to integrate
- DraftScreen
- SquadScreen
- TacticsScreen
- CompeteHubScreen
- ChallengeScreen
- DashboardScreen

### Navigation behavior
- onboarding should be able to deep-link to required screens
- if a required stage is incomplete, route there first
- soft stages should not hard-block the full app

---

## Web / Desktop Browser Work

Web does not need to be as aggressive as mobile, but the same stage state should exist.

Recommended:
- same onboarding stages
- lighter tooltip/checklist treatment
- same backend progress model

---

## UI Copy Direction

Copy should be short, directive, and low-pressure.

Examples:
- `Draft 15 players to start your club.`
- `You need 2 wicket-keepers and 2 U21 players.`
- `Set your best XI before you compete.`
- `Challenges are your main daily matches.`
- `Long hold a player to inspect their details.`

Avoid:
- lore-heavy intro text
- giant tutorial paragraphs
- technical language

---

## Analytics

Track:
- onboarding started
- onboarding skipped
- stage entered
- stage completed
- first draft confirm
- first XI save
- first strategy save
- first challenge open
- first challenge complete

Questions this should answer:
- where players drop off
- whether draft or XI rules are confusing
- whether Compete/Challenge entry is understood

---

## Acceptance Criteria

- New users are always routed through draft when required
- Players cannot silently bypass required onboarding setup stages
- First-session players understand where Squad, Strategy, and Compete live
- Onboarding progress persists across reloads and login
- The system is short enough to finish in one first session
- The app remains usable for returning users after onboarding completion

---

## Rollout Order

1. Persisted onboarding state model
2. Draft-required onboarding banner
3. Post-draft welcome modal
4. XI-required step
5. Strategy step
6. Compete / Challenge intro steps
7. Analytics and tuning pass

---

## Recommendation

Do this before monetization implementation.

Reason:
- onboarding affects first-session retention
- retention affects monetization effectiveness
- poor onboarding would distort monetization results and product judgment
