import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from './di-node.mjs';

test('Aggregate: immutable object', async () => {
  const container = await createTestContainer();
  const factory = await container.get('Ttp_Back_Aggregate_Factory$');
  const agg = factory.create({
    ru: { message_id: 1, text: 'ru', date: '2026-01-01' },
    en: { ok: true, text: 'en', message_id: 11, published_at: '2026-01-01' },
    es: { ok: true, text: 'es', message_id: 12, published_at: '2026-01-01' },
  });
  assert.equal(Object.isFrozen(agg), true);
});

test('Aggregate: binary status', async () => {
  const container = await createTestContainer();
  const factory = await container.get('Ttp_Back_Aggregate_Factory$');
  const success = factory.create({ ru: { message_id: 1, text: '', date: '' }, en: { ok: true }, es: { ok: true } });
  const failure = factory.create({ ru: { message_id: 2, text: '', date: '' }, en: { ok: true }, es: { ok: false } });
  assert.equal(success.status, 'success');
  assert.equal(failure.status, 'failure');
});

test('Aggregate: required structure', async () => {
  const container = await createTestContainer();
  const factory = await container.get('Ttp_Back_Aggregate_Factory$');
  const agg = factory.create({
    ru: { message_id: 1, text: 'ru', date: '2026-01-01' },
    en: { ok: false },
    es: { ok: false },
  });
  for (const key of ['ru_message_id', 'ru_original_text', 'ru_published_at', 'en_text', 'en_message_id', 'en_published_at', 'es_text', 'es_message_id', 'es_published_at', 'status']) {
    assert.ok(Object.hasOwn(agg, key));
  }
});
