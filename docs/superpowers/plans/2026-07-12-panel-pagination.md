# Three-Panel Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render no more than three comparison panels at once while preserving all one-to-six selected model sessions and bottom sending to every selected model.

**Architecture:** `App.vue` owns a two-page index and renders compact navigation beside the existing total-model selector. `ChatMessages.vue` derives the current page's visible panel count while keeping a fixed three-column grid for both pages. `EmptyModelSlots.vue` keeps all physical slots and their WebViews mounted, then hides off-page slots with `v-show` so provider IDs and official chat URLs survive a page change.

**Tech Stack:** Vue 3 Composition API, Vuex, Vuetify 3, Electron WebView, existing Chrome DevTools Protocol verifier.

## Global Constraints

- Preserve the existing model slot identity: physical slot indexes remain zero through `columns - 1`.
- Do not modify any official-site selector, sending adapter, WebView registration IPC, or footer dispatch logic.
- Render at most three visible `.model-slot` elements per page.
- Keep inactive-page DOM nodes mounted so `cardWebviews.get(slot)` remains connected.
- Bottom sending must still receive the existing total `slot-count="columns"` value.

---

### Task 1: Add Page State And Header Navigation

**Files:**
- Modify: `src/App.vue:1-160`

**Interfaces:**
- Produces: `panelPage: Ref<number>`, `panelPageCount: ComputedRef<number>`, `changePanelPage(delta: number): void`.
- Consumed by: `ChatMessages` through a new numeric `page` prop.

- [ ] **Step 1: Add the active page derivation beside the existing `columns` computed value.**

```js
const panelPage = ref(0);
const panelPageCount = computed(() => Math.ceil(columns.value / 3));

function changeColumns(count) {
  store.commit("changeColumns", count);
  panelPage.value = 0;
}

function changePanelPage(delta) {
  panelPage.value = Math.min(
    Math.max(panelPage.value + delta, 0),
    panelPageCount.value - 1,
  );
}

watch(panelPageCount, (count) => {
  if (panelPage.value >= count) panelPage.value = 0;
});
```

- [ ] **Step 2: Render two icon buttons and a page indicator only when `panelPageCount > 1`.**

```vue
<div v-if="panelPageCount > 1" class="panel-page-controls">
  <v-btn
    icon="mdi-chevron-left"
    variant="text"
    size="small"
    :disabled="panelPage === 0"
    @click="changePanelPage(-1)"
    title="上一页"
  />
  <span class="panel-page-indicator">{{ panelPage + 1 }} / {{ panelPageCount }}</span>
  <v-btn
    icon="mdi-chevron-right"
    variant="text"
    size="small"
    :disabled="panelPage === panelPageCount - 1"
    @click="changePanelPage(1)"
    title="下一页"
  />
</div>
```

- [ ] **Step 3: Pass `:page="panelPage"` to `ChatMessages` while leaving FooterBar's `:slot-count="columns"` unchanged.**

```vue
<ChatMessages :chat="currentChat" :columns="columns" :page="panelPage" />
<FooterBar :chat="currentChat" :slot-count="columns" />
```

- [ ] **Step 4: Add compact header CSS that uses fixed icon button dimensions and prevents indicator text wrapping.**

```css
.panel-page-controls {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 104px;
}

.panel-page-indicator {
  min-width: 34px;
  text-align: center;
  white-space: nowrap;
  font-size: 0.75rem;
}
```

- [ ] **Step 5: Run the focused static checks.**

Run: `npm run lint -- src/App.vue && npx prettier --check src/App.vue`

Expected: no lint or formatting errors.

### Task 2: Derive The Current Page Grid

**Files:**
- Modify: `src/components/Messages/ChatMessages.vue:8-45`

**Interfaces:**
- Consumes: `columns: number`, `page: number`.
- Produces: `pageColumns: ComputedRef<number>`.
- Passes: total slot count through `slotCount`, active page through `page`, and visible grid width through `columns` to `EmptyModelSlots`.

- [ ] **Step 1: Add a required numeric `page` prop with default `0`.**

```js
page: {
  type: Number,
  default: 0,
},
```

- [ ] **Step 2: Replace the multi-row `displayColumns` calculation with page-local values.**

