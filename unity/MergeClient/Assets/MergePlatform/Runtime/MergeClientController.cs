using System.Collections.Generic;
using UnityEngine;

namespace MergePlatform.Client
{
    public sealed class MergeClientController : MonoBehaviour
    {
        [SerializeField] private string themeResourcePath = "Themes/cyber-syndicate";
        [SerializeField] private float tileSpacing = 1.12f;

        private readonly Dictionary<string, ItemLevel> itemLookup = new Dictionary<string, ItemLevel>();
        private readonly Dictionary<string, ItemChain> chainByItemId = new Dictionary<string, ItemChain>();
        private readonly Dictionary<Vector2Int, ItemTile> boardItems = new Dictionary<Vector2Int, ItemTile>();
        private readonly Dictionary<Collider, ItemTile> tileByCollider = new Dictionary<Collider, ItemTile>();

        private UnityMergeTheme theme;
        private ItemTile selectedTile;
        private Vector3 selectedOffset;
        private int boardWidth;
        private int boardHeight;
        private float originX;
        private float originZ;

        private void Start()
        {
            EnsureCamera();
            EnsureLighting();
            LoadTheme();
            BuildScene();
        }

        private void Update()
        {
            if (Input.GetMouseButtonDown(0))
            {
                BeginDrag(Input.mousePosition);
            }
            else if (selectedTile != null && Input.GetMouseButton(0))
            {
                ContinueDrag(Input.mousePosition);
            }
            else if (selectedTile != null && Input.GetMouseButtonUp(0))
            {
                EndDrag(Input.mousePosition);
            }
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
                DrawLabel("No merge theme loaded", new Vector3(0f, 1f, 0f), 0.48f, Color.red);
                return;
            }

            boardWidth = Mathf.Max(1, theme.config.board.width);
            boardHeight = Mathf.Max(1, theme.config.board.height);
            originX = -((boardWidth - 1) * tileSpacing) / 2f;
            originZ = -((boardHeight - 1) * tileSpacing) / 2f;

            DrawLabel(theme.config.displayName, new Vector3(0f, 0.25f, originZ - 1.45f), 0.44f, new Color(0.78f, 0.95f, 1f));
            DrawLabel(theme.copy != null ? theme.copy.onboardingTitle : theme.themeId, new Vector3(0f, 0.25f, originZ - 0.9f), 0.22f, Color.white);

            for (int y = 0; y < boardHeight; y += 1)
            {
                for (int x = 0; x < boardWidth; x += 1)
                {
                    Vector3 position = GridToWorld(new Vector2Int(x, y), 0f);
                    CreateCube($"BoardSlot_{x}_{y}", transform, position, new Vector3(1f, 0.08f, 1f), new Color(0.09f, 0.11f, 0.15f), false);
                }
            }

            DrawProducer();
            SeedMergeableItems();
            DrawOrders();
        }

