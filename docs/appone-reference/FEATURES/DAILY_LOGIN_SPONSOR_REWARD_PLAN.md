# Daily Login Sponsor Reward Plan

> **Status:** Active implementation slice for the monetization sprint.
>
> **Depends on:**
> - [DAILY_LOGIN_SYSTEM_SPEC.md](./DAILY_LOGIN_SYSTEM_SPEC.md)
> - [../roadmaps/MONETIZATION_FOUNDATION_PLAN.md](../roadmaps/MONETIZATION_FOUNDATION_PLAN.md)

---

## 1. Purpose

Design the optional monetization layer that can sit on top of the Daily Login / Club Legacy system without changing the fairness or value of the base check-in loop.

This plan defines:
- what the sponsor reward is
- when it appears
- what it can reward
- what it must never reward
- what analytics and UI behaviors are required

It does **not** authorize implementation yet.

---

## 2. Design Goal

Add one stable optional rewarded-ad anchor to the daily loop that:
- feels additive, not mandatory
- respects the zero-power economy
- creates a low-friction monetization surface
- does not damage the premium manager tone

The player should feel:
- “I already got my daily reward.”
- “If I want, I can claim a small sponsor bonus too.”

Never:
- “I need to watch this to stay competitive.”
- “The real reward is locked behind the ad.”

---

## 3. Core Rules

### Required Product Rules
- The base daily reward must always be claimable without watching an ad.
- The sponsor reward must be optional.
- The sponsor reward must not grant gameplay power.
- The sponsor reward must not feel larger or more important than the base reward.
- The sponsor reward must not break the 7-day forgiving cadence.

### Hard Bans
The sponsor reward may **never** give:
- extra challenge attempts
- extra scouting uses
- instant training completion
- faster training timers
- stronger scouting detail
- youth quality improvements
- morale boosts
- training multipliers
- injury recovery
- tower advancement
- cup or challenge outcome protection
- hidden stats, recommendations, or predictive insights

### Related Convenience Rule
- Training acceleration is out of scope and should stay banned because it converts ad engagement too directly into player-strength progression.
- Scouting acceleration, if ever tested later, must be limited convenience only: tightly capped, no quality increase, and not part of the first sponsor-reward slice.

---

## 4. Placement in the Flow

### Recommended Player Flow
1. Player opens Daily Check-In.
2. Player claims the normal daily reward.
3. Reward reveal finishes.
4. A secondary optional sponsor panel appears.
5. Player can:
   - `Claim Sponsor Bonus`
   - or `Not Now`
6. If completed, the bonus is granted instantly and logged separately from the base claim.

### Why This Placement
- it keeps the base check-in valuable on its own
- it avoids the feeling that the ad is gating the daily reward
- it aligns with the “rewarded, not forced” rule

### Placement Rule
The sponsor CTA should appear **after** the base reward claim, not before.

---

## 5. Reward Types

### Allowed V1 Rewards
Keep V1 narrow.

#### A. Legacy Tokens
Primary option for launch.

Suggested range:
- `+20 to +40` Legacy Tokens

This should feel helpful, but not large enough to distort the shop economy.

#### B. Cosmetic Fragments
Only if fragments are implemented cleanly later.

Examples:
- profile frame fragment
- banner fragment
- season collectible fragment

This should be deferred unless the fragment system is already clear and simple.

#### C. Small Presentation Reward
Optional later path.

Examples:
- alternate reward reveal skin
- sponsor-branded but tasteful result flair

This is lower priority than Tokens.

### Recommended V1
Launch with:
- **Legacy Tokens only**

Reason:
- simplest to message
- easiest to log
- easiest to balance
- avoids fragment clutter too early

---

## 6. Reward Size and Frequency

### Daily Limit
- `1` sponsor reward claim per calendar day

### Balance Target
The sponsor reward should feel like a modest top-up, not a second full reward.

Suggested target:
- about `20-35%` of a normal token-focused check-in day

Examples:
- Day 1 base reward: `50 Tokens`
- Sponsor reward: `+20 Tokens`

### Economy Rule
The sponsor reward must not become the dominant source of Legacy Tokens.

