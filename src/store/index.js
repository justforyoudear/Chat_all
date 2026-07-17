import i18n from "@/i18n";
import localForage from "localforage";
import { isProxy, isReactive, isRef, toRaw } from "vue";
import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import Chats from "@/store/chats";
import Messages from "@/store/messages";
import { v4 as uuidv4 } from "uuid";
import Threads from "./threads";
import { messageQueue } from "./queue";
import { getCustomApiConfigs } from "@/bots/custom/customApiConfigs";

const vuexPersist = new VuexPersistence({
  key: "chatall-app",
  storage: localForage,
  asyncStorage: true,
  reducer: (state) => {
    /* eslint-disable no-unused-vars */
    const {
      analysisResults,
      analyzingPromptIndex,
      summaryResults,
      summarizingPromptIndex,
      officialLogin,
      ...persistedState
    } = state;
    /* eslint-enable no-unused-vars */
    return deepToRaw(persistedState);
  },
});

export default createStore({
  state: {
    lang: "auto",
    columns: 2,
    customApi: {
      configs: [],
      baseUrl: "",
      apiKey: "",
      modelName: "",
      temperature: 1,
      pastRounds: 5,
    },
    currentChatIndex: 0,
    theme: undefined,
    mode: "system",
    isChatDrawerOpen: true,
    officialLogin: {
      open: false,
      providerId: "",
      title: "",
      url: "",
      slot: null,
    },
    prompts: [],
    analysisResults: {},
    analyzingPromptIndex: null,
    summaryResults: {},
    summarizingPromptIndex: null,
    chat: {
      updateDebounceInterval: 100,
    },
    general: {
      isShowMenuBar: true,
      isShowAppBar: true,
    },
  },
  mutations: {
    changeColumns(state, n) {
      state.columns = n;
    },
    async setBotSelected(state, { botClassname, selected }) {
      const currentChat = await Chats.getCurrentChat();
      for (let i = 0; i < currentChat.favBots.length; i++) {
        const bot = currentChat.favBots[i];
        if (bot.classname === botClassname) {
          bot.selected = selected;
          await Chats.table.update(currentChat.index, {
            favBots: currentChat.favBots,
          });
          return;
        }
      }
    },
    async setFavBotOrder(state, newOrder) {
      const currentChat = await Chats.getCurrentChat();
      newOrder.forEach((botClassname, order) => {
        const bot = currentChat.favBots.find(
          (bot) => bot.classname === botClassname,
        );
        if (bot) bot.order = order;
      });
      Chats.table.update(currentChat.index, { favBots: currentChat.favBots });
    },
    async addFavoriteBot(state, botClassname) {
      const currentChat = await Chats.getCurrentChat();
      const favBots = currentChat.favBots;
      currentChat.favBots.push({ classname: botClassname, selected: true });
      Chats.table.update(currentChat.index, {
        favBots,
      });
    },
    async setFavoriteBot(state, favBots) {
      const currentChat = await Chats.getCurrentChat();
      Chats.table.update(currentChat.index, {
        favBots,
      });
    },
    async removeFavoriteBot(state, botClassname) {
      const currentChat = await Chats.getCurrentChat();
      for (let i = 0; i < currentChat.favBots.length; i++) {
        const bot = currentChat.favBots[i];
        if (bot.classname === botClassname) {
          currentChat.favBots.splice(i, 1);

          await Chats.table.update(currentChat.index, {
            favBots: currentChat.favBots,
          });
          return;
        }
      }
    },
    setCurrentLanguage(state, language) {
      state.lang = language;
      i18n.global.locale = language;
    },
    saveCustomApiConfig(state, config) {
      const configs = [...getCustomApiConfigs(state.customApi)];
      const index = configs.findIndex((item) => item.id === config.id);
      if (index === -1) configs.push(config);
      else configs[index] = config;
      state.customApi = { ...state.customApi, configs };
    },
    setLatestPromptIndex(state, { promptIndex, chatIndex }) {
      Chats.table.update(chatIndex ?? state.currentChatIndex, {
        latestPromptIndex: promptIndex,
      });
    },
    setChatContext(state, { botClassname, context, chatIndex }) {
      Chats.table.update(chatIndex ?? state.currentChatIndex, {
        [`contexts.${botClassname}`]: context,
      });
    },
    clearMessages(state) {
      Chats.table.where("index").equals(state.currentChatIndex).modify({
        contexts: {},
      });
      Messages.table.where("chatIndex").equals(state.currentChatIndex).delete();
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
    setMode(state, mode) {
      state.mode = mode;
    },
    setGeneral(state, values) {
      state.general = { ...state.general, ...values };
    },
    createChat(state) {
      const { favBots } = state.chats[state.currentChatIndex];
      const chatIndex =
        state.chats.push({
          favBots,
          contexts: {},
          messages: [],
          threads: [],
          createdTime: new Date().getTime(),
        }) - 1;
      state.chats[chatIndex].index = chatIndex;
      state.chats[chatIndex].title = `${i18n.global.t("chat.newChat")} ${
        chatIndex + 1
      }`;
    },
    selectChat(state, index) {
      state.currentChatIndex = index;
      Chats.table.update(index, { selectedTime: new Date().getTime() });
    },
    hideChat(state) {
      state.chats[state.currentChatIndex].hide = true;
    },
    async editChatTitle(state, { index, payload }) {
      const currentChat = await Chats.table.get(index);
      if (currentChat) {
        if (
          payload.isEditedByUser ||
          (!currentChat.isTitleUserEdited && !payload.isEditedByUser)
        ) {
          Chats.update(index, {
            ...payload,
            isTitleUserEdited: payload.isEditedByUser
              ? true
              : currentChat.isTitleUserEdited,
          });
        }
      }
    },
    setIsChatDrawerOpen(state, isChatDrawerOpen) {
      state.isChatDrawerOpen = isChatDrawerOpen;
    },
    setOfficialLogin(state, values) {
      state.officialLogin = { ...state.officialLogin, ...values };
    },
    async deleteChats(state) {
      const currentChat = await Chats.getCurrentChat();
      await Chats.table.clear();
      await Messages.table.clear();
      await Threads.table.clear();
      state.currentChatIndex = await Chats.add({
        favBots: currentChat ? currentChat.favBots : [],
      });
      Chats.table.update(state.currentChatIndex, {
        selectedTime: new Date().getTime(),
      });
    },
    addPrompt(state, values) {
      state.prompts.push({ ...values, index: uuidv4() });
    },
    editPrompt(state, values) {
      const { index } = values;
      const prompt = state.prompts.find((item) => item.index === index);
      for (const key in values) {
        prompt[key] = values[key];
      }
    },
    deletePrompt(state, values) {
      const { index } = values;
      let prompt = state.prompts.find((item) => item.index === index);
      prompt.hide = true;
    },
    setAnalysisResult(state, { promptIndex, result }) {
      state.analysisResults[promptIndex] = result;
    },
    clearAnalysisResult(state, promptIndex) {
      delete state.analysisResults[promptIndex];
    },
    setAnalyzingPromptIndex(state, promptIndex) {
      state.analyzingPromptIndex = promptIndex;
    },
    setSummaryResult(state, { promptIndex, result }) {
      state.summaryResults[promptIndex] = result;
    },
    clearSummaryResult(state, promptIndex) {
      delete state.summaryResults[promptIndex];
    },
    setSummarizingPromptIndex(state, promptIndex) {
      state.summarizingPromptIndex = promptIndex;
    },
    migrateSettingsPrompts(state) {
      if (localStorage.getItem("isMigratedSettingsPrompts") === "true") {
        return;
      }
      const app = JSON.parse(localStorage.getItem("chatall-app"));
      const promptsData = JSON.parse(localStorage.getItem("chatall-prompts"));
      for (const key in app) {
        state[key] = app[key];
      }
      state.prompts = promptsData ? promptsData.prompts : [];
      localStorage.setItem("isMigratedSettingsPrompts", true);
    },
    updateSetting(state, { key, value }) {
      state[key] = value;
    },
    updateSettingArray(state, { key, value, index }) {
      for (const prop in state[key][index]) {
        state[key][index][prop] = value[prop];
      }
    },
    pushSettingArray(state, { key, value }) {
      state[key].push(value);
    },
    migrateSettingArrayIndexUseUUID(state) {
      if (
        localStorage.getItem("isMigrateSettingArrayIndexUseUUID") === "true"
      ) {
        return;
      }
      const settings = toRaw(state);
      for (const key in settings) {
        if (Array.isArray(state[key])) {
          for (const item of state[key]) {
            if (typeof item.index === "number" || !item.index) {
              item.index = uuidv4();
            }
          }
        }
      }
      localStorage.setItem("isMigrateSettingArrayIndexUseUUID", true);
    },
    setChat(state, values) {
      values = {
        ...values,
        updateDebounceInterval: parseInt(values.updateDebounceInterval),
      };
      state.chat = { ...state.chat, ...values };
    },
  },
  actions: {
    async setBotSelected(_, { botClassname, selected }) {
      const currentChat = await Chats.getCurrentChat();
      for (let i = 0; i < currentChat.favBots.length; i++) {
        const bot = currentChat.favBots[i];
        if (bot.classname === botClassname) {
          bot.selected = selected;
          await Chats.table.update(currentChat.index, {
            favBots: currentChat.favBots,
          });
          return;
        }
      }
    },
    async sendPrompt(
      { commit, dispatch },
      { prompt, bots, promptIndex, chatIndex },
    ) {
      const currentChat = chatIndex
        ? await Chats.table.get(chatIndex)
        : await Chats.getCurrentChat();
      if (!currentChat) return;
      if (promptIndex === undefined) {
        // if promptIndex not found, not resend, push to messages array
        const promptMessage = {
          type: "prompt",
          content: prompt,
          done: true,
        };
        // add message
        promptIndex = await Messages.add(currentChat.index, promptMessage);
      }
      commit("setLatestPromptIndex", {
        promptIndex,
        chatIndex: currentChat.index,
      }); // to keep track of the latest prompt index for hiding old prompt's resend button

      const msgs = [];
      for (const bot of bots) {
        const msg = {
          index: uuidv4(),
          promptIndex: promptIndex,
          chatIndex: currentChat.index,
          type: "response",
          content: "",
          format: bot.getOutputFormat(),
          model: bot.constructor._model,
          className: bot.getClassname(),
          createdTime: new Date().getTime(),
        };
        await Messages.table.add(msg);
        msgs.push(msg);
      }
      await Promise.all(
        bots.map((bot, index) => {
          const message = msgs[index];
          return bot.sendPrompt(
            prompt,
            (callbackParam, values) =>
              dispatch("updateMessage", {
                index: callbackParam.messageIndex,
                message: values,
              }),
            {
              messageIndex: message.index,
              chatIndex: currentChat.index,
            },
          );
        }),
      );
    },
    async updateMessage(_, { index, message: values }) {
      messageQueue.queue.push({ index, message: values });
    },
  },
  getters: {},
  modules: {},
  plugins: [vuexPersist.plugin],
});

// call toRaw to nested array before storing with localForage
function deepToRaw(sourceObj) {
  const objectIterator = (input) => {
    if (Array.isArray(input)) {
      const result = [];
      for (const item of input) {
        result.push(objectIterator(item));
      }
      return result;
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input));
    }
    if (input && typeof input === "object") {
      return Object.keys(input).reduce((acc, key) => {
        acc[key] = objectIterator(input[key]);
        return acc;
      }, {});
    }
    return input;
  };

  return objectIterator(sourceObj);
}
