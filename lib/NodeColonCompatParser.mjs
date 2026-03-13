// @ts-check

import Parser from '../node_modules/@teqfw/di/src/Def/Parser.mjs';

/**
 * Compatibility parser that accepts canonical `node:*` IDs
 * while the current container release still expects `node_*`.
 */
export default class NodeColonCompatParser {
  constructor() {
    const parser = new Parser();

    const normalize = (cdc) => {
      if (typeof cdc !== 'string') return cdc;
      if (cdc.startsWith('node:')) {
        return `node_${cdc.slice(5)}`;
      }
      return cdc;
    };

    this.parse = (cdc) => parser.parse(normalize(cdc));
    this.setLogger = (logger) => {
      if (typeof parser.setLogger === 'function') {
        parser.setLogger(logger);
      }
    };
  }
}
