import test from 'node:test';
import assert from 'node:assert/strict';
import { syndicateIdentity } from '../apps/merge-syndicate/src/appIdentity.js';
import { kingdomLiteIdentity } from '../apps/merge-kingdom-lite/src/appIdentity.js';
import { loadAppIdentityOutputs, validateAppIdentityOutputs } from '../scripts/smoke-app.mjs';

const appOutputs = await loadAppIdentityOutputs();

test('standalone app outputs keep separate identity', () => {
  assert.equal(syndicateIdentity.themeId, 'cyber-syndicate');
  assert.equal(kingdomLiteIdentity.themeId, 'kingdom-lite');
  assert.notEqual(syndicateIdentity.appId, kingdomLiteIdentity.appId);
  assert.notEqual(syndicateIdentity.saveNamespace, kingdomLiteIdentity.saveNamespace);
  assert.notEqual(syndicateIdentity.analyticsStream, kingdomLiteIdentity.analyticsStream);
  assert.notEqual(syndicateIdentity.themeId, kingdomLiteIdentity.themeId);
});

test('standalone app configs match their JavaScript identity exports', () => {
  const outputsBySlug = new Map(appOutputs.map((output) => [output.config.slug, output]));

  assert.equal(outputsBySlug.has('merge-kingdom-lite'), true);
  assert.equal(outputsBySlug.has('merge-syndicate'), true);

  for (const { config, identity } of appOutputs) {
    assert.deepEqual(identity, config, `${config.slug} appIdentity.js must match app.config.json`);
  }
});

test('app identity validation rejects duplicate theme IDs', () => {
  const baseIdentity = {
    name: 'Test App',
    slug: 'test-app',
    appId: 'com.mergeplatform.test',
    themeId: 'shared-theme',
    saveNamespace: 'test-save-v1',
    analyticsStream: 'test_stream'
  };
  const duplicateThemeIdentity = {
    ...baseIdentity,
    name: 'Other App',
    slug: 'other-app',
    appId: 'com.mergeplatform.other',
    saveNamespace: 'other-save-v1',
    analyticsStream: 'other_stream'
  };

  const errors = validateAppIdentityOutputs([
    { config: baseIdentity, identity: baseIdentity },
    { config: duplicateThemeIdentity, identity: duplicateThemeIdentity }
  ]);

  assert.deepEqual(errors, ['App identities must use unique themeId']);
});
