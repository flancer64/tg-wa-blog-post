import assert from 'node:assert/strict';
import test from 'node:test';
import Ttp_Back_Logger from '../../../src/Logger.mjs';

test('Logger: masks TELEGRAM_TOKEN and LLM_API_KEY', () => {
  let output = '';
  const logger = new Ttp_Back_Logger({
    process: {
      env: { TELEGRAM_TOKEN: 'tg-secret', LLM_API_KEY: 'llm-secret' },
      stdout: { write: (line) => { output += line; } },
    },
    util: {
      inspect: (v) => JSON.stringify(v),
    },
  });

  logger.error('test', 'token tg-secret key llm-secret');

  assert.equal(output.includes('tg-secret'), false);
  assert.equal(output.includes('llm-secret'), false);
  assert.equal(output.includes('***'), true);
});
