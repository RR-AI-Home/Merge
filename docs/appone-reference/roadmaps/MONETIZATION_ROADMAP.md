# Monetization Roadmap

> **Status:** Active sprint source of truth for monetization implementation.
>
> **Placement in roadmap:** Monetization is now the active sprint. The planning/dependency pass captured here is sufficiently complete to start implementation, onboarding tuning now continues through QA follow-up, and Launch Prep remains the final pre-release phase.

---

## Goal

Add a monetization layer that fits the game’s fair-play identity:
- no pay-to-win
- no extra match attempts
- no stat boosts
- no ad-heavy interruption loops

The system should favor:
- cosmetic monetization
- optional rewarded ads
- premium presentation and club identity

---

## Active Sprint Focus

The current sprint is now monetization implementation. The planning and dependency pass is complete enough to start building the first safe slice without shipping intrusive ads or power-selling shortcuts.

### Current Sprint Objectives
- begin the first safe monetization implementation slice
- keep the fairness guardrails explicit while implementation starts
- preserve the dependency order for cosmetics, rewards, entitlements, and analytics
- keep onboarding tuning as QA follow-up rather than a sprint blocker
- keep Launch Prep deferred until monetization and QA follow-up are in a good place

### Immediate Next Planning Order
1. Cosmetic/theming entitlement foundation rollout prep
2. Retention redesign implementation prep
3. Async jobs / objectives-layer scoping
4. Daily Login sponsor reward implementation prep
5. Tower rewarded-ad implementation prep
6. Challenge post-match rewarded-ad implementation prep
7. Premium/cosmetic catalog rollout sequencing

Primary implementation-prep brief:
- [FEATURES/MONETIZATION_FOUNDATION_IMPLEMENTATION_PLAN.md](../FEATURES/MONETIZATION_FOUNDATION_IMPLEMENTATION_PLAN.md)
- [FEATURES/RETENTION_REDESIGN_PLAN.md](../FEATURES/RETENTION_REDESIGN_PLAN.md)

---

## First Implementation Slice

The first build slice is intentionally narrow:
- cosmetics/themes
- entitlement ownership
- equip state
- token-ready catalog structure
- preview/equip analytics

This slice does **not** include live rewarded ads, premium subscriptions, or gameplay-adjacent rewards.

### V1 Build Goal
Ship the minimum shared monetization foundation needed to prove:
- cosmetic items can exist in one shared catalog
- users can own them permanently
- users can equip them across web and mobile
- the UI can preview and manage them cleanly
- analytics can measure preview, unlock, and equip behavior

### V1 In Scope
- `CatalogItem` / SKU-backed cosmetic inventory model
- `UserEntitlement` ownership records
- `UserEquipState` slot-based equip state
- theme/cosmetic preview payload shape
- one thin owned-items / equip flow
- one thin shop-ready catalog read flow
- analytics for preview, unlock/grant, equip, unequip

Implementation breakdown reference:
- [FEATURES/MONETIZATION_FOUNDATION_IMPLEMENTATION_PLAN.md](../FEATURES/MONETIZATION_FOUNDATION_IMPLEMENTATION_PLAN.md)

### Explicitly Out of V1
- rewarded ads
- premium tier / subscription
- real-money checkout
- sponsor reward prompts
- daily login claim flow
- Tower reward loop
- Challenge post-match reward loop
- gameplay-impacting rewards of any kind

### V1 Success Criteria
- one cosmetic item can be granted and later equipped without custom code paths
- one equipped item per slot family is enforced consistently
- ownership/equip state can round-trip across backend, web, and mobile
- catalog payloads can support both future shop and future reward grants
- analytics can answer “what was previewed, granted, and equipped?”

---

## Design Principles

1. **Fairness first**
   No monetization may change match outcomes, scout accuracy, youth quality, training gains, or challenge/tower/cup access limits.

   This also means:
   - no ad-based instant training completion
   - no ad-based training speed multipliers
   - no broad scouting fast-forward loop
   - any future scouting acceleration must stay tightly capped convenience only and must never improve report quality

2. **Rewarded over forced**
   If ads are used, default to optional rewarded moments instead of interstitials or banners.

3. **Cosmetics before power**
   Themes, presentation packs, celebration variants, bracket skins, and club identity should be the first monetization pillar.

4. **Natural placements only**
   Monetization should appear at friction-free moments:
   - daily login claim
   - post-match summary
   - tower progression reward moment
   - cosmetic shop / theme screens

5. **Do not break the premium manager feel**
   Squad building, tactics, live match, and cup prep should stay clean and interruption-light.

---

## Monetization Fit Summary

### Strong Fit
- **Themes / Cosmetics**
- **Daily Login sponsor-style reward**
- **Tower rewarded ads**
- **Challenge post-match optional reward**

