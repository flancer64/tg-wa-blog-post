export default class Ttp_Back_App {
  constructor({
    Ttp_Back_RunCycle$: runCycle,
    Ttp_Back_Logger$: logger,
  }) {
    this.run = async function ({ projectRoot, cliArgs } = {}) {
      try {
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
