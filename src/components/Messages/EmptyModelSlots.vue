<template>

  <div
    class="model-slots"
    :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
  >

    <section
      v-for="slot in slotCount"
      :key="slot"
      class="model-slot"
      :class="{ 'model-slot--webview': isOfficialWebBot(slot - 1) }"
    >

      <div class="slot-header">
         <template v-if="getSlotBot(slot - 1)"
          > <BotLogo :bot="getSlotBot(slot - 1)" active size="24" /> <span
            class="slot-model-name"
            > {{ getSlotBot(slot - 1).getFullname() }} </span
          > </template
        > <template v-else
          > <v-icon color="primary" size="22">mdi-plus-circle-outline</v-icon>
          <span class="slot-empty-title">{{ $t("modelSlots.emptyTitle") }}</span
          > </template
        > <v-spacer /> <v-menu location="bottom end"
          > <template v-slot:activator="{ props: menuProps }"
            > <v-btn
              v-bind="menuProps"
              :icon="getSlotBot(slot - 1) ? 'mdi-chevron-down' : 'mdi-plus'"
              color="primary"
              size="x-small"
              variant="text"
            ></v-btn
            > </template
          >
          <div class="model-menu">
             <v-list density="compact"
              > <template v-for="category in categories" :key="category.key"
                > <v-list-subheader>{{ $t(category.label) }}</v-list-subheader
                > <v-list-item
                  v-for="bot in category.bots"
                  :key="bot.getClassname()"
                  @click="assignBot(slot - 1, bot)"
                  > <template v-slot:prepend
                    > <BotLogo :bot="bot" active size="24" /> </template
                  > <v-list-item-title>{{
                    bot.getFullname()
                  }}</v-list-item-title
                  > </v-list-item
                > </template
              > </v-list
            >
          </div>
           </v-menu
        >
      </div>

      <div
        v-if="getSlotBot(slot - 1) && !getSlotResponse(slot - 1)"
        class="slot-empty-copy"
        :class="{
          'slot-empty-copy--hidden':
            isOfficialWebBot(slot - 1) && !officialLogin.open,
        }"
      >
         {{
          isOfficialLoginSlot(slot - 1)
            ? $t("officialLogin.loggingIn")
            : $t("modelSlots.ready")
        }}
      </div>

      <div v-if="!getSlotBot(slot - 1)" class="slot-empty-copy">
         {{ $t("modelSlots.selectModel") }}
      </div>

      <div v-if="getSlotResponse(slot - 1)" class="slot-response">
         <v-md-preview :text="getSlotResponse(slot - 1).content" />
      </div>

      <div
        v-if="isOfficialWebBot(slot - 1)"
        :data-webview-slot="slot - 1"
        class="slot-webview-host"
      ></div>

    </section>

  </div>

</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
import bots, { botTags } from "@/bots";
import BotLogo from "@/components/Footer/BotLogo.vue";
import WebChatBot from "@/bots/WebChatBot";

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  slotCount: {
    type: Number,
    required: true,
  },
  messages: {
    type: Array,
    default: () => [],
  },
});

const { ipcRenderer } = window.require("electron");
const store = useStore();
const favoriteBots = computed(() => props.chat?.favBots || []);
const officialLogin = computed(() => store.state.officialLogin);
const categories = computed(() => [
  {
    key: "officialWeb",
    label: "footer.officialWeb",
    bots: (botTags.officialWeb || []).filter(Boolean),
  },
  {
    key: "workbenchApi",
    label: "footer.openAICompatible",
    bots: (botTags.workbenchApi || []).filter(Boolean),
  },
]);

const cardWebviews = new Map();
const wasOverlayOpen = ref(false);

function removeCardWebview(slot) {
  const webview = cardWebviews.get(slot);
  if (webview) webview.remove();
  cardWebviews.delete(slot);
}

