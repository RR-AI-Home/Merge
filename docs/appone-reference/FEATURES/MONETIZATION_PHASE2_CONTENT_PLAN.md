# Monetization Phase 2 Content Plan

## Goal

Turn the stable Phase 1 Legacy Token foundation into a richer cosmetic progression layer without changing fairness rules.

Launch planning decision, 2026-05-04:
- the next monetization phase is cosmetic catalog depth plus reward-track expansion
- subscriptions are not in current scope and should not be planned before launch
- any premium shelf or subscription direction is post-launch only, after cosmetic depth and live use prove the need

Phase 2 should deepen:
- cosmetic variety
- reward-track cadence
- clarity around what is bought vs earned

It should not add:
- power rewards
- gameplay acceleration
- fairness-sensitive shortcuts
- subscriptions or recurring premium plans before launch

## Phase 2 Structure

### Slice A — Milestone Reward Tracks

Add more claimable cosmetic rewards tied to real club activity:
- `10 wins` reward
- deeper scouting milestone reward
- Tower participation reward

These should:
- use visible progress
- be claimable from the Identity rewards surface
- auto-equip only when that helps show value clearly

### Slice B — Cosmetic Drop Expansion

Add a fresh content drop so the shop keeps feeling alive:
- at least one new premium frame or hero item
- at least one new report theme
- at least one new result theme
- one or two new mid-tier filler items for variety

### Slice C — Reward Progress Readability

Stop using vague static reward labels where real progress exists.

Prefer:
- `2/3 wins`
- `4/7 reports`
- `3/5 Tower matches`

This makes the rewards tab feel like a real progression ladder instead of a static checklist.

### Slice D — Later Content Follow-Up

After the first Phase 2 drop is stable:
- consider broader seasonal drops
- consider featured shelves
- consider dedicated report/result theme surfacing as those categories grow

## Current Execution Order

1. Add live reward progress metrics to the Legacy catalog payload
2. Add the next claimable reward tracks
3. Add the next cosmetic content drop
4. Verify mobile_cricket_rivals/web Identity flows still read cleanly

## Current Phase 2 Drop

The first execution slice for Phase 2 is:
- `10 Wins` reward
- `7 Reports` reward
- `5 Tower Matches` reward
- one new frame reward
- one new title reward
- one new report theme
- one new result theme

The catalog-depth slice added on 2026-05-04 expands the live shop with:
- `Prism Command` showcase profile frame
- `Prism Lane` rare badge border
- `Command Deck` uncommon team banner
- `Rival Dossier` rare report theme
- `Rival Dossier Finish` rare result theme

This completes the TODO item to expand premium/cosmetic catalog depth beyond the original Phase 1 slot coverage. The reward-track rollout design is now complete below.

## Next Reward-Track Rollout

The next reward-track rollout design is now captured in [REWARD_TRACK_ROLLOUT_PLAN.md](./REWARD_TRACK_ROLLOUT_PLAN.md).

The recommended first implementation slice is:
- `challenge_wins_7`
- `league_top_25`
- `cup_entry`
- `friendly_play_3`

That slice deliberately spreads rewards across ranked, seasonal, and social loops while keeping every reward cosmetic-only and easy to QA.

## Guardrails

- Rewards remain cosmetic only
- Claim flows must stay optional and non-disruptive
- Reward-only items must never be purchasable through token pricing
- Shop clarity must improve as the catalog grows, not regress