Recommended rule:
- sponsor rewards should contribute **less than 25%** of a player’s weekly token income at baseline

---

## 7. UX / UI Requirements

### Presentation
The sponsor CTA should be:
- clearly optional
- visually secondary to the base claim
- one tap to start
- easy to dismiss

### Copy Direction
Use low-pressure wording such as:
- `Optional Sponsor Bonus`
- `Watch for +20 Legacy Tokens`
- `Support the club and claim a small bonus`

Avoid:
- `Unlock full reward`
- `Don’t miss out`
- `Boost your progress now`

### UI Behavior
- if declined, the user should continue normally
- if completed, show a short bonus-granted moment
- if ad fails, return to the check-in state without breaking the base reward

### Visibility Rule
Show the sponsor CTA only after the base claim has been resolved.

---

## 8. Failure and Edge Cases

### If Ad Is Unavailable
- hide or disable the CTA
- show short fallback copy:
  - `Sponsor bonus unavailable right now`
- do not block the player

### If Ad Starts but Fails
- no bonus granted
- keep the daily claim intact
- allow retry only if the ad network permits and the user has not already completed a reward

### If Reward Grant Fails After Completion
- mark the ad completion event
- queue a retry-safe grant path if possible
- never silently swallow a completed reward

### Admin / Debug
- support a debug bypass path similar to other admin unlimited/testing behaviors
- allow QA to simulate sponsor-claim success without live ad dependency

---

## 9. Analytics Requirements

### Required Events
- `daily_sponsor_offer_viewed`
- `daily_sponsor_offer_dismissed`
- `daily_sponsor_reward_started`
- `daily_sponsor_reward_completed`
- `daily_sponsor_reward_failed`
- `daily_sponsor_reward_granted`

### Required Properties
- `userId`
- `dayInCycle`
- `baseRewardType`
- `baseRewardAmount`
- `sponsorRewardType`
- `sponsorRewardAmount`
- `tokenBalanceBefore`
- `tokenBalanceAfter`
- `surface`
- `adProvider`
- `isAdmin`

### Success Metrics
- offer view rate
- opt-in rate
- completion rate
- grant success rate
- token economy share from sponsor claims
- retention impact vs non-viewers

---

## 10. Economy Guardrails

### Token Inflation Rules
- sponsor rewards must not outpace the check-in economy
- sponsor rewards must not trivialize common cosmetic prices
- sponsor rewards must be revisited if token spend rates drop or hoarding rises sharply

### Player Sentiment Guardrails
Watch for:
- players feeling forced to watch
- players viewing the base reward as “incomplete”
- players feeling sponsor claims are too weak to matter

The sponsor reward works only if it feels:
- modest
- optional
- consistent

---

## 11. Backend / State Planning

The system likely needs:
- sponsor-claim daily state
- ad completion receipt handling
- safe token grant path
- grant dedupe protection
- analytics hooks

### Recommended State Fields
- `lastSponsorClaimedAt`
- `sponsorClaimsInCycle`
- `lastSponsorRewardType`
- `lastSponsorRewardAmount`

This can likely live alongside Daily Check-In progress or a related monetization state record.

---

## 12. Rollout Recommendation

### V1
- one optional sponsor reward per day
- Legacy Tokens only
- simple CTA after base claim
- full analytics coverage

### V2
- token amount experiments
- cosmetic fragment experiments if needed
- presentation polish upgrades

### Do Not Do In V1
- multiple daily ad claims
- random loot-box style sponsor rewards
- sponsor bonus before the base claim
- sponsor rewards that are bigger than the day’s core claim

---

## 13. Acceptance Criteria

This planning slice is complete when:
- sponsor reward placement is defined
- allowed reward types are explicitly limited
- reward sizing rules are defined
- failure handling is defined
- analytics coverage is defined
- implementation can proceed without re-opening fairness debates

---

## 14. Recommendation

The best first sponsor reward is:
- **one optional post-claim rewarded video**
- **grants a small Legacy Token bonus**
- **once per day**

This gives the game a clean first ad anchor without teaching players that gameplay value lives behind ads.
