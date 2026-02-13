export default class Ttp_Back_RunCycle {
  constructor({
    Ttp_Back_Configuration_Manager$: configManager,
    Ttp_Back_Storage_Repository$: storage,
    Ttp_Back_Aggregate_Factory$: aggregateFactory,
    Ttp_Back_External_TelegramReader$: telegramReader,
    Ttp_Back_External_TelegramPublisher$: telegramPublisher,
    Ttp_Back_External_LlmTranslator$: llmTranslator,
    Ttp_Back_Prompt_Provider$: promptProvider,
    Ttp_Back_Logger$: logger,
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
