export default class Ttp_Back_Logger {
  constructor({
    'node:process': process,
    'node:util': util,
  }) {
    const redact = (value) => {
      const raw = typeof value === 'string' ? value : util.inspect(value, { depth: null, breakLength: Infinity });
      return raw
        .replace(/(Bearer\s+)[^\s"']+/gi, '$1***')
        .replace(/((?:api[_-]?key|token|key)\s*[:=\s]\s*)[^\s,;"']+/gi, '$1***');
    };

    const write = (level, context, message, details) => {
      try {
        const timestamp = new Date().toISOString();
        const payload = [`[${timestamp}]`, `[${level}]`, `[${context}]`, redact(message)];
        if (typeof details !== 'undefined') payload.push(redact(details));
        process.stdout.write(`${payload.join(' ')}\n`);
      } catch {
        // logging errors must not break app flow
      }
    };

    this.info = (context, message, details) => write('info', context, message, details);
    this.warn = (context, message, details) => write('warn', context, message, details);
    this.error = (context, message, details) => write('error', context, message, details);
    this.debug = (context, message, details) => write('debug', context, message, details);
    this.exception = (context, err) => {
      const msg = err?.message || String(err);
      const stack = err?.stack || '';
      write('exception', context, msg, stack);
    };
  }
}
