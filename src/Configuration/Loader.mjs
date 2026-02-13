export default class Ttp_Back_Configuration_Loader {
  constructor({
    'node:fs': fs,
    'node:path': path,
    'node:process': process,
  }) {
    this.load = ({ projectRoot } = {}) => {
      if (!projectRoot) {
        throw new Error('Missing required runtime option: projectRoot');
      }
      const envPath = path.resolve(projectRoot, '.env');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const idx = trimmed.indexOf('=');
          if (idx <= 0) continue;
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          if (typeof process.env[key] === 'undefined') process.env[key] = val;
        }
      }

      const required = {
        TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
        TELEGRAM_CHAT_ID_RU: process.env.TELEGRAM_CHAT_ID_RU,
        TELEGRAM_CHAT_ID_EN: process.env.TELEGRAM_CHAT_ID_EN,
        TELEGRAM_CHAT_ID_ES: process.env.TELEGRAM_CHAT_ID_ES,
        LLM_API_KEY: process.env.LLM_API_KEY,
      };
      const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
      if (missing.length) {
        throw new Error(`Missing required env vars: ${missing.join(', ')}`);
      }

      return Object.freeze({
        telegram: Object.freeze({
          token: required.TELEGRAM_TOKEN,
          chatId: Object.freeze({
            ru: required.TELEGRAM_CHAT_ID_RU,
            en: required.TELEGRAM_CHAT_ID_EN,
            es: required.TELEGRAM_CHAT_ID_ES,
          }),
        }),
        llm: Object.freeze({
          apiKey: required.LLM_API_KEY,
        }),
      });
    };
  }
}