### Medium Fit
- **Scouting presentation upgrades** (not better intel)
- **Training sponsor bonus presentation**
- **Live result/replay polish**

### Weak Fit
- **Cup ads**
- **League ads**
- **Squad / Strategy ads**
- **Youth Intake ads**

### Avoid Entirely
- extra challenge attempts
- extra tower retries that affect competitive fairness
- extra training sessions
- better youth intake odds
- stronger scouting intel
- stat boosts
- rerolls that improve outcomes

---

## Recommended Revenue Mix

- **Primary:** cosmetics / themes / premium presentation
- **Secondary:** optional rewarded ads
- **Later optional:** premium subscription tier

Suggested high-level mix:
- `50-70%` cosmetics / premium
- `20-35%` rewarded ads
- `0-15%` anything more aggressive only if retention and churn data support it

---

## Roadmap Order

## Phase 0 - Retention Redesign Foundation

### Goal
Strengthen the daily loop before live monetization and before Launch Prep execution.

### Tasks
- [x] Turn [FEATURES/RETENTION_REDESIGN_PLAN.md](../FEATURES/RETENTION_REDESIGN_PLAN.md) into concrete implementation slices
- [x] Scope async jobs for Training and Scouting
- [x] Define daily/weekly objectives as zero-power retention scaffolding
- [x] Strengthen Challenge comeback framing and dashboard orchestration
- [ ] Align retention analytics with future sponsor/ad placements

### Acceptance Criteria
- players have stronger same-day return reasons than simple quota depletion
- at least one async return loop is defined cleanly enough for implementation
- objectives and comeback framing are zero-power and fair-play safe
- monetization placements attach to healthy return moments instead of replacing them

---

## Phase A — Monetization Foundation

### Goal
Prepare the economy and UI surfaces without shipping intrusive monetization yet.

### Tasks
- [x] Define monetization rules doc and enforcement constraints
- [x] Add monetization-safe reward catalog for non-power rewards
- [x] Add cosmetic inventory model / storage plan
- [x] Add theme SKU structure and entitlement model
- [x] Define ad placement inventory by screen and moment
- [x] Add analytics events for reward-claim, theme-preview, tower-reward usage, and post-match CTA taps

Reference: [MONETIZATION_FOUNDATION_PLAN.md](./MONETIZATION_FOUNDATION_PLAN.md)

### Acceptance Criteria
- No monetization item can alter competition fairness
- Cosmetic rewards can be granted without code-path duplication
- All future monetization placements are mapped to explicit screens and moments

### Implementation-Prep Exit Criteria
- [x] First implementation slice is explicitly locked to cosmetics/themes + entitlements only
- [x] Backend model/API shape is documented for the first slice
- [x] Web/mobile surfaces for preview, owned items, and equip are documented
- [x] Analytics events for first-slice behavior are documented
- [x] Rewarded ads, subscription, and real-money checkout remain out of v1

---

## Phase B — Cosmetic Monetization

### Goal
Ship the cleanest, least risky monetization first.

### Candidate Items
- [ ] Club themes
- [ ] Scoreboard skins
- [ ] Result modal styles
- [ ] Tower visual themes
- [ ] Cup bracket frames
- [ ] Trophy cabinet styling
- [ ] Badge borders / profile frames
- [ ] Seasonal presentation packs

### Acceptance Criteria
- Cosmetic ownership persists across mobile and web
- Cosmetic previews work before purchase/unlock
- No cosmetic makes gameplay readability worse

---

## Phase C — Daily Login Sponsor Reward

### Goal
Create one stable optional rewarded-ad anchor in the daily loop.

Current build note:
- the base daily check-in loop and one QA-safe sponsor bonus flow are now in progress
- a real ad-provider handoff is still deferred, so the current sponsor claim path should be treated as the gameplay/state foundation rather than final live ad integration

Primary design reference:
- [DAILY_LOGIN_SYSTEM_SPEC.md](../FEATURES/DAILY_LOGIN_SYSTEM_SPEC.md)

### Tasks
- [ ] Add one optional rewarded-video claim to Daily Login
- [ ] Reward only soft currency, cosmetics, or presentation tokens
- [ ] Add cooldown and claim-state tracking
- [ ] Add analytics for opt-in and completion

Reference:
- [FEATURES/DAILY_LOGIN_SYSTEM_SPEC.md](../FEATURES/DAILY_LOGIN_SYSTEM_SPEC.md)
- [FEATURES/DAILY_LOGIN_SPONSOR_REWARD_PLAN.md](../FEATURES/DAILY_LOGIN_SPONSOR_REWARD_PLAN.md)

### Acceptance Criteria
- The reward is optional
- The reward does not alter competition outcomes
- The screen remains valuable without watching the ad
- The underlying daily check-in system is already strong without ads attached

---

## Phase D — Tower Rewarded Ads

### Goal
Use Tower as the main repeatable ad loop because it is solo and lower-risk.

