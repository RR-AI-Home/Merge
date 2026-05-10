# Merge Platform Repo Design

## Purpose

Build a platform repo that can produce separate, unlinked mobile merge games from the same shared merge engine. The goal is not runtime theme switching. The goal is to make the engine strong, reusable, and well tested, then ship new standalone games by placing different theme packages and app shells on top.

Each shipped game should have its own brand, package ID, store listing, save data, analytics stream, liveops schedule, tuning, and player-facing identity. The platform should let those games share core engineering without feeling like shallow reskins.

## Source References

- User-provided merge-game market and design prompt in the planning thread.
- Curated non-cricket-simulation AppOne process references copied to `docs/appone-reference/`.
- Mockups:
  - `docs/mockups/merge-platform-concept.html`
  - `docs/mockups/merge-platform-factory.html`

## Approved Product Direction

The repo is a white-label merge-game factory:

```text
shared merge core + per-game theme pack + app shell = standalone game output
```

The player never sees a theme selector. A theme is selected at build/app level, not at runtime. Each output app is treated as a separate product.

## Architecture

The repo should separate shared systems from per-game content.

Shared packages own:

- merge board rules
- item movement and merge validation
- producer behavior
- energy and cooldown systems
- order and quest resolution
- reward math
- currency handling
- inventory and board pressure rules
- daily reward logic
- event framework
- analytics event schema
- monetization hooks
- persistence contracts
- reusable board and UI primitives
- shared tests and validation tooling

Per-game app shells own:

- app name
- package ID / bundle ID
- app icon and splash assets
- store metadata
- production environment identity
- game-specific analytics destination
- game-specific liveops schedule
- theme package selection

Theme packages own:

- item chains
- producer definitions
- order tables
- reward tables
- world map / meta progression
- story and onboarding copy
- event presentation
- art and audio references
- tuning overrides within allowed ranges
- theme-specific UI skin tokens

## Theme-Pack Boundary

Themes define content, fantasy, tuning, and presentation. Shared packages define rules, systems, and contracts.

A theme may change:

- item names and art
- item-chain depth
- producer names, art, and drop tables
- order flavor and requirements
- reward table values within validated ranges
- world progression structure
- event skinning and copy
- onboarding text
- app store identity
- colors, sounds, and visual treatments

A theme must not rewrite:

- merge validation
- board interaction behavior
- energy math contracts
- purchase handling
- analytics event names
- save-state schema
- producer execution rules
- core order resolution
- app security or persistence behavior

If a theme needs behavior that the engine does not support, that requirement becomes a platform feature request. It should be added to the shared engine deliberately, then validated against all existing completed themes.

## Proposed Folder Shape

```text
apps/
  merge-syndicate/
  merge-kingdom/
  merge-colony/

packages/
  merge-engine/
  economy-engine/
  retention-engine/
  merge-ui/
  analytics/
  monetization/
  theme-contracts/

themes/
  cyber-syndicate/
    theme.config.json
    item-chains.json
    producers.json
    orders.json
    world-map.json
    events.json
    tuning.json
    copy.json
    assets/
  fantasy-kingdom/
  space-colony/
```

## First Prototype Scope

The first build should prove the engine works with one complete playable theme, then prove interchangeability with a very small second theme.

### Prototype Game: Merge Syndicate

Core scope:

- mobile-first app shell
- 6x6 merge board
- drag or tap merge interactions
- one producer with tap limits and cooldown
- 4-6 item chains
- order completion loop
- energy spending and refill
- soft currency rewards
- simple world progress track
- daily reward stub
- event slot stub
- theme config loaded through the same contracts future games will use

### Validation Theme: Merge Kingdom Lite

This should stay intentionally small. It exists to prove the repo can produce a second standalone game without changing engine code.

Validation scope:

- separate temporary app name for validation builds
- separate temporary package identity for validation builds
- alternate theme colors
- 1-2 item chains
- one producer
- alternate copy
- minimal alternate assets

The first success condition is:

```text
Merge Syndicate is playable, then Merge Kingdom Lite can be generated as a separate unlinked app using the same engine without modifying engine code.
```

## Data Flow

```text
App shell
  loads selected theme package
    -> validates theme against theme-contracts
    -> passes theme content into merge-engine and economy-engine
    -> renders via merge-ui
    -> records events through shared analytics
    -> persists save data through shared save schema
```

The engine treats theme content as data. That keeps behavior repeatable, makes themes cheaper to create, and prevents theme-specific logic from leaking into the core.

## Engine Compatibility Rule

Engine updates must keep all previously completed themes working.

Any engine change must run regression validation against every completed theme package. If an engine feature changes a contract, the migration must include:

- contract versioning or compatibility handling
- updates to all completed theme packages that need the new shape
- regression tests proving old themes still boot and play their core loop
- smoke checks for every standalone app output affected by the change

No shipped or completed theme should silently break because a later theme needed new engine behavior.

## Testing Strategy

Testing should cover three layers.

### Engine Tests

- merge validation
- board movement
- item spawning
- producer drops
- producer cooldowns
- order completion
- energy spending and refill
- reward math
- currency updates
- save-state transitions

### Theme Contract Tests

- every theme has valid app metadata
- item chains are reachable
- no impossible orders exist
- producer outputs reference valid items
- rewards reference valid currencies/items
- tuning values stay within allowed ranges
- world-map nodes reference valid unlocks
- copy keys required by the app shell exist

### App Smoke Tests

For each standalone app output:

- app boots
- correct theme loads
- new save starts
- producer can spawn items
- merge loop works
- order can be completed
- energy changes correctly
- save data remains separate from other apps
- package/app identity is correct

## Viability Notes

This approach is viable and strategically strong because the hardest parts of a successful merge game are the shared systems: reward cadence, energy tension, order pacing, inventory pressure, event structure, analytics, and monetization plumbing.

The main risk is creating shallow skins. To avoid that, each theme must define its own progression fantasy, producers, item-chain logic, event presentation, and emotional hook. The engine can be shared, but the theme must feel like a complete game.

## Next Step

After this design is approved, create an implementation plan that starts with the shared contracts and prototype engine slice, then builds Merge Syndicate as the first complete theme.
