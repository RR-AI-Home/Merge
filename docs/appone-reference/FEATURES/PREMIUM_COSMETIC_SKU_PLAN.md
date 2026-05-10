# Premium and Cosmetic SKU Structure Plan

> **Status:** Active planning slice for Phase 1 Week 12.5.
>
> **Depends on:**
> - [../roadmaps/MONETIZATION_FOUNDATION_PLAN.md](../roadmaps/MONETIZATION_FOUNDATION_PLAN.md)
> - [../roadmaps/MONETIZATION_ROADMAP.md](../roadmaps/MONETIZATION_ROADMAP.md)
> - [./DAILY_LOGIN_SYSTEM_SPEC.md](./DAILY_LOGIN_SYSTEM_SPEC.md)
> - [./DAILY_LOGIN_SPONSOR_REWARD_PLAN.md](./DAILY_LOGIN_SPONSOR_REWARD_PLAN.md)
> - [./TOWER_REWARDED_AD_PLAN.md](./TOWER_REWARDED_AD_PLAN.md)
> - [./CHALLENGE_REWARDED_AD_PLAN.md](./CHALLENGE_REWARDED_AD_PLAN.md)

---

## 1. Purpose

Define how cosmetic items and future premium offers should be grouped, priced, surfaced, and owned in a zero-power economy.

This plan covers:
- SKU families
- pricing bands
- bundle logic
- shop structure
- premium offer boundaries
- content rollout recommendations

It does **not** authorize implementation yet.

---

## 2. Product Goal

Create a monetization catalog that feels:
- premium
- collectible
- identity-driven
- fair

The player should feel:
- “I want this because it makes my club feel more like mine.”

Never:
- “I need this to compete.”

---

## 3. Non-Negotiable Rules

### Zero-Power Commerce Rules
No SKU may include:
- stat boosts
- training boosts
- morale boosts
- scouting upgrades
- hidden insights
- extra attempts
- better youth outcomes
- match outcome protection
- improved swap or trade quality

### Premium Safety Rule
Premium offers may improve:
- expression
- customization
- presentation
- collection depth

Premium offers may not improve:
- decision quality
- progression fairness
- competitive outcomes

---

## 4. SKU Families

Define clear SKU families so players understand what they are buying or unlocking.

### A. Single Cosmetic SKU
One item, one slot.

Examples:
- profile frame
- badge border
- team banner
- manager title
- motto plate

Best use:
- Legacy Shop
- daily/login choice rewards
- low-friction premium offers

### B. Presentation SKU
One presentation-layer item or style pack.

Examples:
- match report theme
- result modal theme
- replay frame
- scoreboard skin
- cup bracket frame

Best use:
- Legacy Shop
- premium cosmetic shelves

### C. Mini Bundle SKU
Small curated set of related items.

Examples:
- banner + badge border
- frame + title
- Tower result theme + Tower badge border
- Cup frame + trophy shine theme

Best use:
- featured offers
- Day 7 choice rewards
- starter premium bundles

### D. Club Identity Bundle SKU
Club-expression bundle centered on a theme.

Examples:
- club banner
- motto plate
- manager title
- fan reaction theme
- commentary tone pack

Best use:
- premium featured offers
- higher-value token sinks

### E. Seasonal Showcase Bundle SKU
High-visibility themed collection tied to a season or event.

Examples:
- season frame
- banner
- Tower theme
- Cup bracket frame
- season collectible
- trophy room accent

Best use:
- seasonal shelf
- showcase offers

### F. Reward-Only Cosmetic SKU
Not purchasable directly.

Examples:
- daily check-in exclusive cosmetic
- admin event grant
- season gift collectible

Best use:
- retention systems
- event programs

---

## 5. Slot and Ownership Structure

Each SKU must map to a clear ownership slot family.

### Core V1 Slot Families
- `profile_frame`
- `badge_border`
- `team_banner`
- `manager_title`
- `motto_plate`
- `report_theme`
- `result_theme`

### Near-Term V2 Slot Families
- `tower_theme`
- `cup_theme`
- `commentary_pack`
- `fan_reaction_theme`
- `trophy_room_item`

### Ownership Rule
- one SKU can unlock one or many slot items
- one item can belong to one slot family only
- bundles grant multiple owned items, not one opaque “bundle state”

This keeps equips, previews, and duplicates simple.

---

## 6. Pricing Structure

### Token Pricing Bands
Use the Daily Login / Legacy economy as the base.

#### Common
- `75-125` Legacy Tokens
- examples:
  - simple frame
  - simple border
  - title

#### Uncommon
- `150-250`
- examples:
  - banner
  - report theme
  - result theme

#### Rare
- `300-450`
- examples:
  - Tower mini-theme
  - Cup frame
  - identity mini-bundle

