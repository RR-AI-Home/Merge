import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
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
  assert.match(controller, /MobileContentWidth = 386f/);
  assert.match(controller, /private const float TileSize = 60f/);
  assert.match(controller, /private const float TileGap = 2f/);
  assert.match(controller, /private const float BoardPadding = 8f/);
  assert.match(controller, /CreateOrdersPanel[\s\S]*new Vector2\(MobileContentWidth, 178f\)/);
  assert.doesNotMatch(controller, /new Vector2\(218f, -24f\)/);
});

test('Unity MergeClient HUD keeps title above resource pills', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /titleLabel = CreateText\("Title"[\s\S]*24[\s\S]*new Vector2\(-78f, 12f\)/);
  assert.match(controller, /CreateStatPill\(hud, "ENERGY", new Vector2\(-120f, 44f\)/);
  assert.match(controller, /CreateStatPill\(hud, "COINS", new Vector2\(0f, 44f\)/);
  assert.match(controller, /CreateStatPill\(hud, "GEMS", new Vector2\(120f, 44f\)/);
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

  assert.match(controller, /CreateRoundedPanel\("HUD"[\s\S]*new Vector2\(0f, -8f\)[\s\S]*new Vector2\(MobileContentWidth, HudHeight\)/);
  assert.match(controller, /titleLabel = CreateText\("Title"[\s\S]*24[\s\S]*new Vector2\(-78f, 12f\)/);
  assert.match(controller, /CreateRoundedPanel\("Merge Board"[\s\S]*new Vector2\(0f, BoardCenterY\)/);
  assert.match(controller, /CreateRoundedPanel\("Orders Panel"[\s\S]*new Vector2\(0f, OrdersPanelTopY\)[\s\S]*new Vector2\(MobileContentWidth, 178f\)/);
  assert.match(controller, /CreatePanel\("Orders Viewport"/);
  assert.match(controller, /viewport\.gameObject\.AddComponent<RectMask2D>\(\)/);
  assert.match(controller, /ordersScrollRect\.viewport = viewport;/);
  assert.match(controller, /ordersScrollRect\.content = orderScrollContent;/);
  assert.match(controller, /CreateScrollHintIndicators\(ordersPanel\)/);
  assert.match(controller, /CreateScrollCue\("Orders Scroll Up Cue"/);
  assert.match(controller, /CreateScrollCue\("Orders Scroll Down Cue"/);
  assert.match(controller, /new Vector2\(0f, -OrderCardHeight \/ 2f - index \* OrderCardStep\)/);
});

test('Unity MergeClient lower rail avoids header and status overlap', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /statusLabel = CreateText\("HUD Status"/);
  assert.doesNotMatch(controller, /CreateText\("Orders Header"/);
  assert.doesNotMatch(controller, /CreateText\("Board Status"/);
  assert.match(controller, /new Vector2\(0f, -OrderCardHeight \/ 2f - index \* OrderCardStep\)/);
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
  assert.match(controller, /private RectTransform orderScrollContent;/);
  assert.match(controller, /private ScrollRect ordersScrollRect;/);
  assert.match(controller, /private Image ordersScrollUpCue;/);
  assert.match(controller, /private Image ordersScrollDownCue;/);
  assert.match(controller, /private readonly List<Image> readyOrderPulseImages = new List<Image>\(\)/);
  assert.match(controller, /private readonly HashSet<string> completedOrderIds/);
  assert.match(controller, /RefreshOrdersPanel/);
  assert.match(controller, /List<OrderDefinition> readyOrders = new List<OrderDefinition>\(\)/);
  assert.match(controller, /RenderOrderGroup\(readyOrders, ref visibleIndex\)/);
  assert.match(controller, /RenderOrderGroup\(waitingOrders, ref visibleIndex\)/);
  assert.doesNotMatch(controller, /visibleIndex >= VisibleOrderLimit/);
  assert.match(controller, /CreateOrderActionButton/);
  assert.match(controller, /CanCompleteOrder/);
  assert.match(controller, /TryCompleteOrder/);
  assert.match(controller, /CollectRequiredTiles/);
  assert.match(controller, /private string lastHelpfulItemId;/);
  assert.match(controller, /private readonly Dictionary<string, float> helpfulItemGlowUntil = new Dictionary<string, float>\(\)/);
  assert.match(controller, /TrackHelpfulItem\(nextLevel\.id\)/);
  assert.match(controller, /CreateHelpfulItemGlow\(tile\.root, ItemAccent\(itemId\)\)/);
  assert.match(controller, /CreateNeededItemMarker\(tile\.root, ItemAccent\(itemId\)\)/);
  assert.match(controller, /CreateText\("Needed Marker Label"[\s\S]*"JOB"/);
  assert.match(controller, /AnimateHelpfulItemGlows\(\);/);
  assert.match(controller, /CreateRequirementRow\(card, order\)/);
  assert.match(controller, /private const float OrderTextCenterX = -52f;/);
  assert.match(controller, /private const float OrderTextWidth = 208f;/);
  assert.match(controller, /CreateText\("Order Title"[\s\S]*new Vector2\(OrderTextCenterX, 24f\)[\s\S]*new Vector2\(OrderTextWidth, 18f\)/);
  assert.match(controller, /float startX = OrderTextCenterX - OrderTextWidth \/ 2f \+ width \/ 2f;/);
  assert.match(controller, /RequirementTextColor\(requirement\.itemId\)/);
  assert.match(controller, /IsRequirementSatisfied\(requirement\)/);
  assert.match(controller, /requirement\.itemId == lastHelpfulItemId/);
  assert.match(controller, /currentCoins \+= order\.rewards != null \? order\.rewards\.coins : 0;/);
  assert.match(controller, /coinsLabel\.text = currentCoins\.ToString\(\)/);
  assert.match(controller, /SetStatus\(BuildCompletionStatus\(order\)\)/);
  assert.match(controller, /CreateReadyOrderPulse\(card\)/);
  assert.match(controller, /CreateReadyOrderBadge\(card\)/);
  assert.match(controller, /CreateText\("Ready Badge Text"[\s\S]*"READY"/);
  assert.match(controller, /readyOrderPulseImages\.Add\(pulse\)/);
  assert.match(controller, /private void Update\(\)[\s\S]*AnimateReadyOrderPulses\(\);[\s\S]*UpdateScrollHintIndicators\(\);/);
  assert.match(controller, /Mathf\.Sin\(Time\.unscaledTime \* 4\.5f\)/);
  assert.match(controller, /ordersScrollUpCue\.enabled = canScrollUp;/);
  assert.match(controller, /ordersScrollDownCue\.enabled = canScrollDown;/);
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
  assert.match(controller, /new Vector2\(62f, 58f\)/);
  assert.match(controller, /CreateText\("Nav Label"[\s\S]*9[\s\S]*new Vector2\(0f, -18f\)[\s\S]*new Vector2\(54f, 13f\)/);
});

test('Unity MergeClient portrait layout keeps top and bottom safe spacing', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /CreateRoundedPanel\("HUD"[\s\S]*new Vector2\(0f, -8f\)[\s\S]*new Vector2\(MobileContentWidth, HudHeight\)/);
  assert.match(controller, /CreateRoundedPanel\("Merge Board"[\s\S]*new Vector2\(0f, BoardCenterY\)/);
  assert.match(controller, /CreateRoundedPanel\("Orders Panel"[\s\S]*new Vector2\(0f, OrdersPanelTopY\)[\s\S]*new Vector2\(MobileContentWidth, 178f\)/);
  assert.match(controller, /CreateRoundedPanel\("Bottom Nav"[\s\S]*new Vector2\(0f, BottomNavBottomY\)[\s\S]*new Vector2\(MobileContentWidth, 76f\)/);
  assert.match(controller, /CreateNavButton\(nav, "BOARD", new Vector2\(-144f, 38f\)/);
  assert.doesNotMatch(controller, /CreatePanel\("Bottom Nav"[\s\S]*new Vector2\(0f, 18f\)/);
});

test('Unity MergeClient supports order queue, progression, producer depth, and local saves', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /private const float OrderCardHeight = 76f;/);
  assert.match(controller, /private const float OrderCardStep = 82f;/);
  assert.match(controller, /private const float OrdersViewportHeight = 164f;/);
  assert.match(controller, /private const float OrderScrollBottomPadding = 34f;/);
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
  assert.match(controller, /RefreshOrdersPanel\(true\);/);
  assert.match(controller, /private void RefreshOrdersPanel\(bool resetScrollToTop = false\)/);
  assert.match(controller, /float previousScrollPosition = ordersScrollRect != null \? ordersScrollRect\.verticalNormalizedPosition : 1f;/);
  assert.match(controller, /visibleIndex \* OrderCardStep \+ OrderScrollBottomPadding/);
  assert.match(controller, /ordersScrollRect\.verticalNormalizedPosition = resetScrollToTop \? 1f : Mathf\.Clamp01\(previousScrollPosition\);/);
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
  assert.match(controller, /CreateProjectTmpFontAsset\(\) \?\? LoadProjectTmpFontAsset\(\) \?\? CreateRuntimeTmpFontAsset\(\)/);
  assert.match(controller, /private static readonly string\[\] ProjectFontResourcePaths = \{ "Fonts & Materials\/CascadiaCode-VariableFont_wght", "Fonts & Materials\/CascadiaCode-Italic-VariableFont_wght" \};/);
  assert.match(controller, /"Fonts & Materials\/CascadiaCode-VariableFont_wght SDF", "Fonts & Materials\/Cascadia Code SDF", "Fonts\/Cascadia Code SDF"/);
  assert.match(controller, /private static TMP_FontAsset CreateProjectTmpFontAsset\(\)/);
  assert.match(controller, /Resources\.Load<Font>\(resourcePath\)/);
  assert.match(controller, /return CreateHighResolutionTmpFontAsset\(font\);/);
  assert.match(controller, /private static TMP_FontAsset CreateHighResolutionTmpFontAsset\(Font font\)/);
  assert.match(controller, /TMP_FontAsset\.CreateFontAsset\(font, 96, 12, GlyphRenderMode\.SDFAA, 4096, 4096, AtlasPopulationMode\.Dynamic, true\)/);
  assert.match(controller, /uiFontAsset\.isMultiAtlasTexturesEnabled = true;/);
  assert.match(controller, /if \(fontAsset != null\)[\s\S]*text\.font = fontAsset;/);
  assert.match(controller, /text\.enableAutoSizing = false;/);
  assert.match(controller, /text\.textWrappingMode = TextWrappingModes\.NoWrap;/);
  assert.match(controller, /text\.overflowMode = TextOverflowModes\.Ellipsis;/);
  assert.match(controller, /text\.fontStyle = FontStyles\.Bold;/);
  assert.match(controller, /text\.isTextObjectScaleStatic = true;/);
  assert.match(controller, /typeof\(TextMeshProUGUI\)/);
  assert.match(controller, /CreateText\("Order Title"[\s\S]*14[\s\S]*new Vector2\(OrderTextCenterX, 24f\)[\s\S]*new Vector2\(OrderTextWidth, 18f\)/);
  assert.match(controller, /CreateText\("Order Requirements"[\s\S]*11[\s\S]*new Vector2\(OrderTextCenterX, 7f\)[\s\S]*new Vector2\(OrderTextWidth, 15f\)/);
  assert.match(controller, /CreateText\("Order Reward"[\s\S]*11[\s\S]*new Vector2\(OrderTextCenterX, -10f\)[\s\S]*new Vector2\(OrderTextWidth, 15f\)/);
  assert.match(controller, /CreateText\("District Progress"[\s\S]*12[\s\S]*new Vector2\(-78f, -38f\)[\s\S]*new Vector2\(236f, 16f\)/);
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

  assert.match(controller, /private static readonly string\[\] UiFontNames = \{ "Cascadia Code", "Cascadia Code SemiBold", "Bahnschrift", "Segoe UI Semibold", "Segoe UI", "Arial" \};/);
  assert.match(controller, /Font\.CreateDynamicFontFromOSFont\(UiFontNames, 36\)/);
  assert.match(controller, /canvas\.pixelPerfect = true;/);
  assert.match(controller, /scaler\.screenMatchMode = CanvasScaler\.ScreenMatchMode\.MatchWidthOrHeight;/);
  assert.match(controller, /scaler\.referencePixelsPerUnit = 100f;/);
  assert.match(controller, /scaler\.dynamicPixelsPerUnit = 1f;/);
  assert.match(controller, /PixelPerfect\(position\)/);
  assert.match(controller, /PixelPerfect\(size\)/);
  assert.match(controller, /CreateRoundedPanel\(\$"Order \{order\.id\}"[\s\S]*new Vector2\(0f, -OrderCardHeight \/ 2f - index \* OrderCardStep\)[\s\S]*new Vector2\(356f, OrderCardHeight\)/);
  assert.match(controller, /CreatePanel\("Order Progress Track"[\s\S]*new Vector2\(-44f, -28f\)[\s\S]*new Vector2\(220f, 4f\)/);
  assert.match(controller, /CreateRoundedPanel\("Order Action Button"[\s\S]*new Vector2\(-10f, 4f\)[\s\S]*new Vector2\(72f, 48f\)/);
  assert.match(controller, /CreateText\("Order Action Label"[\s\S]*11[\s\S]*new Vector2\(58f, 22f\)/);
  assert.match(controller, /CreatePanel\("Order Button Shine"/);
  assert.match(controller, /CreateText\("Name"[\s\S]*9[\s\S]*new Vector2\(0f, -20f\)[\s\S]*new Vector2\(TileSize - 8f, 12f\)/);
  assert.match(controller, /CreateText\("Producer Label"[\s\S]*"CRATE"[\s\S]*9[\s\S]*new Vector2\(0f, -20f\)/);
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

test('Unity MergeClient follows the compact premium portrait mock direction', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /MobileContentWidth = 386f/);
  assert.match(controller, /private const float TileSize = 60f/);
  assert.match(controller, /private const float TileGap = 2f/);
  assert.match(controller, /private const float BoardPadding = 8f/);
  assert.match(controller, /CreateRoundedPanel\("HUD"/);
  assert.match(controller, /CreateRoundedPanel\("Merge Board"[\s\S]*new Vector2\(boardPixelSize, boardPixelSize\)/);
  assert.match(controller, /titleLabel\.fontStyle = FontStyles\.Bold \| FontStyles\.Italic;/);
  assert.match(controller, /CreateStatPillIcon\(pill, accent\)/);
  assert.match(controller, /energyLabel\.text = \$"\{currentEnergy\}\/100"/);
  assert.match(controller, /coinsLabel\.text = currentCoins\.ToString\(\)/);
  assert.match(controller, /premiumLabel\.text = currentPremium\.ToString\(\)/);
  assert.match(controller, /CreateRoundedPanel\("Merge Board"/);
  assert.match(controller, /CreateRoundedPanel\("Bottom Nav"[\s\S]*new Vector2\(MobileContentWidth, 76f\)/);
  assert.match(controller, /verticalNormalizedPosition = 1f/);
  assert.match(controller, /CreateRoundedSprite/);
  assert.match(controller, /Image\.Type\.Sliced/);
});

test('Unity MergeClient includes first playable session, district, and collection screens', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /private enum ActiveScreen/);
  assert.match(controller, /Board,\s*Districts,\s*Collection/);
  assert.match(controller, /private ActiveScreen activeScreen = ActiveScreen\.Board;/);
  assert.match(controller, /private RectTransform boardScreenRoot;/);
  assert.match(controller, /private RectTransform districtScreenRoot;/);
  assert.match(controller, /private RectTransform collectionScreenRoot;/);
  assert.match(controller, /private readonly Dictionary<string, TextMeshProUGUI> navLabels = new Dictionary<string, TextMeshProUGUI>\(\)/);
  assert.match(controller, /CreateSessionControls\(hud\)/);
  assert.match(controller, /CreateSessionButton\(hud, "PAUSE"/);
  assert.match(controller, /CreateSessionButton\(hud, "RESET SAVE"/);
  assert.match(controller, /TogglePause\(\)/);
  assert.match(controller, /ResetLocalSave\(\)/);
  assert.match(controller, /PlayerPrefs\.DeleteKey\(SaveKey\(\)\)/);
  assert.match(controller, /CreateScreenRoots\(\)/);
  assert.match(controller, /SetActiveScreen\(ActiveScreen\.Board\)/);
  assert.match(controller, /SetActiveScreen\(ActiveScreen\.Districts\)/);
  assert.match(controller, /SetActiveScreen\(ActiveScreen\.Collection\)/);
  assert.match(controller, /CreateDistrictsScreen\(\)/);
  assert.match(controller, /CreateDistrictCard/);
  assert.match(controller, /CreateMilestoneProgressBar/);
  assert.match(controller, /GetDistrictState/);
  assert.match(controller, /CreateCollectionScreen\(\)/);
  assert.match(controller, /CreateCollectionChainCard/);
  assert.match(controller, /CreateCollectionLevelBadge/);
  assert.match(controller, /private readonly HashSet<string> discoveredItemIds = new HashSet<string>\(\)/);
  assert.match(controller, /MarkItemDiscovered\(itemId\)/);
  assert.match(controller, /discoveredItemIds = ToDiscoveredItemArray\(\)/);
  assert.match(controller, /discoveredItemIds = saveData\.discoveredItemIds/);
  assert.match(controller, /private string ItemDisplayName\(string itemId, string itemName, int tier\)/);
  assert.match(controller, /return "Signal";[\s\S]*return "Processor";/);
  assert.match(controller, /return "Relay";[\s\S]*return "Harness";/);
});

test('Unity MergeClient matches the approved first playable mockup proportions', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /private const float HudHeight = 132f;/);
  assert.match(controller, /private const float BoardCenterY = -336f;/);
  assert.match(controller, /private const float OrdersPanelTopY = -532f;/);
  assert.match(controller, /private const float BottomNavBottomY = 14f;/);
  assert.match(controller, /TMP_FontAsset\.CreateFontAsset\(font, 96, 12, GlyphRenderMode\.SDFAA, 4096, 4096, AtlasPopulationMode\.Dynamic, true\)/);
  assert.match(controller, /Resources\.GetBuiltinResource<Font>\("Arial\.ttf"\);[\s\S]*yield return builtInArial;[\s\S]*Font osFont = Font\.CreateDynamicFontFromOSFont\(UiFontNames, 36\);/);
  assert.match(controller, /private TextMeshProUGUI titleLabel;/);
  assert.match(controller, /titleLabel = CreateText\("Title"[\s\S]*24[\s\S]*new Vector2\(-78f, 12f\)/);
  assert.match(controller, /CreateStatPill\(hud, "ENERGY", new Vector2\(-120f, 44f\), new Vector2\(78f, 30f\)/);
  assert.match(controller, /CreateSessionButton\(hud, "RESET SAVE"/);
  assert.match(controller, /SetHudTitle\(screen\)/);
  assert.match(controller, /private string HudTitleFor\(ActiveScreen screen\)/);
  assert.match(controller, /CreateRoundedPanel\("Merge Board"[\s\S]*new Vector2\(0f, BoardCenterY\)/);
  assert.match(controller, /CreateRoundedPanel\("Orders Panel"[\s\S]*new Vector2\(0f, OrdersPanelTopY\)/);
  assert.match(controller, /CreateRoundedPanel\("Bottom Nav"[\s\S]*new Vector2\(0f, BottomNavBottomY\)/);
  assert.match(controller, /CreateRoundedPanel\(\$"Slot \{grid\.x\},\{grid\.y\}"[\s\S]*new Color\(0\.129f, 0\.188f, 0\.29f, 1f\)/);
  assert.match(controller, /CreateRoundedPanel\("Slot Inner"[\s\S]*new Color\(0\.176f, 0\.239f, 0\.353f, 1f\)/);
  assert.match(controller, /CreateText\("Name"[\s\S]*9[\s\S]*new Vector2\(0f, -20f\)/);
  assert.match(controller, /CreateText\("Producer Label"[\s\S]*9[\s\S]*new Vector2\(0f, -20f\)/);
  assert.doesNotMatch(controller, /CreateText\("District Screen Title"/);
  assert.doesNotMatch(controller, /CreateText\("Collection Screen Title"/);
});

test('Unity MergeClient uses the approved bright mockup color tokens', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /CreateImage\("Background", canvasRoot, new Color\(0\.024f, 0\.043f, 0\.075f, 1f\)\)/);
  assert.match(controller, /CreateRoundedPanel\("HUD"[\s\S]*new Color\(0\.024f, 0\.043f, 0\.075f, 0\.98f\)/);
  assert.match(controller, /CreateRoundedPanel\("Merge Board"[\s\S]*new Color\(0\.043f, 0\.078f, 0\.125f, 0\.98f\)/);
  assert.match(controller, /CreateRoundedPanel\("Orders Panel"[\s\S]*new Color\(1f, 1f, 1f, 0\.035f\)/);
  assert.match(controller, /CreateRoundedPanel\(\$"Slot \{grid\.x\},\{grid\.y\}"[\s\S]*new Color\(0\.129f, 0\.188f, 0\.29f, 1f\)/);
  assert.match(controller, /CreateRoundedPanel\("Slot Inner"[\s\S]*new Color\(0\.176f, 0\.239f, 0\.353f, 1f\)/);
  assert.match(controller, /CreateRoundedPanel\("Producer Tile"[\s\S]*new Color\(0\.18f, 0\.49f, 1f, 1f\)/);
  assert.match(controller, /active \? new Color\(0\.063f, 0\.145f, 0\.275f, 1f\) : new Color\(0\.035f, 0\.063f, 0\.106f, 1f\)/);
  assert.match(controller, /Color\.Lerp\(new Color\(0\.13f, 0\.18f, 0\.26f\), ItemAccent\(itemId\), Mathf\.Clamp01\(0\.55f \+ level \/ 10f\)\)/);
  assert.match(controller, /itemId\.StartsWith\("wire"\)[\s\S]*return new Color\(0\.75f, 0\.49f, 1f\)/);
  assert.match(controller, /itemId\.StartsWith\("drone"\)[\s\S]*return new Color\(1f, 0\.44f, 0\.77f\)/);
  assert.match(controller, /itemId\.StartsWith\("cache"\)[\s\S]*return new Color\(0\.58f, 0\.94f, 0\.67f\)/);
});

test('Unity MergeClient uses the mockup font and keeps contract actions clear of nav', async () => {
  const controller = await readFile(
    path.join('unity', 'MergeClient', 'Assets', 'MergePlatform', 'Runtime', 'MergeClientController.cs'),
    'utf8'
  );

  assert.match(controller, /private static readonly string\[\] UiFontNames = \{ "Cascadia Code", "Cascadia Code SemiBold", "Bahnschrift", "Segoe UI Semibold", "Segoe UI", "Arial" \};/);
  assert.match(controller, /uiFontAsset = CreateProjectTmpFontAsset\(\) \?\? LoadProjectTmpFontAsset\(\) \?\? CreateRuntimeTmpFontAsset\(\);/);
  assert.match(controller, /ProjectTmpFontResourcePaths = \{ "Fonts & Materials\/CascadiaCode-VariableFont_wght SDF", "Fonts & Materials\/Cascadia Code SDF", "Fonts\/Cascadia Code SDF"/);
  assert.match(controller, /private const float OrdersPanelTopY = -532f;/);
  assert.match(controller, /private const float BottomNavBottomY = 14f;/);
  assert.match(controller, /CreateRoundedPanel\(\$"Slot \{grid\.x\},\{grid\.y\}"[\s\S]*new Color\(0\.129f, 0\.188f, 0\.29f, 1f\)/);
  assert.match(controller, /CreateRoundedPanel\("Slot Inner"[\s\S]*new Color\(0\.176f, 0\.239f, 0\.353f, 1f\)/);
  assert.match(controller, /CreateImage\("Slot Top Line"[\s\S]*new Color\(0\.54f, 0\.68f, 0\.88f, 0\.18f\)/);
});

test('Unity MergeClient ships the imported Cascadia TMP font asset under Resources', async () => {
  const fontAsset = await stat(
    path.join(
      'unity',
      'MergeClient',
      'Assets',
      'MergePlatform',
      'Resources',
      'Fonts & Materials',
      'CascadiaCode-VariableFont_wght SDF.asset'
    )
  );
  const fontSource = await stat(
    path.join(
      'unity',
      'MergeClient',
      'Assets',
      'MergePlatform',
      'Resources',
      'Fonts & Materials',
      'CascadiaCode-VariableFont_wght.ttf'
    )
  );

  assert.ok(fontAsset.isFile());
  assert.ok(fontAsset.size > 100000);
  assert.ok(fontSource.isFile());
  assert.ok(fontSource.size > 100000);
});
