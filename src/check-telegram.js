#!/usr/bin/env node
import { Bot } from "grammy";
import { config } from "dotenv";

config();

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("BOT_TOKEN is not defined.");
  process.exit(1);
}

const bot = new Bot(token);

try {
  const me = await bot.api.getMe();
  console.log(`Bot is ready: @${me.username}`);
} catch (err) {
  console.error("Telegram API request failed:", err);
  process.exit(1);
}

// AGENT: expand this script with additional diagnostics if needed
