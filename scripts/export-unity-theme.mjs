import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateThemeBundle } from '../packages/theme-contracts/src/index.js';

const THEME_FILES = {
  config: 'theme.config.json',
  itemChains: 'item-chains.json',
  producers: 'producers.json',
  orders: 'orders.json',
  worldMap: 'world-map.json',
  events: 'events.json',
  tuning: 'tuning.json',
  copy: 'copy.json'
};

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function loadThemeBundle(rootDir, themeId) {
  const themeDir = path.join(rootDir, 'themes', themeId);
  const entries = await Promise.all(Object.entries(THEME_FILES).map(async ([key, filename]) => {
    return [key, await readJson(path.join(themeDir, filename))];
  }));

  return Object.fromEntries(entries);
}

export function parseUnityThemeExportArgs(args) {
  const parsed = {
    themeId: null,
    outputPath: null,
    rootDir: process.cwd(),
    force: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--theme-id') {
      parsed.themeId = args[index + 1];
      index += 1;
    } else if (arg === '--output') {
      parsed.outputPath = args[index + 1];
      index += 1;
    } else if (arg === '--root-dir') {
      parsed.rootDir = args[index + 1];
      index += 1;
    } else if (arg === '--force') {
      parsed.force = true;
    } else {
      throw new Error(`Unknown argument ${arg}`);
    }
  }

  if (!parsed.themeId) {
    throw new Error('Missing required --theme-id');
  }

  if (!parsed.outputPath) {
    throw new Error('Missing required --output');
  }

  return parsed;
}

export async function exportUnityTheme({
  themeId,
  outputPath,
  rootDir = process.cwd(),
  force = false
}) {
  if (!themeId) {
    throw new Error('themeId is required');
  }

  if (!outputPath) {
    throw new Error('outputPath is required');
  }

  if (existsSync(outputPath) && !force) {
    throw new Error(`Refusing to overwrite ${outputPath}. Pass --force to replace it.`);
  }

  const theme = await loadThemeBundle(rootDir, themeId);
  const validation = validateThemeBundle(theme);

  if (!validation.ok) {
    throw new Error(`Theme ${themeId} is not valid for export: ${validation.errors.join('; ')}`);
  }

  const payload = {
    schema: 'merge-platform.unity-theme.v1',
    themeId,
    exportedAt: new Date().toISOString(),
    ...theme
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);

  return {
    themeId,
    outputPath
  };
}

async function main() {
  const options = parseUnityThemeExportArgs(process.argv.slice(2));
  const result = await exportUnityTheme(options);
  console.log(`Exported ${result.themeId} to ${result.outputPath}`);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
