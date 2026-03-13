declare global {
  type Ttp_Back_Aggregate_Factory = import("./src/Aggregate/Factory.mjs").default;
  type Ttp_Back_App = import("./src/App.mjs").default;
  type Ttp_Back_Configuration_Loader = import("./src/Configuration/Loader.mjs").default;
  type Ttp_Back_Configuration_Manager = import("./src/Configuration/Manager.mjs").default;
  type Ttp_Back_External_Fetch = import("./src/External/Fetch.mjs").default;
  type Ttp_Back_External_LlmTranslator = import("./src/External/LlmTranslator.mjs").default;
  type Ttp_Back_External_TelegramPublisher = import("./src/External/TelegramPublisher.mjs").default;
  type Ttp_Back_External_TelegramReader = import("./src/External/TelegramReader.mjs").default;
  type Ttp_Back_Logger = import("./src/Logger.mjs").default;
  type Ttp_Back_Prompt_Provider = import("./src/Prompt/Provider.mjs").default;
  type Ttp_Back_RunCycle = import("./src/RunCycle.mjs").default;
  type Ttp_Back_Storage_Repository = import("./src/Storage/Repository.mjs").default;
}

export {};
