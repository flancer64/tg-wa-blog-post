#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import processModule from 'node:process';
import { fileURLToPath } from 'node:url';
import Container from '@teqfw/di/src/Container.mjs';
import NamespaceRegistry from '@teqfw/di/src/Config/NamespaceRegistry.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const container = new Container();
// DO NOT use container.register here (tests only)

container.enableLogging();

const namespaceRegistry = new NamespaceRegistry({ fs, path, appRoot: projectRoot });
const entries = await namespaceRegistry.build();
for (const entry of entries) {
  container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
}

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
