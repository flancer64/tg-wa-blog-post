import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../unit-bootstrap.mjs';

test('Configuration: propagates loader errors', async () => {
  const container = await createTestContainer();
  container.register('Ttp_Back_Configuration_Loader$', {
    load() {
      throw new Error('loader failed');
    },
  });

  await assert.rejects(() => container.get('Ttp_Back_Configuration$'));
});

test('Configuration: immutable object', async () => {
  const container = await createTestContainer();
  container.register('Ttp_Back_Configuration_Loader$', {
    load() {
      return {
        telegram: {
          token: 'tkn',
          chatId: { ru: 'ru', en: 'en', es: 'es' },
        },
        llm: { apiKey: 'llm' },
      };
    },
  });

  const cfg = await container.get('Ttp_Back_Configuration$');
  assert.equal(Object.isFrozen(cfg), true);
  assert.equal(Object.isFrozen(cfg.telegram), true);
  assert.equal(Object.isFrozen(cfg.telegram.chatId), true);
});
