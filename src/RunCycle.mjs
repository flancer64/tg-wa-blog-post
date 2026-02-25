// @ts-check

/**
 * Replication run-cycle coordinator resolved by DI container.
 */

export const __deps__ = {
  configManager: 'Ttp_Back_Configuration_Manager$',
  storage: 'Ttp_Back_Storage_Repository$',
  aggregateFactory: 'Ttp_Back_Aggregate_Factory$',
  telegramReader: 'Ttp_Back_External_TelegramReader$',
  telegramPublisher: 'Ttp_Back_External_TelegramPublisher$',
  llmTranslator: 'Ttp_Back_External_LlmTranslator$',
  promptProvider: 'Ttp_Back_Prompt_Provider$',
  logger: 'Ttp_Back_Logger$',
};

/**
 * @typedef {Object} Ttp_Back_RunCycle$Deps
 * @property {Ttp_Back_Configuration_Manager} configManager
 * @property {Ttp_Back_Storage_Repository} storage
 * @property {Ttp_Back_Aggregate_Factory} aggregateFactory
 * @property {Ttp_Back_External_TelegramReader} telegramReader
 * @property {Ttp_Back_External_TelegramPublisher} telegramPublisher
 * @property {Ttp_Back_External_LlmTranslator} llmTranslator
 * @property {Ttp_Back_Prompt_Provider} promptProvider
 * @property {Ttp_Back_Logger} logger
 */

export default class Ttp_Back_RunCycle {
  /**
   * @param {Ttp_Back_RunCycle$Deps} deps
   */
  constructor({
    configManager,
    storage,
    aggregateFactory,
    telegramReader,
    telegramPublisher,
    llmTranslator,
    promptProvider,
    logger,
  }) {
    const extractLlmText = (resp) => {
      if (typeof resp?.output_text === 'string') return resp.output_text;
      const candidate = resp?.output?.[0]?.content?.[0]?.text;
      return typeof candidate === 'string' ? candidate : '';
    };

    this.execute = async ({ projectRoot } = {}) => {
      const config = configManager.get();
      const ru = await telegramReader.getLatestRuMessage({ projectRoot });
      if (!ru) {
        logger?.info?.('Ttp_Back_RunCycle', 'No ru message found');
        return 0;
      }

      if (await storage.existsByRuMessageId(String(ru.message_id), { projectRoot })) {
        logger?.info?.('Ttp_Back_RunCycle', `Aggregate already exists for ${ru.message_id}`);
        return 0;
      }

      const runBranch = async (lang, chatId) => {
        try {
          const prompt = await promptProvider.getTranslatePrompt({ lang, projectRoot });
          const llmResponse = await llmTranslator.translate({
            text: ru.text || '',
            targetLang: lang,
            prompt,
            projectRoot,
          });
          const translated = extractLlmText(llmResponse);
          const tgResponse = await telegramPublisher.publish({ chatId, text: translated, projectRoot });
          return {
            ok: true,
            text: translated,
            message_id: tgResponse?.result?.message_id || '',
            published_at: tgResponse?.result?.date ? new Date(tgResponse.result.date * 1000).toISOString() : '',
          };
        } catch (err) {
          logger?.exception?.('Ttp_Back_RunCycle', err);
          return { ok: false, text: '', message_id: '', published_at: '' };
        }
      };

      const [en, es] = await Promise.all([
        runBranch('en', config.telegram.chatId.en),
        runBranch('es', config.telegram.chatId.es),
      ]);

      const aggregate = aggregateFactory.create({ ru, en, es });
      await storage.saveAggregate(aggregate, { projectRoot });
      return aggregate.status === 'success' ? 0 : 1;
    };
  }
}
