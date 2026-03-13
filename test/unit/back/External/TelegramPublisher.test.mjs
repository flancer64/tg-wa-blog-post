import assert from 'node:assert/strict';
import test from 'node:test';
import Ttp_Back_External_TelegramPublisher from '../../../../src/External/TelegramPublisher.mjs';

test('TelegramPublisher: retry = 3', async () => {
  let attempts = 0;
  const adapter = new Ttp_Back_External_TelegramPublisher({
    configManager: { get: () => ({ telegram: { token: 'tok' } }) },
    logger: { info() {}, exception() {} },
    fetch: async () => {
      attempts += 1;
      throw new Error('network');
    },
  });

  await assert.rejects(() => adapter.publish({ chatId: '1', text: 'x', projectRoot: '/project' }));
  assert.equal(attempts, 3);
});

test('TelegramPublisher: returns message_id', async () => {
  const adapter = new Ttp_Back_External_TelegramPublisher({
    configManager: { get: () => ({ telegram: { token: 'tok' } }) },
    logger: { info() {}, exception() {} },
    fetch: async () => ({
      ok: true,
      async json() {
        return { ok: true, result: { message_id: 777, date: 1735689600 } };
      },
    }),
  });

  const res = await adapter.publish({ chatId: '1', text: 'x', projectRoot: '/project' });
  assert.equal(res.result.message_id, 777);
});
