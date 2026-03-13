import fs from 'node:fs/promises';
import path from 'node:path';
import Container from '@teqfw/di';
import NamespaceRegistry from '@teqfw/di/src/Config/NamespaceRegistry.mjs';
import { fileURLToPath } from 'node:url';
import NodeColonCompatParser from '../../lib/NodeColonCompatParser.mjs';

/**
 * Create and configure DI container for backend dev tests. Load real configuration.
 *
 * @param {{override?: (container: TeqFw_Di_Container) => Promise<void>|void, configOverride?: Object}} [options]
 * @returns {Promise<TeqFw_Di_Container>}
 */
export async function createDevContainer(options = {}) {
  /** @type {TeqFw_Di_Container} */
  const container = new Container();
  container.setParser(new NodeColonCompatParser());
  container.enableTestMode();

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(__dirname, '../..');

  const namespaceRegistry = new NamespaceRegistry({ fs, path, appRoot: projectRoot });
  const entries = await namespaceRegistry.build();
  for (const entry of entries) {
    container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
  }

  // Load real configuration once per container lifecycle.
  /** @type {Ttp_Back_Configuration_Manager} */
  const manager = await container.get('Ttp_Back_Configuration_Manager$');
  manager.load({ projectRoot });
  return container;
}
