import Container from '@teqfw/di';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Create and configure DI container for backend dev tests. Load real configuration.
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

  // Load real configuration once per container lifecycle.
  /** @type {Ttp_Back_Configuration_Manager} */
  const manager = await container.get('Ttp_Back_Configuration_Manager$');
  manager.load({ projectRoot });
  return container;
}
