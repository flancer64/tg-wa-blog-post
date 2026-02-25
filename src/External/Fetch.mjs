// @ts-check

/**
 * Fetch provider exposing runtime global `fetch` in DI-friendly shape.
 */

export const __deps__ = {};

/**
 * @typedef {Object} Ttp_Back_External_Fetch$Deps
 */

export default class Ttp_Back_External_Fetch {
  /**
   * @param {Ttp_Back_External_Fetch$Deps} deps
   */
  constructor({} = {}) {
    this.default = globalThis.fetch.bind(globalThis);
  }
}
