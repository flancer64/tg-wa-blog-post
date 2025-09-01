import { config } from "dotenv";

config();

export default class Tg_Post_Back_Repo_Config {
  getBotToken() {
    return process.env.BOT_TOKEN;
  }

  getChannelId() {
    return process.env.CHANNEL_ID;
  }
}
