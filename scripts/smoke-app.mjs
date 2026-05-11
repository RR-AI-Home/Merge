import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fields = ['name', 'slug', 'appId', 'themeId', 'saveNamespace', 'analyticsStream'];
const uniqueFields = ['appId', 'themeId', 'saveNamespace', 'analyticsStream'];
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultAppsDir = path.resolve(scriptDir, '..', 'apps');

export async function loadAppIdentityOutputs(appsDir = defaultAppsDir) {
  const appEntries = await readdir(appsDir, { withFileTypes: true });
  const outputs = [];

  for (const appEntry of appEntries.filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const appDir = path.join(appsDir, appEntry.name);
    const configPath = path.join(appDir, 'app.config.json');
    let config;

    try {
      config = JSON.parse(await readFile(configPath, 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') {
        continue;
      }

      throw error;
    }

    const identityModule = await import(pathToFileURL(path.join(appDir, 'src', 'appIdentity.js')).href);
    const identity = Object.values(identityModule).find((value) => value?.slug === config.slug);

    outputs.push({ config, identity });
  }

  return outputs;
}

export function validateAppIdentityOutputs(outputs) {
  const errors = [];
  const identities = outputs.map((output) => output.identity);

  for (const { config, identity } of outputs) {
    const slug = config?.slug ?? identity?.slug ?? '<missing slug>';

    if (!identity) {
      errors.push(`${slug} is missing a matching JavaScript identity export`);
      continue;
    }

    for (const field of fields) {
      if (!config[field]) {
        errors.push(`${slug} app.config.json is missing ${field}`);
      }

      if (!identity[field]) {
        errors.push(`${slug} appIdentity.js is missing ${field}`);
      }
    }

    for (const field of fields) {
      if (config[field] !== identity[field]) {
        errors.push(`${slug} app.config.json and appIdentity.js must match ${field}`);
      }
    }
  }

  for (const field of uniqueFields) {
    const values = new Set(identities.map((identity) => identity?.[field]));
    if (values.size !== identities.length) {
      errors.push(`App identities must use unique ${field}`);
    }
  }

  return errors;
}

async function main() {
  const outputs = await loadAppIdentityOutputs();
  const errors = validateAppIdentityOutputs(outputs);

  if (errors.length === 0) {
    console.log('All app identities passed smoke checks');
    return;
  }

  for (const error of errors) {
    console.error(error);
  }

  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
