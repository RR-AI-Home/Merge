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
