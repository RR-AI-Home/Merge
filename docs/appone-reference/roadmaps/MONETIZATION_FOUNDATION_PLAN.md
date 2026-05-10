# Monetization Foundation Plan

> **Status:** Active implementation-prep doc for the monetization sprint.
>
> **Purpose:** Define the shared foundation required before any daily login sponsor rewards, Tower rewarded ads, Challenge post-match rewards, or premium cosmetic offers are implemented.

> **Implementation brief:** Once the foundation scope is agreed, build details move to [FEATURES/MONETIZATION_FOUNDATION_IMPLEMENTATION_PLAN.md](../FEATURES/MONETIZATION_FOUNDATION_IMPLEMENTATION_PLAN.md).

---

## 1. Scope

This document covers the first active monetization-planning slice:
- cosmetic inventory and entitlement model
- reward catalog structure
- theme / cosmetic SKU structure
- ad placement inventory
- analytics and compliance requirements

This document does **not** authorize live monetization implementation yet. It prepares the system shape so later monetization work can be added without reworking fairness rules or content ownership.

---

## 1A. First Build Slice Lock

The first implementation slice is now explicitly limited to:
- cosmetic catalog structure
- user entitlements
- equip state
- preview/read APIs
- owned-items management UI
- analytics for preview/grant/equip behavior

### Not in This Slice
- rewarded ads
- premium subscription
- real-money purchase flow
- Daily Login claim flow
- Tower rewarded reward flow
- Challenge rewarded reward flow
- token spending loop

The point of this slice is to prove ownership and presentation infrastructure first, before any monetized loop sits on top of it.

---

## 2. Non-Negotiable Rules

### Zero-Power Rules
- No purchase, reward, ad claim, token spend, or entitlement may alter:
  - match outcomes
  - player stats
  - morale
  - scouting accuracy
  - training results
  - youth quality
  - challenge / cup / tower access limits
- If an item changes decision quality, it counts as power and is out of scope.

### Safe Reward Families
- themes
- presentation packs
- profile customization
- club identity items
- collectibles
- Legacy Tokens
- cosmetic loadout slots only if baseline UX is already generous

### Unsafe Reward Families
- extra attempts
- extra scouting actions
- better reports
- injury healing
- morale boosts
- rerolls with stronger expected outcomes
- hidden ratings or hidden-opponent intel

---

## 3. Foundation Components

The monetization layer should be built on six shared components:

1. **Catalog**
   A source of truth for every monetizable or rewardable cosmetic item.
2. **Entitlements**
   Ownership records for users who have unlocked or purchased items.
3. **Wallet**
   Legacy Token balance and transaction history.
4. **Equip State**
   Which owned items are currently active on a club/profile/surface.
5. **Placement Rules**
   A whitelist of where monetization may appear in the product.
6. **Analytics**
   Event coverage for previews, claims, equips, and monetization CTAs.

---

## 4. Catalog Model

Use a catalog-first model. Rewards, shop offers, and ad-linked rewards should all point to catalog entries instead of custom one-off payloads.

### Catalog Entity
Recommended logical fields:
- `id`
- `key`
- `category`
- `subCategory`
- `name`
- `description`
- `rarity`
- `seasonKey`
- `themeKey`
- `assetKey`
- `previewAssetKey`
- `grantType`
- `tokenPrice`
- `realMoneySku`
- `isRewardEligible`
- `isShopEligible`
- `isFeatured`
- `availableFrom`
- `availableUntil`
- `returnable`
- `status`

### Recommended Categories
- `profile_frame`
- `badge_border`
- `team_banner`
- `club_theme`
- `stadium_atmosphere`
- `commentary_pack`
- `match_report_theme`
- `result_modal_theme`
- `tower_theme`
- `cup_bracket_theme`
- `trophy_room_item`
- `season_collectible`
- `manager_title`
- `motto_plate`

### Grant Types
- `TOKEN_PURCHASE`
- `CHECK_IN_REWARD`
- `DAY7_CHOICE`
- `SPONSORED_REWARD`
- `PREMIUM_BUNDLE`
- `ADMIN_GRANT`
- `SEASON_GIFT`

---

## 5. Entitlement Model

Entitlements should be simple and permanent by default.

### Ownership Rules
- Unlock once, own permanently unless explicitly time-limited.
- Time-limited items should be rare and clearly labeled.
- Duplicates should convert into Legacy Tokens in v1.

### Recommended Entitlement Fields
- `id`
- `userId`
- `catalogItemId`
- `source`
- `sourceRef`
- `grantedAt`
- `expiresAt`
- `isEquipped`
- `metadata`

### Equip Rules
- Only one equipped item per slot family unless explicitly designed as stackable.
- Equipping should be instant and reversible.
- Equip state must sync across mobile and web.

