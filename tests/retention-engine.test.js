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
