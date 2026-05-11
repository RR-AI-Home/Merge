import test from 'node:test';
import assert from 'node:assert/strict';
import { claimDailyReward } from '../packages/retention-engine/src/index.js';
import { createAnalyticsEvent } from '../packages/analytics/src/index.js';
import { createCosmeticSku } from '../packages/monetization/src/index.js';

test('claimDailyReward grants day one reward once per calendar day', () => {
  const save = { coins: 0, dailyReward: { streak: 0, lastClaimDay: null } };
  const result = claimDailyReward(save, { calendarDay: '2026-05-10' });

  assert.equal(result.ok, true);
  assert.equal(result.save.coins, 25);
  assert.equal(result.save.dailyReward.streak, 1);
  assert.equal(result.save.dailyReward.lastClaimDay, '2026-05-10');

  const second = claimDailyReward(result.save, { calendarDay: '2026-05-10' });
  assert.equal(second.ok, false);
  assert.equal(second.reason, 'already_claimed_today');
});

test('claimDailyReward does not mutate the original save object', () => {
  const save = { coins: 0, premium: 0, dailyReward: { streak: 0, lastClaimDay: null } };
  const result = claimDailyReward(save, { calendarDay: '2026-05-10' });

  assert.notEqual(result.save, save);
  assert.deepEqual(save, { coins: 0, premium: 0, dailyReward: { streak: 0, lastClaimDay: null } });
});

test('mutating a claimed reward does not affect later reward payouts', () => {
  const first = claimDailyReward(
    { coins: 0, dailyReward: { streak: 0, lastClaimDay: null } },
    { calendarDay: '2026-05-10' }
  );

  first.reward.coins = 999;

  const later = claimDailyReward(
    { coins: 0, dailyReward: { streak: 0, lastClaimDay: null } },
    { calendarDay: '2026-05-11' }
  );

  assert.equal(later.reward.coins, 25);
  assert.equal(later.save.coins, 25);
});

test('claimDailyReward grants premium on the seventh day of the reward cycle', () => {
  let save = { coins: 0, premium: 0, dailyReward: { streak: 0, lastClaimDay: null } };
  let result;

  for (let day = 10; day <= 16; day += 1) {
    result = claimDailyReward(save, { calendarDay: `2026-05-${day}` });
    save = result.save;
  }

  assert.equal(result.reward.coins, 100);
  assert.equal(result.reward.premium, 1);
  assert.equal(result.save.coins, 390);
  assert.equal(result.save.premium, 1);
  assert.equal(result.save.dailyReward.streak, 7);
});

test('createAnalyticsEvent uses stable shared envelope fields', () => {
  const event = createAnalyticsEvent({
    appId: 'com.mergeplatform.syndicate',
    themeId: 'cyber-syndicate',
    name: 'merge_completed',
    payload: { itemId: 'chip_2' },
    timestamp: '2026-05-10T18:00:00.000Z'
  });

  assert.deepEqual(event, {
    appId: 'com.mergeplatform.syndicate',
    themeId: 'cyber-syndicate',
    name: 'merge_completed',
    payload: { itemId: 'chip_2' },
    timestamp: '2026-05-10T18:00:00.000Z',
    schemaVersion: 1
  });
});

test('createAnalyticsEvent snapshots payload fields', () => {
  const payload = { itemId: 'chip_2' };
  const event = createAnalyticsEvent({
    appId: 'com.mergeplatform.syndicate',
    themeId: 'cyber-syndicate',
    name: 'merge_completed',
    payload,
    timestamp: '2026-05-10T18:00:00.000Z'
  });

  payload.itemId = 'chip_3';

  assert.notEqual(event.payload, payload);
  assert.deepEqual(event.payload, { itemId: 'chip_2' });
});

test('createCosmeticSku marks foundation purchases as non-pay-to-win', () => {
  const sku = createCosmeticSku({
    id: 'cyber_board_skin_01',
    name: 'Neon Board Skin',
    priceTier: 'standard'
  });

  assert.equal(sku.id, 'cyber_board_skin_01');
  assert.equal(sku.name, 'Neon Board Skin');
  assert.equal(sku.priceTier, 'standard');
  assert.equal(sku.category, 'cosmetic');
  assert.equal(sku.payToWin, false);
});
