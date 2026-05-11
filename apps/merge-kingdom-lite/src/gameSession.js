import { createMergeGameSession } from '../../../packages/merge-app-session/src/index.js';
import { kingdomLiteIdentity } from './appIdentity.js';

const session = createMergeGameSession({
  identity: kingdomLiteIdentity,
  initialDropQueue: ['twig_1', 'twig_1', 'ore_1', 'ore_1'],
  itemIcons: {
    wood: '♢',
    ore: '◆'
  }
});

export const {
  claimDailyLogin,
  completeOrderFromBoard,
  createInitialSave,
  describeBoardCell,
  getChapterProgress,
  getCurrentDistrict,
  getEventRail,
  getOpenOrders,
  getSessionGoal,
  mergeBoardCells,
  moveItem,
  serializeSave,
  tapPrimaryProducer
} = session;
