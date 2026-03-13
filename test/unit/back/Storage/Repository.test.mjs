import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../../unit-bootstrap.mjs';

function createMemFs() {
  const files = new Map();
  const dirs = new Set(['/project/var/data']);
  return {
    existsSync(path) { return dirs.has(path); },
    promises: {
      async mkdir(path) { dirs.add(path); },
      async readdir(path) {
        const out = [];
        for (const key of files.keys()) if (key.startsWith(`${path}/`)) out.push(key.slice(path.length + 1));
        return out;
      },
      async writeFile(path, data, opts) {
        if (opts?.flag === 'wx' && files.has(path)) throw new Error('EEXIST');
        files.set(path, data);
      },
      async rename(from, to) {
        if (files.has(to)) throw new Error('EEXIST');
        const content = files.get(from);
        files.delete(from);
        files.set(to, content);
      },
      async readFile(path) { return files.get(path); },
    },
    _files: files,
  };
}

test('Storage: atomic write and JSON structure', async () => {
  const container = await createTestContainer();
  const fs = createMemFs();
  container.register('node:fs', fs);
  container.register('node:path', { join: (...parts) => parts.join('/').replace(/\/+/g, '/') });
  container.register('Ttp_Back_Logger$', { info() {} });

  const storage = await container.get('Ttp_Back_Storage_Repository$');
  const agg = { ru_message_id: '1', status: 'success', ru_original_text: 'x' };
  const pathSaved = await storage.saveAggregate(agg, { projectRoot: '/project' });

  assert.match(pathSaved, /\/project\/var\/data\//);
  const final = [...fs._files.keys()].find((f) => f.endsWith('_1.json'));
  assert.ok(final);
  const content = fs._files.get(final);
  const parsed = JSON.parse(content);
  assert.equal(parsed.ru_message_id, '1');
});

test('Storage: overwrite is forbidden', async () => {
  const container = await createTestContainer();
  const fs = createMemFs();
  container.register('node:fs', fs);
  container.register('node:path', { join: (...parts) => parts.join('/').replace(/\/+/g, '/') });
  container.register('Ttp_Back_Logger$', { info() {} });

  const storage = await container.get('Ttp_Back_Storage_Repository$');
  const agg = { ru_message_id: '2', status: 'success' };
  await storage.saveAggregate(agg, { projectRoot: '/project' });
  await assert.rejects(() => storage.saveAggregate(agg, { projectRoot: '/project' }));
});

test('Storage: exists check by ru_message_id', async () => {
  const container = await createTestContainer();
  const fs = createMemFs();
  container.register('node:fs', fs);
  container.register('node:path', { join: (...parts) => parts.join('/').replace(/\/+/g, '/') });
  container.register('Ttp_Back_Logger$', { info() {} });

  const storage = await container.get('Ttp_Back_Storage_Repository$');
  await storage.saveAggregate({ ru_message_id: '3', status: 'success' }, { projectRoot: '/project' });

  assert.equal(await storage.existsByRuMessageId('3', { projectRoot: '/project' }), true);
  assert.equal(await storage.existsByRuMessageId('404', { projectRoot: '/project' }), false);
});
