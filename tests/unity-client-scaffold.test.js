import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

test('Unity MergeClient controller contains the production UI board loop', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /using UnityEngine\.UI;/);
  assert.match(controller, /private RectTransform boardPanel;/);
  assert.match(controller, /private readonly Dictionary<Vector2Int, RectTransform> boardSlots/);
  assert.match(controller, /CreateHud/);
  assert.match(controller, /CreateBoard/);
  assert.match(controller, /CreateItemCard/);
  assert.match(controller, /CreateItemIcon/);
  assert.match(controller, /BoardItemDragHandler/);
  assert.match(controller, /TryFindDropTargetTile/);
  assert.match(controller, /TryMergeWith/);
  assert.match(controller, /CanMerge/);
  assert.match(controller, /CreateMergedTile/);
  assert.match(controller, /new SeededTile\("chip_1", 1, 1\)/);
  assert.match(controller, /new SeededTile\("chip_1", 2, 1\)/);
});

test('Unity MergeClient controller contains production HUD, orders, and producer loop', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /CreateOrdersPanel/);
  assert.match(controller, /CreateOrderCard/);
  assert.match(controller, /CreateStatPill/);
  assert.match(controller, /CreateProducerTile/);
  assert.match(controller, /private int currentEnergy;/);
  assert.match(controller, /TryTapProducer/);
  assert.match(controller, /FindFirstEmptySlot/);
  assert.match(controller, /UpdateEnergyLabel/);
  assert.match(controller, /SetStatus\("Board full"/);
  assert.match(controller, /CanvasScaler\.ScaleMode\.ScaleWithScreenSize/);
});

test('Unity project manifest includes uGUI for production UI components', async () => {
  const manifest = JSON.parse(await readFile(
    path.join('unity', 'MergeClient', 'Packages', 'manifest.json'),
    'utf8'
  ));

  assert.equal(manifest.dependencies['com.unity.ugui'], '2.0.0');
});

test('Unity MergeClient screen is sized for mobile portrait without side panels', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /MobileReferenceWidth = 412f/);
  assert.match(controller, /MobileReferenceHeight = 915f/);
  assert.match(controller, /private const float TileSize = 54f/);
  assert.match(controller, /CreateOrdersPanel[\s\S]*new Vector2\(MobileContentWidth, 200f\)/);
  assert.doesNotMatch(controller, /new Vector2\(218f, -24f\)/);
});

test('Unity MergeClient HUD keeps title above resource pills', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /CreateText\("Title"[\s\S]*new Vector2\(0f, 8f\)/);
  assert.match(controller, /CreateStatPill\(hud, "ENERGY", new Vector2\(-126f, -82f\)/);
  assert.match(controller, /CreateStatPill\(hud, "COINS", new Vector2\(0f, -82f\)/);
  assert.match(controller, /CreateStatPill\(hud, "GEMS", new Vector2\(126f, -82f\)/);
  assert.doesNotMatch(controller, /CreateText\("Title"[\s\S]*new Vector2\(0f, -23f\)/);
});

test('Unity MergeClient locks Android builds to portrait orientation', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );
  const builder = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Editor', 'MergeClientProjectBuilder.cs'),
    'utf8'
  );

  assert.match(controller, /Screen\.orientation = ScreenOrientation\.Portrait/);
  assert.match(builder, /PlayerSettings\.defaultInterfaceOrientation = UIOrientation\.Portrait/);
  assert.match(builder, /PlayerSettings\.allowedAutorotateToLandscapeLeft = false/);
  assert.match(builder, /PlayerSettings\.allowedAutorotateToLandscapeRight = false/);
});

test('Unity MergeClient portrait stack uses safe top margin and compact contracts rail', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /CreatePanel\("HUD"[\s\S]*new Vector2\(0f, -28f\)[\s\S]*new Vector2\(MobileContentWidth, 112f\)/);
  assert.match(controller, /CreateText\("Title"[\s\S]*new Vector2\(0f, 8f\)/);
  assert.match(controller, /CreatePanel\("Orders Panel"[\s\S]*new Vector2\(0f, -532f\)[\s\S]*new Vector2\(MobileContentWidth, 200f\)/);
  assert.match(controller, /new Vector2\(0f, -36f - index \* 66f\)/);
});

test('Unity MergeClient lower rail avoids header and status overlap', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /statusLabel = CreateText\("HUD Status"/);
  assert.doesNotMatch(controller, /CreateText\("Orders Header"/);
  assert.doesNotMatch(controller, /CreateText\("Board Status"/);
  assert.match(controller, /new Vector2\(0f, -36f - index \* 66f\)/);
});
