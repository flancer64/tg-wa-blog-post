import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createDevContainer } from '../../dev-bootstrap.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');
/** @type {TeqFw_Di_Container} */
const container = await createDevContainer();

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

test('Dev LLM translator: translates RU text to EN with real API call', async (t) => {
  /** @type {Ttp_Back_Configuration} */
  const config = await container.get('Ttp_Back_Configuration$');
  if (!config?.llm?.apiKey) t.skip('Real configuration is missing or LLM API key is absent');

  /** @type {Ttp_Back_External_LlmTranslator} */
  const adapter = await container.get('Ttp_Back_External_LlmTranslator$');
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
  /** @type {Ttp_Back_Configuration} */
  const config = await container.get('Ttp_Back_Configuration$');
  if (!config?.llm?.apiKey) t.skip('Real configuration is missing or LLM API key is absent');

  /** @type {Ttp_Back_External_LlmTranslator} */
  const adapter = await container.get('Ttp_Back_External_LlmTranslator$');
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
