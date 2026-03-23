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
  assert.equal(msg.type, 'text');
  assert.equal(msg.text, 'hi');
});

test('TelegramReader resolves media messages', async () => {
  const reader = new Ttp_Back_External_TelegramReader({
    configManager: { get: () => ({ telegram: { token: 'tok', chatId: { ru: '-1001' } } }) },
    logger: { info() {}, exception() {} },
    fetch: async () => ({
      ok: true,
      async json() {
        return {
          ok: true,
          result: [{ channel_post: { message_id: 6, caption: 'cap', photo: [{ file_id: 'small' }, { file_id: 'large' }], date: 1735689600, chat: { id: -1001 } } }],
        };
      },
    }),
  });

  const msg = await reader.getLatestRuMessage({ projectRoot: '/project' });
  assert.equal(msg.type, 'photo');
  assert.equal(msg.caption, 'cap');
  assert.equal(msg.media.photo.file_id, 'large');
});
