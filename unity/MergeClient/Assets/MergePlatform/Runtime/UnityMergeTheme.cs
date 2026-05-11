using System;

namespace MergePlatform.Client
{
    [Serializable]
    public sealed class UnityMergeTheme
    {
        public string schema;
        public string themeId;
        public string exportedAt;
        public ThemeConfig config;
        public ItemChain[] itemChains;
        public ProducerDefinition[] producers;
        public OrderDefinition[] orders;
        public WorldMap worldMap;
        public EventCatalog events;
        public TuningConfig tuning;
        public CopyConfig copy;
    }

    [Serializable]
    public sealed class ThemeConfig
    {
        public string id;
        public string displayName;
        public string appId;
        public int version;
        public BoardConfig board;
        public StartingState startingState;
    }

    [Serializable]
    public sealed class BoardConfig
    {
        public int width;
        public int height;
    }

    [Serializable]
    public sealed class StartingState
    {
        public int energy;
        public int coins;
        public int premium;
    }

    [Serializable]
    public sealed class ItemChain
    {
        public string id;
        public string displayName;
        public ItemLevel[] levels;
    }

    [Serializable]
    public sealed class ItemLevel
    {
        public string id;
        public int level;
        public string name;
    }

    [Serializable]
    public sealed class ProducerDefinition
    {
        public string id;
        public string name;
        public int energyCost;
        public int tapLimit;
        public int cooldownSeconds;
        public DropDefinition[] drops;
    }

    [Serializable]
    public sealed class DropDefinition
    {
        public string itemId;
        public int weight;
    }

    [Serializable]
    public sealed class OrderDefinition
    {
        public string id;
        public string title;
        public RequiredItem[] requires;
        public RewardDefinition rewards;
    }

    [Serializable]
    public sealed class RequiredItem
    {
        public string itemId;
        public int count;
    }

    [Serializable]
    public sealed class RewardDefinition
    {
        public int coins;
        public int xp;
    }

    [Serializable]
    public sealed class WorldMap
    {
        public WorldNode[] nodes;
    }

    [Serializable]
    public sealed class WorldNode
    {
        public string id;
        public string title;
        public int unlocksAfterOrders;
    }

    [Serializable]
    public sealed class EventCatalog
    {
        public EventSlot[] slots;
    }

    [Serializable]
    public sealed class EventSlot
    {
        public string id;
        public string title;
        public string type;
    }

    [Serializable]
    public sealed class TuningConfig
    {
        public int energyMax;
        public int energyRefillSeconds;
        public int boardSlotsSoftLimit;
    }

    [Serializable]
    public sealed class CopyConfig
    {
        public string onboardingTitle;
        public string producerTapCta;
        public string firstOrderCta;
    }
}
