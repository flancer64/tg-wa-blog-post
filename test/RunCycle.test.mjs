import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from './di-node.mjs';

const cfg = {
  telegram: { chatId: { en: 'en-chat', es: 'es-chat' } },
};

test('RunCycle: success scenario', async () => {
  const container = await createTestContainer();
  let saved;
  let existsOpts;
  let saveOpts;
  container.register('Ttp_Back_Configuration$', cfg);
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('Ttp_Back_External_TelegramReader$', {
    async getLatestRuMessage() {
      return { message_id: '42', text: 'Привет', date: '2026-01-01T00:00:00.000Z' };
    },
  });
  container.register('Ttp_Back_Storage_Repository$', {
    async existsByRuMessageId(_ruMessageId, opts) { existsOpts = opts; return false; },
    async saveAggregate(agg, opts) { saved = agg; saveOpts = opts; },
  });
  container.register('Ttp_Back_External_LlmTranslator$', {
    async translate({ targetLang }) { return { output_text: `tx-${targetLang}` }; },
  });
  container.register('Ttp_Back_External_TelegramPublisher$', {
    async publish({ chatId }) { return { result: { message_id: `${chatId}-id`, date: 1735689600 } }; },
  });

  const runCycle = await container.get('Ttp_Back_RunCycle$');
  const code = await runCycle.execute({ projectRoot: '/project-root' });

  assert.equal(code, 0);
  assert.equal(saved.status, 'success');
  assert.deepEqual(existsOpts, { projectRoot: '/project-root' });
  assert.deepEqual(saveOpts, { projectRoot: '/project-root' });
});

test('RunCycle: failure in one branch', async () => {
  const container = await createTestContainer();
  let saved;
  container.register('Ttp_Back_Configuration$', cfg);
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('Ttp_Back_External_TelegramReader$', {
    async getLatestRuMessage() { return { message_id: '43', text: 'Привет', date: '2026-01-01T00:00:00.000Z' }; },
  });
  container.register('Ttp_Back_Storage_Repository$', {
    async existsByRuMessageId() { return false; },
    async saveAggregate(agg) { saved = agg; },
  });
  container.register('Ttp_Back_External_LlmTranslator$', {
    async translate({ targetLang }) {
      if (targetLang === 'es') throw new Error('es failed');
      return { output_text: 'ok-en' };
    },
  });
  container.register('Ttp_Back_External_TelegramPublisher$', {
    async publish() { return { result: { message_id: 'en-id', date: 1735689600 } }; },
  });

  const runCycle = await container.get('Ttp_Back_RunCycle$');
  const code = await runCycle.execute({ projectRoot: '/project-root' });

  assert.equal(code, 1);
  assert.equal(saved.status, 'failure');
});

test('RunCycle: no ru message', async () => {
  const container = await createTestContainer();
  container.register('Ttp_Back_Configuration$', cfg);
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('Ttp_Back_External_TelegramReader$', {
    async getLatestRuMessage() { return null; },
  });
  container.register('Ttp_Back_Storage_Repository$', {
    async existsByRuMessageId() { return false; },
    async saveAggregate() { throw new Error('must not be called'); },
  });
  container.register('Ttp_Back_External_LlmTranslator$', { async translate() { return { output_text: '' }; } });
  container.register('Ttp_Back_External_TelegramPublisher$', { async publish() { return {}; } });

  const runCycle = await container.get('Ttp_Back_RunCycle$');
  const code = await runCycle.execute({ projectRoot: '/project-root' });
  assert.equal(code, 0);
});

test('RunCycle: existing aggregate', async () => {
  const container = await createTestContainer();
  container.register('Ttp_Back_Configuration$', cfg);
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('Ttp_Back_External_TelegramReader$', {
    async getLatestRuMessage() { return { message_id: '99', text: 'Привет', date: '2026-01-01T00:00:00.000Z' }; },
  });
  container.register('Ttp_Back_Storage_Repository$', {
    async existsByRuMessageId() { return true; },
    async saveAggregate() { throw new Error('must not be called'); },
  });
  container.register('Ttp_Back_External_LlmTranslator$', { async translate() { return { output_text: '' }; } });
  container.register('Ttp_Back_External_TelegramPublisher$', { async publish() { return {}; } });

  const runCycle = await container.get('Ttp_Back_RunCycle$');
  const code = await runCycle.execute({ projectRoot: '/project-root' });
  assert.equal(code, 0);
});
