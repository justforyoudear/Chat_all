# 关键发现

## 发送问题根因

| 问题                              | 根因                                                                                              | 处理方式                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 只有 DeepSeek 收到消息            | 通用选择器只匹配 `textarea/button`，Kimi 使用 `.chat-input-editor` 和 `div.send-button-container` | 为 Kimi 添加专用输入与发送路径                         |
| 第二条消息无法发送                | 官网机器人轮询网页回复，持有同模型锁最长约 120 秒                                                 | 注入消息后立即完成本地任务，网页回复由官网面板自身渲染 |
| 刷新后报“官方聊天窗口未打开”      | Footer 的可用性检查先于卡片 WebView 注册执行                                                      | `evaluateOfficialChat`、原生文本输入均在注册空窗中重试 |
| 官网页面另开窗口                  | 常驻卡片没有与登录浮层相同的 `new-window` 拦截                                                    | 卡片 WebView 添加拦截并在自身中加载目标链接            |
| ResizeObserver 覆盖层错误         | 登录 WebView 在加载时持续按父容器写回宽高，造成布局回流；开发服务器将浏览器通知显示为错误         | 删除尺寸回写，并过滤该非致命开发期通知                 |
| `vue3-shortkey` 的 `undefined.el` | 第三方指令在条件渲染/更新期间访问丢失节点                                                         | 替换为项目内部 `src/directives/shortkey.js`            |

## 页面结构证据

从 Kimi 官网页面源码确认：

- 编辑器类名为 `chat-input-editor`。
- 发送容器类名为 `send-button-container`，启用前会带 `disabled` 类。
- 因此 `button[type=submit]` 的默认策略不能覆盖 Kimi。

## 主要实现位置

- `src/bots/deepseek/DeepSeekWebBot.js`：通用官网注入与不阻塞的完成逻辑。
- `src/bots/china/DomesticWebBots.js`：Kimi 的原生输入/点击策略及其他国内官网模型声明。
- `src/bots/WebChatBot.js`：WebView 注册空窗重试。
- `src/background.js`：WebView 注册、执行脚本、原生文本输入和弹窗拦截。
- `src/components/Messages/EmptyModelSlots.vue`：卡片 WebView 创建、复用、销毁和新窗口拦截。
- `src/components/OfficialLoginDialog.vue`：登录 WebView 生命周期。
- `src/main.js`、`vue.config.js`：快捷键替换和开发期 ResizeObserver 错误处理。

## 2026-07-12 回归审查

- `src/background.js` 的开发环境 DevTools 判断包含 `|| true`，会无条件打开 DevTools。该调试遗留会干扰 Electron 回归，且改变了既有 `OPEN_DEVTOOLS` 开关语义；应恢复为仅在环境变量为 `"true"` 时打开。
- Electron 启动回归实际复现了 WebView 注册竞态：Footer 在 WebView `dom-ready` 前调用 `web-chat-evaluate`，随后才有 `web-chat-register`。渲染层的重试会吞掉错误但无法阻止 Electron 主进程将每次 IPC 拒绝打印为错误；主进程应在注册窗口内等待对应 `webContents`。
- Electron 启动还报告 `preload script must have absolute path`。`src/background.js` 的 `preload: "./preload.js"` 是基线配置，但 `src/preload.js`、构建输出及全仓引用均不存在；移除无效配置可消除错误，且当前应用已启用 `nodeIntegration` 并关闭 `contextIsolation`，没有预加载脚本的功能依赖。
- 本地 UI 准备检查：两个官网面板加载后，在底部输入框填写未发送的临时文本会启用“发送到”按钮；清空文本后按钮重新禁用。这证明模型可用性与发送目标状态已正确联动，未向外部服务发送任何内容。

## 2026-07-12 连续发送问题

### 当前续修

