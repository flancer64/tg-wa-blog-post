// @ts-check

/**
 * Telegram adapter for reading the latest source-channel message.
 */

export const __deps__ = Object.freeze({
  configManager: 'Ttp_Back_Configuration_Manager$',
  logger: 'Ttp_Back_Logger$',
  fetch: 'Ttp_Back_External_Fetch$',
});

/**
 * @typedef {Object} Ttp_Back_External_TelegramReader$Deps
 * @property {Ttp_Back_Configuration_Manager} configManager
 * @property {Ttp_Back_Logger} logger
 * @property {Ttp_Back_External_Fetch} fetch
 */

export default class Ttp_Back_External_TelegramReader {
  /**
   * @param {Ttp_Back_External_TelegramReader$Deps} deps
   */
  constructor({ configManager, logger, fetch }) {
    const doFetch = fetch?.default || fetch;
    this.getLatestRuMessage = async ({ projectRoot } = {}) => {
      const config = configManager.get();
      let lastErr;
      const normalizeMessage = (message) => {
        const date = message.date ? new Date(message.date * 1000).toISOString() : '';
        if (message.photo?.length) {
          return {
            message_id: message.message_id,
            type: 'photo',
            text: '',
            caption: message.caption || '',
            media: { photo: message.photo[message.photo.length - 1] },
            date,
          };
        }
        if (message.video) {
          return {
            message_id: message.message_id,
            type: 'video',
            text: '',
            caption: message.caption || '',
            media: { video: message.video },
            date,
          };
        }
        if (message.document) {
          return {
            message_id: message.message_id,
            type: 'document',
            text: '',
            caption: message.caption || '',
            media: { document: message.document },
            date,
          };
        }
        return {
          message_id: message.message_id,
          type: 'text',
          text: message.text || '',
          caption: '',
          media: null,
          date,
        };
      };
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          logger?.info?.('Ttp_Back_External_TelegramReader', `getUpdates attempt ${attempt}`);
          const url = `https://api.telegram.org/bot${config.telegram.token}/getUpdates`;
          const res = await doFetch(url, { method: 'GET' });
          const json = await res.json();
          if (!res.ok || !json.ok) {
            throw new Error(`Telegram getUpdates error: ${res.status} ${JSON.stringify(json)}`);
          }
          const items = (json.result || [])
            .map((entry) => entry?.channel_post)
            .filter((post) => post && String(post.chat?.id) === String(config.telegram.chatId.ru));
          if (!items.length) return null;
          const latest = items.sort((a, b) => (a.message_id > b.message_id ? -1 : 1))[0];
          return normalizeMessage(latest);
        } catch (err) {
          lastErr = err;
          logger?.exception?.('Ttp_Back_External_TelegramReader', err);
        }
      }
      throw lastErr;
    };
  }
}
