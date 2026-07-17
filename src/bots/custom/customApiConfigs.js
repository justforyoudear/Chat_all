export const CUSTOM_API_BOT_PREFIX = "CustomOpenAIAPIBot:";

export function getCustomApiConfigs(customApi = {}) {
  const configs = Array.isArray(customApi.configs)
    ? customApi.configs.filter(isCompleteCustomApiConfig)
    : [];
  if (configs.length > 0) return configs;

  return isCompleteCustomApiConfig(customApi)
    ? [{ ...customApi, id: "legacy" }]
    : [];
}

export function isCompleteCustomApiConfig(config) {
  return Boolean(config?.baseUrl && config?.apiKey && config?.modelName);
}

export function getCustomApiBotClassname(configId) {
  return `${CUSTOM_API_BOT_PREFIX}${configId}`;
}
