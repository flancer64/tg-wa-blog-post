import assert from 'node:assert/strict';
import test from 'node:test';
import Ttp_Back_Prompt_Provider from '../../../../src/Prompt/Provider.mjs';

function createPathMock() {
  return {
    resolve: (...parts) => parts.join('/').replace(/\/+/g, '/'),
  };
}

test('PromptProvider: loads existing file correctly', async () => {
  const provider = new Ttp_Back_Prompt_Provider({
    path: createPathMock(),
    fs: {
      promises: {
        async readFile(filePath, encoding) {
          assert.equal(filePath, '/project/var/prompt/translate_en.md');
          assert.equal(encoding, 'utf8');
          return 'Custom EN prompt';
        },
      },
    },
  });

  const prompt = await provider.getTranslatePrompt({ lang: 'en', projectRoot: '/project' });
  assert.equal(prompt, 'Custom EN prompt');
});

test('PromptProvider: returns fallback when file is missing', async () => {
  const provider = new Ttp_Back_Prompt_Provider({
    path: createPathMock(),
    fs: {
      promises: {
        async readFile() {
          throw new Error('ENOENT');
        },
      },
    },
  });

  const prompt = await provider.getTranslatePrompt({ lang: 'en', projectRoot: '/project' });
  assert.equal(prompt, 'Translate to English with cultural adaptation.');
});

test('PromptProvider: returns fallback when file is empty', async () => {
  const provider = new Ttp_Back_Prompt_Provider({
    path: createPathMock(),
    fs: {
      promises: {
        async readFile() {
          return '';
        },
      },
    },
  });

  const prompt = await provider.getTranslatePrompt({ lang: 'es', projectRoot: '/project' });
  assert.equal(prompt, 'Translate to Spanish with cultural adaptation.');
});

test('PromptProvider: returns fallback on read error', async () => {
  const provider = new Ttp_Back_Prompt_Provider({
    path: createPathMock(),
    fs: {
      promises: {
        async readFile() {
          throw new Error('EACCES');
        },
      },
    },
  });

  const prompt = await provider.getTranslatePrompt({ lang: 'es', projectRoot: '/project' });
  assert.equal(prompt, 'Translate to Spanish with cultural adaptation.');
});

test('PromptProvider: resolves path from provided projectRoot', async () => {
  let actualPath = '';
  const provider = new Ttp_Back_Prompt_Provider({
    path: createPathMock(),
    fs: {
      promises: {
        async readFile(filePath) {
          actualPath = filePath;
          throw new Error('ENOENT');
        },
      },
    },
  });

  await provider.getTranslatePrompt({ lang: 'en', projectRoot: '/custom-root' });
  assert.equal(actualPath, '/custom-root/var/prompt/translate_en.md');
});