        private void DrawProducer()
        {
            if (theme.producers == null || theme.producers.Length == 0)
            {
                return;
            }

            ProducerDefinition producer = theme.producers[0];
            Vector3 position = GridToWorld(new Vector2Int(0, boardHeight - 1), 0.28f);
            CreateCube("Producer", transform, position, new Vector3(0.92f, 0.44f, 0.92f), new Color(0.15f, 0.42f, 0.55f), false);
            DrawLabel(producer.name, position + new Vector3(0f, 0.34f, 0f), 0.16f, Color.white);
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

        private void DrawOrders()
        {
            if (theme.orders == null || theme.orders.Length == 0)
            {
                return;
            }

            float rightEdge = originX + (boardWidth - 1) * tileSpacing + 1.8f;
            DrawLabel("Orders", new Vector3(rightEdge, 0.35f, originZ - 0.1f), 0.28f, new Color(0.88f, 0.98f, 1f));

            for (int index = 0; index < theme.orders.Length; index += 1)
            {
                OrderDefinition order = theme.orders[index];
                Vector3 position = new Vector3(rightEdge, 0.18f, originZ + (index + 1) * 1.25f);
                CreateCube(order.id, transform, position, new Vector3(1.95f, 0.12f, 0.82f), new Color(0.18f, 0.2f, 0.27f), false);
                DrawLabel(order.title, position + new Vector3(0f, 0.18f, 0f), 0.14f, Color.white);

                string reward = order.rewards != null ? $"{order.rewards.coins} coins / {order.rewards.xp} xp" : "reward";
                DrawLabel(reward, position + new Vector3(0f, 0.18f, 0.24f), 0.11f, new Color(0.75f, 0.95f, 0.78f));
            }
        }

        private void BeginDrag(Vector3 screenPosition)
        {
            if (!TryRaycastTile(screenPosition, out ItemTile tile))
            {
                return;
            }

            selectedTile = tile;
            selectedOffset = selectedTile.root.transform.position - ScreenToBoardPoint(screenPosition);
            selectedTile.root.transform.position += Vector3.up * 0.28f;
        }

        private void ContinueDrag(Vector3 screenPosition)
        {
            Vector3 point = ScreenToBoardPoint(screenPosition);
            selectedTile.root.transform.position = new Vector3(point.x + selectedOffset.x, 0.62f, point.z + selectedOffset.z);
        }

        private void EndDrag(Vector3 screenPosition)
        {
            Vector2Int targetGrid = WorldToGrid(ScreenToBoardPoint(screenPosition));

            if (!IsInsideBoard(targetGrid))
            {
                ReturnTileHome(selectedTile);
                selectedTile = null;
                return;
            }

            if (targetGrid == selectedTile.grid)
            {
                ReturnTileHome(selectedTile);
                selectedTile = null;
                return;
            }

            if (!boardItems.TryGetValue(targetGrid, out ItemTile targetTile))
            {
                MoveTile(selectedTile, targetGrid);
                selectedTile = null;
                return;
            }

            if (CanMerge(selectedTile, targetTile))
            {
                TryMergeWith(selectedTile, targetTile);
            }
            else
            {
                ReturnTileHome(selectedTile);
            }

            selectedTile = null;
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
            tileByCollider.Remove(source.collider);
            tileByCollider.Remove(target.collider);
            Destroy(source.root);
            Destroy(target.root);
            CreateMergedTile(nextLevel, targetGrid);
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

        private void CreateMergedTile(ItemLevel nextLevel, Vector2Int grid)
        {
            CreateItemTile(nextLevel.id, nextLevel, grid);
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
            GameObject root = new GameObject($"Item_{itemId}_{grid.x}_{grid.y}");
            root.transform.SetParent(transform);
            root.transform.position = GridToWorld(grid, 0.28f);

            Color color = Color.Lerp(new Color(0.28f, 0.86f, 0.73f), new Color(0.94f, 0.45f, 0.72f), Mathf.Clamp01(level.level / 3f));
            GameObject cube = CreateCube($"{itemId}_Body", root.transform, Vector3.zero, new Vector3(0.78f, 0.38f, 0.78f), color, true);
            TextMesh label = DrawLabel(level.name, root.transform, new Vector3(0f, 0.34f, 0f), 0.14f, Color.black);

            string chainId = chainByItemId.TryGetValue(itemId, out ItemChain chain) ? chain.id : itemId;
            ItemTile tile = new ItemTile(root, cube.GetComponent<Collider>(), label, itemId, chainId, level.level, grid);
            boardItems[grid] = tile;
            tileByCollider[tile.collider] = tile;
            return tile;
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
            tile.root.transform.position = GridToWorld(tile.grid, 0.28f);
        }

        private bool TryRaycastTile(Vector3 screenPosition, out ItemTile tile)
        {
            tile = null;
            Camera camera = Camera.main;

            if (camera == null)
            {
                return false;
            }

            Ray ray = camera.ScreenPointToRay(screenPosition);
            return Physics.Raycast(ray, out RaycastHit hit, 100f) && tileByCollider.TryGetValue(hit.collider, out tile);
        }

        private Vector3 ScreenToBoardPoint(Vector3 screenPosition)
        {
            Camera camera = Camera.main;

            if (camera == null)
            {
                return Vector3.zero;
            }

            Plane plane = new Plane(Vector3.up, new Vector3(0f, 0.28f, 0f));
            Ray ray = camera.ScreenPointToRay(screenPosition);
            return plane.Raycast(ray, out float distance) ? ray.GetPoint(distance) : Vector3.zero;
        }

        private Vector2Int WorldToGrid(Vector3 world)
        {
            int x = Mathf.RoundToInt((world.x - originX) / tileSpacing);
            int y = Mathf.RoundToInt((world.z - originZ) / tileSpacing);
            return new Vector2Int(x, y);
        }

        private Vector3 GridToWorld(Vector2Int grid, float y)
        {
            return new Vector3(originX + grid.x * tileSpacing, y, originZ + grid.y * tileSpacing);
        }

        private bool IsInsideBoard(Vector2Int grid)
        {
            return grid.x >= 0 && grid.y >= 0 && grid.x < boardWidth && grid.y < boardHeight;
        }

        private static GameObject CreateCube(string name, Transform parent, Vector3 localPosition, Vector3 scale, Color color, bool withCollider)
        {
            GameObject cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
            cube.name = name;
            cube.transform.SetParent(parent);
            cube.transform.localPosition = localPosition;
            cube.transform.localScale = scale;
            Renderer renderer = cube.GetComponent<Renderer>();
            renderer.material = new Material(Shader.Find("Standard"));
            renderer.material.color = color;

            Collider collider = cube.GetComponent<Collider>();

            if (!withCollider && collider != null)
            {
                collider.enabled = false;
            }

            return cube;
        }

        private TextMesh DrawLabel(string text, Vector3 position, float size, Color color)
        {
            GameObject labelObject = new GameObject($"Label_{text}");
            labelObject.transform.SetParent(transform);
            labelObject.transform.position = position;
            labelObject.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
            return ConfigureLabel(labelObject, text, size, color);
        }

        private TextMesh DrawLabel(string text, Transform parent, Vector3 localPosition, float size, Color color)
        {
            GameObject labelObject = new GameObject($"Label_{text}");
            labelObject.transform.SetParent(parent);
            labelObject.transform.localPosition = localPosition;
            labelObject.transform.localRotation = Quaternion.Euler(90f, 0f, 0f);
            return ConfigureLabel(labelObject, text, size, color);
        }

        private static TextMesh ConfigureLabel(GameObject labelObject, string text, float size, Color color)
        {
            TextMesh label = labelObject.AddComponent<TextMesh>();
            label.text = text;
            label.anchor = TextAnchor.MiddleCenter;
            label.alignment = TextAlignment.Center;
            label.characterSize = size;
            label.color = color;
            return label;
        }

        private static void EnsureCamera()
        {
            Camera camera = Camera.main;

            if (camera == null)
            {
                GameObject cameraObject = new GameObject("Main Camera");
                cameraObject.tag = "MainCamera";
                camera = cameraObject.AddComponent<Camera>();
            }

            camera.transform.position = new Vector3(2.2f, 9.8f, -1.6f);
            camera.transform.rotation = Quaternion.Euler(72f, 0f, 0f);
            camera.orthographic = true;
            camera.orthographicSize = 6.2f;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.025f, 0.03f, 0.045f);
        }

        private static void EnsureLighting()
        {
            if (FindAnyObjectByType<Light>() != null)
            {
                return;
            }

            GameObject lightObject = new GameObject("Key Light");
            Light light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.1f;
            light.transform.rotation = Quaternion.Euler(50f, -30f, 20f);
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

        private sealed class ItemTile
        {
            public readonly GameObject root;
            public readonly Collider collider;
            public readonly TextMesh label;
            public readonly string itemId;
            public readonly string chainId;
            public readonly int level;
            public Vector2Int grid;

            public ItemTile(GameObject root, Collider collider, TextMesh label, string itemId, string chainId, int level, Vector2Int grid)
            {
                this.root = root;
                this.collider = collider;
                this.label = label;
                this.itemId = itemId;
                this.chainId = chainId;
                this.level = level;
                this.grid = grid;
            }
        }
    }
}
