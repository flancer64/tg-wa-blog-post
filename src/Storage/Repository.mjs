export default class Ttp_Back_Storage_Repository {
  constructor({
    'node:fs': fs,
    'node:path': path,
    Ttp_Back_Logger$: logger,
  }) {
    const resolveBaseDir = (projectRoot) => {
      if (!projectRoot) throw new Error('projectRoot is required for storage path resolution');
      return path.join(projectRoot, 'var', 'data');
    };

    this.existsByRuMessageId = async (ruMessageId, { projectRoot } = {}) => {
      const baseDir = resolveBaseDir(projectRoot);
      if (!fs.existsSync(baseDir)) return false;
      const files = await fs.promises.readdir(baseDir);
      return files.some((name) => name.endsWith(`_${ruMessageId}.json`));
    };

    this.saveAggregate = async (aggregate, { projectRoot } = {}) => {
      const baseDir = resolveBaseDir(projectRoot);
      await fs.promises.mkdir(baseDir, { recursive: true });
      const ruMessageId = aggregate.ru_message_id;
      if (await this.existsByRuMessageId(ruMessageId, { projectRoot })) {
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
