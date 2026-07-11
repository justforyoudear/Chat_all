<template>
   <v-dialog
    :model-value="open"
    @update:model-value="closeDialog"
    width="90%"
    max-width="1200px"
    > <v-card
      > <v-card-title class="d-flex align-center"
        > <v-icon color="primary" class="mr-2">mdi-image-multiple</v-icon> {{
          $t("imageGen.title")
        }} <v-spacer></v-spacer> <v-btn
          flat
          size="small"
          icon
          @click="closeDialog(false)"
          > <v-icon>mdi-close</v-icon> </v-btn
        > </v-card-title
      > <v-card-text
        > <!-- Input section --> <v-row class="mb-4"
          > <v-col cols="12"
            > <v-text-field
              v-model="prompt"
              :label="$t('imageGen.promptLabel')"
              :placeholder="$t('imageGen.promptPlaceholder')"
              variant="outlined"
              hide-details
              density="comfortable"
              @keydown.enter="generate"
            ></v-text-field
            > </v-col
          > <v-col cols="3"
            > <v-select
              v-model="selectedModel"
              :items="modelOptions"
              :label="$t('imageGen.model')"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select
            > </v-col
          > <v-col cols="3"
            > <v-select
              v-model="selectedSize"
              :items="sizeOptions"
              :label="$t('imageGen.size')"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select
            > </v-col
          > <v-col cols="3" v-if="selectedModel === 'dall-e-3'"
            > <v-select
              v-model="selectedQuality"
              :items="qualityOptions"
              :label="$t('imageGen.quality')"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select
            > </v-col
          > <v-col cols="3" class="d-flex align-center"
            > <v-btn
              color="primary"
              @click="generate"
              :disabled="!prompt.trim() || isGenerating"
              :loading="isGenerating"
              block
              > <v-icon class="mr-1">mdi-image-plus</v-icon> {{
                $t("imageGen.generate")
              }} </v-btn
            > </v-col
          > </v-row
        > <!-- Error --> <v-alert
          v-if="error"
          type="error"
          density="compact"
          variant="tonal"
          class="mb-4"
          > {{ error }} </v-alert
        > <!-- Results -->
        <div v-if="results.length" class="results-grid">

          <div v-for="(img, index) in results" :key="index" class="result-item">
             <img
              :src="`data:image/png;base64,${img.b64}`"
              :alt="`Generated image ${index + 1}`"
              class="result-image"
              @click="downloadImage(img, index)"
            />
            <div class="result-actions">
               <v-btn
                size="x-small"
                variant="tonal"
                @click="downloadImage(img, index)"
                > <v-icon size="small" class="mr-1">mdi-download</v-icon> {{
                  $t("imageGen.download")
                }} </v-btn
              >
              <div v-if="img.revisedPrompt" class="revised-prompt">
                 {{ img.revisedPrompt }}
              </div>

            </div>

          </div>

        </div>
         <!-- Empty state -->
        <div v-if="!results.length && !isGenerating" class="empty-state">
           <v-icon size="64" color="grey-lighten-1">mdi-image-off</v-icon>
          <div class="text-grey mt-2">{{ $t("imageGen.empty") }}</div>

        </div>
         </v-card-text
      > </v-card
    > </v-dialog
  >
</template>

<script setup>
import { ref, computed } from "vue";
import { useImageGeneration } from "@/composables/useImageGeneration";
import i18n from "@/i18n";

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:open"]);

const { generateImage, MODELS, SIZES } = useImageGeneration();

const prompt = ref("");
const selectedModel = ref("dall-e-3");
const selectedSize = ref("1024x1024");
const selectedQuality = ref("standard");
const isGenerating = ref(false);
const error = ref("");
const results = ref([]);

const modelOptions = computed(() =>
  MODELS.map((m) => ({ title: m, value: m })),
);
const sizeOptions = computed(() => SIZES.map((s) => ({ title: s, value: s })));
const qualityOptions = computed(() => [
  { title: i18n.global.t("imageGen.qualityStandard"), value: "standard" },
  { title: i18n.global.t("imageGen.qualityHD"), value: "hd" },
]);

async function generate() {
  if (!prompt.value.trim() || isGenerating.value) return;
  isGenerating.value = true;
  error.value = "";
  results.value = [];

  try {
    const images = await generateImage(prompt.value, {
      model: selectedModel.value,
      size: selectedSize.value,
      quality: selectedQuality.value,
      n: 1,
    });
    results.value = images;
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    isGenerating.value = false;
  }
}

function downloadImage(img, index) {
  if (img.b64) {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${img.b64}`;
    link.download = `generated-${index + 1}.png`;
    link.click();
  }
}

function closeDialog(value) {
  emit("update:open", value);
}
</script>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-image {
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.result-image:hover {
  transform: scale(1.02);
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.revised-prompt {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-style: italic;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px;
}
</style>

