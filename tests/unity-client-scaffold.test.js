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
  assert.match(controller, /CreateProceduralItemIcon/);
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
  assert.match(controller, /MobileContentWidth = 388f/);
  assert.match(controller, /private const float TileSize = 58f/);
  assert.match(controller, /private const float TileGap = 4f/);
  assert.match(controller, /CreateOrdersPanel[\s\S]*new Vector2\(MobileContentWidth, 176f\)/);
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

  assert.match(controller, /CreatePanel\("HUD"[\s\S]*new Vector2\(0f, -18f\)[\s\S]*new Vector2\(MobileContentWidth, 110f\)/);
  assert.match(controller, /CreateText\("Title"[\s\S]*new Vector2\(0f, 8f\)/);
  assert.match(controller, /CreatePanel\("Merge Board"[\s\S]*new Vector2\(0f, -334f\)/);
  assert.match(controller, /CreatePanel\("Orders Panel"[\s\S]*new Vector2\(0f, -570f\)[\s\S]*new Vector2\(MobileContentWidth, 176f\)/);
  assert.match(controller, /new Vector2\(0f, -20f - index \* 68f\)/);
});

test('Unity MergeClient lower rail avoids header and status overlap', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /statusLabel = CreateText\("HUD Status"/);
  assert.doesNotMatch(controller, /CreateText\("Orders Header"/);
  assert.doesNotMatch(controller, /CreateText\("Board Status"/);
  assert.match(controller, /new Vector2\(0f, -20f - index \* 68f\)/);
});

test('Unity MergeClient includes production polish systems for the gameplay screen', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /CreateProceduralItemIcon/);
  assert.match(controller, /CreateChipMark/);
  assert.match(controller, /CreateDroneMark/);
  assert.match(controller, /CreateBoardSlot/);
  assert.match(controller, /boardSlotHighlights/);
  assert.match(controller, /UpdateSlotHighlight/);
  assert.match(controller, /CreateOrderProgressBar/);
  assert.match(controller, /CreateRewardRow/);
  assert.match(controller, /CreateBottomNav/);
  assert.match(controller, /PlayMergeFeedback/);
  assert.match(controller, /PlayMergeSound/);
});