### Slot Families
- `profile_frame`
- `badge_border`
- `team_banner`
- `club_theme`
- `commentary_pack`
- `report_theme`
- `result_modal_theme`
- `tower_theme`
- `cup_theme`
- `manager_title`
- `motto_plate`

---

## 6. Theme / Cosmetic SKU Structure

The monetization system should not sell isolated assets only. It should support both single items and grouped presentation bundles.

### SKU Levels

#### A. Single Cosmetic
Examples:
- one profile frame
- one badge border
- one team banner

Best for:
- Legacy Shop
- smaller check-in rewards

#### B. Mini Theme Pack
Examples:
- banner + badge border
- result modal + report theme
- tower panel skin + title plate

Best for:
- Day 7 choice packs
- featured shop rotations

#### C. Club Identity Bundle
Examples:
- club theme
- motto plate
- manager title
- fan reaction theme

Best for:
- premium-looking zero-power rewards
- later premium cosmetic bundles

#### D. Seasonal Showcase Bundle
Examples:
- season banner
- profile frame
- tower theme
- cup bracket frame
- collectible stamp

Best for:
- seasonal shelves
- later monetized premium bundles

### Pricing Shape
Use the Daily Login spec as the economy anchor:
- common: `75-125`
- uncommon: `150-250`
- rare: `300-450`
- showcase: `500-800`

Real-money SKU planning should come later, but the catalog should already support:
- single-item purchase
- bundle purchase
- non-purchasable reward-only items

---

## 7. Legacy Token Foundation

Legacy Tokens are the primary non-power retention currency.

### V1 Rules
- One wallet per user
- Full transaction ledger
- Explicit source labels for all grants and spends
- Duplicate cosmetic compensation uses token fallback

### Core Token Sources
- daily check-in
- Day 7 choice bundle
- admin grants
- later sponsor rewards

### Core Token Sinks
- Legacy Shop
- archive items
- seasonal cosmetics
- identity packs

---

## 8. Ad Placement Inventory

Ad placement must be opt-in and whitelisted.

### Approved Future Placements

#### Daily Login
- optional sponsor claim after base reward claim
- reward: extra Legacy Tokens or cosmetic fragments only

#### Tower
- post-win sponsor bonus
- end-of-run sponsor reward
- optional presentation reward chest

#### Challenge
- post-match optional sponsor bonus
- optional cosmetic-token reward
- optional enhanced replay presentation unlock if it uses only public data

### Disallowed Placements
- live match interruption
- tactics / squad editing flow
- cup match prep interruption
- youth intake decisions
- scouting info gating
- injury recovery flow

### Screen Inventory Map
- `Dashboard/Home`: check-in CTA, cosmetic preview CTA
- `Tower`: post-result sponsor CTA
- `Challenge`: post-result sponsor CTA
- `More/Profile`: shop entry, owned items
- `Cup`: cosmetic-only future surface, no ad loop in v1

---

## 9. Analytics Foundation

No monetization surface should ship without baseline event coverage.

### Required Events
- `legacy_checkin_viewed`
- `legacy_checkin_claimed`
- `legacy_day7_choice_viewed`
- `legacy_day7_choice_selected`
- `legacy_shop_viewed`
- `legacy_shop_item_previewed`
- `legacy_shop_purchase_attempted`
- `legacy_shop_purchase_completed`
- `legacy_item_equipped`
- `legacy_item_unequipped`
- `sponsor_reward_offer_viewed`
- `sponsor_reward_started`
- `sponsor_reward_completed`
- `sponsor_reward_dismissed`

### Required Event Properties
- `userId`
- `surface`
- `itemKey`
- `category`
- `rarity`
- `seasonKey`
- `source`
- `tokenBalanceBefore`
- `tokenBalanceAfter`
- `isAdmin`

---

## 10. Compliance and Safety Requirements

### Legal / Store Readiness
Before live monetization:
- Privacy Policy must mention entitlements, virtual currency, optional rewarded ads, and related analytics.
- Terms must explain ownership, non-cash value, and non-transferability of virtual items/currency.
- Account export/delete flow must define what happens to wallets and entitlements.

### Product Safety
- Every monetization reward needs a fairness review.
- Every new cosmetic category needs a readability review.
- No monetization CTA should block normal progression.

---

## 11. Recommended Backend Shape

This is still planning, but the backend should likely evolve toward:
- `LegacyWallet`
- `LegacyTransaction`
- `CatalogItem`
- `UserEntitlement`
- `UserEquipState`
- `FeaturedShopRotation`
- `RewardGrantLog`

### Suggested API Families
- `GET /legacy/wallet`
- `GET /legacy/shop`
- `GET /legacy/unlocks`
- `POST /legacy/shop/purchase`
- `POST /legacy/equip`
- `GET /legacy/catalog/preview/:key`

These should stay shared across mobile and web.

---

## 11A. First-Slice Backend Shape

