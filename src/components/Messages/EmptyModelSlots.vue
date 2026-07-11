<template>

  <div
    class="model-slots"
    :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
  >
     <v-card
      v-for="slot in slotCount"
      :key="slot"
      class="model-slot"
      flat
      border
      > <template v-if="getSlotBot(slot - 1)"
        >
        <div class="slot-model">
           <BotLogo :bot="getSlotBot(slot - 1)" active size="32" />
          <div class="slot-model-name">
             {{ getSlotBot(slot - 1).getFullname() }}
          </div>

        </div>
         <v-menu location="bottom"
          > <template v-slot:activator="{ props: menuProps }"
            > <v-btn v-bind="menuProps" size="small" variant="tonal" block
              > {{ $t("modelSlots.changeModel") }} </v-btn
            > </template
          > <v-card min-width="260"
            > <v-tabs v-model="activeCategory" density="compact"
              > <v-tab value="officialWeb">{{ $t("footer.officialWeb") }}</v-tab
              > <v-tab value="openAICompatible">{{
                $t("footer.openAICompatible")
              }}</v-tab
              > </v-tabs
            > <v-list density="compact"
              > <v-list-item
                v-for="bot in categoryBots"
                :key="bot.getClassname()"
                @click="assignBot(slot - 1, bot)"
                > <template v-slot:prepend
                  > <BotLogo :bot="bot" active size="24" /> </template
                > <v-list-item-title>{{ bot.getFullname() }}</v-list-item-title
                > </v-list-item
              > </v-list
            > </v-card
          > </v-menu
        > </template
      > <template v-else
        > <v-icon size="40" color="primary" class="mb-2"
          >mdi-plus-circle-outline</v-icon
        >
        <div class="slot-empty-title">{{ $t("modelSlots.emptyTitle") }}</div>
         <v-menu location="bottom"
          > <template v-slot:activator="{ props: menuProps }"
            > <v-btn
              v-bind="menuProps"
              color="primary"
              variant="tonal"
              size="small"
              > {{ $t("modelSlots.selectModel") }} </v-btn
            > </template
          > <v-card min-width="260"
            > <v-tabs v-model="activeCategory" density="compact"
              > <v-tab value="officialWeb">{{ $t("footer.officialWeb") }}</v-tab
              > <v-tab value="openAICompatible">{{
                $t("footer.openAICompatible")
              }}</v-tab
              > </v-tabs
            > <v-list density="compact"
              > <v-list-item
                v-for="bot in categoryBots"
                :key="bot.getClassname()"
                @click="assignBot(slot - 1, bot)"
                > <template v-slot:prepend
                  > <BotLogo :bot="bot" active size="24" /> </template
                > <v-list-item-title>{{ bot.getFullname() }}</v-list-item-title
                > </v-list-item
              > </v-list
            > </v-card
          > </v-menu
        > </template
      > </v-card
    >
  </div>

</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import bots, { botTags } from "@/bots";
import BotLogo from "@/components/Footer/BotLogo.vue";

const { ipcRenderer } = window.require("electron");
const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  slotCount: {
    type: Number,
    required: true,
  },
});

const store = useStore();
const activeCategory = ref("officialWeb");
const categoryBots = computed(() => botTags[activeCategory.value] || []);
const favoriteBots = computed(() => props.chat?.favBots || []);

function getSlotBot(slot) {
  const assigned = favoriteBots.value.find((bot) => bot.slot === slot);
  if (assigned) return bots.getBotByClassName(assigned.classname);

  const unassigned = favoriteBots.value.filter((bot) => bot.slot === undefined);
  return bots.getBotByClassName(unassigned[slot]?.classname);
}

async function assignBot(slot, bot) {
  const favorites = favoriteBots.value.map((favorite) => ({ ...favorite }));
  const existing = favorites.find(
    (favorite) => favorite.classname === bot.getClassname(),
  );

  if (existing) {
    existing.slot = slot;
    existing.selected = true;
  } else {
    favorites.push({
      classname: bot.getClassname(),
      selected: true,
      order: favorites.length,
      slot,
    });
  }
  store.commit("setFavoriteBot", favorites);

  if (typeof bot.openOfficialChat === "function") {
    await bot.openOfficialChat();
  } else if (bot.getLoginUrl()) {
    await ipcRenderer.invoke("create-new-window", {
      url: bot.getLoginUrl(),
      userAgent: bot.getUserAgent(),
      loginScript: bot.getLoginScript(),
    });
  }
}
</script>

<style scoped>
.model-slots {
  display: grid;
  gap: 16px;
  width: 100%;
  padding: 2rem;
  align-content: center;
  min-height: 100%;
}

.model-slot {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  border-radius: 8px;
  background-color: rgb(var(--v-theme-response));
}

.slot-model {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.slot-model-name,
.slot-empty-title {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>

