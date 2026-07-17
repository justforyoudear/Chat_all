import store from "@/store";
import CustomOpenAIAPIBot from "./custom/CustomOpenAIAPIBot";
import { getCustomApiConfigs } from "./custom/customApiConfigs";
import DeepSeekWebBot from "./deepseek/DeepSeekWebBot";
import {
  ChatGLMWebBot,
  DoubaoWebBot,
  KimiWebBot,
  QianWenWebBot,
} from "./china/DomesticWebBots";

const officialWebBots = [
  DeepSeekWebBot.getInstance(),
  QianWenWebBot.getInstance(),
  KimiWebBot.getInstance(),
  ChatGLMWebBot.getInstance(),
  DoubaoWebBot.getInstance(),
];
const customApiBots = new Map();

function getCustomApiBots() {
  const configs = getCustomApiConfigs(store.state.customApi);
  const activeIds = new Set(configs.map((config) => config.id));
  for (const id of customApiBots.keys()) {
    if (!activeIds.has(id)) customApiBots.delete(id);
  }
  return configs.map((config) => {
    if (!customApiBots.has(config.id)) {
      customApiBots.set(config.id, new CustomOpenAIAPIBot(config.id));
    }
    return customApiBots.get(config.id);
  });
}

const bots = {
  get all() {
    return [...officialWebBots, ...getCustomApiBots()];
  },
  getBotByClassName(className) {
    return this.all.find((bot) => bot.getClassname() === className);
  },
};

export const botTags = {
  officialWeb: officialWebBots,
  get openAICompatible() {
    return getCustomApiBots();
  },
  get api() {
    return getCustomApiBots();
  },
};

export default bots;
