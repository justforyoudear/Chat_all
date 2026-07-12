import DeepSeekWebBot from "@/bots/deepseek/DeepSeekWebBot";
import AsyncLock from "async-lock";

// These providers share the DOM-driven official-web workflow. Provider-specific
// selectors can be introduced here when an official site changes its composer.
export class QianWenWebBot extends DeepSeekWebBot {
  static _brandId = "qianWen";
  static _className = "QianWenWebBot";
  static _providerId = "qianwen";
  static _logoFilename = "qianwen-logo.png";
  static _loginUrl = "https://chat.qwen.ai/";
  static _chatUrl = "https://chat.qwen.ai/";
  static _lock = new AsyncLock();
  static _inputSelector = "textarea.message-input-textarea";
  static _sendSelector =
    ".message-input-right-button-send button.send-button:not(.disabled)";
  static _webviewZoomFactor = 0.8;
}

export class KimiWebBot extends DeepSeekWebBot {
  static _brandId = "kimi";
  static _className = "KimiWebBot";
  static _providerId = "kimi";
  static _logoFilename = "kimi-logo.png";
  static _loginUrl = "https://kimi.moonshot.cn/";
  static _chatUrl = "https://kimi.moonshot.cn/";
  static _lock = new AsyncLock();
  static _inputSelector =
    ".chat-input-editor, textarea, [contenteditable='true'], [role='textbox']";
  static _sendSelector =
    ".send-button-container:not(.disabled), button[type='submit']:not(:disabled), button[aria-label*='发送']:not(:disabled), button[aria-label*='Send']:not(:disabled)";

  async _sendPrompt(prompt, onUpdateResponse, callbackParam) {
    const inputSelector = JSON.stringify(this.constructor._inputSelector);
    const sendSelector = JSON.stringify(this.constructor._sendSelector);

    await this.evaluateOfficialChat(`
      (() => {
        const input = Array.from(document.querySelectorAll(${inputSelector}))
          .find((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
        if (!input) throw new Error("Kimi input box not found.");
        input.focus();
      })()
    `);
    await this.insertOfficialText(prompt);
    const clickTarget = await this.evaluateOfficialChat(`
      (async () => {
        const isVisible = (element) => {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" &&
            rect.width > 0 && rect.height > 0;
        };
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const sendButton = Array.from(document.querySelectorAll(${sendSelector}))
          .find(isVisible);
        if (!sendButton) {
          throw new Error("Kimi send button is still disabled after input.");
        }
        const input = Array.from(document.querySelectorAll(${inputSelector}))
          .find(isVisible);
        if (!input) throw new Error("Kimi input box disappeared before send.");
        const submittedText = input instanceof HTMLTextAreaElement
          ? input.value
          : input.textContent || "";
        if (!submittedText.trim()) {
          throw new Error("Kimi did not receive the prompt text.");
        }
        const rect = sendButton.getBoundingClientRect();
        return {
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
        };
      })()
    `);
    await this.clickOfficialChat(clickTarget.x, clickTarget.y);
    await this.evaluateOfficialChat(`
      (async () => {
        const isVisible = (element) => {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" &&
            rect.width > 0 && rect.height > 0;
        };
        for (let attempt = 0; attempt < 40; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          const input = Array.from(document.querySelectorAll(${inputSelector}))
            .find(isVisible);
          const sendButton = document.querySelector(".send-button-container");
          const inputText = input instanceof HTMLTextAreaElement
            ? input.value
            : input?.textContent || "";
          const accepted =
            !document.contains(input) ||
            !inputText.trim() ||
            sendButton?.classList.contains("disabled") ||
            sendButton?.getAttribute("aria-disabled") === "true";
          if (accepted) return;
        }
        throw new Error("Kimi did not acknowledge the sent prompt.");
      })()
    `);
    onUpdateResponse(callbackParam, { content: "", done: true });
  }
}

export class ChatGLMWebBot extends DeepSeekWebBot {
  static _brandId = "chatGlm";
  static _className = "ChatGLMWebBot";
  static _providerId = "chatglm";
  static _logoFilename = "chatglm-4-logo.png";
  static _loginUrl = "https://chatglm.cn/main/detail";
  static _chatUrl = "https://chatglm.cn/main/detail";
  static _lock = new AsyncLock();
  static _inputSelector = "textarea.scroll-display-none";
  static _sendSelector = "img.enter_icon";
  static _webviewZoomFactor = 0.8;
}

export class DoubaoWebBot extends DeepSeekWebBot {
  static _brandId = "doubao";
  static _className = "DoubaoWebBot";
  static _providerId = "doubao";
  static _logoFilename = "default-logo.svg";
  static _loginUrl = "https://www.doubao.com/chat/";
  static _chatUrl = "https://www.doubao.com/chat/";
  static _lock = new AsyncLock();
  static _inputSelector = "textarea.semi-input-textarea";
  static _sendSelector = "#flow-end-msg-send[aria-disabled='false']";
}