#### Showcase
- `500-800`
- examples:
  - seasonal bundle
  - club identity bundle
  - animated or multi-item presentation set

### Real-Money Planning Bands
Do not finalize store pricing yet, but plan for sensible tiers:

- `Low`:
  - single premium cosmetic
  - equivalent to impulse purchase
- `Mid`:
  - mini bundle
  - event presentation pack
- `High`:
  - seasonal showcase bundle
  - larger identity set

Exact store pricing should be decided later with platform fees, localization, and analytics in mind.

---

## 7. Shop Structure

The shop should feel curated, not cluttered.

### A. Featured Shelf
- `4-6` items or bundles
- refreshed weekly
- mix of token and premium items later

### B. Seasonal Shelf
- current season identity items
- current Cup/Tower themed items
- visible all season

### C. Club Identity Shelf
- banners
- titles
- motto plates
- fan/culture items

### D. Presentation Shelf
- report themes
- result themes
- scoreboard skins

### E. Archive Shelf
- older items returning over time
- avoids hard FOMO

### Shop Rule
Do not flood v1 with too many categories. A small, intentional shop will feel stronger than a thin oversized one.

---

## 8. Premium Offer Rules

### Good Premium Offer Types
- seasonal cosmetic bundle
- club identity bundle
- profile customization pack
- Tower or Cup presentation pack
- archive unlock bundle

### Bad Premium Offer Types
- convenience disguised as power
- insight/report upgrades that improve decisions
- extra challenge/tower capacity
- better swap, scouting, or youth outcomes

### Premium Offer Tone
Offers should read as:
- `club style`
- `presentation upgrade`
- `identity pack`

Not:
- `progress faster`
- `play more`
- `gain advantage`

---

## 9. Reward and Purchase Coexistence

The economy should support both earned and premium cosmetics without confusion.

### Rule
Some categories can exist in both:
- earned via Legacy Tokens
- granted via login/events
- sold as premium bundles

But each specific item should have a clear acquisition path at a given moment.

### Examples
- token shop item
- reward-only check-in item
- premium seasonal bundle item

### Duplication Rule
If a premium user later receives a duplicate item from a reward source:
- convert duplicate to Legacy Tokens in v1

---

## 10. Content Rollout Recommendation

### V1 Catalog
Keep it small and polished.

Recommended launch pool:
- `3-5` frames
- `3-4` banners / borders
- `2-3` presentation themes
- `3-4` titles / motto items
- `1` Tower mini-set
- `1` Cup mini-set
- `1` seasonal collectible set

### V1 Premium-Ready Bundles
Plan, but do not implement yet:
- `Founding Club Pack`
- `Tower Ascent Pack`
- `Cup Night Pack`

### V2 Expansion
- trophy room items
- richer club identity sets
- commentary tone packs
- stadium atmosphere themes

---

## 11. Analytics Requirements

### Required Events
- `sku_viewed`
- `sku_previewed`
- `sku_bundle_opened`
- `sku_purchase_attempted`
- `sku_purchase_completed`
- `sku_purchase_failed`
- `sku_granted`
- `sku_equipped`

### Required Properties
- `userId`
- `skuKey`
- `skuFamily`
- `category`
- `rarity`
- `seasonKey`
- `currencyType`
- `price`
- `source`
- `surface`
- `isAdmin`

### Success Metrics
- preview-to-purchase rate
- token spend by category
- bundle pickup rate
- owned-item distribution
- equip rate after unlock

---

## 12. Backend / Catalog Planning

The future catalog should support:
- single-item SKU
- multi-item bundle SKU
- reward-only item
- premium-only item
- token-only item

### Suggested SKU Fields
- `skuKey`
- `family`
- `currencyType`
- `price`
- `contents[]`
- `seasonKey`
- `themeKey`
- `isRewardOnly`
- `isPremiumOnly`
- `isTokenEligible`
- `isFeatured`
- `startAt`
- `endAt`

### Currency Types
- `LEGACY_TOKEN`
- `PREMIUM_CURRENCY` later if needed
- `REAL_MONEY`
- `NONE` for grant-only items

---

## 13. Readability and UX Guardrails

Cosmetics must not make the game harder to read.

### Required Reviews
- result theme readability
- scoreboard readability
- Cup bracket clarity
- Tower result clarity
- contrast and motion review

### Rule
If a cosmetic makes gameplay information harder to read, it should not ship.

---

## 14. Acceptance Criteria

This planning slice is complete when:
- SKU families are defined
- bundle layers are defined
- pricing bands are defined
- shop structure is defined
- premium offer boundaries are explicit
- rollout recommendations are documented

---

## 15. Recommendation

The best monetization catalog for this game is:
- small
- premium-looking
- cosmetic-first
- identity-driven
- readable

Start with singles, mini bundles, and one or two identity/showcase bundles. Expand only after the ownership, equip, and shop loop feels strong.
