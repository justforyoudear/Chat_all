<div align="center">
  <h1>chat_all</h1>
  <p><strong>Un espace de travail de bureau pour comparer des conversations IA</strong></p>

[Deutsch](README_DE-DE.md) | [English](README.md) | [Espanol](README_ES-ES.md) | Francais | [Italiano](README_IT-IT.md) | [Japanese](README_JA-JP.md) | [Korean](README_KO-KR.md) | [Russian](README_RU-RU.md) | [Tieng Viet](README_VI-VN.md) | [Chinese](README_ZH-CN.md)

</div>

## Capture d'ecran

## Presentation

`chat_all` est un espace de travail Electron qui envoie une meme demande a plusieurs modeles d'IA et permet de comparer leurs resultats au meme endroit. La selection des modeles, les conversations et le travail de suivi restent dans un espace local.

## Fonctionnalites

- Comparez des reponses dans un a six panneaux de modeles.
- Connectez-vous aux chats web officiels pris en charge, notamment [DeepSeek](https://chat.deepseek.com/), [Qianwen](https://chat.qwen.ai/), [Kimi](https://kimi.moonshot.cn/), [ChatGLM](https://chatglm.cn/) et Doubao.
- Configurez des modeles API d'OpenAI, Azure OpenAI, Anthropic, Google, Cohere, Groq, xAI, Baidu et des points de terminaison compatibles OpenAI.
- Ameliorez les invites, joignez des fichiers texte ou de code comme contexte et generez des images avec un modele API OpenAI configure.
- Produisez un resume rapide ou analysez les consensus et les differences entre les reponses selectionnees.
- Enregistrez localement les conversations, les invites et les reglages; gerez plusieurs conversations, dispositions et reglages proxy.

## Connexion web officielle

Les fournisseurs suivants sont disponibles dans l'espace web officiel integre. Les entrees prevues reprennent le perimetre d'acces web du projet source et ne sont pas encore disponibles.

| Fournisseur                                                                    | URL                                                                | Connexion web officielle | Statut                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------ | ----------------------------- |
| [DeepSeek](https://chat.deepseek.com/)                                         | <https://chat.deepseek.com/>                                       | Pris en charge           | Espace web officiel integre   |
| [Qianwen](https://chat.qwen.ai/)                                               | <https://chat.qwen.ai/>                                            | Pris en charge           | Espace web officiel integre   |
| [Kimi](https://kimi.moonshot.cn/)                                              | <https://kimi.moonshot.cn/>                                        | Pris en charge           | Espace web officiel integre   |
| [ChatGLM](https://chatglm.cn/)                                                 | <https://chatglm.cn/>                                              | Pris en charge           | Espace web officiel integre   |
| [Doubao](https://www.doubao.com/chat/)                                         | <https://www.doubao.com/chat/>                                     | Pris en charge           | Espace web officiel integre   |
| [360 AI Brain](https://ai.360.cn/)                                             | <https://ai.360.cn/>                                               | Prevu                    | Ancien perimetre d'acces web  |
| [Character.AI](https://character.ai/)                                          | <https://character.ai/>                                            | Prevu                    | Ancien perimetre d'acces web  |
| [ChatGPT](https://chatgpt.com/)                                                | <https://chatgpt.com/>                                             | Prevu                    | Ancien perimetre d'acces web  |
| [Claude](https://www.anthropic.com/claude)                                     | <https://www.anthropic.com/claude>                                 | Prevu                    | Ancien perimetre d'acces web  |
| [Code Llama](https://ai.meta.com/blog/code-llama-large-language-model-coding/) | <https://ai.meta.com/blog/code-llama-large-language-model-coding/> | Prevu                    | Ancien perimetre d'acces web  |
| [Copilot](https://copilot.microsoft.com/)                                      | <https://copilot.microsoft.com/>                                   | Prevu                    | Ancien perimetre d'acces web  |
| [Dedao Learning Assistant](https://ai.dedao.cn/)                               | <https://ai.dedao.cn/>                                             | Prevu                    | Ancien perimetre web planifie |
| [Falcon 180B](https://huggingface.co/tiiuae/falcon-180b-chat)                  | <https://huggingface.co/tiiuae/falcon-180b-chat>                   | Prevu                    | Ancien perimetre d'acces web  |
| [Gemini](https://gemini.google.com/)                                           | <https://gemini.google.com/>                                       | Prevu                    | Ancien perimetre d'acces web  |
| [Gemma 2B & 7B](https://blog.google/technology/developers/gemma-open-models/)  | <https://blog.google/technology/developers/gemma-open-models/>     | Prevu                    | Ancien perimetre d'acces web  |
| [Gradio](https://gradio.app/)                                                  | <https://gradio.app/>                                              | Prevu                    | Ancien perimetre d'acces web  |
| [HuggingChat](https://huggingface.co/chat/)                                    | <https://huggingface.co/chat/>                                     | Prevu                    | Ancien perimetre d'acces web  |
| [iFLYTEK SPARK](http://xinghuo.xfyun.cn/)                                      | <http://xinghuo.xfyun.cn/>                                         | Prevu                    | Ancien perimetre d'acces web  |
| [Llama 2](https://ai.meta.com/llama/)                                          | <https://ai.meta.com/llama/>                                       | Prevu                    | Ancien perimetre d'acces web  |
| [MOSS](https://moss.fastnlp.top/)                                              | <https://moss.fastnlp.top/>                                        | Prevu                    | Ancien perimetre d'acces web  |
| [Perplexity](https://www.perplexity.ai/)                                       | <https://www.perplexity.ai/>                                       | Prevu                    | Ancien perimetre d'acces web  |
| [Phind](https://www.phind.com/)                                                | <https://www.phind.com/>                                           | Prevu                    | Ancien perimetre d'acces web  |
| [Pi](https://pi.ai/)                                                           | <https://pi.ai/>                                                   | Prevu                    | Ancien perimetre d'acces web  |
| [Poe](https://poe.com/)                                                        | <https://poe.com/>                                                 | Prevu                    | Ancien perimetre d'acces web  |
| [SkyWork](https://neice.tiangong.cn/)                                          | <https://neice.tiangong.cn/>                                       | Prevu                    | Ancien perimetre d'acces web  |
| [Vicuna](https://lmsys.org/blog/2023-03-30-vicuna/)                            | <https://lmsys.org/blog/2023-03-30-vicuna/>                        | Prevu                    | Ancien perimetre d'acces web  |
| [WizardLM](https://github.com/nlpxucan/WizardLM)                               | <https://github.com/nlpxucan/WizardLM>                             | Prevu                    | Ancien perimetre d'acces web  |
| [YouChat](https://you.com/)                                                    | <https://you.com/>                                                 | Prevu                    | Ancien perimetre d'acces web  |
| [You](https://you.com/)                                                        | <https://you.com/>                                                 | Prevu                    | Ancien perimetre d'acces web  |
| [Zephyr](https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat)              | <https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat>          | Prevu                    | Ancien perimetre d'acces web  |

## Demarrage

1. Lancez `chat_all` et choisissez un modele pour chaque panneau de comparaison.
2. Pour un modele web officiel, connectez-vous dans son panneau integre. Pour un modele API, ajoutez les identifiants dans les Reglages.
3. Saisissez une demande et envoyez-la aux panneaux selectionnes.
4. Examinez les reponses cote a cote, puis resumez-les ou analysez-les si necessaire.

Vous avez besoin d'un compte valide ou d'une cle API pour les modeles utilises, ainsi que d'un acces reseau au service concerne.

## Confidentialite

Les conversations, reglages et identifiants sont conserves localement sur votre ordinateur. Les cles API ne sont pas incluses dans les donnees de chat exportees.

## Developpement et build

Utilisez Node.js 20.

```bash
npm install
npm run electron:serve
```

Construisez un paquet de bureau pour la plateforme actuelle :

```bash
npm run electron:build
```

## Commentaires

Signalez les anomalies ou demandez des fonctions dans [GitHub Issues](https://github.com/justforyoudear/Chat_all/issues).

## Sponsor
