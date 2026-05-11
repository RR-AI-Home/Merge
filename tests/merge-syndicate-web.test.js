import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const WEB_ROOT = new URL('../apps/merge-syndicate/web/', import.meta.url);

test('browser prototype ships the required static assets', () => {
  assert.equal(existsSync(new URL('index.html', WEB_ROOT)), true);
  assert.equal(existsSync(new URL('styles.css', WEB_ROOT)), true);
  assert.equal(existsSync(new URL('app.js', WEB_ROOT)), true);
});

test('browser prototype boots the Merge Syndicate app module', () => {
  const index = readFileSync(new URL('index.html', WEB_ROOT), 'utf8');
  const script = readFileSync(new URL('app.js', WEB_ROOT), 'utf8');

  assert.match(index, /<script type="module" src="\.\/app\.js"><\/script>/);
  assert.match(index, /id="merge-board"/);
  assert.match(index, /id="session-goal"/);
  assert.match(script, /createInitialSave/);
  assert.match(script, /tapPrimaryProducer/);
  assert.match(script, /completeOrderFromBoard/);
  assert.match(script, /getSessionGoal/);
  assert.match(script, /feedback-pop/);
});
