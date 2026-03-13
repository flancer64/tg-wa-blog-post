// @ts-check

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import NamespaceRegistry from '@teqfw/di/src/Config/NamespaceRegistry.mjs';

const COMP_AS_IS = 'A';
const COMP_FACTORY = 'F';
const LIFE_SINGLETON = 'S';

/**
 * @typedef {Object} ParsedDepId
 * @property {'teq'|'node'|'npm'} platform
 * @property {string} moduleName
 * @property {string|null} exportName
 * @property {'A'|'F'} composition
 * @property {'S'|null} life
 * @property {string} origin
 */

/**
 * @typedef {Object} NamespaceRoot
 * @property {string} prefix
 * @property {string} target
 * @property {string} defaultExt
 */

/**
 * Lightweight unit-test container with recursive `__deps__`-aware mocking.
 */
class UnitTestContainer {
  constructor() {
    /** @type {NamespaceRoot[]} */
    const namespaceRoots = [];
    /** @type {Map<string, unknown>} */
    const mocks = new Map();
    /** @type {Map<string, unknown>} */
    const singletons = new Map();
    /** @type {Map<string, object>} */
    const modules = new Map();
    let testMode = false;

    const normalizeCdc = (cdc) => {
      if (typeof cdc !== 'string') return cdc;
      return cdc.startsWith('node:') ? `node_${cdc.slice(5)}` : cdc;
    };

    /**
     * @param {*} value
     * @returns {*}
     */
    const freeze = (value) => {
      if ((value === null) || (value === undefined)) return value;
      const type = typeof value;
      if ((type !== 'object') && (type !== 'function')) return value;
      if (Object.prototype.toString.call(value) === '[object Module]') return value;
      if (Object.isFrozen(value)) return value;
      return Object.freeze(value);
    };

    /**
     * @param {string} cdc
     * @returns {ParsedDepId}
     */
    const parseCdc = (cdc) => {
      const normalized = normalizeCdc(cdc);
      if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(normalized)) {
        throw new Error('CDC must satisfy AsciiCdcIdentifier.');
      }

      /** @type {'teq'|'node'|'npm'} */
      let platform = 'teq';
      let source = normalized;
      if (source.startsWith('node_')) {
        platform = 'node';
        source = source.slice(5);
      } else if (source.startsWith('npm_')) {
        platform = 'npm';
        source = source.slice(4);
      }

      /** @type {'S'|null} */
      let life = null;
      if (source.endsWith('$')) {
        life = LIFE_SINGLETON;
        source = source.slice(0, -1);
      }

      let moduleName = source;
      /** @type {string|null} */
      let exportName = null;
      const delim = source.indexOf('__');
      if (delim >= 0) {
        moduleName = source.slice(0, delim);
        exportName = source.slice(delim + 2);
      } else if (life === LIFE_SINGLETON) {
        exportName = 'default';
      }

      /** @type {'A'|'F'} */
      const composition = (exportName === null) ? COMP_AS_IS : COMP_FACTORY;

      return { platform, moduleName, exportName, composition, life, origin: normalized };
    };

    /**
     * @param {ParsedDepId} depId
     * @returns {string}
     */
    const toSingletonKey = (depId) =>
      `${depId.platform}::${depId.moduleName}::${depId.exportName || ''}::${depId.composition}`;

    /**
     * @param {ParsedDepId} depId
     * @returns {string}
     */
    const resolveSpecifier = (depId) => {
      if (depId.platform === 'node') {
        return `node:${depId.moduleName}`;
      }
      if (depId.platform === 'npm') {
        return depId.moduleName;
      }
      const root = namespaceRoots.find((one) => depId.moduleName.startsWith(one.prefix));
      if (!root) return depId.moduleName;
      const tail = depId.moduleName.slice(root.prefix.length);
      const rel = tail.split('_').join('/');
      const filePath = path.join(root.target, `${rel}${root.defaultExt}`);
      return pathToFileURL(filePath).href;
    };

    /**
     * @param {Function} value
     * @returns {boolean}
     */
    const isConstructible = (value) => {
      try {
        Reflect.construct(String, [], value);
        return true;
      } catch {
        return false;
      }
    };

    /**
     * @param {string} cdc
     * @returns {Promise<*>}
     */
    const getInternal = async (cdc) => {
      const mockKey = normalizeCdc(cdc);
      if (mocks.has(mockKey)) return freeze(mocks.get(mockKey));

      const depId = parseCdc(cdc);
      if (depId.life === LIFE_SINGLETON) {
        const key = toSingletonKey(depId);
        if (singletons.has(key)) return singletons.get(key);
      }

      const specifier = resolveSpecifier(depId);
      let namespace;
      if (modules.has(specifier)) {
        namespace = modules.get(specifier);
      } else {
        namespace = await import(specifier);
        modules.set(specifier, namespace);
      }

      let value;
      if (depId.composition === COMP_AS_IS) {
        value = (depId.exportName === null) ? namespace : namespace[depId.exportName];
      } else {
        const factory = namespace[depId.exportName || 'default'];
        /** @type {Record<string, unknown>} */
        const deps = {};
        /** @type {Record<string, unknown>} */
        const depsDecl = Reflect.get(namespace, '__deps__') || {};
        for (const [name, childCdc] of Object.entries(depsDecl)) {
          deps[name] = await getInternal(/** @type {string} */ (childCdc));
        }
        value = isConstructible(factory) ? new factory(deps) : factory(deps);
      }

      value = freeze(value);
      if (depId.life === LIFE_SINGLETON) {
        singletons.set(toSingletonKey(depId), value);
      }
      return value;
    };

    this.addNamespaceRoot = (prefix, target, defaultExt = '.js') => {
      namespaceRoots.push({ prefix, target, defaultExt });
      namespaceRoots.sort((a, b) => b.prefix.length - a.prefix.length);
    };

    this.enableTestMode = () => {
      testMode = true;
    };

    this.register = (cdc, value) => {
      if (!testMode) throw new Error('Container test mode is disabled.');
      mocks.set(normalizeCdc(cdc), value);
    };

    this.get = (cdc) => getInternal(cdc);
  }
}

/**
 * Create and configure a clean DI container for backend unit tests.
 * @returns {Promise<TeqFw_Di_Container>}
 */
export async function createTestContainer() {
  /** @type {TeqFw_Di_Container} */
  const container = new UnitTestContainer();
  container.enableTestMode();

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(__dirname, '../..');

  const namespaceRegistry = new NamespaceRegistry({ fs, path, appRoot: projectRoot });
  const entries = await namespaceRegistry.build();
  for (const entry of entries) {
    container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
  }

  return container;
}
