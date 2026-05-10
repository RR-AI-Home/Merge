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
