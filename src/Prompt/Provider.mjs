// @ts-check

/**
 * Prompt provider with filesystem-backed overrides and defaults.
 */

export const __deps__ = Object.freeze({
  fs: 'node:fs',
  path: 'node:path',
});

/**
 * @typedef {Object} Ttp_Back_Prompt_Provider$Deps
 * @property {typeof import('node:fs')} fs
 * @property {typeof import('node:path')} path
 */

export default class Ttp_Back_Prompt_Provider {
  /**
   * @param {Ttp_Back_Prompt_Provider$Deps} deps
   */
  constructor({ fs, path }) {
    const DEFAULTS = Object.freeze({
      en: 'Translate to English with cultural adaptation.',
      es: 'Translate to Spanish with cultural adaptation.',
    });

    const FILES = Object.freeze({
      en: 'translate_en.md',
      es: 'translate_es.md',
    });

    this.getTranslatePrompt = async ({ lang, projectRoot } = {}) => {
      if (!projectRoot) throw new Error('Missing required runtime option: projectRoot');
      const fileName = FILES[lang];
      if (!fileName) throw new Error(`Unsupported translation language: ${lang}`);

      const filePath = path.resolve(projectRoot, 'var', 'prompt', fileName);
      try {
        const raw = await fs.promises.readFile(filePath, 'utf8');
        if (typeof raw === 'string' && raw.trim().length > 0) return raw;
      } catch {
        // Fallback is required by contract and must not throw.
      }
      return DEFAULTS[lang];
    };
  }
}
