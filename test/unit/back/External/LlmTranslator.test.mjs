import assert from 'node:assert/strict';
import test from 'node:test';
import Ttp_Back_External_LlmTranslator from '../../../../src/External/LlmTranslator.mjs';

test('LLM adapter: retry = 3 then throws', async () => {
  let attempts = 0;
  const adapter = new Ttp_Back_External_LlmTranslator({
    configManager: { get: () => ({ llm: { apiKey: 'secret' } }) },
    logger: { info() {}, exception() {}, debug() {} },
    fetch: async () => {
      attempts += 1;
      throw new Error('network');
    },
  });

  await assert.rejects(() => adapter.translate({ text: 'a', targetLang: 'en', prompt: 'p', projectRoot: '/project' }));
  assert.equal(attempts, 3);
});