- `FooterBar.vue` 在每次底部发送前都会对全部选中模型串行调用 `checkAvailability()`；官网模型在 WebView 重新注册的短暂窗口会进入主进程重试等待，直接造成 DeepSeek 发送延迟。
- `DeepSeekWebBot` 的通用路径会从可见按钮、文本标签和输入框附近选取任意候选；该启发式无法保证命中发送控件，可能误点官网的“新会话”操作。发送必须只点击明确匹配的启用发送控件，找不到时安全失败而不触发其他页面动作。
- 先前收紧为全局明确选择器后，DeepSeek 的实际发送控件不匹配时会让文本停留在输入框。新的匹配范围限定在输入框的编辑器祖先区域，并以输入框右侧的可用控件作为受限回退，避免误触页面其他区域。
- 两个官网适配器均在点击后立即报告完成，导致下一条在官网尚未清空输入框或禁用发送控件时进入同一 WebView。发送完成条件应是官网确认提交，而不是 JavaScript 已调用 `click()`。
- `store.sendPrompt` 未等待任何 `bot.sendPrompt()` Promise，导致 Footer 的 `isSending` 在官网请求真正完成前恢复为 `false`。这是所有小窗口可同时收到首条、但第二条抢跑并触发 DeepSeek 高延迟/新会话的共同根因。
- DevTools 协议实际检查确认：DeepSeek 的提交元素是 `[role='button'].ds-button--primary`，禁用由 `.ds-button--disabled` 表示；原实现只遍历 `button`，因而无法可靠提交 DeepSeek。Kimi 的 `.send-button-container.disabled` 与现有专用选择器匹配。
- 真实底部点击的 Matomo 事件记录了 5 个发送目标（DeepSeek、Kimi、ChatGLM、通义、豆包），但界面只显示两个小窗口。`selectedBots` 返回全部收藏模型而不是当前插槽模型，导致未挂载 WebView 的官网模型参与发送、放大等待和错误。

- 用户复现：底部发送实际到达官网，但发送迟缓、连续发送不可用，并会打开独立窗口。
- 当前 `web-chat-insert-text` 为每个字符单独调用 `sendInputEvent`，会将长提示的原生输入拆成大量 IPC 往返；应改用 `webContents.insertText(text)` 一次性原生插入。
- 当前仍保留无调用方的 `web-chat-open` / `openWebChatWindow` 独立 `BrowserWindow` 路径；应删除，避免发送流程回退。
- Context7 的 Electron 官方文档确认 Electron 22 起 `<webview>` 的 `new-window` 事件已移除，拦截应改放在主窗口 `did-attach-webview` 上的 `setWindowOpenHandler`，使其在渲染层注册前生效。
- 用户手动回归（`123` 后 `你好`）确认 DeepSeek 的当前面板被切换为全新空会话，而 Kimi 正常保留并回复第二条消息。根因是弹窗拦截器在 `deny` 后仍把弹窗 URL 载入了原 WebView；应只拒绝弹窗，不得重定向当前会话。强制取消 `will-navigate` 也没有必要，会干扰官网自身的同框导航。
- 纯 `deny` 热重启后，用户仍观察到相同行为，但主进程没有记录 `did-attach-webview` 阶段的弹窗拦截。此前 `web-chat-register` 已被实际日志证实可到达，因此在注册路径再次安装纯 `deny` 处理器，作为实际内容页的确定性保护并提供 provider/webContents ID 诊断日志。

## 2026-07-12 当前发送阻断

- 用户最新截图中的“没有可用的 API 模型”只由 `usePromptEnhance.enhancePrompt()` 抛出，触发入口是底部的提示词润色图标；它不是 DeepSeek/Kimi 官网发送错误。
- 修复发送目标集时，Footer 的 `selectedBots` 引入了两个实现错误：`slotCount` 未由 `App.vue` 传入，导致循环次数为零、发送目标始终为空；收藏项包装对象也没有 `getClassname()` 方法。前者解释了截图中“发送到”按钮变灰及完全不派发。
- `EmptyModelSlots.vue` 使用 `columns` 作为实际可见槽数量。Footer 必须接收同一数值并按相同的 assigned/unassigned 规则过滤发送目标，才能只派发给可见小窗口。

## 2026-07-12 Kimi F12 提交验证

