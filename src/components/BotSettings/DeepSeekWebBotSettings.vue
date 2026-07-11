<template>
   <v-list-item
    > <v-list-item-title>{{ $t("deepSeek.name") }}</v-list-item-title
    > <v-list-item-subtitle>{{
      $t("deepSeek.loginPrompt")
    }}</v-list-item-subtitle
    > <v-btn color="primary" class="mt-2" @click="openOfficialChat"
      > {{ $t("deepSeek.openOfficialChat") }} </v-btn
    > </v-list-item
  >
</template>

<script setup>
import DeepSeekWebBot from "@/bots/deepseek/DeepSeekWebBot";

const bot = DeepSeekWebBot.getInstance();

async function openOfficialChat() {
  await bot.openOfficialChat();
}
</script>

