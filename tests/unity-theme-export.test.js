import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { exportUnityTheme, parseUnityThemeExportArgs } from '../scripts/export-unity-theme.mjs';

test('exportUnityTheme writes a Unity-friendly theme payload', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'merge-unity-theme-'));

  try {
    const outputPath = path.join(root, 'cyber-syndicate.json');
    const result = await exportUnityTheme({
      themeId: 'cyber-syndicate',
      outputPath
    });

    const payload = JSON.parse(await readFile(outputPath, 'utf8'));

    assert.equal(result.outputPath, outputPath);
    assert.equal(payload.themeId, 'cyber-syndicate');
    assert.equal(payload.config.displayName, 'Merge Syndicate');
    assert.equal(payload.config.board.width, 6);
    assert.equal(payload.config.board.height, 6);
    assert.equal(Array.isArray(payload.itemChains), true);
    assert.equal(Array.isArray(payload.producers), true);
    assert.equal(Array.isArray(payload.orders), true);
    assert.equal(Array.isArray(payload.worldMap.nodes), true);
    assert.equal(Array.isArray(payload.events.slots), true);
    assert.equal(typeof payload.tuning.energyRefillSeconds, 'number');
    assert.equal(typeof payload.copy.onboardingTitle, 'string');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('exportUnityTheme refuses to overwrite existing output by default', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'merge-unity-theme-'));

  try {
    const outputPath = path.join(root, 'existing.json');
    await writeFile(outputPath, '{}\n');

    await assert.rejects(() => exportUnityTheme({
      themeId: 'cyber-syndicate',
      outputPath
    }), /Refusing to overwrite/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('parseUnityThemeExportArgs supports root and force options', () => {
  assert.deepEqual(parseUnityThemeExportArgs([
    '--theme-id', 'cyber-syndicate',
    '--output', 'E:\\Projects\\Merge\\Unity\\MergeClient\\Assets\\MergePlatform\\Resources\\Themes\\cyber-syndicate.json',
    '--root-dir', 'C:\\repo\\merge',
    '--force'
  ]), {
    themeId: 'cyber-syndicate',
    outputPath: 'E:\\Projects\\Merge\\Unity\\MergeClient\\Assets\\MergePlatform\\Resources\\Themes\\cyber-syndicate.json',
    rootDir: 'C:\\repo\\merge',
    force: true
  });

  assert.throws(() => parseUnityThemeExportArgs(['--theme-id', 'cyber-syndicate']), /Missing required --output/);
});
