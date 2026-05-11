import { readFileSync } from 'node:fs';

const THEME_ROOT = new URL('../../../themes/cyber-syndicate/', import.meta.url);

function readThemeJson(fileName) {
  return JSON.parse(readFileSync(new URL(fileName, THEME_ROOT), 'utf8'));
}

export function loadMergeSyndicateTheme() {
  return {
    config: readThemeJson('theme.config.json'),
    itemChains: readThemeJson('item-chains.json'),
    producers: readThemeJson('producers.json'),
    orders: readThemeJson('orders.json'),
    worldMap: readThemeJson('world-map.json'),
    events: readThemeJson('events.json'),
    tuning: readThemeJson('tuning.json'),
    copy: readThemeJson('copy.json')
  };
}
