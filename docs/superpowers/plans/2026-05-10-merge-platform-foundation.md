# Merge Platform Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first testable foundation for a white-label merge-game platform that can produce separate standalone games from the same shared merge engine.

**Architecture:** Use a dependency-light Node.js monorepo with npm workspaces, shared engine packages, JSON theme packs, and separate app output folders. Theme data flows through `theme-contracts` before it reaches the merge/economy engines, and every completed theme is validated by shared regression scripts.

**Tech Stack:** Node.js ES modules, npm workspaces, built-in `node:test`, JSON theme packs, no external runtime dependencies for the first foundation slice.

---

## Scope Check

This plan implements the platform foundation only. It does not build the final Expo/mobile UI, app store packaging, purchases, backend persistence, or liveops admin tools. Those become later plans after the engine contracts, theme data, and compatibility checks are working.

## File Structure

Create this structure:

```text
apps/
  merge-syndicate/
    app.config.json
    src/appIdentity.js
  merge-kingdom-lite/
    app.config.json
    src/appIdentity.js

packages/
  analytics/src/index.js
  economy-engine/src/index.js
  merge-engine/src/index.js
  monetization/src/index.js
  retention-engine/src/index.js
  theme-contracts/src/index.js

scripts/
  smoke-app.mjs
  validate-all-themes.mjs

tests/
  app-smoke.test.js
  compatibility.test.js
  economy-engine.test.js
  merge-engine.test.js
  producer-engine.test.js
  retention-engine.test.js
  theme-contracts.test.js

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
    assets/README.md
  kingdom-lite/
    theme.config.json
    item-chains.json
    producers.json
    orders.json
    world-map.json
    events.json
    tuning.json
    copy.json
    assets/README.md
```

Responsibility boundaries:

- `theme-contracts` validates theme data and protects engine assumptions.
- `merge-engine` owns board creation, item spawning, producer taps, merge validation, and board mutation.
- `economy-engine` owns energy, currency, order completion, and reward application.
- `retention-engine` owns first daily reward behavior.
- `analytics` emits stable shared event envelopes.
- `monetization` exposes non-pay-to-win product metadata helpers.
- `themes/*` contain data only.
- `apps/*` contain app identity only for this foundation slice.
- `scripts/*` run repeatable validation across all themes/apps.

---

### Task 1: Initialize Workspace Scripts

**Files:**
- Create: `package.json`
- Modify: `README.md`

- [ ] **Step 1: Create root package metadata**

Create `package.json`:

```json
{
  "name": "merge-platform",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "test": "node --test tests/*.test.js",
    "validate:themes": "node scripts/validate-all-themes.mjs",
    "smoke:apps": "node scripts/smoke-app.mjs",
    "verify": "npm test && npm run validate:themes && npm run smoke:apps"
  },
  "engines": {
    "node": ">=20"
  }
}
```

- [ ] **Step 2: Update README with the platform direction**

Replace `README.md` with:

```markdown
# Merge Platform

White-label merge-game platform repo.

The goal is to build one reusable merge engine, then produce separate unlinked themed games from that engine. The player does not switch themes at runtime; each app output has its own identity, save data, analytics stream, and store presence.

## Current Foundation

- Shared packages live under `packages/`.
- Standalone game app shells live under `apps/`.
- Theme data lives under `themes/`.
- Regression scripts validate every completed theme before engine changes are considered safe.

## Commands

```bash
npm test
npm run validate:themes
npm run smoke:apps
npm run verify
```
```

- [ ] **Step 3: Run verification**

Run:

```powershell
npm test
```

Expected: Node reports no tests or exits successfully after no matching tests are found. If Node reports that the `tests` folder is missing, continue; tests are added in Task 2.

- [ ] **Step 4: Commit**

```powershell
git add package.json README.md
git commit -m "chore: initialize merge platform workspace"
```

---

### Task 2: Add Theme Contract Validation

**Files:**
- Create: `packages/theme-contracts/src/index.js`
- Create: `tests/theme-contracts.test.js`

- [ ] **Step 1: Write failing contract tests**

Create `tests/theme-contracts.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateThemeBundle } from '../packages/theme-contracts/src/index.js';

const validTheme = {
  config: {
    id: 'cyber-syndicate',
    displayName: 'Merge Syndicate',
    appId: 'com.mergeplatform.syndicate',
    version: 1,
    board: { width: 6, height: 6 },
    startingState: { energy: 50, coins: 0, premium: 0 }
  },
  itemChains: [
    {
      id: 'chips',
      displayName: 'Signal Chips',
      levels: [
        { id: 'chip_1', level: 1, name: 'Chip I' },
        { id: 'chip_2', level: 2, name: 'Chip II' }
      ]
    }
  ],
  producers: [
    {
      id: 'black_market_crate',
      name: 'Black-Market Crate',
      energyCost: 1,
      tapLimit: 12,
      cooldownSeconds: 300,
      drops: [{ itemId: 'chip_1', weight: 1 }]
    }
  ],
  orders: [
    {
      id: 'signal_scrambler_1',
      title: 'Build a Signal Scrambler',
      requires: [{ itemId: 'chip_2', count: 1 }],
      rewards: { coins: 25, xp: 5 }
    }
  ],
  worldMap: {
    nodes: [
      { id: 'neon_market', title: 'Neon Market', unlocksAfterOrders: 0 }
    ]
  },
  events: {
    slots: [
      { id: 'weekend_cache', title: 'Weekend Cache', type: 'timed_orders' }
    ]
  },
  tuning: {
    energyMax: 50,
    energyRefillSeconds: 120,
    boardSlotsSoftLimit: 29
  },
  copy: {
    onboardingTitle: 'Build the syndicate one merge at a time.',
    producerTapCta: 'Open crate',
    firstOrderCta: 'Complete order'
  }
};

test('validateThemeBundle accepts a complete valid theme', () => {
  const result = validateThemeBundle(validTheme);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test('validateThemeBundle rejects impossible producer drops', () => {
  const invalid = structuredClone(validTheme);
  invalid.producers[0].drops[0].itemId = 'missing_item';

  const result = validateThemeBundle(invalid);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /missing_item/);
});

test('validateThemeBundle rejects orders that require missing items', () => {
  const invalid = structuredClone(validTheme);
  invalid.orders[0].requires[0].itemId = 'ghost_part';

  const result = validateThemeBundle(invalid);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /ghost_part/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- tests/theme-contracts.test.js
```

