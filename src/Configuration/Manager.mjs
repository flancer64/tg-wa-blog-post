// @ts-check

/**
 * Configuration lifecycle manager with single-load contract.
 */

export const __deps__ = Object.freeze({
  loader: 'Ttp_Back_Configuration_Loader$',
});

/**
 * @typedef {Object} Ttp_Back_Configuration_Manager$Deps
 * @property {Ttp_Back_Configuration_Loader} loader
 */

export default class Ttp_Back_Configuration_Manager {
  /**
   * @param {Ttp_Back_Configuration_Manager$Deps} deps
   */
  constructor({ loader }) {
    let config;
    let isLoaded = false;

    const deepFreeze = (value) => {
      if (!value || typeof value !== 'object') return value;
      for (const nested of Object.values(value)) deepFreeze(nested);
      return Object.freeze(value);
    };

    this.load = ({ projectRoot } = {}) => {
      if (isLoaded) throw new Error('Configuration has already been loaded');
      config = deepFreeze(loader.load({ projectRoot }));
      isLoaded = true;
      return config;
    };

    this.get = () => {
      if (!isLoaded) throw new Error('Configuration has not been loaded');
      return config;
    };
  }
}
