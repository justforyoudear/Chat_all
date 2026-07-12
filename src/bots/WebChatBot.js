import Bot from "@/bots/Bot";
import store from "@/store";

const { ipcRenderer } = window.require("electron");

export default class WebChatBot extends Bot {
  static _providerId = "web-chat";
  static _chatUrl = "";

  async openOfficialChat(slot) {
    store.commit("setOfficialLogin", {
      open: true,
      providerId: this.constructor._providerId,
      url: this.constructor._chatUrl || this.getLoginUrl(),
      title: this.getBrandName(),
      slot,
    });
  }

  async evaluateOfficialChat(script) {
    return await ipcRenderer.invoke("web-chat-evaluate", {
      providerId: this.constructor._providerId,
      script,
    });
  }

  async insertOfficialText(text) {
    return await ipcRenderer.invoke("web-chat-insert-text", {
      providerId: this.constructor._providerId,
      text,
    });
  }

  async clickOfficialChat(x, y) {
    const zoomFactor = this.constructor._webviewZoomFactor || 1;
    return await ipcRenderer.invoke("web-chat-click", {
      providerId: this.constructor._providerId,
      // DOM rectangles are expressed in the WebView's zoomed CSS pixels,
      // while Electron mouse events use the card's physical content pixels.
      x: Math.round(x * zoomFactor),
      y: Math.round(y * zoomFactor),
    });
  }
}
