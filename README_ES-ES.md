<div align="center">
  <h1>AI Chat Hub</h1>
  <p><strong>Un espacio de escritorio para comparar conversaciones de IA</strong></p>

[Deutsch](README_DE-DE.md) | [English](README.md) | Espanol | [Francais](README_FR-FR.md) | [Italiano](README_IT-IT.md) | [Japanese](README_JA-JP.md) | [Korean](README_KO-KR.md) | [Russian](README_RU-RU.md) | [Tieng Viet](README_VI-VN.md) | [Chinese](README_ZH-CN.md)

</div>

## Presentacion del producto

`AI Chat Hub` es un espacio de escritorio Electron que envia un mismo mensaje a varios modelos de IA y permite comparar sus resultados en un solo lugar. La seleccion de modelos, las conversaciones y el trabajo posterior permanecen en un espacio local.

![Espacio de trabajo multimodelo de AI Chat Hub](screenshots/ai-chat-hub-workspace.png)

## Funciones

- Compara respuestas en uno a seis paneles de modelos.
- Inicia sesion en chats web oficiales compatibles, incluidos [DeepSeek](https://chat.deepseek.com/), [Qianwen](https://chat.qwen.ai/), [Kimi](https://kimi.moonshot.cn/), [ChatGLM](https://chatglm.cn/) y Doubao.
- Configura modelos de API de OpenAI, Azure OpenAI, Anthropic, Google, Cohere, Groq, xAI, Baidu y puntos finales compatibles con OpenAI.
- Mejora mensajes, adjunta archivos de texto o codigo como contexto y genera imagenes con un modelo API de OpenAI configurado.
- Genera un resumen rapido o analiza consensos y diferencias entre las respuestas seleccionadas.
- Guarda localmente conversaciones, mensajes y ajustes; administra varias conversaciones, disenos y configuracion de proxy.

## Inicio de sesion web oficial

Los siguientes proveedores estan disponibles mediante el espacio web oficial integrado. Las entradas planificadas reflejan el alcance de acceso web del proyecto original y aun no estan disponibles.

| Proveedor                                                                      | URL                                                                | Inicio de sesion web oficial | Estado                             |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ---------------------------- | ---------------------------------- |
| [DeepSeek](https://chat.deepseek.com/)                                         | <https://chat.deepseek.com/>                                       | Compatible                   | Espacio web oficial integrado      |
| [Qianwen](https://chat.qwen.ai/)                                               | <https://chat.qwen.ai/>                                            | Compatible                   | Espacio web oficial integrado      |
| [Kimi](https://kimi.moonshot.cn/)                                              | <https://kimi.moonshot.cn/>                                        | Compatible                   | Espacio web oficial integrado      |
| [ChatGLM](https://chatglm.cn/)                                                 | <https://chatglm.cn/>                                              | Compatible                   | Espacio web oficial integrado      |
| [Doubao](https://www.doubao.com/chat/)                                         | <https://www.doubao.com/chat/>                                     | Compatible                   | Espacio web oficial integrado      |
| [360 AI Brain](https://ai.360.cn/)                                             | <https://ai.360.cn/>                                               | Planificado                  | Alcance anterior de acceso web     |
| [Character.AI](https://character.ai/)                                          | <https://character.ai/>                                            | Planificado                  | Alcance anterior de acceso web     |
| [ChatGPT](https://chatgpt.com/)                                                | <https://chatgpt.com/>                                             | Planificado                  | Alcance anterior de acceso web     |
| [Claude](https://www.anthropic.com/claude)                                     | <https://www.anthropic.com/claude>                                 | Planificado                  | Alcance anterior de acceso web     |
| [Code Llama](https://ai.meta.com/blog/code-llama-large-language-model-coding/) | <https://ai.meta.com/blog/code-llama-large-language-model-coding/> | Planificado                  | Alcance anterior de acceso web     |
| [Copilot](https://copilot.microsoft.com/)                                      | <https://copilot.microsoft.com/>                                   | Planificado                  | Alcance anterior de acceso web     |
| [Dedao Learning Assistant](https://ai.dedao.cn/)                               | <https://ai.dedao.cn/>                                             | Planificado                  | Alcance web planeado anteriormente |
| [Falcon 180B](https://huggingface.co/tiiuae/falcon-180b-chat)                  | <https://huggingface.co/tiiuae/falcon-180b-chat>                   | Planificado                  | Alcance anterior de acceso web     |
| [Gemini](https://gemini.google.com/)                                           | <https://gemini.google.com/>                                       | Planificado                  | Alcance anterior de acceso web     |
| [Gemma 2B & 7B](https://blog.google/technology/developers/gemma-open-models/)  | <https://blog.google/technology/developers/gemma-open-models/>     | Planificado                  | Alcance anterior de acceso web     |
| [Gradio](https://gradio.app/)                                                  | <https://gradio.app/>                                              | Planificado                  | Alcance anterior de acceso web     |
| [HuggingChat](https://huggingface.co/chat/)                                    | <https://huggingface.co/chat/>                                     | Planificado                  | Alcance anterior de acceso web     |
| [iFLYTEK SPARK](http://xinghuo.xfyun.cn/)                                      | <http://xinghuo.xfyun.cn/>                                         | Planificado                  | Alcance anterior de acceso web     |
| [Llama 2](https://ai.meta.com/llama/)                                          | <https://ai.meta.com/llama/>                                       | Planificado                  | Alcance anterior de acceso web     |
| [MOSS](https://moss.fastnlp.top/)                                              | <https://moss.fastnlp.top/>                                        | Planificado                  | Alcance anterior de acceso web     |
| [Perplexity](https://www.perplexity.ai/)                                       | <https://www.perplexity.ai/>                                       | Planificado                  | Alcance anterior de acceso web     |
| [Phind](https://www.phind.com/)                                                | <https://www.phind.com/>                                           | Planificado                  | Alcance anterior de acceso web     |
| [Pi](https://pi.ai/)                                                           | <https://pi.ai/>                                                   | Planificado                  | Alcance anterior de acceso web     |
| [Poe](https://poe.com/)                                                        | <https://poe.com/>                                                 | Planificado                  | Alcance anterior de acceso web     |
| [SkyWork](https://neice.tiangong.cn/)                                          | <https://neice.tiangong.cn/>                                       | Planificado                  | Alcance anterior de acceso web     |
| [Vicuna](https://lmsys.org/blog/2023-03-30-vicuna/)                            | <https://lmsys.org/blog/2023-03-30-vicuna/>                        | Planificado                  | Alcance anterior de acceso web     |
| [WizardLM](https://github.com/nlpxucan/WizardLM)                               | <https://github.com/nlpxucan/WizardLM>                             | Planificado                  | Alcance anterior de acceso web     |
| [YouChat](https://you.com/)                                                    | <https://you.com/>                                                 | Planificado                  | Alcance anterior de acceso web     |
| [You](https://you.com/)                                                        | <https://you.com/>                                                 | Planificado                  | Alcance anterior de acceso web     |
| [Zephyr](https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat)              | <https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat>          | Planificado                  | Alcance anterior de acceso web     |

## Primeros pasos

1. Inicia `AI Chat Hub` y elige un modelo para cada panel de comparacion.
2. Para un modelo web oficial, inicia sesion en su panel integrado. Para un modelo API, agrega las credenciales en Ajustes.
3. Escribe un mensaje y envialo a los paneles seleccionados.
4. Revisa las respuestas en paralelo y resumelas o analizalas cuando lo necesites.

Necesitas una cuenta valida o una clave API para los modelos que uses y acceso de red al servicio correspondiente.

## Privacidad

Las conversaciones, los ajustes y las credenciales se guardan localmente en tu equipo. Las claves API no se incluyen al exportar datos de chat.

## Ejecutar AI Chat Hub

### Ejecutar desde el codigo fuente

Instala Node.js 20 y npm. Luego ejecuta estos comandos en la raiz del repositorio:

```bash
npm install
npm run electron:serve
```

Manten la terminal abierta mientras usas la aplicacion. Utiliza la ventana de Electron que se abre automaticamente; `http://localhost:8080` no admite las paginas de chat integradas.

### Ejecutar el EXE de Windows

1. Descarga el instalador `.exe` o compilalo con el comando siguiente. Las compilaciones locales se guardan en `dist_electron/`.
2. Haz doble clic en el `.exe` y completa el asistente de instalacion.
3. Inicia la aplicacion desde el acceso directo, el menu Inicio o el directorio de instalacion.

Las compilaciones locales no estan firmadas. Si Windows muestra SmartScreen, usa **Mas informacion > Ejecutar de todas formas** solo si confias en el origen.

### Crear el instalador

Genera un paquete de escritorio para la plataforma actual:

```bash
npm run electron:build
```

## Comentarios

Informa errores o solicita funciones en [GitHub Issues](https://github.com/justforyoudear/Chat_all/issues).

## Patrocinador
