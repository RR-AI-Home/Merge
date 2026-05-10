# Monetization Foundation Implementation Plan

> **Status:** Active implementation-prep brief for the first monetization build slice.
>
> **Depends on:**
> - [../roadmaps/MONETIZATION_ROADMAP.md](../roadmaps/MONETIZATION_ROADMAP.md)
> - [../roadmaps/MONETIZATION_FOUNDATION_PLAN.md](../roadmaps/MONETIZATION_FOUNDATION_PLAN.md)
> - [./PREMIUM_COSMETIC_SKU_PLAN.md](./PREMIUM_COSMETIC_SKU_PLAN.md)

---

## 1. Purpose

Turn the monetization roadmap's first implementation slice into a concrete build plan.

This brief covers:
- backend schema/model targets
- API contract targets
- client surface targets
- analytics targets
- rollout order
- explicit out-of-scope boundaries

This brief is for the first slice only:
- cosmetics/themes
- entitlements
- equip state
- preview/read flows
- preview/equip analytics

---

## 2. V1 Slice Summary

### Build Goal
Prove that cosmetic items can be:
- defined in one shared catalog
- granted to users through one shared ownership model
- previewed consistently
- equipped by slot family
- rendered across web and mobile from the same backend state

### Product Goal
Give the game a real cosmetic foundation before adding:
- token spend loops
- sponsor reward loops
- real-money offers
- subscription logic

### Out of Scope
- rewarded ads
- Daily Login claim mechanics
- token purchases/spends
- shop checkout
- premium tier
- gameplay-impacting rewards

---

## 3. Backend Build Plan

### 3A. First-Pass Models

#### `CatalogItem`
Source of truth for cosmetic entries.

Minimum fields:
- `id`
- `key`
- `name`
- `description`
- `category`
- `slotFamily`
- `rarity`
- `themeKey`
- `assetKey`
- `previewAssetKey`
- `isActive`
- `isPreviewable`
- `createdAt`
- `updatedAt`

#### `UserEntitlement`
Ownership record for a granted/unlocked cosmetic item.

Minimum fields:
- `id`
- `userId`
- `catalogItemId`
- `source`
- `sourceRef`
- `grantedAt`
- `expiresAt`
- `metadata`

#### `UserEquipState`
Current equipped item per slot family for a user.

Minimum fields:
- `id`
- `userId`
- `slotFamily`
- `catalogItemId`
- `equippedAt`
- `updatedAt`

#### Optional `RewardGrantLog`
Debug/audit helper for local/admin grants during rollout.

Minimum fields:
- `id`
- `userId`
- `catalogItemId`
- `source`
- `sourceRef`
- `grantedAt`
- `metadata`

### 3B. Model Rules
- `CatalogItem.key` must be unique.
- `UserEntitlement` should allow multiple rows over time only if time-limited items ever exist later.
- `UserEquipState` must enforce one equipped item per `userId + slotFamily`.
- Equipping must fail if the user does not own the item.
- Catalog rows must remain usable by both future rewards and future shop surfaces.

### 3C. Seed/Content Strategy
- add a small seed catalog for local/dev verification
- keep starter content intentionally tiny
- use stable `key` values that can survive asset iteration

Recommended starter catalog:
- `3` profile frames
- `3` badge borders
- `2` team banners
- `2` manager-title or motto items
- `2` report/result themes

---

## 4. API Build Plan

### 4A. First-Pass Read APIs

#### `GET /legacy/catalog`
Purpose:
- return active catalog items for preview/browse

Minimum response shape:
- `items[]`
- each item includes:
  - `key`
  - `name`
  - `description`
  - `category`
  - `slotFamily`
  - `rarity`
  - `themeKey`
  - `assetKey`
  - `previewAssetKey`
  - `owned`
  - `equipped`

#### `GET /legacy/catalog/preview/:key`
Purpose:
- return one item plus preview metadata

Useful for:
- detail drawer/modal
- locked-item preview state
- future shop page reuse

#### `GET /legacy/unlocks`
Purpose:
- return owned items plus equip state grouped by slot family

Minimum response shape:
- `ownedItems[]`
- `equippedBySlot`
- `availableSlots[]`

### 4B. First-Pass Write APIs

#### `POST /legacy/equip`
Purpose:
- equip one owned item into its slot family

Request:
```json
{
  "itemKey": "frame_founding_neon"
}
```

Rules:
- validate ownership
- infer slot family from catalog item
- unequip prior item in same slot
- return updated equip state

#### `POST /legacy/grants/dev`
Purpose:
- local/admin-only helper to grant starter cosmetics during development

