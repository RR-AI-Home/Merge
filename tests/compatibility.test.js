import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateThemeBundle } from '../packages/theme-contracts/src/index.js';

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function loadTheme(themeId) {
  const root = join('themes', themeId);
  return {
    config: await readJson(join(root, 'theme.config.json')),
    itemChains: await readJson(join(root, 'item-chains.json')),
    producers: await readJson(join(root, 'producers.json')),
    orders: await readJson(join(root, 'orders.json')),
    worldMap: await readJson(join(root, 'world-map.json')),
    events: await readJson(join(root, 'events.json')),
    tuning: await readJson(join(root, 'tuning.json')),
    copy: await readJson(join(root, 'copy.json'))
  };
}

test('all foundation themes satisfy the shared theme contract', async () => {
  for (const themeId of ['cyber-syndicate', 'kingdom-lite']) {
    const theme = await loadTheme(themeId);
    const result = validateThemeBundle(theme);
    assert.equal(result.ok, true, `${themeId}: ${result.errors.join(', ')}`);
  }
});

test('foundation themes use separate app identities', async () => {
  const cyber = await loadTheme('cyber-syndicate');
  const kingdom = await loadTheme('kingdom-lite');

  assert.notEqual(cyber.config.id, kingdom.config.id);
  assert.notEqual(cyber.config.displayName, kingdom.config.displayName);
  assert.notEqual(cyber.config.appId, kingdom.config.appId);
});
