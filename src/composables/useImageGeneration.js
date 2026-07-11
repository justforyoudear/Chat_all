import store from "@/store";
import i18n from "@/i18n";

const SIZES = ["256x256", "512x512", "1024x1024"];
const MODELS = ["dall-e-3", "dall-e-2"];

function getOpenAIConfig() {
  const openaiState = store.state.openaiApi;
  const customState = store.state.customApi;
  if (openaiState.apiKey) {
    return {
      apiKey: openaiState.apiKey,
      basePath: openaiState.alterUrl || undefined,
      source: "openai",
    };
  }
  if (customState.apiKey && customState.baseUrl) {
    return {
      apiKey: customState.apiKey,
      basePath: customState.baseUrl,
      source: "custom",
    };
  }
  return null;
}

async function generateImage(prompt, options = {}) {
  const config = getOpenAIConfig();
  if (!config) {
    throw new Error(i18n.global.t("imageGen.noApiKey"));
  }

  const model = options.model || "dall-e-3";
  const size = options.size || "1024x1024";
  const quality = options.quality || "standard";
  const n = options.n || 1;

  const body = {
    model,
    prompt,
    n,
    size,
    response_format: "b64_json",
  };
  if (model === "dall-e-3") {
    body.quality = quality;
  }

  const basePath = config.basePath || "https://api.openai.com/v1";
  const url = basePath.replace(/\/$/, "") + "/images/generations";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.error?.message || response.statusText;
    throw new Error(`${response.status}: ${msg}`);
  }

  const data = await response.json();
  return data.data.map((item) => ({
    b64: item.b64_json,
    url: item.url,
    revisedPrompt: item.revised_prompt || "",
  }));
}

export function useImageGeneration() {
  return {
    generateImage,
    getOpenAIConfig,
    SIZES,
    MODELS,
  };
}
