<template>
   <v-app
    > <ChatDrawer
      ref="chatDrawerRef"
      v-model:open="isChatDrawerOpen"
      @focus-textarea="focusPromptTextarea"
    ></ChatDrawer
    > <v-slide-y-transition
      > <v-app-bar
        :id="SHORTCUT_APP_BAR.elementId"
        @shortkey="
          isShowAppBar = !isShowAppBar;
          ipcRenderer.invoke('set-is-show-menu-bar', isShowAppBar);
        "
        v-shortkey="SHORTCUT_APP_BAR.key"
        v-show="isShowAppBar"
        :style="{
          transform: isShowAppBar ? 'translateY(0)' : 'translateY(-100%)',
        }"
        class="header-content pa-0"
        > <!-- Start Header  -->
        <div class="header-content">
           <v-app-bar-nav-icon
            :id="SHORTCUT_CHAT_DRAWER.elementId"
            variant="text"
            @click.stop="isChatDrawerOpen = !isChatDrawerOpen"
            @shortkey="isChatDrawerOpen = !isChatDrawerOpen"
            v-shortkey="SHORTCUT_CHAT_DRAWER.key"
            > </v-app-bar-nav-icon
          >
        </div>

        <div class="panel-layout-controls header-content">

          <div class="column-icons">
             <v-btn
              v-for="columnCount in 6"
              :id="`column-${columnCount}`"
              :key="columnCount"
              :icon="`mdi-numeric-${columnCount}-box-outline`"
              @click="changeColumns(columnCount)"
              @shortkey="changeColumns(columnCount)"
              v-shortkey="[`f${columnCount}`]"
              :title="columnTitle(columnCount)"
              :aria-label="columnTitle(columnCount)"
              class="column-icon"
              :class="{
                selected: columns === columnCount,
              }"
            ></v-btn
            >
          </div>

          <div v-if="panelPageCount > 1" class="panel-page-controls">
             <v-btn
              icon="mdi-chevron-left"
              size="small"
              variant="text"
              :disabled="panelPage === 0"
              title="上一页"
              @click="changePanelPage(-1)"
            ></v-btn
            > <span class="panel-page-indicator"
              >{{ panelPage + 1 }} / {{ panelPageCount }}</span
            > <v-btn
              icon="mdi-chevron-right"
              size="small"
              variant="text"
              :disabled="panelPage === panelPageCount - 1"
              title="下一页"
              @click="changePanelPage(1)"
            ></v-btn
            >
          </div>

        </div>

        <div class="header-content" style="padding-right: 16px">
           <v-icon
            :id="SHORTCUT_FIND.elementId"
            class="cursor-pointer"
            color="primary"
            icon="mdi-magnify"
            size="x-large"
            @click="openFind()"
          ></v-icon
          > <v-icon
            class="cursor-pointer"
            color="primary"
            icon="mdi-image-multiple"
            size="x-large"
            @click="isImageGenOpen = true"
            v-tooltip="$t('imageGen.tooltip')"
          ></v-icon
          > <QuickSummaryBar :prompt-index="latestComparablePromptIndex" />
          <ConsensusAnalysisBar :prompt-index="latestComparablePromptIndex" />
          <v-icon
            v-shortkey="SHORTCUT_SETTINGS.key"
            @shortkey="openSettingsModal"
            :id="SHORTCUT_SETTINGS.elementId"
            class="cursor-pointer"
            color="primary"
            icon="mdi-cog"
            size="x-large"
            @click="openSettingsModal()"
          ></v-icon
          > <v-icon
            v-shortkey="SHORTCUT_SHORTCUT_GUIDE.key"
            @shortkey="toggleShortcutGuide"
            :id="SHORTCUT_SHORTCUT_GUIDE.elementId"
            class="cursor-pointer"
            color="primary"
            icon="mdi-help"
            size="x-large"
            @click="toggleShortcutGuide()"
          ></v-icon
          >
        </div>
         <!-- End Header  --> </v-app-bar
      > </v-slide-y-transition
    > <v-main class="content" :class="{ paddingTopZero: !isShowAppBar }"
      > <FindModal ref="findRef"></FindModal> <ChatMessages
        :chat="currentChat"
        :columns="columns"
        :page="panelPage"
        @update-comparable-prompt-index="latestComparablePromptIndex = $event"
      ></ChatMessages
      > <FooterBar
        ref="footerBarRef"
        :chat="currentChat"
        :slot-count="columns"
      ></FooterBar
      > </v-main
    > <SettingsModal v-model:open="isSettingsOpen" /> <ShortcutGuide
      ref="shortcutGuideRef"
      v-model:open="isShortcutGuideOpen"
    ></ShortcutGuide
    > <ImageGenerationDialog v-model:open="isImageGenOpen" />
    <OfficialLoginDialog /> </v-app
  >
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";

