import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const TEMPLATE_CATALOG = {
  cozy: {
    id: 'cozy',
    districtTitle: 'Garden Nook',
    progressLabel: 'Garden Orders',
    orderGroupTitle: 'Garden Work',
    producerButtonLabel: 'Basket',
    producerId: 'garden_basket',
    producerName: 'Garden Basket',
    chains: [
      {
        id: 'blooms',
        displayName: 'Blooms',
        icon: 'B',
        levels: [
          { id: 'bud_1', level: 1, name: 'Bud' },
          { id: 'bloom_2', level: 2, name: 'Bloom' }
        ]
      },
      {
        id: 'decor',
        displayName: 'Decor',
        icon: 'D',
        levels: [
          { id: 'ribbon_1', level: 1, name: 'Ribbon' },
          { id: 'garland_2', level: 2, name: 'Garland' }
        ]
      }
    ],
    order: {
      id: 'garden_nook_1',
      title: 'Prepare the Garden Nook',
      rewards: { coins: 30, xp: 6 }
    },
    event: { id: 'market_day', title: 'Market Day' },
    copy: {
      onboardingTitle: 'Restore a peaceful garden one merge at a time.',
      producerTapCta: 'Open basket',
      firstOrderCta: 'Prepare nook'
    },
    colors: {
      bg: '#111611',
      panel: '#1a231a',
      panelStrong: '#223022',
      line: '#3a4938',
      green: '#7fcb62',
      amber: '#e6c463',
      cyan: '#87cfc0'
    }
  },
  crime: {
    id: 'crime',
    districtTitle: 'Back Alley',
    progressLabel: 'Crew Orders',
    orderGroupTitle: 'Crew Work',
    producerButtonLabel: 'Cache',
    producerId: 'black_cache',
    producerName: 'Black Cache',
    chains: [
      {
        id: 'signals',
        displayName: 'Signals',
        icon: 'S',
        levels: [
          { id: 'signal_chip_1', level: 1, name: 'Signal Chip' },
          { id: 'signal_kit_2', level: 2, name: 'Signal Kit' }
        ]
      },
      {
        id: 'gear',
        displayName: 'Gear',
        icon: 'G',
        levels: [
          { id: 'lockpick_1', level: 1, name: 'Lockpick' },
          { id: 'tool_roll_2', level: 2, name: 'Tool Roll' }
        ]
      }
    ],
    order: {
      id: 'signal_kit_1',
      title: 'Assemble the Signal Kit',
      rewards: { coins: 35, xp: 7 }
    },
    event: { id: 'night_run', title: 'Night Run' },
    copy: {
      onboardingTitle: 'Build the crew from the shadows.',
      producerTapCta: 'Open cache',
      firstOrderCta: 'Assemble kit'
    },
    colors: {
      bg: '#101114',
      panel: '#1a1d22',
      panelStrong: '#22262c',
      line: '#343a41',
      green: '#2fd184',
      amber: '#f3bd4e',
      cyan: '#42c4d9'
    }
  },
  fantasy: {
    id: 'fantasy',
    districtTitle: 'Village Green',
    progressLabel: 'Village Orders',
    orderGroupTitle: 'Village Work',
    producerButtonLabel: 'Cart',
    producerId: 'village_cart',
    producerName: 'Village Cart',
    chains: [
      {
        id: 'wood',
        displayName: 'Woodcraft',
        icon: 'W',
        levels: [
          { id: 'twig_1', level: 1, name: 'Twig' },
          { id: 'bundle_2', level: 2, name: 'Wood Bundle' }
        ]
      },
      {
        id: 'ore',
        displayName: 'Ore',
        icon: 'O',
        levels: [
          { id: 'ore_1', level: 1, name: 'Ore Chunk' },
          { id: 'ingot_2', level: 2, name: 'Iron Ingot' }
        ]
      }
    ],
    order: {
      id: 'repair_gate_1',
      title: 'Repair the Village Gate',
      rewards: { coins: 30, xp: 6 }
    },
    event: { id: 'harvest_day', title: 'Harvest Day' },
    copy: {
      onboardingTitle: 'Restore the kingdom one merge at a time.',
      producerTapCta: 'Open cart',
      firstOrderCta: 'Repair gate'
    },
    colors: {
      bg: '#111411',
      panel: '#1a211b',
      panelStrong: '#222b23',
      line: '#3a4439',
      green: '#7fcb62',
      amber: '#e8bf5a',
      cyan: '#7db7d8'
    }
  },
  'sci-fi': {
    id: 'sci-fi',
    districtTitle: 'Orbital Bay',
    progressLabel: 'Colony Orders',
    orderGroupTitle: 'Colony Work',
    producerButtonLabel: 'Pod',
    producerId: 'supply_pod',
    producerName: 'Supply Pod',
    chains: [
      {
        id: 'modules',
        displayName: 'Modules',
        icon: 'M',
        levels: [
          { id: 'module_1', level: 1, name: 'Module Frame' },
          { id: 'module_2', level: 2, name: 'Hab Module' }
        ]
      },
      {
        id: 'power',
        displayName: 'Power',
        icon: 'P',
        levels: [
          { id: 'cell_1', level: 1, name: 'Power Cell' },
          { id: 'reactor_2', level: 2, name: 'Micro Reactor' }
        ]
      }
    ],
    order: {
      id: 'hab_module_1',
      title: 'Activate the Hab Module',
      rewards: { coins: 35, xp: 7 }
    },
    event: { id: 'meteor_window', title: 'Meteor Window' },
    copy: {
      onboardingTitle: 'Bring the colony online one merge at a time.',
      producerTapCta: 'Open pod',
      firstOrderCta: 'Activate module'
    },
    colors: {
      bg: '#101417',
      panel: '#182126',
      panelStrong: '#202c32',
      line: '#36464d',
      green: '#5bd18d',
      amber: '#e8c75b',
      cyan: '#62c9e3'
    }
  }
};

