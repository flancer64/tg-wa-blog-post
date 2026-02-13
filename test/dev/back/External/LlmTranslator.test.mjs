import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createDevContainer } from '../../dev-bootstrap.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');

const extractOutputText = (response) => {
  if (typeof response?.output_text === 'string') return response.output_text.trim();
  const chunks = response?.output?.flatMap((item) => item?.content || []) || [];
  const textChunk = chunks.find((item) => typeof item?.text === 'string');
  return textChunk?.text?.trim() || '';
};

const isNetworkUnavailable = (err) => {
  const code = err?.cause?.code || err?.code;
  return code === 'EAI_AGAIN' || code === 'ENOTFOUND' || code === 'ECONNREFUSED';
};

const createTranslator = async () => {
  const container = await createDevContainer({
    override: (di) => {
      di.register('Ttp_Back_Logger$', { info() {}, debug() {}, exception() {} });
      di.register('node:node-fetch', globalThis.fetch);
    },
  });
  return container.get('Ttp_Back_External_LlmTranslator$');
};

const loadConfig = async () => {
  const container = await createDevContainer();
  const loader = await container.get('Ttp_Back_Configuration_Loader$');
  try {
    return loader.load({ projectRoot });
  } catch {
    return null;
  }
};

test('Dev LLM translator: translates RU text to EN with real API call', async (t) => {
  const config = await loadConfig();
  if (!config?.llm?.apiKey) t.skip('Real configuration is missing or LLM API key is absent');

  const adapter = await createTranslator();
  const source = 'Привет! Сегодня солнечно и немного ветрено.';
  let response;
  try {
    response = await adapter.translate({
      text: source,
      targetLang: 'en',
      prompt: 'Translate to English. Return only translated text.',
      projectRoot,
    });
  } catch (err) {
    if (isNetworkUnavailable(err)) t.skip(`Network unavailable for OpenAI API: ${err?.cause?.code || err?.code || err?.message}`);
    throw err;
  }

  const translated = extractOutputText(response);
  assert.ok(translated.length > 0, 'expected non-empty translated text');
  assert.notEqual(translated, source, 'expected translated text to differ from source');
});

test('Dev LLM translator: translates RU text to ES with real API call', async (t) => {
  const config = await loadConfig();
  if (!config?.llm?.apiKey) t.skip('Real configuration is missing or LLM API key is absent');

  const adapter = await createTranslator();
  const source = 'Сегодня мы тестируем переводчик для публикаций.';
  let response;
  try {
    response = await adapter.translate({
      text: source,
      targetLang: 'es',
      prompt: 'Translate to Spanish. Return only translated text.',
      projectRoot,
    });
  } catch (err) {
    if (isNetworkUnavailable(err)) t.skip(`Network unavailable for OpenAI API: ${err?.cause?.code || err?.code || err?.message}`);
    throw err;
  }

  const translated = extractOutputText(response);
  assert.ok(translated.length > 0, 'expected non-empty translated text');
  assert.notEqual(translated, source, 'expected translated text to differ from source');
});
