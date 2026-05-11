import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRootDir = path.resolve(scriptDir, '..');

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function loadTheme(rootDir, themeId) {
  const themeRoot = path.join(rootDir, 'themes', themeId);

  return {
    config: await readJson(path.join(themeRoot, 'theme.config.json')),
    itemChains: await readJson(path.join(themeRoot, 'item-chains.json')),
    producers: await readJson(path.join(themeRoot, 'producers.json')),
    orders: await readJson(path.join(themeRoot, 'orders.json')),
    worldMap: await readJson(path.join(themeRoot, 'world-map.json')),
    events: await readJson(path.join(themeRoot, 'events.json')),
    tuning: await readJson(path.join(themeRoot, 'tuning.json')),
    copy: await readJson(path.join(themeRoot, 'copy.json'))
  };
}

async function loadIdentity(appDir, config) {
  const identityModule = await import(pathToFileURL(path.join(appDir, 'src', 'appIdentity.js')).href);
  return Object.values(identityModule).find((value) => value?.slug === config.slug);
}

export async function loadPlayableAppOutputs(rootDir = defaultRootDir) {
  const appsDir = path.join(rootDir, 'apps');
  const appEntries = await readdir(appsDir, { withFileTypes: true });
  const outputs = [];

  for (const entry of appEntries.filter((candidate) => candidate.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const appDir = path.join(appsDir, entry.name);
    const configPath = path.join(appDir, 'app.config.json');
    if (!existsSync(configPath)) {
      continue;
    }

    const config = await readJson(configPath);
    const identity = await loadIdentity(appDir, config);
    const session = await import(pathToFileURL(path.join(appDir, 'src', 'gameSession.js')).href);
    const theme = await loadTheme(rootDir, config.themeId);

    outputs.push({
      appDir,
      config,
      identity,
      session,
      theme,
      web: {
        indexPath: path.join(appDir, 'web', 'index.html'),
        appPath: path.join(appDir, 'web', 'app.js')
      }
    });
  }

  return outputs;
}

function hasRequiredFunction(session, name) {
  return typeof session?.[name] === 'function';
}

export function validatePlayableAppOutputs(outputs) {
  const errors = [];

  for (const output of outputs) {
    const slug = output.identity?.slug ?? output.config?.slug ?? '<missing slug>';

    if (!output.identity?.saveNamespace) {
      errors.push(`${slug} is missing saveNamespace`);
      continue;
    }

    if (!existsSync(output.web.indexPath)) {
      errors.push(`${slug} is missing web/index.html`);
    }

    if (!existsSync(output.web.appPath)) {
      errors.push(`${slug} is missing web/app.js`);
    }

    for (const functionName of [
      'createInitialSave',
      'tapPrimaryProducer',
      'getOpenOrders',
      'getSessionGoal',
      'describeBoardCell'
    ]) {
      if (!hasRequiredFunction(output.session, functionName)) {
        errors.push(`${slug} session is missing ${functionName}`);
      }
    }

    if (errors.some((error) => error.startsWith(slug))) {
      continue;
    }

    const save = output.session.createInitialSave(output.theme, { nowSeconds: 1000 });
    if (save.appId !== output.identity.appId) {
      errors.push(`${slug} save appId does not match identity`);
    }

    if (save.saveNamespace !== output.identity.saveNamespace) {
      errors.push(`${slug} saveNamespace does not match identity`);
    }

    if (save.themeId !== output.identity.themeId) {
      errors.push(`${slug} save themeId does not match identity`);
    }

    const openOrders = output.session.getOpenOrders(save, output.theme);
    if (openOrders.length === 0) {
      errors.push(`${slug} has no playable starting orders`);
    }

    const tap = output.session.tapPrimaryProducer(save, output.theme, { nowSeconds: 1000 });
    if (!tap.ok) {
      errors.push(`${slug} cannot tap its primary producer: ${tap.reason}`);
      continue;
    }

    if (tap.save.energy >= save.energy) {
      errors.push(`${slug} producer tap did not spend energy`);
    }

    const firstItem = tap.save.board.cells.find((cell) => cell.item)?.item ?? null;
    if (!firstItem) {
      errors.push(`${slug} producer tap did not place an item`);
      continue;
    }

    const described = output.session.describeBoardCell({ x: 0, y: 0, item: firstItem }, output.theme);
    if (!described.label || !described.itemId) {
      errors.push(`${slug} cannot describe its first produced item`);
    }

    const goal = output.session.getSessionGoal(tap.save, output.theme);
    if (!goal.label || !goal.action) {
      errors.push(`${slug} does not expose a usable session goal`);
    }
  }

  return errors;
}

async function main() {
  const outputs = await loadPlayableAppOutputs();
  const errors = validatePlayableAppOutputs(outputs);

  if (errors.length === 0) {
    console.log(`All ${outputs.length} standalone apps passed playable checks`);
    return;
  }

  for (const error of errors) {
    console.error(error);
  }

  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
