export default class Ttp_Back_External_LlmTranslator {
  constructor({
    Ttp_Back_Configuration_Manager$: configManager,
    Ttp_Back_Logger$: logger,
    'node:node-fetch': fetch,
  }) {
    const doFetch = fetch?.default || fetch;
    this.translate = async ({ text, targetLang, prompt, projectRoot }) => {
      const config = configManager.get();
      let lastErr;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          logger?.info?.('Ttp_Back_External_LlmTranslator', `translate attempt ${attempt} for ${targetLang}`);
          const response = await doFetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.llm.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4.1-mini',
              input: `${prompt}\n\n${text}`,
            }),
          });
          const json = await response.json();
          if (!response.ok) throw new Error(`LLM API error ${response.status}: ${JSON.stringify(json)}`);
          logger?.debug?.('Ttp_Back_External_LlmTranslator', 'LLM response', json);
          return json;
        } catch (err) {
          lastErr = err;
          logger?.exception?.('Ttp_Back_External_LlmTranslator', err);
        }
      }
      throw lastErr;
    };
  }
}
