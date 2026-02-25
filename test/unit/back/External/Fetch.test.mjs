import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../../unit-bootstrap.mjs';

test('External Fetch: exposes runtime fetch function', async () => {
  const container = await createTestContainer();
  const provider = await container.get('Ttp_Back_External_Fetch$');
  assert.equal(typeof provider.default, 'function');
});
