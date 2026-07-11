<template>

  <div class="quick-summary-bar" :style="{ '--columns': columns }">
     <!-- Summary button (before summary) --> <v-btn
      v-if="!summary && !isSummarizing && !error"
      class="summary-btn"
      color="info"
      variant="tonal"
      size="small"
      @click="startSummary"
      > <v-icon size="18" class="mr-1">mdi-flash-outline</v-icon> {{
        $t("summary.button")
      }} </v-btn
    > <!-- Loading state --> <v-btn
      v-if="isSummarizing"
      class="summary-btn"
      color="info"
      variant="tonal"
      size="small"
      disabled
      > <v-progress-circular indeterminate size="14" width="2" class="mr-2" />
      {{ $t("summary.summarizing") }} </v-btn
    > <!-- Error state -->
    <div v-if="error && !isSummarizing" class="error-bar">
       <v-alert type="error" density="compact" variant="tonal" class="mb-2"
        > {{ error }} </v-alert
      > <v-btn color="info" variant="tonal" size="small" @click="startSummary"
        > <v-icon size="18" class="mr-1">mdi-refresh</v-icon> {{
          $t("summary.retry")
        }} </v-btn
      >
    </div>
     <!-- Summary result card --> <v-card
      v-if="summary && !isSummarizing"
      class="summary-card"
      flat
      border
      > <v-card-title class="summary-title"
        > <v-icon color="info" size="18" class="mr-2">mdi-flash-outline</v-icon>
        {{ $t("summary.title") }} <v-spacer></v-spacer> <v-btn
          flat
          size="x-small"
          icon
          @click="closeSummary"
          > <v-icon>mdi-close</v-icon> </v-btn
        > </v-card-title
      > <v-card-text class="summary-content"
        > <v-md-preview :text="summary" /> </v-card-text
      > </v-card
    >
  </div>

</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useQuickSummary } from "@/composables/useQuickSummary";
import Messages from "@/store/messages";

const props = defineProps({
  promptIndex: {
    type: String,
    required: true,
  },
  columns: {
    type: Number,
    default: 3,
  },
});

const store = useStore();
const { summarizeResponses } = useQuickSummary();
const error = ref("");

const summary = computed(() => store.state.summaryResults[props.promptIndex]);
const isSummarizing = computed(
  () => store.state.summarizingPromptIndex === props.promptIndex,
);

async function startSummary() {
  error.value = "";
  store.commit("setSummarizingPromptIndex", props.promptIndex);

  try {
    const promptMessage = await Messages.table.get(props.promptIndex);
    if (!promptMessage) {
      throw new Error("Prompt not found");
    }
    const prompt = promptMessage.content;

    const allMessages = await Messages.table
      .where("promptIndex")
      .equals(props.promptIndex)
      .toArray();
    const responses = allMessages.filter(
      (m) => m.type === "response" && m.done && !m.hide && m.content,
    );

    if (responses.length < 2) {
      throw new Error("Need at least 2 responses to summarize.");
    }

    const result = await summarizeResponses(prompt, responses);
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

function closeSummary() {
  store.commit("clearSummaryResult", props.promptIndex);
}
</script>

<style scoped>
.quick-summary-bar {
  grid-column: 1 / span var(--columns);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.summary-btn {
  text-transform: none !important;
  border-radius: 8px;
}

.error-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.summary-card {
  border-radius: 8px;
}

.summary-title {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  padding: 8px 16px;
  background-color: rgba(var(--v-theme-info), 0.05);
}

.summary-content {
  padding: 8px 16px 16px;
}
</style>

