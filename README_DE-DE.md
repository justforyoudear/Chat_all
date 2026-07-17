<div align="center">
  <h1>AI Chat Hub</h1>
  <p><strong>Ein Desktop-Arbeitsbereich zum Vergleichen von KI-Gesprachen</strong></p>

Deutsch | [English](README.md) | [Espanol](README_ES-ES.md) | [Francais](README_FR-FR.md) | [Italiano](README_IT-IT.md) | [Japanese](README_JA-JP.md) | [Korean](README_KO-KR.md) | [Russian](README_RU-RU.md) | [Tieng Viet](README_VI-VN.md) | [Chinese](README_ZH-CN.md)

</div>

## Produktubersicht

`AI Chat Hub` ist ein Electron-Desktop-Arbeitsbereich, der dieselbe Eingabe an mehrere KI-Modelle sendet und ihre Ergebnisse an einer Stelle vergleichbar macht. Modellauswahl, Gesprache und die weitere Arbeit bleiben lokal zusammen.

![AI Chat Hub Arbeitsbereich mit mehreren Modellen](screenshots/ai-chat-hub-workspace.png)

## Funktionen

- Antworten in ein bis sechs Modellbereichen vergleichen.
- Sich bei unterstutzten offiziellen Web-Chats anmelden, darunter [DeepSeek](https://chat.deepseek.com/), [Qianwen](https://chat.qwen.ai/), [Kimi](https://kimi.moonshot.cn/), [ChatGLM](https://chatglm.cn/) und Doubao.
- API-Modelle von OpenAI, Azure OpenAI, Anthropic, Google, Cohere, Groq, xAI, Baidu und OpenAI-kompatiblen Endpunkten konfigurieren.
- Prompts verbessern, Text- oder Codedateien als Kontext anhangen und mit einem konfigurierten OpenAI-API-Modell Bilder erzeugen.
- Eine Kurzfassung erzeugen oder Konsens und Unterschiede zwischen ausgewahlten Antworten analysieren.
- Gesprache, Prompts und Einstellungen lokal speichern sowie mehrere Gesprache, Layouts und Proxy-Einstellungen verwalten.

## Offizieller Web-Login

Die folgenden Anbieter sind im eingebetteten offiziellen Web-Arbeitsbereich verfugbar. Die geplanten Eintrage entsprechen dem fruheren Webzugriffsbereich des Ursprungsprojekts und sind noch nicht verfugbar.

| Anbieter                                                                       | URL                                                                | Offizieller Web-Login | Status                                       |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | --------------------- | -------------------------------------------- |
| [DeepSeek](https://chat.deepseek.com/)                                         | <https://chat.deepseek.com/>                                       | Unterstutzt           | Eingebetteter offizieller Web-Arbeitsbereich |
| [Qianwen](https://chat.qwen.ai/)                                               | <https://chat.qwen.ai/>                                            | Unterstutzt           | Eingebetteter offizieller Web-Arbeitsbereich |
| [Kimi](https://kimi.moonshot.cn/)                                              | <https://kimi.moonshot.cn/>                                        | Unterstutzt           | Eingebetteter offizieller Web-Arbeitsbereich |
| [ChatGLM](https://chatglm.cn/)                                                 | <https://chatglm.cn/>                                              | Unterstutzt           | Eingebetteter offizieller Web-Arbeitsbereich |
| [Doubao](https://www.doubao.com/chat/)                                         | <https://www.doubao.com/chat/>                                     | Unterstutzt           | Eingebetteter offizieller Web-Arbeitsbereich |
| [360 AI Brain](https://ai.360.cn/)                                             | <https://ai.360.cn/>                                               | Geplant               | Fruherer Webzugriffsbereich                  |
| [Character.AI](https://character.ai/)                                          | <https://character.ai/>                                            | Geplant               | Fruherer Webzugriffsbereich                  |
| [ChatGPT](https://chatgpt.com/)                                                | <https://chatgpt.com/>                                             | Geplant               | Fruherer Webzugriffsbereich                  |
| [Claude](https://www.anthropic.com/claude)                                     | <https://www.anthropic.com/claude>                                 | Geplant               | Fruherer Webzugriffsbereich                  |
| [Code Llama](https://ai.meta.com/blog/code-llama-large-language-model-coding/) | <https://ai.meta.com/blog/code-llama-large-language-model-coding/> | Geplant               | Fruherer Webzugriffsbereich                  |
| [Copilot](https://copilot.microsoft.com/)                                      | <https://copilot.microsoft.com/>                                   | Geplant               | Fruherer Webzugriffsbereich                  |
| [Dedao Learning Assistant](https://ai.dedao.cn/)                               | <https://ai.dedao.cn/>                                             | Geplant               | Fruher geplanter Webzugriffsbereich          |
| [Falcon 180B](https://huggingface.co/tiiuae/falcon-180b-chat)                  | <https://huggingface.co/tiiuae/falcon-180b-chat>                   | Geplant               | Fruherer Webzugriffsbereich                  |
| [Gemini](https://gemini.google.com/)                                           | <https://gemini.google.com/>                                       | Geplant               | Fruherer Webzugriffsbereich                  |
| [Gemma 2B & 7B](https://blog.google/technology/developers/gemma-open-models/)  | <https://blog.google/technology/developers/gemma-open-models/>     | Geplant               | Fruherer Webzugriffsbereich                  |
| [Gradio](https://gradio.app/)                                                  | <https://gradio.app/>                                              | Geplant               | Fruherer Webzugriffsbereich                  |
| [HuggingChat](https://huggingface.co/chat/)                                    | <https://huggingface.co/chat/>                                     | Geplant               | Fruherer Webzugriffsbereich                  |
| [iFLYTEK SPARK](http://xinghuo.xfyun.cn/)                                      | <http://xinghuo.xfyun.cn/>                                         | Geplant               | Fruherer Webzugriffsbereich                  |
| [Llama 2](https://ai.meta.com/llama/)                                          | <https://ai.meta.com/llama/>                                       | Geplant               | Fruherer Webzugriffsbereich                  |
| [MOSS](https://moss.fastnlp.top/)                                              | <https://moss.fastnlp.top/>                                        | Geplant               | Fruherer Webzugriffsbereich                  |
| [Perplexity](https://www.perplexity.ai/)                                       | <https://www.perplexity.ai/>                                       | Geplant               | Fruherer Webzugriffsbereich                  |
| [Phind](https://www.phind.com/)                                                | <https://www.phind.com/>                                           | Geplant               | Fruherer Webzugriffsbereich                  |
| [Pi](https://pi.ai/)                                                           | <https://pi.ai/>                                                   | Geplant               | Fruherer Webzugriffsbereich                  |
| [Poe](https://poe.com/)                                                        | <https://poe.com/>                                                 | Geplant               | Fruherer Webzugriffsbereich                  |
| [SkyWork](https://neice.tiangong.cn/)                                          | <https://neice.tiangong.cn/>                                       | Geplant               | Fruherer Webzugriffsbereich                  |
| [Vicuna](https://lmsys.org/blog/2023-03-30-vicuna/)                            | <https://lmsys.org/blog/2023-03-30-vicuna/>                        | Geplant               | Fruherer Webzugriffsbereich                  |
| [WizardLM](https://github.com/nlpxucan/WizardLM)                               | <https://github.com/nlpxucan/WizardLM>                             | Geplant               | Fruherer Webzugriffsbereich                  |
| [YouChat](https://you.com/)                                                    | <https://you.com/>                                                 | Geplant               | Fruherer Webzugriffsbereich                  |
| [You](https://you.com/)                                                        | <https://you.com/>                                                 | Geplant               | Fruherer Webzugriffsbereich                  |
| [Zephyr](https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat)              | <https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat>          | Geplant               | Fruherer Webzugriffsbereich                  |

## Erste Schritte

1. `AI Chat Hub` starten und fur jeden Vergleichsbereich ein Modell auswahlen.
2. Bei offiziellen Web-Modellen im eingebetteten Anmeldefenster anmelden; fur API-Modelle die Zugangsdaten in den Einstellungen eintragen.
3. Eine Eingabe schreiben und an die ausgewahlten Bereiche senden.
4. Antworten nebeneinander prufen und bei Bedarf zusammenfassen oder analysieren.

Fur die verwendeten Modelle sind ein gultiges Konto oder ein API-Schlussel sowie Netzwerkzugang zum jeweiligen Dienst erforderlich.

## Datenschutz

Gesprache, Einstellungen und Zugangsdaten werden lokal auf dem Computer gespeichert. Exportierte Chatdaten enthalten keine API-Schlussel.

## AI Chat Hub ausfuhren

### Aus dem Quellcode starten

Node.js 20 und npm installieren und im Stammverzeichnis des Repositorys ausfuhren:

```bash
npm install
npm run electron:serve
```

Das Terminal muss geoffnet bleiben. Das automatisch gestartete Electron-Fenster verwenden; `http://localhost:8080` im Browser unterstutzt die eingebetteten offiziellen Chatseiten nicht.

### Windows-EXE starten

1. Die Windows-Installer-`.exe` herunterladen oder mit dem folgenden Befehl erstellen. Lokale Builds liegen unter `dist_electron/`.
2. Die `.exe` doppelt anklicken und dem Installationsassistenten folgen.
3. Die App uber Desktop-Verknupfung, Startmenu oder Installationsordner starten.

Lokale Builds sind nicht signiert. Eine SmartScreen-Warnung nur uber **Weitere Informationen > Trotzdem ausfuhren** bestatigen, wenn die Quelle vertrauenswurdig ist.

### Installer erstellen

Desktop-Paket fur die aktuelle Plattform erstellen:

```bash
npm run electron:build
```

## Feedback

Fehler und Funktionswunsche bitte in [GitHub Issues](https://github.com/justforyoudear/Chat_all/issues) melden.

## Sponsor
