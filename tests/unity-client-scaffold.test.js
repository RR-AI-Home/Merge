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

test('Unity project manifest includes uGUI and TextMeshPro for production UI components', async () => {
  const manifest = JSON.parse(await readFile(
    path.join('unity', 'MergeClient', 'Packages', 'manifest.json'),
    'utf8'
  ));

  assert.equal(manifest.dependencies['com.unity.ugui'], '2.0.0');
  assert.equal(manifest.dependencies['com.unity.textmeshpro'], '3.2.0');
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
  assert.match(controller, /CreateOrdersPanel[\s\S]*new Vector2\(MobileContentWidth, 190f\)/);
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

  assert.match(controller, /CreatePanel\("HUD"[\s\S]*new Vector2\(0f, -32f\)[\s\S]*new Vector2\(MobileContentWidth, 110f\)/);
  assert.match(controller, /CreateText\("Title"[\s\S]*new Vector2\(0f, 8f\)/);
  assert.match(controller, /CreatePanel\("Merge Board"[\s\S]*new Vector2\(0f, -350f\)/);
  assert.match(controller, /CreatePanel\("Orders Panel"[\s\S]*new Vector2\(0f, -548f\)[\s\S]*new Vector2\(MobileContentWidth, 190f\)/);
  assert.match(controller, /new Vector2\(0f, -24f - index \* 82f\)/);
});

test('Unity MergeClient lower rail avoids header and status overlap', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /statusLabel = CreateText\("HUD Status"/);
  assert.doesNotMatch(controller, /CreateText\("Orders Header"/);
  assert.doesNotMatch(controller, /CreateText\("Board Status"/);
  assert.match(controller, /new Vector2\(0f, -24f - index \* 82f\)/);
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

test('Unity MergeClient contracts can be claimed without overlapping reward UI', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /private RectTransform ordersPanel;/);
  assert.match(controller, /private readonly HashSet<string> completedOrderIds/);
  assert.match(controller, /RefreshOrdersPanel/);
  assert.match(controller, /CreateOrderActionButton/);
  assert.match(controller, /CanCompleteOrder/);
  assert.match(controller, /TryCompleteOrder/);
  assert.match(controller, /CollectRequiredTiles/);
  assert.match(controller, /currentCoins \+= order\.rewards != null \? order\.rewards\.coins : 0;/);
  assert.match(controller, /coinsLabel\.text = \$"COINS \{currentCoins\}"/);
  assert.match(controller, /SetStatus\(BuildCompletionStatus\(order\)\)/);
  assert.doesNotMatch(controller, /CreatePanel\("Coin Reward Icon"/);
  assert.doesNotMatch(controller, /CreateText\("XP Reward Text"/);
});

test('Unity MergeClient board polish keeps mobile items and nav readable', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /CreateTierFrame/);
  assert.match(controller, /CreateTierPips/);
  assert.match(controller, /CreateLevelBadge/);
  assert.match(controller, /CreateItemDisplayLabel/);
  assert.match(controller, /CreateProceduralItemIcon\(card, itemId, level\.level, ItemAccent\(itemId\)\)/);
  assert.match(controller, /CreateChipMark\(icon, tier\)/);
  assert.match(controller, /CreateWireMark\(icon, tier\)/);
  assert.match(controller, /CreateDroneMark\(icon, tier\)/);
  assert.match(controller, /CreateCacheMark\(icon, tier\)/);
  assert.match(controller, /CreateOrderStateStripe/);
  assert.match(controller, /CreateNavIcon/);
  assert.match(controller, /new Vector2\(86f, 46f\)/);
  assert.match(controller, /CreateText\("Nav Label"[\s\S]*new Vector2\(0f, -11f\)[\s\S]*new Vector2\(72f, 14f\)/);
});

test('Unity MergeClient portrait layout keeps top and bottom safe spacing', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /CreatePanel\("HUD"[\s\S]*new Vector2\(0f, -32f\)[\s\S]*new Vector2\(MobileContentWidth, 110f\)/);
  assert.match(controller, /CreatePanel\("Merge Board"[\s\S]*new Vector2\(0f, -350f\)/);
  assert.match(controller, /CreatePanel\("Orders Panel"[\s\S]*new Vector2\(0f, -548f\)[\s\S]*new Vector2\(MobileContentWidth, 190f\)/);
  assert.match(controller, /CreatePanel\("Bottom Nav"[\s\S]*new Vector2\(0f, 44f\)[\s\S]*new Vector2\(MobileContentWidth, 56f\)/);
  assert.match(controller, /CreateNavButton\(nav, "BOARD", new Vector2\(-144f, 30f\)/);
  assert.doesNotMatch(controller, /CreatePanel\("Bottom Nav"[\s\S]*new Vector2\(0f, 18f\)/);
});

test('Unity MergeClient supports order queue, progression, producer depth, and local saves', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /private const int VisibleOrderLimit = 2;/);
  assert.match(controller, /CreateOrderQueueEmpty/);
  assert.match(controller, /if \(completedOrderIds\.Contains\(order\.id\)\)[\s\S]*continue;/);
  assert.match(controller, /UpdateDistrictProgress/);
  assert.match(controller, /GetCurrentDistrict/);
  assert.match(controller, /BuildCompletionStatus/);
  assert.match(controller, /producerTapsRemaining/);
  assert.match(controller, /producerCooldownReadyAt/);
  assert.match(controller, /RefreshProducerCooldown/);
  assert.match(controller, /StartProducerCooldown/);
  assert.match(controller, /SelectWeightedDrop/);
  assert.match(controller, /SaveGame/);
  assert.match(controller, /TryLoadGame/);
  assert.match(controller, /PlayerPrefs\.SetString/);
  assert.match(controller, /PlayerPrefs\.GetString/);
  assert.match(controller, /MergeClientSaveData/);
  assert.match(controller, /SavedBoardItem/);
});

test('Cyber Syndicate Unity source theme has enough order and producer depth for progression', async () => {
  const orders = JSON.parse(await readFile(path.join('themes', 'cyber-syndicate', 'orders.json'), 'utf8'));
  const producers = JSON.parse(await readFile(path.join('themes', 'cyber-syndicate', 'producers.json'), 'utf8'));

  assert.ok(orders.length >= 5);
  assert.ok(orders.some((order) => order.id === 'district_takeover_1'));
  assert.ok(producers[0].drops.some((drop) => drop.itemId === 'chip_2'));
  assert.ok(producers[0].drops.some((drop) => drop.itemId === 'wire_2'));
  assert.ok(producers[0].drops.some((drop) => drop.itemId === 'drone_2'));
  assert.ok(producers[0].drops.some((drop) => drop.itemId === 'cache_2'));
});

test('Unity MergeClient text stays crisp and avoids contract stripe overlap', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /using TMPro;/);
  assert.match(controller, /using UnityEngine\.TextCore\.LowLevel;/);
  assert.match(controller, /private TextMeshProUGUI energyLabel;/);
  assert.match(controller, /private TMP_FontAsset uiFontAsset;/);
  assert.match(controller, /LoadProjectTmpFontAsset\(\) \?\? CreateRuntimeTmpFontAsset\(\)/);
  assert.match(controller, /TMP_FontAsset\.CreateFontAsset\(font, 72, 9, GlyphRenderMode\.SDFAA, 2048, 2048, AtlasPopulationMode\.Dynamic, true\)/);
  assert.match(controller, /uiFontAsset\.isMultiAtlasTexturesEnabled = true;/);
  assert.match(controller, /if \(fontAsset != null\)[\s\S]*text\.font = fontAsset;/);
  assert.match(controller, /text\.enableAutoSizing = false;/);
  assert.match(controller, /text\.textWrappingMode = TextWrappingModes\.Normal;/);
  assert.match(controller, /text\.overflowMode = TextOverflowModes\.Overflow;/);
  assert.match(controller, /text\.fontStyle = FontStyles\.Bold;/);
  assert.match(controller, /text\.isTextObjectScaleStatic = true;/);
  assert.match(controller, /typeof\(TextMeshProUGUI\)/);
  assert.match(controller, /CreateText\("Order Title"[\s\S]*13[\s\S]*new Vector2\(-44f, 23f\)[\s\S]*new Vector2\(248f, 20f\)/);
  assert.match(controller, /CreateText\("Order Requirements"[\s\S]*10[\s\S]*new Vector2\(-44f, 4f\)[\s\S]*new Vector2\(248f, 16f\)/);
  assert.match(controller, /CreateText\("Order Reward"[\s\S]*10[\s\S]*new Vector2\(-44f, -17f\)[\s\S]*new Vector2\(248f, 16f\)/);
  assert.match(controller, /CreateText\("District Progress"[\s\S]*9[\s\S]*new Vector2\(0f, -59f\)[\s\S]*new Vector2\(340f, 14f\)/);
  assert.doesNotMatch(controller, /resizeTextMinSize/);
  assert.doesNotMatch(controller, /typeof\(Text\)/);
  assert.doesNotMatch(controller, /private Text /);
  assert.doesNotMatch(controller, /enableMultiAtlasSupport/);
  assert.doesNotMatch(controller, /enableWordWrapping/);
});

test('Unity MergeClient uses a stronger cyber font and larger non-overlapping mobile labels', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /private static readonly string\[\] UiFontNames = \{ "Cascadia Code SemiBold", "Cascadia Mono", "Bahnschrift", "Consolas", "Arial" \};/);
  assert.match(controller, /Font\.CreateDynamicFontFromOSFont\(UiFontNames, 32\)/);
  assert.match(controller, /canvas\.pixelPerfect = true;/);
  assert.match(controller, /scaler\.screenMatchMode = CanvasScaler\.ScreenMatchMode\.MatchWidthOrHeight;/);
  assert.match(controller, /scaler\.referencePixelsPerUnit = 100f;/);
  assert.match(controller, /scaler\.dynamicPixelsPerUnit = 1f;/);
  assert.match(controller, /PixelPerfect\(position\)/);
  assert.match(controller, /PixelPerfect\(size\)/);
  assert.match(controller, /CreatePanel\(\$"Order \{order\.id\}"[\s\S]*new Vector2\(0f, -24f - index \* 82f\)[\s\S]*new Vector2\(356f, 76f\)/);
  assert.match(controller, /CreatePanel\("Order Progress Track"[\s\S]*new Vector2\(-44f, 7f\)[\s\S]*new Vector2\(248f, 4f\)/);
  assert.match(controller, /CreatePanel\("Order Action Button"[\s\S]*new Vector2\(-12f, 0f\)[\s\S]*new Vector2\(80f, 48f\)/);
  assert.match(controller, /CreateText\("Name"[\s\S]*8[\s\S]*new Vector2\(0f, -21f\)[\s\S]*new Vector2\(TileSize - 8f, 13f\)/);
  assert.match(controller, /CreateText\("Producer Label"[\s\S]*"CRATE"[\s\S]*8[\s\S]*new Vector2\(0f, -20f\)/);
});

test('Unity MergeClient procedural icons use layered depth treatment', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /CreateIconDepthBase/);
  assert.match(controller, /CreateIconHighlight/);
  assert.match(controller, /CreateIconCastShadow/);
  assert.match(controller, /CreatePanel\("Icon Front Face"/);
  assert.match(controller, /CreatePanel\("Icon Top Bevel"/);
  assert.match(controller, /CreatePanel\("Icon Drop Shadow"/);
  assert.match(controller, /CreateIconDepthBase\(icon, accent\)/);
  assert.match(controller, /CreateIconHighlight\(icon\)/);
});
