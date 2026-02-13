import Container from '@teqfw/di';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function createTestContainer() {
  const container = new Container();
  container.enableTestMode();

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(__dirname, '..');

  const resolver = container.getResolver();
  resolver.addNamespaceRoot('Ttp_Back_', path.join(projectRoot, 'src'), 'mjs');
  resolver.addNamespaceRoot('Teqfw_Di_', path.join(projectRoot, 'node_modules', '@teqfw', 'di', 'src'));

  return container;
}
