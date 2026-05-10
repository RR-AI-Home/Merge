export function spendEnergy(state, amount) {
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
    return state;
  }

  return {
    ...state,
    energy: Math.min(maxEnergy, state.energy + gained),
    lastEnergyAt: nowSeconds
  };
}

export function canCompleteOrder(inventory, order) {
  return order.requires.every((requirement) => {
    return (inventory[requirement.itemId] ?? 0) >= requirement.count;
  });
}

export function completeOrder({ inventory, state, order }) {
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
