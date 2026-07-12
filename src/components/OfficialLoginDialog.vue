<template>

  <div v-show="login.open" class="official-login-overlay" role="dialog">

    <section class="official-login-panel">

      <header class="official-login-header">
         <strong>{{
          $t("officialLogin.title", { provider: login.title })
        }}</strong
        > <span>{{ $t("officialLogin.subtitle") }}</span
        > <button
          class="official-login-close"
          type="button"
          :aria-label="$t('common.close')"
          @click="close"
        >
           <v-icon>mdi-close</v-icon> </button
        >
      </header>

      <div ref="webviewHost" class="official-webview-host"></div>

    </section>

  </div>

</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const { ipcRenderer } = window.require("electron");
const store = useStore();
const webviewHost = ref(null);
const login = computed(() => store.state.officialLogin);
let webview = null;
let loadedUrl = "";

function ensureWebview() {
  if (webview || !webviewHost.value) return;
  console.log("[OLD] ensureWebview: creating webview");
  webview = document.createElement("webview");
  webview.style.width = "100%";
  webview.style.height = "100%";
  webview.style.border = "0";
  webview.style.background = "white";
  webview.setAttribute("disableblinkfeatures", "Auxclick");
  webview.addEventListener("did-attach", () => {
    console.log("[OLD] webview did-attach, id:", webview.getWebContentsId?.());
  });
  webview.addEventListener("dom-ready", () => {
    console.log("[OLD] webview dom-ready, id:", webview.getWebContentsId?.());
    // The main process binds popup handling before this provider registration.
    registerWebContents();
  });
  webview.addEventListener("will-navigate", (event) => {
    console.log("[OLD] will-navigate:", event.url);
  });
  webview.addEventListener("did-navigate", (event, url) => {
    console.log("[OLD] did-navigate event.url:", event?.url, "url arg:", url);
  });
  webview.addEventListener("did-fail-load", (event) => {
    console.log("[OLD] did-fail-load:", event?.url, event?.errorDescription);
  });
  webviewHost.value.appendChild(webview);
  console.log("[OLD] ensureWebview: appended to DOM");
}

async function registerWebContents() {
  if (!login.value.providerId || !webview) return;
  const webContentsId = webview.getWebContentsId?.();
  console.log(
    "[OLD] registerWebContents: providerId=%s, webContentsId=%s",
    login.value.providerId,
    webContentsId,
  );
  if (!webContentsId) return;
  await ipcRenderer.invoke("web-chat-register", {
    providerId: login.value.providerId,
    webContentsId,
    url: login.value.url,
  });
  console.log("[OLD] registerWebContents: done");
}

function close() {
  destroyWebview();
  store.commit("setOfficialLogin", { open: false });
}

function destroyWebview() {
  if (!webview) return;
  webview.remove();
  webview = null;
  loadedUrl = "";
}

async function openPanel() {
  console.log(
    "[OLD] openPanel: url:",
    login.value.url,
    "providerId:",
    login.value.providerId,
  );
  await nextTick();
  const overlay = document.querySelector(".official-login-overlay");
  console.log(
    "[OLD] openPanel: overlay display =",
    overlay ? getComputedStyle(overlay).display : "missing",
  );
  ensureWebview();
  if (!webview) return;
  const url = login.value.url || "about:blank";
  if (loadedUrl !== url) {
    loadedUrl = url;
    console.log("[OLD] setting webview src to:", url);
    webview.setAttribute("src", url);
  } else {
    console.log("[OLD] url already loaded, skipping");
  }
}

onMounted(() => {
  ipcRenderer.on("bg-log", (_event, msg) => {
    console.log("[RENDERER-BG]", msg);
  });
  if (login.value.open) openPanel();
});

watch(
  () => login.value.open,
  async (open) => {
    console.log("[OLD] watch login.open:", open);
    if (!open) {
      destroyWebview();
      return;
    }
    await openPanel();
  },
);
</script>

<style scoped>
.official-login-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.32);
}

.official-login-panel {
  width: min(1080px, calc(100vw - 48px));
  height: min(780px, calc(100vh - 48px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3);
}

.official-login-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  min-height: 56px;
  padding: 0 14px 0 18px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.official-login-header span {
  min-width: 0;
  overflow: hidden;
  color: rgba(var(--v-theme-on-surface), 0.62);
  font-size: 0.875rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.official-login-close {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.official-login-close:hover {
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.official-webview-host {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>

