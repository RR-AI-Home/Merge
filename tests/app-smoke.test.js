import test from 'node:test';
import assert from 'node:assert/strict';
import { syndicateIdentity } from '../apps/merge-syndicate/src/appIdentity.js';
import { kingdomLiteIdentity } from '../apps/merge-kingdom-lite/src/appIdentity.js';

test('standalone app outputs keep separate identity', () => {
  assert.equal(syndicateIdentity.themeId, 'cyber-syndicate');
  assert.equal(kingdomLiteIdentity.themeId, 'kingdom-lite');
  assert.notEqual(syndicateIdentity.appId, kingdomLiteIdentity.appId);
  assert.notEqual(syndicateIdentity.saveNamespace, kingdomLiteIdentity.saveNamespace);
  assert.notEqual(syndicateIdentity.analyticsStream, kingdomLiteIdentity.analyticsStream);
});
