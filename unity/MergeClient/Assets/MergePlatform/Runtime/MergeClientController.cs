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

        private readonly Dictionary<string, ItemLevel> itemLookup = new Dictionary<string, ItemLevel>();
        private readonly Dictionary<string, ItemChain> chainByItemId = new Dictionary<string, ItemChain>();
        private readonly Dictionary<Vector2Int, ItemTile> boardItems = new Dictionary<Vector2Int, ItemTile>();
        private readonly Dictionary<Vector2Int, RectTransform> boardSlots = new Dictionary<Vector2Int, RectTransform>();
        private readonly Dictionary<Vector2Int, Image> boardSlotHighlights = new Dictionary<Vector2Int, Image>();

        private UnityMergeTheme theme;
        private RectTransform canvasRoot;
        private RectTransform boardPanel;
        private RectTransform itemLayer;
        private RectTransform dragLayer;
        private RectTransform mergeFeedbackLayer;
        private Text energyLabel;
        private Text coinsLabel;
        private Text premiumLabel;
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
        private int dropCursor;
        private int boardWidth;
        private int boardHeight;
        private float boardPixelSize;

        private Font UiFont
        {
            get
            {
                if (uiFont == null)
                {
                    uiFont = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
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
            producerGrid = new Vector2Int(0, 0);

            ClearGeneratedObjects();
            EnsureEventSystem();
            CreateCanvas();
            CreateHud();
            CreateBoard();
            CreateOrdersPanel();
            CreateBottomNav();
            CreateProducerTile();
            SeedMergeableItems();
            UpdateEnergyLabel();
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
            RectTransform hud = CreatePanel("HUD", canvasRoot, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -18f), new Vector2(MobileContentWidth, 110f), new Color(0.03f, 0.04f, 0.055f, 0.96f));
            CreateText("Title", hud, theme.config.displayName, 22, new Color(0.82f, 0.96f, 1f), TextAnchor.MiddleLeft, new Vector2(0f, 8f), new Vector2(340f, 28f));

            energyLabel = CreateStatPill(hud, "ENERGY", new Vector2(-126f, -82f), new Color(0.95f, 0.78f, 0.24f));
            coinsLabel = CreateStatPill(hud, "COINS", new Vector2(0f, -82f), new Color(0.55f, 0.92f, 0.72f));
            premiumLabel = CreateStatPill(hud, "GEMS", new Vector2(126f, -82f), new Color(0.94f, 0.45f, 0.78f));
            statusLabel = CreateText("HUD Status", hud, "Ready", 10, new Color(0.68f, 0.86f, 0.92f), TextAnchor.MiddleLeft, new Vector2(0f, -45f), new Vector2(340f, 16f));

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
            boardPanel = CreatePanel("Merge Board", canvasRoot, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 0.5f), new Vector2(0f, -334f), new Vector2(boardPixelSize, boardPixelSize), new Color(0.04f, 0.052f, 0.07f, 1f));

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
            RectTransform ordersPanel = CreatePanel("Orders Panel", canvasRoot, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -570f), new Vector2(MobileContentWidth, 176f), new Color(0.035f, 0.042f, 0.06f, 0.98f));

            if (theme.orders == null)
            {
                return;
            }

            for (int index = 0; index < theme.orders.Length; index += 1)
            {
                CreateOrderCard(ordersPanel, theme.orders[index], index);
            }
        }

        private void CreateBottomNav()
        {
            RectTransform nav = CreatePanel("Bottom Nav", canvasRoot, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 18f), new Vector2(MobileContentWidth, 52f), new Color(0.025f, 0.031f, 0.044f, 0.98f));
            CreateNavButton(nav, "BOARD", new Vector2(-144f, 26f), true, new Color(0.54f, 0.94f, 1f));
            CreateNavButton(nav, "DIST", new Vector2(-48f, 26f), false, new Color(0.72f, 1f, 0.74f));
            CreateNavButton(nav, "BOOK", new Vector2(48f, 26f), false, new Color(0.78f, 0.56f, 1f));
            CreateNavButton(nav, "SHOP", new Vector2(144f, 26f), false, new Color(1f, 0.48f, 0.78f));
        }

        private void CreateNavButton(RectTransform parent, string label, Vector2 position, bool active, Color accent)
        {
            RectTransform button = CreatePanel($"Nav {label}", parent, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0.5f, 0.5f), position, new Vector2(82f, 38f), active ? new Color(0.1f, 0.16f, 0.24f, 1f) : new Color(0.06f, 0.075f, 0.1f, 1f));
            CreatePanel("Nav Glyph", button, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -7f), new Vector2(active ? 30f : 22f, 3f), accent);
            CreateText("Nav Label", button, label, 9, active ? Color.white : new Color(0.62f, 0.72f, 0.82f), TextAnchor.MiddleCenter, new Vector2(0f, -5f), new Vector2(68f, 18f));
        }

        private void CreateOrderCard(RectTransform parent, OrderDefinition order, int index)
        {
            RectTransform card = CreatePanel($"Order {order.id}", parent, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -20f - index * 68f), new Vector2(356f, 64f), new Color(0.14f, 0.18f, 0.29f, 1f));
            card.gameObject.AddComponent<RectMask2D>();
            CreateOrderProgressBar(card, index);
            CreateText("Order Title", card, order.title, 12, Color.white, TextAnchor.UpperLeft, new Vector2(0f, 13f), new Vector2(274f, 24f));
            CreateOrderStatusBadge(card, index);

            string requirementText = FormatRequirements(order);
            CreateText("Order Requirements", card, requirementText, 9, new Color(0.77f, 0.9f, 1f), TextAnchor.MiddleLeft, new Vector2(0f, -8f), new Vector2(324f, 16f));
            CreateRewardRow(card, order);
        }

        private void CreateOrderProgressBar(RectTransform parent, int index)
        {
            RectTransform track = CreatePanel("Order Progress Track", parent, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 4f), new Vector2(324f, 3f), new Color(0.06f, 0.09f, 0.14f, 1f));
            float width = index == 0 ? 132f : 56f;
            CreatePanel("Order Progress Fill", track, new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(width / 2f, 0f), new Vector2(width, 3f), index == 0 ? new Color(0.54f, 0.94f, 1f, 1f) : new Color(0.72f, 1f, 0.74f, 1f));
        }

        private void CreateOrderStatusBadge(RectTransform parent, int index)
        {
            RectTransform badge = CreatePanel("Order Status Badge", parent, new Vector2(1f, 1f), new Vector2(1f, 1f), new Vector2(1f, 1f), new Vector2(-10f, -10f), new Vector2(22f, 22f), index == 0 ? new Color(0.17f, 0.38f, 0.5f, 1f) : new Color(0.18f, 0.22f, 0.32f, 1f));
            CreateImage("Badge Dot", badge, index == 0 ? new Color(0.54f, 0.94f, 1f, 1f) : new Color(0.72f, 1f, 0.74f, 1f));
            RectTransform dot = badge.GetChild(badge.childCount - 1).GetComponent<RectTransform>();
            SetRect(dot, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(8f, 8f));
        }

        private void CreateRewardRow(RectTransform parent, OrderDefinition order)
        {
            int coins = order.rewards != null ? order.rewards.coins : 0;
            int xp = order.rewards != null ? order.rewards.xp : 0;

            RectTransform coinIcon = CreatePanel("Coin Reward Icon", parent, new Vector2(0f, 0f), new Vector2(0f, 0f), new Vector2(0f, 0f), new Vector2(17f, 13f), new Vector2(10f, 10f), new Color(0.55f, 0.92f, 0.72f, 1f));
            CreatePanel("Coin Reward Shine", coinIcon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(4f, 7f), new Color(0.86f, 1f, 0.9f, 1f));
            CreateText("Coin Reward Text", parent, $"+{coins}", 9, new Color(0.72f, 1f, 0.74f), TextAnchor.MiddleLeft, new Vector2(-124f, -24f), new Vector2(52f, 14f));

            RectTransform xpIcon = CreatePanel("XP Reward Icon", parent, new Vector2(0f, 0f), new Vector2(0f, 0f), new Vector2(0f, 0f), new Vector2(78f, 13f), new Vector2(10f, 10f), new Color(0.54f, 0.94f, 1f, 1f));
            CreatePanel("XP Reward Core", xpIcon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(5f, 5f), new Color(0.04f, 0.1f, 0.16f, 1f));
            CreateText("XP Reward Text", parent, $"+{xp} xp", 9, new Color(0.74f, 0.95f, 1f), TextAnchor.MiddleLeft, new Vector2(-63f, -24f), new Vector2(70f, 14f));
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
            CreateText("Producer Label", root, ShortName(producer.name), 7, Color.white, TextAnchor.LowerCenter, new Vector2(0f, -18f), new Vector2(TileSize - 6f, 12f));
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

            DropDefinition drop = producer.drops[dropCursor % producer.drops.Length];
            dropCursor += 1;

            if (!itemLookup.TryGetValue(drop.itemId, out ItemLevel level))
            {
                SetStatus($"Missing {drop.itemId}");
                return false;
            }

            currentEnergy -= producer.energyCost;
            CreateItemTile(drop.itemId, level, grid);
            UpdateEnergyLabel();
            SetStatus($"Generated {level.name}");
            return true;
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
            CreateProceduralItemIcon(card, itemId, ItemAccent(itemId));
            CreateText("Level", card, $"L{level.level}", 8, new Color(0.85f, 0.94f, 1f), TextAnchor.UpperRight, new Vector2(17f, 19f), new Vector2(28f, 12f));
            CreateText("Name", card, ShortName(level.name), 7, Color.white, TextAnchor.LowerCenter, new Vector2(0f, -18f), new Vector2(TileSize - 6f, 12f));
            return card;
        }

        private void CreateProducerIcon(RectTransform parent)
        {
            RectTransform icon = CreatePanel("Producer Icon", parent, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 5f), new Vector2(34f, 28f), new Color(0.22f, 0.68f, 0.96f, 1f));
            CreatePanel("Crate Lid", icon, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -5f), new Vector2(24f, 3f), new Color(0.03f, 0.12f, 0.18f, 1f));
            CreatePanel("Crate Stripe A", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-8f, 0f), new Vector2(3f, 18f), new Color(0.06f, 0.18f, 0.24f, 1f));
            CreatePanel("Crate Stripe B", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(8f, 0f), new Vector2(3f, 18f), new Color(0.06f, 0.18f, 0.24f, 1f));
        }

        private void CreateProceduralItemIcon(RectTransform parent, string itemId, Color accent)
        {
            RectTransform icon = CreatePanel("Procedural Item Icon", parent, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 5f), new Vector2(34f, 28f), new Color(accent.r, accent.g, accent.b, 0.92f));

            if (itemId.StartsWith("chip"))
            {
                CreateChipMark(icon);
                return;
            }

            if (itemId.StartsWith("wire"))
            {
                CreateWireMark(icon);
                return;
            }

            if (itemId.StartsWith("drone"))
            {
                CreateDroneMark(icon);
                return;
            }

            if (itemId.StartsWith("cache"))
            {
                CreateCacheMark(icon);
                return;
            }

            CreatePanel("Generic Mark", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(14f, 14f), new Color(0.04f, 0.08f, 0.12f, 1f));
        }

        private void CreateChipMark(RectTransform icon)
        {
            CreatePanel("Chip Core", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(14f, 12f), new Color(0.04f, 0.1f, 0.14f, 1f));
            CreatePanel("Chip Trace H", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 7f), new Vector2(24f, 2f), new Color(0.04f, 0.1f, 0.14f, 1f));
            CreatePanel("Chip Trace V", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-10f, 0f), new Vector2(2f, 18f), new Color(0.04f, 0.1f, 0.14f, 1f));
        }

        private void CreateWireMark(RectTransform icon)
        {
            CreatePanel("Wire A", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-6f, 2f), new Vector2(5f, 21f), new Color(0.08f, 0.04f, 0.12f, 1f));
            CreatePanel("Wire B", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(6f, -2f), new Vector2(5f, 21f), new Color(0.08f, 0.04f, 0.12f, 1f));
            CreatePanel("Wire Tie", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(23f, 3f), new Color(0.08f, 0.04f, 0.12f, 1f));
        }

        private void CreateDroneMark(RectTransform icon)
        {
            CreatePanel("Drone Body", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(12f, 10f), new Color(0.12f, 0.04f, 0.1f, 1f));
            CreatePanel("Drone Rotor L", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-12f, 6f), new Vector2(10f, 4f), new Color(0.12f, 0.04f, 0.1f, 1f));
            CreatePanel("Drone Rotor R", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(12f, 6f), new Vector2(10f, 4f), new Color(0.12f, 0.04f, 0.1f, 1f));
            CreatePanel("Drone Skid", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, -9f), new Vector2(22f, 2f), new Color(0.12f, 0.04f, 0.1f, 1f));
        }

        private void CreateCacheMark(RectTransform icon)
        {
            CreatePanel("Cache Lid", icon, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -6f), new Vector2(22f, 3f), new Color(0.05f, 0.12f, 0.07f, 1f));
            CreatePanel("Cache Lock", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, -1f), new Vector2(7f, 8f), new Color(0.05f, 0.12f, 0.07f, 1f));
            CreatePanel("Cache Base", icon, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, -9f), new Vector2(24f, 3f), new Color(0.05f, 0.12f, 0.07f, 1f));
        }

        private void MoveTile(ItemTile tile, Vector2Int targetGrid)
        {
            boardItems.Remove(tile.grid);
            tile.grid = targetGrid;
            boardItems[targetGrid] = tile;
            ReturnTileHome(tile);
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
            text.horizontalOverflow = HorizontalWrapMode.Wrap;
            text.verticalOverflow = VerticalWrapMode.Truncate;
            text.resizeTextForBestFit = true;
            text.resizeTextMinSize = 7;
            text.resizeTextMaxSize = size;
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
