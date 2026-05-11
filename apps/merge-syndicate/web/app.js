import {
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
} from '../src/gameSession.js';

const THEME_ROOT = new URL('../../../themes/cyber-syndicate/', import.meta.url);
const SAVE_KEY = 'merge-syndicate-prototype-save';
const log = [];

let theme;
let save;
let selectedCell = null;

const elements = {
  appName: document.querySelector('#app-name'),
  board: document.querySelector('#merge-board'),
  boardPressure: document.querySelector('#board-pressure'),
  chapterDetail: document.querySelector('#chapter-detail'),
  chapterFill: document.querySelector('#chapter-fill'),
  chapterProgress: document.querySelector('#chapter-progress'),
  coins: document.querySelector('#coins-value'),
  dailyButton: document.querySelector('#daily-button'),
  district: document.querySelector('#district-name'),
  energy: document.querySelector('#energy-value'),
  eventDetail: document.querySelector('#event-detail'),
  eventPanel: document.querySelector('#event-panel'),
  eventStatus: document.querySelector('#event-status'),
  eventTitle: document.querySelector('#event-title'),
  goalAction: document.querySelector('#goal-action'),
  goalDetail: document.querySelector('#goal-detail'),
  log: document.querySelector('#action-log'),
  orders: document.querySelector('#orders-list'),
  premium: document.querySelector('#premium-value'),
  pressureFill: document.querySelector('#pressure-fill'),
  producerButton: document.querySelector('#producer-button'),
  producerStatus: document.querySelector('#producer-status'),
  resetButton: document.querySelector('#reset-button'),
  sessionGoal: document.querySelector('#session-goal'),
  xp: document.querySelector('#xp-value')
};

async function readThemeJson(fileName) {
  const response = await fetch(new URL(fileName, THEME_ROOT));
  if (!response.ok) {
    throw new Error(`Unable to load ${fileName}`);
  }
  return response.json();
}

async function loadTheme() {
  const [
    config,
    itemChains,
    producers,
    orders,
    worldMap,
    events,
    tuning,
    copy
  ] = await Promise.all([
    readThemeJson('theme.config.json'),
    readThemeJson('item-chains.json'),
    readThemeJson('producers.json'),
    readThemeJson('orders.json'),
    readThemeJson('world-map.json'),
    readThemeJson('events.json'),
    readThemeJson('tuning.json'),
    readThemeJson('copy.json')
  ]);

  return { config, itemChains, producers, orders, worldMap, events, tuning, copy };
}

function loadSave() {
  const stored = localStorage.getItem(SAVE_KEY);
  if (!stored) {
    return createInitialSave(theme);
  }

  try {
    return JSON.parse(stored);
  } catch {
    return createInitialSave(theme);
  }
}

function persist() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(serializeSave(save)));
}

function addLog(message) {
  log.unshift(message);
  log.splice(5);
}

function itemName(itemId) {
  for (const chain of theme.itemChains) {
    const level = chain.levels.find((candidate) => candidate.id === itemId);
    if (level) {
      return level.name;
    }
  }
  return itemId;
}

function countBoardItem(itemId) {
  return save.board.cells.filter((cell) => cell.item?.itemId === itemId).length;
}

function renderStatus() {
  elements.appName.textContent = theme.config.displayName;
  elements.energy.textContent = save.energy;
  elements.coins.textContent = save.coins ?? 0;
  elements.xp.textContent = save.xp ?? 0;
  elements.premium.textContent = save.premium ?? 0;
  elements.district.textContent = getCurrentDistrict(save, theme).title;

  const producer = theme.producers[0];
  const state = save.producerStates[producer.id];
  elements.producerStatus.textContent = `${state.tapsRemaining} taps left`;

  const occupied = save.board.cells.filter((cell) => cell.item).length;
  const total = save.board.cells.length;
  elements.boardPressure.textContent = `${occupied} / ${total}`;
  elements.pressureFill.style.width = `${Math.round((occupied / total) * 100)}%`;

  const progress = getChapterProgress(save, theme);
  elements.chapterProgress.textContent = `${progress.completed} / ${progress.target}`;
  elements.chapterFill.style.width = `${Math.round((progress.completed / progress.target) * 100)}%`;
  elements.chapterDetail.textContent = progress.nextDistrictTitle
    ? `Next unlock: ${progress.nextDistrictTitle}`
    : `${progress.currentDistrictTitle} unlocked.`;

  const eventRail = getEventRail(save, theme);
  elements.eventPanel.dataset.status = eventRail.status;
  elements.eventStatus.textContent = eventRail.status;
  elements.eventTitle.textContent = eventRail.title;
  elements.eventDetail.textContent = eventRail.detail;

  const goal = getSessionGoal(save, theme);
  elements.goalAction.textContent = goal.action;
  elements.sessionGoal.textContent = goal.label;
  elements.goalDetail.textContent = goal.detail;
}

