export function spendEnergy(state, amount) {
  if (!isPositiveInteger(amount)) {
    return { ok: false, reason: 'invalid_energy_amount', state };
  }

  if (state.energy < amount) {
    return { ok: false, reason: 'not_enough_energy', state };
  }

  return {
    ok: true,
    state: {
      ...state,
      energy: state.energy - amount
    }
  };
}

export function refillEnergy(state, { nowSeconds, refillSeconds, maxEnergy }) {
  const lastEnergyAt = state.lastEnergyAt ?? nowSeconds;
  const elapsed = Math.max(0, nowSeconds - lastEnergyAt);
  const gained = Math.floor(elapsed / refillSeconds);

  if (gained <= 0) {
    if (state.lastEnergyAt === undefined || state.lastEnergyAt === null) {
      return {
        ...state,
        lastEnergyAt: nowSeconds
      };
    }

    return state;
  }

  const nextEnergy = Math.min(maxEnergy, state.energy + gained);

  return {
    ...state,
    energy: nextEnergy,
    lastEnergyAt: nextEnergy >= maxEnergy ? nowSeconds : lastEnergyAt + gained * refillSeconds
  };
}

export function canCompleteOrder(inventory, order) {
  if (!hasValidRequirements(order)) {
    return false;
  }

  return order.requires.every((requirement) => {
    return (inventory[requirement.itemId] ?? 0) >= requirement.count;
  });
}

export function completeOrder({ inventory, state, order }) {
  if (!hasValidRequirements(order)) {
    return { ok: false, reason: 'invalid_order_requirement', inventory, state };
  }

  if (!canCompleteOrder(inventory, order)) {
    return { ok: false, reason: 'requirements_missing', inventory, state };
  }

  const nextInventory = { ...inventory };
  for (const requirement of order.requires) {
    nextInventory[requirement.itemId] = (nextInventory[requirement.itemId] ?? 0) - requirement.count;
  }

  const nextState = { ...state };
  for (const [key, value] of Object.entries(order.rewards)) {
    nextState[key] = (nextState[key] ?? 0) + value;
  }

  return {
    ok: true,
    inventory: nextInventory,
    state: nextState,
    completedOrderId: order.id
  };
}

function hasValidRequirements(order) {
  return Array.isArray(order.requires) && order.requires.every((requirement) => {
    return isPositiveInteger(requirement.count);
  });
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}
