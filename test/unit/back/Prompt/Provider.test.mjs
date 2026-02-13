import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestContainer } from '../../unit-bootstrap.mjs';

function createPathMock() {
  return {
    resolve: (...parts) => parts.join('/').replace(/\/+/g, '/'),
  };
}

test('PromptProvider: loads existing file correctly', async () => {
  const container = await createTestContainer();
  container.register('node:path', createPathMock());
  container.register('node:fs', {
    promises: {
      async readFile(filePath, encoding) {
        assert.equal(filePath, '/project/var/prompt/translate_en.md');
        assert.equal(encoding, 'utf8');
        return 'Custom EN prompt';
      },
    },
  });

  const provider = await container.get('Ttp_Back_Prompt_Provider$');
  const prompt = await provider.getTranslatePrompt({ lang: 'en', projectRoot: '/project' });
  assert.equal(prompt, 'Custom EN prompt');
});

test('PromptProvider: returns fallback when file is missing', async () => {
  const container = await createTestContainer();
  container.register('node:path', createPathMock());
  container.register('node:fs', {
    promises: {
      async readFile() { throw new Error('ENOENT'); },
    },
  });

  const provider = await container.get('Ttp_Back_Prompt_Provider$');
  const prompt = await provider.getTranslatePrompt({ lang: 'en', projectRoot: '/project' });
  assert.equal(prompt, 'Translate to English with cultural adaptation.');
});

test('PromptProvider: returns fallback when file is empty', async () => {
  const container = await createTestContainer();
  container.register('node:path', createPathMock());
  container.register('node:fs', {
    promises: {
      async readFile() { return ''; },
    },
  });

  const provider = await container.get('Ttp_Back_Prompt_Provider$');
  const prompt = await provider.getTranslatePrompt({ lang: 'es', projectRoot: '/project' });
  assert.equal(prompt, 'Translate to Spanish with cultural adaptation.');
});

test('PromptProvider: returns fallback on read error', async () => {
  const container = await createTestContainer();
  container.register('node:path', createPathMock());
  container.register('node:fs', {
    promises: {
      async readFile() { throw new Error('EACCES'); },
    },
  });

  const provider = await container.get('Ttp_Back_Prompt_Provider$');
  const prompt = await provider.getTranslatePrompt({ lang: 'es', projectRoot: '/project' });
  assert.equal(prompt, 'Translate to Spanish with cultural adaptation.');
});

test('PromptProvider: resolves path from provided projectRoot', async () => {
  const container = await createTestContainer();
  let actualPath = '';
  container.register('node:path', createPathMock());
  container.register('node:fs', {
    promises: {
      async readFile(filePath) {
        actualPath = filePath;
        throw new Error('ENOENT');
      },
    },
  });

  const provider = await container.get('Ttp_Back_Prompt_Provider$');
  await provider.getTranslatePrompt({ lang: 'en', projectRoot: '/custom-root' });
  assert.equal(actualPath, '/custom-root/var/prompt/translate_en.md');
});
