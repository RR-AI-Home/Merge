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

test('spendEnergy rejects insufficient energy', () => {
  const result = spendEnergy({ energy: 1, coins: 0, premium: 0, xp: 0 }, 2);

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'not_enough_energy');
});

test('refillEnergy restores energy based on elapsed time', () => {
  const state = { energy: 3, coins: 0, premium: 0, xp: 0, lastEnergyAt: 1000 };
  const result = refillEnergy(state, { nowSeconds: 1240, refillSeconds: 120, maxEnergy: 10 });

  assert.equal(result.energy, 5);
  assert.equal(result.lastEnergyAt, 1240);
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
