import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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

function appConfig(identity) {
  return formatJson(identity);
}

function appIdentityModule(identity) {
  return `export const ${toCamelIdentifier(identity.slug)} = ${JSON.stringify(identity, null, 2)};\n`;
}

function gameSessionModule() {
  return `import { createMergeGameSession } from '../../../packages/merge-app-session/src/index.js';\nimport { ${'${identityExport}'} } from './appIdentity.js';\n\nconst session = createMergeGameSession({\n  identity: ${'${identityExport}'},\n  initialDropQueue: ['part_1', 'part_1', 'material_1', 'material_1'],\n  itemIcons: {\n    parts: '◇',\n    materials: '◆'\n  }\n});\n\nexport const {\n  claimDailyLogin,\n  completeOrderFromBoard,\n  createInitialSave,\n  describeBoardCell,\n  getChapterProgress,\n  getCurrentDistrict,\n  getEventRail,\n  getOpenOrders,\n  getSessionGoal,\n  mergeBoardCells,\n  moveItem,\n  serializeSave,\n  tapPrimaryProducer\n} = session;\n`;
}

function themeLoaderModule(themeId) {
  return `import { readFileSync } from 'node:fs';\n\nconst THEME_ROOT = new URL('../../../themes/${themeId}/', import.meta.url);\n\nfunction readThemeJson(fileName) {\n  return JSON.parse(readFileSync(new URL(fileName, THEME_ROOT), 'utf8'));\n}\n\nexport function loadTheme() {\n  return {\n    config: readThemeJson('theme.config.json'),\n    itemChains: readThemeJson('item-chains.json'),\n    producers: readThemeJson('producers.json'),\n    orders: readThemeJson('orders.json'),\n    worldMap: readThemeJson('world-map.json'),\n    events: readThemeJson('events.json'),\n    tuning: readThemeJson('tuning.json'),\n    copy: readThemeJson('copy.json')\n  };\n}\n`;
}

function webIndex(name) {
  return `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>${name} Prototype</title>\n    <link rel="stylesheet" href="./styles.css">\n  </head>\n  <body>\n    <main class="app-shell">\n      <section class="status-strip" aria-label="Player status">\n        <div><span>Energy</span><strong id="energy-value">--</strong></div>\n        <div><span>Coins</span><strong id="coins-value">--</strong></div>\n        <div><span>XP</span><strong id="xp-value">--</strong></div>\n        <div><span>Premium</span><strong id="premium-value">--</strong></div>\n      </section>\n\n      <section class="command-bar" aria-label="Core actions">\n        <button id="producer-button" type="button"><span class="button-icon" aria-hidden="true">+</span><span>Producer</span></button>\n        <button id="daily-button" type="button"><span class="button-icon" aria-hidden="true">$</span><span>Daily</span></button>\n        <button id="reset-button" type="button" class="secondary-button"><span class="button-icon" aria-hidden="true">↺</span><span>Reset</span></button>\n      </section>\n\n      <section class="goal-zone" aria-label="Session goal">\n        <div><span id="goal-action">Next</span><strong id="session-goal">--</strong></div>\n        <p id="goal-detail">--</p>\n      </section>\n\n      <section class="board-zone" aria-label="Merge board">\n        <div class="section-heading">\n          <div><span id="app-name">${name}</span><strong id="district-name">Starting District</strong></div>\n          <p id="producer-status">--</p>\n        </div>\n        <div id="merge-board" class="merge-board" role="grid" aria-label="Merge board"></div>\n      </section>\n\n      <section class="progress-zone" aria-label="Progress">\n        <div><span>Board Pressure</span><strong id="board-pressure">0 / 36</strong></div>\n        <div class="progress-track" aria-hidden="true"><span id="pressure-fill"></span></div>\n        <div><span>Orders</span><strong id="chapter-progress">0 / 1</strong></div>\n        <div class="progress-track chapter-track" aria-hidden="true"><span id="chapter-fill"></span></div>\n        <p id="chapter-detail">Complete the starter order to open events.</p>\n      </section>\n\n      <section class="orders-zone" aria-label="Orders">\n        <div class="section-heading"><div><span>Orders</span><strong>Starter Work</strong></div></div>\n        <div id="orders-list" class="orders-list"></div>\n      </section>\n\n      <section id="event-panel" class="event-zone" aria-label="Event">\n        <div><span id="event-status">Locked</span><strong id="event-title">Starter Event</strong></div>\n        <p id="event-detail">Complete the starter order to unlock events.</p>\n      </section>\n\n      <section class="log-zone" aria-label="Activity log">\n        <div class="section-heading"><div><span>Feed</span><strong>Recent Actions</strong></div></div>\n        <ol id="action-log"></ol>\n      </section>\n    </main>\n\n    <script type="module" src="./app.js"></script>\n  </body>\n</html>\n`;
}

