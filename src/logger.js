const info = (...args) => console.log('[INFO]', ...args);
const error = (...args) => console.error('[ERROR]', ...args);
const debug = (...args) => {
  if (process.env.DEBUG) {
    console.log('[DEBUG]', ...args);
  }
};

module.exports = {
  info,
  error,
  debug
};


