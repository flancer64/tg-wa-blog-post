import assert from 'node:assert/strict';
import test from 'node:test';
import Ttp_Back_External_TelegramReader from '../../../../src/External/TelegramReader.mjs';

test('TelegramReader resolves and maps message shape', async () => {
  const reader = new Ttp_Back_External_TelegramReader({
    configManager: { get: () => ({ telegram: { token: 'tok', chatId: { ru: '-1001' } } }) },
    logger: { info() {}, exception() {} },
    fetch: async () => ({
      ok: true,
      async json() {
        return {
          ok: true,
          result: [{ channel_post: { message_id: 5, text: 'hi', date: 1735689600, chat: { id: -1001 } } }],
        };
      },
    }),
  });

  const msg = await reader.getLatestRuMessage({ projectRoot: '/project' });
  assert.equal(msg.message_id, 5);
  assert.equal(msg.text, 'hi');
});
