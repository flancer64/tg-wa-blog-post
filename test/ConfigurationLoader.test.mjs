import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from './di-node.mjs';

test('ConfigurationLoader reads .env and builds structure', async () => {
  const container = await createTestContainer();
  container.register('node:path', { resolve: () => '/project/.env' });
  container.register('node:fs', {
    existsSync: () => true,
    readFileSync: () => [
      'TELEGRAM_TOKEN=tkn',
      'TELEGRAM_CHAT_ID_RU=ru',
      'TELEGRAM_CHAT_ID_EN=en',
      'TELEGRAM_CHAT_ID_ES=es',
      'LLM_API_KEY=llm',
    ].join('\n'),
  });
  container.register('node:process', { cwd: () => '/project', env: {}, stdout: { write() {} } });
  container.register('Ttp_Back_Logger$', { exception() {} });

  const loader = await container.get('Ttp_Back_Configuration_Loader$');
  const cfg = loader.load();
  assert.equal(cfg.telegram.chatId.en, 'en');
  assert.equal(cfg.llm.apiKey, 'llm');
});
