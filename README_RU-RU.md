<div align="center">
  <h1>chat_all</h1>
  <p><strong>Настольное рабочее пространство для сравнения диалогов с ИИ</strong></p>

[Deutsch](README_DE-DE.md) | [English](README.md) | [Espanol](README_ES-ES.md) | [Francais](README_FR-FR.md) | [Italiano](README_IT-IT.md) | [Japanese](README_JA-JP.md) | [Korean](README_KO-KR.md) | Русский | [Tieng Viet](README_VI-VN.md) | [Chinese](README_ZH-CN.md)

</div>

## Скриншот

## Обзор

`chat_all` - это настольное рабочее пространство Electron, которое отправляет один запрос нескольким моделям ИИ и позволяет сравнить результаты в одном месте. Выбор моделей, диалоги и последующая работа сохраняются в локальном рабочем пространстве.

## Возможности

- Сравнение ответов в одном-шести панелях моделей.
- Вход в поддерживаемые официальные веб-чаты, включая [DeepSeek](https://chat.deepseek.com/), [Qianwen](https://chat.qwen.ai/), [Kimi](https://kimi.moonshot.cn/), [ChatGLM](https://chatglm.cn/) и Doubao.
- Настройка API-моделей OpenAI, Azure OpenAI, Anthropic, Google, Cohere, Groq, xAI, Baidu и OpenAI-совместимых конечных точек.
- Улучшение запросов, прикрепление текстовых или кодовых файлов как контекста и создание изображений настроенной моделью OpenAI API.
- Быстрое резюме или анализ согласия и различий между выбранными ответами.
- Локальное сохранение диалогов, запросов и настроек; управление несколькими диалогами, макетами и прокси.

## Официальный веб-вход

Следующие провайдеры доступны во встроенном официальном веб-пространстве. Планируемые записи повторяют область веб-доступа исходного проекта и пока недоступны.

| Провайдер                                                                      | URL                                                                | Официальный веб-вход | Статус                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | -------------------- | --------------------------------------- |
| [DeepSeek](https://chat.deepseek.com/)                                         | <https://chat.deepseek.com/>                                       | Поддерживается       | Встроенное официальное веб-пространство |
| [Qianwen](https://chat.qwen.ai/)                                               | <https://chat.qwen.ai/>                                            | Поддерживается       | Встроенное официальное веб-пространство |
| [Kimi](https://kimi.moonshot.cn/)                                              | <https://kimi.moonshot.cn/>                                        | Поддерживается       | Встроенное официальное веб-пространство |
| [ChatGLM](https://chatglm.cn/)                                                 | <https://chatglm.cn/>                                              | Поддерживается       | Встроенное официальное веб-пространство |
| [Doubao](https://www.doubao.com/chat/)                                         | <https://www.doubao.com/chat/>                                     | Поддерживается       | Встроенное официальное веб-пространство |
| [360 AI Brain](https://ai.360.cn/)                                             | <https://ai.360.cn/>                                               | Планируется          | Прежняя область веб-доступа             |
| [Character.AI](https://character.ai/)                                          | <https://character.ai/>                                            | Планируется          | Прежняя область веб-доступа             |
| [ChatGPT](https://chatgpt.com/)                                                | <https://chatgpt.com/>                                             | Планируется          | Прежняя область веб-доступа             |
| [Claude](https://www.anthropic.com/claude)                                     | <https://www.anthropic.com/claude>                                 | Планируется          | Прежняя область веб-доступа             |
| [Code Llama](https://ai.meta.com/blog/code-llama-large-language-model-coding/) | <https://ai.meta.com/blog/code-llama-large-language-model-coding/> | Планируется          | Прежняя область веб-доступа             |
| [Copilot](https://copilot.microsoft.com/)                                      | <https://copilot.microsoft.com/>                                   | Планируется          | Прежняя область веб-доступа             |
| [Dedao Learning Assistant](https://ai.dedao.cn/)                               | <https://ai.dedao.cn/>                                             | Планируется          | Ранее запланированный веб-доступ        |
| [Falcon 180B](https://huggingface.co/tiiuae/falcon-180b-chat)                  | <https://huggingface.co/tiiuae/falcon-180b-chat>                   | Планируется          | Прежняя область веб-доступа             |
| [Gemini](https://gemini.google.com/)                                           | <https://gemini.google.com/>                                       | Планируется          | Прежняя область веб-доступа             |
| [Gemma 2B & 7B](https://blog.google/technology/developers/gemma-open-models/)  | <https://blog.google/technology/developers/gemma-open-models/>     | Планируется          | Прежняя область веб-доступа             |
| [Gradio](https://gradio.app/)                                                  | <https://gradio.app/>                                              | Планируется          | Прежняя область веб-доступа             |
| [HuggingChat](https://huggingface.co/chat/)                                    | <https://huggingface.co/chat/>                                     | Планируется          | Прежняя область веб-доступа             |
| [iFLYTEK SPARK](http://xinghuo.xfyun.cn/)                                      | <http://xinghuo.xfyun.cn/>                                         | Планируется          | Прежняя область веб-доступа             |
| [Llama 2](https://ai.meta.com/llama/)                                          | <https://ai.meta.com/llama/>                                       | Планируется          | Прежняя область веб-доступа             |
| [MOSS](https://moss.fastnlp.top/)                                              | <https://moss.fastnlp.top/>                                        | Планируется          | Прежняя область веб-доступа             |
| [Perplexity](https://www.perplexity.ai/)                                       | <https://www.perplexity.ai/>                                       | Планируется          | Прежняя область веб-доступа             |
| [Phind](https://www.phind.com/)                                                | <https://www.phind.com/>                                           | Планируется          | Прежняя область веб-доступа             |
| [Pi](https://pi.ai/)                                                           | <https://pi.ai/>                                                   | Планируется          | Прежняя область веб-доступа             |
| [Poe](https://poe.com/)                                                        | <https://poe.com/>                                                 | Планируется          | Прежняя область веб-доступа             |
| [SkyWork](https://neice.tiangong.cn/)                                          | <https://neice.tiangong.cn/>                                       | Планируется          | Прежняя область веб-доступа             |
| [Vicuna](https://lmsys.org/blog/2023-03-30-vicuna/)                            | <https://lmsys.org/blog/2023-03-30-vicuna/>                        | Планируется          | Прежняя область веб-доступа             |
| [WizardLM](https://github.com/nlpxucan/WizardLM)                               | <https://github.com/nlpxucan/WizardLM>                             | Планируется          | Прежняя область веб-доступа             |
| [YouChat](https://you.com/)                                                    | <https://you.com/>                                                 | Планируется          | Прежняя область веб-доступа             |
| [You](https://you.com/)                                                        | <https://you.com/>                                                 | Планируется          | Прежняя область веб-доступа             |
| [Zephyr](https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat)              | <https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat>          | Планируется          | Прежняя область веб-доступа             |

## Начало работы

1. Запустите `chat_all` и выберите модель для каждой панели сравнения.
2. Для официальной веб-модели войдите во встроенной панели. Для API-модели добавьте учетные данные в настройках.
3. Введите запрос и отправьте его в выбранные панели.
4. Просмотрите ответы рядом и при необходимости создайте резюме или выполните анализ.

Для используемых моделей нужны действующая учетная запись или API-ключ и сетевой доступ к соответствующему сервису.

## Конфиденциальность

Диалоги, настройки и учетные данные хранятся локально на компьютере. API-ключи не включаются в экспортируемые данные чатов.

## Разработка и сборка

Используйте Node.js 20.

```bash
npm install
npm run electron:serve
```

Соберите настольный пакет для текущей платформы:

```bash
npm run electron:build
```

## Обратная связь

Сообщайте об ошибках и предлагайте функции в [GitHub Issues](https://github.com/justforyoudear/Chat_all/issues).

## Поддержать
