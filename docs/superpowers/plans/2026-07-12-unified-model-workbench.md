# 统一模型工作台实现计划

> **供执行代理使用：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务逐项执行。步骤使用复选框（`- [ ]`）追踪。

**目标：** 官网模型与已配置 API 模型是唯一可选择的对比模型，移除旧底部图标栏，并让提示词优化的配置错误在界面中可见。

**架构：** 保留 `favBots` 作为当前对话模型分配的唯一来源。`EmptyModelSlots` 负责模型选择和官网 webview；底部只负责输入和分发。提示词优化从同一受限 API 目录中选择可用模型。

**技术栈：** Vue 3、Vuex、Vuetify 3、Electron webview、vue-i18n。

## 全局约束

- 保留现有 DeepSeek 官网登录和已存储的对话。
- 支持已配置的厂商 API 和自定义 OpenAI 兼容端点。
- 不新增依赖，不改动构建或发布配置。
- 本次不删除旧 Bot 实现。
- 所有新增面向用户的文案同时更新 `en.json` 与 `zh.json`。
- 项目没有单元测试框架，使用针对性 lint、Prettier 和 Electron 手工冒烟测试。

## 文件职责

- `src/bots/index.js`：工作台 API 目录。
- `src/composables/usePromptEnhance.js`：首选可用 API 模型选择。
- `src/components/SettingsModal.vue`：仅展示官网/API 设置。
- `src/components/Messages/EmptyModelSlots.vue`：面板模型菜单。
- `src/components/Footer/FooterBar.vue`：输入、分发和提示词优化错误提示。
- `src/i18n/locales/en.json`、`src/i18n/locales/zh.json`：本地化界面文案。

### 任务 1：收敛工作台模型目录

**文件：** 修改 `src/bots/index.js:161-256`、`src/composables/usePromptEnhance.js:1-57`。

**产出：** `botTags.workbenchApi`，供模型面板和 `getPreferredApiBot()` 使用。

- [ ] 在旧标签旁新增工作台目录。其包含 `CustomOpenAIAPIBot` 和有对应设置页的 API 实现；旧标签数组不修改，保证持久化数据兼容。

```js
export const botTags = {
  officialWeb: [bots.getBotByClassName("DeepSeekWebBot")],
  workbenchApi: [
    bots.getBotByClassName("CustomOpenAIAPIBot"),
    bots.getBotByClassName("OpenAIAPI35Bot"),
    bots.getBotByClassName("GeminiAPIBot"),
    bots.getBotByClassName("ClaudeAPIOpusBot"),
  ],
};
```

- [ ] 在 `getPreferredApiBot()` 中将 `const apiBotList = botTags?.api || [];` 替换为 `const apiBotList = botTags?.workbenchApi || [];`。
- [ ] 运行 `npm run lint -- src/bots/index.js src/composables/usePromptEnhance.js`。预期：通过；已配置的自定义 OpenAI 兼容模型会被选中，未配置模型时返回 `null`。
- [ ] 提交：`git add src/bots/index.js src/composables/usePromptEnhance.js; git commit -m "feat: scope prompt enhancement to workbench api models"`。

### 任务 2：收敛设置标签页

**文件：** 修改 `src/components/SettingsModal.vue:80-170`。

**产出：** 设置只展示 DeepSeek 官网登录和支持的 API 配置，同时保留通用、代理与对话设置。

- [ ] 用下列组件替换 `botSettings`，并移除不再使用的导入：

```js
const botSettings = [
  { brand: "deepSeek", component: DeepSeekWebBotSettings },
  { brand: "customApi", component: CustomOpenAIAPIBotSettings },
  { brand: "openaiApi", component: OpenAIAPIBotSettings },
  { brand: "geminiApi", component: GeminiAPIBotSettings },
  { brand: "claudeApi", component: ClaudeAPIBotSettings },
  { brand: "groqApi", component: GroqAPIBotSettings },
  { brand: "xaiApi", component: xAIAPIBotSettings },
  { brand: "azureOpenaiApi", component: AzureOpenAIAPIBotSettings },
  { brand: "cohereApi", component: CohereAPIBotSettings },
];
```

