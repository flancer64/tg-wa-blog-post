export default class Ttp_Back_External_TelegramReader {
  constructor({
    Ttp_Back_Configuration_Manager$: configManager,
    Ttp_Back_Logger$: logger,
    'node:node-fetch': fetch,
  }) {
    const doFetch = fetch?.default || fetch;
    this.getLatestRuMessage = async ({ projectRoot } = {}) => {
      const config = configManager.get();
      let lastErr;
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
          return {
            message_id: latest.message_id,
            text: latest.text || '',
            date: latest.date ? new Date(latest.date * 1000).toISOString() : '',
          };
        } catch (err) {
          lastErr = err;
          logger?.exception?.('Ttp_Back_External_TelegramReader', err);
        }
      }
      throw lastErr;
    };
  }
}
