import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../unit-bootstrap.mjs';

test('Logger: masks TELEGRAM_TOKEN and LLM_API_KEY', async () => {
  const container = await createTestContainer();
  let output = '';
  container.register('node:process', {
    env: { TELEGRAM_TOKEN: 'tg-secret', LLM_API_KEY: 'llm-secret' },
    stdout: { write: (line) => { output += line; } },
  });
  container.register('node:util', {
    inspect: (v) => JSON.stringify(v),
  });

  const logger = await container.get('Ttp_Back_Logger$');
  logger.error('test', 'token tg-secret key llm-secret');

  assert.equal(output.includes('tg-secret'), false);
  assert.equal(output.includes('llm-secret'), false);
  assert.equal(output.includes('***'), true);
});