- [ ] 运行 `npm run lint -- src/components/SettingsModal.vue`。预期：通过；旧的仅官网提供商不再出现在设置中。
- [ ] 提交：`git add src/components/SettingsModal.vue; git commit -m "feat: show official login and api settings only"`。

### 任务 3：以对比面板替代底部图标

**文件：** 修改 `src/components/Messages/EmptyModelSlots.vue:115-126`、`src/components/Footer/FooterBar.vue:1-430`。

**输入：** `botTags.officialWeb`、`botTags.workbenchApi` 和 `chat.favBots`。**产出：** 仅能从面板菜单选择模型。

- [ ] 将 API 菜单组改为 `{ key: "api", label: "footer.api", bots: botTags.workbenchApi || [] }`。
- [ ] 移除底部的 `BotLogo` 模板、上下文菜单、`Sortable` 导入和状态、拖拽处理器及批量收藏操作。保留输入框、附件、模型菜单快捷键、`updateActiveBots` 和发送流程。
- [ ] 根据已分配模型重建发送目标：

```js
const toBots = (props.chat?.favBots || [])
  .filter((favBot) => activeBots[favBot.classname])
  .map((favBot) => _bots.getBotByClassName(favBot.classname))
  .filter(Boolean);
```

- [ ] 运行 `npm run lint -- src/components/Messages/EmptyModelSlots.vue src/components/Footer/FooterBar.vue`。预期：通过；旧模型图标消失；从面板新增的已配置自定义 API 模型可收到发送提示词。
- [ ] 提交：`git add src/components/Messages/EmptyModelSlots.vue src/components/Footer/FooterBar.vue; git commit -m "feat: select models from comparison panels"`。

### 任务 4：显示提示词优化错误

**文件：** 修改 `src/components/Footer/FooterBar.vue:45-75,352-370`、`src/i18n/locales/en.json:422-424`、`src/i18n/locales/zh.json:419-421`。

**产出：** 底部显示可关闭的本地错误提示，替代仅控制台错误。

- [ ] 在两个语言文件中新增 `enhance.configurationRequired`，说明用户需先在设置中添加并配置 API 模型。
- [ ] 新增 `const enhanceError = ref("");`，优化前清空，并将 catch 块替换为：

```js
} catch (err) {
  enhanceError.value = err?.message || $t("enhance.configurationRequired");
} finally {
  isEnhancing.value = false;
}
```

- [ ] 在输入框附近渲染：

```vue
<v-alert v-if="enhanceError" type="warning" density="compact" closable
  @click:close="enhanceError = ''">
  {{ enhanceError }}
</v-alert>
```

- [ ] 运行 `npm run lint -- src/components/Footer/FooterBar.vue` 与 `npx prettier --check src/components/Footer/FooterBar.vue src/i18n/locales/en.json src/i18n/locales/zh.json`。预期：通过；未配置时显示引导，配置成功时替换输入框内容。
- [ ] 提交：`git add src/components/Footer/FooterBar.vue src/i18n/locales/en.json src/i18n/locales/zh.json; git commit -m "fix: show prompt enhancement configuration errors"`。

### 任务 5：完整验证

**文件：** 仅验证任务 1 至 4 中的文件。

- [ ] 运行 `npm run lint -- src/bots/index.js src/composables/usePromptEnhance.js src/components/SettingsModal.vue src/components/Messages/EmptyModelSlots.vue src/components/Footer/FooterBar.vue`。
- [ ] 运行 `npx prettier --check src/bots/index.js src/composables/usePromptEnhance.js src/components/SettingsModal.vue src/components/Messages/EmptyModelSlots.vue src/components/Footer/FooterBar.vue src/i18n/locales/en.json src/i18n/locales/zh.json`。
- [ ] 运行 `npm run electron:serve`。确认 DeepSeek 内嵌登录可用，API 模型可加入同一个对比对话，回答可分析和总结，旧底部图标不存在，提示词优化在有/无 API 配置时均符合预期。
- [ ] 仅审阅相关改动：`git diff -- src/bots/index.js src/composables/usePromptEnhance.js src/components/SettingsModal.vue src/components/Messages/EmptyModelSlots.vue src/components/Footer/FooterBar.vue src/i18n/locales/en.json src/i18n/locales/zh.json`。