function ensureCardWebview(slot) {
  const host = document.querySelector(`[data-webview-slot="${slot}"]`);
  if (!host) return;
  const bot = getSlotBot(slot);
  if (!bot) return;
  const url = bot.constructor._chatUrl || bot.getLoginUrl();
  if (!url) return;
  const providerId = bot.constructor._providerId;
  const zoomFactor = bot.constructor._webviewZoomFactor || 1;

  const existing = cardWebviews.get(slot);
  if (existing?.isConnected && existing.dataset.providerId === providerId) {
    return;
  }

  removeCardWebview(slot);
  const wv = document.createElement("webview");
  wv.style.width = "100%";
  wv.style.height = "100%";
  wv.style.border = "0";
  wv.style.background = "white";
  wv.dataset.providerId = providerId;
  wv.setAttribute("disableblinkfeatures", "Auxclick");
  wv.addEventListener("did-attach", () => {
    console.log("[CARD] did-attach, slot:", slot);
  });
  wv.addEventListener("dom-ready", async () => {
    if (zoomFactor !== 1) await wv.setZoomFactor(zoomFactor);
    const webContentsId = wv.getWebContentsId?.();
    if (webContentsId) {
      ipcRenderer.invoke("web-chat-register", {
        providerId,
        webContentsId,
        url,
      });
      console.log("[CARD] registered webview, providerId:", providerId);
    }
  });
  wv.addEventListener("did-fail-load", (_e, code, desc) => {
    console.log("[CARD] did-fail-load:", code, desc);
  });
  host.appendChild(wv);
  cardWebviews.set(slot, wv);
  wv.setAttribute("src", url);
  console.log("[CARD] created card webview for slot", slot, "url:", url);
}

function syncCardWebviews() {
  if (officialLogin.value.open) return;
  for (let i = 0; i < props.slotCount; i++) {
    if (isOfficialWebBot(i)) {
      ensureCardWebview(i);
    } else {
      removeCardWebview(i);
    }
  }
}

function getSlotBot(slot) {
  const assigned = favoriteBots.value.find((bot) => bot.slot === slot);
  if (assigned) return bots.getBotByClassName(assigned.classname);

  const unassigned = favoriteBots.value.filter((bot) => bot.slot === undefined);
  return bots.getBotByClassName(unassigned[slot]?.classname);
}

function getSlotResponse(slot) {
  const bot = getSlotBot(slot);
  if (!bot || bot instanceof WebChatBot) return null;
  for (let i = props.messages.length - 1; i >= 0; i--) {
    const group = props.messages[i];
    if (!Array.isArray(group)) continue;
    const response = group.at(-1);
    if (response?.className === bot.getClassname()) return response;
  }
  return null;
}

function isOfficialLoginSlot(slot) {
  return officialLogin.value.open && officialLogin.value.slot === slot;
}

function isOfficialWebBot(slot) {
  const bot = getSlotBot(slot);
  return bot instanceof WebChatBot;
}

async function assignBot(slot, bot) {
  const favorites = favoriteBots.value.map((favorite) => ({ ...favorite }));
  for (const favorite of favorites) {
    if (favorite.slot === slot) favorite.slot = undefined;
  }
  const existing = favorites.find(
    (favorite) => favorite.classname === bot.getClassname(),
  );

  if (existing) {
    existing.slot = slot;
    existing.selected = true;
  } else {
    favorites.push({
      classname: bot.getClassname(),
      selected: true,
      order: favorites.length,
      slot,
    });
  }
  store.commit("setFavoriteBot", favorites);

  if (bot instanceof WebChatBot) {
    // Explicitly choosing a model again is a user-requested refresh. Normal
    // chat updates still preserve the existing WebView and its conversation.
    removeCardWebview(slot);
    await bot.openOfficialChat(slot);
  }
}

watch(
  () => officialLogin.value.open,
  async (open) => {
    if (open) {
      wasOverlayOpen.value = true;
      return;
    }
    if (!wasOverlayOpen.value) return;
    wasOverlayOpen.value = false;
    await nextTick();
    syncCardWebviews();
  },
);

watch(favoriteBots, async () => {
  await nextTick();
  syncCardWebviews();
});

onMounted(async () => {
  await nextTick();
  syncCardWebviews();
});

onBeforeUnmount(() => {
  for (const slot of cardWebviews.keys()) removeCardWebview(slot);
});
</script>

<style scoped>
.model-slots {
  display: grid;
  gap: 16px;
  width: 100%;
  padding: 2rem;
  align-content: center;
  min-height: 100%;
}

.model-slot {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 8px;
  background-color: rgb(var(--v-theme-response));
}

.model-slot--webview {
  min-height: 500px;
}

.model-menu {
  min-width: 280px;
  overflow: hidden;
  border-radius: 4px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.22);
}

.slot-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.slot-model-name,
.slot-empty-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 600;
}

.slot-empty-copy {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: rgba(var(--v-theme-on-surface), 0.45);
  font-size: 0.875rem;
}

.slot-empty-copy--hidden {
  display: none;
}

.slot-webview-host {
  flex: 1;
  min-height: 200px;
  overflow: hidden;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.slot-webview-host:empty {
  display: none;
}

.slot-response {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}
</style>

