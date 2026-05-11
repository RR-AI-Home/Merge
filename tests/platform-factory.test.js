import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import {
  completeOrderFromBoard as completeKingdomOrder,
  createInitialSave as createKingdomSave,
  getChapterProgress as getKingdomProgress,
  getEventRail as getKingdomEventRail,
  mergeBoardCells as mergeKingdomCells,
  tapPrimaryProducer as tapKingdomProducer
} from '../apps/merge-kingdom-lite/src/gameSession.js';
import { loadMergeKingdomLiteTheme } from '../apps/merge-kingdom-lite/src/themeLoader.js';
import {
  createInitialSave as createSyndicateSave,
  tapPrimaryProducer as tapSyndicateProducer
} from '../apps/merge-syndicate/src/gameSession.js';
import { loadMergeSyndicateTheme } from '../apps/merge-syndicate/src/themeLoader.js';

test('standalone prototype apps create separate saves from the shared session factory', () => {
  const syndicateTheme = loadMergeSyndicateTheme();
  const kingdomTheme = loadMergeKingdomLiteTheme();

  const syndicate = createSyndicateSave(syndicateTheme, { nowSeconds: 1000 });
  const kingdom = createKingdomSave(kingdomTheme, { nowSeconds: 1000 });

  assert.equal(syndicate.appId, 'com.mergeplatform.syndicate');
  assert.equal(kingdom.appId, 'com.mergeplatform.kingdomlite');
  assert.equal(syndicate.themeId, 'cyber-syndicate');
  assert.equal(kingdom.themeId, 'kingdom-lite');
  assert.equal(syndicate.saveNamespace, 'merge-syndicate-save-v1');
  assert.equal(kingdom.saveNamespace, 'merge-kingdom-lite-save-v1');
  assert.notEqual(syndicate.saveNamespace, kingdom.saveNamespace);
  assert.equal(syndicate.energy, 50);
  assert.equal(kingdom.energy, 40);
});

test('theme-specific onboarding queues run through the same producer API', () => {
  const syndicateTheme = loadMergeSyndicateTheme();
  const kingdomTheme = loadMergeKingdomLiteTheme();

  const syndicateTap = tapSyndicateProducer(
    createSyndicateSave(syndicateTheme, { nowSeconds: 1000 }),
    syndicateTheme,
    { nowSeconds: 1000 }
  );
  const kingdomTap = tapKingdomProducer(
    createKingdomSave(kingdomTheme, { nowSeconds: 1000 }),
    kingdomTheme,
    { nowSeconds: 1000 }
  );

  assert.equal(syndicateTap.save.board.cells[0].item.itemId, 'chip_1');
  assert.equal(kingdomTap.save.board.cells[0].item.itemId, 'twig_1');
});

test('kingdom lite can finish its standalone order and unlock its event rail', () => {
  const theme = loadMergeKingdomLiteTheme();
  let save = createKingdomSave(theme, { nowSeconds: 1000 });

  for (let index = 0; index < 4; index += 1) {
    save = tapKingdomProducer(save, theme, { nowSeconds: 1000 + index }).save;
  }

  save = mergeKingdomCells(save, theme, {
    from: { x: 0, y: 0 },
    to: { x: 1, y: 0 }
  }).save;
  save = mergeKingdomCells(save, theme, {
    from: { x: 2, y: 0 },
    to: { x: 3, y: 0 }
  }).save;

  const completed = completeKingdomOrder(save, theme, 'repair_gate_1');

  assert.equal(completed.ok, true);
  assert.deepEqual(getKingdomProgress(completed.save, theme), {
    completed: 1,
    target: 1,
    currentDistrictTitle: 'Village Green',
    nextDistrictTitle: null,
    isChapterComplete: true
  });
  assert.deepEqual(getKingdomEventRail(completed.save, theme), {
    status: 'active',
    title: 'Harvest Day',
    detail: 'Timed orders are active in Village Green.'
  });
});

test('standalone browser apps use the shared shell without a theme switcher', () => {
  const syndicateRoot = new URL('../apps/merge-syndicate/web/', import.meta.url);
  const kingdomRoot = new URL('../apps/merge-kingdom-lite/web/', import.meta.url);

  for (const root of [syndicateRoot, kingdomRoot]) {
    assert.equal(existsSync(new URL('index.html', root)), true);
    assert.equal(existsSync(new URL('app.js', root)), true);
  }

  const syndicateApp = readFileSync(new URL('app.js', syndicateRoot), 'utf8');
  const kingdomApp = readFileSync(new URL('app.js', kingdomRoot), 'utf8');

  assert.match(syndicateApp, /bootMergeBrowserApp/);
  assert.match(kingdomApp, /bootMergeBrowserApp/);
  assert.match(syndicateApp, /merge-syndicate-prototype-save/);
  assert.match(kingdomApp, /merge-kingdom-lite-prototype-save/);
  assert.doesNotMatch(syndicateApp, /themeSwitcher|theme-selector/);
  assert.doesNotMatch(kingdomApp, /themeSwitcher|theme-selector/);
});
