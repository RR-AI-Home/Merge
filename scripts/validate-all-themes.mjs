import { readdir, readFile } from 'node:fs/promises';
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

const themeIds = (await readdir('themes', { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let failed = false;

for (const themeId of themeIds) {
  const theme = await loadTheme(themeId);
  const result = validateThemeBundle(theme);

  if (!result.ok) {
    failed = true;
    console.error(`${themeId} failed validation:`);
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
  } else {
    console.log(`${themeId} passed validation`);
  }
}

if (failed) {
  process.exitCode = 1;
}
