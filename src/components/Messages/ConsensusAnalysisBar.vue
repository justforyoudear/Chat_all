<template>

  <div class="consensus-analysis-bar" :style="{ '--columns': columns }">
     <!-- Analysis button (before analysis) --> <v-btn
      v-if="!result && !isAnalyzing && !error"
      class="analyze-btn"
      color="primary"
      variant="tonal"
      size="small"
      @click="startAnalysis"
      > <v-icon size="18" class="mr-1">mdi-compare-horizontal</v-icon> {{
        $t("consensus.analyzeButton")
      }} </v-btn
    > <!-- Loading state --> <v-btn
      v-if="isAnalyzing"
      class="analyze-btn"
      color="primary"
      variant="tonal"
      size="small"
      disabled
      > <v-progress-circular indeterminate size="14" width="2" class="mr-2" />
      {{ $t("consensus.analyzing") }} </v-btn
    > <!-- Error state -->
    <div v-if="error && !isAnalyzing" class="error-bar">
       <v-alert type="error" density="compact" variant="tonal" class="mb-2"
        > {{ error }} </v-alert
      > <v-btn
        color="primary"
        variant="tonal"
        size="small"
        @click="startAnalysis"
        > <v-icon size="18" class="mr-1">mdi-refresh</v-icon> {{
          $t("consensus.retry")
        }} </v-btn
      >
    </div>
     <!-- Result report --> <ConsensusReport
      v-if="result && !isAnalyzing"
      :result="result"
      :isAnalyzing="false"
      @close="closeReport"
    />
  </div>

</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import ConsensusReport from "./ConsensusReport.vue";
import { useConsensusAnalysis } from "@/composables/useConsensusAnalysis";
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
const { analyzeResponses } = useConsensusAnalysis();
const error = ref("");

const result = computed(() => store.state.analysisResults[props.promptIndex]);
const isAnalyzing = computed(
  () => store.state.analyzingPromptIndex === props.promptIndex,
);

async function startAnalysis() {
  error.value = "";
  store.commit("setAnalyzingPromptIndex", props.promptIndex);

  try {
    // Get the prompt content
    const promptMessage = await Messages.table.get(props.promptIndex);
    if (!promptMessage) {
      throw new Error("Prompt not found");
    }
    const prompt = promptMessage.content;

    // Get all responses for this prompt
    const allMessages = await Messages.table
      .where("promptIndex")
      .equals(props.promptIndex)
      .toArray();
    const responses = allMessages.filter(
      (m) => m.type === "response" && m.done && !m.hide && m.content,
    );

    if (responses.length < 2) {
      throw new Error(
        "Need at least 2 responses to analyze consensus and differences.",
      );
    }

    const analysisResult = await analyzeResponses(prompt, responses);

    store.commit("setAnalysisResult", {
      promptIndex: props.promptIndex,
      result: analysisResult,
    });
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    store.commit("setAnalyzingPromptIndex", null);
  }
}

function closeReport() {
  store.commit("clearAnalysisResult", props.promptIndex);
}
</script>

<style scoped>
.consensus-analysis-bar {
  grid-column: 1 / span var(--columns);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.analyze-btn {
  text-transform: none !important;
  border-radius: 8px;
}

.error-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>

