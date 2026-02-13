export default class Ttp_Back_Prompt_Provider {
  constructor({
    'node:fs': fs,
    'node:path': path,
  }) {
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
