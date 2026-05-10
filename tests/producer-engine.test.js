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
