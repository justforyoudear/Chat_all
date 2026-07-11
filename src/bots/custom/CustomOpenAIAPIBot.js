import LangChainBot from "@/bots/LangChainBot";
import store from "@/store";
import i18n from "@/i18n";
import { ChatOpenAI } from "@langchain/openai";

export default class CustomOpenAIAPIBot extends LangChainBot {
  static _brandId = "customApi";
  static _className = "CustomOpenAIAPIBot";
  static _logoFilename = "custom-api-logo.svg";
  static _model = "";

  constructor() {
    super();
  }

  async _checkAvailability() {
    let available = false;

    if (
      store.state.customApi.apiKey &&
      store.state.customApi.baseUrl &&
      store.state.customApi.modelName
    ) {
      this.setupModel();
      available = true;
    }
    return available;
  }

  _setupModel() {
    const chatModel = new ChatOpenAI({
      configuration: {
        basePath: store.state.customApi.baseUrl,
      },
      openAIApiKey: store.state.customApi.apiKey,
      modelName: store.state.customApi.modelName,
      temperature: store.state.customApi.temperature,
      streaming: true,
    });
    return chatModel;
  }

  getPastRounds() {
    return store.state.customApi.pastRounds
      ? store.state.customApi.pastRounds
      : 5;
  }

  getModelName() {
    const model = store.state.customApi.modelName;
    return model ? model.replace(/[^a-zA-Z0-9-_]/g, "") : "";
  }

  getFullname() {
    const prefix = this.isDisabled()
      ? `(${i18n.global.t("bot.disabled")}) `
      : "";
    const modelName = this.getModelName();
    const brandName = this.getBrandName();
    if (modelName) {
      return `${prefix}${modelName}@${brandName}`;
    }
    return `${prefix}${brandName}`;
  }
}
