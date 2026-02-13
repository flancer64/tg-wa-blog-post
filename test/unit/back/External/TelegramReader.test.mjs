import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../../unit-bootstrap.mjs';

test('TelegramReader resolves and maps message shape', async () => {
  const container = await createTestContainer();
  container.register('Ttp_Back_Configuration_Loader$', { load: () => ({ telegram: { token: 'tok', chatId: { ru: '-1001' } } }) });
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('node:node-fetch', async () => ({
    ok: true,
    async json() {
      return {
        ok: true,
        result: [{ channel_post: { message_id: 5, text: 'hi', date: 1735689600, chat: { id: -1001 } } }],
      };
    },
  }));

  const reader = await container.get('Ttp_Back_External_TelegramReader$');
  const msg = await reader.getLatestRuMessage({ projectRoot: '/project' });
  assert.equal(msg.message_id, 5);
  assert.equal(msg.text, 'hi');
});
