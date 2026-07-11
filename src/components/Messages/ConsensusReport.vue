<template>
   <v-card class="consensus-report" flat border
    > <v-card-title class="report-title"
      > <v-icon color="primary" class="mr-2">mdi-compare-horizontal</v-icon> {{
        $t("consensus.reportTitle")
      }} <v-spacer></v-spacer> <v-btn
        flat
        size="x-small"
        icon
        v-if="!isAnalyzing && result"
        @click="$emit('close')"
        > <v-icon>mdi-close</v-icon> </v-btn
      > </v-card-title
    > <v-card-text v-if="isAnalyzing" class="pa-4"
      > <v-progress-circular
        indeterminate
        color="primary"
        size="24"
        class="mr-2"
      /> <span class="text-body-2">{{ $t("consensus.analyzing") }}</span
      > </v-card-text
    > <v-card-text v-else-if="error" class="pa-4"
      > <v-alert type="error" density="compact" variant="tonal"
        > {{ error }} </v-alert
      > </v-card-text
    > <v-card-text v-else-if="result" class="pa-4 report-content"
      > <!-- Consensus Section -->
      <div class="section consensus-section" v-if="result.consensus">

        <div class="section-header">
           <v-icon color="success" size="18" class="mr-1"
            >mdi-check-circle</v-icon
          > <span class="section-label">{{ $t("consensus.consensus") }}</span
          >
        </div>

        <div class="section-body">{{ result.consensus }}</div>

      </div>
       <!-- Differences Section -->
      <div
        class="section differences-section"
        v-if="result.differences && result.differences.length"
      >

        <div class="section-header">
           <v-icon color="warning" size="18" class="mr-1"
            >mdi-alert-circle</v-icon
          > <span class="section-label">{{ $t("consensus.differences") }}</span
          >
        </div>

        <div
          v-for="(diff, i) in result.differences"
          :key="i"
          class="difference-item"
        >

          <div class="difference-topic">{{ diff.topic }}</div>

          <div
            v-for="(detail, j) in diff.details"
            :key="j"
            class="difference-detail"
          >
             <span class="model-tag">{{ detail.model }}</span
            > <span class="model-position">{{ detail.position }}</span
            >
          </div>

        </div>

      </div>
       <!-- Suggestion Section -->
      <div class="section suggestion-section" v-if="result.suggestion">

        <div class="section-header">
           <v-icon color="info" size="18" class="mr-1">mdi-lightbulb-on</v-icon>
          <span class="section-label">{{ $t("consensus.suggestion") }}</span
          >
        </div>

        <div class="section-body">{{ result.suggestion }}</div>

      </div>
       <!-- Raw fallback -->
      <div v-if="result._raw" class="raw-fallback">
         <v-divider class="my-2"></v-divider>
        <div class="text-caption text-medium-emphasis">
           {{ $t("consensus.rawFallbackNote") }}
        </div>

      </div>
       </v-card-text
    > </v-card
  >
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  result: {
    type: Object,
    default: null,
  },
  isAnalyzing: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

defineEmits(["close"]);
</script>

<style scoped>
.consensus-report {
  grid-column: 1 / span var(--columns);
  margin-top: 0.5rem;
  border-radius: 8px;
}

.report-title {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  padding: 8px 16px;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.section-label {
  font-weight: 600;
}

.consensus-section .section-label {
  color: rgb(var(--v-theme-success));
}

.differences-section .section-label {
  color: rgb(var(--v-theme-warning));
}

.suggestion-section .section-label {
  color: rgb(var(--v-theme-info));
}

.section-body {
  font-size: 0.875rem;
  line-height: 1.5;
  padding-left: 26px;
}

.difference-item {
  padding-left: 26px;
  margin-top: 8px;
}

.difference-topic {
  font-weight: 600;
  font-size: 0.8125rem;
  margin-bottom: 4px;
}

.difference-detail {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 4px;
}

.model-tag {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background-color: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
}

.model-position {
  font-size: 0.8125rem;
  line-height: 1.4;
}

.raw-fallback {
  margin-top: 4px;
}
</style>

