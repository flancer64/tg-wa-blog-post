export default class Ttp_Back_Configuration_Manager {
  constructor({ Ttp_Back_Configuration_Loader$: loader }) {
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
