import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spendEnergy, completeOrder } from '../packages/economy-engine/src/index.js';
import { createBoard, getCell, mergeCells, tapProducer } from '../packages/merge-engine/src/index.js';
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
