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

function firstEmptyPosition(board) {
  const cell = board.cells.find((candidate) => candidate.item === null);
  assert.ok(cell, 'expected an empty board cell');
  return { x: cell.x, y: cell.y };
}

function findChainLevel(itemChains, itemId) {
  for (const chain of itemChains) {
    const index = chain.levels.findIndex((level) => level.id === itemId);
    if (index !== -1) {
      return { chain, index };
    }
  }
  return null;
}

function randomForDrop(producer, itemId) {
  const totalWeight = producer.drops.reduce((sum, drop) => sum + drop.weight, 0);
  let cursor = 0;

  for (const drop of producer.drops) {
    if (drop.itemId === itemId) {
      return () => (cursor + drop.weight / 2) / totalWeight;
    }
    cursor += drop.weight;
  }

  assert.fail(`${producer.id} cannot drop ${itemId}`);
}

function spendTapEnergy(state, producer) {
  const energyResult = spendEnergy(state, producer.energyCost);
  assert.equal(energyResult.ok, true);
  return energyResult.state;
}

function tapExpectedItem({ board, producer, producerState, expectedItemId }) {
  const expectedPosition = firstEmptyPosition(board);
  const producerResult = tapProducer({
    board,
    producer,
    producerState,
    random: randomForDrop(producer, expectedItemId)
  });

  assert.equal(producerResult.ok, true);
  assert.equal(producerResult.droppedItemId, expectedItemId);
  assert.deepEqual(getCell(producerResult.board, expectedPosition).item, { itemId: expectedItemId });

  return {
    board: producerResult.board,
    producerState: producerResult.producerState,
    position: expectedPosition
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

test('cyber-syndicate level two drone remains mergeable for the Unity proof', async () => {
  const cyber = await loadTheme('cyber-syndicate');
  const droneChain = cyber.itemChains.find((chain) => chain.id === 'drones');

  assert.ok(droneChain);
  assert.deepEqual(droneChain.levels.map((level) => level.id), ['drone_1', 'drone_2', 'drone_3']);
});

test('foundation themes can run producer, merge, and first order loops through shared engines', async () => {
  for (const themeId of ['cyber-syndicate', 'kingdom-lite']) {
    const theme = await loadTheme(themeId);
    const producer = theme.producers[0];
    const order = theme.orders[0];
    let board = createBoard(theme.config.board);
    let state = { ...theme.config.startingState, xp: 0 };
    let producerState = { tapsRemaining: producer.tapLimit, cooldownUntil: null };
    const inventory = {};

    for (const requirement of order.requires) {
      const requiredLevel = findChainLevel(theme.itemChains, requirement.itemId);
      assert.ok(requiredLevel, `${themeId}: missing chain for ${requirement.itemId}`);
      assert.equal(requiredLevel.index, 1, `${themeId}: first order should require level-2 items`);
      const baseItemId = requiredLevel.chain.levels[0].id;

      state = spendTapEnergy(state, producer);
      let tapResult = tapExpectedItem({ board, producer, producerState, expectedItemId: baseItemId });
      board = tapResult.board;
      producerState = tapResult.producerState;
      const firstPosition = tapResult.position;

      state = spendTapEnergy(state, producer);
      tapResult = tapExpectedItem({ board, producer, producerState, expectedItemId: baseItemId });
      board = tapResult.board;
      producerState = tapResult.producerState;
      const secondPosition = tapResult.position;

      const mergeResult = mergeCells(board, { from: firstPosition, to: secondPosition }, theme.itemChains);
      assert.equal(mergeResult.ok, true, `${themeId}: expected ${baseItemId} to merge`);
      assert.equal(mergeResult.createdItemId, requirement.itemId);
      assert.deepEqual(getCell(mergeResult.board, secondPosition).item, { itemId: requirement.itemId });
      board = mergeResult.board;
      inventory[requirement.itemId] = (inventory[requirement.itemId] ?? 0) + 1;
    }

    const orderResult = completeOrder({ inventory, state, order });
    assert.equal(orderResult.ok, true, `${themeId}: expected first order to complete`);
    assert.equal(orderResult.completedOrderId, order.id);
    assert.equal(orderResult.state.coins, theme.config.startingState.coins + order.rewards.coins);
    assert.equal(orderResult.state.xp, order.rewards.xp);
  }
});