function toCamelIdentifier(slug) {
  return `${slug.replace(/[^a-zA-Z0-9]+(.)/g, (_, character) => character.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '')}Identity`;
}

function toAnalyticsStream(slug) {
  return `${slug.replace(/-/g, '_')}_validation`;
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function requireOption(options, key, flag) {
  if (!options[key]) {
    throw new Error(`Missing required ${flag}`);
  }
}

function resolveTemplate(template = 'cozy') {
  const found = TEMPLATE_CATALOG[template];
  if (!found) {
    throw new Error(`Unknown template ${template}. Supported templates: ${listCreateGameTemplates().join(', ')}`);
  }
  return found;
}

export function listCreateGameTemplates() {
  return Object.keys(TEMPLATE_CATALOG).sort();
}

function appConfig(identity) {
  return formatJson(identity);
}

function appIdentityModule(identity) {
  return `export const ${toCamelIdentifier(identity.slug)} = ${JSON.stringify(identity, null, 2)};\n`;
}

function gameSessionModule(template) {
  const icons = Object.fromEntries(template.chains.map((chain) => [chain.id, chain.icon]));
  const initialDropQueue = template.chains.flatMap((chain) => [chain.levels[0].id, chain.levels[0].id]);

  return `import { createMergeGameSession } from '../../../packages/merge-app-session/src/index.js';\nimport { ${'${identityExport}'} } from './appIdentity.js';\n\nconst session = createMergeGameSession({\n  identity: ${'${identityExport}'},\n  initialDropQueue: ${JSON.stringify(initialDropQueue)},\n  itemIcons: ${JSON.stringify(icons, null, 4)}\n});\n\nexport const {\n  claimDailyLogin,\n  completeOrderFromBoard,\n  createInitialSave,\n  describeBoardCell,\n  getChapterProgress,\n  getCurrentDistrict,\n  getEventRail,\n  getOpenOrders,\n  getSessionGoal,\n  mergeBoardCells,\n  moveItem,\n  serializeSave,\n  tapPrimaryProducer\n} = session;\n`;
}

function themeLoaderModule(themeId) {
  return `import { readFileSync } from 'node:fs';\n\nconst THEME_ROOT = new URL('../../../themes/${themeId}/', import.meta.url);\n\nfunction readThemeJson(fileName) {\n  return JSON.parse(readFileSync(new URL(fileName, THEME_ROOT), 'utf8'));\n}\n\nexport function loadTheme() {\n  return {\n    config: readThemeJson('theme.config.json'),\n    itemChains: readThemeJson('item-chains.json'),\n    producers: readThemeJson('producers.json'),\n    orders: readThemeJson('orders.json'),\n    worldMap: readThemeJson('world-map.json'),\n    events: readThemeJson('events.json'),\n    tuning: readThemeJson('tuning.json'),\n    copy: readThemeJson('copy.json')\n  };\n}\n`;
}

function webIndex(name, template) {
  return `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>${name} Prototype</title>\n    <link rel="stylesheet" href="./styles.css">\n  </head>\n  <body>\n    <main class="app-shell">\n      <section class="status-strip" aria-label="Player status">\n        <div><span>Energy</span><strong id="energy-value">--</strong></div>\n        <div><span>Coins</span><strong id="coins-value">--</strong></div>\n        <div><span>XP</span><strong id="xp-value">--</strong></div>\n        <div><span>Premium</span><strong id="premium-value">--</strong></div>\n      </section>\n\n      <section class="command-bar" aria-label="Core actions">\n        <button id="producer-button" type="button"><span class="button-icon" aria-hidden="true">+</span><span>${template.producerButtonLabel}</span></button>\n        <button id="daily-button" type="button"><span class="button-icon" aria-hidden="true">$</span><span>Daily</span></button>\n        <button id="reset-button" type="button" class="secondary-button"><span class="button-icon" aria-hidden="true">R</span><span>Reset</span></button>\n      </section>\n\n      <section class="goal-zone" aria-label="Session goal">\n        <div><span id="goal-action">Next</span><strong id="session-goal">--</strong></div>\n        <p id="goal-detail">--</p>\n      </section>\n\n      <section class="board-zone" aria-label="Merge board">\n        <div class="section-heading">\n          <div><span id="app-name">${name}</span><strong id="district-name">${template.districtTitle}</strong></div>\n          <p id="producer-status">--</p>\n        </div>\n        <div id="merge-board" class="merge-board" role="grid" aria-label="Merge board"></div>\n      </section>\n\n      <section class="progress-zone" aria-label="Progress">\n        <div><span>Board Pressure</span><strong id="board-pressure">0 / 36</strong></div>\n        <div class="progress-track" aria-hidden="true"><span id="pressure-fill"></span></div>\n        <div><span>${template.progressLabel}</span><strong id="chapter-progress">0 / 1</strong></div>\n        <div class="progress-track chapter-track" aria-hidden="true"><span id="chapter-fill"></span></div>\n        <p id="chapter-detail">Complete the starter order to open events.</p>\n      </section>\n\n      <section class="orders-zone" aria-label="Orders">\n        <div class="section-heading"><div><span>Orders</span><strong>${template.orderGroupTitle}</strong></div></div>\n        <div id="orders-list" class="orders-list"></div>\n      </section>\n\n      <section id="event-panel" class="event-zone" aria-label="Event">\n        <div><span id="event-status">Locked</span><strong id="event-title">${template.event.title}</strong></div>\n        <p id="event-detail">Complete the starter order to unlock events.</p>\n      </section>\n\n      <section class="log-zone" aria-label="Activity log">\n        <div class="section-heading"><div><span>Feed</span><strong>Recent Actions</strong></div></div>\n        <ol id="action-log"></ol>\n      </section>\n    </main>\n\n    <script type="module" src="./app.js"></script>\n  </body>\n</html>\n`;
}

function webApp(themeId, saveKey) {
  return `import { bootMergeBrowserApp } from '../../../packages/merge-browser-shell/src/index.js';\nimport * as session from '../src/gameSession.js';\n\nbootMergeBrowserApp({\n  themeRoot: new URL('../../../themes/${themeId}/', import.meta.url),\n  saveKey: '${saveKey}',\n  session\n});\n`;
}

function webStyles(template) {
  return `@import "../../merge-syndicate/web/styles.css";\n\n:root {\n  --bg: ${template.colors.bg};\n  --panel: ${template.colors.panel};\n  --panel-strong: ${template.colors.panelStrong};\n  --line: ${template.colors.line};\n  --green: ${template.colors.green};\n  --amber: ${template.colors.amber};\n  --cyan: ${template.colors.cyan};\n}\n\n${template.chains.map((chain) => `.cell[data-chain="${chain.id}"] {\n  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--cyan) 35%, transparent);\n}`).join('\n\n')}\n`;
}

