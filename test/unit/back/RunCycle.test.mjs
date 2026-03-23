import assert from 'node:assert/strict';
import test from 'node:test';
import Ttp_Back_RunCycle from '../../../src/RunCycle.mjs';

const cfg = {
  telegram: { chatId: { en: 'en-chat', es: 'es-chat' } },
};

function createRunCycle(overrides = {}) {
  return new Ttp_Back_RunCycle({
    configManager: { get: () => cfg },
    storage: {
      async existsByRuMessageId() { return false; },
      async saveAggregate() {},
    },
    aggregateFactory: {
      create({ ru, en, es }) {
        return {
          ru_message_id: String(ru.message_id),
          ru_message_type: ru.type || 'text',
          ru_original_text: ru.text || '',
          ru_original_caption: ru.caption || '',
          ru_media: ru.media || null,
          ru_published_at: ru.date || '',
          en_text: en?.text || '',
          en_caption: en?.caption || '',
          en_message_id: en?.message_id ? String(en.message_id) : '',
          en_published_at: en?.published_at || '',
          es_text: es?.text || '',
          es_caption: es?.caption || '',
          es_message_id: es?.message_id ? String(es.message_id) : '',
          es_published_at: es?.published_at || '',
          status: en?.ok && es?.ok ? 'success' : 'failure',
        };
      },
    },
    telegramReader: {
      async getLatestRuMessage() {
        return { message_id: '42', type: 'text', text: 'Привет', caption: '', media: null, date: '2026-01-01T00:00:00.000Z' };
      },
    },
    telegramPublisher: {
      async publish({ chatId }) {
        return { result: { message_id: `${chatId}-id`, date: 1735689600 } };
      },
    },
    llmTranslator: {
      async translate({ targetLang }) {
        return { output_text: `tx-${targetLang}` };
      },
    },
    promptProvider: {
      async getTranslatePrompt({ lang }) {
        return `prompt-${lang}`;
      },
    },
    fs: {
      promises: {
        async readFile() {
          throw new Error('must not be called');
        },
      },
    },
    path: {
      resolve: (...parts) => parts.join('/').replace(/\/+/g, '/'),
    },
    logger: { info() {}, exception() {} },
    ...overrides,
  });
}

test('RunCycle: success scenario', async () => {
  let saved;
  let existsOpts;
  let saveOpts;
  const prompts = [];
  const translateCalls = [];
  const runCycle = createRunCycle({
    promptProvider: {
      async getTranslatePrompt({ lang, projectRoot }) {
        prompts.push({ lang, projectRoot });
        return `prompt-${lang}`;
      },
    },
    storage: {
      async existsByRuMessageId(_ruMessageId, opts) {
        existsOpts = opts;
        return false;
      },
      async saveAggregate(agg, opts) {
        saved = agg;
        saveOpts = opts;
      },
    },
    llmTranslator: {
      async translate({ targetLang, prompt }) {
        translateCalls.push({ targetLang, prompt });
        return { output_text: `tx-${targetLang}` };
      },
    },
  });

  const code = await runCycle.execute({ projectRoot: '/project-root' });

  assert.equal(code, 0);
  assert.equal(saved.status, 'success');
  assert.deepEqual(existsOpts, { projectRoot: '/project-root' });
  assert.deepEqual(saveOpts, { projectRoot: '/project-root' });
  assert.deepEqual(prompts, [
    { lang: 'en', projectRoot: '/project-root' },
    { lang: 'es', projectRoot: '/project-root' },
  ]);
  assert.deepEqual(translateCalls, [
    { targetLang: 'en', prompt: 'prompt-en' },
    { targetLang: 'es', prompt: 'prompt-es' },
  ]);
});

test('RunCycle: failure in one branch', async () => {
  let saved;
  const runCycle = createRunCycle({
    telegramReader: {
      async getLatestRuMessage() {
        return { message_id: '43', type: 'text', text: 'Привет', caption: '', media: null, date: '2026-01-01T00:00:00.000Z' };
      },
    },
    storage: {
      async existsByRuMessageId() { return false; },
      async saveAggregate(agg) { saved = agg; },
    },
    llmTranslator: {
      async translate({ targetLang }) {
        if (targetLang === 'es') throw new Error('es failed');
        return { output_text: 'ok-en' };
      },
    },
    telegramPublisher: {
      async publish() {
        return { result: { message_id: 'en-id', date: 1735689600 } };
      },
    },
  });

  const code = await runCycle.execute({ projectRoot: '/project-root' });

  assert.equal(code, 1);
  assert.equal(saved.status, 'failure');
});