function webApp(themeId, saveKey) {
  return `import { bootMergeBrowserApp } from '../../../packages/merge-browser-shell/src/index.js';\nimport * as session from '../src/gameSession.js';\n\nbootMergeBrowserApp({\n  themeRoot: new URL('../../../themes/${themeId}/', import.meta.url),\n  saveKey: '${saveKey}',\n  session\n});\n`;
}

function webStyles() {
  return `@import "../../merge-syndicate/web/styles.css";\n\n:root {\n  --bg: #111416;\n  --panel: #1a2022;\n  --panel-strong: #222a2d;\n  --line: #394346;\n  --green: #67c783;\n  --amber: #e0bd5b;\n  --cyan: #73bfd5;\n}\n`;
}

function themeFiles({ name, themeId, appId }) {
  return {
    'theme.config.json': {
      id: themeId,
      displayName: name,
      appId,
      version: 1,
      board: { width: 6, height: 6 },
      startingState: { energy: 40, coins: 0, premium: 0 }
    },
    'item-chains.json': [
      {
        id: 'parts',
        displayName: 'Parts',
        levels: [
          { id: 'part_1', level: 1, name: 'Part I' },
          { id: 'part_2', level: 2, name: 'Part II' }
        ]
      },
      {
        id: 'materials',
        displayName: 'Materials',
        levels: [
          { id: 'material_1', level: 1, name: 'Material I' },
          { id: 'material_2', level: 2, name: 'Material II' }
        ]
      }
    ],
    'producers.json': [
      {
        id: 'starter_producer',
        name: 'Starter Producer',
        energyCost: 1,
        tapLimit: 8,
        cooldownSeconds: 240,
        drops: [
          { itemId: 'part_1', weight: 50 },
          { itemId: 'material_1', weight: 50 }
        ]
      }
    ],
    'orders.json': [
      {
        id: 'starter_order_1',
        title: 'Complete the Starter Order',
        requires: [
          { itemId: 'part_2', count: 1 },
          { itemId: 'material_2', count: 1 }
        ],
        rewards: { coins: 30, xp: 6 }
      }
    ],
    'world-map.json': {
      nodes: [
        { id: 'starting_district', title: 'Starting District', unlocksAfterOrders: 0 }
      ]
    },
    'events.json': {
      slots: [
        { id: 'starter_event', title: 'Starter Event', type: 'timed_orders' }
      ]
    },
    'tuning.json': {
      energyMax: 40,
      energyRefillSeconds: 150,
      boardSlotsSoftLimit: 27
    },
    'copy.json': {
      onboardingTitle: `Start ${name}.`,
      producerTapCta: 'Use producer',
      firstOrderCta: 'Deliver order'
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

export function createGamePlan({ slug, name, themeId, appId }) {
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
  const themePayloads = themeFiles({ name, themeId, appId });
  const files = [
    { path: path.join(appDir, 'app.config.json'), content: appConfig(identity) },
    { path: path.join(appDir, 'src', 'appIdentity.js'), content: appIdentityModule(identity) },
    {
      path: path.join(appDir, 'src', 'gameSession.js'),
      content: gameSessionModule().replaceAll('${identityExport}', identityExport)
    },
    { path: path.join(appDir, 'src', 'themeLoader.js'), content: themeLoaderModule(themeId) },
    { path: path.join(appDir, 'web', 'index.html'), content: webIndex(name) },
    { path: path.join(appDir, 'web', 'app.js'), content: webApp(themeId, saveKey) },
    { path: path.join(appDir, 'web', 'styles.css'), content: webStyles() },
    { path: path.join(themeDir, 'assets', 'README.md'), content: `# ${name} Assets\n\nPlace generated or sourced theme assets here.\n` }
  ];

  for (const [fileName, payload] of Object.entries(themePayloads)) {
    files.push({ path: path.join(themeDir, fileName), content: formatJson(payload) });
  }

  return {
    identity,
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

  console.log(`Created ${result.identity.name}`);
  for (const file of result.createdFiles) {
    console.log(`- ${file}`);
  }
  console.log('Run npm run verify to validate all apps and themes.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
