import assert from 'node:assert/strict';
import test from 'node:test';
import { placeItem } from '../packages/merge-engine/src/index.js';
import {
  claimDailyLogin,
  completeOrderFromBoard,
  createInitialSave,
  describeBoardCell,
  getCurrentDistrict,
  getSessionGoal,
  mergeBoardCells,
  tapPrimaryProducer
} from '../apps/merge-syndicate/src/gameSession.js';
import { loadMergeSyndicateTheme } from '../apps/merge-syndicate/src/themeLoader.js';

test('creates a standalone Merge Syndicate save from theme data', () => {
  const theme = loadMergeSyndicateTheme();
  const save = createInitialSave(theme, { nowSeconds: 1000 });

  assert.equal(theme.config.displayName, 'Merge Syndicate');
  assert.equal(save.board.width, 6);
  assert.equal(save.board.height, 6);
  assert.equal(save.energy, 50);
  assert.equal(save.coins, 0);
  assert.equal(save.premium, 0);
  assert.equal(save.producerStates.black_market_crate.tapsRemaining, 12);
  assert.equal(save.saveNamespace, 'merge-syndicate-save-v1');
  assert.deepEqual(save.onboardingDropQueue, ['chip_1', 'chip_1', 'wire_1', 'wire_1']);
});

test('producer tap spends energy and drops into the first empty board slot', () => {
  const theme = loadMergeSyndicateTheme();
  const save = createInitialSave(theme, { nowSeconds: 1000 });

  const result = tapPrimaryProducer(save, theme, {
    nowSeconds: 1000,
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.equal(result.save.energy, 49);
  assert.equal(result.save.board.cells[0].item.itemId, 'chip_1');
  assert.equal(result.save.producerStates.black_market_crate.tapsRemaining, 11);
  assert.match(result.message, /Black-Market Crate/);
});

test('first prototype crate taps are seeded toward the first order', () => {
  const theme = loadMergeSyndicateTheme();
  let save = createInitialSave(theme, { nowSeconds: 1000 });

  const drops = [];
  for (let index = 0; index < 4; index += 1) {
    const result = tapPrimaryProducer(save, theme, { nowSeconds: 1000 + index });
    assert.equal(result.ok, true);
    save = result.save;
    drops.push(save.board.cells[index].item.itemId);
  }

  assert.deepEqual(drops, ['chip_1', 'chip_1', 'wire_1', 'wire_1']);
  assert.deepEqual(save.onboardingDropQueue, []);
});

test('merges two matching board cells through the shared engine', () => {
  const theme = loadMergeSyndicateTheme();
  let save = createInitialSave(theme, { nowSeconds: 1000 });
  save = {
    ...save,
    board: placeItem(
      placeItem(save.board, { x: 0, y: 0 }, { itemId: 'chip_1' }),
      { x: 1, y: 0 },
      { itemId: 'chip_1' }
    )
  };

  const result = mergeBoardCells(save, theme, {
    from: { x: 0, y: 0 },
    to: { x: 1, y: 0 }
  });

  assert.equal(result.ok, true);
  assert.equal(result.save.board.cells[0].item, null);
  assert.equal(result.save.board.cells[1].item.itemId, 'chip_2');
  assert.match(result.message, /Chip II/);
});

test('completes an order from board items and advances district progress', () => {
  const theme = loadMergeSyndicateTheme();
  let save = createInitialSave(theme, { nowSeconds: 1000 });
  save = {
    ...save,
    board: placeItem(
      placeItem(save.board, { x: 0, y: 0 }, { itemId: 'chip_2' }),
      { x: 1, y: 0 },
      { itemId: 'wire_2' }
    )
  };

  const result = completeOrderFromBoard(save, theme, 'signal_scrambler_1');

  assert.equal(result.ok, true);
  assert.equal(result.save.coins, 35);
  assert.equal(result.save.xp, 8);
  assert.deepEqual(result.save.completedOrderIds, ['signal_scrambler_1']);
  assert.equal(result.save.board.cells[0].item, null);
  assert.equal(result.save.board.cells[1].item, null);
  assert.equal(getCurrentDistrict(result.save, theme).id, 'neon_market');
});

test('daily login reward updates the standalone save once per calendar day', () => {
  const theme = loadMergeSyndicateTheme();
  const save = createInitialSave(theme, { nowSeconds: 1000 });

  const first = claimDailyLogin(save, { calendarDay: '2026-05-11' });
  const second = claimDailyLogin(first.save, { calendarDay: '2026-05-11' });

  assert.equal(first.ok, true);
  assert.equal(first.save.coins, 25);
  assert.equal(first.save.dailyReward.streak, 1);
  assert.equal(second.ok, false);
  assert.equal(second.reason, 'already_claimed_today');
});

test('board cell descriptions include presentation data for the browser UI', () => {
  const theme = loadMergeSyndicateTheme();
  const described = describeBoardCell({ x: 0, y: 0, item: { itemId: 'chip_2' } }, theme);

  assert.equal(described.label, 'Chip II');
  assert.equal(described.icon, '◇');
  assert.equal(described.chainId, 'chips');
  assert.equal(described.level, 2);
});

test('session goal points to the next useful player action', () => {
  const theme = loadMergeSyndicateTheme();
  const initial = createInitialSave(theme, { nowSeconds: 1000 });
  const ready = {
    ...initial,
    board: placeItem(
      placeItem(initial.board, { x: 0, y: 0 }, { itemId: 'chip_2' }),
      { x: 1, y: 0 },
      { itemId: 'wire_2' }
    )
  };

  assert.equal(getSessionGoal(initial, theme).action, 'produce');
  assert.equal(getSessionGoal(ready, theme).action, 'deliver');
  assert.match(getSessionGoal(ready, theme).label, /Build a Signal Scrambler/);
});
