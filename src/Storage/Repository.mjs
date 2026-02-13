export default class Ttp_Back_Storage_Repository {
  constructor({
    'node:fs': fs,
    'node:path': path,
    Ttp_Back_Logger$: logger,
  }) {
    const baseDir = '/var/data';

    this.existsByRuMessageId = async (ruMessageId) => {
      if (!fs.existsSync(baseDir)) return false;
      const files = await fs.promises.readdir(baseDir);
      return files.some((name) => name.endsWith(`_${ruMessageId}.json`));
    };

    this.saveAggregate = async (aggregate) => {
      await fs.promises.mkdir(baseDir, { recursive: true });
      const ruMessageId = aggregate.ru_message_id;
      if (await this.existsByRuMessageId(ruMessageId)) {
        throw new Error(`Aggregate already exists for ru_message_id=${ruMessageId}`);
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const finalName = `${timestamp}_${ruMessageId}.json`;
      const finalPath = path.join(baseDir, finalName);
      const tempPath = path.join(baseDir, `.${finalName}.tmp`);
      const data = JSON.stringify(aggregate, null, 2);
      await fs.promises.writeFile(tempPath, data, { encoding: 'utf8', flag: 'wx' });
      await fs.promises.rename(tempPath, finalPath);
      logger?.info?.('Ttp_Back_Storage_Repository', `Aggregate stored: ${finalName}`);
      return finalPath;
    };
  }
}
