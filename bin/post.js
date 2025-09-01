#!/usr/bin/env node
import Tg_Post_Back_Repo_Config from "../src/back/Tg_Post_Back_Repo_Config.js";
import Tg_Post_Back_Bot_Client from "../src/back/Tg_Post_Back_Bot_Client.js";
import Tg_Post_Back_Handler_Publish from "../src/back/Tg_Post_Back_Handler_Publish.js";
import Tg_Post_Back_Cli_Post from "../src/back/Tg_Post_Back_Cli_Post.js";
import Tg_Post_Shared_Dto_Post from "../src/shared/Tg_Post_Shared_Dto_Post.js";

async function main() {
  const repoConfig = new Tg_Post_Back_Repo_Config();
  const botClient = new Tg_Post_Back_Bot_Client(repoConfig);
  const handler = new Tg_Post_Back_Handler_Publish(botClient);
  const cli = new Tg_Post_Back_Cli_Post(handler, Tg_Post_Shared_Dto_Post);
  await cli.run(process.argv);
}

main().catch((err) => {
  console.error("Publishing failed:", err);
  process.exit(1);
});

// AGENT: replace manual wiring with @teqfw/di container when available
