# Daily Login System - Zero-Power Economy Specification

> **Purpose:** Create a daily check-in system that improves retention, expression, and identity without adding gameplay power or hidden competitive advantage.

---

## 1. Product Summary

### Working Name
- **Daily Check-In + Club Legacy**

### Core Idea
- Players log in to claim a daily reward track.
- Rewards focus on cosmetics, prestige, presentation, and club identity.
- A new non-power currency, **Legacy Tokens**, fuels a seasonal cosmetic shop.
- The system connects to existing fantasy pillars: **League**, **Tower**, **Cup**, and **seasonal club identity**.

### Design Goal
Build a **zero-power economy** around login rewards:
- **Expression, not power**
- **Identity, not optimization**
- **Anticipation, not obligation**

---

## 2. Design Principles

### Guiding Rule
**If it changes decisions, it changes power.**

This means the login system must not grant exclusive data, predictions, or tools that improve roster, match, or swap outcomes versus other players.

### Principles
- **Fairness First:** No reward may improve match outcomes, swap quality, training gains, or hidden progression odds.
- **Same Decision Tools for Everyone:** All players must have access to the same gameplay data and strategic information.
- **Forgiving by Default:** Missed days delay progress; they do not hard-reset the cycle.
- **Meaningful Identity:** Rewards should make a club feel more personal, established, and memorable.
- **Connected Fantasy:** Rewards should reference existing game systems rather than feeling like a generic mobile meta layer.

---

## 3. Goals and Non-Goals

### Goals
- Increase daily open rate and week-1/week-4 retention.
- Create a low-pressure reason to return daily.
- Add a sustainable cosmetic/prestige economy that can grow over time.
- Strengthen emotional attachment to the player's club identity.
- Support future monetization ethically through cosmetic expansion, not power.

### Non-Goals
- Do not add extra match attempts, training sessions, tower retries, challenge rerolls, or better rewards.
- Do not reveal hidden traits, hidden ratings, opponent weaknesses, or swap quality estimates.
- Do not create inventory clutter with low-value filler items.
- Do not require perfect streaks to access the best content.

---

## 4. Guardrails

### Hard Bans
The daily login system must **never** reward:
- Extra swaps
- Better trade options
- Improved youth intake odds
- Guaranteed stronger players
- Match stat boosts
- Morale boosts
- Injury healing
- Training multipliers
- Extra challenge quota
- Extra tower progress
- Hidden trait reveals
- Opponent weakness hints
- Probability-based recommendations

### Allowed Reward Types
- Cosmetics
- Presentation upgrades
- Profile customization
- Team identity customization
- Legacy Tokens
- Season collectibles
- Titles and prestige badges
- Additional non-essential convenience slots, if baseline is already generous

### Insight Safety Rule
Allowed:
- Better formatting of already-visible information
- Flavor commentary
- Historical summaries
- Visualizations of public data

Not allowed:
- New exclusive data
- Ranked recommendations
- Hidden attribute exposure
- Predictive optimization tools

---

## 5. Core Loop

### Daily Player Flow
1. Player logs in.
2. Dashboard shows an unobtrusive check-in card if today's reward is unclaimed.
3. Player taps **Claim**.
4. Reward is granted instantly.
5. Progress advances toward the Day 7 choice reward.
6. Legacy Tokens, if earned, can be spent in the seasonal Legacy Shop.

### Desired Feel
- Quick to claim
- Positive but not noisy
- Optional feeling, not manipulative
- Rewarding enough to build habit

---

## 6. Reward Structure

### Base Cycle
- **7-day reward cycle**
- Player must claim **7 rewards within 10 days**
- Missing a day does **not** reset progress
- Cycle restarts after Day 7 is claimed

### Reward Buckets

#### A. Legacy Tokens
Primary non-power currency used in the Legacy Shop.

Use cases:
- Cosmetics
- Club identity unlocks
- Seasonal collectibles
- Profile prestige items

#### B. Cosmetics
- Profile frames
- Team banners
- Match intro flair
- Trade success animation variants
- Cup win confetti variants
- Tower UI skins
- Badge borders

#### C. Club Identity Rewards
- Manager titles
- Team motto plates
- Club crest accents
- Stadium atmosphere themes
- Fan reaction themes
- Commentary tone packs

#### D. Presentation Rewards
- Enhanced match report themes
- Graph skins
- Timeline skins
- Record book styles

Important:
- These must change presentation only, not reveal exclusive decision-making information.

#### E. QoL Luxury Rewards
Only valid if baseline functionality already feels complete.

Examples:
- +1 experimental lineup slot
- +1 favorite tactic pin
- +1 extra cosmetic loadout slot
- +1 archive tab in trophy/history views

These must be luxuries, not necessities.

### Day 7 Reward
- **Enhanced Choice Pack**

