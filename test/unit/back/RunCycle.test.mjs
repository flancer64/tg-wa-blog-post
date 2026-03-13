import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../unit-bootstrap.mjs';

const cfg = {
  telegram: { chatId: { en: 'en-chat', es: 'es-chat' } },
};

test('RunCycle: success scenario', async () => {
  const container = await createTestContainer();
  let saved;
  let existsOpts;
  let saveOpts;
  const prompts = [];
  const translateCalls = [];
  container.register('Ttp_Back_Configuration_Manager$', { get: () => cfg });
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('Ttp_Back_Prompt_Provider$', {
    async getTranslatePrompt({ lang, projectRoot }) {
      prompts.push({ lang, projectRoot });
      return `prompt-${lang}`;
    },
  });
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
    async translate({ targetLang, prompt }) {
      translateCalls.push({ targetLang, prompt });
      return { output_text: `tx-${targetLang}` };
    },
  });
  container.register('Ttp_Back_External_TelegramPublisher$', {
    async publish({ chatId }) { return { result: { message_id: `${chatId}-id`, date: 1735689600 } }; },
  });
  container.register('node:fs', { promises: { readFile: async () => { throw new Error('must not be called'); } } });
  container.register('node:path', { resolve: (...parts) => parts.join('/') });

  const runCycle = await container.get('Ttp_Back_RunCycle$');
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
  const container = await createTestContainer();
  let saved;
  container.register('Ttp_Back_Configuration_Manager$', { get: () => cfg });
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('Ttp_Back_Prompt_Provider$', {
    async getTranslatePrompt({ lang }) { return `prompt-${lang}`; },
  });
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
  container.register('node:fs', { promises: { readFile: async () => { throw new Error('must not be called'); } } });
  container.register('node:path', { resolve: (...parts) => parts.join('/') });

  const runCycle = await container.get('Ttp_Back_RunCycle$');
  const code = await runCycle.execute({ projectRoot: '/project-root' });

  assert.equal(code, 1);
  assert.equal(saved.status, 'failure');
});

test('RunCycle: no ru message', async () => {
  const container = await createTestContainer();
  container.register('Ttp_Back_Configuration_Manager$', { get: () => cfg });
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('Ttp_Back_Prompt_Provider$', {
    async getTranslatePrompt() { return ''; },
  });
  container.register('Ttp_Back_External_TelegramReader$', {
    async getLatestRuMessage() { return null; },
  });
  container.register('Ttp_Back_Storage_Repository$', {
    async existsByRuMessageId() { return false; },
    async saveAggregate() { throw new Error('must not be called'); },
  });
  container.register('Ttp_Back_External_LlmTranslator$', { async translate() { return { output_text: '' }; } });
  container.register('Ttp_Back_External_TelegramPublisher$', { async publish() { return {}; } });
  container.register('node:fs', { promises: { readFile: async () => { throw new Error('must not be called'); } } });
  container.register('node:path', { resolve: (...parts) => parts.join('/') });

  const runCycle = await container.get('Ttp_Back_RunCycle$');
  const code = await runCycle.execute({ projectRoot: '/project-root' });
  assert.equal(code, 0);
});

test('RunCycle: existing aggregate', async () => {
  const container = await createTestContainer();
  container.register('Ttp_Back_Configuration_Manager$', { get: () => cfg });
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('Ttp_Back_Prompt_Provider$', {
    async getTranslatePrompt() { return ''; },
  });
  container.register('Ttp_Back_External_TelegramReader$', {
    async getLatestRuMessage() { return { message_id: '99', text: 'Привет', date: '2026-01-01T00:00:00.000Z' }; },
  });
  container.register('Ttp_Back_Storage_Repository$', {
    async existsByRuMessageId() { return true; },
    async saveAggregate() { throw new Error('must not be called'); },
  });
  container.register('Ttp_Back_External_LlmTranslator$', { async translate() { return { output_text: '' }; } });
  container.register('Ttp_Back_External_TelegramPublisher$', { async publish() { return {}; } });
  container.register('node:fs', { promises: { readFile: async () => { throw new Error('must not be called'); } } });
  container.register('node:path', { resolve: (...parts) => parts.join('/') });

  const runCycle = await container.get('Ttp_Back_RunCycle$');
  const code = await runCycle.execute({ projectRoot: '/project-root' });
  assert.equal(code, 0);
});

test('RunCycle: manual source-file scenario', async () => {
  const container = await createTestContainer();
  let saved;
  let readPath;
  container.register('Ttp_Back_Configuration_Manager$', { get: () => cfg });
  container.register('Ttp_Back_Logger$', { info() {}, exception() {} });
  container.register('Ttp_Back_Prompt_Provider$', {
    async getTranslatePrompt({ lang }) { return `prompt-${lang}`; },
  });
  container.register('Ttp_Back_External_TelegramReader$', {
    async getLatestRuMessage() {
      throw new Error('must not be called');
    },
  });
  container.register('Ttp_Back_Storage_Repository$', {
    async existsByRuMessageId() { return false; },
    async saveAggregate(agg) { saved = agg; },
  });
  container.register('Ttp_Back_External_LlmTranslator$', {
    async translate({ targetLang, text }) {
      return { output_text: `${targetLang}:${text}` };
    },
  });
  container.register('Ttp_Back_External_TelegramPublisher$', {
    async publish({ chatId }) { return { result: { message_id: `${chatId}-id`, date: 1735689600 } }; },
  });
  container.register('node:fs', {
    promises: {
      async readFile(path) {
        readPath = path;
        return 'Ручной пост';
      },
    },
  });
  container.register('node:path', {
    resolve: (...parts) => parts.join('/').replace(/\/+/g, '/'),
  });

  const runCycle = await container.get('Ttp_Back_RunCycle$');
  const code = await runCycle.execute({ projectRoot: '/project-root', sourceFile: './var/manual/post.txt' });

  assert.equal(code, 0);
  assert.equal(readPath, '/project-root/./var/manual/post.txt');
  assert.match(saved.ru_message_id, /^-\d{12}$/);
  assert.equal(saved.ru_original_text, 'Ручной пост');
  assert.equal(saved.status, 'success');
});