For the first implementation pass, keep the backend narrower than the full future monetization stack.

### First-Slice Models
- `CatalogItem`
- `UserEntitlement`
- `UserEquipState`
- optional `RewardGrantLog` for grant/debug visibility

### Models Explicitly Deferred
- `LegacyWallet`
- `LegacyTransaction`
- `FeaturedShopRotation`
- sponsor/ad claim state tables

### First-Slice API Families
- `GET /legacy/catalog`
  Returns a shop-ready but read-only catalog payload for eligible cosmetic items.
- `GET /legacy/catalog/preview/:key`
  Returns preview/equip metadata for a single item.
- `GET /legacy/unlocks`
  Returns owned items plus current equip state.
- `POST /legacy/equip`
  Equips one owned item to its slot family and unequips the prior item in that slot.
- `POST /legacy/grants/dev`
  Optional non-production helper for local/admin grant testing only.

### First-Slice API Rules
- no purchase endpoint yet
- no token spend endpoint yet
- no ad-claim endpoint yet
- no premium checkout endpoint yet

---

## 11B. First-Slice Client Surface Plan

The initial client work should prove that cosmetics can be previewed, owned, and equipped without needing a full monetization shop.

### Minimum Web/Mobile Surfaces
- `More/Profile`
  Entry point for Owned Items / Club Identity.
- `Profile / Club Identity`
  Owned items grid, preview state, equip action, current equipped summary.
- `Result / Report Theme Preview`
  Lightweight preview support for presentation-theme categories.

### Surface Goals
- show owned vs locked state clearly
- allow instant equip/unequip for owned items
- keep locked-item UX preview-first, not purchase-first
- make slot families visible so players understand what each item changes

### Surface Explicitly Deferred
- full featured shop
- daily login claim UI
- ad CTA surfaces
- premium upsell surfaces

---

## 11C. First-Slice Analytics Contract

The first implementation slice needs analytics even before purchases or ads exist.

### Required V1 Events
- `legacy_catalog_viewed`
- `legacy_item_previewed`
- `legacy_item_granted`
- `legacy_item_equipped`
- `legacy_item_unequipped`

### Required V1 Properties
- `userId`
- `surface`
- `itemKey`
- `category`
- `slotFamily`
- `rarity`
- `source`
- `wasOwnedBefore`

### Deferred Analytics
- purchase attempts/completions
- token balances before/after
- sponsor reward starts/completions
- premium offer conversions

---

## 12. Content Recommendations for V1

Keep V1 intentionally narrow.

### Initial Cosmetic Set
- `3-5` profile frames
- `3-4` banners / badge borders
- `2-3` report or result themes
- `1` Tower mini-theme
- `1` Cup mini-theme
- `1` season collectible set

### Initial Equipable Slots
- profile frame
- badge border
- team banner
- report theme
- result modal theme

Avoid broader club-theme complexity until the ownership/equip model is proven.

---

## 12A. Recommended First-Slice Content Set

Use a deliberately small set that exercises multiple slot families without creating heavy asset pressure.

### Recommended Starter Set
- `3` profile frames
- `3` badge borders
- `2` team banners
- `2` manager titles or motto plates
- `2` report/result themes

### Why This Set
- enough variety to prove catalog behavior
- enough slot coverage to prove equip rules
- small enough to test readability and preview UX carefully

---

## 13. Dependencies for the Next Monetization Tasks

This foundation plan must exist before:

### Daily Login Sponsor Reward Design
- because sponsor rewards need wallet, reward types, and duplicate handling

### Tower Rewarded-Ad Design
- because Tower rewards need token grant rules and analytics

### Challenge Rewarded-Ad Design
- because Challenge rewards need safe reward categories and placement guardrails

### Premium / Cosmetic SKU Structure
- because premium bundles need catalog and entitlement rules

---

## 14. Acceptance Criteria

This planning slice is complete when:
- cosmetic ownership model is defined
- token wallet and transaction model are defined
- allowed monetization surfaces are explicitly whitelisted
- unsafe monetization surfaces are explicitly banned
- SKU layers are defined for singles, mini packs, identity bundles, and seasonal bundles
- later daily-login and rewarded-ad tasks can reference this doc instead of redefining the foundation

This implementation-prep pass is complete when:
- the first build slice is explicitly documented
- backend model/API scope is narrowed to the first slice
- client surfaces are named for owned-items and equip flows
- analytics for preview/grant/equip are locked
- out-of-scope monetization loops are listed explicitly

---

## 15. Recommendation

Build monetization as a catalog + entitlement system first, not as ad hooks first.

The winning order remains:
1. foundation model
2. daily login sponsor reward
3. Tower rewarded reward
4. Challenge post-match reward
5. premium cosmetic bundles

If the foundation is weak, later monetization will either duplicate logic or drift into unfair reward design.