- 首次统一底部发送的运行态结果：DeepSeek 的输入清空、发送控件禁用并显示回复；从根地址变为 `/a/chat/s/<uuid>` 是空白入口提交首条消息时官网创建会话，不是 Electron 新窗口。第二条必须在该 URL 不变的前提下验证。
- 同一轮中 Kimi 的 `.chat-input-editor` 仍保留文本，`.send-button-container` 保持启用，证明此前 `sendButton.click()` 没有让官网提交。
- DevTools 检查显示 Kimi 发送控件是无语义的 `div.send-button-container`，内部仅有 SVG。CDP `Input.dispatchMouseEvent` 在该元素中心发出可信的鼠标按下/松开后，Kimi 编辑器清空、容器改为 `disabled`，页面展示了用户消息。这证实 Kimi 忽略脚本合成的 `click()`，但接受原生鼠标输入。
- Context7 的 Electron 官方文档确认 `webContents.sendInputEvent` 支持带 `x`、`y`、`button`、`clickCount` 的 `mouseDown` / `mouseUp`，且包含窗口需聚焦。正式修复使用该 API，并只对 Kimi 已验证的发送图标坐标调用。

## 2026-07-12 Kimi 原生点击路径复核

- Kimi WebView 的 `devicePixelRatio` 是 `1.5`，但以 CSS 坐标 `(545, 261)` 调用新 `web-chat-click` 仍在目标元素上产生 `isTrusted: true` 的 `mousedown`、`mouseup`、`click`，随后输入框清空、发送按钮禁用。坐标缩放不是本次失败原因。
- 失败根因在 `KimiWebBot._sendPrompt()`：计算点击坐标的第二段 `executeJavaScript` 引用了第一段独立执行上下文里的局部 `input`，触发点击前的引用错误；随后确认逻辑还读取 `textarea.textContent`，该字段对有值的 textarea 也为空，可能把未提交误判为成功。
- 修复要求：在每一段注入脚本内重新定位输入框；确认提交时对 textarea 使用 `.value`、对 contenteditable 使用 `.textContent`，并直接检查 Kimi 的原始 `.send-button-container.disabled` 状态。

## 2026-07-12 DeepSeek 会话切换待隔离验证

- 第二条底部发送后，DevTools 曾观察到 DeepSeek 从旧会话 URL 切到新 `/a/chat/s/<uuid>`，该条消息确已提交并显示回复；其后又在 Kimi 代码热更新期间回到根地址。热更新会重建页面和 WebView，不能用这次回根地址事件判断发送行为。
- `ChatMessages.vue` 不会因消息写入改变 `loading`，但每次 `Chats.table.update` 会更新 `currentChat`。`EmptyModelSlots.vue` 对 `favoriteBots` 的引用变化会执行 `syncCardWebviews()`，需要在无 HMR 的单次发送中同时记录 WebView ID、`src` 属性和 DeepSeek CDP 导航事件，才能区分前端重建与官网新建会话。

## 2026-07-12 官网 F12 连续对话基准

- DeepSeek 官网：先聚焦官方 WebView，再用 CDP `Input.insertText` 写入 textarea，随后在实际发送图标中心发出可信 `mousePressed` / `mouseReleased`。在既有 `/a/chat/s/09a4893c-a739-4b98-92f9-baed34a99e97` 会话中连续发送 `F12-DeepSeek-A`、`F12-DeepSeek-B` 后，URL 始终不变，输入每次清空，两条消息均出现在该页面。
- Kimi 官网：同样使用原生文本输入和可信鼠标点击。在既有 `/chat/19f5576f-5932-8775-8000-09e797a54b14` 会话中连续发送 `F12-Kimi-A`、`F12-Kimi-B` 后，URL 不变，编辑器清空，`.send-button-container` 每次进入 `disabled`，两条消息均出现在同一页面。
- 对照 ChatALL：DeepSeek 适配器仍使用 DOM `sendButton.click()`；官网基准使用可信鼠标事件。因此 DeepSeek 改为与 Kimi 相同的“计算受限发送控件中心坐标 -> `web-chat-click` 原生点击 -> 等待输入清空”流程。该更改不改变任何 URL、WebView 或窗口逻辑。

## 2026-07-12 WebView 重建根因

- ChatALL 底部首条发送前的 DeepSeek/Kimi CDP target ID 分别为 `CF02...` / `19F8...`；发送后变为 `7BD1...` / `8885...`。两个 WebView 均被重新创建，而不是在原 WebView 内导航。
- 主页面 F12 证明 Electron `<webview>` 的 `src` 属性会自动同步为当前官网会话 URL：DeepSeek 为 `https://chat.deepseek.com/a/chat/s/703880bd-...`，Kimi 为 `https://www.kimi.com/chat/19f55839-...`。这不再是初始化时的根地址。
- `EmptyModelSlots.ensureCardWebview()` 以 `existing.getAttribute("src") === initialUrl` 判断是否复用。消息写入使 Dexie 的 current chat 更新，`favoriteBots` watcher 随即运行；动态 `src` 不等于根地址，故两个 WebView 被销毁并以根地址重建，造成“每条消息一个新会话/窗口”。
- 修复：将复用身份改为槽内稳定的 provider ID（`data-provider-id`）。只要同一槽仍是同一官网模型，保留当前 WebView 和当前官网会话 URL；更换模型时才移除并创建。

