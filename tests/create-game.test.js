import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  createGame,
  createGamePlan,
  parseCreateGameArgs
} from '../scripts/create-game.mjs';
import { validateThemeBundle } from '../packages/theme-contracts/src/index.js';

test('createGamePlan derives standalone identity and theme paths', () => {
  const plan = createGamePlan({
    slug: 'merge-space-colony',
    name: 'Merge Space Colony',
    themeId: 'space-colony',
    appId: 'com.mergeplatform.spacecolony'
  });

  assert.equal(plan.identity.name, 'Merge Space Colony');
  assert.equal(plan.identity.slug, 'merge-space-colony');
  assert.equal(plan.identity.appId, 'com.mergeplatform.spacecolony');
  assert.equal(plan.identity.themeId, 'space-colony');
  assert.equal(plan.identity.saveNamespace, 'merge-space-colony-save-v1');
  assert.equal(plan.identity.analyticsStream, 'merge_space_colony_validation');
  assert.equal(plan.paths.appDir, path.join('apps', 'merge-space-colony'));
  assert.equal(plan.paths.themeDir, path.join('themes', 'space-colony'));
  assert.equal(plan.files.length, 16);
});

test('parseCreateGameArgs requires core identity fields', () => {
  assert.throws(() => parseCreateGameArgs(['--slug', 'merge-test']), /Missing required --name/);

  assert.deepEqual(parseCreateGameArgs([
    '--root-dir', 'C:\\tmp\\merge-generator',
    '--slug', 'merge-test',
    '--name', 'Merge Test',
    '--theme-id', 'test-theme',
    '--app-id', 'com.mergeplatform.test'
  ]), {
    rootDir: 'C:\\tmp\\merge-generator',
    slug: 'merge-test',
    name: 'Merge Test',
    themeId: 'test-theme',
    appId: 'com.mergeplatform.test'
  });
});

test('createGame writes a valid standalone app and theme without touching existing outputs', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'merge-create-game-'));

  try {
    const result = await createGame({
      rootDir: root,
      slug: 'merge-space-colony',
      name: 'Merge Space Colony',
      themeId: 'space-colony',
      appId: 'com.mergeplatform.spacecolony'
    });

    assert.equal(result.createdFiles.length, 16);
    assert.equal(existsSync(path.join(root, 'apps', 'merge-space-colony', 'web', 'index.html')), true);
    assert.equal(existsSync(path.join(root, 'apps', 'merge-space-colony', 'src', 'gameSession.js')), true);
    assert.equal(existsSync(path.join(root, 'themes', 'space-colony', 'theme.config.json')), true);

    const appConfig = JSON.parse(await readFile(
      path.join(root, 'apps', 'merge-space-colony', 'app.config.json'),
      'utf8'
    ));
    const theme = {
      config: JSON.parse(await readFile(path.join(root, 'themes', 'space-colony', 'theme.config.json'), 'utf8')),
      itemChains: JSON.parse(await readFile(path.join(root, 'themes', 'space-colony', 'item-chains.json'), 'utf8')),
      producers: JSON.parse(await readFile(path.join(root, 'themes', 'space-colony', 'producers.json'), 'utf8')),
      orders: JSON.parse(await readFile(path.join(root, 'themes', 'space-colony', 'orders.json'), 'utf8')),
      worldMap: JSON.parse(await readFile(path.join(root, 'themes', 'space-colony', 'world-map.json'), 'utf8')),
      events: JSON.parse(await readFile(path.join(root, 'themes', 'space-colony', 'events.json'), 'utf8')),
      tuning: JSON.parse(await readFile(path.join(root, 'themes', 'space-colony', 'tuning.json'), 'utf8')),
      copy: JSON.parse(await readFile(path.join(root, 'themes', 'space-colony', 'copy.json'), 'utf8'))
    };
    const appJs = await readFile(path.join(root, 'apps', 'merge-space-colony', 'web', 'app.js'), 'utf8');

    assert.equal(appConfig.slug, 'merge-space-colony');
    assert.equal(appConfig.themeId, 'space-colony');
    assert.match(appJs, /bootMergeBrowserApp/);
    assert.match(appJs, /merge-space-colony-prototype-save/);
    assert.equal(validateThemeBundle(theme).ok, true);

    await assert.rejects(() => createGame({
      rootDir: root,
      slug: 'merge-space-colony',
      name: 'Merge Space Colony',
      themeId: 'space-colony',
      appId: 'com.mergeplatform.spacecolony'
    }), /Refusing to overwrite/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
