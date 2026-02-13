import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../unit-bootstrap.mjs';

test('Configuration: missing env throws', async () => {
  const container = await createTestContainer();
  container.register('node:path', { resolve: () => '/project/.env' });
  container.register('node:fs', { existsSync: () => false });
  container.register('node:process', { cwd: () => '/project', env: {}, stdout: { write() {} } });
  container.register('Ttp_Back_Logger$', { exception() {} });

  await assert.rejects(() => container.get('Ttp_Back_Configuration$'));
});

test('Configuration: immutable object', async () => {
  const container = await createTestContainer();
  container.register('node:path', { resolve: () => '/project/.env' });
  container.register('node:fs', { existsSync: () => false });
  container.register('node:process', {
    cwd: () => '/project',
    env: {
      TELEGRAM_TOKEN: 'tkn',
      TELEGRAM_CHAT_ID_RU: 'ru',
      TELEGRAM_CHAT_ID_EN: 'en',
      TELEGRAM_CHAT_ID_ES: 'es',
      LLM_API_KEY: 'llm',
    },
    stdout: { write() {} },
  });
  container.register('Ttp_Back_Logger$', { exception() {} });

  const cfg = await container.get('Ttp_Back_Configuration$');
  assert.equal(Object.isFrozen(cfg), true);
  assert.equal(Object.isFrozen(cfg.telegram), true);
  assert.equal(Object.isFrozen(cfg.telegram.chatId), true);
});