## 2026-07-12 ChatGLM F12 适配

- 用户报告 GLM 底部消息只写入、不发送。当前官网真实输入是 `textarea.scroll-display-none`，发送目标是 `.enter-icon-container` 内的 `img.enter_icon`；它不是 button，也没有 role，因此原通用 `button/[role=button]` 扫描必然找不到。
- 官网 F12 以原生聚焦、文本输入和可信鼠标点击验证：首条 `123GLM-F12-1` 创建 `cid=6a5359b2becaa030e14343a8`，第二条 `GLM-F12-2` 在同一 URL 中提交；每次 textarea 清空，页面包含两条消息。
- `DeepSeekWebBot` 的通用发送器现在在输入编辑器祖先范围内按配置选择器搜寻控件，不再限定为 `button/[role=button]`；仍保留邻近 button 回退。`ChatGLMWebBot` 只提供其经过 F12 验证的输入与发送选择器，最终点击继续走已验证的 `web-chat-click` 可信原生事件。

## 2026-07-12 通义官网入口

- 用户确认通义千问对话官网入口为 `https://chat.qwen.ai/`。现有 `QianWenWebBot` 使用的是旧的 `https://qianwen.aliyun.com/` 根地址，已将登录与对话 URL 同时更新为当前入口；待加载后在该官网 F12 采集发送控件。
- 重新选择同一通义模型时，稳定 provider ID 复用策略会保留旧的 WebView（包括旧域名或错误页面）。底部发送时应保留会话，但用户显式从槽位菜单重新选择模型时应刷新。因此只在 `assignBot()` 的官网模型路径移除该槽位已有 WebView，登录浮层关闭后再用当前 `chat.qwen.ai` URL 创建。

## 2026-07-12 GLM/通义窄屏比例

- 截图中的面板网格宽度正确。F12 显示五家官网初始 WebView 的 viewport 均为 `445x450`、`devicePixelRatio=1.5`、页面 zoom 为 `1`。GLM 和通义只是各自在 445px 下进入窄屏布局，视觉比例显得更大。
- 临时调用 Electron `<webview>.setZoomFactor(0.8)` 后，GLM/通义内部 viewport 变为 `557x562`、`devicePixelRatio=1.2`，外部卡片大小不变；两站均切换到更合适的宽屏响应式布局。此行为已由 Electron 官方 `webview.setZoomFactor()` API 证实。
- 正式方案：仅为 GLM 和通义声明 `_webviewZoomFactor = 0.8`，卡片 WebView 的 `dom-ready` 中设置 zoom。DeepSeek、Kimi、豆包保持 `1`。GLM 发送选择器进一步收紧为 F12 已验证的 `img.enter_icon`。

## 2026-07-12 其他官网连续发送复测