function themeFiles({ name, themeId, appId, template }) {
  const firstChain = template.chains[0];
  const secondChain = template.chains[1];

  return {
    'theme.config.json': {
      id: themeId,
      displayName: name,
      appId,
      version: 1,
      board: { width: 6, height: 6 },
      startingState: { energy: 40, coins: 0, premium: 0 }
    },
    'item-chains.json': template.chains.map(({ icon, ...chain }) => chain),
    'producers.json': [
      {
        id: template.producerId,
        name: template.producerName,
        energyCost: 1,
        tapLimit: 8,
        cooldownSeconds: 240,
        drops: [
          { itemId: firstChain.levels[0].id, weight: 50 },
          { itemId: secondChain.levels[0].id, weight: 50 }
        ]
      }
    ],
    'orders.json': [
      {
        id: template.order.id,
        title: template.order.title,
        requires: [
          { itemId: firstChain.levels[1].id, count: 1 },
          { itemId: secondChain.levels[1].id, count: 1 }
        ],
        rewards: template.order.rewards
      }
    ],
    'world-map.json': {
      nodes: [
        { id: 'starting_district', title: template.districtTitle, unlocksAfterOrders: 0 }
      ]
    },
    'events.json': {
      slots: [
        { id: template.event.id, title: template.event.title, type: 'timed_orders' }
      ]
    },
    'tuning.json': {
      energyMax: 40,
      energyRefillSeconds: 150,
      boardSlotsSoftLimit: 27
    },
    'copy.json': {
      ...template.copy
    }
  };
}

