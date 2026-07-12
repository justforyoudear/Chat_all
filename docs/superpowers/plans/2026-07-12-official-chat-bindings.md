# Official Chat Binding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist an official conversation URL for each provider and ChatALL sidebar chat, then restore that URL when the sidebar chat is selected.

**Architecture:** Add an `officialChatBindings` object to otherwise schema-free Dexie chat records. `EmptyModelSlots.vue` owns the binding lifecycle because it owns card WebViews: it captures provider navigation, persists non-root URLs with `Chats.update`, and navigates existing WebViews to the active chat's provider URL on a chat-index change.

**Tech Stack:** Vue 3 Composition API, Dexie, Electron WebView, existing `Chats` store helper.

## Global Constraints

- Keys are `WebChatBot.constructor._providerId` values, not slot indexes.
- Never persist a provider root URL as a completed conversation binding.
- Do not recreate a WebView when only the selected ChatALL chat changes.
- Do not change FooterBar, official send adapters, or IPC contracts.

---

### Task 1: Resolve And Persist Provider Bindings

**Files:**
- Modify: `src/components/Messages/EmptyModelSlots.vue:131-212`

**Interfaces:**
- Consumes: `props.chat.index`, `props.chat.officialChatBindings`, provider ID, provider root URL.
- Produces: `getOfficialChatUrl(slot): string`, `rememberOfficialChatUrl(providerId, rootUrl, url, chatIndex): Promise<void>`.

- [ ] **Step 1: Import the `Chats` helper and resolve a desired URL from the current chat binding.**

```js
import Chats from "@/store/chats";

function getOfficialChatUrl(slot) {
  const bot = getSlotBot(slot);
  const rootUrl = bot.constructor._chatUrl || bot.getLoginUrl();
  const providerId = bot.constructor._providerId;
  return props.chat?.officialChatBindings?.[providerId] || rootUrl;
}
```

- [ ] **Step 2: Persist only real provider conversation URLs.**

```js
async function rememberOfficialChatUrl(providerId, rootUrl, url, chatIndex) {
  if (!chatIndex || !url || url === rootUrl) return;
  const chat = await Chats.table.get(chatIndex);
  if (!chat || chat.officialChatBindings?.[providerId] === url) return;
  await Chats.update(chatIndex, {
    officialChatBindings: {
      ...(chat.officialChatBindings || {}),
      [providerId]: url,
    },
  });
}
```

- [ ] **Step 3: Register `did-navigate` and `did-navigate-in-page` listeners on a new card WebView.**

```js
const rememberUrl = (_event, url) =>
  rememberOfficialChatUrl(providerId, rootUrl, url, wv.dataset.chatIndex);
wv.addEventListener("did-navigate", rememberUrl);
wv.addEventListener("did-navigate-in-page", rememberUrl);
```

- [ ] **Step 4: Run focused checks.**

Run: `npm run lint -- src/components/Messages/EmptyModelSlots.vue && npx prettier --check src/components/Messages/EmptyModelSlots.vue`

Expected: no lint or formatting errors.

### Task 2: Restore Bindings On Sidebar Chat Switch

**Files:**
- Modify: `src/components/Messages/EmptyModelSlots.vue:157-303`

**Interfaces:**
- Consumes: `getOfficialChatUrl(slot): string` and `props.chat.index`.
- Produces: `persistCurrentChatBindings(chatIndex): Promise<void>` and `syncCardWebviews(): void` that navigates an existing same-provider WebView rather than recreating it.

- [ ] **Step 1: Make an existing same-provider WebView navigate when its desired URL changes.**

```js
if (existing?.isConnected && existing.dataset.providerId === providerId) {
  existing.dataset.chatIndex = props.chat.index;
  if (existing.getAttribute("src") !== url) existing.setAttribute("src", url);
  return;
}
```

- [ ] **Step 2: Mark a newly created WebView with its owning ChatALL chat index before assigning `src`.**

```js
wv.dataset.providerId = providerId;
wv.dataset.chatIndex = props.chat.index;
wv.setAttribute("src", url);
```

- [ ] **Step 3: Watch the selected chat index, persist the outgoing chat, then synchronize to the incoming chat.**

```js
watch(
  () => props.chat?.index,
  async (nextIndex, previousIndex) => {
    if (previousIndex && previousIndex !== nextIndex) {
      await persistCurrentChatBindings(previousIndex);
    }
    await nextTick();
    syncCardWebviews();
  },
  { flush: "sync" },
);
```

- [ ] **Step 4: Run focused checks.**

Run: `npm run lint -- src/components/Messages/EmptyModelSlots.vue && npx prettier --check src/components/Messages/EmptyModelSlots.vue && git diff --check`

Expected: all commands succeed.

### Task 3: Verify Binding Isolation

**Files:**
- Modify: `planning_with_flies/progress.md`

**Interfaces:**
- Verifies: chat record `officialChatBindings`, WebView `data-provider-id`, WebView `src`.

- [ ] **Step 1: In Electron DevTools, create or select two ChatALL sidebar chats with the same official models.**

Expected: the second chat has no `officialChatBindings` property before sending.

- [ ] **Step 2: Bind a provider URL in the first chat and switch to the second chat without sending.**

Expected: the same WebView target remains alive but loads the provider root URL for the unbound second chat.

- [ ] **Step 3: Switch back to the first chat.**

Expected: the same WebView target loads the exact stored provider conversation URL, without opening a BrowserWindow.

- [ ] **Step 4: Run final verification.**

Run: `npm run lint -- src/components/Messages/EmptyModelSlots.vue && npx prettier --check src/components/Messages/EmptyModelSlots.vue && git diff --check && npm run build`

Expected: all commands exit successfully; only repository-existing build warnings may remain.
