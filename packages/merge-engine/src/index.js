function toIndex(board, position) {
  return position.y * board.width + position.x;
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
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

function isSamePosition(source, target) {
  return source.x === target.x && source.y === target.y;
}

function cloneCell(cell) {
  return {
    ...cell,
    item: cell.item ? { ...cell.item } : null
  };
}

function cloneBoard(board) {
  return {
    ...board,
    cells: board.cells.map((cell) => cloneCell(cell))
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
  assertPositiveInteger(width, 'width');
  assertPositiveInteger(height, 'height');

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
  return cloneCell(board.cells[toIndex(board, position)]);
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

  if (isSamePosition(move.from, move.to)) {
    return { ok: false, reason: 'source_and_target_must_differ', board };
  }

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

  const effectiveProducerState = (
    producerState.cooldownUntil &&
    producerState.cooldownUntil <= nowSeconds &&
    producerState.tapsRemaining <= 0
  )
    ? { ...producerState, tapsRemaining: producer.tapLimit, cooldownUntil: null }
    : producerState;

  if (effectiveProducerState.tapsRemaining <= 0) {
    return { ok: false, reason: 'producer_empty', board, producerState: effectiveProducerState };
  }

  const emptyCell = firstEmptyCell(board);
  if (!emptyCell) {
    return { ok: false, reason: 'board_full', board, producerState: effectiveProducerState };
  }

  const drop = pickWeightedDrop(producer.drops, random);
  const nextBoard = placeItem(board, { x: emptyCell.x, y: emptyCell.y }, { itemId: drop.itemId });
  const tapsRemaining = effectiveProducerState.tapsRemaining - 1;

  return {
    ok: true,
    board: nextBoard,
    droppedItemId: drop.itemId,
    energyCost: producer.energyCost,
    producerState: {
      ...effectiveProducerState,
      tapsRemaining,
      cooldownUntil: tapsRemaining === 0 ? nowSeconds + producer.cooldownSeconds : null
    }
  };
}
