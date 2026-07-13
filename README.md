<div align="center">
  <h1>chat_all</h1>
  <p><strong>One desktop workspace for comparing AI conversations</strong></p>

[Deutsch](README_DE-DE.md) | English | [Espanol](README_ES-ES.md) | [Francais](README_FR-FR.md) | [Italiano](README_IT-IT.md) | [Japanese](README_JA-JP.md) | [Korean](README_KO-KR.md) | [Russian](README_RU-RU.md) | [Tieng Viet](README_VI-VN.md) | [Chinese](README_ZH-CN.md)

</div>

## Screenshot

## Overview

`chat_all` is an Electron desktop workspace for sending a prompt to several AI models and comparing their results in one place. It keeps model selection, conversations, and follow-up work in a single local workspace.

## Features

- Compare responses in one to six model panels.
- Sign in to supported official web chats, including [DeepSeek](https://chat.deepseek.com/), [Qianwen](https://chat.qwen.ai/), [Kimi](https://kimi.moonshot.cn/), [ChatGLM](https://chatglm.cn/), and Doubao.
- Configure API models from OpenAI, Azure OpenAI, Anthropic, Google, Cohere, Groq, xAI, Baidu, and OpenAI-compatible endpoints.
- Improve prompts, attach text or code files as context, and generate images with a configured OpenAI API model.
- Produce a quick summary or analyze consensus and differences across selected responses.
- Save chats, prompts, and settings locally; manage multiple conversations, layouts, and proxy settings.

## Official Web Login

The following providers are available through the embedded official web workspace. The planned entries mirror the former project's web-access scope, but are not currently available.

| Provider                                                                       | URL                                                                | Official web login | Notes                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------ | ------------------------------- |
| [DeepSeek](https://chat.deepseek.com/)                                         | <https://chat.deepseek.com/>                                       | Supported          | Embedded official web workspace |
| [Qianwen](https://chat.qwen.ai/)                                               | <https://chat.qwen.ai/>                                            | Supported          | Embedded official web workspace |
| [Kimi](https://kimi.moonshot.cn/)                                              | <https://kimi.moonshot.cn/>                                        | Supported          | Embedded official web workspace |
| [ChatGLM](https://chatglm.cn/)                                                 | <https://chatglm.cn/>                                              | Supported          | Embedded official web workspace |
| [Doubao](https://www.doubao.com/chat/)                                         | <https://www.doubao.com/chat/>                                     | Supported          | Embedded official web workspace |
| [360 AI Brain](https://ai.360.cn/)                                             | <https://ai.360.cn/>                                               | Planned            | Former web-access scope         |
| [Character.AI](https://character.ai/)                                          | <https://character.ai/>                                            | Planned            | Former web-access scope         |
| [ChatGPT](https://chatgpt.com/)                                                | <https://chatgpt.com/>                                             | Planned            | Former web-access scope         |
| [Claude](https://www.anthropic.com/claude)                                     | <https://www.anthropic.com/claude>                                 | Planned            | Former web-access scope         |
| [Code Llama](https://ai.meta.com/blog/code-llama-large-language-model-coding/) | <https://ai.meta.com/blog/code-llama-large-language-model-coding/> | Planned            | Former web-access scope         |
| [Copilot](https://copilot.microsoft.com/)                                      | <https://copilot.microsoft.com/>                                   | Planned            | Former web-access scope         |
| [Dedao Learning Assistant](https://ai.dedao.cn/)                               | <https://ai.dedao.cn/>                                             | Planned            | Former planned web-access scope |
| [Falcon 180B](https://huggingface.co/tiiuae/falcon-180b-chat)                  | <https://huggingface.co/tiiuae/falcon-180b-chat>                   | Planned            | Former web-access scope         |
| [Gemini](https://gemini.google.com/)                                           | <https://gemini.google.com/>                                       | Planned            | Former web-access scope         |
| [Gemma 2B & 7B](https://blog.google/technology/developers/gemma-open-models/)  | <https://blog.google/technology/developers/gemma-open-models/>     | Planned            | Former web-access scope         |
| [Gradio](https://gradio.app/)                                                  | <https://gradio.app/>                                              | Planned            | Former web-access scope         |
| [HuggingChat](https://huggingface.co/chat/)                                    | <https://huggingface.co/chat/>                                     | Planned            | Former web-access scope         |
| [iFLYTEK SPARK](http://xinghuo.xfyun.cn/)                                      | <http://xinghuo.xfyun.cn/>                                         | Planned            | Former web-access scope         |
| [Llama 2](https://ai.meta.com/llama/)                                          | <https://ai.meta.com/llama/>                                       | Planned            | Former web-access scope         |
| [MOSS](https://moss.fastnlp.top/)                                              | <https://moss.fastnlp.top/>                                        | Planned            | Former web-access scope         |
| [Perplexity](https://www.perplexity.ai/)                                       | <https://www.perplexity.ai/>                                       | Planned            | Former web-access scope         |
| [Phind](https://www.phind.com/)                                                | <https://www.phind.com/>                                           | Planned            | Former web-access scope         |
| [Pi](https://pi.ai/)                                                           | <https://pi.ai/>                                                   | Planned            | Former web-access scope         |
| [Poe](https://poe.com/)                                                        | <https://poe.com/>                                                 | Planned            | Former web-access scope         |
| [SkyWork](https://neice.tiangong.cn/)                                          | <https://neice.tiangong.cn/>                                       | Planned            | Former web-access scope         |
| [Vicuna](https://lmsys.org/blog/2023-03-30-vicuna/)                            | <https://lmsys.org/blog/2023-03-30-vicuna/>                        | Planned            | Former web-access scope         |
| [WizardLM](https://github.com/nlpxucan/WizardLM)                               | <https://github.com/nlpxucan/WizardLM>                             | Planned            | Former web-access scope         |
| [YouChat](https://you.com/)                                                    | <https://you.com/>                                                 | Planned            | Former web-access scope         |
| [You](https://you.com/)                                                        | <https://you.com/>                                                 | Planned            | Former web-access scope         |
| [Zephyr](https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat)              | <https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat>          | Planned            | Former web-access scope         |

## Get Started

1. Launch `chat_all` and choose a model for each comparison panel.
2. For an official web model, sign in in its embedded login panel. For an API model, add its credentials in Settings.
3. Enter a prompt and send it to the selected panels.
4. Review the responses side by side, then summarize or analyze the results when needed.

You need a valid account or API key for the models you use, plus network access to the relevant service.

## Privacy

Chats, settings, and credentials are stored locally on your computer. API keys are not included when exporting chat data.

## Development

Use Node.js 20.

```bash
npm install
npm run electron:serve
```

Build a desktop package for the current platform:

```bash
npm run electron:build
```

## Feedback

Report bugs or feature requests in [GitHub Issues](https://github.com/justforyoudear/Chat_all/issues).

## Sponsor
