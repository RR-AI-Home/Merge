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
