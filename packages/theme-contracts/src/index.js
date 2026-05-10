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
  if (!Array.isArray(itemChains)) {
    return ids;
  }

  for (const chain of itemChains) {
    if (!isObject(chain) || !Array.isArray(chain.levels)) {
      continue;
    }

    for (const level of chain.levels) {
      if (isObject(level) && typeof level.id === 'string' && level.id.trim() !== '') {
        ids.add(level.id);
      }
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

  if (Array.isArray(theme.itemChains)) {
    for (const [chainIndex, chain] of theme.itemChains.entries()) {
      if (!requireObject(chain, `itemChains.${chainIndex}`, errors)) {
        continue;
      }

      const chainPath = typeof chain.id === 'string' && chain.id.trim() !== ''
        ? `itemChains.${chain.id}`
        : `itemChains.${chainIndex}`;
      requireString(chain.id, `${chainPath}.id`, errors);
      requireString(chain.displayName, `${chainPath}.displayName`, errors);
      if (requireArray(chain.levels, `${chainPath}.levels`, errors)) {
        for (const [levelIndex, level] of chain.levels.entries()) {
          if (!requireObject(level, `${chainPath}.levels.${levelIndex}`, errors)) {
            continue;
          }

          const levelPath = typeof level.id === 'string' && level.id.trim() !== ''
            ? `${chainPath}.levels.${level.id}`
            : `${chainPath}.levels.${levelIndex}`;
          requireString(level.id, `${levelPath}.id`, errors);
          requirePositiveNumber(level.level, `${levelPath}.level`, errors);
          requireString(level.name, `${levelPath}.name`, errors);
        }
      }
    }
  }

  if (Array.isArray(theme.producers)) {
    for (const [producerIndex, producer] of theme.producers.entries()) {
      if (!requireObject(producer, `producers.${producerIndex}`, errors)) {
        continue;
      }

      const producerPath = typeof producer.id === 'string' && producer.id.trim() !== ''
        ? `producers.${producer.id}`
        : `producers.${producerIndex}`;
      requireString(producer.id, `${producerPath}.id`, errors);
      requireString(producer.name, `${producerPath}.name`, errors);
      requirePositiveNumber(producer.energyCost, `${producerPath}.energyCost`, errors);
      requirePositiveNumber(producer.tapLimit, `${producerPath}.tapLimit`, errors);
      requirePositiveNumber(producer.cooldownSeconds, `${producerPath}.cooldownSeconds`, errors);
      if (requireArray(producer.drops, `${producerPath}.drops`, errors)) {
        for (const [dropIndex, drop] of producer.drops.entries()) {
          if (!requireObject(drop, `${producerPath}.drops.${dropIndex}`, errors)) {
            continue;
          }

          const dropPath = typeof drop.itemId === 'string' && drop.itemId.trim() !== ''
            ? `${producerPath}.drops.${drop.itemId}`
            : `${producerPath}.drops.${dropIndex}`;
          requireString(drop.itemId, `${dropPath}.itemId`, errors);
          if (typeof drop.itemId === 'string' && drop.itemId.trim() !== '' && !itemIds.has(drop.itemId)) {
            errors.push(`producer ${producer.id} references missing item ${drop.itemId}`);
          }
          requirePositiveNumber(drop.weight, `${dropPath}.weight`, errors);
        }
      }
    }
  }

  if (Array.isArray(theme.orders)) {
    for (const [orderIndex, order] of theme.orders.entries()) {
      if (!requireObject(order, `orders.${orderIndex}`, errors)) {
        continue;
      }

      const orderPath = typeof order.id === 'string' && order.id.trim() !== ''
        ? `orders.${order.id}`
        : `orders.${orderIndex}`;
      requireString(order.id, `${orderPath}.id`, errors);
      requireString(order.title, `${orderPath}.title`, errors);
      if (requireArray(order.requires, `${orderPath}.requires`, errors)) {
        for (const [requirementIndex, requirement] of order.requires.entries()) {
          if (!requireObject(requirement, `${orderPath}.requires.${requirementIndex}`, errors)) {
            continue;
          }

          const requirementPath = typeof requirement.itemId === 'string' && requirement.itemId.trim() !== ''
            ? `${orderPath}.requires.${requirement.itemId}`
            : `${orderPath}.requires.${requirementIndex}`;
          requireString(requirement.itemId, `${requirementPath}.itemId`, errors);
          if (typeof requirement.itemId === 'string' && requirement.itemId.trim() !== '' && !itemIds.has(requirement.itemId)) {
            errors.push(`order ${order.id} requires missing item ${requirement.itemId}`);
          }
          requirePositiveNumber(requirement.count, `${requirementPath}.count`, errors);
        }
      }
      if (requireObject(order.rewards, `${orderPath}.rewards`, errors)) {
        for (const [key, value] of Object.entries(order.rewards)) {
          if (typeof value !== 'number' || value < 0) {
            errors.push(`${orderPath}.rewards.${key} must be a non-negative number`);
          }
        }
      }
    }
  }

  if (isObject(theme.worldMap) && theme.worldMap.nodes) {
    if (requireArray(theme.worldMap.nodes, 'worldMap.nodes', errors)) {
      for (const [nodeIndex, node] of theme.worldMap.nodes.entries()) {
        requireObject(node, `worldMap.nodes.${nodeIndex}`, errors);
      }
    }
  }

  if (isObject(theme.events) && theme.events.slots) {
    if (requireArray(theme.events.slots, 'events.slots', errors)) {
      for (const [slotIndex, slot] of theme.events.slots.entries()) {
        requireObject(slot, `events.slots.${slotIndex}`, errors);
      }
    }
  }

  for (const key of ['energyMax', 'energyRefillSeconds', 'boardSlotsSoftLimit']) {
    requirePositiveNumber(theme.tuning?.[key], `tuning.${key}`, errors);
  }

  for (const key of ['onboardingTitle', 'producerTapCta', 'firstOrderCta']) {
    requireString(theme.copy?.[key], `copy.${key}`, errors);
  }

  return { ok: errors.length === 0, errors };
}
