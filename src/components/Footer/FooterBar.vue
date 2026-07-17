<template>
   <v-bottom-navigation class="footer"
    >
    <div
      style="
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        flex-wrap: wrap;
      "
    >

      <div v-if="attachedFiles.length" class="attached-files-bar">
         <v-chip
          v-for="(file, index) in attachedFiles"
          :key="index"
          closable
          size="small"
          color="primary"
          variant="tonal"
          @click:close="removeAttachedFile(index)"
          > <v-icon size="x-small" class="mr-1"
            >mdi-file-document-outline</v-icon
          > {{ file.name }} <span class="file-size"
            >({{ formatFileSize(file.size) }})</span
          > </v-chip
        > <v-btn
          size="x-small"
          variant="text"
          color="error"
          @click="clearAttachedFiles"
          class="ml-1"
          > {{ $t("attach.clearAll") }} </v-btn
        >
      </div>
       <v-alert
        v-if="enhanceError"
        type="warning"
        density="compact"
        variant="tonal"
        closable
        class="enhance-error"
        @click:close="enhanceError = ''"
        > {{ enhanceError }} </v-alert
      > <v-textarea
        id="prompt-textarea"
        v-model="prompt"
        ref="promptTextArea"
        auto-grow
        max-rows="8.5"
        rows="1"
        density="comfortable"
        hide-details
        variant="solo"
        :placeholder="$t('footer.promptPlaceholder')"
        autofocus
        @keydown="filterEnterKey"
        style="min-width: 390px"
        > <template v-slot:append-inner
          > <v-btn
            id="prompt-btn"
            @click="isPromptManagementOpen = !isPromptManagementOpen"
            color="primary"
            variant="plain"
            class="h-100 w-100"
            style="border-radius: 4px; min-width: unset !important"
            icon="mdi-creation-outline"
          ></v-btn
          > <v-btn
            @click="enhanceCurrentPrompt"
            color="info"
            variant="plain"
            class="h-100 w-100"
            style="border-radius: 4px; min-width: unset !important"
            :icon="isEnhancing ? 'mdi-loading mdi-spin' : 'mdi-auto-fix'"
            :disabled="prompt.trim() === '' || isEnhancing"
            v-tooltip="$t('enhance.tooltip')"
          ></v-btn
          > <v-btn
            @click="openFileAttach"
            color="secondary"
            variant="plain"
            class="h-100 w-100"
            style="border-radius: 4px; min-width: unset !important"
            icon="mdi-paperclip"
            v-tooltip="$t('attach.tooltip')"
          ></v-btn
          > </template
        > </v-textarea
      > <v-btn
        class="send-prompt-btn"
        elevation="2"
        :disabled="
          prompt.trim() === '' || selectedBots.length === 0 || isSending
        "
        @click="sendPromptToBots"
        > {{ $t("footer.sendPrompt") }} </v-btn
      > <BotsMenu
        style="padding-bottom: 0.5rem; padding-left: 4px"
        id="bots-menu-btn"
        ref="botsMenuRef"
        :favBots="favBots"
      />
    </div>
     <ConfirmModal ref="confirmModal" /> <PromptModal
      v-model:open="isPromptManagementOpen"
      @after-leave="usePrompt"
    ></PromptModal
    > </v-bottom-navigation
  >
</template>

<script setup>
import { ref, computed, onBeforeMount, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

// Components
import ConfirmModal from "@/components/ConfirmModal.vue";
import BotsMenu from "./BotsMenu.vue";
import PromptModal from "@/components/PromptModal.vue";

// Composables
import { usePromptEnhance } from "@/composables/usePromptEnhance";
import { useFileAttach } from "@/composables/useFileAttach";

import _bots from "@/bots";
import WebChatBot from "@/bots/WebChatBot";
import Messages from "@/store/messages";

const { ipcRenderer } = window.require("electron");

const store = useStore();
const { t } = useI18n();
const { enhancePrompt } = usePromptEnhance();
const { selectFiles, formatFileSize, buildContextString, canAddMore } =
  useFileAttach();
const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
  slotCount: {
    type: Number,
    required: true,
  },
});

const confirmModal = ref(null);
const promptTextArea = ref(null);
const botsMenuRef = ref(null);
const isPromptManagementOpen = ref(false);

const favBots = computed(() => {
  if (!props.chat || !props.chat.favBots) {
    return [];
  }
  const _favBots = [];
  props.chat.favBots.forEach((favBot) => {
    _favBots.push({
      ...favBot,
      instance: _bots.getBotByClassName(favBot.classname),
    });
  });
  return _favBots
    .filter((bot) => bot.instance)
    .sort((a, b) => a.order - b.order); // sort by order property
});
// Only the models displayed in the current comparison panels receive the
// bottom prompt. Favorites can also contain unassigned models.
const selectedBots = computed(() => {
  const displayedClassnames = new Set();
  const unassignedBots = favBots.value.filter((bot) => bot.slot === undefined);
  for (let slot = 0; slot < props.slotCount; slot++) {
    const bot =
      favBots.value.find((favorite) => favorite.slot === slot) ||
      unassignedBots[slot];
    if (bot) displayedClassnames.add(bot.classname);
  }
  return favBots.value.filter((bot) => displayedClassnames.has(bot.classname));
});

const prompt = ref("");
const isSending = ref(false);
const isEnhancing = ref(false);
const enhanceError = ref("");
const attachedFiles = ref([]);

watch(favBots, async (newValue, oldValue) => {
  const botsToCheck = newValue.filter((newBot) => {
    return !oldValue.some((oldBot) => oldBot.classname === newBot.classname);
  });
  for (const favBot of botsToCheck) {
    const bot = favBot.instance;
    if (!(bot instanceof WebChatBot) && !bot.isAvailable()) {
      await bot.checkAvailability();
    }
  }
  updateActiveBots();
});