Player chooses one:
- Premium cosmetic bundle
- Large Legacy Token bundle
- Club identity unlock bundle
- Presentation theme bundle

No gameplay modifiers. No exclusive information.

---

## 7. Sample Reward Calendar

### Example 7-Day Cycle
1. **50 Legacy Tokens**
2. **Profile Frame - Neon Captain**
3. **75 Legacy Tokens**
4. **Team Banner - League Pulse**
5. **100 Legacy Tokens**
6. **Season Collectible - April Tower Stamp**
7. **Enhanced Choice Pack**

### Example Choice Pack Contents
- **Choice A:** Rare profile frame + badge border
- **Choice B:** 250 Legacy Tokens
- **Choice C:** Club identity set (title + motto plate + fan theme)
- **Choice D:** Match report presentation pack

---

## 8. Legacy Token Economy

### Purpose
Legacy Tokens make daily check-in progress persistent and meaningful across weeks, not just a one-click claim loop.

### Currency Role
Legacy Tokens are the main **zero-power retention currency**.

They exist to:
- create continuity between daily check-ins
- give cosmetic rewards long-term value
- support future monetization through fair cosmetic sinks

They must **not** become:
- a hidden power currency
- a shortcut to stronger competitive decisions
- a way to buy better outcomes

### Weekly Earning Target
Recommended baseline from the 7-day check-in cycle:
- **225-300 Legacy Tokens per week**

This is enough to:
- buy small cosmetic items regularly
- save toward larger showcase rewards over multiple weeks

### Economy Feel Target
The target emotional cadence should be:
- **weekly**: “I can afford something small”
- **2-4 weeks**: “I can save for a premium identity item”
- **seasonally**: “I can complete a themed collection or club presentation set”

### Token Sinks
- Seasonal cosmetics
- Archived prior-season cosmetics
- Club identity items
- Trophy cabinet decoration pieces
- Match presentation packs
- Tower/Cup themed UI skins

### Suggested Pricing Bands

#### Common
- `75-125` tokens
- examples:
  - badge border
  - simple profile frame
  - small commentary flavor pack

#### Uncommon
- `150-250` tokens
- examples:
  - team banner
  - match report theme
  - fan reaction theme

#### Rare
- `300-450` tokens
- examples:
  - scoreboard skin
  - tower style pack
  - cup bracket frame

#### Prestige / Showcase
- `500-800` tokens
- examples:
  - trophy cabinet style bundle
  - full club identity set
  - animated presentation theme

### Shop Rules
- Rotating featured items
- Seasonal theme sets
- Older items can return later
- Avoid hard FOMO and permanent lockout
- Premium-looking items should require multiple days of play, but not extreme grinding

### Rotation Philosophy
- Rotation creates freshness
- Return windows preserve fairness
- Variants can keep older themes relevant without devaluing early ownership

### Recommended Shop Structure
- **Featured Rotation**: `4-6` items refreshed weekly
- **Seasonal Shelf**: current season theme items available the whole season
- **Legacy Archive**: older items return later; no permanent lockout pressure

---

## 9. Club Identity System

### Purpose
Turn the club into something the player feels ownership over, without changing gameplay.

### Customization Categories
- Club banner style
- Motto / tagline plate
- Fan culture theme
- Commentary tone pack
- Stadium atmosphere theme
- Team intro card style
- Trophy cabinet styling

### Why It Matters
- High attachment
- Strong retention value
- Strong cosmetic monetization runway
- Distinctive club personality without balance risk

---

## 10. Integration with Existing Systems

### League
- League-themed banners, badges, and title plates
- Season champion collectibles
- Division-themed cosmetic variants

### Tower
- Monthly tower stamps
- Level-climb visual themes
- Tower-specific card borders
- Seasonal tower skins in the shop

### Cup
- Cup-themed podium effects
- Trophy shine variants
- Bracket frame cosmetics

### Seasonal Themes
Each season/month can have a lightweight visual theme:
- Tower Rush
- Cup Fever
- Monsoon Cricket
- Future Legends

This makes login rewards feel embedded in the game's world.

---

## 11. UX / UI Design

### Primary Surface
- **Dashboard check-in card**

Requirements:
- Visible, but not blocking
- One-tap claim
- Shows current day progress
- Shows next reward preview

### Secondary Surfaces
- More/Settings → Legacy Shop
- Profile → Club Identity customization
- Trophy / Collection area for seasonal collectibles

### Mobile UX
- Compact horizontal 7-day strip or card carousel
- Large claim button
- Lightweight reward reveal animation
- Avoid modal fatigue on every login

### Web UX
- Slightly wider calendar strip
- Hover previews for future rewards
- Shop grid with filters by theme and rarity

