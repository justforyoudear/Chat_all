<div align="center">
  <h1>AI Chat Hub</h1>
  <p><strong>複数の AI 会話を比較するためのデスクトップワークスペース</strong></p>

[Deutsch](README_DE-DE.md) | [English](README.md) | [Espanol](README_ES-ES.md) | [Francais](README_FR-FR.md) | [Italiano](README_IT-IT.md) | 日本語 | [Korean](README_KO-KR.md) | [Russian](README_RU-RU.md) | [Tieng Viet](README_VI-VN.md) | [Chinese](README_ZH-CN.md)

</div>

## 製品紹介

`AI Chat Hub` は、同じプロンプトを複数の AI モデルへ送信し、結果を一か所で比較できる Electron デスクトップワークスペースです。モデル選択、会話、後続の作業は一つのローカルワークスペースに保持されます。

![AI Chat Hub マルチモデルワークスペース](screenshots/ai-chat-hub-workspace.png)

## 主な機能

- 一つから六つのモデルパネルで応答を比較。
- [DeepSeek](https://chat.deepseek.com/)、Qianwen、Kimi、ChatGLM、Doubao など、対応する公式 Web チャットに埋め込みログインパネルからサインイン。
- OpenAI、Azure OpenAI、Anthropic、Google、Cohere、Groq、xAI、Baidu、および OpenAI 互換エンドポイントの API モデルを設定。
- プロンプトの改善、テキストまたはコードファイルのコンテキスト添付、設定済み OpenAI API モデルによる画像生成。
- 選択した応答のクイック要約、または合意点と相違点の分析。
- 会話、プロンプト、設定をローカル保存し、複数会話、レイアウト、プロキシ設定を管理。

## 公式 Web ログイン

以下のプロバイダーは埋め込み公式 Web ワークスペースで利用できます。予定項目は元プロジェクトの Web 接入範囲に合わせたものであり、現在は利用できません。

| プロバイダー                                                                   | URL                                                                | 公式 Web ログイン | 状態                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ----------------- | ------------------------------- |
| [DeepSeek](https://chat.deepseek.com/)                                         | <https://chat.deepseek.com/>                                       | 対応済み          | 埋め込み公式 Web ワークスペース |
| [Qianwen](https://chat.qwen.ai/)                                               | <https://chat.qwen.ai/>                                            | 対応済み          | 埋め込み公式 Web ワークスペース |
| [Kimi](https://kimi.moonshot.cn/)                                              | <https://kimi.moonshot.cn/>                                        | 対応済み          | 埋め込み公式 Web ワークスペース |
| [ChatGLM](https://chatglm.cn/)                                                 | <https://chatglm.cn/>                                              | 対応済み          | 埋め込み公式 Web ワークスペース |
| [Doubao](https://www.doubao.com/chat/)                                         | <https://www.doubao.com/chat/>                                     | 対応済み          | 埋め込み公式 Web ワークスペース |
| [360 AI Brain](https://ai.360.cn/)                                             | <https://ai.360.cn/>                                               | 予定              | 以前の Web 接入範囲             |
| [Character.AI](https://character.ai/)                                          | <https://character.ai/>                                            | 予定              | 以前の Web 接入範囲             |
| [ChatGPT](https://chatgpt.com/)                                                | <https://chatgpt.com/>                                             | 予定              | 以前の Web 接入範囲             |
| [Claude](https://www.anthropic.com/claude)                                     | <https://www.anthropic.com/claude>                                 | 予定              | 以前の Web 接入範囲             |
| [Code Llama](https://ai.meta.com/blog/code-llama-large-language-model-coding/) | <https://ai.meta.com/blog/code-llama-large-language-model-coding/> | 予定              | 以前の Web 接入範囲             |
| [Copilot](https://copilot.microsoft.com/)                                      | <https://copilot.microsoft.com/>                                   | 予定              | 以前の Web 接入範囲             |
| [Dedao Learning Assistant](https://ai.dedao.cn/)                               | <https://ai.dedao.cn/>                                             | 予定              | 以前に予定された Web 接入範囲   |
| [Falcon 180B](https://huggingface.co/tiiuae/falcon-180b-chat)                  | <https://huggingface.co/tiiuae/falcon-180b-chat>                   | 予定              | 以前の Web 接入範囲             |
| [Gemini](https://gemini.google.com/)                                           | <https://gemini.google.com/>                                       | 予定              | 以前の Web 接入範囲             |
| [Gemma 2B & 7B](https://blog.google/technology/developers/gemma-open-models/)  | <https://blog.google/technology/developers/gemma-open-models/>     | 予定              | 以前の Web 接入範囲             |
| [Gradio](https://gradio.app/)                                                  | <https://gradio.app/>                                              | 予定              | 以前の Web 接入範囲             |
| [HuggingChat](https://huggingface.co/chat/)                                    | <https://huggingface.co/chat/>                                     | 予定              | 以前の Web 接入範囲             |
| [iFLYTEK SPARK](http://xinghuo.xfyun.cn/)                                      | <http://xinghuo.xfyun.cn/>                                         | 予定              | 以前の Web 接入範囲             |
| [Llama 2](https://ai.meta.com/llama/)                                          | <https://ai.meta.com/llama/>                                       | 予定              | 以前の Web 接入範囲             |
| [MOSS](https://moss.fastnlp.top/)                                              | <https://moss.fastnlp.top/>                                        | 予定              | 以前の Web 接入範囲             |
| [Perplexity](https://www.perplexity.ai/)                                       | <https://www.perplexity.ai/>                                       | 予定              | 以前の Web 接入範囲             |
| [Phind](https://www.phind.com/)                                                | <https://www.phind.com/>                                           | 予定              | 以前の Web 接入範囲             |
| [Pi](https://pi.ai/)                                                           | <https://pi.ai/>                                                   | 予定              | 以前の Web 接入範囲             |
| [Poe](https://poe.com/)                                                        | <https://poe.com/>                                                 | 予定              | 以前の Web 接入範囲             |
| [SkyWork](https://neice.tiangong.cn/)                                          | <https://neice.tiangong.cn/>                                       | 予定              | 以前の Web 接入範囲             |
| [Vicuna](https://lmsys.org/blog/2023-03-30-vicuna/)                            | <https://lmsys.org/blog/2023-03-30-vicuna/>                        | 予定              | 以前の Web 接入範囲             |
| [WizardLM](https://github.com/nlpxucan/WizardLM)                               | <https://github.com/nlpxucan/WizardLM>                             | 予定              | 以前の Web 接入範囲             |
| [YouChat](https://you.com/)                                                    | <https://you.com/>                                                 | 予定              | 以前の Web 接入範囲             |
| [You](https://you.com/)                                                        | <https://you.com/>                                                 | 予定              | 以前の Web 接入範囲             |
| [Zephyr](https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat)              | <https://huggingface.co/spaces/HuggingFaceH4/zephyr-chat>          | 予定              | 以前の Web 接入範囲             |

## はじめに

1. `AI Chat Hub` を起動し、各比較パネルのモデルを選びます。
2. 公式 Web モデルでは埋め込みログインパネルでサインインします。API モデルでは設定に認証情報を入力します。
3. プロンプトを入力し、選択したパネルへ送信します。
4. 応答を並べて確認し、必要に応じて要約または分析します。

利用するモデルには有効なアカウントまたは API キーと、対象サービスへのネットワーク接続が必要です。

## プライバシー

会話、設定、認証情報はコンピューターにローカル保存されます。チャットデータをエクスポートしても API キーは含まれません。

## AI Chat Hub の実行

### ソースコードから実行

Node.js 20 と npm をインストールし、リポジトリのルートで次を実行します。

```bash
npm install
npm run electron:serve
```

利用中はターミナルを閉じないでください。自動的に開く Electron ウィンドウを使用します。ブラウザで `http://localhost:8080` を直接開いても、埋め込みの公式チャットページは動作しません。

### Windows EXE を実行

1. Windows インストーラーの `.exe` をダウンロードするか、下記のコマンドでビルドします。ローカルの成果物は `dist_electron/` に作成されます。
2. `.exe` をダブルクリックし、インストールウィザードを完了します。
3. デスクトップのショートカット、スタートメニュー、またはインストール先から起動します。

ローカルビルドは署名されていません。SmartScreen が表示された場合は、入手元を信頼できるときだけ **詳細情報 > 実行** を選択してください。

### インストーラーをビルド

現在のプラットフォーム向けのデスクトップパッケージを作成します。

```bash
npm run electron:build
```

## フィードバック

不具合や機能要望は [GitHub Issues](https://github.com/justforyoudear/Chat_all/issues) に報告してください。

## 支援者
