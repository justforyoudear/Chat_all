<template>
   <v-container v-if="loading" class="ma-0 position-fixed" style="z-index: 1"
    > <v-label class="bg-background" style="opacity: 1">{{
      $t("chat.loading")
    }}</v-label
    > </v-container
  >
  <div class="messages">
     <EmptyModelSlots
      v-if="!loading && currentChatMessages.length === 0"
      :chat="chat"
      :columns="displayColumns"
      :slotCount="columns"
    />
    <div
      v-else
      class="message-grid"
      :style="{ gridTemplateColumns: gridTemplateColumns }"
    >
       <template v-for="(message, index) in currentChatMessages" :key="index"
        > <chat-prompt
          v-if="message.type === 'prompt'"
          :columns="displayColumns"
          :message="message"
        ></chat-prompt
        > <template v-else
          > <chat-response
            :chat="chat"
            :columns="displayColumns"
            :messages="message"
          ></chat-response
          > <consensus-analysis-bar
            v-if="isResponseGroupDone(message)"
            :promptIndex="getResponseGroupPromptIndex(message)"
            :columns="displayColumns"
          ></consensus-analysis-bar
          > <quick-summary-bar
            v-if="isResponseGroupDone(message)"
            :promptIndex="getResponseGroupPromptIndex(message)"
            :columns="displayColumns"
          ></quick-summary-bar
          > </template
        > </template
      >
    </div>

  </div>

</template>

<script setup>
import Messages from "@/store/messages";
import { liveQuery } from "dexie";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import ChatPrompt from "./ChatPrompt.vue";
import ChatResponse from "./ChatResponse.vue";
import ConsensusAnalysisBar from "./ConsensusAnalysisBar.vue";
import QuickSummaryBar from "./QuickSummaryBar.vue";
import EmptyModelSlots from "./EmptyModelSlots.vue";
import { autoScrollToBottom, scrollToBottom } from "@/helpers/scroll-helper";

const store = useStore();

const props = defineProps({
  columns: {
    type: Number,
    default: 3,
  },
  chat: {
    type: Object,
  },
});

const loading = ref(false);
const displayColumns = computed(() =>
  props.columns > 3 ? Math.ceil(props.columns / 2) : props.columns,
);
const gridTemplateColumns = computed(
  () => `repeat(${displayColumns.value}, 1fr)`,
);
const currentChatMessages = ref([]);

function isResponseGroupDone(responseGroup) {
  if (!Array.isArray(responseGroup)) return false;
  return responseGroup.every((group) =>
    Array.isArray(group) ? group.every((m) => m.done) : group.done,
  );
}

function getResponseGroupPromptIndex(responseGroup) {
  if (!Array.isArray(responseGroup)) return null;
  const first = responseGroup[0];
  if (Array.isArray(first)) {
    return first[0]?.promptIndex;
  }
  return first?.promptIndex;
}
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
  height: 100%;
  overflow-y: auto;
  gap: 16px;
  padding: 0;
}

.message-grid {
  display: grid;
  grid-gap: 16px;
  width: 100%;
  padding: 2rem;
}
</style>

