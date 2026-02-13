export default class Ttp_Back_Configuration {
  constructor({ Ttp_Back_Configuration_Loader$: loader }) {
    const loaded = loader.load();
    this.telegram = Object.freeze({
      token: loaded.telegram.token,
      chatId: Object.freeze({
        ru: loaded.telegram.chatId.ru,
        en: loaded.telegram.chatId.en,
        es: loaded.telegram.chatId.es,
      }),
    });
    this.llm = Object.freeze({ apiKey: loaded.llm.apiKey });
    Object.freeze(this);
  }
}
