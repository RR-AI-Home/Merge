import assert from 'node:assert/strict';
import test from 'node:test';
import {
  loadPlayableAppOutputs,
  validatePlayableAppOutputs
} from '../scripts/verify-playable-apps.mjs';

const playableOutputs = await loadPlayableAppOutputs();

test('playable verifier discovers every standalone browser app', () => {
  const slugs = playableOutputs.map((output) => output.identity.slug).sort();

  assert.deepEqual(slugs, ['merge-kingdom-lite', 'merge-syndicate']);
});

test('playable verifier proves each app can start its first loop', () => {
  const errors = validatePlayableAppOutputs(playableOutputs);

  assert.deepEqual(errors, []);
});

test('playable verifier rejects broken app outputs', () => {
  const [output] = playableOutputs;
  const errors = validatePlayableAppOutputs([
    {
      ...output,
      identity: {
        ...output.identity,
        saveNamespace: ''
      }
    }
  ]);

  assert.deepEqual(errors, [`${output.identity.slug} is missing saveNamespace`]);
});
