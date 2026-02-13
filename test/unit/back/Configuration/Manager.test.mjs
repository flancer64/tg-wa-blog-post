import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../../unit-bootstrap.mjs';

test('ConfigurationManager: propagates loader errors on load', async () => {
  const container = await createTestContainer();
  container.register('Ttp_Back_Configuration_Loader$', {
    load() {
      throw new Error('loader failed');
    },
  });

  const manager = await container.get('Ttp_Back_Configuration_Manager$');
  assert.throws(() => manager.load({ projectRoot: '/project' }));
});

test('ConfigurationManager: load/get lifecycle and immutability', async () => {
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

  const manager = await container.get('Ttp_Back_Configuration_Manager$');
  assert.throws(() => manager.get(), /has not been loaded/);
  const cfg = manager.load({ projectRoot: '/project' });
  assert.throws(() => manager.load({ projectRoot: '/project' }), /already been loaded/);
  assert.equal(manager.get(), cfg);
  assert.equal(Object.isFrozen(cfg), true);
  assert.equal(Object.isFrozen(cfg.telegram), true);
  assert.equal(Object.isFrozen(cfg.telegram.chatId), true);
});
