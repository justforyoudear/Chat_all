<div align="center">
  <h1>chat_all</h1>
  <p><strong>여러 AI 대화를 비교하는 데스크톱 작업 공간</strong></p>

[Deutsch](README_DE-DE.md) | [English](README.md) | [Espanol](README_ES-ES.md) | [Francais](README_FR-FR.md) | [Italiano](README_IT-IT.md) | [Japanese](README_JA-JP.md) | 한국어 | [Russian](README_RU-RU.md) | [Tieng Viet](README_VI-VN.md) | [Chinese](README_ZH-CN.md)

</div>

## 스크린샷

## 개요

`chat_all`은 같은 프롬프트를 여러 AI 모델에 보내고 한곳에서 결과를 비교하는 Electron 데스크톱 작업 공간입니다. 모델 선택, 대화, 후속 작업은 하나의 로컬 작업 공간에 유지됩니다.

## 기능

- 하나에서 여섯 개 모델 패널의 응답을 비교합니다.
- [DeepSeek](https://chat.deepseek.com/), [Qianwen](https://chat.qwen.ai/), [Kimi](https://kimi.moonshot.cn/), [ChatGLM](https://chatglm.cn/), Doubao 등을 포함한 지원되는 공식 웹 채팅에 내장 로그인 패널로 로그인합니다.
- OpenAI, Azure OpenAI, Anthropic, Google, Cohere, Groq, xAI, Baidu 및 OpenAI 호환 엔드포인트의 API 모델을 설정합니다.
- 프롬프트를 개선하고 텍스트 또는 코드 파일을 문맥으로 첨부하며, 설정된 OpenAI API 모델로 이미지를 생성합니다.
- 선택한 응답의 빠른 요약을 만들거나 합의점과 차이점을 분석합니다.
- 대화, 프롬프트, 설정을 로컬에 저장하고 여러 대화, 레이아웃, 프록시 설정을 관리합니다.

## 공식 웹 로그인

다음 제공업체는 내장 공식 웹 작업 공간에서 사용할 수 있습니다. 계획 항목은 원 프로젝트의 웹 접속 범위를 따르며 현재는 사용할 수 없습니다.

| 제공업체                                                                       | URL                                                                | 공식 웹 로그인 | 상태                       |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | -------------- | -------------------------- |
| [DeepSeek](https://chat.deepseek.com/)                                         | <https://chat.deepseek.com/>                                       | 지원됨         | 내장 공식 웹 작업 공간     |
| [Qianwen](https://chat.qwen.ai/)                                               | <https://chat.qwen.ai/>                                            | 지원됨         | 내장 공식 웹 작업 공간     |
| [Kimi](https://kimi.moonshot.cn/)                                              | <https://kimi.moonshot.cn/>                                        | 지원됨         | 내장 공식 웹 작업 공간     |
| [ChatGLM](https://chatglm.cn/)                                                 | <https://chatglm.cn/>                                              | 지원됨         | 내장 공식 웹 작업 공간     |
| [Doubao](https://www.doubao.com/chat/)                                         | <https://www.doubao.com/chat/>                                     | 지원됨         | 내장 공식 웹 작업 공간     |
| [360 AI Brain](https://ai.360.cn/)                                             | <https://ai.360.cn/>                                               | 계획됨         | 이전 웹 접속 범위          |
| [Character.AI](https://character.ai/)                                          | <https://character.ai/>                                            | 계획됨         | 이전 웹 접속 범위          |
| [ChatGPT](https://chatgpt.com/)                                                | <https://chatgpt.com/>                                             | 계획됨         | 이전 웹 접속 범위          |
| [Claude](https://www.anthropic.com/claude)                                     | <https://www.anthropic.com/claude>                                 | 계획됨         | 이전 웹 접속 범위          |
| [Code Llama](https://ai.meta.com/blog/code-llama-large-language-model-coding/) | <https://ai.meta.com/blog/code-llama-large-language-model-coding/> | 계획됨         | 이전 웹 접속 범위          |
| [Copilot](https://copilot.microsoft.com/)                                      | <https://copilot.microsoft.com/>                                   | 계획됨         | 이전 웹 접속 범위          |
| [Dedao Learning Assistant](https://ai.dedao.cn/)                               | <https://ai.dedao.cn/>                                             | 계획됨         | 이전에 계획된 웹 접속 범위 |
| [Falcon 180B](https://huggingface.co/tiiuae/falcon-180b-chat)                  | <https://huggingface.co/tiiuae/falcon-180b-chat>                   | 계획됨         | 이전 웹 접속 범위          |
| [Gemini](https://gemini.google.com/)                                           | <https://gemini.google.com/>                                       | 계획됨         | 이전 웹 접속 범위          |
| [Gemma 2B & 7B](https://blog.google/technology/developers/gemma-open-models/)  | <https://blog.google/technology/developers/gemma-open-models/>     | 계획됨         | 이전 웹 접속 범위          |
| [Gradio](https://gradio.app/)                                                  | <https://gradio.app/>                                              | 계획됨         | 이전 웹 접속 범위          |
| [HuggingChat](https://huggingface.co/chat/)                                    | <https://huggingface.co/chat/>                                     | 계획됨         | 이전 웹 접속 범위          |
| [iFLYTEK SPARK](http://xinghuo.xfyun.cn/)                                      | <http://xinghuo.xfyun.cn/>                                         | 계획됨         | 이전 웹 접속 범위          |
| [Llama 2](https://ai.meta.com/llama/)                                          | <https://ai.meta.com/llama/>                                       | 계획됨         | 이전 웹 접속 범위          |
| [MOSS](https://moss.fastnlp.top/)                                              | <https://moss.fastnlp.top/>                                        | 계획됨         | 이전 웹 접속 범위          |
| [Perplexity](https://www.perplexity.ai/)                                       | <https://www.perplexity.ai/>                                       | 계획됨         | 이전 웹 접속 범위          |
| [Phind](https://www.phind.com/)                                                | <https://www.phind.com/>                                           | 계획됨         | 이전 웹 접속 범위          |
| [Pi](https://pi.ai/)                                                           | <https://pi.ai/>                                                   | 계획됨         | 이전 웹 접속 범위          |
| [Poe](https://poe.com/)                                                        | <https://poe.com/>                                                 | 계획됨         | 이전 웹 접속 범위          |
| [SkyWork](https://neice.tiangong.cn/)                                          | <https://neice.tiangong.cn/>                                       | 계획됨         | 이전 웹 접속 범위          |
| [Vicuna](https://lmsys.org/blog/2023-03-30-vicuna/)                            | <https://lmsys.org/blog/2023-03-30-vicuna/>                        | 계획됨         | 이전 웹 접속 범위          |
| [WizardLM](https://github.com/nlpxucan/WizardLM)                               | <https://github.com/nlpxucan/WizardLM>                             | 계획됨         | 이전 웹 접속 범위          |
| [YouChat](https://you.com/)                                                    | <https://you.com/>                                                 | 계획됨         | 이전 웹 접속 범위          |
| [You](https://you.com/)                                                        | <https://you.com/>                                                 | 계획됨         | 이전 웹 접속 범위          |
| [Zephyr](https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat)              | <https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat>          | 계획됨         | 이전 웹 접속 범위          |

## 시작하기

1. `chat_all`을 시작하고 각 비교 패널의 모델을 선택합니다.
2. 공식 웹 모델은 내장 로그인 패널에서 로그인합니다. API 모델은 설정에서 자격 증명을 추가합니다.
3. 프롬프트를 입력하고 선택한 패널로 보냅니다.
4. 응답을 나란히 검토하고 필요할 때 요약하거나 분석합니다.

사용하는 모델에 유효한 계정 또는 API 키와 해당 서비스의 네트워크 연결이 필요합니다.

## 개인정보

대화, 설정, 자격 증명은 컴퓨터에 로컬로 저장됩니다. 채팅 데이터를 내보낼 때 API 키는 포함되지 않습니다.

## 개발 및 빌드

Node.js 20을 사용합니다.

```bash
npm install
npm run electron:serve
```

현재 플랫폼용 데스크톱 패키지를 빌드합니다.

```bash
npm run electron:build
```

## 피드백

버그 또는 기능 요청은 [GitHub Issues](https://github.com/justforyoudear/Chat_all/issues)에 알려 주세요.

## 후원
