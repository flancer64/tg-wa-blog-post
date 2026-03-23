// @ts-check

/**
 * Telegram adapter for publishing translated messages.
 */

export const __deps__ = Object.freeze({
  configManager: 'Ttp_Back_Configuration_Manager$',
  logger: 'Ttp_Back_Logger$',
  fetch: 'Ttp_Back_External_Fetch$',
});

/**
 * @typedef {Object} Ttp_Back_External_TelegramPublisher$Deps
 * @property {Ttp_Back_Configuration_Manager} configManager
 * @property {Ttp_Back_Logger} logger
 * @property {Ttp_Back_External_Fetch} fetch
 */

export default class Ttp_Back_External_TelegramPublisher {
  /**
   * @param {Ttp_Back_External_TelegramPublisher$Deps} deps
   */
  constructor({ configManager, logger, fetch }) {
    const doFetch = fetch?.default || fetch;
    const sendJson = async ({ chatId, endpoint, body }) => {
      const config = configManager.get();
      let lastErr;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          logger?.info?.('Ttp_Back_External_TelegramPublisher', `${endpoint} attempt ${attempt} to ${chatId}`);
          const url = `https://api.telegram.org/bot${config.telegram.token}/${endpoint}`;
          const res = await doFetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, ...body }),
          });
          const json = await res.json();
          if (!res.ok || !json.ok) {
            throw new Error(`Telegram ${endpoint} error: ${res.status} ${JSON.stringify(json)}`);
          }
          return json;
        } catch (err) {
          lastErr = err;
          logger?.exception?.('Ttp_Back_External_TelegramPublisher', err);
        }
      }
      throw lastErr;
    };
    this.publish = async ({ chatId, text, projectRoot }) => sendJson({ chatId, endpoint: 'sendMessage', body: { text } });
    this.publishMessage = async ({ chatId, message, projectRoot }) => {
      if (message?.type === 'photo') {
        return sendJson({
          chatId,
          endpoint: 'sendPhoto',
          body: { photo: message.media?.photo?.file_id, caption: message.caption || '' },
        });
      }
      if (message?.type === 'video') {
        return sendJson({
          chatId,
          endpoint: 'sendVideo',
          body: { video: message.media?.video?.file_id, caption: message.caption || '' },
        });
      }
      if (message?.type === 'document') {
        return sendJson({
          chatId,
          endpoint: 'sendDocument',
          body: { document: message.media?.document?.file_id, caption: message.caption || '' },
        });
      }
      return sendJson({ chatId, endpoint: 'sendMessage', body: { text: message?.text || '' } });
    };
  }
}
