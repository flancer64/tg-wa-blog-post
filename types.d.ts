declare global {
  type Ttp_Back_Aggregate_Factory = InstanceType<typeof import("./src/Aggregate/Factory.mjs").default>;
  type Ttp_Back_App = InstanceType<typeof import("./src/App.mjs").default>;
  type Ttp_Back_Configuration = InstanceType<typeof import("./src/Configuration.mjs").default>;
  type Ttp_Back_Configuration_Loader = InstanceType<typeof import("./src/Configuration/Loader.mjs").default>;
  type Ttp_Back_External_LlmTranslator = InstanceType<typeof import("./src/External/LlmTranslator.mjs").default>;
  type Ttp_Back_External_TelegramPublisher = InstanceType<typeof import("./src/External/TelegramPublisher.mjs").default>;
  type Ttp_Back_External_TelegramReader = InstanceType<typeof import("./src/External/TelegramReader.mjs").default>;
  type Ttp_Back_Logger = InstanceType<typeof import("./src/Logger.mjs").default>;
  type Ttp_Back_RunCycle = InstanceType<typeof import("./src/RunCycle.mjs").default>;
  type Ttp_Back_Storage_Repository = InstanceType<typeof import("./src/Storage/Repository.mjs").default>;
}

export {};