### Reward Reveal
Use a short celebratory moment:
- Token burst
- Cosmetic card flip
- Themed particles

Keep it under 2-3 seconds and skippable.

---

## 12. Data Model

### New Table: `DailyCheckInProgress`
```prisma
model DailyCheckInProgress {
  id                String   @id @default(uuid())
  userId            String   @unique
  cycleStartDate    DateTime
  currentDay        Int      @default(1) // 1-7
  claimsInCycle     Int      @default(0)
  graceWindowDays   Int      @default(10)
  lastClaimedAt     DateTime?
  cycleNumber       Int      @default(1)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### New Table: `LegacyWallet`
```prisma
model LegacyWallet {
  id          String   @id @default(uuid())
  userId      String   @unique
  balance     Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### New Table: `LegacyTransaction`
```prisma
model LegacyTransaction {
  id          String   @id @default(uuid())
  userId      String
  amount      Int
  type        String   // CHECK_IN_REWARD, SHOP_PURCHASE, ADMIN_GRANT
  source      String   // day1, day7_choice, shop_refund, etc.
  metadata    Json?
  createdAt   DateTime @default(now())
}
```

### New Table: `LegacyShopItem`
```prisma
model LegacyShopItem {
  id              String   @id @default(uuid())
  seasonKey       String   // "2026-04"
  category        String   // banner, frame, title, theme, collectible
  name            String
  description     String
  price           Int
  rarity          String   // common, rare, epic
  isFeatured      Boolean  @default(false)
  returnable      Boolean  @default(true)
  assetKey        String
  availableFrom   DateTime
  availableUntil  DateTime
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### New Table: `UserLegacyUnlock`
```prisma
model UserLegacyUnlock {
  id          String   @id @default(uuid())
  userId      String
  itemId      String
  source      String   // SHOP, CHECK_IN_CHOICE, SEASON_GIFT
  equipped    Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

### Optional Table: `SeasonCollectible`
```prisma
model SeasonCollectible {
  id          String   @id @default(uuid())
  userId      String
  seasonKey   String
  collectibleKey String
  source      String
  createdAt   DateTime @default(now())
}
```

---

## 13. API Endpoints

### GET `/legacy/check-in`
Returns current check-in state and today's claim availability.

```json
{
  "ok": true,
  "checkIn": {
    "currentDay": 4,
    "claimsInCycle": 3,
    "canClaimToday": true,
    "lastClaimedAt": "2026-04-24T07:00:00Z",
    "graceWindowEndsAt": "2026-05-01T00:00:00Z",
    "rewards": [
      { "day": 1, "type": "TOKENS", "amount": 50, "claimed": true },
      { "day": 2, "type": "COSMETIC", "itemKey": "frame_neon_captain", "claimed": true },
      { "day": 3, "type": "TOKENS", "amount": 75, "claimed": true },
      { "day": 4, "type": "COSMETIC", "itemKey": "banner_league_pulse", "claimed": false }
    ]
  },
  "wallet": {
    "balance": 225
  }
}
```

### POST `/legacy/check-in/claim`
Claims today's reward and advances progress.

```json
{
  "ok": true,
  "claimedReward": {
    "day": 4,
    "type": "COSMETIC",
    "itemKey": "banner_league_pulse"
  },
  "wallet": {
    "balance": 225
  },
  "nextDay": 5
}
```

### POST `/legacy/check-in/day7-choice`
Resolves the Day 7 Enhanced Choice Pack.

```json
{
  "choiceKey": "club_identity_bundle_alpha"
}
```

### GET `/legacy/shop`
Returns current shop inventory, featured items, and season theme.

### POST `/legacy/shop/purchase`
Purchases a shop item with Legacy Tokens.

### GET `/legacy/unlocks`
Returns owned cosmetics, identity items, and presentation themes.

### POST `/legacy/equip`
Equips an owned item.

### GET `/legacy/collection`
Returns season collectibles, titles, badges, and trophy cabinet pieces.

---

## 14. Backend Rules

### Claim Eligibility
- One claim per calendar day in the user's local timezone
- Prevent duplicate claims
- If the cycle expires after the grace window, reset progress to Day 1
- Day 7 is not complete until the player resolves the choice pack

### Duplicate Protection
If a player earns an item they already own:
- Convert to Legacy Tokens, or
- Award a same-rarity fallback item

Recommended v1 behavior:
- Convert duplicates to Legacy Tokens for simplicity

### Timezone Handling
- Use user locale if available
- Else use server-configured default
- Persist claim timestamps in UTC

---

## 15. UI Content Rules

### Allowed Presentation Upgrades
- Alternate report skins
- Alternate graph treatments
- Commentary voice/tone flavor
- Timeline themes
- Club intro card styles

### Not Allowed
- Recommended lineup hints
- Highlighted best swap option
- Hidden-trait reveal cards
- Predicted win chance bonuses
- Opponent weakness callouts

### Tone
- Premium
- celebratory
- lightly futuristic
- club-focused

Should fit **Cricket Rivals** rather than feel like a casino reward loop.

---

## 16. Analytics and Success Metrics

### Core KPIs
- Daily claim rate
- 7-day cycle completion rate
- Legacy Token spend rate
- Shop conversion by category
- D1/D7/D30 retention lift after release
- Average number of owned cosmetic/identity items per player

### Diagnostic Metrics
- % of players who ignore the feature after first week
- % of players selecting each Day 7 choice
- % of inventory purchased by theme
- Duplicate reward frequency

### Success Criteria
- Increase weekly return frequency without harming fairness sentiment
- Legacy Tokens feel desirable, not disposable
- Cosmetic ownership rises steadily across active players

---

## 17. Rollout Plan

### Important Reality
This is a **larger foundational system**, not a lightweight UI feature.

The game currently has only early groundwork for cosmetics/presentation rewards, so shipping this cleanly will require new supporting systems rather than only a check-in card.

Systems likely needed before or during rollout:
- cosmetic inventory / entitlement storage
- reward catalog
- token wallet + transaction history
- shop rotation logic
- item preview / equip flow
- seasonal collectible persistence
- reward grant and duplicate-conversion rules

### Minimum Viable V1
To avoid overbuilding, the best first version is:
- Legacy Tokens
- daily claim progress
- small cosmetic/presentation catalog
- simple Legacy Shop
- Day 7 choice pack

Do **not** try to launch with every cosmetic category at once.

### Phase 1 - Foundation
- Daily check-in card
- 7-day forgiving cycle
- Legacy Wallet
- Legacy Tokens
- Basic cosmetic rewards
- Day 7 choice pack

### Phase 2 - Legacy Shop
- Seasonal shop rotation
- Featured items
- Club identity unlocks
- Collection view

### Phase 3 - System Integration
- Tower-themed rewards
- Cup-themed rewards
- Seasonal collectible album
- Trophy cabinet styling

### Phase 4 - Sponsor Reward Layer
- Optional sponsored claim bonus
- Extra Legacy Tokens or cosmetic fragments only
- Rewarded-ad analytics
- No gameplay-impacting bonus outcomes

---

## 18. Content Recommendations for V1

### Launch Theme
- **Founding Club Season**

### Suggested Initial Reward Pool
- 3 profile frames
- 3 team banners
- 2 badge borders
- 2 commentary tone packs
- 2 match report themes
- 4 manager titles
- 1 season collectible set

### Suggested Shop Categories at Launch
- Featured
- Club Identity
- Match Presentation
- Tower Theme
- Seasonal Archive

### Launch Scope Recommendation
Because cosmetic infrastructure is still early, the launch catalog should stay intentionally tight:
- `3-5` profile/frame items
- `3-4` banner / badge items
- `2-3` presentation themes
- `1` tower mini-set
- `1` cup mini-set
- `1` seasonal collectible set

This is enough to make the system feel real without creating a large content burden too early.

---

## 19. Risks

### Risk: Cosmetic rewards feel too weak
Mitigation:
- Use strong visual quality
- Add club identity depth
- Make Day 7 choice feel premium

### Risk: Legacy Tokens feel like filler currency
Mitigation:
- Provide compelling token sinks
- Rotate meaningful items
- Surface token value clearly in the shop

### Risk: Insight rewards creep into power
Mitigation:
- Use the guardrails in Section 4 as release blockers
- Review every new reward against the rule:
  - **Does this improve outcomes through better decisions?**

### Risk: Daily login feels too generic
Mitigation:
- Theme rewards around Tower, Cup, and seasons
- Add world flavor and club identity

---

## 20. Final Recommendation

Ship the daily login system as a **club identity and prestige layer**, not a progression shortcut.

The winning formula for this project is:
- **Cosmetics**
- **Legacy Tokens**
- **Seasonal shop**
- **Forgiving 7-day cycle**
- **Day 7 choice pack**
- **Strong integration with Tower, Cup, and club fantasy**

The system will stay healthy long-term if the team protects one rule above all others:

**No exclusive decision-making advantage.**

### Connection to Monetization Roadmap
This system should support the monetization plan in [MONETIZATION_ROADMAP.md](../roadmaps/MONETIZATION_ROADMAP.md), not bypass it.

Its role is to be a:
- retention bridge
- cosmetic currency source
- future sponsor-reward anchor

It should **not** become:
- a disguised power ladder
- a source of premium-only strategic information
- a shortcut around the fair-play economy

---

**Created:** 2026-04-24  
**Status:** Product Spec / Design Doc  
**Recommended Version Target:** Post-v0.23.0 planning
