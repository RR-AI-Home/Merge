import test from 'node:test';
import assert from 'node:assert/strict';
import {
  spendEnergy,
  refillEnergy,
  canCompleteOrder,
  completeOrder
} from '../packages/economy-engine/src/index.js';

test('spendEnergy subtracts available energy', () => {
  const result = spendEnergy({ energy: 5, coins: 0, premium: 0, xp: 0 }, 2);

  assert.equal(result.ok, true);
  assert.equal(result.state.energy, 3);
});

test('spendEnergy does not mutate original state', () => {
  const state = { energy: 5, coins: 0, premium: 0, xp: 0 };
  const result = spendEnergy(state, 2);

  assert.notEqual(result.state, state);
  assert.equal(state.energy, 5);
  assert.equal(result.state.energy, 3);
});

test('spendEnergy rejects insufficient energy', () => {
  const result = spendEnergy({ energy: 1, coins: 0, premium: 0, xp: 0 }, 2);

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'not_enough_energy');
});

test('spendEnergy rejects invalid spend amounts', () => {
  const state = { energy: 5, coins: 0, premium: 0, xp: 0 };
  const result = spendEnergy(state, 0);

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid_energy_amount');
  assert.equal(result.state, state);
});

test('refillEnergy initializes missing lastEnergyAt', () => {
  const state = { energy: 3, coins: 0, premium: 0, xp: 0 };
  const result = refillEnergy(state, { nowSeconds: 1240, refillSeconds: 120, maxEnergy: 10 });

  assert.equal(result.energy, 3);
  assert.equal(result.lastEnergyAt, 1240);
});

test('refillEnergy restores energy based on elapsed time', () => {
  const state = { energy: 3, coins: 0, premium: 0, xp: 0, lastEnergyAt: 1000 };
  const result = refillEnergy(state, { nowSeconds: 1240, refillSeconds: 120, maxEnergy: 10 });

  assert.equal(result.energy, 5);
  assert.equal(result.lastEnergyAt, 1240);
});

test('refillEnergy preserves partial refill progress', () => {
  const state = { energy: 3, coins: 0, premium: 0, xp: 0, lastEnergyAt: 1000 };
  const result = refillEnergy(state, { nowSeconds: 1270, refillSeconds: 120, maxEnergy: 10 });

  assert.equal(result.energy, 5);
  assert.equal(result.lastEnergyAt, 1240);
});

test('refillEnergy caps at maxEnergy', () => {
  const state = { energy: 9, coins: 0, premium: 0, xp: 0, lastEnergyAt: 1000 };
  const result = refillEnergy(state, { nowSeconds: 1400, refillSeconds: 120, maxEnergy: 10 });

  assert.equal(result.energy, 10);
  assert.equal(result.lastEnergyAt, 1400);
});

test('completeOrder consumes required items and grants rewards', () => {
  const inventory = { chip_2: 1, wire_2: 1 };
  const state = { energy: 5, coins: 0, premium: 0, xp: 0 };
  const order = {
    id: 'signal_scrambler_1',
    requires: [
      { itemId: 'chip_2', count: 1 },
      { itemId: 'wire_2', count: 1 }
    ],
    rewards: { coins: 35, xp: 8 }
  };

  assert.equal(canCompleteOrder(inventory, order), true);

  const result = completeOrder({ inventory, state, order });

  assert.equal(result.ok, true);
  assert.deepEqual(result.inventory, { chip_2: 0, wire_2: 0 });
  assert.equal(result.state.coins, 35);
  assert.equal(result.state.xp, 8);
});

test('completeOrder does not mutate original inventory or state', () => {
  const inventory = { chip_2: 1, wire_2: 1 };
  const state = { energy: 5, coins: 0, premium: 0, xp: 0 };
  const order = {
    id: 'signal_scrambler_1',
    requires: [
      { itemId: 'chip_2', count: 1 },
      { itemId: 'wire_2', count: 1 }
    ],
    rewards: { coins: 35, xp: 8 }
  };

  const result = completeOrder({ inventory, state, order });

  assert.notEqual(result.inventory, inventory);
  assert.notEqual(result.state, state);
  assert.deepEqual(inventory, { chip_2: 1, wire_2: 1 });
  assert.deepEqual(state, { energy: 5, coins: 0, premium: 0, xp: 0 });
});

test('completeOrder rejects missing requirements without mutating originals', () => {
  const inventory = { chip_2: 1, wire_2: 0 };
  const state = { energy: 5, coins: 0, premium: 0, xp: 0 };
  const order = {
    id: 'signal_scrambler_1',
    requires: [
      { itemId: 'chip_2', count: 1 },
      { itemId: 'wire_2', count: 1 }
    ],
    rewards: { coins: 35, xp: 8 }
  };

  assert.equal(canCompleteOrder(inventory, order), false);

  const result = completeOrder({ inventory, state, order });

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'requirements_missing');
  assert.equal(result.inventory, inventory);
  assert.equal(result.state, state);
  assert.deepEqual(inventory, { chip_2: 1, wire_2: 0 });
  assert.deepEqual(state, { energy: 5, coins: 0, premium: 0, xp: 0 });
});

test('duplicate requirements cannot exceed combined inventory count', () => {
  const inventory = { chip_2: 1 };
  const state = { energy: 5, coins: 0, premium: 0, xp: 0 };
  const order = {
    id: 'duplicate_chip_order',
    requires: [
      { itemId: 'chip_2', count: 1 },
      { itemId: 'chip_2', count: 1 }
    ],
    rewards: { coins: 35, xp: 8 }
  };

  assert.equal(canCompleteOrder(inventory, order), false);

  const result = completeOrder({ inventory, state, order });

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'requirements_missing');
  assert.equal(result.inventory, inventory);
  assert.equal(result.state, state);
  assert.deepEqual(inventory, { chip_2: 1 });
});

test('duplicate requirements complete when combined inventory is available', () => {
  const inventory = { chip_2: 2 };
  const state = { energy: 5, coins: 0, premium: 0, xp: 0 };
  const order = {
    id: 'duplicate_chip_order',
    requires: [
      { itemId: 'chip_2', count: 1 },
      { itemId: 'chip_2', count: 1 }
    ],
    rewards: { coins: 35, xp: 8 }
  };

  assert.equal(canCompleteOrder(inventory, order), true);

  const result = completeOrder({ inventory, state, order });

  assert.equal(result.ok, true);
  assert.deepEqual(result.inventory, { chip_2: 0 });
});

test('orders with invalid requirement counts cannot be completed', () => {
  const inventory = { chip_2: 1 };
  const state = { energy: 5, coins: 0, premium: 0, xp: 0 };
  const order = {
    id: 'bad_order',
    requires: [{ itemId: 'chip_2', count: 0 }],
    rewards: { coins: 35, xp: 8 }
  };

  assert.equal(canCompleteOrder(inventory, order), false);

  const result = completeOrder({ inventory, state, order });

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid_order_requirement');
  assert.equal(result.inventory, inventory);
  assert.equal(result.state, state);
});
