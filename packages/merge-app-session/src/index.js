import {
  canCompleteOrder,
  completeOrder,
  spendEnergy
} from '../../economy-engine/src/index.js';
import {
  createBoard,
  mergeCells,
  tapProducer
} from '../../merge-engine/src/index.js';
import { claimDailyReward } from '../../retention-engine/src/index.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function indexFor(board, position) {
  return position.y * board.width + position.x;
}

function getPrimaryProducer(theme) {
  return theme.producers[0];
}

function createProducerStates(theme) {
  return Object.fromEntries(theme.producers.map((producer) => [
    producer.id,
    {
      tapsRemaining: producer.tapLimit,
      cooldownUntil: null
    }
  ]));
}

function getItemLevel(theme, itemId) {
  for (const chain of theme.itemChains) {
    const level = chain.levels.find((candidate) => candidate.id === itemId);
    if (level) {
      return level;
    }
  }
  return null;
}

function getItemChain(theme, itemId) {
  return theme.itemChains.find((chain) => {
    return chain.levels.some((level) => level.id === itemId);
  }) ?? null;
}

function countBoardItems(board) {
  const inventory = {};
  for (const cell of board.cells) {
    if (cell.item) {
      inventory[cell.item.itemId] = (inventory[cell.item.itemId] ?? 0) + 1;
    }
  }
  return inventory;
}

function removeOrderItemsFromBoard(board, order) {
  const required = {};
  for (const requirement of order.requires) {
    required[requirement.itemId] = (required[requirement.itemId] ?? 0) + requirement.count;
  }

  const next = clone(board);
  for (const cell of next.cells) {
    if (cell.item && required[cell.item.itemId] > 0) {
      required[cell.item.itemId] -= 1;
      cell.item = null;
    }
  }
  return next;
}

function randomForDrop(producer, itemId) {
  const totalWeight = producer.drops.reduce((sum, drop) => sum + drop.weight, 0);
  let cursor = 0;

  for (const drop of producer.drops) {
    const start = cursor;
    cursor += drop.weight;
    if (drop.itemId === itemId) {
      return () => (start + drop.weight / 2) / totalWeight;
    }
  }

  return null;
}

function hasMergeCandidate(save) {
  const seen = new Set();
  for (const cell of save.board.cells) {
    if (!cell.item) {
      continue;
    }

    if (seen.has(cell.item.itemId)) {
      return true;
    }

    seen.add(cell.item.itemId);
  }
  return false;
}

function getChapterTarget(theme) {
  const districtTarget = Math.max(...theme.worldMap.nodes.map((node) => node.unlocksAfterOrders));
  return Math.max(1, districtTarget);
}