function renderBoard() {
  elements.board.innerHTML = '';

  for (const cell of save.board.cells) {
    const button = document.createElement('button');
    const described = describeBoardCell(cell, theme);
    button.type = 'button';
    button.className = cell.item ? 'cell has-item' : 'cell';
    button.dataset.x = cell.x;
    button.dataset.y = cell.y;
    button.dataset.chain = described.chainId ?? '';
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', cell.item ? described.label : 'Empty cell');
    if (cell.item) {
      const icon = document.createElement('span');
      const label = document.createElement('span');
      icon.className = 'item-icon';
      label.className = 'item-label';
      icon.textContent = described.icon;
      label.textContent = described.label;
      button.append(icon, label);
    }

    if (selectedCell && selectedCell.x === cell.x && selectedCell.y === cell.y) {
      button.classList.add('selected');
    }

    button.addEventListener('click', () => handleCellClick(cell));
    elements.board.append(button);
  }
}

function renderOrders() {
  const openOrders = getOpenOrders(save, theme);
  elements.orders.innerHTML = '';

  if (openOrders.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'All prototype orders complete.';
    elements.orders.append(empty);
    return;
  }

  for (const order of openOrders) {
    const article = document.createElement('article');
    article.className = 'order';

    const header = document.createElement('header');
    const title = document.createElement('h2');
    const button = document.createElement('button');
    const canDeliver = order.requires.every((requirement) => {
      return countBoardItem(requirement.itemId) >= requirement.count;
    });
    title.textContent = order.title;
    button.type = 'button';
    button.textContent = 'Deliver';
    button.disabled = !canDeliver;
    button.addEventListener('click', () => {
      applyResult(completeOrderFromBoard(save, theme, order.id));
    });
    header.append(title, button);

    const requirements = document.createElement('div');
    requirements.className = 'order-requirements';
    for (const requirement of order.requires) {
      const pill = document.createElement('span');
      const current = countBoardItem(requirement.itemId);
      pill.textContent = `${itemName(requirement.itemId)} ${current} / ${requirement.count}`;
      if (current >= requirement.count) {
        pill.classList.add('ready');
      }
      requirements.append(pill);
    }

    article.append(header, requirements);
    elements.orders.append(article);
  }
}

function renderLog() {
  elements.log.innerHTML = '';
  for (const message of log) {
    const item = document.createElement('li');
    item.textContent = message;
    elements.log.append(item);
  }
}

function render() {
  renderStatus();
  renderBoard();
  renderOrders();
  renderLog();
}

function playFeedback(kind) {
  const target = kind === 'produce' ? elements.producerButton : elements.sessionGoal;
  target.classList.remove('feedback-pop');
  target.getBoundingClientRect();
  target.classList.add('feedback-pop');
}

function applyResult(result) {
  if (result.save) {
    save = result.save;
  }

  selectedCell = null;
  addLog(result.message ?? (result.ok ? 'Action complete.' : 'Action blocked.'));
  persist();
  render();
  playFeedback(result.ok ? 'progress' : 'blocked');
}

function handleCellClick(cell) {
  if (!selectedCell) {
    if (cell.item) {
      selectedCell = { x: cell.x, y: cell.y };
      renderBoard();
    }
    return;
  }

  const target = { x: cell.x, y: cell.y };
  if (selectedCell.x === target.x && selectedCell.y === target.y) {
    selectedCell = null;
    renderBoard();
    return;
  }

  const result = cell.item
    ? mergeBoardCells(save, theme, { from: selectedCell, to: target })
    : moveItem(save, selectedCell, target);

  applyResult(result.ok && !result.message ? { ...result, message: 'Item moved.' } : result);
}

function bindActions() {
  elements.producerButton.addEventListener('click', () => {
    applyResult(tapPrimaryProducer(save, theme));
    playFeedback('produce');
  });

  elements.dailyButton.addEventListener('click', () => {
    applyResult(claimDailyLogin(save, {
      calendarDay: new Date().toISOString().slice(0, 10)
    }));
  });

  elements.resetButton.addEventListener('click', () => {
    save = createInitialSave(theme);
    selectedCell = null;
    localStorage.removeItem(SAVE_KEY);
    addLog('Prototype save reset.');
    render();
  });
}

async function boot() {
  theme = await loadTheme();
  save = loadSave();
  bindActions();
  addLog('Merge Syndicate prototype ready.');
  render();
}

boot().catch((error) => {
  document.body.textContent = error.message;
});
