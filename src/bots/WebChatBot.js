import Bot from "@/bots/Bot";

const { ipcRenderer } = window.require("electron");

export default class WebChatBot extends Bot {
  static _providerId = "web-chat";
  static _chatUrl = "";

  async openOfficialChat() {
    await ipcRenderer.invoke("web-chat-open", {
      providerId: this.constructor._providerId,
      url: this.constructor._chatUrl || this.getLoginUrl(),
    });
  }

  async evaluateOfficialChat(script) {
    return await ipcRenderer.invoke("web-chat-evaluate", {
      providerId: this.constructor._providerId,
      script,
    });
  }
}
