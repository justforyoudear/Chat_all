<div align="center">
  <h1>AI Chat Hub</h1>
  <p><strong>在一个桌面工作台中对比多个 AI 对话</strong></p>

[Deutsch](README_DE-DE.md) | [English](README.md) | [Espanol](README_ES-ES.md) | [Francais](README_FR-FR.md) | [Italiano](README_IT-IT.md) | [Japanese](README_JA-JP.md) | [Korean](README_KO-KR.md) | [Russian](README_RU-RU.md) | [Tieng Viet](README_VI-VN.md) | 简体中文

</div>

## 产品介绍

`AI Chat Hub` 是一个 Electron 桌面工作台，可将同一条提示词发送给多个 AI 模型，并在同一界面中比较结果。模型选择、对话和后续处理都保留在一个本地工作区中。

![AI Chat Hub 多模型对话工作台](screenshots/ai-chat-hub-workspace.png)

## 当前能力

- 在一至六个模型面板中并行比较回答。
- 通过内嵌登录面板使用已支持的官方网页聊天，包括 [DeepSeek](https://chat.deepseek.com/)、通义千问、Kimi、ChatGLM 和豆包。
- 配置 OpenAI、Azure OpenAI、Anthropic、Google、Cohere、Groq、xAI、百度，以及 OpenAI 兼容端点的 API 模型。
- 增强提示词、附加文本或代码文件作为上下文，并通过已配置的 OpenAI API 模型生成图像。
- 对选中的回答生成快速摘要，或分析回答之间的共识与差异。
- 将对话、提示词和设置保存在本地，并管理多对话、布局和代理设置。

## 官方网页登录

下表列出内嵌官方网页工作台已支持的服务。计划支持项与原项目的网页接入范围保持一致，但目前尚不可用。

| 服务                                                                           | 网址                                                               | 官网登录 | 说明                     |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | -------- | ------------------------ |
| [DeepSeek](https://chat.deepseek.com/)                                         | <https://chat.deepseek.com/>                                       | 已支持   | 内嵌官方网页工作台       |
| [通义千问](https://chat.qwen.ai/)                                              | <https://chat.qwen.ai/>                                            | 已支持   | 内嵌官方网页工作台       |
| [Kimi](https://kimi.moonshot.cn/)                                              | <https://kimi.moonshot.cn/>                                        | 已支持   | 内嵌官方网页工作台       |
| [ChatGLM](https://chatglm.cn/)                                                 | <https://chatglm.cn/>                                              | 已支持   | 内嵌官方网页工作台       |
| [豆包](https://www.doubao.com/chat/)                                           | <https://www.doubao.com/chat/>                                     | 已支持   | 内嵌官方网页工作台       |
| [360 智脑](https://ai.360.cn/)                                                 | <https://ai.360.cn/>                                               | 计划支持 | 原项目网页接入范围       |
| [Character.AI](https://character.ai/)                                          | <https://character.ai/>                                            | 计划支持 | 原项目网页接入范围       |
| [ChatGPT](https://chatgpt.com/)                                                | <https://chatgpt.com/>                                             | 计划支持 | 原项目网页接入范围       |
| [Claude](https://www.anthropic.com/claude)                                     | <https://www.anthropic.com/claude>                                 | 计划支持 | 原项目网页接入范围       |
| [Code Llama](https://ai.meta.com/blog/code-llama-large-language-model-coding/) | <https://ai.meta.com/blog/code-llama-large-language-model-coding/> | 计划支持 | 原项目网页接入范围       |
| [Copilot](https://copilot.microsoft.com/)                                      | <https://copilot.microsoft.com/>                                   | 计划支持 | 原项目网页接入范围       |
| [得到学习助手](https://ai.dedao.cn/)                                           | <https://ai.dedao.cn/>                                             | 计划支持 | 原项目规划的网页接入范围 |
| [Falcon 180B](https://huggingface.co/tiiuae/falcon-180b-chat)                  | <https://huggingface.co/tiiuae/falcon-180b-chat>                   | 计划支持 | 原项目网页接入范围       |
| [Gemini](https://gemini.google.com/)                                           | <https://gemini.google.com/>                                       | 计划支持 | 原项目网页接入范围       |
| [Gemma 2B & 7B](https://blog.google/technology/developers/gemma-open-models/)  | <https://blog.google/technology/developers/gemma-open-models/>     | 计划支持 | 原项目网页接入范围       |
| [Gradio](https://gradio.app/)                                                  | <https://gradio.app/>                                              | 计划支持 | 原项目网页接入范围       |
| [HuggingChat](https://huggingface.co/chat/)                                    | <https://huggingface.co/chat/>                                     | 计划支持 | 原项目网页接入范围       |
| [讯飞星火](http://xinghuo.xfyun.cn/)                                           | <http://xinghuo.xfyun.cn/>                                         | 计划支持 | 原项目网页接入范围       |
| [Llama 2](https://ai.meta.com/llama/)                                          | <https://ai.meta.com/llama/>                                       | 计划支持 | 原项目网页接入范围       |
| [MOSS](https://moss.fastnlp.top/)                                              | <https://moss.fastnlp.top/>                                        | 计划支持 | 原项目网页接入范围       |
| [Perplexity](https://www.perplexity.ai/)                                       | <https://www.perplexity.ai/>                                       | 计划支持 | 原项目网页接入范围       |
| [Phind](https://www.phind.com/)                                                | <https://www.phind.com/>                                           | 计划支持 | 原项目网页接入范围       |
| [Pi](https://pi.ai/)                                                           | <https://pi.ai/>                                                   | 计划支持 | 原项目网页接入范围       |
| [Poe](https://poe.com/)                                                        | <https://poe.com/>                                                 | 计划支持 | 原项目网页接入范围       |
| [天工](https://neice.tiangong.cn/)                                             | <https://neice.tiangong.cn/>                                       | 计划支持 | 原项目网页接入范围       |
| [Vicuna](https://lmsys.org/blog/2023-03-30-vicuna/)                            | <https://lmsys.org/blog/2023-03-30-vicuna/>                        | 计划支持 | 原项目网页接入范围       |
| [WizardLM](https://github.com/nlpxucan/WizardLM)                               | <https://github.com/nlpxucan/WizardLM>                             | 计划支持 | 原项目网页接入范围       |
| [YouChat](https://you.com/)                                                    | <https://you.com/>                                                 | 计划支持 | 原项目网页接入范围       |
| [You](https://you.com/)                                                        | <https://you.com/>                                                 | 计划支持 | 原项目网页接入范围       |
| [Zephyr](https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat)              | <https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat>          | 计划支持 | 原项目网页接入范围       |

## 开始使用

1. 启动 `AI Chat Hub`，为每个对比面板选择模型。
2. 使用官方网页模型时，在内嵌登录面板完成登录；使用 API 模型时，在设置中填写凭据。
3. 输入提示词并发送到已选面板。
4. 并排查看回答，需要时生成摘要或执行分析。

你需要为所用模型准备有效账号或 API 密钥，并确保可以访问对应服务。

## 隐私

聊天记录、设置和凭据均保存在你的计算机本地。导出对话数据时不会包含 API 密钥。

## 运行 AI Chat Hub

### 从源码启动

先安装 Node.js 20 和 npm，然后在仓库根目录运行：

```bash
npm install
npm run electron:serve
```

使用期间需要保持终端运行。请使用自动打开的 Electron 窗口；直接在浏览器访问 `http://localhost:8080` 无法使用内嵌官方聊天页面。

### 使用 Windows EXE

1. 下载 Windows 安装程序 `.exe`，或者使用下面的命令从源码构建。本地构建产物位于 `dist_electron/`。
2. 双击 `.exe`，按照安装向导完成安装。
3. 从桌面快捷方式、开始菜单或安装目录启动软件。

本地构建的 EXE 未进行数字签名。Windows 可能显示 SmartScreen 提示；仅在确认文件来源可信时选择“更多信息 > 仍要运行”。

### 构建安装包

为当前平台构建桌面安装包：

```bash
npm run electron:build
```

## 反馈

请在 [GitHub Issues](https://github.com/justforyoudear/Chat_all/issues) 提交问题或功能建议。

## 赞助
