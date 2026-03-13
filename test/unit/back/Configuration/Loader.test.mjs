import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import Ttp_Back_Configuration_Loader from '../../../../src/Configuration/Loader.mjs';

test('ConfigurationLoader reads .env and builds structure', () => {
  const loader = new Ttp_Back_Configuration_Loader({
    path,
    fs: {
      existsSync: () => true,
      readFileSync: () => [
        'TELEGRAM_TOKEN=tkn',
        'TELEGRAM_CHAT_ID_RU=ru',
        'TELEGRAM_CHAT_ID_EN=en',
        'TELEGRAM_CHAT_ID_ES=es',
        'LLM_API_KEY=llm',
      ].join('\n'),
    },
    process: { env: {}, stdout: { write() {} } },
  });

  const cfg = loader.load({ projectRoot: '/project' });
  assert.equal(cfg.telegram.chatId.en, 'en');
  assert.equal(cfg.llm.apiKey, 'llm');
});

test('ConfigurationLoader throws without project root from runtime', () => {
  const loader = new Ttp_Back_Configuration_Loader({
    fs: { existsSync: () => false, readFileSync() {} },
    path,
    process: { env: {}, stdout: { write() {} } },
  });

  assert.throws(() => loader.load(), /projectRoot/);
});
