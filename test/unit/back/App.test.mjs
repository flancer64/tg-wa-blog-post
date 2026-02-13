import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../unit-bootstrap.mjs';

test('Ttp_Back_App resolves via DI container', async () => {
  const container = await createTestContainer();

  container.register('Ttp_Back_RunCycle$', {
    async execute() {
      return 0;
    },
  });

  container.register('Ttp_Back_Logger$', {
    exception() {},
  });

  const app = await container.get('Ttp_Back_App$');

  assert.ok(app);
  assert.equal(typeof app.run, 'function');
  assert.equal(typeof app.stop, 'function');
});
