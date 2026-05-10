# Reward Track Rollout Plan

## Goal

Design the next reward-track rollout after the current starter reward set without adding power, acceleration, or fairness-sensitive shortcuts.

This plan is design-ready for implementation after the current Phase 2 cosmetic catalog and starter milestone rewards. It should not be treated as a subscription, premium pass, or gameplay-progression system.

## Current Live Baseline

The live starter reward layer already covers:
- starter pack identity items
- onboarding completion
- first win, 3 wins, 5 wins, and 10 wins
- 3 scouting reports and 7 scouting reports
- 5 Tower matches played
- 7-day check-in cycle
- 3 Challenge wins
- 10 training sessions
- top-ten league position

The next rollout should therefore avoid duplicating the same early milestones. It should make the rewards surface feel more like a season journey while still being small enough to QA before launch.

## Rollout Shape

### Track 1 — Season Foundation

Purpose: reward ordinary weekly play across core loops.

Milestones:
- `weekly_checkin_10`: 10 check-ins across the current season window
- `training_rhythm_20`: 20 completed training sessions
- `scouting_room_12`: 12 scouting reports opened

Recommended rewards:
- `Season Standard` motto plate
- `Training Ground Silver` badge border
- `Analyst Room` report theme

Why this track:
- reinforces retention without selling shortcuts
- uses already tracked activity types
- stays cosmetic-only and easy to explain

### Track 2 — Competitive Rise

Purpose: reward clubs that move from early wins into sustained competitive play.

Milestones:
- `challenge_wins_7`: 7 completed Challenge wins
- `league_top_25`: reach top 25 in the league table
- `league_top_5`: reach top 5 in the league table

Recommended rewards:
- `Rival Standard` team banner
- `Table Climber` manager title
- `Promotion Lights` result theme

Why this track:
- extends the existing Challenge/top-ten track without replacing it
- gives league climb a clearer cosmetic ladder
- works with current standings data

### Track 3 — Cup And Tower Identity

Purpose: give Cup and Tower players their own longer-form identity goals.

Milestones:
- `cup_entry`: play one Cup match
- `cup_run_3`: win 3 Cup matches in a season
- `tower_matches_12`: play 12 Tower matches

Recommended rewards:
- `Cup Entry` badge border
- `Knockout Desk` report theme
- `Tower Signal` profile frame

Why this track:
- makes Cup feel represented in the reward layer
- deepens Tower identity after the current 5-match reward
- does not require new gameplay systems

### Track 4 — Social Club

Purpose: connect Friend Challenges to cosmetics without affecting ranked progression.

Milestones:
- `friendly_play_3`: complete 3 friendly matches
- `friendly_rematch_2`: complete 2 rematches
- `friend_network_5`: have 5 accepted friends

Recommended rewards:
- `Club Circle` motto plate
- `Rematch Wire` result theme
- `Network Captain` manager title

Why this track:
- strengthens the new Friends feature
- keeps friendly rewards explicitly non-ranked
- turns social retention into identity, not power

## Implementation Order

1. Add the catalog items as reward-only cosmetics with `unlockPath.type = reward_track`.
2. Add reward-progress counters to the Legacy catalog payload only for data already available server-side.
3. Add claim endpoints one track at a time, reusing `claimFixedLegacyReward`.
4. Surface the new tracks in Club Identity Rewards with progress labels such as `4/7 Challenge wins`.
5. QA web and mobile Club Identity for locked, ready, owned, and equipped states.

## Launch-Safe First Slice

If this rollout is built before Launch Prep, start with:
- `challenge_wins_7`
- `league_top_25`
- `cup_entry`
- `friendly_play_3`

These are the best first slice because they spread across ranked, seasonal, and social loops while keeping eligibility rules easy to verify.

## Deferrals

Keep these post-launch unless live use proves the need:
- paid reward pass
- subscription-linked rewards
- token multipliers
- accelerated training, scouting, or progression rewards
- infinite seasonal ladders
- randomized reward boxes

## Completion Criteria

The rollout design is complete when:
- each next track has a purpose, milestone, reward type, and data source
- the first implementation slice is named
- fairness guardrails are explicit
- docs point future implementation toward cosmetic-only rewards
