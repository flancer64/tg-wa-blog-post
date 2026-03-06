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
    const parseCliArgs = (cliArgs = []) => {
      /** @type {{sourceFile?: string}} */
      const options = {};

      for (let i = 0; i < cliArgs.length; i += 1) {
        const arg = cliArgs[i];
        if (arg === '--source-file') {
          const value = cliArgs[i + 1];
          if (!value || value.startsWith('--')) {
            throw new Error('CLI option --source-file requires a file path');
          }
          options.sourceFile = value;
          i += 1;
          continue;
        }
        throw new Error(`Unsupported CLI argument: ${arg}`);
      }

      return Object.freeze(options);
    };

    this.run = async function ({ projectRoot, cliArgs } = {}) {
      try {
        configManager.load({ projectRoot });
        const options = parseCliArgs(cliArgs);
        return await runCycle.execute({ projectRoot, ...options });
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
