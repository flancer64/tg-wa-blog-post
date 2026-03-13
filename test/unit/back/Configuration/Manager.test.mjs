import assert from 'node:assert/strict';
import test from 'node:test';
import Ttp_Back_Configuration_Manager from '../../../../src/Configuration/Manager.mjs';

test('ConfigurationManager: propagates loader errors on load', () => {
  const manager = new Ttp_Back_Configuration_Manager({
    loader: {
      load() {
        throw new Error('loader failed');
      },
    },
  });

  assert.throws(() => manager.load({ projectRoot: '/project' }));
});

test('ConfigurationManager: load/get lifecycle and immutability', () => {
  const manager = new Ttp_Back_Configuration_Manager({
    loader: {
      load() {
        return {
          telegram: {
            token: 'tkn',
            chatId: { ru: 'ru', en: 'en', es: 'es' },
          },
          llm: { apiKey: 'llm' },
        };
      },
    },
  });

  assert.throws(() => manager.get(), /has not been loaded/);
  const cfg = manager.load({ projectRoot: '/project' });
  assert.throws(() => manager.load({ projectRoot: '/project' }), /already been loaded/);
  assert.equal(manager.get(), cfg);
  assert.equal(Object.isFrozen(cfg), true);
  assert.equal(Object.isFrozen(cfg.telegram), true);
  assert.equal(Object.isFrozen(cfg.telegram.chatId), true);
});
