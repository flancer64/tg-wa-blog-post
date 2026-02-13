import Container from '@teqfw/di';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const mergeConfig = (base, override = {}) => ({
  telegram: {
    token: override?.telegram?.token ?? base.telegram.token,
    chatId: {
      ru: override?.telegram?.chatId?.ru ?? base.telegram.chatId.ru,
      en: override?.telegram?.chatId?.en ?? base.telegram.chatId.en,
      es: override?.telegram?.chatId?.es ?? base.telegram.chatId.es,
    },
  },
  llm: {
    apiKey: override?.llm?.apiKey ?? base.llm.apiKey,
  },
});

/**
 * Create and configure DI container for backend dev tests.
 * Loads real configuration and allows partial dependency/config overrides.
 *
 * @param {{override?: (container: TeqFw_Di_Container) => Promise<void>|void, configOverride?: Object}} [options]
 * @returns {Promise<TeqFw_Di_Container>}
 */
export async function createDevContainer(options = {}) {
  /** @type {TeqFw_Di_Container} */
  const container = new Container();
  container.enableTestMode();

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(__dirname, '../..');

  /** @type {TeqFw_Di_Container_Resolver} */
  const resolver = container.getResolver();
  resolver.addNamespaceRoot('Ttp_Back_', path.join(projectRoot, 'src'), 'mjs');
  resolver.addNamespaceRoot('Teqfw_Di_', path.join(projectRoot, 'node_modules', '@teqfw', 'di', 'src'), 'js');

  // Load real configuration 
  /** @type {Ttp_Back_Configuration_Loader} */
  const loader = await container.get('Ttp_Back_Configuration_Loader$');
  return container;
}
