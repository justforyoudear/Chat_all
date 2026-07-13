# chat_all README 重写实施计划

> **执行要求：** 按任务顺序实施，每一步完成后验证，再继续下一步。

**目标：** 将十份继承的 README 重写为反映 `chat_all` 当前能力的简洁多语言文档。

**实现方式：** 所有 README 使用相同的信息架构和事实来源，但正文保持各自语言。文档以当前机器人注册表、界面能力和 `package.json` 脚本为唯一依据，不改动产品代码或构建配置。

**技术范围：** Markdown、Git 差异检查、Prettier（仅检查）。

## 全局约束

- 对外名称统一为 `chat_all`。
- 不使用 `ai-shifu/ChatALL` 链接或上游赞助、贡献者、安装渠道内容。
- 每份 README 均保留语言导航、`src/assets/logo-cover.png`、`screenshots/screenshot-1.png` 和最后的赞助标题。
- 不维护静态服务商矩阵；只描述代码确认的接入类别与能力。
- 不修改 `package.json`、`src/`、`vue.config.js` 或许可证文件。

---

### 任务 1：统一十份 README 的信息架构和产品事实

**文件：**
- 修改：`README.md`
- 修改：`README_ZH-CN.md`
- 修改：`README_DE-DE.md`
- 修改：`README_ES-ES.md`
- 修改：`README_FR-FR.md`
- 修改：`README_IT-IT.md`
- 修改：`README_JA-JP.md`
- 修改：`README_KO-KR.md`
- 修改：`README_RU-RU.md`
- 修改：`README_VI-VN.md`

**依赖事实：**
- `src/bots/index.js` 的 `officialWeb` 包含 DeepSeek、通义千问、Kimi、ChatGLM 和豆包。
- 同一注册表包含 API 提供商与自定义 OpenAI 兼容端点。
- 界面支持一至六个模型面板、官方登录、提示词增强、文本文件上下文、图像生成、快速摘要和共识/差异分析。
- `package.json` 提供 `npm run electron:serve`、`npm run electron:build` 和平台发布脚本。

- [ ] 将每份文档的名称和开场白改为 `chat_all` 多模型桌面工作台。
- [ ] 保留现有语言导航、徽标和截图路径，并将 Codespaces、Release、Wiki、上游贡献者和赞助正文全部移除。
- [ ] 以对应语言添加“当前能力”“开始使用”“隐私”“开发与构建”“反馈”章节；将赞助标题作为最后一个空章节保留。
- [ ] 在“当前能力”中准确说明官方网页登录、API/兼容端点、六栏比较、提示词与文件辅助、结果分析与图像生成。
- [ ] 在“开始使用”和“隐私”中说明本地保存、账号/API 密钥和网络连接要求。
- [ ] 使用 `npm install`、`npm run electron:serve`、`npm run electron:build` 和当前仓库 Issue 链接完成开发者与反馈信息。

### 任务 2：验证文档范围和格式

**文件：**
- 验证：上述十份 README

- [ ] 运行 `rg -n "ai-shifu/ChatALL|ChatALL" -g "README*.md" .`，预期无匹配。
- [ ] 验证每份 README 的最后一个二级标题仍是对应语言的赞助标题，且标题后没有正文。
- [ ] 运行 `git diff --check`，预期无行尾空白错误。
- [ ] 在 Node 20 环境中运行 `npx prettier --check` 检查十份 README；如发现原有格式问题，仅报告，不进行无关的全量格式化。
- [ ] 用 `git diff --name-only` 确认改动限定在 README 和本次计划文件。
