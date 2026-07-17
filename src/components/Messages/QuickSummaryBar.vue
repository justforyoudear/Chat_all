<template>

  <div class="quick-summary-bar">
     <v-btn
      :aria-label="$t('summary.button')"
      :disabled="!promptIndex"
      :loading="isSummarizing"
      color="primary"
      icon="mdi-text-box-check-outline"
      size="small"
      variant="text"
      v-tooltip="$t('summary.button')"
      @click="openSummary"
    ></v-btn
    > <v-dialog v-model="dialogOpen" max-width="900"
      > <v-card
        > <v-card-title class="summary-title"
          > <v-icon color="info" size="20" class="mr-2"
            > mdi-flash-outline </v-icon
          > {{ $t("summary.title") }} <v-spacer></v-spacer> <v-btn
            :aria-label="$t('updates.close')"
            icon="mdi-close"
            size="small"
            variant="text"
            @click="dialogOpen = false"
          ></v-btn
          > </v-card-title
        > <v-card-text class="summary-content"
          >
          <div v-if="isSummarizing" class="dialog-status">
             <v-progress-circular indeterminate size="24" width="2" /> <span>{{
              $t("summary.summarizing")
            }}</span
            >
          </div>

          <div v-else-if="error" class="dialog-error">
             <v-alert type="error" density="compact" variant="tonal"
              > {{ error }} </v-alert
            > <v-btn
              color="info"
              prepend-icon="mdi-refresh"
              variant="tonal"
              @click="startSummary"
              > {{ $t("summary.retry") }} </v-btn
            >
          </div>
           <v-md-preview v-else-if="summary" :text="summary" /> </v-card-text
        > </v-card
      > </v-dialog
    >
  </div>

</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useQuickSummary } from "@/composables/useQuickSummary";
import Messages from "@/store/messages";

const props = defineProps({
  promptIndex: {
    type: String,
    default: null,
  },
});

const store = useStore();
const { summarizeResponses } = useQuickSummary();
const error = ref("");
const dialogOpen = ref(false);

const summary = computed(() =>
  props.promptIndex ? store.state.summaryResults[props.promptIndex] : null,
);
const isSummarizing = computed(
  () =>
    Boolean(props.promptIndex) &&
    store.state.summarizingPromptIndex === props.promptIndex,
);

watch(
  () => props.promptIndex,
  () => {
    dialogOpen.value = false;
    error.value = "";
  },
);

async function openSummary() {
  dialogOpen.value = true;
  if (!summary.value && !isSummarizing.value) {
    await startSummary();
  }
}

async function startSummary() {
  if (!props.promptIndex) return;
  error.value = "";
  dialogOpen.value = true;
  store.commit("setSummarizingPromptIndex", props.promptIndex);

  try {
    const promptMessage = await Messages.table.get(props.promptIndex);
    if (!promptMessage) {
      throw new Error("Prompt not found");
    }

    const allMessages = await Messages.table
      .where("promptIndex")
      .equals(props.promptIndex)
      .toArray();
    const responses = allMessages.filter(
      (message) =>
        message.type === "response" &&
        message.done &&
        !message.hide &&
        message.content,
    );

    if (responses.length < 2) {
      throw new Error("Need at least 2 responses to summarize.");
    }

    const result = await summarizeResponses(promptMessage.content, responses);
    store.commit("setSummaryResult", {
      promptIndex: props.promptIndex,
      result,
    });
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    store.commit("setSummarizingPromptIndex", null);
  }
}
</script>

<style scoped>
.quick-summary-bar {
  display: flex;
  align-items: center;
}

.summary-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  background-color: rgba(var(--v-theme-info), 0.06);
}

.summary-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 16px 20px 20px;
}

.dialog-status,
.dialog-error {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-error {
  flex-direction: column;
  align-items: stretch;
}
</style>