Expected: FAIL because `packages/theme-contracts/src/index.js` does not exist.

- [ ] **Step 3: Implement theme validation**

Create `packages/theme-contracts/src/index.js`:

```js
function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireObject(value, path, errors) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return false;
  }
  return true;
}

function requireArray(value, path, errors) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${path} must be a non-empty array`);
    return false;
  }
  return true;
}

function requireString(value, path, errors) {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${path} must be a non-empty string`);
  }
}

function requirePositiveNumber(value, path, errors) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    errors.push(`${path} must be a positive number`);
  }
}

export function collectThemeItemIds(itemChains) {
  const ids = new Set();
  for (const chain of itemChains ?? []) {
    for (const level of chain.levels ?? []) {
      ids.add(level.id);
    }
  }
  return ids;
}

export function validateThemeBundle(theme) {
  const errors = [];

  if (!requireObject(theme, 'theme', errors)) {
    return { ok: false, errors };
  }

  if (requireObject(theme.config, 'config', errors)) {
    requireString(theme.config.id, 'config.id', errors);
    requireString(theme.config.displayName, 'config.displayName', errors);
    requireString(theme.config.appId, 'config.appId', errors);
    requirePositiveNumber(theme.config.version, 'config.version', errors);
    if (requireObject(theme.config.board, 'config.board', errors)) {
      requirePositiveNumber(theme.config.board.width, 'config.board.width', errors);
      requirePositiveNumber(theme.config.board.height, 'config.board.height', errors);
    }
    if (requireObject(theme.config.startingState, 'config.startingState', errors)) {
      for (const key of ['energy', 'coins', 'premium']) {
        if (typeof theme.config.startingState[key] !== 'number' || theme.config.startingState[key] < 0) {
          errors.push(`config.startingState.${key} must be a non-negative number`);
        }
      }
    }
  }

  requireArray(theme.itemChains, 'itemChains', errors);
  requireArray(theme.producers, 'producers', errors);
  requireArray(theme.orders, 'orders', errors);
  requireObject(theme.worldMap, 'worldMap', errors);
  requireObject(theme.events, 'events', errors);
  requireObject(theme.tuning, 'tuning', errors);
  requireObject(theme.copy, 'copy', errors);

  const itemIds = collectThemeItemIds(theme.itemChains);

  for (const chain of theme.itemChains ?? []) {
    requireString(chain.id, `itemChains.${chain?.id ?? '<missing>'}.id`, errors);
    requireString(chain.displayName, `itemChains.${chain?.id ?? '<missing>'}.displayName`, errors);
    if (requireArray(chain.levels, `itemChains.${chain?.id ?? '<missing>'}.levels`, errors)) {
      for (const level of chain.levels) {
        requireString(level.id, `itemChains.${chain.id}.levels.id`, errors);
        requirePositiveNumber(level.level, `itemChains.${chain.id}.levels.${level.id}.level`, errors);
        requireString(level.name, `itemChains.${chain.id}.levels.${level.id}.name`, errors);
      }
    }
  }

  for (const producer of theme.producers ?? []) {
    requireString(producer.id, 'producers.id', errors);
    requireString(producer.name, `producers.${producer?.id ?? '<missing>'}.name`, errors);
    requirePositiveNumber(producer.energyCost, `producers.${producer?.id ?? '<missing>'}.energyCost`, errors);
    requirePositiveNumber(producer.tapLimit, `producers.${producer?.id ?? '<missing>'}.tapLimit`, errors);
    requirePositiveNumber(producer.cooldownSeconds, `producers.${producer?.id ?? '<missing>'}.cooldownSeconds`, errors);
    if (requireArray(producer.drops, `producers.${producer?.id ?? '<missing>'}.drops`, errors)) {
      for (const drop of producer.drops) {
        if (!itemIds.has(drop.itemId)) {
          errors.push(`producer ${producer.id} references missing item ${drop.itemId}`);
        }
        requirePositiveNumber(drop.weight, `producers.${producer.id}.drops.${drop.itemId}.weight`, errors);
      }
    }
  }

  for (const order of theme.orders ?? []) {
    requireString(order.id, 'orders.id', errors);
    requireString(order.title, `orders.${order?.id ?? '<missing>'}.title`, errors);
    if (requireArray(order.requires, `orders.${order?.id ?? '<missing>'}.requires`, errors)) {
      for (const requirement of order.requires) {
        if (!itemIds.has(requirement.itemId)) {
          errors.push(`order ${order.id} requires missing item ${requirement.itemId}`);
        }
        requirePositiveNumber(requirement.count, `orders.${order.id}.requires.${requirement.itemId}.count`, errors);
      }
    }
    if (requireObject(order.rewards, `orders.${order?.id ?? '<missing>'}.rewards`, errors)) {
      for (const [key, value] of Object.entries(order.rewards)) {
        if (typeof value !== 'number' || value < 0) {
          errors.push(`orders.${order.id}.rewards.${key} must be a non-negative number`);
        }
      }
    }
  }

  if (theme.worldMap?.nodes) {
    requireArray(theme.worldMap.nodes, 'worldMap.nodes', errors);
  }

  if (theme.events?.slots) {
    requireArray(theme.events.slots, 'events.slots', errors);
  }

  for (const key of ['energyMax', 'energyRefillSeconds', 'boardSlotsSoftLimit']) {
    requirePositiveNumber(theme.tuning?.[key], `tuning.${key}`, errors);
  }

  for (const key of ['onboardingTitle', 'producerTapCta', 'firstOrderCta']) {
    requireString(theme.copy?.[key], `copy.${key}`, errors);
  }

  return { ok: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm test -- tests/theme-contracts.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add packages/theme-contracts/src/index.js tests/theme-contracts.test.js
git commit -m "test: add theme contract validation"
```

---

### Task 3: Add First Theme Bundles

**Files:**
- Create all files under `themes/cyber-syndicate/`
- Create all files under `themes/kingdom-lite/`
- Create: `scripts/validate-all-themes.mjs`
- Create: `tests/compatibility.test.js`

- [ ] **Step 1: Write failing compatibility tests**

Create `tests/compatibility.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateThemeBundle } from '../packages/theme-contracts/src/index.js';

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function loadTheme(themeId) {
  const root = join('themes', themeId);
  return {
    config: await readJson(join(root, 'theme.config.json')),
    itemChains: await readJson(join(root, 'item-chains.json')),
    producers: await readJson(join(root, 'producers.json')),
    orders: await readJson(join(root, 'orders.json')),
    worldMap: await readJson(join(root, 'world-map.json')),
    events: await readJson(join(root, 'events.json')),
    tuning: await readJson(join(root, 'tuning.json')),
    copy: await readJson(join(root, 'copy.json'))
  };
}

test('all foundation themes satisfy the shared theme contract', async () => {
  for (const themeId of ['cyber-syndicate', 'kingdom-lite']) {
    const theme = await loadTheme(themeId);
    const result = validateThemeBundle(theme);
    assert.equal(result.ok, true, `${themeId}: ${result.errors.join(', ')}`);
  }
});

test('foundation themes use separate app identities', async () => {
  const cyber = await loadTheme('cyber-syndicate');
  const kingdom = await loadTheme('kingdom-lite');

  assert.notEqual(cyber.config.id, kingdom.config.id);
  assert.notEqual(cyber.config.displayName, kingdom.config.displayName);
  assert.notEqual(cyber.config.appId, kingdom.config.appId);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- tests/compatibility.test.js
```

Expected: FAIL because theme files do not exist.

- [ ] **Step 3: Create Cyber Syndicate theme files**

Create `themes/cyber-syndicate/theme.config.json`:

```json
{
  "id": "cyber-syndicate",
  "displayName": "Merge Syndicate",
  "appId": "com.mergeplatform.syndicate",
  "version": 1,
  "board": { "width": 6, "height": 6 },
  "startingState": { "energy": 50, "coins": 0, "premium": 0 }
}
```

Create `themes/cyber-syndicate/item-chains.json`:

```json
[
  {
    "id": "chips",
    "displayName": "Signal Chips",
    "levels": [
      { "id": "chip_1", "level": 1, "name": "Chip I" },
      { "id": "chip_2", "level": 2, "name": "Chip II" },
      { "id": "chip_3", "level": 3, "name": "Signal Board" }
    ]
  },
  {
    "id": "wires",
    "displayName": "Wire Kits",
    "levels": [
      { "id": "wire_1", "level": 1, "name": "Loose Wire" },
      { "id": "wire_2", "level": 2, "name": "Cable Bundle" },
      { "id": "wire_3", "level": 3, "name": "Relay Harness" }
    ]
  },
  {
    "id": "drones",
    "displayName": "Drones",
    "levels": [
      { "id": "drone_1", "level": 1, "name": "Drone Shell" },
      { "id": "drone_2", "level": 2, "name": "Scout Drone" }
    ]
  },
  {
    "id": "caches",
    "displayName": "Caches",
    "levels": [
      { "id": "cache_1", "level": 1, "name": "Street Cache" },
      { "id": "cache_2", "level": 2, "name": "Encrypted Cache" }
    ]
  }
]
```

Create `themes/cyber-syndicate/producers.json`:

```json
[
  {
    "id": "black_market_crate",
    "name": "Black-Market Crate",
    "energyCost": 1,
    "tapLimit": 12,
    "cooldownSeconds": 300,
    "drops": [
      { "itemId": "chip_1", "weight": 45 },
      { "itemId": "wire_1", "weight": 35 },
      { "itemId": "drone_1", "weight": 12 },
      { "itemId": "cache_1", "weight": 8 }
    ]
  }
]
```

Create `themes/cyber-syndicate/orders.json`:

```json
[
  {
    "id": "signal_scrambler_1",
    "title": "Build a Signal Scrambler",
    "requires": [
      { "itemId": "chip_2", "count": 1 },
      { "itemId": "wire_2", "count": 1 }
    ],
    "rewards": { "coins": 35, "xp": 8 }
  },
  {
    "id": "drone_network_1",
    "title": "Launch a Scout Drone",
    "requires": [
      { "itemId": "drone_2", "count": 1 }
    ],
    "rewards": { "coins": 55, "xp": 12 }
  }
]
```

Create `themes/cyber-syndicate/world-map.json`:

```json
{
  "nodes": [
    { "id": "neon_market", "title": "Neon Market", "unlocksAfterOrders": 0 },
    { "id": "data_docks", "title": "Data Docks", "unlocksAfterOrders": 2 }
  ]
}
```

Create `themes/cyber-syndicate/events.json`:

```json
{
  "slots": [
    { "id": "weekend_cache", "title": "Weekend Cache", "type": "timed_orders" }
  ]
}
```

Create `themes/cyber-syndicate/tuning.json`:

```json
{
  "energyMax": 50,
  "energyRefillSeconds": 120,
  "boardSlotsSoftLimit": 29
}
```

Create `themes/cyber-syndicate/copy.json`:

```json
{
  "onboardingTitle": "Build the syndicate one merge at a time.",
  "producerTapCta": "Open crate",
  "firstOrderCta": "Complete order"
}
```

Create `themes/cyber-syndicate/assets/README.md`:

```markdown
# Cyber Syndicate Assets

Temporary asset inventory for the foundation slice.

Production art should replace these notes once the engine and theme contracts are stable.
```

- [ ] **Step 4: Create Kingdom Lite validation theme files**

Create `themes/kingdom-lite/theme.config.json`:

```json
{
  "id": "kingdom-lite",
  "displayName": "Merge Kingdom Lite",
  "appId": "com.mergeplatform.kingdomlite",
  "version": 1,
  "board": { "width": 6, "height": 6 },
  "startingState": { "energy": 40, "coins": 0, "premium": 0 }
}
```

Create `themes/kingdom-lite/item-chains.json`:

```json
[
  {
    "id": "wood",
    "displayName": "Woodcraft",
    "levels": [
      { "id": "twig_1", "level": 1, "name": "Twig" },
      { "id": "bundle_2", "level": 2, "name": "Wood Bundle" }
    ]
  },
  {
    "id": "ore",
    "displayName": "Ore",
    "levels": [
      { "id": "ore_1", "level": 1, "name": "Ore Chunk" },
      { "id": "ingot_2", "level": 2, "name": "Iron Ingot" }
    ]
  }
]
```

Create `themes/kingdom-lite/producers.json`:

```json
[
  {
    "id": "village_cart",
    "name": "Village Cart",
    "energyCost": 1,
    "tapLimit": 8,
    "cooldownSeconds": 240,
    "drops": [
      { "itemId": "twig_1", "weight": 60 },
      { "itemId": "ore_1", "weight": 40 }
    ]
  }
]
```

Create `themes/kingdom-lite/orders.json`:

```json
[
  {
    "id": "repair_gate_1",
    "title": "Repair the Village Gate",
    "requires": [
      { "itemId": "bundle_2", "count": 1 },
      { "itemId": "ingot_2", "count": 1 }
    ],
    "rewards": { "coins": 30, "xp": 6 }
  }
]
```

Create `themes/kingdom-lite/world-map.json`:

```json
{
  "nodes": [
    { "id": "village_green", "title": "Village Green", "unlocksAfterOrders": 0 }
  ]
}
```

Create `themes/kingdom-lite/events.json`:

```json
{
  "slots": [
    { "id": "harvest_day", "title": "Harvest Day", "type": "timed_orders" }
  ]
}
```

Create `themes/kingdom-lite/tuning.json`:

```json
{
  "energyMax": 40,
  "energyRefillSeconds": 150,
  "boardSlotsSoftLimit": 27
}
```

Create `themes/kingdom-lite/copy.json`:

```json
{
  "onboardingTitle": "Restore the kingdom one merge at a time.",
  "producerTapCta": "Open cart",
  "firstOrderCta": "Deliver order"
}
```

Create `themes/kingdom-lite/assets/README.md`:

```markdown
# Kingdom Lite Assets

Temporary asset inventory for the validation theme.

This theme exists to prove separate app generation from the shared engine.
```

- [ ] **Step 5: Add theme validation script**

Create `scripts/validate-all-themes.mjs`:

```js
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateThemeBundle } from '../packages/theme-contracts/src/index.js';

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function loadTheme(themeId) {
  const root = join('themes', themeId);
  return {
    config: await readJson(join(root, 'theme.config.json')),
    itemChains: await readJson(join(root, 'item-chains.json')),
    producers: await readJson(join(root, 'producers.json')),
    orders: await readJson(join(root, 'orders.json')),
    worldMap: await readJson(join(root, 'world-map.json')),
    events: await readJson(join(root, 'events.json')),
    tuning: await readJson(join(root, 'tuning.json')),
    copy: await readJson(join(root, 'copy.json'))
  };
}

const themeIds = (await readdir('themes', { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let failed = false;

for (const themeId of themeIds) {
  const theme = await loadTheme(themeId);
  const result = validateThemeBundle(theme);

  if (!result.ok) {
    failed = true;
    console.error(`${themeId} failed validation:`);
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
  } else {
    console.log(`${themeId} passed validation`);
  }
}

if (failed) {
  process.exitCode = 1;
}
```

- [ ] **Step 6: Run tests and validation**

Run:

```powershell
npm test -- tests/compatibility.test.js
npm run validate:themes
```

Expected: both commands PASS and both themes are reported as valid.

- [ ] **Step 7: Commit**

```powershell
git add themes scripts/validate-all-themes.mjs tests/compatibility.test.js
git commit -m "test: add foundation theme bundles"
```

---

### Task 4: Implement Board And Merge Rules

**Files:**
- Create: `packages/merge-engine/src/index.js`
- Create: `tests/merge-engine.test.js`

- [ ] **Step 1: Write failing merge engine tests**

Create `tests/merge-engine.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createBoard,
  getCell,
  placeItem,
  canMergeItems,
  mergeCells,
  countOccupiedSlots
} from '../packages/merge-engine/src/index.js';

const itemChains = [
  {
    id: 'chips',
    displayName: 'Signal Chips',
    levels: [
      { id: 'chip_1', level: 1, name: 'Chip I' },
      { id: 'chip_2', level: 2, name: 'Chip II' },
      { id: 'chip_3', level: 3, name: 'Signal Board' }
    ]
  }
];

test('createBoard creates an empty fixed-size board', () => {
  const board = createBoard({ width: 6, height: 6 });

  assert.equal(board.width, 6);
  assert.equal(board.height, 6);
  assert.equal(board.cells.length, 36);
  assert.equal(countOccupiedSlots(board), 0);
});

test('placeItem stores an item at a board coordinate', () => {
  const board = createBoard({ width: 6, height: 6 });
  const updated = placeItem(board, { x: 1, y: 2 }, { itemId: 'chip_1' });

  assert.deepEqual(getCell(updated, { x: 1, y: 2 }).item, { itemId: 'chip_1' });
  assert.equal(countOccupiedSlots(updated), 1);
});

test('canMergeItems allows matching non-terminal items in the same chain', () => {
  assert.equal(canMergeItems('chip_1', 'chip_1', itemChains), true);
  assert.equal(canMergeItems('chip_2', 'chip_2', itemChains), true);
  assert.equal(canMergeItems('chip_3', 'chip_3', itemChains), false);
  assert.equal(canMergeItems('chip_1', 'chip_2', itemChains), false);
});

test('mergeCells upgrades source and target items into the next chain level', () => {
  let board = createBoard({ width: 6, height: 6 });
  board = placeItem(board, { x: 0, y: 0 }, { itemId: 'chip_1' });
  board = placeItem(board, { x: 1, y: 0 }, { itemId: 'chip_1' });

  const result = mergeCells(board, { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, itemChains);

  assert.equal(result.ok, true);
  assert.equal(getCell(result.board, { x: 0, y: 0 }).item, null);
  assert.deepEqual(getCell(result.board, { x: 1, y: 0 }).item, { itemId: 'chip_2' });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- tests/merge-engine.test.js
```

Expected: FAIL because `packages/merge-engine/src/index.js` does not exist.

- [ ] **Step 3: Implement board and merge functions**

Create `packages/merge-engine/src/index.js`:

```js
function toIndex(board, position) {
  return position.y * board.width + position.x;
}

function assertPosition(board, position) {
  if (
    !Number.isInteger(position.x) ||
    !Number.isInteger(position.y) ||
    position.x < 0 ||
    position.y < 0 ||
    position.x >= board.width ||
    position.y >= board.height
  ) {
    throw new RangeError(`Invalid board position ${JSON.stringify(position)}`);
  }
}

function cloneBoard(board) {
  return {
    ...board,
    cells: board.cells.map((cell) => ({
      ...cell,
      item: cell.item ? { ...cell.item } : null
    }))
  };
}

function findItemLevel(itemId, itemChains) {
  for (const chain of itemChains) {
    const index = chain.levels.findIndex((level) => level.id === itemId);
    if (index !== -1) {
      return { chain, index, level: chain.levels[index] };
    }
  }
  return null;
}

export function createBoard({ width, height }) {
  const cells = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      cells.push({ x, y, item: null });
    }
  }
  return { width, height, cells };
}

export function getCell(board, position) {
  assertPosition(board, position);
  return board.cells[toIndex(board, position)];
}

export function placeItem(board, position, item) {
  assertPosition(board, position);
  const next = cloneBoard(board);
  next.cells[toIndex(next, position)].item = { ...item };
  return next;
}

export function countOccupiedSlots(board) {
  return board.cells.filter((cell) => cell.item !== null).length;
}

export function canMergeItems(sourceItemId, targetItemId, itemChains) {
  if (sourceItemId !== targetItemId) {
    return false;
  }

  const source = findItemLevel(sourceItemId, itemChains);
  if (!source) {
    return false;
  }

  return source.index < source.chain.levels.length - 1;
}

export function getNextItemId(itemId, itemChains) {
  const found = findItemLevel(itemId, itemChains);
  if (!found || found.index >= found.chain.levels.length - 1) {
    return null;
  }
  return found.chain.levels[found.index + 1].id;
}

export function mergeCells(board, move, itemChains) {
  const sourceCell = getCell(board, move.from);
  const targetCell = getCell(board, move.to);

  if (!sourceCell.item || !targetCell.item) {
    return { ok: false, reason: 'both_cells_must_contain_items', board };
  }

  if (!canMergeItems(sourceCell.item.itemId, targetCell.item.itemId, itemChains)) {
    return { ok: false, reason: 'items_cannot_merge', board };
  }

  const nextItemId = getNextItemId(sourceCell.item.itemId, itemChains);
  const next = cloneBoard(board);
  next.cells[toIndex(next, move.from)].item = null;
  next.cells[toIndex(next, move.to)].item = { itemId: nextItemId };

  return { ok: true, board: next, createdItemId: nextItemId };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm test -- tests/merge-engine.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add packages/merge-engine/src/index.js tests/merge-engine.test.js
git commit -m "test: add merge board engine"
```

---

### Task 5: Implement Producer Drops

**Files:**
- Modify: `packages/merge-engine/src/index.js`
- Create: `tests/producer-engine.test.js`

- [ ] **Step 1: Write failing producer tests**

Create `tests/producer-engine.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createBoard,
  getCell,
  tapProducer
} from '../packages/merge-engine/src/index.js';

const producer = {
  id: 'black_market_crate',
  name: 'Black-Market Crate',
  energyCost: 1,
  tapLimit: 2,
  cooldownSeconds: 300,
  drops: [
    { itemId: 'chip_1', weight: 1 },
    { itemId: 'wire_1', weight: 1 }
  ]
};

test('tapProducer places a weighted drop in the first empty cell', () => {
  const board = createBoard({ width: 2, height: 2 });
  const result = tapProducer({
    board,
    producer,
    producerState: { tapsRemaining: 2, cooldownUntil: null },
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.equal(result.energyCost, 1);
  assert.equal(result.producerState.tapsRemaining, 1);
  assert.deepEqual(getCell(result.board, { x: 0, y: 0 }).item, { itemId: 'chip_1' });
});

test('tapProducer rejects a full board', () => {
  let board = createBoard({ width: 1, height: 1 });
  board.cells[0].item = { itemId: 'chip_1' };

  const result = tapProducer({
    board,
    producer,
    producerState: { tapsRemaining: 2, cooldownUntil: null },
    random: () => 0
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'board_full');
});

test('tapProducer starts cooldown when taps are exhausted', () => {
  const board = createBoard({ width: 2, height: 2 });
  const result = tapProducer({
    board,
    producer,
    producerState: { tapsRemaining: 1, cooldownUntil: null },
    nowSeconds: 1000,
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.equal(result.producerState.tapsRemaining, 0);
  assert.equal(result.producerState.cooldownUntil, 1300);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- tests/producer-engine.test.js
```

Expected: FAIL because `tapProducer` is not exported.

- [ ] **Step 3: Add producer helpers**

Append to `packages/merge-engine/src/index.js`:

```js
function firstEmptyCell(board) {
  return board.cells.find((cell) => cell.item === null) ?? null;
}

function pickWeightedDrop(drops, random) {
  const totalWeight = drops.reduce((sum, drop) => sum + drop.weight, 0);
  const roll = random() * totalWeight;
  let cursor = 0;

  for (const drop of drops) {
    cursor += drop.weight;
    if (roll < cursor) {
      return drop;
    }
  }

  return drops[drops.length - 1];
}

export function tapProducer({
  board,
  producer,
  producerState,
  nowSeconds = Math.floor(Date.now() / 1000),
  random = Math.random
}) {
  if (producerState.cooldownUntil && producerState.cooldownUntil > nowSeconds) {
    return { ok: false, reason: 'producer_cooling_down', board, producerState };
  }

  if (producerState.tapsRemaining <= 0) {
    return { ok: false, reason: 'producer_empty', board, producerState };
  }

  const emptyCell = firstEmptyCell(board);
  if (!emptyCell) {
    return { ok: false, reason: 'board_full', board, producerState };
  }

  const drop = pickWeightedDrop(producer.drops, random);
  const nextBoard = placeItem(board, { x: emptyCell.x, y: emptyCell.y }, { itemId: drop.itemId });
  const tapsRemaining = producerState.tapsRemaining - 1;

  return {
    ok: true,
    board: nextBoard,
    droppedItemId: drop.itemId,
    energyCost: producer.energyCost,
    producerState: {
      tapsRemaining,
      cooldownUntil: tapsRemaining === 0 ? nowSeconds + producer.cooldownSeconds : null
    }
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm test -- tests/producer-engine.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add packages/merge-engine/src/index.js tests/producer-engine.test.js
git commit -m "test: add producer drop engine"
```

---

### Task 6: Implement Economy And Order Resolution

**Files:**
- Create: `packages/economy-engine/src/index.js`
- Create: `tests/economy-engine.test.js`

- [ ] **Step 1: Write failing economy tests**

Create `tests/economy-engine.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  spendEnergy,
  refillEnergy,
  canCompleteOrder,
  completeOrder
} from '../packages/economy-engine/src/index.js';

test('spendEnergy subtracts available energy', () => {
  const result = spendEnergy({ energy: 5, coins: 0, premium: 0, xp: 0 }, 2);

  assert.equal(result.ok, true);
  assert.equal(result.state.energy, 3);
});

test('spendEnergy rejects insufficient energy', () => {
  const result = spendEnergy({ energy: 1, coins: 0, premium: 0, xp: 0 }, 2);

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'not_enough_energy');
});

test('refillEnergy restores energy based on elapsed time', () => {
  const state = { energy: 3, coins: 0, premium: 0, xp: 0, lastEnergyAt: 1000 };
  const result = refillEnergy(state, { nowSeconds: 1240, refillSeconds: 120, maxEnergy: 10 });

  assert.equal(result.energy, 5);
  assert.equal(result.lastEnergyAt, 1240);
});

test('completeOrder consumes required items and grants rewards', () => {
  const inventory = { chip_2: 1, wire_2: 1 };
  const state = { energy: 5, coins: 0, premium: 0, xp: 0 };
  const order = {
    id: 'signal_scrambler_1',
    requires: [
      { itemId: 'chip_2', count: 1 },
      { itemId: 'wire_2', count: 1 }
    ],
    rewards: { coins: 35, xp: 8 }
  };

  assert.equal(canCompleteOrder(inventory, order), true);

  const result = completeOrder({ inventory, state, order });

  assert.equal(result.ok, true);
  assert.deepEqual(result.inventory, { chip_2: 0, wire_2: 0 });
  assert.equal(result.state.coins, 35);
  assert.equal(result.state.xp, 8);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- tests/economy-engine.test.js
```

Expected: FAIL because `packages/economy-engine/src/index.js` does not exist.

- [ ] **Step 3: Implement economy functions**

Create `packages/economy-engine/src/index.js`:

```js
export function spendEnergy(state, amount) {
  if (state.energy < amount) {
    return { ok: false, reason: 'not_enough_energy', state };
  }

  return {
    ok: true,
    state: {
      ...state,
      energy: state.energy - amount
    }
  };
}

export function refillEnergy(state, { nowSeconds, refillSeconds, maxEnergy }) {
  const lastEnergyAt = state.lastEnergyAt ?? nowSeconds;
  const elapsed = Math.max(0, nowSeconds - lastEnergyAt);
  const gained = Math.floor(elapsed / refillSeconds);

  if (gained <= 0) {
    return state;
  }

  return {
    ...state,
    energy: Math.min(maxEnergy, state.energy + gained),
    lastEnergyAt: nowSeconds
  };
}

export function canCompleteOrder(inventory, order) {
  return order.requires.every((requirement) => {
    return (inventory[requirement.itemId] ?? 0) >= requirement.count;
  });
}

export function completeOrder({ inventory, state, order }) {
  if (!canCompleteOrder(inventory, order)) {
    return { ok: false, reason: 'requirements_missing', inventory, state };
  }

  const nextInventory = { ...inventory };
  for (const requirement of order.requires) {
    nextInventory[requirement.itemId] = (nextInventory[requirement.itemId] ?? 0) - requirement.count;
  }

  const nextState = { ...state };
  for (const [key, value] of Object.entries(order.rewards)) {
    nextState[key] = (nextState[key] ?? 0) + value;
  }

  return {
    ok: true,
    inventory: nextInventory,
    state: nextState,
    completedOrderId: order.id
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm test -- tests/economy-engine.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add packages/economy-engine/src/index.js tests/economy-engine.test.js
git commit -m "test: add economy order resolution"
```

---

### Task 7: Implement Retention, Analytics, And Monetization Foundations

**Files:**
- Create: `packages/retention-engine/src/index.js`
- Create: `packages/analytics/src/index.js`
- Create: `packages/monetization/src/index.js`
- Create: `tests/retention-engine.test.js`

- [ ] **Step 1: Write failing retention tests**

Create `tests/retention-engine.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { claimDailyReward } from '../packages/retention-engine/src/index.js';
import { createAnalyticsEvent } from '../packages/analytics/src/index.js';
import { createCosmeticSku } from '../packages/monetization/src/index.js';

test('claimDailyReward grants day one reward once per calendar day', () => {
  const save = { coins: 0, dailyReward: { streak: 0, lastClaimDay: null } };
  const result = claimDailyReward(save, { calendarDay: '2026-05-10' });

  assert.equal(result.ok, true);
  assert.equal(result.save.coins, 25);
  assert.equal(result.save.dailyReward.streak, 1);
  assert.equal(result.save.dailyReward.lastClaimDay, '2026-05-10');

  const second = claimDailyReward(result.save, { calendarDay: '2026-05-10' });
  assert.equal(second.ok, false);
  assert.equal(second.reason, 'already_claimed_today');
});

test('createAnalyticsEvent uses stable shared envelope fields', () => {
  const event = createAnalyticsEvent({
    appId: 'com.mergeplatform.syndicate',
    themeId: 'cyber-syndicate',
    name: 'merge_completed',
    payload: { itemId: 'chip_2' },
    timestamp: '2026-05-10T18:00:00.000Z'
  });

  assert.deepEqual(event, {
    appId: 'com.mergeplatform.syndicate',
    themeId: 'cyber-syndicate',
    name: 'merge_completed',
    payload: { itemId: 'chip_2' },
    timestamp: '2026-05-10T18:00:00.000Z',
    schemaVersion: 1
  });
});

test('createCosmeticSku marks foundation purchases as non-pay-to-win', () => {
  const sku = createCosmeticSku({
    id: 'cyber_board_skin_01',
    name: 'Neon Board Skin',
    priceTier: 'standard'
  });

  assert.equal(sku.category, 'cosmetic');
  assert.equal(sku.payToWin, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- tests/retention-engine.test.js
```

Expected: FAIL because the three package files do not exist.

- [ ] **Step 3: Implement retention engine**

Create `packages/retention-engine/src/index.js`:

```js
const DAILY_REWARDS = [
  { coins: 25 },
  { coins: 30 },
  { coins: 40 },
  { coins: 50 },
  { coins: 65 },
  { coins: 80 },
  { coins: 100, premium: 1 }
];

export function claimDailyReward(save, { calendarDay }) {
  const dailyReward = save.dailyReward ?? { streak: 0, lastClaimDay: null };

  if (dailyReward.lastClaimDay === calendarDay) {
    return { ok: false, reason: 'already_claimed_today', save };
  }

  const nextStreak = dailyReward.streak + 1;
  const reward = DAILY_REWARDS[(nextStreak - 1) % DAILY_REWARDS.length];

  return {
    ok: true,
    reward,
    save: {
      ...save,
      coins: (save.coins ?? 0) + (reward.coins ?? 0),
      premium: (save.premium ?? 0) + (reward.premium ?? 0),
      dailyReward: {
        streak: nextStreak,
        lastClaimDay: calendarDay
      }
    }
  };
}
```

- [ ] **Step 4: Implement analytics envelope helper**

Create `packages/analytics/src/index.js`:

```js
export function createAnalyticsEvent({ appId, themeId, name, payload = {}, timestamp = new Date().toISOString() }) {
  return {
    appId,
    themeId,
    name,
    payload,
    timestamp,
    schemaVersion: 1
  };
}
```

- [ ] **Step 5: Implement monetization metadata helper**

Create `packages/monetization/src/index.js`:

```js
export function createCosmeticSku({ id, name, priceTier }) {
  return {
    id,
    name,
    priceTier,
    category: 'cosmetic',
    payToWin: false
  };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run:

```powershell
npm test -- tests/retention-engine.test.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add packages/retention-engine packages/analytics packages/monetization tests/retention-engine.test.js
git commit -m "test: add retention analytics monetization foundations"
```

---

### Task 8: Add Standalone App Identity Outputs

**Files:**
- Create: `apps/merge-syndicate/app.config.json`
- Create: `apps/merge-syndicate/src/appIdentity.js`
- Create: `apps/merge-kingdom-lite/app.config.json`
- Create: `apps/merge-kingdom-lite/src/appIdentity.js`
- Create: `tests/app-smoke.test.js`
- Create: `scripts/smoke-app.mjs`

- [ ] **Step 1: Write failing app smoke tests**

Create `tests/app-smoke.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { syndicateIdentity } from '../apps/merge-syndicate/src/appIdentity.js';
import { kingdomLiteIdentity } from '../apps/merge-kingdom-lite/src/appIdentity.js';

test('standalone app outputs keep separate identity', () => {
  assert.equal(syndicateIdentity.themeId, 'cyber-syndicate');
  assert.equal(kingdomLiteIdentity.themeId, 'kingdom-lite');
  assert.notEqual(syndicateIdentity.appId, kingdomLiteIdentity.appId);
  assert.notEqual(syndicateIdentity.saveNamespace, kingdomLiteIdentity.saveNamespace);
  assert.notEqual(syndicateIdentity.analyticsStream, kingdomLiteIdentity.analyticsStream);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- tests/app-smoke.test.js
```

Expected: FAIL because app identity files do not exist.

- [ ] **Step 3: Create Merge Syndicate app identity**

Create `apps/merge-syndicate/app.config.json`:

```json
{
  "name": "Merge Syndicate",
  "slug": "merge-syndicate",
  "appId": "com.mergeplatform.syndicate",
  "themeId": "cyber-syndicate",
  "saveNamespace": "merge-syndicate-save-v1",
  "analyticsStream": "merge_syndicate_prod"
}
```

Create `apps/merge-syndicate/src/appIdentity.js`:

```js
export const syndicateIdentity = {
  name: 'Merge Syndicate',
  slug: 'merge-syndicate',
  appId: 'com.mergeplatform.syndicate',
  themeId: 'cyber-syndicate',
  saveNamespace: 'merge-syndicate-save-v1',
  analyticsStream: 'merge_syndicate_prod'
};
```

- [ ] **Step 4: Create Merge Kingdom Lite app identity**

Create `apps/merge-kingdom-lite/app.config.json`:

```json
{
  "name": "Merge Kingdom Lite",
  "slug": "merge-kingdom-lite",
  "appId": "com.mergeplatform.kingdomlite",
  "themeId": "kingdom-lite",
  "saveNamespace": "merge-kingdom-lite-save-v1",
  "analyticsStream": "merge_kingdom_lite_validation"
}
```

Create `apps/merge-kingdom-lite/src/appIdentity.js`:

```js
export const kingdomLiteIdentity = {
  name: 'Merge Kingdom Lite',
  slug: 'merge-kingdom-lite',
  appId: 'com.mergeplatform.kingdomlite',
  themeId: 'kingdom-lite',
  saveNamespace: 'merge-kingdom-lite-save-v1',
  analyticsStream: 'merge_kingdom_lite_validation'
};
```

- [ ] **Step 5: Add app smoke script**

Create `scripts/smoke-app.mjs`:

```js
import { syndicateIdentity } from '../apps/merge-syndicate/src/appIdentity.js';
import { kingdomLiteIdentity } from '../apps/merge-kingdom-lite/src/appIdentity.js';

const identities = [syndicateIdentity, kingdomLiteIdentity];
const fields = ['name', 'slug', 'appId', 'themeId', 'saveNamespace', 'analyticsStream'];
let failed = false;

for (const identity of identities) {
  for (const field of fields) {
    if (!identity[field]) {
      failed = true;
      console.error(`${identity.slug ?? '<missing slug>'} is missing ${field}`);
    }
  }
}

const uniqueFields = ['appId', 'saveNamespace', 'analyticsStream'];
for (const field of uniqueFields) {
  const values = new Set(identities.map((identity) => identity[field]));
  if (values.size !== identities.length) {
    failed = true;
    console.error(`App identities must use unique ${field}`);
  }
}

if (!failed) {
  console.log('All app identities passed smoke checks');
} else {
  process.exitCode = 1;
}
```

- [ ] **Step 6: Run tests and app smoke**

Run:

```powershell
npm test -- tests/app-smoke.test.js
npm run smoke:apps
```

Expected: both commands PASS.

- [ ] **Step 7: Commit**

```powershell
git add apps scripts/smoke-app.mjs tests/app-smoke.test.js
git commit -m "test: add standalone app identity outputs"
```

---

### Task 9: Add End-To-End Foundation Loop Test

**Files:**
- Modify: `tests/compatibility.test.js`

- [ ] **Step 1: Add failing end-to-end compatibility test**

Append to `tests/compatibility.test.js`:

```js
import { createBoard, getCell, mergeCells, tapProducer } from '../packages/merge-engine/src/index.js';
import { spendEnergy, completeOrder } from '../packages/economy-engine/src/index.js';

test('cyber theme can run a producer, merge, and complete first order through shared engines', async () => {
  const theme = await loadTheme('cyber-syndicate');
  let board = createBoard(theme.config.board);
  let state = { ...theme.config.startingState, xp: 0 };
  const producerState = { tapsRemaining: theme.producers[0].tapLimit, cooldownUntil: null };

  const energyResult = spendEnergy(state, theme.producers[0].energyCost);
  assert.equal(energyResult.ok, true);
  state = energyResult.state;

  let producerResult = tapProducer({
    board,
    producer: theme.producers[0],
    producerState,
    random: () => 0
  });
  assert.equal(producerResult.ok, true);
  board = producerResult.board;

  producerResult = tapProducer({
    board,
    producer: theme.producers[0],
    producerState: producerResult.producerState,
    random: () => 0
  });
  assert.equal(producerResult.ok, true);
  board = producerResult.board;

  const mergeResult = mergeCells(board, { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, theme.itemChains);
  assert.equal(mergeResult.ok, true);
  assert.deepEqual(getCell(mergeResult.board, { x: 1, y: 0 }).item, { itemId: 'chip_2' });

  const inventory = { chip_2: 1, wire_2: 1 };
  const orderResult = completeOrder({ inventory, state, order: theme.orders[0] });
  assert.equal(orderResult.ok, true);
  assert.equal(orderResult.state.coins, 35);
});
```

- [ ] **Step 2: Run test**

Run:

```powershell
npm test -- tests/compatibility.test.js
```

Expected: PASS if Tasks 4-6 are complete. If it fails, fix the engine layer that caused the failure before continuing.

- [ ] **Step 3: Run full verification**

Run:

```powershell
npm run verify
```

Expected: PASS across all tests, theme validation, and app smoke checks.

- [ ] **Step 4: Commit**

```powershell
git add tests/compatibility.test.js
git commit -m "test: prove shared engine foundation loop"
```

---

### Task 10: Document Foundation Rules

**Files:**
- Modify: `README.md`
- Create: `docs/ENGINE_COMPATIBILITY.md`

- [ ] **Step 1: Add engine compatibility document**

Create `docs/ENGINE_COMPATIBILITY.md`:

```markdown
# Engine Compatibility

Engine updates must keep all completed themes working.

Before changing a shared engine package, run:

```bash
npm run verify
```

The verification suite checks:

- shared engine behavior
- every theme contract
- every standalone app identity
- the foundation producer, merge, and order loop

## Rule

If a new theme needs engine behavior that does not exist, add the behavior to the shared engine deliberately and keep all existing completed themes passing.

Do not place theme-specific gameplay rules inside app shells or theme data loaders. Theme packages define content and tuning; shared packages define behavior.
```

- [ ] **Step 2: Update README with compatibility rule**

Append to `README.md`:

```markdown
## Engine Compatibility Rule

Engine updates must keep all completed themes working. Run `npm run verify` before considering a shared engine change safe.

If a theme needs behavior that the engine does not support, treat that as a platform feature and validate it against every completed theme.
```

- [ ] **Step 3: Run full verification**

Run:

```powershell
npm run verify
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add README.md docs/ENGINE_COMPATIBILITY.md
git commit -m "docs: record engine compatibility rule"
```

---

## Final Verification

- [ ] **Step 1: Confirm clean tests**

Run:

```powershell
npm run verify
```

Expected: PASS.

- [ ] **Step 2: Confirm git state**

Run:

```powershell
git status --short
```

Expected: no tracked implementation changes. The existing root `New Text Document.txt` may remain untracked unless the user chooses to remove or commit it.

## Self-Review

Spec coverage:

- Platform repo shape is covered by Tasks 1 and 8.
- Theme contracts are covered by Tasks 2 and 3.
- Merge board, producer, economy, orders, energy, rewards, and daily reward are covered by Tasks 4-7.
- Cyber Syndicate and Kingdom Lite themes are covered by Task 3.
- App identity separation is covered by Task 8.
- Engine compatibility across completed themes is covered by Tasks 3, 9, and 10.

No plan step requires runtime theme switching. Each app output keeps a separate identity.