export function parseCreateGameArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    const value = args[index + 1];

    if (!flag.startsWith('--')) {
      throw new Error(`Unexpected argument ${flag}`);
    }

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${flag}`);
    }

    if (flag === '--root-dir') {
      options.rootDir = value;
    } else if (flag === '--slug') {
      options.slug = value;
    } else if (flag === '--name') {
      options.name = value;
    } else if (flag === '--theme-id') {
      options.themeId = value;
    } else if (flag === '--app-id') {
      options.appId = value;
    } else if (flag === '--template') {
      options.template = value;
    } else {
      throw new Error(`Unknown option ${flag}`);
    }

    index += 1;
  }

  requireOption(options, 'slug', '--slug');
  requireOption(options, 'name', '--name');
  requireOption(options, 'themeId', '--theme-id');
  requireOption(options, 'appId', '--app-id');

  return options;
}

export function createGamePlan({ slug, name, themeId, appId, template = 'cozy' }) {
  const resolvedTemplate = resolveTemplate(template);
  const identity = {
    name,
    slug,
    appId,
    themeId,
    saveNamespace: `${slug}-save-v1`,
    analyticsStream: toAnalyticsStream(slug)
  };
  const identityExport = toCamelIdentifier(slug);
  const appDir = path.join('apps', slug);
  const themeDir = path.join('themes', themeId);
  const saveKey = `${slug}-prototype-save`;
  const themePayloads = themeFiles({ name, themeId, appId, template: resolvedTemplate });
  const files = [
    { path: path.join(appDir, 'app.config.json'), content: appConfig(identity) },
    { path: path.join(appDir, 'src', 'appIdentity.js'), content: appIdentityModule(identity) },
    {
      path: path.join(appDir, 'src', 'gameSession.js'),
      content: gameSessionModule(resolvedTemplate).replaceAll('${identityExport}', identityExport)
    },
    { path: path.join(appDir, 'src', 'themeLoader.js'), content: themeLoaderModule(themeId) },
    { path: path.join(appDir, 'web', 'index.html'), content: webIndex(name, resolvedTemplate) },
    { path: path.join(appDir, 'web', 'app.js'), content: webApp(themeId, saveKey) },
    { path: path.join(appDir, 'web', 'styles.css'), content: webStyles(resolvedTemplate) },
    { path: path.join(themeDir, 'assets', 'README.md'), content: `# ${name} Assets\n\nPlace generated or sourced theme assets here.\n` }
  ];

  for (const [fileName, payload] of Object.entries(themePayloads)) {
    files.push({ path: path.join(themeDir, fileName), content: formatJson(payload) });
  }

  return {
    identity,
    template: resolvedTemplate,
    paths: { appDir, themeDir },
    files
  };
}

export async function createGame({ rootDir = process.cwd(), ...options }) {
  const plan = createGamePlan(options);
  const existing = plan.files
    .map((file) => path.join(rootDir, file.path))
    .filter((filePath) => existsSync(filePath));

  if (existing.length > 0) {
    throw new Error(`Refusing to overwrite existing files:\n${existing.join('\n')}`);
  }

  const createdFiles = [];
  for (const file of plan.files) {
    const absolutePath = path.join(rootDir, file.path);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, file.content, 'utf8');
    createdFiles.push(file.path);
  }

  return { ...plan, createdFiles };
}

async function main() {
  const options = parseCreateGameArgs(process.argv.slice(2));
  const result = await createGame(options);

  console.log(`Created ${result.identity.name} using ${result.template.id} template`);
  for (const file of result.createdFiles) {
    console.log(`- ${file}`);
  }
  console.log('Run npm run verify to validate all apps and themes.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
