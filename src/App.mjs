// @ts-check

/**
 * Application entrypoint orchestrator resolved by DI container.
 */

export const __deps__ = {
  configManager: 'Ttp_Back_Configuration_Manager$',
  runCycle: 'Ttp_Back_RunCycle$',
  logger: 'Ttp_Back_Logger$',
};

/**
 * @typedef {Object} Ttp_Back_App$Deps
 * @property {Ttp_Back_Configuration_Manager} configManager
 * @property {Ttp_Back_RunCycle} runCycle
 * @property {Ttp_Back_Logger} logger
 */

export default class Ttp_Back_App {
  /**
   * @param {Ttp_Back_App$Deps} deps
   */
  constructor({ configManager, runCycle, logger }) {
    this.run = async function ({ projectRoot, cliArgs } = {}) {
      try {
        configManager.load({ projectRoot });
        return await runCycle.execute({ projectRoot, cliArgs });
      } catch (err) {
        if (logger?.exception) {
          logger.exception('Ttp_Back_App', err);
        }
        return 1;
      }
    };

    this.stop = async function () {
      // no long-living resources in MVP
    };
  }
}
