#!/usr/bin/env node

import path from 'node:path';
import processModule from 'node:process';
import { fileURLToPath } from 'node:url';
import Container from '@teqfw/di';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const container = new Container();
// DO NOT use container.register here (tests only)

const resolver = container.getResolver();
resolver.addNamespaceRoot('Ttp_Back_', path.join(projectRoot, 'src'), 'mjs');
resolver.addNamespaceRoot('Teqfw_Di_', path.join(projectRoot, 'node_modules', '@teqfw', 'di', 'src'));

const cliArgs = processModule.argv.slice(2);

const app = await container.get('Ttp_Back_App$');

let exitCode = 1;

try {
  exitCode = await app.run({ projectRoot, cliArgs });
} catch {
  exitCode = 1;
} finally {
  await app.stop();
}

processModule.exit(typeof exitCode === 'number' ? exitCode : 1);