async function updateActiveBots() {
  for (const favBot of favBots.value) {
    // Unselect the bot if user has not confirmed to use it
    if (favBot.selected) {
      const confirmed = await favBot.instance.confirmBeforeUsing(
        confirmModal.value,
      );
      if (!confirmed) {
        store.commit("setBotSelected", {
          botClassname: favBot.classname,
          selected: false,
        });
      }
    }
  }
}

function focusPromptTextarea() {
  promptTextArea.value.focus();
}

// Send the prompt when the user presses enter and prevent the default behavior
// But if the shift, ctrl, alt, or meta keys are pressed, do as default
function filterEnterKey(event) {
  const keyCode = event.keyCode;
  if (
    keyCode == 13 &&
    !event.shiftKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.metaKey
  ) {
    event.preventDefault();
    sendPromptToBots();
  }
}

async function sendPromptToBots() {
  if (prompt.value.trim() === "" || isSending.value) return;
  isSending.value = true;

  try {
    // Official WebViews publish their availability after registration. Rechecking
    // already-ready models here can wait for the registration retry window and
    // delays every prompt, especially when multiple providers are selected.
    await Promise.all(
      selectedBots.value
        .filter((favBot) => !favBot.instance.isAvailable())
        .map((favBot) => favBot.instance.checkAvailability()),
    );
    await updateActiveBots();

    const toBots = selectedBots.value
      .filter((favBot) => favBot.instance.isAvailable())
      .map((favBot) => favBot.instance);

    if (toBots.length === 0) return;

    const count = await Messages.getMessagesCount(store.state.currentChatIndex);
    const isFirstPrompt = count === 0;
    let finalPrompt = prompt.value;
    if (attachedFiles.value.length > 0) {
      const context = buildContextString(attachedFiles.value);
      finalPrompt = prompt.value + context;
    }
    await store.dispatch("sendPrompt", {
      prompt: finalPrompt,
      bots: toBots,
    });
    if (isFirstPrompt) {
      updateChatTitleWithFirstPrompt();
    }

    // Clear the textarea and attachments after sending the prompt
    prompt.value = "";
    attachedFiles.value = [];
  } finally {
    isSending.value = false;
  }
}

async function enhanceCurrentPrompt() {
  if (prompt.value.trim() === "" || isEnhancing.value) return;
  enhanceError.value = "";
  isEnhancing.value = true;
  try {
    const enhanced = await enhancePrompt(prompt.value);
    if (enhanced && enhanced.trim()) {
      prompt.value = enhanced;
      focusPromptTextarea();
    }
  } catch (err) {
    console.error("Prompt enhancement failed:", err);
    enhanceError.value =
      err?.message ||
      (typeof err === "string" ? err : "") ||
      t("enhance.configurationRequired");
  } finally {
    isEnhancing.value = false;
  }
}

async function openFileAttach() {
  if (!canAddMore(attachedFiles.value)) return;
  const files = await selectFiles();
  if (files && files.length) {
    attachedFiles.value.push(...files);
  }
}

function removeAttachedFile(index) {
  attachedFiles.value.splice(index, 1);
}

function clearAttachedFiles() {
  attachedFiles.value = [];
}

onBeforeMount(async () => {
  for (const favBot of favBots.value) {
    if (!(favBot.instance instanceof WebChatBot)) {
      await favBot.instance.checkAvailability();
    }
  }
  updateActiveBots();

  // Listen message trigged by main process
  ipcRenderer.on("CHECK-AVAILABILITY", async (event, url) => {
    const botsToCheck = favBots.value.filter(
      (favBot) => favBot.instance.getLoginUrl() === url,
    );
    for (const bot of botsToCheck) {
      await bot.instance.checkAvailability();
    }
    updateActiveBots();
  });
});

async function updateChatTitleWithFirstPrompt() {
  // if this is first prompt, update chat title to first 30 characters of user prompt
  const messages = await Messages.getMessages(store.state.currentChatIndex);
  store.commit("editChatTitle", {
    index: store.state.currentChatIndex,
    payload: {
      title: messages[0].content.substring(0, 30),
    },
  });
}

async function usePrompt(value) {
  await nextTick();
  focusPromptTextarea();
  document.execCommand("insertText", false, value);
}

defineExpose({
  focusPromptTextarea,
});
</script>

<style scoped>
.footer {
  background-color: rgba(var(--v-theme-background), 0.7) !important;
  height: auto !important;
  display: flex;
  align-items: center !important;
  justify-content: space-between;
  padding: 8px 16px;
  gap: 8px;
  box-sizing: border-box;
  padding-bottom: 0.5rem;
  box-shadow: none !important;
}

/* Override default style of vuetify v-textarea */
.v-textarea--auto-grow textarea {
  overflow: auto !important;
}

textarea::placeholder {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep() .v-field__field > textarea {
  overflow-y: auto;
}

.send-prompt-btn {
  height: 40px !important;
  margin: 0.4rem !important;
  text-transform: uppercase !important;
  font-size: small !important;
  color: rgb(var(--v-theme-on-primary));
  background-color: rgb(var(--v-theme-primary));
  border-radius: 4px !important;
}

:deep() .v-field.v-field--appended {
  padding-right: 0;
}

:deep() .v-field__append-inner {
  padding-top: 0;
}

.attached-files-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  padding: 0 4px 4px 4px;
  width: 100%;
}

.attached-files-bar .file-size {
  opacity: 0.6;
  font-size: 0.7rem;
  margin-left: 2px;
}

.enhance-error {
  width: 100%;
}
</style>

