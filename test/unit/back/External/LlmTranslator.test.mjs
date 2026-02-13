import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../../unit-bootstrap.mjs';

test('LLM adapter: retry = 3 then throws', async () => {
  const container = await createTestContainer();
  let attempts = 0;
  container.register('Ttp_Back_Configuration_Manager$', { get: () => ({ llm: { apiKey: 'secret' } }) });
  container.register('Ttp_Back_Logger$', { info() {}, exception() {}, debug() {} });
  container.register('node:node-fetch', async () => {
    attempts += 1;
    throw new Error('network');
  });

  const adapter = await container.get('Ttp_Back_External_LlmTranslator$');
  await assert.rejects(() => adapter.translate({ text: 'a', targetLang: 'en', prompt: 'p', projectRoot: '/project' }));
  assert.equal(attempts, 3);
});
