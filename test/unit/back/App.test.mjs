import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../unit-bootstrap.mjs';

test('Ttp_Back_App resolves via DI container', async () => {
  const container = await createTestContainer();

  container.register('Ttp_Back_Configuration_Manager$', {
    load() {},
  });
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

test('Ttp_Back_App passes parsed --source-file to run-cycle', async () => {
  const container = await createTestContainer();
  let runArgs;
  let loadedProjectRoot;

  container.register('Ttp_Back_Configuration_Manager$', {
    load({ projectRoot }) { loadedProjectRoot = projectRoot; },
  });
  container.register('Ttp_Back_RunCycle$', {
    async execute(args) {
      runArgs = args;
      return 0;
    },
  });
  container.register('Ttp_Back_Logger$', { exception() {} });

  const app = await container.get('Ttp_Back_App$');
  const code = await app.run({
    projectRoot: '/project-root',
    cliArgs: ['--source-file', './var/manual/post.txt'],
  });

  assert.equal(code, 0);
  assert.equal(loadedProjectRoot, '/project-root');
  assert.deepEqual(runArgs, {
    projectRoot: '/project-root',
    sourceFile: './var/manual/post.txt',
  });
});

test('Ttp_Back_App returns failure for invalid --source-file usage', async () => {
  const container = await createTestContainer();
  let exception;

  container.register('Ttp_Back_Configuration_Manager$', {
    load() {},
  });
  container.register('Ttp_Back_RunCycle$', {
    async execute() {
      throw new Error('must not be called');
    },
  });
  container.register('Ttp_Back_Logger$', {
    exception(_scope, err) { exception = err; },
  });

  const app = await container.get('Ttp_Back_App$');
  const code = await app.run({
    projectRoot: '/project-root',
    cliArgs: ['--source-file'],
  });

  assert.equal(code, 1);
  assert.match(exception.message, /requires a file path/);
});
