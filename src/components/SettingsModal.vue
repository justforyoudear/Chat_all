<template>
   <v-dialog
    :model-value="props.open"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
    > <v-card class="overflow-hidden"
      >
      <div class="d-flex flex-column h-screen">
         <v-toolbar height="100px" dark color="primary"
          > <v-toolbar-title>{{ $t("settings.title") }}</v-toolbar-title
          > <v-spacer></v-spacer> <v-btn icon dark @click="closeDialog"
            > <v-icon>mdi-close</v-icon> </v-btn
          > </v-toolbar
        > <v-row style="height: calc(100% - 100px)"
          > <v-col cols="2" class="h-100 overflow-auto pr-0"
            > <v-tabs v-model="tab" direction="vertical" color="primary"
              > <v-tab value="general">{{ $t("settings.general") }}</v-tab
              > <v-tab value="proxy">{{ $t("proxy.name") }}</v-tab
              > <v-tab value="chat">{{ $t("chat.name") }}</v-tab
              > <v-tab
                v-for="setting in botSettings"
                :key="setting.key"
                :value="setting.key"
                > {{ setting.label }} </v-tab
              > </v-tabs
            > </v-col
          > <v-col class="h-100 overflow-auto"
            > <v-list lines="two" subheader
              >
              <div v-if="tab == 'general'">
                 <v-list-item
                  > <v-list-item-title>{{
                    $t("settings.language")
                  }}</v-list-item-title
                  > <v-select
                    :items="languages"
                    item-title="name"
                    item-value="code"
                    hide-details
                    :model-value="lang"
                    @update:model-value="setCurrentLanguage($event)"
                  ></v-select
                  > </v-list-item
                > <v-list-item
                  > <v-list-item-title>{{
                    $t("settings.theme")
                  }}</v-list-item-title
                  > <v-select
                    :items="modes"
                    item-title="name"
                    item-value="code"
                    hide-details
                    :model-value="currentMode"
                    @update:model-value="setCurrentMode($event)"
                  ></v-select
                  > </v-list-item
                > <CommonBotSettings
                  :settings="settings"
                  brand-id="general"
                  mutation-type="setGeneral"
                ></CommonBotSettings
                >
              </div>

              <div v-if="tab == 'proxy'">
                 <component :is="proxy"></component>
              </div>

              <div v-if="tab == 'chat'">
                 <component :is="chat" @close-dialog="closeDialog"></component>
              </div>
               <template v-for="setting in botSettings" :key="setting.key"
                > <component
                  v-if="tab == setting.key"
                  :is="setting.component"
                  :config-id="setting.configId"
                  @saved="handleCustomApiSaved"
                ></component
                > </template
              > </v-list
            > </v-col
          > </v-row
        >
      </div>
       </v-card
    > </v-dialog
  >
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";
import { Type } from "@/components/BotSettings/settings.const";

import ProxySettings from "@/components/ProxySetting.vue";
import ChatSettings from "@/components/ChatSetting.vue";
import CommonBotSettings from "@/components/BotSettings/CommonBotSettings.vue";

import { resolveTheme, applyTheme, Mode } from "../theme";
import CustomOpenAIAPIBotSettings from "./BotSettings/CustomOpenAIAPIBotSettings.vue";
import { getCustomApiConfigs } from "@/bots/custom/customApiConfigs";

const { ipcRenderer } = window.require("electron");
const { t: $t, locale } = useI18n();
const store = useStore();
const vuetifyTheme = useTheme();

const props = defineProps(["open"]);
const emit = defineEmits(["update:open", "done"]);

const tab = ref(null);

const botSettings = computed(() => [
  {
    key: "customApi-new",
    label: $t("customApi.name"),
    component: CustomOpenAIAPIBotSettings,
    configId: null,
  },
  ...getCustomApiConfigs(store.state.customApi).map((config) => ({
    key: `customApi-${config.id}`,
    label: config.modelName,
    component: CustomOpenAIAPIBotSettings,
    configId: config.id,
  })),
]);

async function handleCustomApiSaved(configId) {
  await nextTick();
  tab.value = `customApi-${configId}`;
}

const proxy = ProxySettings;
const chat = ChatSettings;
const languages = computed(() => [
  { name: $t("settings.system"), code: "auto" },
  { name: "Deutsch", code: "de" },
  { name: "English", code: "en" },
  { name: "Español", code: "es" },
  { name: "Français", code: "fr" },
  { name: "Italiano", code: "it" },
  { name: "日本語", code: "ja" },
  { name: "한국어", code: "ko" },
  { name: "Русский", code: "ru" },
  { name: "Tiếng Việt", code: "vi" },
  { name: "简体中文", code: "zh" },
  { name: "繁體中文", code: "zhtw" },
]);

const modes = computed(() => [
  { name: $t("settings.system"), code: Mode.SYSTEM },
  { name: $t("settings.light"), code: Mode.LIGHT },
  { name: $t("settings.dark"), code: Mode.DARK },
]);

const lang = computed(() => store.state.lang);
const currentMode = computed(() => store.state.mode);

const setCurrentLanguage = (lang) => {
  locale.value = lang;
  store.commit("setCurrentLanguage", lang);
};
const setCurrentMode = async (mode) => {
  const resolvedTheme = await resolveTheme(mode, ipcRenderer);
  store.commit("setMode", mode);
  store.commit("setTheme", resolvedTheme);
  applyTheme(resolvedTheme, vuetifyTheme);
};
const closeDialog = () => {
  emit("update:open", false);
  emit("done");
};

const settings = [
  {
    type: Type.Checkbox,
    name: "isShowMenuBar",
    label: $t("settings.showMenuBar"),
  },
];

watch(
  () => store.state.general.isShowMenuBar,
  () =>
    ipcRenderer.invoke(
      "set-is-show-menu-bar",
      store.state.general.isShowMenuBar,
    ),
);
</script>

<style scoped>
:deep() .v-slider-thumb__label {
  color: rgb(var(--v-theme-font));
}

/* Keep the orignal case of tab names */
.v-btn {
  text-transform: none !important;
}
</style>

