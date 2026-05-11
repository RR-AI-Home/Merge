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