Rules:
- non-production only
- authenticated/admin or clearly dev-gated
- log grants to `RewardGrantLog` if implemented

### 4C. APIs Explicitly Deferred
- `POST /legacy/shop/purchase`
- `GET /legacy/wallet`
- `POST /legacy/check-in/claim`
- sponsor/ad reward endpoints
- premium checkout endpoints

---

## 5. Client Build Plan

### 5A. First Web/Mobile Surfaces

#### `More/Profile`
Purpose:
- entry point into club identity / owned cosmetics

Requirements:
- visible navigation affordance
- current equipped summary
- zero purchase pressure

#### `Club Identity / Owned Items`
Purpose:
- main V1 management surface

Requirements:
- filter by slot family/category
- show owned vs locked state
- preview selected item
- equip owned item
- clearly show currently equipped item

#### `Presentation Preview Surface`
Purpose:
- prove result/report themes can preview cleanly

Requirements:
- lightweight preview representation for report/result-theme categories
- no need for a full live visual renderer in v1 if static preview metadata is enough

### 5B. UX Rules
- locked items can be previewed but not purchased
- owned items should equip in one action
- slot family should always be visible
- avoid introducing a “shop” tone before purchase flows exist
- prefer “Owned Items” / “Club Identity” wording over “Store” wording in v1

### 5C. Client Surfaces Explicitly Deferred
- full shop grid with pricing
- checkout flow
- reward-claim surfaces
- ad CTA placements
- premium upsell banners

---

## 6. Analytics Build Plan

### Required Events
- `legacy_catalog_viewed`
- `legacy_item_previewed`
- `legacy_item_granted`
- `legacy_item_equipped`
- `legacy_item_unequipped`

### Required Event Properties
- `userId`
- `surface`
- `itemKey`
- `category`
- `slotFamily`
- `rarity`
- `source`
- `wasOwnedBefore`

### Tracking Rules
- `legacy_catalog_viewed`
  Trigger when the owned-items/catalog surface first loads.
- `legacy_item_previewed`
  Trigger when a preview drawer/modal/card becomes active.
- `legacy_item_granted`
  Trigger only when an ownership record is created.
- `legacy_item_equipped`
  Trigger on successful equip write.
- `legacy_item_unequipped`
  Trigger when an equip action replaces or clears a prior item.

### Deferred Analytics
- token balance properties
- purchase conversion
- sponsor reward funnel
- premium offer funnel

---

## 7. Suggested Rollout Order

### Step 1. Backend Schema + Seeds
- add `CatalogItem`
- add `UserEntitlement`
- add `UserEquipState`
- add starter catalog seed path

### Step 2. Read APIs
- ship `/legacy/catalog`
- ship `/legacy/catalog/preview/:key`
- ship `/legacy/unlocks`

### Step 3. Equip Flow
- ship `/legacy/equip`
- enforce ownership + one-item-per-slot rule

### Step 4. Client Surface
- add Club Identity / Owned Items entry point
- render grouped owned/locked items
- wire preview and equip

### Step 5. Analytics
- emit catalog/preview/equip events
- verify event payload consistency

### Step 6. Dev Grant Tooling
- add local/dev grant helper for testing owned-state transitions

---

## 8. Risks and Guardrails

### Risk: V1 grows into a partial shop
Guardrail:
- no pricing UI
- no purchase CTA
- no wallet UI

### Risk: Equip rules become inconsistent across clients
Guardrail:
- backend remains the source of truth for slot-family validation
- return equip state from the write endpoint

### Risk: Cosmetic slots are too broad too early
Guardrail:
- keep starter set narrow
- prove 4-5 slot families before expanding

### Risk: Presentation themes become expensive to render
Guardrail:
- use metadata/static previews first
- do not block the slice on full live preview rendering

---

## 9. Acceptance Criteria

This build plan is ready for implementation when:
- backend models are named and scoped
- first-pass API list is fixed
- client surfaces are named
- analytics contract is fixed
- rollout order is fixed
- out-of-scope boundaries are explicit

Implementation of the slice will be considered complete when:
- seeded catalog items can be fetched
- owned items can be granted
- owned items can be equipped by slot
- equip state persists and reloads correctly
- web/mobile surfaces can preview and equip items
- analytics fire for catalog view, preview, grant, and equip

---

## 10. Recommendation

Build this slice as “club identity infrastructure,” not as “monetization UI.”

If the first pass feels like:
- owned cosmetics
- clean previews
- instant equip
- reliable shared state

then the project will be ready to layer on:
- token economy
- daily login rewards
- sponsor rewards
- premium cosmetics

without needing to rebuild the foundation.