### Good Placements
- [ ] Post-win bonus soft-currency claim
- [ ] Optional presentation reward chest
- [ ] Optional end-of-run sponsor reward

Reference:
- [FEATURES/TOWER_REWARDED_AD_PLAN.md](../FEATURES/TOWER_REWARDED_AD_PLAN.md)

### Avoid
- granting stronger bots/opponents manipulation
- changing tower progression fairness directly

### Acceptance Criteria
- Ads appear only after clear player actions
- No interruption during match flow
- Tower remains fully playable without ad engagement

---

## Phase E — Challenge Post-Match Rewarded Ads

### Goal
Add a light optional reward to Challenge without hurting competitive trust.

### Good Placements
- [ ] Post-match sponsor bonus
- [ ] Enhanced replay / scorecard presentation unlock
- [ ] Cosmetic token bonus

Reference:
- [FEATURES/CHALLENGE_REWARDED_AD_PLAN.md](../FEATURES/CHALLENGE_REWARDED_AD_PLAN.md)

### Avoid
- better trade options
- extra challenge quota
- stronger swap outcomes

### Acceptance Criteria
- Competitive fairness remains unchanged
- Post-match CTA does not slow down normal claim flow

---

## Phase F — Premium Tier / Subscription

### Goal
Add recurring monetization only after the cosmetic and rewarded loops are proven safe.

### Good Premium Benefits
- [ ] exclusive themes
- [ ] expanded cosmetic rotation
- [ ] premium presentation packs
- [ ] trophy room upgrades
- [ ] extra profile/customization options

Reference:
- [FEATURES/PREMIUM_COSMETIC_SKU_PLAN.md](../FEATURES/PREMIUM_COSMETIC_SKU_PLAN.md)

### Avoid
- match advantage
- training advantage
- scouting advantage
- youth advantage

---

## Systems Matrix

| System | Best Monetization |
|---|---|
| `Challenge` | Optional post-match rewarded reward |
| `Tower` | Core rewarded-ad loop |
| `Cup` | Cosmetic presentation / theme monetization |
| `Scouting` | Presentation-only enhancement; any later speed-up must stay tightly capped convenience only |
| `Training` | Light sponsor-style soft reward only; no time acceleration |
| `Youth Intake` | Cosmetic reveal polish only |
| `Live Match` | Premium presentation / replay polish |
| `Squad / Strategy` | Themes / premium customization |
| `League` | Minimal direct monetization |
| `Daily Login` | Sponsor-style rewarded claim |
| `Themes` | Primary monetization pillar |

---

## What Must Exist Before Implementation

- stable utility backend follow-up
- theme/accessibility QA sweep
- daily login system implementation
- entitlement/storage design for cosmetics
- analytics baseline for:
  - DAU
  - session count
  - average session length
  - D1 / D7 retention
  - rewarded ad opt-in rate

---

## Success Metrics

- rewarded ad opt-in rate
- rewarded completion rate
- cosmetic preview-to-claim/purchase rate
- retention impact after monetization launch
- churn delta on monetized surfaces
- average sessions/day after daily login sponsor addition

---

## Recommendation

When this roadmap is promoted, build in this order:

1. cosmetic/theming entitlement foundation
2. daily login sponsor reward
3. tower rewarded ads
4. challenge post-match rewarded ads
5. premium tier

Do **not** start with banners or forced interstitials.

---

## Current Status

- Monetization Phase 1 is now live and stable in QA:
  - cosmetic/theming entitlement foundation
  - daily login sponsor reward
  - tower sponsor reward
  - challenge post-match sponsor reward
  - Legacy Token wallet and first Club Identity spend loop
- Phase 1 closeout work is also done:
  - expanded shop stock across all active identity slots
  - reward-track cosmetic coverage across all active identity slots
  - clearer `For Sale` / `Reward Only` / `Owned` / `Equipped` surfacing
- Current economy read after live QA is acceptable:
  - earn: `50` base daily, `25` daily sponsor, `35` Tower sponsor, `20` Challenge sponsor
  - spend: `150` uncommon, `325` rare, `600` showcase
- Immediate next step is not fairness tuning; it is deeper cosmetic content drops, broader reward-track rollout, and later premium-shelf planning.
- Active follow-on plan:
  - [FEATURES/MONETIZATION_PHASE2_CONTENT_PLAN.md](../FEATURES/MONETIZATION_PHASE2_CONTENT_PLAN.md)
- Current Phase 2 progress:
  - added challenge, training, and top-ten league reward tracks
  - expanded reward-only catalog coverage in weaker slots
  - improved report/result theme previews so cosmetics read more distinctly before purchase or unlock
- Phase 2 closeout:
  - added `Featured Picks` shelves for theme-heavy slots
  - Phase 2 is now stable enough to treat as complete unless we intentionally start a new content drop
