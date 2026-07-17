<template>
   <v-container v-if="loading" class="ma-0 position-fixed" style="z-index: 1"
    > <v-label class="bg-background" style="opacity: 1">{{
      $t("chat.loading")
    }}</v-label
    > </v-container
  >
  <div class="messages">
     <EmptyModelSlots
      :chat="chat"
      :columns="displayColumns"
      :slotCount="columns"
      :page="page"
      :messages="currentChatMessages"
    />
  </div>

</template>

<script setup>
import Messages from "@/store/messages";
import { liveQuery } from "dexie";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import EmptyModelSlots from "./EmptyModelSlots.vue";
import { autoScrollToBottom, scrollToBottom } from "@/helpers/scroll-helper";

const store = useStore();
const emit = defineEmits(["updateComparablePromptIndex"]);

const props = defineProps({
  columns: {
    type: Number,
    default: 3,
  },
  page: {
    type: Number,
    default: 0,
  },
  chat: {
    type: Object,
  },
});

const loading = ref(false);
const displayColumns = computed(() => Math.min(props.columns, 3));
const currentChatMessages = ref([]);
const latestComparablePromptIndex = computed(() => {
  let currentPrompt = null;
  let latestPromptIndex = null;

  for (const message of currentChatMessages.value) {
    if (!Array.isArray(message)) {
      currentPrompt =
        message?.type === "prompt"
          ? { index: message.index, completedResponses: 0 }
          : null;
      continue;
    }

    const response = message.at(-1);
    if (
      currentPrompt &&
      response?.promptIndex === currentPrompt.index &&
      response.done &&
      !response.hide &&
      response.content
    ) {
      currentPrompt.completedResponses += 1;
      if (currentPrompt.completedResponses >= 2) {
        latestPromptIndex = currentPrompt.index;
      }
    }
  }

  return latestPromptIndex;
});
watch(
  latestComparablePromptIndex,
  (promptIndex) => emit("updateComparablePromptIndex", promptIndex),
  { immediate: true },
);
let createChatMessageLiveQuery = (index) => {
  return liveQuery(async () => {
    const keys = await Messages.table
      .where("chatIndex")
      .equals(index)
      .primaryKeys();
    const messages = await Messages.table.bulkGet(keys);
    messages.sort((a, b) => a.createdTime - b.createdTime);
    const groupedMessage = [];
    let responses = Object.create(null);
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.type === "prompt") {
        if (Object.keys(responses).length !== 0) {
          groupedMessage.push.apply(groupedMessage, Object.values(responses));
        }
        groupedMessage.push(message);
        responses = Object.create(null);
        continue;
      }
      if (message.hide !== true) {
        if (!responses[message.className]) {
          // group responses with same bot for carousel
          responses[message.className] = [];
        }
        responses[message.className].push(message);
      }
    }
    if (Object.keys(responses).length !== 0) {
      groupedMessage.push.apply(groupedMessage, Object.values(responses));
    }
    currentChatMessages.value = groupedMessage;
    nextTick(() => autoScrollToBottom());
  });
};

const currentChatIndex = computed(() => store.state.currentChatIndex);
let currentMessageSub;
let scrollToBottomFirst;
watch(
  currentChatIndex,
  (newChat, oldChat) => {
    if (newChat !== oldChat) {
      loading.value = true;
      scrollToBottomFirst = true;
      if (currentMessageSub) {
        currentMessageSub.unsubscribe();
      }
      currentMessageSub = createChatMessageLiveQuery(
        store.state.currentChatIndex,
      ).subscribe(() => {
        loading.value = false;
        if (scrollToBottomFirst) {
          scrollToBottomFirst = false;
          nextTick(() => scrollToBottom({ immediately: true }));
        }
      });
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await Messages.table
    .filter((message) => message.done !== true)
    .modify({ done: true });
});
</script>

<style scoped>
.messages {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  gap: 16px;
  padding: 0 0 13px;
}
</style>

