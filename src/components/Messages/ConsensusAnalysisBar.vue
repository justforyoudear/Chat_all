<template>

  <div class="consensus-analysis-bar">
     <v-btn
      :aria-label="$t('consensus.analyzeButton')"
      :disabled="!promptIndex"
      :loading="isAnalyzing"
      color="primary"
      icon="mdi-source-branch"
      size="small"
      variant="text"
      v-tooltip="$t('consensus.analyzeButton')"
      @click="openAnalysis"
    ></v-btn
    > <v-dialog v-model="dialogOpen" max-width="900"
      > <v-card
        > <v-card-title class="analysis-title"
          > <v-icon color="primary" size="20" class="mr-2"
            > mdi-compare-horizontal </v-icon
          > {{ $t("consensus.reportTitle") }} <v-spacer></v-spacer> <v-btn
            :aria-label="$t('updates.close')"
            icon="mdi-close"
            size="small"
            variant="text"
            @click="dialogOpen = false"
          ></v-btn
          > </v-card-title
        > <v-card-text class="analysis-content"
          >
          <div v-if="isAnalyzing" class="dialog-status">
             <v-progress-circular indeterminate size="24" width="2" /> <span>{{
              $t("consensus.analyzing")
            }}</span
            >
          </div>

          <div v-else-if="error" class="dialog-error">
             <v-alert type="error" density="compact" variant="tonal"
              > {{ error }} </v-alert
            > <v-btn
              color="primary"
              prepend-icon="mdi-refresh"
              variant="tonal"
              @click="startAnalysis"
              > {{ $t("consensus.retry") }} </v-btn
            >
          </div>
           <ConsensusReport v-else-if="result" :result="result" /> </v-card-text
        > </v-card
      > </v-dialog
    >
  </div>

</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import ConsensusReport from "./ConsensusReport.vue";
import { useConsensusAnalysis } from "@/composables/useConsensusAnalysis";
import Messages from "@/store/messages";

const props = defineProps({
  promptIndex: {
    type: String,
    default: null,
  },
});

const store = useStore();
const { analyzeResponses } = useConsensusAnalysis();
const error = ref("");
const dialogOpen = ref(false);

const result = computed(() =>
  props.promptIndex ? store.state.analysisResults[props.promptIndex] : null,
);
const isAnalyzing = computed(
  () =>
    Boolean(props.promptIndex) &&
    store.state.analyzingPromptIndex === props.promptIndex,
);

watch(
  () => props.promptIndex,
  () => {
    dialogOpen.value = false;
    error.value = "";
  },
);

async function openAnalysis() {
  dialogOpen.value = true;
  if (!result.value && !isAnalyzing.value) {
    await startAnalysis();
  }
}

async function startAnalysis() {
  if (!props.promptIndex) return;
  error.value = "";
  dialogOpen.value = true;
  store.commit("setAnalyzingPromptIndex", props.promptIndex);

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
      throw new Error(
        "Need at least 2 responses to analyze consensus and differences.",
      );
    }

    const analysisResult = await analyzeResponses(
      promptMessage.content,
      responses,
    );
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
</script>

<style scoped>
.consensus-analysis-bar {
  display: flex;
  align-items: center;
}

.analysis-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  background-color: rgba(var(--v-theme-primary), 0.06);
}

.analysis-content {
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

