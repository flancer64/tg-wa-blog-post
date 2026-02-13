import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from './di-node.mjs';

test('Logger: masks TELEGRAM_TOKEN and LLM_API_KEY', async () => {
  const container = await createTestContainer();
  let output = '';
  container.register('Ttp_Back_Configuration$', {
    telegram: { token: 'tg-secret' },
    llm: { apiKey: 'llm-secret' },
  });
  container.register('node:process', { stdout: { write: (line) => { output += line; } } });
  container.register('node:util', {
    inspect: (v) => JSON.stringify(v),
  });

  const logger = await container.get('Ttp_Back_Logger$');
  logger.error('test', 'token tg-secret key llm-secret');

  assert.equal(output.includes('tg-secret'), false);
  assert.equal(output.includes('llm-secret'), false);
  assert.equal(output.includes('***'), true);
});
