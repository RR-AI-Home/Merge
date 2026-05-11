using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace MergePlatform.Client
{
    public sealed class MergeClientController : MonoBehaviour
    {
        [SerializeField] private string themeResourcePath = "Themes/cyber-syndicate";

        private const float MobileReferenceWidth = 412f;
        private const float MobileReferenceHeight = 915f;
        private const float MobileContentWidth = 388f;
        private const float TileSize = 58f;
        private const float TileGap = 4f;
        private const float BoardPadding = 8f;
        private const int VisibleOrderLimit = 2;
        private const string SaveKeyPrefix = "MergePlatform.Client.Save.";

        private readonly Dictionary<string, ItemLevel> itemLookup = new Dictionary<string, ItemLevel>();
        private readonly Dictionary<string, ItemChain> chainByItemId = new Dictionary<string, ItemChain>();
        private readonly Dictionary<Vector2Int, ItemTile> boardItems = new Dictionary<Vector2Int, ItemTile>();
        private readonly Dictionary<Vector2Int, RectTransform> boardSlots = new Dictionary<Vector2Int, RectTransform>();
        private readonly Dictionary<Vector2Int, Image> boardSlotHighlights = new Dictionary<Vector2Int, Image>();
        private readonly HashSet<string> completedOrderIds = new HashSet<string>();

        private UnityMergeTheme theme;
        private RectTransform canvasRoot;
        private RectTransform boardPanel;
        private RectTransform itemLayer;
        private RectTransform dragLayer;
        private RectTransform mergeFeedbackLayer;
        private RectTransform ordersPanel;
        private Text energyLabel;
        private Text coinsLabel;
        private Text premiumLabel;
        private Text districtLabel;
        private Text statusLabel;
        private Font uiFont;
        private AudioSource feedbackAudio;
        private AudioClip mergeSound;
        private ItemTile selectedTile;
        private Vector2Int? highlightedGrid;
        private Vector2Int producerGrid;
        private int currentEnergy;
        private int currentCoins;
        private int currentPremium;
        private int currentXp;
        private int dropCursor;
        private int producerTapsRemaining;
        private long producerCooldownReadyAt;
        private int boardWidth;
        private int boardHeight;
        private float boardPixelSize;

        private Font UiFont
        {
            get
            {
                if (uiFont == null)
                {
                    uiFont = Font.CreateDynamicFontFromOSFont(new[] { "Cascadia Code SemiBold", "Cascadia Mono", "Bahnschrift", "Consolas", "Arial" }, 16);
                    uiFont ??= Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                    uiFont ??= Resources.GetBuiltinResource<Font>("Arial.ttf");
                }

                return uiFont;
            }
        }

        private void Start()
        {
            Screen.orientation = ScreenOrientation.Portrait;
            LoadTheme();
            BuildScene();
        }

        private void LoadTheme()
        {
            TextAsset themeAsset = Resources.Load<TextAsset>(themeResourcePath);

            if (themeAsset == null)
            {
                Debug.LogError($"Merge theme resource not found at Resources/{themeResourcePath}.json");
                return;
            }

            theme = JsonUtility.FromJson<UnityMergeTheme>(themeAsset.text);
            itemLookup.Clear();
            chainByItemId.Clear();

            if (theme?.itemChains == null)
            {
                return;
            }

            foreach (ItemChain chain in theme.itemChains)
            {
                if (chain?.levels == null)
                {
                    continue;
                }

                foreach (ItemLevel level in chain.levels)
                {
                    if (level == null || string.IsNullOrWhiteSpace(level.id))
                    {
                        continue;
                    }

                    itemLookup[level.id] = level;
                    chainByItemId[level.id] = chain;
                }
            }
        }

        private void BuildScene()
        {
            if (theme?.config?.board == null)
            {
                return;
            }

            boardWidth = Mathf.Max(1, theme.config.board.width);
            boardHeight = Mathf.Max(1, theme.config.board.height);
            boardPixelSize = BoardPadding * 2f + boardWidth * TileSize + (boardWidth - 1) * TileGap;
            currentEnergy = theme.config.startingState != null ? theme.config.startingState.energy : 0;
            currentCoins = theme.config.startingState != null ? theme.config.startingState.coins : 0;
            currentPremium = theme.config.startingState != null ? theme.config.startingState.premium : 0;
            currentXp = 0;
            dropCursor = 0;
            producerTapsRemaining = GetDefaultProducerTapLimit();
            producerCooldownReadyAt = 0;
            producerGrid = new Vector2Int(0, 0);
            completedOrderIds.Clear();

            ClearGeneratedObjects();
            EnsureEventSystem();
            CreateCanvas();
            CreateHud();
            CreateBoard();
            CreateProducerTile();
            if (!TryLoadGame())
            {
                SeedMergeableItems();
            }

            CreateOrdersPanel();
            CreateBottomNav();
            UpdateEnergyLabel();
            UpdateCurrencyLabels();
            UpdateDistrictProgress();
            SetStatus("Tap crate to generate items");
        }

        private void ClearGeneratedObjects()
        {
            for (int index = transform.childCount - 1; index >= 0; index -= 1)
            {
                Destroy(transform.GetChild(index).gameObject);
            }

            boardItems.Clear();
            boardSlots.Clear();
            boardSlotHighlights.Clear();
            highlightedGrid = null;
            districtLabel = null;
        }

        private void CreateCanvas()
        {
            GameObject canvasObject = new GameObject("Merge Screen Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            canvasObject.transform.SetParent(transform);

            Canvas canvas = canvasObject.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 10;

            CanvasScaler scaler = canvasObject.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(MobileReferenceWidth, MobileReferenceHeight);
            scaler.matchWidthOrHeight = 0f;

            canvasRoot = canvasObject.GetComponent<RectTransform>();
            canvasRoot.anchorMin = Vector2.zero;
            canvasRoot.anchorMax = Vector2.one;
            canvasRoot.offsetMin = Vector2.zero;
            canvasRoot.offsetMax = Vector2.zero;

            Image background = CreateImage("Background", canvasRoot, new Color(0.02f, 0.024f, 0.034f, 1f));
            Stretch(background.rectTransform);
            feedbackAudio = canvasObject.AddComponent<AudioSource>();
            feedbackAudio.playOnAwake = false;
            feedbackAudio.volume = 0.22f;
        }

        private void CreateHud()
        {
            RectTransform hud = CreatePanel("HUD", canvasRoot, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -32f), new Vector2(MobileContentWidth, 110f), new Color(0.03f, 0.04f, 0.055f, 0.96f));
            CreateText("Title", hud, theme.config.displayName, 22, new Color(0.82f, 0.96f, 1f), TextAnchor.MiddleLeft, new Vector2(0f, 8f), new Vector2(340f, 28f));

            energyLabel = CreateStatPill(hud, "ENERGY", new Vector2(-126f, -82f), new Color(0.95f, 0.78f, 0.24f));
            coinsLabel = CreateStatPill(hud, "COINS", new Vector2(0f, -82f), new Color(0.55f, 0.92f, 0.72f));
            premiumLabel = CreateStatPill(hud, "GEMS", new Vector2(126f, -82f), new Color(0.94f, 0.45f, 0.78f));
            statusLabel = CreateText("HUD Status", hud, "Ready", 10, new Color(0.68f, 0.86f, 0.92f), TextAnchor.MiddleLeft, new Vector2(0f, -43f), new Vector2(340f, 14f));
            districtLabel = CreateText("District Progress", hud, "District 0/2", 9, new Color(0.72f, 1f, 0.74f), TextAnchor.MiddleLeft, new Vector2(0f, -59f), new Vector2(340f, 14f));

            coinsLabel.text = $"COINS {currentCoins}";
            premiumLabel.text = $"GEMS {currentPremium}";
        }

        private Text CreateStatPill(RectTransform parent, string label, Vector2 position, Color accent)
        {
            RectTransform pill = CreatePanel($"Stat {label}", parent, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 0.5f), position, new Vector2(116f, 30f), new Color(0.09f, 0.11f, 0.16f, 1f));
            Image accentBar = CreateImage($"{label} Accent", pill, accent);
            SetRect(accentBar.rectTransform, new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(4f, 0f), new Vector2(4f, 20f));
            return CreateText($"{label} Text", pill, label, 11, Color.white, TextAnchor.MiddleCenter, Vector2.zero, new Vector2(96f, 22f));
        }

        private void CreateBoard()
        {
            boardPanel = CreatePanel("Merge Board", canvasRoot, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 0.5f), new Vector2(0f, -350f), new Vector2(boardPixelSize, boardPixelSize), new Color(0.04f, 0.052f, 0.07f, 1f));

            for (int y = 0; y < boardHeight; y += 1)
            {
                for (int x = 0; x < boardWidth; x += 1)
                {
                    Vector2Int grid = new Vector2Int(x, y);
                    CreateBoardSlot(grid);
                }
            }

            itemLayer = CreateEmptyRect("Items", boardPanel);
            Stretch(itemLayer);
            mergeFeedbackLayer = CreateEmptyRect("Merge Feedback", boardPanel);
            Stretch(mergeFeedbackLayer);
            dragLayer = CreateEmptyRect("Drag Layer", canvasRoot);
            Stretch(dragLayer);
        }

        private void CreateBoardSlot(Vector2Int grid)
        {
            RectTransform slot = CreatePanel($"Slot {grid.x},{grid.y}", boardPanel, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), GridToAnchoredPosition(grid), new Vector2(TileSize, TileSize), new Color(0.12f, 0.15f, 0.21f, 1f));
            boardSlots[grid] = slot;

            CreatePanel("Slot Inner", slot, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(TileSize - 6f, TileSize - 6f), new Color(0.19f, 0.25f, 0.35f, 1f));
            Image topLine = CreateImage("Slot Top Line", slot, new Color(0.31f, 0.41f, 0.56f, 0.42f));
            SetRect(topLine.rectTransform, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -4f), new Vector2(TileSize - 10f, 2f));

            Image highlight = CreateImage("Slot Highlight", slot, new Color(0.64f, 0.94f, 1f, 0f));
            SetRect(highlight.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(TileSize - 2f, TileSize - 2f));
            highlight.raycastTarget = false;
            boardSlotHighlights[grid] = highlight;
        }

        private void CreateOrdersPanel()
        {
            ordersPanel = CreatePanel("Orders Panel", canvasRoot, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -548f), new Vector2(MobileContentWidth, 190f), new Color(0.035f, 0.042f, 0.06f, 0.98f));
            RefreshOrdersPanel();
        }

        private void RefreshOrdersPanel()
        {
            if (ordersPanel == null)
            {
                return;
            }

            for (int childIndex = ordersPanel.childCount - 1; childIndex >= 0; childIndex -= 1)
            {
                Destroy(ordersPanel.GetChild(childIndex).gameObject);
            }

            if (theme.orders == null)
            {
                return;
            }

            int visibleIndex = 0;
            for (int index = 0; index < theme.orders.Length; index += 1)
            {
                OrderDefinition order = theme.orders[index];
                if (completedOrderIds.Contains(order.id))
                {
                    continue;
                }

                CreateOrderCard(ordersPanel, order, visibleIndex);
                visibleIndex += 1;

                if (visibleIndex >= VisibleOrderLimit)
                {
                    break;
                }
            }

            if (visibleIndex == 0)
            {
                CreateOrderQueueEmpty(ordersPanel);
            }

            UpdateDistrictProgress();
        }

        private void CreateOrderQueueEmpty(RectTransform parent)
        {
            RectTransform card = CreatePanel("Order Queue Empty", parent, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -54f), new Vector2(356f, 92f), new Color(0.08f, 0.16f, 0.18f, 1f));
            CreatePanel("Order Empty Stripe", card, new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(4f, 0f), new Vector2(5f, 76f), new Color(0.72f, 1f, 0.74f, 1f));
            CreateText("Order Empty Title", card, "District contracts cleared", 13, Color.white, TextAnchor.MiddleLeft, new Vector2(-28f, 14f), new Vector2(282f, 18f));
            CreateText("Order Empty Detail", card, "More orders will arrive from the theme content queue.", 9, new Color(0.77f, 0.9f, 1f), TextAnchor.MiddleLeft, new Vector2(-28f, -8f), new Vector2(282f, 28f));
        }

        private void CreateBottomNav()
        {
            RectTransform nav = CreatePanel("Bottom Nav", canvasRoot, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 44f), new Vector2(MobileContentWidth, 56f), new Color(0.025f, 0.031f, 0.044f, 0.98f));
            CreateNavButton(nav, "BOARD", new Vector2(-144f, 30f), true, new Color(0.54f, 0.94f, 1f));
            CreateNavButton(nav, "DIST", new Vector2(-48f, 30f), false, new Color(0.72f, 1f, 0.74f));
            CreateNavButton(nav, "BOOK", new Vector2(48f, 30f), false, new Color(0.78f, 0.56f, 1f));
            CreateNavButton(nav, "SHOP", new Vector2(144f, 30f), false, new Color(1f, 0.48f, 0.78f));
        }

        private void CreateNavButton(RectTransform parent, string label, Vector2 position, bool active, Color accent)
        {
            RectTransform button = CreatePanel($"Nav {label}", parent, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0.5f, 0.5f), position, new Vector2(86f, 46f), active ? new Color(0.1f, 0.16f, 0.24f, 1f) : new Color(0.06f, 0.075f, 0.1f, 1f));
            CreatePanel("Nav Top Accent", button, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -5f), new Vector2(active ? 30f : 22f, 3f), accent);
            CreateNavIcon(button, label, active, accent);
            CreateText("Nav Label", button, label, 8, active ? Color.white : new Color(0.62f, 0.72f, 0.82f), TextAnchor.MiddleCenter, new Vector2(0f, -11f), new Vector2(72f, 14f));
        }

        private void CreateNavIcon(RectTransform parent, string label, bool active, Color accent)
        {
            Color iconColor = active ? accent : new Color(accent.r, accent.g, accent.b, 0.62f);
            RectTransform icon = CreatePanel($"Nav {label} Icon", parent, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 5f), new Vector2(24f, 18f), new Color(iconColor.r, iconColor.g, iconColor.b, 0.14f));

            if (label == "BOARD")
            {
                CreatePanel("Nav Board A", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-6f, 4f), new Vector2(8f, 7f), iconColor);
                CreatePanel("Nav Board B", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(6f, -4f), new Vector2(8f, 7f), iconColor);
                return;
            }

            if (label == "DIST")
            {
                CreatePanel("Nav District Base", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, -4f), new Vector2(20f, 4f), iconColor);
                CreatePanel("Nav District Tower", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-5f, 2f), new Vector2(5f, 12f), iconColor);
                CreatePanel("Nav District Tower B", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(5f, 0f), new Vector2(5f, 8f), iconColor);
                return;
            }

            if (label == "BOOK")
            {
                CreatePanel("Nav Book Left", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-5f, 0f), new Vector2(8f, 14f), iconColor);
                CreatePanel("Nav Book Right", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(5f, 0f), new Vector2(8f, 14f), iconColor);
                return;
            }

            CreatePanel("Nav Shop Base", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, -3f), new Vector2(18f, 9f), iconColor);
            CreatePanel("Nav Shop Handle", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 5f), new Vector2(10f, 4f), iconColor);
        }

        private void CreateOrderCard(RectTransform parent, OrderDefinition order, int index)
        {
            bool completed = completedOrderIds.Contains(order.id);
            bool ready = !completed && CanCompleteOrder(order);
            Color cardColor = completed ? new Color(0.08f, 0.18f, 0.16f, 1f) : ready ? new Color(0.13f, 0.23f, 0.28f, 1f) : new Color(0.14f, 0.18f, 0.29f, 1f);
            RectTransform card = CreatePanel($"Order {order.id}", parent, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -24f - index * 82f), new Vector2(356f, 76f), cardColor);
            card.gameObject.AddComponent<RectMask2D>();

            CreateOrderStateStripe(card, ready, completed);
            CreateOrderProgressBar(card, ready, completed);
            CreateText("Order Title", card, order.title, 13, Color.white, TextAnchor.MiddleLeft, new Vector2(-44f, 23f), new Vector2(248f, 20f));
            CreateText("Order Requirements", card, FormatRequirements(order), 10, new Color(0.77f, 0.9f, 1f), TextAnchor.MiddleLeft, new Vector2(-44f, 4f), new Vector2(248f, 16f));
            CreateRewardRow(card, order);
            CreateOrderActionButton(card, order, ready, completed);
        }

        private void CreateOrderStateStripe(RectTransform parent, bool ready, bool completed)
        {
            Color stripeColor = completed ? new Color(0.72f, 1f, 0.74f, 1f) : ready ? new Color(0.54f, 0.94f, 1f, 1f) : new Color(0.45f, 0.55f, 0.72f, 1f);
            CreatePanel("Order State Stripe", parent, new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(4f, 0f), new Vector2(5f, 64f), stripeColor);
        }

        private void CreateOrderProgressBar(RectTransform parent, bool ready, bool completed)
        {
            RectTransform track = CreatePanel("Order Progress Track", parent, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(-44f, 7f), new Vector2(248f, 4f), new Color(0.06f, 0.09f, 0.14f, 1f));
            float width = completed ? 248f : ready ? 208f : 88f;
            Color fillColor = completed ? new Color(0.72f, 1f, 0.74f, 1f) : ready ? new Color(0.54f, 0.94f, 1f, 1f) : new Color(0.45f, 0.55f, 0.72f, 1f);
            CreatePanel("Order Progress Fill", track, new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(width / 2f, 0f), new Vector2(width, 4f), fillColor);
        }

        private void CreateOrderActionButton(RectTransform parent, OrderDefinition order, bool ready, bool completed)
        {
            Color buttonColor = completed ? new Color(0.16f, 0.36f, 0.28f, 1f) : ready ? new Color(0.14f, 0.42f, 0.52f, 1f) : new Color(0.18f, 0.22f, 0.32f, 1f);
            RectTransform buttonRoot = CreatePanel("Order Action Button", parent, new Vector2(1f, 0.5f), new Vector2(1f, 0.5f), new Vector2(1f, 0.5f), new Vector2(-12f, 0f), new Vector2(80f, 48f), buttonColor);
            Button button = buttonRoot.gameObject.AddComponent<Button>();
            button.targetGraphic = buttonRoot.GetComponent<Image>();
            button.interactable = !completed;
            button.onClick.AddListener(() => TryCompleteOrder(order));

            string label = completed ? "DONE" : ready ? "CLAIM" : "CHECK";
            Color labelColor = completed ? new Color(0.74f, 1f, 0.78f) : ready ? Color.white : new Color(0.72f, 0.82f, 0.92f);
            CreateText("Order Action Label", buttonRoot, label, 11, labelColor, TextAnchor.MiddleCenter, Vector2.zero, new Vector2(66f, 24f));
        }

        private void CreateRewardRow(RectTransform parent, OrderDefinition order)
        {
            int coins = order.rewards != null ? order.rewards.coins : 0;
            int xp = order.rewards != null ? order.rewards.xp : 0;
            CreateText("Order Reward", parent, $"+{coins} coins / +{xp} xp", 10, new Color(0.72f, 1f, 0.74f), TextAnchor.MiddleLeft, new Vector2(-44f, -17f), new Vector2(248f, 16f));
        }

        private void CreateProducerTile()
        {
            if (theme.producers == null || theme.producers.Length == 0)
            {
                return;
            }

            ProducerDefinition producer = theme.producers[0];
            RectTransform root = CreatePanel("Producer Tile", itemLayer, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), GridToAnchoredPosition(producerGrid), new Vector2(TileSize, TileSize), new Color(0.09f, 0.33f, 0.48f, 1f));
            root.gameObject.AddComponent<RectMask2D>();
            Button button = root.gameObject.AddComponent<Button>();
            button.targetGraphic = root.GetComponent<Image>();
            button.onClick.AddListener(() => TryTapProducer(producer));
            CreateProducerIcon(root);
            CreateText("Producer Label", root, "CRATE", 8, Color.white, TextAnchor.LowerCenter, new Vector2(0f, -20f), new Vector2(TileSize - 6f, 13f));
        }

        private void SeedMergeableItems()
        {
            SeededTile[] seeds =
            {
                new SeededTile("chip_1", 1, 1),
                new SeededTile("chip_1", 2, 1),
                new SeededTile("wire_1", 1, 2),
                new SeededTile("wire_1", 2, 2),
                new SeededTile("drone_1", 3, 1),
                new SeededTile("drone_1", 4, 1),
                new SeededTile("cache_1", 3, 2),
                new SeededTile("cache_1", 4, 2)
            };

            foreach (SeededTile seed in seeds)
            {
                if (itemLookup.TryGetValue(seed.itemId, out ItemLevel level))
                {
                    CreateItemTile(seed.itemId, level, new Vector2Int(seed.x, seed.y));
                }
            }
        }

        public void BeginTileDrag(ItemTile tile, PointerEventData eventData)
        {
            selectedTile = tile;
            tile.canvasGroup.blocksRaycasts = false;
            tile.root.SetParent(dragLayer, true);
            tile.root.SetAsLastSibling();
            MoveDraggedTile(eventData);
        }

        public void DragTile(PointerEventData eventData)
        {
            if (selectedTile != null)
            {
                MoveDraggedTile(eventData);
                UpdateSlotHighlight(eventData);
            }
        }

        public void EndTileDrag(PointerEventData eventData)
        {
            if (selectedTile == null)
            {
                return;
            }

            if (TryFindDropTargetTile(eventData, out ItemTile targetTile))
            {
                if (CanMerge(selectedTile, targetTile))
                {
                    ClearSlotHighlight();
                    TryMergeWith(selectedTile, targetTile);
                }
                else
                {
                    ClearSlotHighlight();
                    ReturnTileHome(selectedTile);
                    SetStatus("Items do not match");
                }

                selectedTile = null;
                return;
            }

            if (TryScreenToGrid(eventData.position, out Vector2Int targetGrid) && IsInsideBoard(targetGrid) && targetGrid != producerGrid)
            {
                if (!boardItems.ContainsKey(targetGrid))
                {
                    ClearSlotHighlight();
                    MoveTile(selectedTile, targetGrid);
                }
                else
                {
                    ClearSlotHighlight();
                    ReturnTileHome(selectedTile);
                    SetStatus("Slot occupied");
                }
            }
            else
            {
                ClearSlotHighlight();
                ReturnTileHome(selectedTile);
            }

            selectedTile = null;
        }

        private void MoveDraggedTile(PointerEventData eventData)
        {
            RectTransformUtility.ScreenPointToLocalPointInRectangle(canvasRoot, eventData.position, eventData.pressEventCamera, out Vector2 localPoint);
            selectedTile.root.SetParent(dragLayer, false);
            selectedTile.root.anchoredPosition = localPoint;
        }

        private void UpdateSlotHighlight(PointerEventData eventData)
        {
            if (!TryScreenToGrid(eventData.position, out Vector2Int targetGrid) || selectedTile == null)
            {
                ClearSlotHighlight();
                return;
            }

            if (highlightedGrid.HasValue && targetGrid == highlightedGrid.Value)
            {
                return;
            }

            ClearSlotHighlight();
            if (!boardSlotHighlights.TryGetValue(targetGrid, out Image highlight))
            {
                return;
            }

            Color color = new Color(0.54f, 0.94f, 1f, 0.28f);
            if (boardItems.TryGetValue(targetGrid, out ItemTile targetTile))
            {
                color = CanMerge(selectedTile, targetTile) ? new Color(0.72f, 1f, 0.74f, 0.32f) : new Color(1f, 0.32f, 0.44f, 0.18f);
            }

            highlight.color = color;
            highlightedGrid = targetGrid;
        }

        private void ClearSlotHighlight()
        {
            if (highlightedGrid.HasValue && boardSlotHighlights.TryGetValue(highlightedGrid.Value, out Image highlight))
            {
                highlight.color = new Color(0.64f, 0.94f, 1f, 0f);
            }

            highlightedGrid = null;
        }

        private bool TryTapProducer(ProducerDefinition producer)
        {
            RefreshProducerCooldown(producer);

            if (producerCooldownReadyAt > NowUnixSeconds())
            {
                SetStatus($"Crate recharging {producerCooldownReadyAt - NowUnixSeconds()}s");
                return false;
            }

            if (producerTapsRemaining <= 0)
            {
                StartProducerCooldown(producer);
                SaveGame();
                SetStatus("Crate cooling down");
                return false;
            }

            if (producer.energyCost > currentEnergy)
            {
                SetStatus("Not enough energy");
                return false;
            }

            if (producer.drops == null || producer.drops.Length == 0)
            {
                SetStatus("Producer has no drops");
                return false;
            }

            if (!FindFirstEmptySlot(out Vector2Int grid))
            {
                SetStatus("Board full");
                return false;
            }

            DropDefinition drop = SelectWeightedDrop(producer);

            if (!itemLookup.TryGetValue(drop.itemId, out ItemLevel level))
            {
                SetStatus($"Missing {drop.itemId}");
                return false;
            }

            currentEnergy -= producer.energyCost;
            producerTapsRemaining -= 1;
            CreateItemTile(drop.itemId, level, grid);
            UpdateEnergyLabel();

            if (producerTapsRemaining <= 0)
            {
                StartProducerCooldown(producer);
                SetStatus($"Generated {level.name}. Crate cooling down");
            }
            else
            {
                SetStatus($"Generated {level.name} / {producerTapsRemaining} taps left");
            }

            RefreshOrdersPanel();
            SaveGame();
            return true;
        }

        private void RefreshProducerCooldown(ProducerDefinition producer)
        {
            if (producerCooldownReadyAt <= 0 || NowUnixSeconds() < producerCooldownReadyAt)
            {
                return;
            }

            producerCooldownReadyAt = 0;
            producerTapsRemaining = Mathf.Max(1, producer.tapLimit);
        }

        private void StartProducerCooldown(ProducerDefinition producer)
        {
            int cooldown = Mathf.Max(1, producer.cooldownSeconds);
            producerCooldownReadyAt = NowUnixSeconds() + cooldown;
            producerTapsRemaining = 0;
        }

        private DropDefinition SelectWeightedDrop(ProducerDefinition producer)
        {
            int totalWeight = 0;
            foreach (DropDefinition drop in producer.drops)
            {
                totalWeight += Mathf.Max(0, drop.weight);
            }

            if (totalWeight <= 0)
            {
                dropCursor += 1;
                return producer.drops[dropCursor % producer.drops.Length];
            }

            int bucket = Mathf.Abs(dropCursor * 37) % totalWeight;
            dropCursor += 1;
            int runningWeight = 0;

            foreach (DropDefinition drop in producer.drops)
            {
                runningWeight += Mathf.Max(0, drop.weight);
                if (bucket < runningWeight)
                {
                    return drop;
                }
            }

            return producer.drops[producer.drops.Length - 1];
        }

        private bool CanCompleteOrder(OrderDefinition order)
        {
            List<ItemTile> requiredTiles = new List<ItemTile>();
            return CollectRequiredTiles(order, requiredTiles);
        }

        private bool TryCompleteOrder(OrderDefinition order)
        {
            if (order == null || string.IsNullOrWhiteSpace(order.id))
            {
                SetStatus("Missing contract");
                return false;
            }

            if (completedOrderIds.Contains(order.id))
            {
                SetStatus("Contract already completed");
                return false;
            }

            List<ItemTile> requiredTiles = new List<ItemTile>();
            if (!CollectRequiredTiles(order, requiredTiles))
            {
                SetStatus("Items do not match contract");
                return false;
            }

            foreach (ItemTile tile in requiredTiles)
            {
                boardItems.Remove(tile.grid);
                Destroy(tile.root.gameObject);
            }

            currentCoins += order.rewards != null ? order.rewards.coins : 0;
            currentXp += order.rewards != null ? order.rewards.xp : 0;
            completedOrderIds.Add(order.id);
            UpdateCurrencyLabels();
            UpdateDistrictProgress();
            RefreshOrdersPanel();
            SetStatus(BuildCompletionStatus(order));
            PlayMergeSound();
            SaveGame();
            return true;
        }

        private bool CollectRequiredTiles(OrderDefinition order, List<ItemTile> requiredTiles)
        {
            requiredTiles.Clear();

            if (order?.requires == null || order.requires.Length == 0)
            {
                return true;
            }

            foreach (RequiredItem requirement in order.requires)
            {
                int found = 0;

                foreach (ItemTile tile in boardItems.Values)
                {
                    if (requiredTiles.Contains(tile) || tile.itemId != requirement.itemId)
                    {
                        continue;
                    }

                    requiredTiles.Add(tile);
                    found += 1;

                    if (found >= requirement.count)
                    {
                        break;
                    }
                }

                if (found < requirement.count)
                {
                    return false;
                }
            }

            return true;
        }

        private string BuildCompletionStatus(OrderDefinition order)
        {
            WorldNode unlockedDistrict = GetDistrictUnlockedAt(completedOrderIds.Count);
            if (unlockedDistrict != null && unlockedDistrict.unlocksAfterOrders > 0)
            {
                return $"Unlocked {unlockedDistrict.title}";
            }

            return $"Completed {order.title}";
        }

        private void UpdateDistrictProgress()
        {
            if (districtLabel == null)
            {
                return;
            }

            WorldNode currentDistrict = GetCurrentDistrict();
            WorldNode nextDistrict = GetNextDistrict();

            if (currentDistrict == null)
            {
                districtLabel.text = $"{completedOrderIds.Count} contracts complete";
                return;
            }

            if (nextDistrict == null)
            {
                districtLabel.text = $"{currentDistrict.title} unlocked / {completedOrderIds.Count} contracts";
                return;
            }

            int target = Mathf.Max(1, nextDistrict.unlocksAfterOrders);
            int progress = Mathf.Clamp(completedOrderIds.Count, 0, target);
            districtLabel.text = $"{currentDistrict.title} {progress}/{target} -> {nextDistrict.title}";
        }

        private WorldNode GetCurrentDistrict()
        {
            if (theme?.worldMap?.nodes == null || theme.worldMap.nodes.Length == 0)
            {
                return null;
            }

            WorldNode current = theme.worldMap.nodes[0];
            foreach (WorldNode node in theme.worldMap.nodes)
            {
                if (completedOrderIds.Count >= node.unlocksAfterOrders)
                {
                    current = node;
                }
            }

            return current;
        }

        private WorldNode GetNextDistrict()
        {
            if (theme?.worldMap?.nodes == null)
            {
                return null;
            }

            foreach (WorldNode node in theme.worldMap.nodes)
            {
                if (completedOrderIds.Count < node.unlocksAfterOrders)
                {
                    return node;
                }
            }

            return null;
        }

        private WorldNode GetDistrictUnlockedAt(int completedOrders)
        {
            if (theme?.worldMap?.nodes == null)
            {
                return null;
            }

            foreach (WorldNode node in theme.worldMap.nodes)
            {
                if (node.unlocksAfterOrders == completedOrders)
                {
                    return node;
                }
            }

            return null;
        }

        private bool FindFirstEmptySlot(out Vector2Int grid)
        {
            for (int y = 0; y < boardHeight; y += 1)
            {
                for (int x = 0; x < boardWidth; x += 1)
                {
                    grid = new Vector2Int(x, y);

                    if (grid == producerGrid)
                    {
                        continue;
                    }

                    if (!boardItems.ContainsKey(grid))
                    {
                        return true;
                    }
                }
            }

            grid = default;
            return false;
        }

        private bool TryFindDropTargetTile(PointerEventData eventData, out ItemTile targetTile)
        {
            targetTile = null;

            GameObject targetObject = eventData.pointerCurrentRaycast.gameObject;
            BoardItemDragHandler handler = targetObject != null ? targetObject.GetComponentInParent<BoardItemDragHandler>() : null;

            if (handler != null && handler.Tile != selectedTile)
            {
                targetTile = handler.Tile;
                return true;
            }

            if (TryScreenToGrid(eventData.position, out Vector2Int grid) && grid != selectedTile.grid)
            {
                return boardItems.TryGetValue(grid, out targetTile);
            }

            return false;
        }

        private bool CanMerge(ItemTile source, ItemTile target)
        {
            return source != null
                && target != null
                && source != target
                && source.chainId == target.chainId
                && source.level == target.level
                && GetNextLevel(target) != null;
        }

        private void TryMergeWith(ItemTile source, ItemTile target)
        {
            ItemLevel nextLevel = GetNextLevel(target);

            if (nextLevel == null)
            {
                ReturnTileHome(source);
                return;
            }

            Vector2Int targetGrid = target.grid;
            boardItems.Remove(source.grid);
            boardItems.Remove(target.grid);
            Destroy(source.root.gameObject);
            Destroy(target.root.gameObject);
            CreateMergedTile(nextLevel, targetGrid);
            PlayMergeFeedback(targetGrid, ItemAccent(nextLevel.id));
            SetStatus($"Merged into {nextLevel.name}");
            RefreshOrdersPanel();
            SaveGame();
        }

        private void CreateMergedTile(ItemLevel nextLevel, Vector2Int grid)
        {
            CreateItemTile(nextLevel.id, nextLevel, grid);
        }

        private void PlayMergeFeedback(Vector2Int grid, Color accent)
        {
            if (mergeFeedbackLayer == null)
            {
                return;
            }

            RectTransform burst = CreatePanel("Merge Burst", mergeFeedbackLayer, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), GridToAnchoredPosition(grid), new Vector2(TileSize + 18f, TileSize + 18f), new Color(accent.r, accent.g, accent.b, 0.2f));
            CreatePanel("Merge Spark A", burst, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-18f, 13f), new Vector2(4f, 14f), new Color(1f, 1f, 1f, 0.75f));
            CreatePanel("Merge Spark B", burst, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(18f, -13f), new Vector2(4f, 14f), new Color(1f, 1f, 1f, 0.75f));
            StartCoroutine(AnimateMergeBurst(burst));
            PlayMergeSound();
        }

        private IEnumerator AnimateMergeBurst(RectTransform burst)
        {
            Vector3 startScale = Vector3.one * 0.72f;
            Vector3 endScale = Vector3.one * 1.18f;
            Image image = burst.GetComponent<Image>();
            Color startColor = image.color;

            for (float time = 0f; time < 0.28f; time += Time.deltaTime)
            {
                float t = time / 0.28f;
                burst.localScale = Vector3.Lerp(startScale, endScale, t);
                image.color = new Color(startColor.r, startColor.g, startColor.b, Mathf.Lerp(startColor.a, 0f, t));
                yield return null;
            }

            Destroy(burst.gameObject);
        }

        private void PlayMergeSound()
        {
            if (feedbackAudio == null)
            {
                return;
            }

            if (mergeSound == null)
            {
                mergeSound = CreateToneClip(740f, 0.08f);
            }

            feedbackAudio.PlayOneShot(mergeSound);
        }

        private AudioClip CreateToneClip(float frequency, float duration)
        {
            const int sampleRate = 22050;
            int sampleCount = Mathf.CeilToInt(sampleRate * duration);
            float[] samples = new float[sampleCount];

            for (int index = 0; index < sampleCount; index += 1)
            {
                float t = index / (float)sampleRate;
                float fade = 1f - index / (float)sampleCount;
                samples[index] = Mathf.Sin(2f * Mathf.PI * frequency * t) * 0.18f * fade;
            }

            AudioClip clip = AudioClip.Create("Merge Pop", sampleCount, 1, sampleRate, false);
            clip.SetData(samples, 0);
            return clip;
        }

        private ItemLevel GetNextLevel(ItemTile tile)
        {
            if (!chainByItemId.TryGetValue(tile.itemId, out ItemChain chain) || chain.levels == null)
            {
                return null;
            }

            for (int index = 0; index < chain.levels.Length - 1; index += 1)
            {
                if (chain.levels[index].id == tile.itemId)
                {
                    return chain.levels[index + 1];
                }
            }

            return null;
        }

        private ItemTile CreateItemTile(string itemId, ItemLevel level, Vector2Int grid)
        {
            RectTransform root = CreateItemCard(itemId, level, grid);
            string chainId = chainByItemId.TryGetValue(itemId, out ItemChain chain) ? chain.id : itemId;
            ItemTile tile = new ItemTile(root, root.GetComponent<CanvasGroup>(), itemId, chainId, level.level, grid);
            BoardItemDragHandler dragHandler = root.gameObject.AddComponent<BoardItemDragHandler>();
            dragHandler.Initialize(this, tile);
            boardItems[grid] = tile;
            return tile;
        }

        private RectTransform CreateItemCard(string itemId, ItemLevel level, Vector2Int grid)
        {
            RectTransform card = CreatePanel($"Item {itemId}", itemLayer, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), GridToAnchoredPosition(grid), new Vector2(TileSize, TileSize), ItemCardColor(itemId, level.level));
            card.gameObject.AddComponent<CanvasGroup>();
            card.gameObject.AddComponent<RectMask2D>();
            CreateTierFrame(card, itemId, level.level);
            CreateProceduralItemIcon(card, itemId, level.level, ItemAccent(itemId));
            CreateTierPips(card, level.level, ItemAccent(itemId));
            CreateLevelBadge(card, level.level);
            CreateItemDisplayLabel(card, itemId, level.name);
            return card;
        }

        private void CreateTierFrame(RectTransform parent, string itemId, int tier)
        {
            Color accent = ItemAccent(itemId);
            float alpha = Mathf.Clamp01(0.18f + tier * 0.09f);
            CreatePanel("Tier Frame Top", parent, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -3f), new Vector2(TileSize - 8f, 2f), new Color(accent.r, accent.g, accent.b, alpha));
            CreatePanel("Tier Frame Bottom", parent, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 3f), new Vector2(TileSize - 10f, 2f), new Color(accent.r, accent.g, accent.b, alpha * 0.7f));
        }

        private void CreateTierPips(RectTransform parent, int tier, Color accent)
        {
            int pipCount = Mathf.Clamp(tier, 1, 4);

            for (int index = 0; index < pipCount; index += 1)
            {
                float x = -9f + index * 6f;
                CreatePanel("Tier Pip", parent, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(x, -9f), new Vector2(4f, 3f), new Color(accent.r, accent.g, accent.b, 0.95f));
            }
        }

        private void CreateLevelBadge(RectTransform parent, int tier)
        {
            RectTransform badge = CreatePanel("Level Badge", parent, new Vector2(1f, 1f), new Vector2(1f, 1f), new Vector2(1f, 1f), new Vector2(-5f, -5f), new Vector2(13f, 13f), new Color(0.06f, 0.075f, 0.1f, 0.92f));
            CreateText("Level Badge Text", badge, tier.ToString(), 8, new Color(0.82f, 0.96f, 1f), TextAnchor.MiddleCenter, Vector2.zero, new Vector2(11f, 11f));
        }

        private void CreateItemDisplayLabel(RectTransform parent, string itemId, string itemName)
        {
            CreateText("Name", parent, ItemDisplayName(itemId, itemName), 8, Color.white, TextAnchor.LowerCenter, new Vector2(0f, -21f), new Vector2(TileSize - 8f, 13f));
        }

        private void CreateProducerIcon(RectTransform parent)
        {
            RectTransform icon = CreatePanel("Producer Icon", parent, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 5f), new Vector2(34f, 28f), new Color(0.22f, 0.68f, 0.96f, 1f));
            CreatePanel("Crate Lid", icon, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -5f), new Vector2(24f, 3f), new Color(0.03f, 0.12f, 0.18f, 1f));
            CreatePanel("Crate Stripe A", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-8f, 0f), new Vector2(3f, 18f), new Color(0.06f, 0.18f, 0.24f, 1f));
            CreatePanel("Crate Stripe B", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(8f, 0f), new Vector2(3f, 18f), new Color(0.06f, 0.18f, 0.24f, 1f));
        }

        private void CreateProceduralItemIcon(RectTransform parent, string itemId, int tier, Color accent)
        {
            float iconWidth = Mathf.Clamp(30f + tier * 2f, 30f, 38f);
            float iconHeight = Mathf.Clamp(24f + tier * 2f, 24f, 30f);
            RectTransform icon = CreatePanel("Procedural Item Icon", parent, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 5f), new Vector2(iconWidth, iconHeight), new Color(accent.r, accent.g, accent.b, 0.92f));
            CreateIconCastShadow(icon);
            CreateIconDepthBase(icon, accent);
            CreateIconHighlight(icon);

            if (itemId.StartsWith("chip"))
            {
                CreateChipMark(icon, tier);
                return;
            }

            if (itemId.StartsWith("wire"))
            {
                CreateWireMark(icon, tier);
                return;
            }

            if (itemId.StartsWith("drone"))
            {
                CreateDroneMark(icon, tier);
                return;
            }

            if (itemId.StartsWith("cache"))
            {
                CreateCacheMark(icon, tier);
                return;
            }

            CreatePanel("Generic Mark", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(14f, 14f), new Color(0.04f, 0.08f, 0.12f, 1f));
        }

        private void CreateIconCastShadow(RectTransform icon)
        {
            CreatePanel("Icon Drop Shadow", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(3f, -3f), new Vector2(30f, 22f), new Color(0f, 0f, 0f, 0.18f));
        }

        private void CreateIconDepthBase(RectTransform icon, Color accent)
        {
            Color front = new Color(Mathf.Min(1f, accent.r + 0.1f), Mathf.Min(1f, accent.g + 0.1f), Mathf.Min(1f, accent.b + 0.1f), 1f);
            Color dark = new Color(accent.r * 0.55f, accent.g * 0.55f, accent.b * 0.55f, 1f);
            Color highlight = new Color(Mathf.Min(1f, accent.r + 0.24f), Mathf.Min(1f, accent.g + 0.24f), Mathf.Min(1f, accent.b + 0.24f), 0.95f);

            CreatePanel("Icon Front Face", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-1f, 1f), new Vector2(28f, 21f), front);
            CreatePanel("Icon Side Bevel", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(14f, -1f), new Vector2(4f, 22f), dark);
            CreatePanel("Icon Bottom Bevel", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(1f, -11f), new Vector2(28f, 4f), dark);
            CreatePanel("Icon Top Bevel", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-1f, 12f), new Vector2(28f, 3f), highlight);
        }

        private void CreateIconHighlight(RectTransform icon)
        {
            CreatePanel("Icon Highlight", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-8f, 8f), new Vector2(9f, 2f), new Color(1f, 1f, 1f, 0.3f));
        }

        private void CreateChipMark(RectTransform icon, int tier)
        {
            CreatePanel("Chip Core", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(14f, 12f), new Color(0.04f, 0.1f, 0.14f, 1f));
            CreatePanel("Chip Trace H", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 7f), new Vector2(24f, 2f), new Color(0.04f, 0.1f, 0.14f, 1f));
            CreatePanel("Chip Trace V", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-10f, 0f), new Vector2(2f, 18f), new Color(0.04f, 0.1f, 0.14f, 1f));

            if (tier >= 2)
            {
                CreatePanel("Chip Trace V2", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(10f, 0f), new Vector2(2f, 18f), new Color(0.04f, 0.1f, 0.14f, 1f));
            }

            if (tier >= 3)
            {
                CreatePanel("Chip Core Plus", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(4f, 18f), new Color(0.04f, 0.1f, 0.14f, 1f));
            }
        }

        private void CreateWireMark(RectTransform icon, int tier)
        {
            CreatePanel("Wire A", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-6f, 2f), new Vector2(5f, 21f), new Color(0.08f, 0.04f, 0.12f, 1f));
            CreatePanel("Wire B", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(6f, -2f), new Vector2(5f, 21f), new Color(0.08f, 0.04f, 0.12f, 1f));
            CreatePanel("Wire Tie", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(23f, 3f), new Color(0.08f, 0.04f, 0.12f, 1f));

            if (tier >= 2)
            {
                CreatePanel("Wire Clamp", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, -7f), new Vector2(20f, 3f), new Color(0.08f, 0.04f, 0.12f, 1f));
            }

            if (tier >= 3)
            {
                CreatePanel("Wire Signal", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 8f), new Vector2(12f, 3f), new Color(0.08f, 0.04f, 0.12f, 1f));
            }
        }

        private void CreateDroneMark(RectTransform icon, int tier)
        {
            CreatePanel("Drone Body", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(12f, 10f), new Color(0.12f, 0.04f, 0.1f, 1f));
            CreatePanel("Drone Rotor L", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-12f, 6f), new Vector2(10f, 4f), new Color(0.12f, 0.04f, 0.1f, 1f));
            CreatePanel("Drone Rotor R", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(12f, 6f), new Vector2(10f, 4f), new Color(0.12f, 0.04f, 0.1f, 1f));
            CreatePanel("Drone Skid", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, -9f), new Vector2(22f, 2f), new Color(0.12f, 0.04f, 0.1f, 1f));

            if (tier >= 2)
            {
                CreatePanel("Drone Camera", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 1f), new Vector2(5f, 5f), new Color(0.12f, 0.04f, 0.1f, 1f));
            }

            if (tier >= 3)
            {
                CreatePanel("Drone Wing", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 8f), new Vector2(28f, 2f), new Color(0.12f, 0.04f, 0.1f, 1f));
            }
        }

        private void CreateCacheMark(RectTransform icon, int tier)
        {
            CreatePanel("Cache Lid", icon, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -6f), new Vector2(22f, 3f), new Color(0.05f, 0.12f, 0.07f, 1f));
            CreatePanel("Cache Lock", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, -1f), new Vector2(7f, 8f), new Color(0.05f, 0.12f, 0.07f, 1f));
            CreatePanel("Cache Base", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, -9f), new Vector2(24f, 3f), new Color(0.05f, 0.12f, 0.07f, 1f));

            if (tier >= 2)
            {
                CreatePanel("Cache Side L", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-10f, -2f), new Vector2(3f, 14f), new Color(0.05f, 0.12f, 0.07f, 1f));
                CreatePanel("Cache Side R", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(10f, -2f), new Vector2(3f, 14f), new Color(0.05f, 0.12f, 0.07f, 1f));
            }

            if (tier >= 3)
            {
                CreatePanel("Cache Crown", icon, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -2f), new Vector2(14f, 3f), new Color(0.05f, 0.12f, 0.07f, 1f));
            }
        }

        private void MoveTile(ItemTile tile, Vector2Int targetGrid)
        {
            boardItems.Remove(tile.grid);
            tile.grid = targetGrid;
            boardItems[targetGrid] = tile;
            ReturnTileHome(tile);
            SaveGame();
        }

        private void ReturnTileHome(ItemTile tile)
        {
            tile.root.SetParent(itemLayer, false);
            tile.root.anchoredPosition = GridToAnchoredPosition(tile.grid);
            tile.canvasGroup.blocksRaycasts = true;
        }

        private void UpdateEnergyLabel()
        {
            if (energyLabel != null)
            {
                energyLabel.text = $"ENERGY {currentEnergy}";
            }
        }

        private void UpdateCurrencyLabels()
        {
            if (coinsLabel != null)
            {
                coinsLabel.text = $"COINS {currentCoins}";
            }

            if (premiumLabel != null)
            {
                premiumLabel.text = $"GEMS {currentPremium}";
            }
        }

        private int GetDefaultProducerTapLimit()
        {
            if (theme?.producers == null || theme.producers.Length == 0)
            {
                return 1;
            }

            return Mathf.Max(1, theme.producers[0].tapLimit);
        }

        private long NowUnixSeconds()
        {
            return DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        }

        private string SaveKey()
        {
            string themeId = theme?.config != null ? theme.config.id : themeResourcePath;
            return $"{SaveKeyPrefix}{themeId}";
        }

        private void SaveGame()
        {
            if (theme?.config == null)
            {
                return;
            }

            MergeClientSaveData saveData = new MergeClientSaveData
            {
                energy = currentEnergy,
                coins = currentCoins,
                premium = currentPremium,
                xp = currentXp,
                dropCursor = dropCursor,
                producerTapsRemaining = producerTapsRemaining,
                producerCooldownReadyAt = producerCooldownReadyAt,
                completedOrderIds = ToCompletedOrderArray(),
                boardItems = ToSavedBoardItems()
            };

            PlayerPrefs.SetString(SaveKey(), JsonUtility.ToJson(saveData));
            PlayerPrefs.Save();
        }

        private bool TryLoadGame()
        {
            if (!PlayerPrefs.HasKey(SaveKey()))
            {
                return false;
            }

            string payload = PlayerPrefs.GetString(SaveKey());
            if (string.IsNullOrWhiteSpace(payload))
            {
                return false;
            }

            MergeClientSaveData saveData = JsonUtility.FromJson<MergeClientSaveData>(payload);
            if (saveData == null)
            {
                return false;
            }

            currentEnergy = saveData.energy;
            currentCoins = saveData.coins;
            currentPremium = saveData.premium;
            currentXp = saveData.xp;
            dropCursor = saveData.dropCursor;
            producerCooldownReadyAt = saveData.producerCooldownReadyAt;
            producerTapsRemaining = saveData.producerTapsRemaining > 0 || producerCooldownReadyAt > 0
                ? saveData.producerTapsRemaining
                : GetDefaultProducerTapLimit();

            completedOrderIds.Clear();
            if (saveData.completedOrderIds != null)
            {
                foreach (string orderId in saveData.completedOrderIds)
                {
                    if (!string.IsNullOrWhiteSpace(orderId))
                    {
                        completedOrderIds.Add(orderId);
                    }
                }
            }

            if (theme.producers != null && theme.producers.Length > 0)
            {
                RefreshProducerCooldown(theme.producers[0]);
            }

            if (saveData.boardItems != null)
            {
                foreach (SavedBoardItem savedItem in saveData.boardItems)
                {
                    Vector2Int grid = new Vector2Int(savedItem.x, savedItem.y);
                    if (!IsInsideBoard(grid) || grid == producerGrid || boardItems.ContainsKey(grid))
                    {
                        continue;
                    }

                    if (itemLookup.TryGetValue(savedItem.itemId, out ItemLevel level))
                    {
                        CreateItemTile(savedItem.itemId, level, grid);
                    }
                }
            }

            SetStatus("Save loaded");
            return true;
        }

        private string[] ToCompletedOrderArray()
        {
            string[] orderIds = new string[completedOrderIds.Count];
            completedOrderIds.CopyTo(orderIds);
            return orderIds;
        }

        private SavedBoardItem[] ToSavedBoardItems()
        {
            SavedBoardItem[] savedItems = new SavedBoardItem[boardItems.Count];
            int index = 0;

            foreach (ItemTile tile in boardItems.Values)
            {
                savedItems[index] = new SavedBoardItem
                {
                    itemId = tile.itemId,
                    x = tile.grid.x,
                    y = tile.grid.y
                };
                index += 1;
            }

            return savedItems;
        }

        private void SetStatus(string message)
        {
            if (statusLabel != null)
            {
                statusLabel.text = message;
            }
        }

        private bool TryScreenToGrid(Vector2 screenPosition, out Vector2Int grid)
        {
            grid = default;

            if (!RectTransformUtility.ScreenPointToLocalPointInRectangle(boardPanel, screenPosition, null, out Vector2 localPoint))
            {
                return false;
            }

            float left = -boardPixelSize / 2f + BoardPadding;
            float top = boardPixelSize / 2f - BoardPadding;
            int x = Mathf.FloorToInt((localPoint.x - left) / (TileSize + TileGap));
            int y = Mathf.FloorToInt((top - localPoint.y) / (TileSize + TileGap));
            grid = new Vector2Int(x, y);
            return IsInsideBoard(grid);
        }

        private bool IsInsideBoard(Vector2Int grid)
        {
            return grid.x >= 0 && grid.y >= 0 && grid.x < boardWidth && grid.y < boardHeight;
        }

        private Vector2 GridToAnchoredPosition(Vector2Int grid)
        {
            float left = -boardPixelSize / 2f + BoardPadding + TileSize / 2f;
            float top = boardPixelSize / 2f - BoardPadding - TileSize / 2f;
            return new Vector2(left + grid.x * (TileSize + TileGap), top - grid.y * (TileSize + TileGap));
        }

        private string FormatRequirements(OrderDefinition order)
        {
            if (order.requires == null || order.requires.Length == 0)
            {
                return "No requirements";
            }

            List<string> parts = new List<string>();

            foreach (RequiredItem requirement in order.requires)
            {
                string name = itemLookup.TryGetValue(requirement.itemId, out ItemLevel level) ? ShortName(level.name) : requirement.itemId;
                parts.Add($"{requirement.count}x {name}");
            }

            return string.Join("  ", parts);
        }

        private string ShortName(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return "";
            }

            return value.Length <= 10 ? value : $"{value.Substring(0, 9)}.";
        }

        private string ItemDisplayName(string itemId, string itemName)
        {
            if (itemId.StartsWith("chip"))
            {
                return itemId.EndsWith("_1") ? "Chip" : "Signal";
            }

            if (itemId.StartsWith("wire"))
            {
                return itemId.EndsWith("_1") ? "Wire" : "Relay";
            }

            if (itemId.StartsWith("drone"))
            {
                return itemId.EndsWith("_1") ? "Shell" : "Scout";
            }

            if (itemId.StartsWith("cache"))
            {
                return itemId.EndsWith("_1") ? "Cache" : "Vault";
            }

            return ShortName(itemName);
        }

        private string IconCode(string itemId)
        {
            if (itemId.StartsWith("chip"))
            {
                return "CHIP";
            }

            if (itemId.StartsWith("wire"))
            {
                return "WIRE";
            }

            if (itemId.StartsWith("drone"))
            {
                return "DRN";
            }

            if (itemId.StartsWith("cache"))
            {
                return "BOX";
            }

            return "ITEM";
        }

        private Color ItemAccent(string itemId)
        {
            if (itemId.StartsWith("chip"))
            {
                return new Color(0.54f, 0.94f, 1f);
            }

            if (itemId.StartsWith("wire"))
            {
                return new Color(0.78f, 0.56f, 1f);
            }

            if (itemId.StartsWith("drone"))
            {
                return new Color(1f, 0.48f, 0.78f);
            }

            if (itemId.StartsWith("cache"))
            {
                return new Color(0.7f, 1f, 0.75f);
            }

            return new Color(0.85f, 0.9f, 1f);
        }

        private Color ItemCardColor(string itemId, int level)
        {
            Color baseColor = Color.Lerp(new Color(0.13f, 0.16f, 0.22f), ItemAccent(itemId), Mathf.Clamp01(level / 6f));
            baseColor.a = 1f;
            return baseColor;
        }

        private RectTransform CreatePanel(string name, Transform parent, Vector2 anchorMin, Vector2 anchorMax, Vector2 pivot, Vector2 position, Vector2 size, Color color)
        {
            Image image = CreateImage(name, parent, color);
            SetRect(image.rectTransform, anchorMin, anchorMax, pivot, position, size);
            return image.rectTransform;
        }

        private Image CreateImage(string name, Transform parent, Color color)
        {
            GameObject imageObject = new GameObject(name, typeof(RectTransform), typeof(Image));
            imageObject.transform.SetParent(parent, false);
            Image image = imageObject.GetComponent<Image>();
            image.color = color;
            return image;
        }

        private RectTransform CreateEmptyRect(string name, Transform parent)
        {
            GameObject rectObject = new GameObject(name, typeof(RectTransform));
            rectObject.transform.SetParent(parent, false);
            return rectObject.GetComponent<RectTransform>();
        }

        private Text CreateText(string name, Transform parent, string value, int size, Color color, TextAnchor alignment, Vector2 position, Vector2 dimensions)
        {
            GameObject textObject = new GameObject(name, typeof(RectTransform), typeof(Text));
            textObject.transform.SetParent(parent, false);
            Text text = textObject.GetComponent<Text>();
            text.font = UiFont;
            text.text = value;
            text.fontSize = size;
            text.color = color;
            text.alignment = alignment;
            text.fontStyle = FontStyle.Bold;
            text.alignByGeometry = true;
            text.horizontalOverflow = HorizontalWrapMode.Wrap;
            text.verticalOverflow = VerticalWrapMode.Overflow;
            text.resizeTextForBestFit = false;
            text.raycastTarget = false;
            SetRect(text.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), position, dimensions);
            return text;
        }

        private static void SetRect(RectTransform rect, Vector2 anchorMin, Vector2 anchorMax, Vector2 pivot, Vector2 position, Vector2 size)
        {
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.pivot = pivot;
            rect.anchoredPosition = position;
            rect.sizeDelta = size;
        }

        private static void Stretch(RectTransform rect)
        {
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }

        private static void EnsureEventSystem()
        {
            if (FindAnyObjectByType<EventSystem>() != null)
            {
                return;
            }

            GameObject eventSystem = new GameObject("EventSystem", typeof(EventSystem), typeof(StandaloneInputModule));
            DontDestroyOnLoad(eventSystem);
        }

        [Serializable]
        private sealed class MergeClientSaveData
        {
            public int energy;
            public int coins;
            public int premium;
            public int xp;
            public int dropCursor;
            public int producerTapsRemaining;
            public long producerCooldownReadyAt;
            public string[] completedOrderIds;
            public SavedBoardItem[] boardItems;
        }

        [Serializable]
        private sealed class SavedBoardItem
        {
            public string itemId;
            public int x;
            public int y;
        }

        private readonly struct SeededTile
        {
            public readonly string itemId;
            public readonly int x;
            public readonly int y;

            public SeededTile(string itemId, int x, int y)
            {
                this.itemId = itemId;
                this.x = x;
                this.y = y;
            }
        }

        public sealed class ItemTile
        {
            public readonly RectTransform root;
            public readonly CanvasGroup canvasGroup;
            public readonly string itemId;
            public readonly string chainId;
            public readonly int level;
            public Vector2Int grid;

            public ItemTile(RectTransform root, CanvasGroup canvasGroup, string itemId, string chainId, int level, Vector2Int grid)
            {
                this.root = root;
                this.canvasGroup = canvasGroup;
                this.itemId = itemId;
                this.chainId = chainId;
                this.level = level;
                this.grid = grid;
            }
        }
    }

    public sealed class BoardItemDragHandler : MonoBehaviour, IBeginDragHandler, IDragHandler, IEndDragHandler
    {
        private MergeClientController controller;
        private MergeClientController.ItemTile tile;

        public MergeClientController.ItemTile Tile => tile;

        public void Initialize(MergeClientController mergeController, MergeClientController.ItemTile itemTile)
        {
            controller = mergeController;
            tile = itemTile;
        }

        public void OnBeginDrag(PointerEventData eventData)
        {
            controller.BeginTileDrag(tile, eventData);
        }

        public void OnDrag(PointerEventData eventData)
        {
            controller.DragTile(eventData);
        }

        public void OnEndDrag(PointerEventData eventData)
        {
            controller.EndTileDrag(eventData);
        }
    }
}