```js
const pageColumns = computed(() => Math.min(props.columns, 3));
```

- [ ] **Step 3: Pass page-local columns, the total slot count, and the active page to the slot component.**

```vue
<EmptyModelSlots
  v-if="!loading"
  :chat="chat"
  :columns="pageColumns"
  :slot-count="columns"
  :page="page"
  :messages="currentChatMessages"
/>
```

- [ ] **Step 4: Run the focused static checks.**

Run: `npm run lint -- src/components/Messages/ChatMessages.vue && npx prettier --check src/components/Messages/ChatMessages.vue`

Expected: no lint or formatting errors.

### Task 3: Keep All WebViews Mounted And Hide Inactive Slots

**Files:**
- Modify: `src/components/Messages/EmptyModelSlots.vue:7-305`

**Interfaces:**
- Consumes: `page: number`, total `slotCount: number`.
- Produces: `isSlotVisible(slot: number): boolean`.
- Preserves: `cardWebviews: Map<number, HTMLWebViewElement>` for every physical slot.

- [ ] **Step 1: Add a numeric `page` prop and expose a page predicate.**

```js
page: {
  type: Number,
  default: 0,
},

function isSlotVisible(slot) {
  return slot >= props.page * 3 && slot < (props.page + 1) * 3;
}
```

- [ ] **Step 2: Add `v-show="isSlotVisible(slot - 1)"` to the existing `v-for` section without changing its key or physical slot index.**

```vue
<section
  v-for="slot in slotCount"
  :key="slot"
  v-show="isSlotVisible(slot - 1)"
  class="model-slot"
>
```

- [ ] **Step 3: Keep `syncCardWebviews()` iterating `props.slotCount`; do not filter it by `page`. This creates and preserves all selected page WebViews for all-model sending.**

```js
for (let i = 0; i < props.slotCount; i++) {
  if (isOfficialWebBot(i)) ensureCardWebview(i);
  else removeCardWebview(i);
}
```

- [ ] **Step 4: Run the focused static checks.**

Run: `npm run lint -- src/components/Messages/EmptyModelSlots.vue && npx prettier --check src/components/Messages/EmptyModelSlots.vue`

Expected: no lint or formatting errors.

### Task 4: Verify Layout, Session Retention, And Dispatch Scope

**Files:**
- Modify: `planning_with_flies/progress.md`

**Interfaces:**
- Verifies: `document.documentElement.scrollHeight <= document.documentElement.clientHeight`; visible panel count equals `min(3, columns - page * 3)`.

- [ ] **Step 1: Restart one Electron development instance and connect to its DevTools browser WebSocket from the startup log.**

Run: `npm run electron:serve`

Expected: one `DevTools listening on ws://127.0.0.1:9222/devtools/browser/...` line and no Vuetify layout-item error.

- [ ] **Step 2: For totals four, five, and six, inspect both pages without sending a prompt.**

Run: DevTools `Runtime.evaluate` after selecting the total and page controls.

Expected: page one has three visible `.model-slot` elements; page two has one, two, or three; document height does not exceed viewport height.

- [ ] **Step 3: Record `data-webview-slot` provider IDs before and after switching pages.**

Run: DevTools `Runtime.evaluate` over `[data-webview-slot] webview`.

Expected: each physical slot remains connected with the same `data-provider-id`; no new official-chat URL or WebView target is created by page navigation.

- [ ] **Step 4: Verify the footer still receives the total count rather than the page count.**

Run: DevTools `Runtime.evaluate` to inspect `FooterBar` props or assert the rendered total slot state after selecting six panels.

Expected: the footer target set covers all six selected physical slots while a page shows at most three.

- [ ] **Step 5: Run final verification.**

Run: `npm run lint -- src/App.vue src/components/Messages/ChatMessages.vue src/components/Messages/EmptyModelSlots.vue && npx prettier --check src/App.vue src/components/Messages/ChatMessages.vue src/components/Messages/EmptyModelSlots.vue && git diff --check && npm run build`

Expected: all commands exit successfully; only the repository's existing Browserslist, LangChain export, top-level-await, and asset-size warnings may remain.
