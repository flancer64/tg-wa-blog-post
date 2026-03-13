import assert from 'node:assert/strict';
import test from 'node:test';
import Ttp_Back_App from '../../../src/App.mjs';

test('Ttp_Back_App resolves via constructor injection', () => {
  const app = new Ttp_Back_App({
    configManager: { load() {} },
    runCycle: {
      async execute() {
        return 0;
      },
    },
    logger: { exception() {} },
  });

  assert.ok(app);
  assert.equal(typeof app.run, 'function');
  assert.equal(typeof app.stop, 'function');
});

test('Ttp_Back_App passes parsed --source-file to run-cycle', async () => {
  let runArgs;
  let loadedProjectRoot;
  const app = new Ttp_Back_App({
    configManager: {
      load({ projectRoot }) {
        loadedProjectRoot = projectRoot;
      },
    },
    runCycle: {
      async execute(args) {
        runArgs = args;
        return 0;
      },
    },
    logger: { exception() {} },
  });

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
  let exception;
  const app = new Ttp_Back_App({
    configManager: { load() {} },
    runCycle: {
      async execute() {
        throw new Error('must not be called');
      },
    },
    logger: {
      exception(_scope, err) {
        exception = err;
      },
    },
  });

  const code = await app.run({
    projectRoot: '/project-root',
    cliArgs: ['--source-file'],
  });

  assert.equal(code, 1);
  assert.match(exception.message, /requires a file path/);
});
