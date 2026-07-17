<template>
   <CommonBotSettings
    :settings="settings"
    :brand-id="brandId"
    mutation-type="setChat"
  ></CommonBotSettings
  > <v-list
    > <v-list-item
      > <v-btn
        color="primary"
        variant="outlined"
        :text="$t('chat.deleteAllChatHistory')"
        @click="deleteChats"
      ></v-btn
      > </v-list-item
    > <br /> <v-list-item
      > <v-list-item-title style="font-size: 1.5rem" class="pb-2"
        > {{ $t("chat.exportImport") }}</v-list-item-title
      > <v-list-item-subtitle
        > {{ $t("chat.exportImportDesc") }}</v-list-item-subtitle
      >
      <div class="pt-2">
         <v-btn
          color="primary"
          variant="outlined"
          :text="$t('chat.export')"
          @click="exportData"
        ></v-btn
        > <v-btn
          color="primary"
          variant="outlined"
          :text="$t('chat.import')"
          @click="importData"
          style="margin-left: 10px"
          > </v-btn
        >
      </div>
       </v-list-item
    > </v-list
  > <ConfirmModal ref="confirmModal" /> <v-snackbar
    v-model="snackbar.show"
    :timeout="snackbar.timeout"
    :color="snackbar.color"
    > {{ snackbar.text }} <template v-slot:actions
      > <v-btn variant="text" @click="snackbar.show = false"
        > {{ $t("updates.close") }} </v-btn
      > </template
    > </v-snackbar
  > <v-dialog width="85vw" :model-value="isShowImportProgressDialog" persistent
    > <v-card
      > <v-card-title> {{ $t("chat.importLog") }} </v-card-title> <v-textarea
        readonly
        hide-details
        rows="20"
        v-model="importProgressText"
        id="import-log-textarea"
        :loading="isImportCompleted === false"
      ></v-textarea
      > <v-card-actions class="justify-end pr-6 pt-0" style="gap: 0.3rem"
        > <v-btn
          variant="text"
          @click="isShowImportProgressDialog = false"
          :disabled="isImportCompleted === false"
          > {{ $t("modal.done") }} </v-btn
        > </v-card-actions
      > </v-card
    > </v-dialog
  >
</template>

<script setup>
import bots from "@/bots";
import ConfirmModal from "@/components/ConfirmModal.vue";
import CommonBotSettings from "@/components/BotSettings/CommonBotSettings.vue";
import i18n from "@/i18n";
import Chats from "@/store/chats";
import db from "@/store/db";
import Messages from "@/store/messages";
import Threads from "@/store/threads";
import Dexie from "dexie";
import { exportDB } from "dexie-export-import";
import localForage from "localforage";
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { nextTick } from "vue";
import { Type } from "./BotSettings/settings.const";

const emit = defineEmits(["close-dialog"]);
const confirmModal = ref();
const importProgressText = ref("");
const isImportCompleted = ref(false);
const snackbar = reactive({
  show: false,
  text: "",
  timeout: -1,
  color: "",
});
const isShowImportProgressDialog = ref(false);
const store = useStore();
const brandId = "chat";
const settings = [
  {
    type: Type.Slider,
    name: "updateDebounceInterval",
    title: "chat.updateDebounceInterval",
    description: "chat.updateDebounceIntervalDesc",
    min: 0,
    max: 2000,
    step: 100,
  },
];
const SETTING_FILE_NAME = "localforage.json";
const CHAT_FILE_NAME = "ChatALL.json";
const EXPORT_IMPORT_FILE_EXTENSION = ".ChatALL";

function getExportedFileName() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  const fileName = `chatall-history-${year}${month}${day}-${hour}${minute}${second}`;
  return fileName;
}

