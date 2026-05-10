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

test('createBoard requires positive integer dimensions', () => {
  assert.throws(() => createBoard({ width: 0, height: 6 }), RangeError);
  assert.throws(() => createBoard({ width: 6, height: 0 }), RangeError);
  assert.throws(() => createBoard({ width: -1, height: 6 }), RangeError);
  assert.throws(() => createBoard({ width: 1.5, height: 6 }), RangeError);
});

test('placeItem stores an item at a board coordinate', () => {
  const board = createBoard({ width: 6, height: 6 });
  const updated = placeItem(board, { x: 1, y: 2 }, { itemId: 'chip_1' });

  assert.deepEqual(getCell(updated, { x: 1, y: 2 }).item, { itemId: 'chip_1' });
  assert.equal(countOccupiedSlots(updated), 1);
});

test('getCell returns a copy that cannot mutate board internals', () => {
  const board = placeItem(createBoard({ width: 6, height: 6 }), { x: 1, y: 2 }, { itemId: 'chip_1' });
  const cell = getCell(board, { x: 1, y: 2 });

  cell.item.itemId = 'chip_2';

  assert.deepEqual(getCell(board, { x: 1, y: 2 }).item, { itemId: 'chip_1' });
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

test('mergeCells rejects merging a cell with itself', () => {
  const board = placeItem(createBoard({ width: 6, height: 6 }), { x: 0, y: 0 }, { itemId: 'chip_1' });

  const result = mergeCells(board, { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } }, itemChains);

  assert.deepEqual(result, { ok: false, reason: 'source_and_target_must_differ', board });
});

test('mergeCells rejects moves when either cell is empty', () => {
  const board = placeItem(createBoard({ width: 6, height: 6 }), { x: 0, y: 0 }, { itemId: 'chip_1' });

  const emptyTarget = mergeCells(board, { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, itemChains);
  const emptySource = mergeCells(board, { from: { x: 1, y: 0 }, to: { x: 0, y: 0 } }, itemChains);

  assert.deepEqual(emptyTarget, { ok: false, reason: 'both_cells_must_contain_items', board });
  assert.deepEqual(emptySource, { ok: false, reason: 'both_cells_must_contain_items', board });
});

test('mergeCells rejects non-matching item levels', () => {
  let board = createBoard({ width: 6, height: 6 });
  board = placeItem(board, { x: 0, y: 0 }, { itemId: 'chip_1' });
  board = placeItem(board, { x: 1, y: 0 }, { itemId: 'chip_2' });

  const result = mergeCells(board, { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, itemChains);

  assert.deepEqual(result, { ok: false, reason: 'items_cannot_merge', board });
});

test('mergeCells rejects terminal item levels', () => {
  let board = createBoard({ width: 6, height: 6 });
  board = placeItem(board, { x: 0, y: 0 }, { itemId: 'chip_3' });
  board = placeItem(board, { x: 1, y: 0 }, { itemId: 'chip_3' });

  const result = mergeCells(board, { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, itemChains);

  assert.deepEqual(result, { ok: false, reason: 'items_cannot_merge', board });
});

test('placeItem and mergeCells do not mutate the original board', () => {
  const empty = createBoard({ width: 6, height: 6 });
  const withSource = placeItem(empty, { x: 0, y: 0 }, { itemId: 'chip_1' });
  const ready = placeItem(withSource, { x: 1, y: 0 }, { itemId: 'chip_1' });

  const result = mergeCells(ready, { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, itemChains);

  assert.equal(getCell(empty, { x: 0, y: 0 }).item, null);
  assert.equal(getCell(empty, { x: 1, y: 0 }).item, null);
  assert.deepEqual(getCell(withSource, { x: 0, y: 0 }).item, { itemId: 'chip_1' });
  assert.equal(getCell(withSource, { x: 1, y: 0 }).item, null);
  assert.deepEqual(getCell(ready, { x: 0, y: 0 }).item, { itemId: 'chip_1' });
  assert.deepEqual(getCell(ready, { x: 1, y: 0 }).item, { itemId: 'chip_1' });
  assert.equal(result.ok, true);
});

test('board coordinate operations throw for out-of-range positions', () => {
  const board = createBoard({ width: 6, height: 6 });

  assert.throws(() => getCell(board, { x: -1, y: 0 }), RangeError);
  assert.throws(() => placeItem(board, { x: 6, y: 0 }, { itemId: 'chip_1' }), RangeError);
  assert.throws(
    () => mergeCells(board, { from: { x: 0, y: 0 }, to: { x: 0, y: 6 } }, itemChains),
    RangeError
  );
});