export function createMergeGameSession({
  identity,
  initialDropQueue = [],
  orderDropQueues = {},
  itemIcons = {}
}) {
  function getItemPresentation(theme, itemId) {
    const chain = getItemChain(theme, itemId);

    return {
      chainId: chain?.id ?? null,
      icon: itemIcons[chain?.id] ?? '•'
    };
  }

  function createInitialSave(theme, { nowSeconds = Math.floor(Date.now() / 1000) } = {}) {
    return {
      appId: identity.appId,
      saveNamespace: identity.saveNamespace,
      themeId: identity.themeId,
      board: createBoard(theme.config.board),
      producerStates: createProducerStates(theme),
      completedOrderIds: [],
      onboardingDropQueue: [...initialDropQueue],
      ordersCompleted: 0,
      lastEnergyAt: nowSeconds,
      dailyReward: {
        streak: 0,
        lastClaimDay: null
      },
      ...theme.config.startingState
    };
  }

  function tapPrimaryProducer(save, theme, options = {}) {
    const producer = getPrimaryProducer(theme);
    const energyCheck = spendEnergy(save, producer.energyCost);
    if (!energyCheck.ok) {
      return {
        ok: false,
        reason: energyCheck.reason,
        save,
        message: `Not enough energy to use ${producer.name}.`
      };
    }

    const queuedDrop = save.onboardingDropQueue?.[0] ?? null;
    const seededRandom = queuedDrop ? randomForDrop(producer, queuedDrop) : null;
    const result = tapProducer({
      board: save.board,
      producer,
      producerState: save.producerStates[producer.id],
      nowSeconds: options.nowSeconds,
      random: seededRandom ?? options.random
    });

    if (!result.ok) {
      return {
        ok: false,
        reason: result.reason,
        save: {
          ...save,
          producerStates: {
            ...save.producerStates,
            [producer.id]: result.producerState
          }
        },
        message: result.reason === 'board_full'
          ? 'Board is full. Merge or complete an order first.'
          : `${producer.name} is recharging.`
      };
    }

    const itemName = getItemLevel(theme, result.droppedItemId)?.name ?? result.droppedItemId;
    return {
      ok: true,
      save: {
        ...energyCheck.state,
        board: result.board,
        onboardingDropQueue: queuedDrop ? save.onboardingDropQueue.slice(1) : (save.onboardingDropQueue ?? []),
        producerStates: {
          ...save.producerStates,
          [producer.id]: result.producerState
        }
      },
      message: `${producer.name} dropped ${itemName}.`
    };
  }

  function mergeBoardCells(save, theme, move) {
    const result = mergeCells(save.board, move, theme.itemChains);
    if (!result.ok) {
      return {
        ok: false,
        reason: result.reason,
        save,
        message: 'Those items cannot merge.'
      };
    }

    const itemName = getItemLevel(theme, result.createdItemId)?.name ?? result.createdItemId;
    return {
      ok: true,
      save: {
        ...save,
        board: result.board
      },
      message: `Merged into ${itemName}.`
    };
  }

  function completeOrderFromBoard(save, theme, orderId) {
    const order = theme.orders.find((candidate) => candidate.id === orderId);
    if (!order) {
      return { ok: false, reason: 'order_not_found', save, message: 'Order not found.' };
    }

    if (save.completedOrderIds.includes(orderId)) {
      return { ok: false, reason: 'order_already_completed', save, message: 'Order already completed.' };
    }

    const result = completeOrder({
      inventory: countBoardItems(save.board),
      state: save,
      order
    });

    if (!result.ok) {
      return {
        ok: false,
        reason: result.reason,
        save,
        message: 'Missing items for that order.'
      };
    }

    const completedOrderIds = [...save.completedOrderIds, orderId];
    return {
      ok: true,
      save: {
        ...result.state,
        board: removeOrderItemsFromBoard(save.board, order),
        completedOrderIds,
        onboardingDropQueue: [...(orderDropQueues[orderId] ?? save.onboardingDropQueue ?? [])],
        ordersCompleted: completedOrderIds.length
      },
      message: `${order.title} complete. District progress increased.`
    };
  }

  function claimDailyLogin(save, { calendarDay }) {
    const result = claimDailyReward(save, { calendarDay });
    if (!result.ok) {
      return {
        ...result,
        message: 'Daily reward already claimed.'
      };
    }

    return {
      ...result,
      message: `Daily reward claimed: ${result.reward.coins ?? 0} coins.`
    };
  }

  function getCurrentDistrict(save, theme) {
    const unlocked = theme.worldMap.nodes
      .filter((node) => node.unlocksAfterOrders <= save.ordersCompleted)
      .at(-1);
    return unlocked ?? theme.worldMap.nodes[0];
  }

  function getChapterProgress(save, theme) {
    const target = getChapterTarget(theme);
    const currentDistrict = getCurrentDistrict(save, theme);
    const nextDistrict = theme.worldMap.nodes.find((node) => {
      return node.unlocksAfterOrders > save.ordersCompleted;
    }) ?? null;

    return {
      completed: Math.min(save.ordersCompleted, target),
      target,
      currentDistrictTitle: currentDistrict.title,
      nextDistrictTitle: nextDistrict?.title ?? null,
      isChapterComplete: save.ordersCompleted >= target
    };
  }

  function getEventRail(save, theme) {
    const slot = theme.events.slots[0];
    const progress = getChapterProgress(save, theme);

    if (!progress.isChapterComplete) {
      return {
        status: 'locked',
        title: slot.title,
        detail: `Complete ${progress.target} district orders to unlock events.`
      };
    }

    return {
      status: 'active',
      title: slot.title,
      detail: `Timed orders are active in ${progress.currentDistrictTitle}.`
    };
  }

  function getOpenOrders(save, theme) {
    return theme.orders.filter((order) => !save.completedOrderIds.includes(order.id));
  }

  function getSessionGoal(save, theme) {
    const openOrders = getOpenOrders(save, theme);
    const inventory = countBoardItems(save.board);
    const readyOrder = openOrders.find((order) => canCompleteOrder(inventory, order));
    if (readyOrder) {
      return {
        action: 'deliver',
        label: `Deliver ${readyOrder.title}`,
        detail: 'Order items are ready on the board.'
      };
    }

    if (hasMergeCandidate(save)) {
      return {
        action: 'merge',
        label: 'Merge matching items',
        detail: 'Upgrade parts toward the next order.'
      };
    }

    if (openOrders.length > 0) {
      return {
        action: 'produce',
        label: `Open ${getPrimaryProducer(theme).name}`,
        detail: `Find parts for ${openOrders[0].title}.`
      };
    }

    return {
      action: 'complete',
      label: 'Prototype orders complete',
      detail: 'The next slice can add more districts and event chains.'
    };
  }

  function describeBoardCell(cell, theme) {
    if (!cell.item) {
      return { label: '', level: null, itemId: null, chainId: null, icon: null };
    }

    const level = getItemLevel(theme, cell.item.itemId);
    const presentation = getItemPresentation(theme, cell.item.itemId);
    return {
      label: level?.name ?? cell.item.itemId,
      chainId: presentation.chainId,
      icon: presentation.icon,
      level: level?.level ?? null,
      itemId: cell.item.itemId
    };
  }

  function serializeSave(save) {
    return clone(save);
  }

  function moveItem(save, from, to) {
    if (from.x === to.x && from.y === to.y) {
      return { ok: false, reason: 'same_cell', save };
    }

    const fromIndex = indexFor(save.board, from);
    const toIndex = indexFor(save.board, to);
    const source = save.board.cells[fromIndex];
    const target = save.board.cells[toIndex];

    if (!source?.item || target?.item) {
      return { ok: false, reason: 'invalid_move', save };
    }

    const board = clone(save.board);
    board.cells[toIndex].item = board.cells[fromIndex].item;
    board.cells[fromIndex].item = null;
    return {
      ok: true,
      save: {
        ...save,
        board
      }
    };
  }

  return {
    claimDailyLogin,
    completeOrderFromBoard,
    createInitialSave,
    describeBoardCell,
    getChapterProgress,
    getCurrentDistrict,
    getEventRail,
    getOpenOrders,
    getSessionGoal,
    mergeBoardCells,
    moveItem,
    serializeSave,
    tapPrimaryProducer
  };
}