import { useTheme } from "vuetify";
import { useStore } from "vuex";
import { applyTheme, resolveTheme } from "./theme";
import {
  SHORTCUT_FIND,
  SHORTCUT_SETTINGS,
  SHORTCUT_SHORTCUT_GUIDE,
  SHORTCUT_CHAT_DRAWER,
  SHORTCUT_APP_BAR,
} from "./components/ShortcutGuide/shortcut.const";

import i18n from "./i18n";
import Chats from "@/store/chats";
import { initializeQueues, startQueuesProcessing } from "@/store/queue";
import { useObservable } from "@vueuse/rxjs";
import { liveQuery } from "dexie";
import { onScroll } from "./helpers/scroll-helper";

// Components
import ChatDrawer from "@/components/ChatDrawer/ChatDrawer.vue";
import ChatMessages from "@/components/Messages/ChatMessages.vue";
import QuickSummaryBar from "@/components/Messages/QuickSummaryBar.vue";
import ConsensusAnalysisBar from "@/components/Messages/ConsensusAnalysisBar.vue";
import SettingsModal from "@/components/SettingsModal.vue";
import FooterBar from "@/components/Footer/FooterBar.vue";
import FindModal from "@/components/FindModal.vue";
import ShortcutGuide from "@/components/ShortcutGuide/ShortcutGuide.vue";
import ImageGenerationDialog from "@/components/ImageGenerationDialog.vue";
import OfficialLoginDialog from "@/components/OfficialLoginDialog.vue";

// Styles
import "@mdi/font/css/materialdesignicons.css";

const { ipcRenderer } = window.require("electron");

const store = useStore();
const vuetifyTheme = useTheme();
const onUpdatedSystemTheme = async () => {
  const resolvedTheme = await resolveTheme(store.state.mode, ipcRenderer);
  store.commit("setTheme", resolvedTheme);
  applyTheme(resolvedTheme, vuetifyTheme);
};

const currentChat = useObservable(
  liveQuery(() => {
    const chat = Chats.table.orderBy("selectedTime").last();
    console.log("chat changed");
    return chat;
  }),
  { initialValue: {} },
);

ipcRenderer.on("on-updated-system-theme", onUpdatedSystemTheme);

const findRef = ref(null);
const footerBarRef = ref(null);
const shortcutGuideRef = ref(null);
const isShortcutGuideOpen = ref(false);
const isSettingsOpen = ref(false);
const isChatDrawerOpen = ref(store.state.isChatDrawerOpen);
const isShowAppBar = ref(store.state.general.isShowAppBar);
const chatDrawerRef = ref();
const isImageGenOpen = ref(false);
const latestComparablePromptIndex = ref(null);

const columns = computed(() => store.state.columns);
const panelPage = ref(0);
const panelPageCount = computed(() => Math.ceil(columns.value / 3));

function changeColumns(columnCount) {
  store.commit("changeColumns", columnCount);
  panelPage.value = 0;
}

function changePanelPage(delta) {
  panelPage.value = Math.min(
    Math.max(panelPage.value + delta, 0),
    panelPageCount.value - 1,
  );
}

