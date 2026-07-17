import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import store from "./store";
import Chats from "@/store/chats";
import { migrateChatsMessagesThreads } from "@/store/migration";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n } from "vue-i18n";
import shortkey from "./directives/shortkey";
import { resolveTheme, applyTheme } from "./theme";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// VMdPreview
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import createLineNumbertPlugin from "@kangc/v-md-editor/lib/plugins/line-number/index";
import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import Prism from "prismjs";
import createKatexPlugin from "@kangc/v-md-editor/lib/plugins/katex/npm";

VMdPreview.use(vuepressTheme, {
  Prism,
})
  .use(createLineNumbertPlugin())
  .use(createCopyCodePlugin())
  .use(createKatexPlugin());

const { ipcRenderer } = window.require("electron");

window.addEventListener(
  "error",
  (event) => {
    if (/^ResizeObserver loop/.test(event.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true,
);

await store.restored; // wait for state to be restore
i18n.global.locale.value = store.state.lang;
store.commit("migrateSettingsPrompts");
store.commit("migrateSettingArrayIndexUseUUID");
await migrateChatsMessagesThreads();
await Chats.addFirstChatIfEmpty();

const defaultTheme = await resolveTheme(store.state.mode, ipcRenderer);
store.commit("setTheme", defaultTheme);
applyTheme(defaultTheme);
ipcRenderer.invoke("set-is-show-menu-bar", store.state.general.isShowMenuBar);
ipcRenderer.on("commit", (e, mutation, value) => {
  store.commit(mutation, value);
});

const vuetify = createVuetify({
  components: { ...components },
  directives,
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  theme: {
    defaultTheme,
    themes: {
      light: {
        colors: {
          primary: "#062AAA",
          surface: "#FFFFFF",
          background: "#f3f3f3",
          "surface-variant": "#fff",
          "on-surface-variant": "#212121",
          header: "#fff",
          prompt: "#95ec69",
          response: "#fff",
          font: "#212121",
          "table-tr-2n": "#F6F8FA",
          "code-font": "#476582",
          "code-background": "#F3F4F4",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#ececf1",
          surface: "#292a2d",
          background: "#1a1a20",
          "surface-variant": "#131419",
          "on-surface-variant": "#fff",
          header: "#292a2d",
          prompt: "#222329",
          response: "#131419",
          font: "#fff",
          "table-tr-2n": "#1d1e20",
          "code-font": "#cbdae6",
          "code-background": "#292a2d",
        },
      },
    },
  },
});

createApp(App)
  .use(i18n)
  .use(store)
  .use(vuetify)
  .use(VMdPreview)
  .directive("shortkey", shortkey)
  .mount("#app");
