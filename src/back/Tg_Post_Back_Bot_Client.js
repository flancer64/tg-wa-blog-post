import { Bot } from "grammy";

export default class Tg_Post_Back_Bot_Client {
  constructor(repoConfig) {
    this.repoConfig = repoConfig;
    const token = this.repoConfig.getBotToken();
    if (!token) throw new Error("BOT_TOKEN is not defined");
    this.bot = new Bot(token);
  }

  async sendMessage(text) {
    await this.bot.api.sendMessage(this.repoConfig.getChannelId(), text);
  }

  async sendPhoto(url, caption) {
    await this.bot.api.sendPhoto(this.repoConfig.getChannelId(), url, { caption });
  }
}
