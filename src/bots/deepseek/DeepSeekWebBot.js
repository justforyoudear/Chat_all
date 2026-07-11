import AsyncLock from "async-lock";
import WebChatBot from "@/bots/WebChatBot";

const POLL_INTERVAL_MS = 800;
const MAX_POLL_ATTEMPTS = 150;
const STABLE_POLL_COUNT = 4;

export default class DeepSeekWebBot extends WebChatBot {
  static _brandId = "deepSeek";
  static _className = "DeepSeekWebBot";
  static _providerId = "deepseek";
  static _logoFilename = "deepseek-logo.svg";
  static _loginUrl = "https://chat.deepseek.com/";
  static _chatUrl = "https://chat.deepseek.com/";
  static _lock = new AsyncLock();

  async _checkAvailability() {
    try {
      const state = await this.evaluateOfficialChat(`
        (() => ({
          hasComposer: Boolean(document.querySelector('textarea, [contenteditable="true"]')),
          pageUrl: location.href,
        }))()
      `);
      return state.hasComposer && state.pageUrl.includes("chat.deepseek.com");
    } catch {
      return false;
    }
  }

  async _sendPrompt(prompt, onUpdateResponse, callbackParam) {
    const serializedPrompt = JSON.stringify(prompt);
    await this.evaluateOfficialChat(`
      (() => {
        const input = document.querySelector('textarea, [contenteditable="true"]');
        if (!input) {
          throw new Error("DeepSeek input box not found. Open the official chat page and sign in first.");
        }

        if (input instanceof HTMLTextAreaElement) {
          const setter = Object.getOwnPropertyDescriptor(
            HTMLTextAreaElement.prototype,
            "value",
          ).set;
          setter.call(input, ${serializedPrompt});
        } else {
          input.textContent = ${serializedPrompt};
        }
        input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        const buttons = Array.from(document.querySelectorAll("button"));
        const sendButton = buttons.find((button) => {
          const label = [button.getAttribute("aria-label"), button.title, button.innerText]
            .filter(Boolean)
            .join(" ");
          return /send|发送/i.test(label) && !button.disabled;
        });
        if (sendButton) {
          sendButton.click();
          return;
        }

        input.dispatchEvent(new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          bubbles: true,
        }));
      })()
    `);

    let lastContent = "";
    let stablePolls = 0;
    let receivedContent = false;

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      const content = await this.evaluateOfficialChat(`
        (() => {
          const selectors = [
            ".ds-markdown",
            "[class*='markdown']",
            "[class*='message-content']",
            "[data-role='assistant']",
          ];
          for (const selector of selectors) {
            const nodes = Array.from(document.querySelectorAll(selector));
            const text = nodes.at(-1)?.innerText?.trim();
            if (text) return text;
          }
          return "";
        })()
      `);

      if (!content) continue;
      receivedContent = true;
      if (content !== lastContent) {
        lastContent = content;
        stablePolls = 0;
        onUpdateResponse(callbackParam, { content, done: false });
      } else {
        stablePolls++;
      }

      if (stablePolls >= STABLE_POLL_COUNT) {
        onUpdateResponse(callbackParam, { content: lastContent, done: true });
        return;
      }
    }

    if (receivedContent) {
      onUpdateResponse(callbackParam, { content: lastContent, done: true });
      return;
    }
    throw new Error(
      "DeepSeek did not return a response. Please confirm you are signed in on the official chat page.",
    );
  }
}
