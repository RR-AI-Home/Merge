function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireObject(value, path, errors) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return false;
  }
  return true;
}

function requireArray(value, path, errors) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${path} must be a non-empty array`);
    return false;
  }
  return true;
}

function requireString(value, path, errors) {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${path} must be a non-empty string`);
  }
}

function requirePositiveNumber(value, path, errors) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    errors.push(`${path} must be a positive number`);
  }
}

export function collectThemeItemIds(itemChains) {
  const ids = new Set();
  for (const chain of itemChains ?? []) {
    for (const level of chain.levels ?? []) {
      ids.add(level.id);
    }
  }
  return ids;
}

export function validateThemeBundle(theme) {
  const errors = [];

  if (!requireObject(theme, 'theme', errors)) {
    return { ok: false, errors };
  }

  if (requireObject(theme.config, 'config', errors)) {
    requireString(theme.config.id, 'config.id', errors);
    requireString(theme.config.displayName, 'config.displayName', errors);
    requireString(theme.config.appId, 'config.appId', errors);
    requirePositiveNumber(theme.config.version, 'config.version', errors);
    if (requireObject(theme.config.board, 'config.board', errors)) {
      requirePositiveNumber(theme.config.board.width, 'config.board.width', errors);
      requirePositiveNumber(theme.config.board.height, 'config.board.height', errors);
    }
    if (requireObject(theme.config.startingState, 'config.startingState', errors)) {
      for (const key of ['energy', 'coins', 'premium']) {
        if (typeof theme.config.startingState[key] !== 'number' || theme.config.startingState[key] < 0) {
          errors.push(`config.startingState.${key} must be a non-negative number`);
        }
      }
    }
  }

  requireArray(theme.itemChains, 'itemChains', errors);
  requireArray(theme.producers, 'producers', errors);
  requireArray(theme.orders, 'orders', errors);
  requireObject(theme.worldMap, 'worldMap', errors);
  requireObject(theme.events, 'events', errors);
  requireObject(theme.tuning, 'tuning', errors);
  requireObject(theme.copy, 'copy', errors);

  const itemIds = collectThemeItemIds(theme.itemChains);

  for (const chain of theme.itemChains ?? []) {
    requireString(chain.id, `itemChains.${chain?.id ?? '<missing>'}.id`, errors);
    requireString(chain.displayName, `itemChains.${chain?.id ?? '<missing>'}.displayName`, errors);
    if (requireArray(chain.levels, `itemChains.${chain?.id ?? '<missing>'}.levels`, errors)) {
      for (const level of chain.levels) {
        requireString(level.id, `itemChains.${chain.id}.levels.id`, errors);
        requirePositiveNumber(level.level, `itemChains.${chain.id}.levels.${level.id}.level`, errors);
        requireString(level.name, `itemChains.${chain.id}.levels.${level.id}.name`, errors);
      }
    }
  }

  for (const producer of theme.producers ?? []) {
    requireString(producer.id, 'producers.id', errors);
    requireString(producer.name, `producers.${producer?.id ?? '<missing>'}.name`, errors);
    requirePositiveNumber(producer.energyCost, `producers.${producer?.id ?? '<missing>'}.energyCost`, errors);
    requirePositiveNumber(producer.tapLimit, `producers.${producer?.id ?? '<missing>'}.tapLimit`, errors);
    requirePositiveNumber(producer.cooldownSeconds, `producers.${producer?.id ?? '<missing>'}.cooldownSeconds`, errors);
    if (requireArray(producer.drops, `producers.${producer?.id ?? '<missing>'}.drops`, errors)) {
      for (const drop of producer.drops) {
        if (!itemIds.has(drop.itemId)) {
          errors.push(`producer ${producer.id} references missing item ${drop.itemId}`);
        }
        requirePositiveNumber(drop.weight, `producers.${producer.id}.drops.${drop.itemId}.weight`, errors);
      }
    }
  }

  for (const order of theme.orders ?? []) {
    requireString(order.id, 'orders.id', errors);
    requireString(order.title, `orders.${order?.id ?? '<missing>'}.title`, errors);
    if (requireArray(order.requires, `orders.${order?.id ?? '<missing>'}.requires`, errors)) {
      for (const requirement of order.requires) {
        if (!itemIds.has(requirement.itemId)) {
          errors.push(`order ${order.id} requires missing item ${requirement.itemId}`);
        }
        requirePositiveNumber(requirement.count, `orders.${order.id}.requires.${requirement.itemId}.count`, errors);
      }
    }
    if (requireObject(order.rewards, `orders.${order?.id ?? '<missing>'}.rewards`, errors)) {
      for (const [key, value] of Object.entries(order.rewards)) {
        if (typeof value !== 'number' || value < 0) {
          errors.push(`orders.${order.id}.rewards.${key} must be a non-negative number`);
        }
      }
    }
  }

  if (theme.worldMap?.nodes) {
    requireArray(theme.worldMap.nodes, 'worldMap.nodes', errors);
  }

  if (theme.events?.slots) {
    requireArray(theme.events.slots, 'events.slots', errors);
  }

  for (const key of ['energyMax', 'energyRefillSeconds', 'boardSlotsSoftLimit']) {
    requirePositiveNumber(theme.tuning?.[key], `tuning.${key}`, errors);
  }

  for (const key of ['onboardingTitle', 'producerTapCta', 'firstOrderCta']) {
    requireString(theme.copy?.[key], `copy.${key}`, errors);
  }

  return { ok: errors.length === 0, errors };
}
