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
  const producerState = { tapsRemaining: 2, cooldownUntil: null, sourceItemId: 'crate_1' };
  const result = tapProducer({
    board,
    producer,
    producerState,
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.equal(result.energyCost, 1);
  assert.equal(result.producerState.sourceItemId, 'crate_1');
  assert.equal(result.producerState.tapsRemaining, 1);
  assert.deepEqual(getCell(result.board, { x: 0, y: 0 }).item, { itemId: 'chip_1' });
});

test('tapProducer can select a weighted drop in a later bucket', () => {
  const board = createBoard({ width: 2, height: 2 });
  const weightedProducer = {
    ...producer,
    drops: [
      { itemId: 'chip_1', weight: 1 },
      { itemId: 'wire_1', weight: 3 }
    ]
  };

  const result = tapProducer({
    board,
    producer: weightedProducer,
    producerState: { tapsRemaining: 2, cooldownUntil: null },
    random: () => 0.5
  });

  assert.equal(result.ok, true);
  assert.equal(result.droppedItemId, 'wire_1');
  assert.deepEqual(getCell(result.board, { x: 0, y: 0 }).item, { itemId: 'wire_1' });
});

test('tapProducer does not mutate the original board after a successful tap', () => {
  const board = createBoard({ width: 2, height: 2 });

  const result = tapProducer({
    board,
    producer,
    producerState: { tapsRemaining: 2, cooldownUntil: null },
    random: () => 0
  });

  assert.equal(result.ok, true);
  assert.notEqual(result.board, board);
  assert.equal(getCell(board, { x: 0, y: 0 }).item, null);
  assert.equal(getCell(board, { x: 1, y: 0 }).item, null);
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

test('tapProducer rejects a cooling producer without consuming board or state', () => {
  const board = createBoard({ width: 2, height: 2 });
  const producerState = { tapsRemaining: 2, cooldownUntil: 1500, sourceItemId: 'crate_1' };
  let randomCalls = 0;

  const result = tapProducer({
    board,
    producer,
    producerState,
    nowSeconds: 1000,
    random: () => {
      randomCalls += 1;
      return 0;
    }
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'producer_cooling_down');
  assert.equal(result.board, board);
  assert.equal(result.producerState, producerState);
  assert.equal(randomCalls, 0);
  assert.equal(getCell(board, { x: 0, y: 0 }).item, null);
  assert.deepEqual(producerState, { tapsRemaining: 2, cooldownUntil: 1500, sourceItemId: 'crate_1' });
});

test('tapProducer rejects an empty producer without consuming board or state', () => {
  const board = createBoard({ width: 2, height: 2 });
  const producerState = { tapsRemaining: 0, cooldownUntil: null, sourceItemId: 'crate_1' };
  let randomCalls = 0;

  const result = tapProducer({
    board,
    producer,
    producerState,
    random: () => {
      randomCalls += 1;
      return 0;
    }
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'producer_empty');
  assert.equal(result.board, board);
  assert.equal(result.producerState, producerState);
  assert.equal(randomCalls, 0);
  assert.equal(getCell(board, { x: 0, y: 0 }).item, null);
  assert.deepEqual(producerState, { tapsRemaining: 0, cooldownUntil: null, sourceItemId: 'crate_1' });
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
