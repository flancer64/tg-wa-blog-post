import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from './di-node.mjs';

test('TelegramPublisher: retry = 3', async () => {
  const container = await createTestContainer();
  let attempts = 0;
  container.register('Ttp_Back_Configuration$', { telegram: { token: 'tok' } });
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('node:node-fetch', async () => {
    attempts += 1;
    throw new Error('network');
  });

  const adapter = await container.get('Ttp_Back_External_TelegramPublisher$');
  await assert.rejects(() => adapter.publish({ chatId: '1', text: 'x' }));
  assert.equal(attempts, 3);
});

test('TelegramPublisher: returns message_id', async () => {
  const container = await createTestContainer();
  container.register('Ttp_Back_Configuration$', { telegram: { token: 'tok' } });
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('node:node-fetch', async () => ({
    ok: true,
    async json() {
      return { ok: true, result: { message_id: 777, date: 1735689600 } };
    },
  }));

  const adapter = await container.get('Ttp_Back_External_TelegramPublisher$');
  const res = await adapter.publish({ chatId: '1', text: 'x' });
  assert.equal(res.result.message_id, 777);
});