watch(panelPageCount, (count) => {
  if (panelPage.value >= count) panelPage.value = 0;
});

async function openSettingsModal() {
  if (isSettingsOpen.value) {
    // click too fast
    isSettingsOpen.value = false;
    await nextTick();
  }
  isSettingsOpen.value = true;
}

function openFind() {
  findRef.value.showFindTextField();
}

function toggleShortcutGuide() {
  if (!isChatDrawerOpen.value || !isShowAppBar.value) {
    // open chat drawer to show new chat shortcut
    isChatDrawerOpen.value = true;
    isShowAppBar.value = true;
    setTimeout(() => {
      shortcutGuideRef.value.toggleShortcutGuide();
    }, 200);
  } else {
    shortcutGuideRef.value.toggleShortcutGuide();
  }
}

function focusPromptTextarea() {
  footerBarRef.value.focusPromptTextarea();
}

onMounted(() => {
  document.title = "AI Chat Hub";

  initializeQueues(store);
  startQueuesProcessing();

  window.addEventListener("scroll", onScroll);
});

watch(
  () => isShowAppBar.value,
  () =>
    store.commit("setGeneral", {
      isShowAppBar: isShowAppBar.value,
      isShowMenuBar: isShowAppBar.value,
    }),
);

function columnTitle(columnCount) {
  const titles = [
    "header.singleColumn",
    "header.doubleColumn",
    "header.tripleColumn",
    "header.quadColumn",
    "header.pentaColumn",
    "header.hexaColumn",
  ];
  return i18n.global.t(titles[columnCount - 1]);
}
</script>

<style>
@import "katex/dist/katex.min.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  width: 100%;
  background-color: rgb(var(--v-theme-header));
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 16px;
  z-index: 999;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-icons .column-icon {
  opacity: 0.5;
  cursor: pointer;
  min-width: 22px !important;
  width: 22px;
  height: 22px;
  margin: 0;
  padding: 2px;
  border-radius: 4px;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease;
}

.column-icons {
  display: grid;
  grid-template-columns: repeat(3, 22px);
  grid-template-rows: repeat(2, 22px);
  gap: 3px;
  padding: 4px 10px;
}

.panel-layout-controls,
.panel-page-controls {
  display: flex;
  align-items: center;
}

.panel-page-controls {
  gap: 2px;
}

.panel-page-indicator {
  min-width: 34px;
  text-align: center;
  white-space: nowrap;
  font-size: 0.75rem;
}

.column-icons .column-icon:hover {
  opacity: 0.85;
  background-color: rgba(var(--v-theme-primary), 0.12);
}

.column-icons .column-icon.selected {
  opacity: 1;
  background-color: rgba(var(--v-theme-primary), 0.18);
}

.content {
  background-color: rgb(var(--v-theme-background));
  height: 100vh;
  min-height: 0;
  overflow: hidden;
}

.cursor-pointer {
  cursor: pointer;
}

.v-toolbar__content {
  justify-content: space-between;
}

.vuepress-markdown-body {
  color: var(--v-theme-font) !important;
}
.vuepress-markdown-body:not(.custom) {
  padding: 0 !important;
  background-color: transparent !important;
}
.vuepress-markdown-body .arrow {
  display: inline !important;
}
.vuepress-markdown-body .arrow.up,
.arrow.down,
.arrow.left,
.arrow.right {
  display: inline-block !important;
}
.vuepress-markdown-body tr:nth-child(2n) {
  background-color: rgb(var(--v-theme-table-tr-2n)) !important;
}
.vuepress-markdown-body code {
  color: rgb(var(--v-theme-code-font)) !important;
  background-color: rgb(var(--v-theme-code-background)) !important;
}
.vuepress-markdown-body pre[class*="v-md-prism-"] code,
.vuepress-markdown-body pre code {
  color: #fff !important;
  background-color: initial !important;
}
.no-text-transform {
  text-transform: none !important;
}
.paddingTopZero {
  padding-top: 0!important;
}
</style>

