import assert from 'node:assert/strict';
import test from 'node:test';
import Ttp_Back_External_Fetch from '../../../../src/External/Fetch.mjs';

test('External Fetch: exposes runtime fetch function', () => {
  const provider = new Ttp_Back_External_Fetch();
  assert.equal(typeof provider.default, 'function');
});
