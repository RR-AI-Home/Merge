import { syndicateIdentity } from '../apps/merge-syndicate/src/appIdentity.js';
import { kingdomLiteIdentity } from '../apps/merge-kingdom-lite/src/appIdentity.js';

const identities = [syndicateIdentity, kingdomLiteIdentity];
const fields = ['name', 'slug', 'appId', 'themeId', 'saveNamespace', 'analyticsStream'];
let failed = false;

for (const identity of identities) {
  for (const field of fields) {
    if (!identity[field]) {
      failed = true;
      console.error(`${identity.slug ?? '<missing slug>'} is missing ${field}`);
    }
  }
}

const uniqueFields = ['appId', 'saveNamespace', 'analyticsStream'];
for (const field of uniqueFields) {
  const values = new Set(identities.map((identity) => identity[field]));
  if (values.size !== identities.length) {
    failed = true;
    console.error(`App identities must use unique ${field}`);
  }
}

if (!failed) {
  console.log('All app identities passed smoke checks');
} else {
  process.exitCode = 1;
}