- 已重启 Electron 并通过 `9222` 直接附着真实官网 WebView。GLM、通义、豆包都处于已登录状态，分别为 `chatglm.cn`、`chat.qwen.ai`、`doubao.com`。
- 官网 DOM 复查：GLM 可见输入框仍是 `textarea.scroll-display-none`，提交图标仍是 `img.enter_icon`；通义可见输入框为 `textarea.message-input-textarea`；豆包可见输入框为 `textarea.semi-input-textarea.semi-input-textarea-autosize`。这些是官方页面当前实测结果，不是 ChatALL 的静态选择器推断。
- GLM 和通义当前内部 viewport 均为 `557x562`、DPR `1.2`，确认 `0.8` WebView zoom 已生效；豆包维持 `445x450`、DPR `1.5`。
- GLM 官网连续两消息基准通过：在 target `AE8FE680832C7C869DDBAE4FE3E3B652` 中以可信鼠标聚焦、CDP 原生文本输入、可信鼠标点击 `img.enter_icon` 发送两条唯一消息。首条从入口创建 `cid=6a537a402df45a085b3feb10`；第二条提交后 URL 保持完全相同，输入框两次为空，页面同时包含两条精确测试消息。
- 通义首次官网基准尚不成立：原生输入与 `button.send-button` 可信点击后，页面进入了新的 `/c/<uuid>` URL 且输入框为空，但两条测试文本未出现在 DOM。该现象不能视为已提交，后续测试需同时捕获官网页面的网络请求与用户消息回显。
- 通义网络取证确认真实提交契约：可信点击当前 `button.send-button` 后，官网在同一 `/c/55ba0dd3-5a1c-4153-b513-58d76e52d7a0` 会话发出 `POST /api/v2/chat/completions?chat_id=55ba0dd3-5a1c-4153-b513-58d76e52d7a0`；输入框清空，提交控件变为 `stop-button`。因此该站不能用 DOM 文本回显作为提交确认，应以“输入清空 + 流式停止按钮 + 完成接口请求”确认。
- 通义官网连续两消息基准通过：首条结束后，第二条在相同 target `9D935872751C1801E93D5A5DF8F88BA6` 和同一 `/c/55ba0dd3-5a1c-4153-b513-58d76e52d7a0` URL 中提交；再次观察到 `POST /api/v2/chat/completions`，请求正文包含第二条精确文本，输入框清空并进入 `stop-button` 流式状态。
- 豆包首条官网提交已取证：文本输入后，可信点击 `button#flow-end-msg-send` 使页面从根地址进入 `/chat/38434758710756866`，输入清空且该按钮短暂消失；官网发出 `POST /chat/completion`，请求正文包含精确测试文本。首条创建会话属于官网正常行为，第二条必须保持该 URL。
- 豆包第二条测试因用户草稿保护暂停：首条完成后，textarea 出现已有的未发送文本 `123`；写入第二条测试文本后值为 `123F12-Doubao-连续-2-20260712T1944`，且 `button#flow-end-msg-send` 已启用。为避免清空或替用户提交已有草稿，本轮未点击发送。完成该站两条验证需要用户确认可清空/发送这段已有内容，或由用户先自行处理该草稿。

## 2026-07-12 缩放下的 ChatALL 点击坐标

- ChatALL 实际 GLM adapter 回归在“插入文本前”失败；在官网 textarea 注入的 `mousedown`、`focus`、`input` 事件探针均未收到事件，`document.activeElement` 保持 `BODY`。这排除输入框受控覆盖或发送选择器问题。
- 根因是 GLM/通义卡片以 `0.8` WebView zoom 显示：官网 DOM `getBoundingClientRect()` 返回放大后的 CSS 坐标，而 Electron `webContents.sendInputEvent` 使用未缩放的卡片内容坐标。先前将 CSS 坐标原样传给 IPC，点击落点偏移，因而后续 `insertText` 没有目标输入框。
- 修复在 `WebChatBot.clickOfficialChat()`：仅将 IPC 鼠标坐标乘以模型的 `_webviewZoomFactor`。GLM/通义为 `0.8`；DeepSeek、Kimi、豆包为默认 `1`，行为不变。
- ChatALL adapter 首条回归通过：GLM 的坐标修正后，测试文本出现在新的 `cid` 会话且 textarea 清空；通义适配器回调无错误、在新 `/c/c5d6...` 会话请求 `POST /api/v2/chat/completions`，正文含精确文本；豆包适配器回调无错误、在新 `/chat/38434830036091650` 会话请求 `POST /chat/completion`，正文含精确文本。三者均由 `FooterBar` 持有的实例调用 `Bot.sendPrompt`，不是手工 CDP 点击。
- 最终底部统一发送回归通过：用户从底部连续发送 `123`、`12345` 后，ChatALL 消息存储为 DeepSeek、Kimi、GLM、通义、豆包分别记录了两轮完成态响应且无错误内容。五个官网 WebView 均同时包含两条文本、输入框为空，且各自保持一个稳定会话 URL：DeepSeek `/a/chat/s/6f4520ec-...`、Kimi `/chat/19f56363-...`、GLM `cid=6a53807347c6ecda860c29fa`、通义 `/c/c5d6bd8e-...`、豆包 `/chat/38434830036091650`。
