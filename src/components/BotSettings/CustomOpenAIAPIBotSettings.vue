<template>
   <v-list-item
    > <v-list-item-title>{{ $t("customApi.baseUrl") }}</v-list-item-title
    > <v-list-item-subtitle>{{
      $t("customApi.baseUrlPrompt")
    }}</v-list-item-subtitle
    > <v-text-field
      v-model="form.baseUrl"
      placeholder="https://api.example.com/v1"
      hide-details
    /> <v-list-item-title class="mt-6">{{
      $t("common.apiKey")
    }}</v-list-item-title
    > <v-list-item-subtitle>{{
      $t("settings.secretPrompt")
    }}</v-list-item-subtitle
    > <v-text-field v-model="form.apiKey" placeholder="sk-..." hide-details />
    <v-list-item-title class="mt-6">{{
      $t("customApi.modelName")
    }}</v-list-item-title
    > <v-list-item-subtitle>{{
      $t("customApi.modelNamePrompt")
    }}</v-list-item-subtitle
    > <v-text-field
      v-model="form.modelName"
      placeholder="qwen-plus, llama3, etc."
      hide-details
    /> <v-list-item-title class="mt-6">{{
      $t("customApi.temperature")
    }}</v-list-item-title
    > <v-slider
      v-model="form.temperature"
      :min="0"
      :max="2"
      :step="0.1"
      thumb-label
      > <template #append
        > <v-text-field
          v-model.number="form.temperature"
          type="number"
          min="0"
          max="2"
          step="0.1"
          density="compact"
          hide-details
          variant="outlined"
          style="width: 100px"
        /> </template
      > </v-slider
    > <v-list-item-title>{{ $t("bot.pastRounds") }}</v-list-item-title
    > <v-slider
      v-model="form.pastRounds"
      :min="0"
      :max="10"
      :step="1"
      thumb-label
      > <template #append
        > <v-text-field
          v-model.number="form.pastRounds"
          type="number"
          min="0"
          max="10"
          step="1"
          density="compact"
          hide-details
          variant="outlined"
          style="width: 100px"
        /> </template
      > </v-slider
    >
    <div class="d-flex justify-end mt-6">
       <v-btn
        color="primary"
        prepend-icon="mdi-content-save"
        :disabled="!canSave"
        @click="save"
        > {{ $t("customApi.save") }} </v-btn
      >
    </div>
     </v-list-item
  >
</template>

<script setup>
import { computed, reactive, watch } from "vue";
import { useStore } from "vuex";
import { getCustomApiConfigs } from "@/bots/custom/customApiConfigs";

const props = defineProps({
  configId: {
    type: String,
    default: null,
  },
});
const emit = defineEmits(["saved"]);
const store = useStore();
const form = reactive({
  baseUrl: "",
  apiKey: "",
  modelName: "",
  temperature: 1,
  pastRounds: 5,
});

const canSave = computed(() =>
  Boolean(form.baseUrl.trim() && form.apiKey.trim() && form.modelName.trim()),
);

watch(
  () => [props.configId, store.state.customApi.configs],
  () => {
    const config = props.configId
      ? getCustomApiConfigs(store.state.customApi).find(
          (item) => item.id === props.configId,
        )
      : null;
    Object.assign(form, {
      baseUrl: config?.baseUrl || "",
      apiKey: config?.apiKey || "",
      modelName: config?.modelName || "",
      temperature: config?.temperature ?? 1,
      pastRounds: config?.pastRounds ?? 5,
    });
  },
  { immediate: true },
);

function save() {
  if (!canSave.value) return;
  const id = props.configId || crypto.randomUUID();
  store.commit("saveCustomApiConfig", {
    id,
    baseUrl: form.baseUrl.trim(),
    apiKey: form.apiKey.trim(),
    modelName: form.modelName.trim(),
    temperature: Number(form.temperature),
    pastRounds: Number(form.pastRounds),
  });
  emit("saved", id);
}
</script>

