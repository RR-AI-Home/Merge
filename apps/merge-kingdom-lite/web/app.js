import { bootMergeBrowserApp } from '../../../packages/merge-browser-shell/src/index.js';
import * as session from '../src/gameSession.js';

bootMergeBrowserApp({
  themeRoot: new URL('../../../themes/kingdom-lite/', import.meta.url),
  saveKey: 'merge-kingdom-lite-prototype-save',
  session
});