async function exportData() {
  const confirm = await confirmModal.value.showModal(
    "",
    i18n.global.t("chat.exportDesc"),
  );
  if (confirm === false) {
    return;
  }
  try {
    const settingBlob = getSettingWithoutBotSetting();
    const chatHistoryBlob = await exportDB(db);

    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    zip.file(SETTING_FILE_NAME, settingBlob);
    zip.file(CHAT_FILE_NAME, chatHistoryBlob);
    zip.generateAsync({ type: "blob" }).then(function (zipBlob) {
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${getExportedFileName()}${EXPORT_IMPORT_FILE_EXTENSION}`;
      document.body.appendChild(a);

      // Click the anchor element to download the file.
      a.click();

      // Remove the anchor element from the document body.
      document.body.removeChild(a);

      // Revoke the URL for the blob.
      URL.revokeObjectURL(url);
    });
    snackbar.text = i18n.global.t("chat.exportSuccess");
    snackbar.color = "success";
  } catch (error) {
    console.error(error);
    snackbar.text = `${i18n.global.t("chat.exportFailed")}: ${error.message}`;
    snackbar.color = "error";
  }
  snackbar.show = true;
}

async function importData() {
  const confirm = await confirmModal.value.showModal(
    "",
    i18n.global.t("chat.importDesc"),
  );
  if (confirm === false) {
    return;
  }
  importProgressText.value = "";
  isImportCompleted.value = false;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = EXPORT_IMPORT_FILE_EXTENSION;
  input.addEventListener("change", importDataOnChangeFile);
  document.body.appendChild(input);

  // Click the input element to select the file.
  input.click();
}

async function importDataOnChangeFile(event) {
  try {
    isShowImportProgressDialog.value = true;
    logImportProgress(`Import started`);

    const file = event.target.files[0];
    const { default: JSZip } = await import("jszip");
    logImportProgress(`Reading file "${file.name}" (${file.size} bytes)`);
    const zip = await JSZip.loadAsync(file);
    logImportProgress(
      `Done reading file "${file.name}", containing ${
        Object.keys(zip?.files).length
      } files`,
    );

    let chatString;
    let settingString;
    await new Promise((resolve, reject) => {
      let fileCount = 0;
      zip.forEach(async (relativePath, zipEntry) => {
        try {
          logImportProgress(`Reading file "${relativePath}"`);
          const zipFileString = await zipEntry.async("string");
          logImportProgress(
            `Done reading "${relativePath}" content, length: ${zipFileString?.length}`,
          );
          if (relativePath === CHAT_FILE_NAME) {
            chatString = zipFileString;
          } else if (relativePath === SETTING_FILE_NAME) {
            settingString = zipFileString;
          }
          fileCount++;
          if (fileCount === 2) {
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    // import ChatALL db
    let unchangedCount = 0;
    let updatedCount = 0;
    let addedCount = 0;
    let errorCount = 0;
    const addedRecords = [];
    const updatedRecords = [];
    const errorRecords = [];

    logImportProgress(`"${CHAT_FILE_NAME}" import started`);
    logImportProgress(`Parsing "${CHAT_FILE_NAME}" content to JSON object`);
    const chatDbObject = JSON.parse(chatString);
    try {
      logImportProgress(`Retrieving chats table records`);
      const chatRow = chatDbObject.data.data.find(
        (d) => d.tableName === "chats",
      )?.rows;
      logImportProgress(`Filtering $types from chats record`);
      const rows = chatRow
        .filter((record) => record.index && typeof record.index === "string")
        .map((record) => {
          delete record.$types;
          return record;
        });
      logImportProgress(
        `Importing. There are ${chatRow?.length} records in chats table. This process may take some time.`,
      );

      for (const row of rows) {
        try {
          const chat = await Chats.table.get(row.index);
          if (chat) {
            if (compare(chat, row)) {
              unchangedCount++;
            } else {
              await Chats.table.put(row);
              updatedRecords.push({ row, table: "chats" });
              updatedCount++;
            }
          } else {
            await Chats.table.add(row);
            addedRecords.push({ row, table: "chats" });
            addedCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(error);
          errorRecords.push({ error, row, table: "chats" });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      logImportProgress(
        `chats table import completed: ${addedCount} added, ${updatedCount} updated, ${unchangedCount} unchanged, ${errorCount} error`,
      );
    }

    unchangedCount = 0;
    updatedCount = 0;
    addedCount = 0;
    errorCount = 0;
    try {
      logImportProgress(`Retrieving messages table records`);
      const messagesRow = chatDbObject.data.data.find(
        (d) => d.tableName === "messages",
      )?.rows;
      logImportProgress(
        `Importing. There are ${messagesRow?.length} records in messages table. This process may take some time.`,
      );
      for (const row of messagesRow) {
        try {
          const message = await Messages.table.get(row.index);
          if (message) {
            if (compare(message, row)) {
              unchangedCount++;
            } else {
              await Messages.table.put(row);
              updatedRecords.push({ row, table: "messages" });
              updatedCount++;
            }
          } else {
            await Messages.table.add(row);
            addedRecords.push({ row, table: "messages" });
            addedCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(error);
          errorRecords.push({ error, row, table: "messages" });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      logImportProgress(
        `messages table import completed: ${addedCount} added, ${updatedCount} updated, ${unchangedCount} unchanged, ${errorCount} error`,
      );
    }

    unchangedCount = 0;
    updatedCount = 0;
    addedCount = 0;
    errorCount = 0;
    try {
      logImportProgress(`Retrieving threads table records`);
      const threadsRow = chatDbObject.data.data.find(
        (d) => d.tableName === "threads",
      )?.rows;
      logImportProgress(
        `Importing. There are ${threadsRow?.length} records in threads table. This process may take some time.`,
      );
      for (const row of threadsRow) {
        try {
          const message = await Threads.table.get(row.index);
          if (message) {
            if (compare(message, row)) {
              unchangedCount++;
            } else {
              await Threads.table.put(row);
              updatedRecords.push({ row, table: "threads" });
              updatedCount++;
            }
          } else {
            await Threads.table.add(row);
            addedRecords.push({ row, table: "threads" });
            addedCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(error);
          errorRecords.push({ error, row, table: "threads" });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      logImportProgress(
        `threads table import completed: ${addedCount} added, ${updatedCount} updated, ${unchangedCount} unchanged, ${errorCount} error`,
      );
    }

    // import localforage keyvaluepairs
    logImportProgress(`"${SETTING_FILE_NAME}" import started`);
    logImportProgress(`Parsing "${SETTING_FILE_NAME}" content to JSON object`);
    const settingDbObject = JSON.parse(settingString);
    logImportProgress(`Retrieving keyvaluepairs table records`);
    const rows = settingDbObject.data.data.find(
      (d) => d.tableName === "keyvaluepairs",
    )?.rows;
    logImportProgress(
      `Importing. There are ${rows?.length} records in keyvaluepairs table. This process may take some time.`,
    );

    unchangedCount = 0;
    updatedCount = 0;
    addedCount = 0;
    errorCount = 0;
    try {
      if (rows.length && rows[0].$ && rows[0].$.length > 1) {
        const chatallKey = rows[0].$[1];
        for (const key in chatallKey) {
          try {
            if (Array.isArray(chatallKey[key])) {
              const storeIndexes = store.state[key].map((item) => item.index);
              for (const importItem of chatallKey[key]) {
                let index = storeIndexes.indexOf(importItem.index);
                if (index === -1) {
                  store.commit("pushSettingArray", {
                    key,
                    value: importItem,
                  });
                  addedRecords.push({
                    row: `key: ${key}, added: ${JSON.stringify(importItem)}`,
                    table: "keyvaluepairs",
                  });
                  addedCount++;
                } else {
                  if (compare(importItem, store.state[key][index])) {
                    unchangedCount++;
                  } else {
                    store.commit("updateSettingArray", {
                      key,
                      index,
                      value: importItem,
                    });
                    updatedRecords.push({
                      row: `key: ${key}, updated: ${JSON.stringify(
                        importItem,
                      )}`,
                      table: "keyvaluepairs",
                    });
                    updatedCount++;
                  }
                }
              }
            } else {
              if (compare(chatallKey[key], store.state[key])) {
                unchangedCount++;
              } else {
                store.commit("updateSetting", {
                  key,
                  value: chatallKey[key],
                });
                updatedRecords.push({
                  row: `key: ${key}, updated: ${JSON.stringify(
                    chatallKey[key],
                  )}`,
                  table: "keyvaluepairs",
                });
                updatedCount++;
              }
            }
          } catch (error) {
            errorCount++;
            console.error(error);
            errorRecords.push({
              row: `key: ${key}, error: ${JSON.stringify(chatallKey[key])}`,
              table: "keyvaluepairs",
            });
          }
        }
      } else {
        logImportProgress(`Invalid rows`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      logImportProgress(
        `keyvaluepairs table import completed: ${addedCount} added, ${updatedCount} updated, ${unchangedCount} unchanged, ${errorCount} error`,
      );
    }

    logImportProgress(`Added:\n${JSON.stringify(addedRecords, null, 2)}`);
    logImportProgress(`Updated:\n${JSON.stringify(updatedRecords, null, 2)}`);
    logImportProgress(`Error:\n${JSON.stringify(errorRecords, null, 2)}`);

    logImportProgress(
      `Import completed, added ${addedRecords.length}, updated ${updatedRecords.length}, error ${errorRecords.length}`,
    );

    snackbar.text = i18n.global.t("chat.importSuccess");
    snackbar.color = "success";
  } catch (error) {
    console.error(error);
    snackbar.text = `${i18n.global.t("chat.importFailed")}: ${error.message}`;
    snackbar.color = "error";
  } finally {
    // Remove the input element from the document body.
    document.body.removeChild(event.target);
    isImportCompleted.value = true;
    snackbar.show = true;
  }
}

function compare(obj1, obj2) {
  //Loop through properties in object 1
  for (var p in obj1) {
    //Check property exists on both objects
    if (
      Object.hasOwnProperty.call(obj1, p) !==
      Object.hasOwnProperty.call(obj2, p)
    )
      return false;

    switch (typeof obj1[p]) {
      //Deep compare objects
      case "object":
        if (!compare(obj1[p], obj2[p])) return false;
        break;
      //Compare function code
      case "function":
        if (
          typeof obj2[p] == "undefined" ||
          (p != "compare" && obj1[p].toString() != obj2[p].toString())
        )
          return false;
        break;
      //Compare values
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }

  //Check object 2 for any extra properties
  for (const p in obj2) {
    if (typeof obj1[p] == "undefined") return false;
  }
  return true;
}

function logImportProgress(text) {
  importProgressText.value += `${new Date().toISOString()} - ${text}\n`;
  const element = document.getElementById("import-log-textarea");
  if (element) {
    nextTick(() => (element.scrollTop = element.scrollHeight));
  }
}

async function getSettingWithoutBotSetting() {
  await localForage._dbInfo.db.close();
  const settingDb = await new Dexie("localforage").open();
  const userSettingBlob = await exportDB(settingDb);
  const userSettingText = await userSettingBlob.text();
  const userSettingJson = JSON.parse(userSettingText);
  const allBotBrandId = bots.all.map((bot) => bot.constructor._brandId);
  for (const brandId of allBotBrandId) {
    // delete bot related setting
    delete userSettingJson.data.data[0].rows[0].$[1][brandId];
  }
  const str = JSON.stringify(userSettingJson);
  const bytes = new TextEncoder().encode(str);
  return new Blob([bytes], {
    type: "application/json;charset=utf-8",
  });
}

async function deleteChats() {
  const confirm = await confirmModal.value.showModal(
    "",
    i18n.global.t("chat.confirmDeleteAllChatHistory"),
  );
  if (confirm) {
    store.commit("deleteChats");
    emit("close-dialog");
  }
}
</script>

<style scoped>
.no-text-transform {
  text-transform: none !important;
}

:deep() i.v-icon {
  color: rgb(var(--v-theme-primary));
}

:deep() .v-textarea .v-field {
  padding: 0;
}
</style>