test('RunCycle: no ru message', async () => {
  const runCycle = createRunCycle({
    telegramReader: {
      async getLatestRuMessage() {
        return null;
      },
    },
    storage: {
      async existsByRuMessageId() { return false; },
      async saveAggregate() {
        throw new Error('must not be called');
      },
    },
    llmTranslator: { async translate() { return { output_text: '' }; } },
    telegramPublisher: { async publish() { return {}; } },
  });

  const code = await runCycle.execute({ projectRoot: '/project-root' });
  assert.equal(code, 0);
});

test('RunCycle: existing aggregate', async () => {
  const runCycle = createRunCycle({
    telegramReader: {
      async getLatestRuMessage() {
        return { message_id: '99', type: 'text', text: 'Привет', caption: '', media: null, date: '2026-01-01T00:00:00.000Z' };
      },
    },
    storage: {
      async existsByRuMessageId() { return true; },
      async saveAggregate() {
        throw new Error('must not be called');
      },
    },
    llmTranslator: { async translate() { return { output_text: '' }; } },
    telegramPublisher: { async publish() { return {}; } },
  });

  const code = await runCycle.execute({ projectRoot: '/project-root' });
  assert.equal(code, 0);
});

test('RunCycle: manual source-file scenario', async () => {
  let saved;
  let readPath;
  const runCycle = createRunCycle({
    telegramReader: {
      async getLatestRuMessage() {
        throw new Error('must not be called');
      },
    },
    storage: {
      async existsByRuMessageId() { return false; },
      async saveAggregate(agg) { saved = agg; },
    },
    llmTranslator: {
      async translate({ targetLang, text }) {
        return { output_text: `${targetLang}:${text}` };
      },
    },
    fs: {
      promises: {
        async readFile(filePath) {
          readPath = filePath;
          return 'Ручной пост';
        },
      },
    },
  });

  const code = await runCycle.execute({ projectRoot: '/project-root', sourceFile: './var/manual/post.txt' });

  assert.equal(code, 0);
  assert.equal(readPath, '/project-root/./var/manual/post.txt');
  assert.match(saved.ru_message_id, /^-\d{12}$/);
  assert.equal(saved.ru_original_text, 'Ручной пост');
  assert.equal(saved.status, 'success');
});

test('RunCycle: media without caption bypasses translation', async () => {
  const translateCalls = [];
  const publishCalls = [];
  const runCycle = createRunCycle({
    telegramReader: {
      async getLatestRuMessage() {
        return {
          message_id: '50',
          type: 'photo',
          text: '',
          caption: '',
          media: { photo: { file_id: 'photo-1' } },
          date: '2026-01-01T00:00:00.000Z',
        };
      },
    },
    storage: {
      async existsByRuMessageId() { return false; },
      async saveAggregate() {},
    },
    llmTranslator: {
      async translate(args) {
        translateCalls.push(args);
        return { output_text: 'tx' };
      },
    },
    telegramPublisher: {
      async publishMessage({ chatId, message }) {
        publishCalls.push({ chatId, message });
        return { result: { message_id: `${chatId}-id`, date: 1735689600 } };
      },
    },
  });

  const code = await runCycle.execute({ projectRoot: '/project-root' });
  assert.equal(code, 0);
  assert.equal(translateCalls.length, 0);
  assert.equal(publishCalls.length, 2);
  assert.equal(publishCalls[0].message.type, 'photo');
});

test('RunCycle: media with caption translates caption', async () => {
  const translateCalls = [];
  const publishCalls = [];
  const runCycle = createRunCycle({
    telegramReader: {
      async getLatestRuMessage() {
        return {
          message_id: '51',
          type: 'video',
          text: '',
          caption: 'Подпись',
          media: { video: { file_id: 'video-1' } },
          date: '2026-01-01T00:00:00.000Z',
        };
      },
    },
    storage: {
      async existsByRuMessageId() { return false; },
      async saveAggregate() {},
    },
    llmTranslator: {
      async translate(args) {
        translateCalls.push(args);
        return { output_text: `tx-${args.targetLang}` };
      },
    },
    telegramPublisher: {
      async publishMessage({ chatId, message }) {
        publishCalls.push({ chatId, message });
        return { result: { message_id: `${chatId}-id`, date: 1735689600 } };
      },
    },
  });

  const code = await runCycle.execute({ projectRoot: '/project-root' });
  assert.equal(code, 0);
  assert.equal(translateCalls.length, 2);
  assert.equal(publishCalls.length, 2);
  assert.equal(publishCalls[0].message.caption, 'tx-en');
});
