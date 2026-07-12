import AsyncLock from "async-lock";
import WebChatBot from "@/bots/WebChatBot";

export default class DeepSeekWebBot extends WebChatBot {
  static _brandId = "deepSeek";
  static _className = "DeepSeekWebBot";
  static _providerId = "deepseek";
  static _logoFilename = "deepseek-logo.svg";
  static _loginUrl = "https://chat.deepseek.com/";
  static _chatUrl = "https://chat.deepseek.com/";
  static _lock = new AsyncLock();
  static _sendSelector =
    "[role='button'].ds-button--primary:not(.ds-button--disabled)";

  async _checkAvailability() {
    try {
      const state = await this.evaluateOfficialChat(`
        (() => ({ pageUrl: location.href }))()
      `);
      return Boolean(state.pageUrl);
    } catch {
      return false;
    }
  }

  async _sendPrompt(prompt, onUpdateResponse, callbackParam) {
    const inputSelector = JSON.stringify(
      this.constructor._inputSelector ||
        "textarea, [contenteditable='true'], [role='textbox']",
    );
    const sendSelector = JSON.stringify(
      this.constructor._sendSelector ||
        "button[type='submit']:not(:disabled), button[aria-label*='send' i]:not(:disabled), [data-testid*='send' i]:not(:disabled), [data-testid*='submit' i]:not(:disabled)",
    );
    const hasConfiguredSendSelector = JSON.stringify(
      Boolean(this.constructor._sendSelector),
    );
    const inputTarget = await this.evaluateOfficialChat(`
      (() => {
        const isVisible = (element) => {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.visibility !== "hidden" && style.display !== "none" &&
            rect.width > 0 && rect.height > 0;
        };
        const inputs = Array.from(document.querySelectorAll(${inputSelector}))
          .filter(isVisible);
        const input = inputs.at(-1);
        if (!input) {
          throw new Error("Official chat input box not found. Open the official chat page and sign in first.");
        }
        const rect = input.getBoundingClientRect();
        return {
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
        };
      })()
    `);
    await this.clickOfficialChat(inputTarget.x, inputTarget.y);
    // The trusted mouse event is queued in the WebView. Let the official
    // editor receive focus before Electron inserts text into it.
    await new Promise((resolve) => setTimeout(resolve, 100));
    await this.insertOfficialText(prompt);

    const clickTarget = await this.evaluateOfficialChat(`
      (async () => {
        const isVisible = (element) => {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.visibility !== "hidden" && style.display !== "none" &&
            rect.width > 0 && rect.height > 0;
        };
        const getInputText = (input) =>
          input instanceof HTMLTextAreaElement ? input.value : input.textContent || "";
        const input = Array.from(document.querySelectorAll(${inputSelector}))
          .filter(isVisible)
          .at(-1);
        if (!input) throw new Error("Official chat input box disappeared before send.");
        const submittedText = getInputText(input);
        if (!submittedText.trim()) throw new Error("Official chat did not receive the prompt text.");

        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const composerRoots = [];
        for (let element = input; element && composerRoots.length < 5; element = element.parentElement) {
          composerRoots.push(element);
          if (element.tagName === "FORM") break;
        }
        const composerControls = composerRoots
          .flatMap((root) =>
            Array.from(root.querySelectorAll("button, [role='button']")),
          )
          .filter(
            (control, index, controls) => controls.indexOf(control) === index,
          );
        const configuredControls = composerRoots
          .flatMap((root) => [
            ...(root.matches(${sendSelector}) ? [root] : []),
            ...Array.from(root.querySelectorAll(${sendSelector})),
            ...(${hasConfiguredSendSelector}
              ? Array.from(document.querySelectorAll(${sendSelector}))
              : []),
          ])
          .filter(
            (control, index, controls) => controls.indexOf(control) === index,
          );
        const configuredButton = configuredControls
          .filter(
            (control) =>
              !control.disabled &&
              !control.classList.contains("disabled") &&
              !control.classList.contains("ds-button--disabled") &&
              control.getAttribute("aria-disabled") !== "true" &&
              isVisible(control),
          )
          .at(-1);
        const inputRect = input.getBoundingClientRect();
        const adjacentButton = composerControls
          .filter(
            (control) =>
              !control.disabled &&
              !control.classList.contains("disabled") &&
              !control.classList.contains("ds-button--disabled") &&
              control.getAttribute("aria-disabled") !== "true",
          )
          .filter(isVisible)
          .filter((control) => {
            const rect = control.getBoundingClientRect();
            return rect.left >= inputRect.right - 8 &&
              rect.top <= inputRect.bottom && rect.bottom >= inputRect.top;
          })
          .sort((left, right) =>
            right.getBoundingClientRect().left - left.getBoundingClientRect().left,
          )
          .at(0);
        const sendButton = configuredButton || adjacentButton;
        if (!sendButton) {
          throw new Error(
            "Official chat send button not found or disabled in the composer.",
          );
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
          return style.visibility !== "hidden" && style.display !== "none" &&
            rect.width > 0 && rect.height > 0;
        };
        const getInputText = (input) =>
          input instanceof HTMLTextAreaElement ? input.value : input.textContent || "";
        for (let attempt = 0; attempt < 40; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          const input = Array.from(document.querySelectorAll(${inputSelector}))
            .filter(isVisible)
            .at(-1);
          const accepted = !input || !getInputText(input).trim();
          if (accepted) return "button";
        }
        throw new Error("Official chat did not acknowledge the sent prompt.");
      })()
    `);

    // The official page owns response rendering. Releasing the per-provider lock
    // here keeps later prompts from waiting on brittle DOM response scraping.
    onUpdateResponse(callbackParam, { content: "", done: true });
  }
}
