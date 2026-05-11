export function createAnalyticsEvent({
  appId,
  themeId,
  name,
  payload = {},
  timestamp = new Date().toISOString()
}) {
  return {
    appId,
    themeId,
    name,
    payload: { ...payload },
    timestamp,
    schemaVersion: 1
  };
}
