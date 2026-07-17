import LangChainBot from "@/bots/LangChainBot";
import store from "@/store";
import i18n from "@/i18n";
import { ChatOpenAI } from "@langchain/openai";
import {
  getCustomApiBotClassname,
  getCustomApiConfigs,
} from "./customApiConfigs";

export default class CustomOpenAIAPIBot extends LangChainBot {
  static _brandId = "customApi";
  static _className = "CustomOpenAIAPIBot";
  static _logoFilename = "custom-api-logo.svg";
  static _model = "";

  constructor(configId) {
    super();
    this.configId = configId;
  }

  getConfig() {
    return getCustomApiConfigs(store.state.customApi).find(
      (config) => config.id === this.configId,
    );
  }

  getClassname() {
    return getCustomApiBotClassname(this.configId);
  }

  async _checkAvailability() {
    let available = false;

    if (this.getConfig()) {
      this.setupModel();
      available = true;
    }
    return available;
  }

  _setupModel() {
    const config = this.getConfig();
    const chatModel = new ChatOpenAI({
      configuration: {
        baseURL: config.baseUrl,
      },
      openAIApiKey: config.apiKey,
      modelName: config.modelName,
      temperature: config.temperature,
      streaming: true,
    });
    return chatModel;
  }

  async _sendPrompt(prompt, onUpdateResponse, callbackParam) {
    this.setupModel();
    return super._sendPrompt(prompt, onUpdateResponse, callbackParam);
  }

  getPastRounds() {
    return this.getConfig()?.pastRounds || 5;
  }

  getModelName() {
    const model = this.getConfig()?.modelName;
    return model ? model.replace(/[^a-zA-Z0-9-_]/g, "") : "";
  }

  getFullname() {
    const prefix = this.isDisabled()
      ? `(${i18n.global.t("bot.disabled")}) `
      : "";
    const modelName = this.getModelName();
    return `${prefix}${modelName || this.getBrandName()}`;
  }
}
