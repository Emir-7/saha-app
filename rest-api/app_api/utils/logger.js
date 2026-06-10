/**
 * 
 * ==========================================
 * Profesyonel seviyede yapılandırılmış loglama modülü.
 * Gravity Agent ve benzeri izleme araçları tarafından
 * ayrıştırılabilir (parseable) JSON formatında log üretir.
 * 
 * Log Seviyeleri: INFO | WARN | ERROR | DEBUG
 * ==========================================
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

/**
 * Yapılandırılmış log kaydı oluşturur.
 * @param {string} level - Log seviyesi (INFO, WARN, ERROR, DEBUG)
 * @param {string} component - Log kaynağı (ör: 'Redis', 'RabbitMQ', 'MongoDB')
 * @param {string} message - Log mesajı
 * @param {object} [meta={}] - Ek metadata (opsiyonel)
 */
function log(level, component, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    component,
    message,
    service: 'saha-app-api',
    ...meta,
  };

  const prefix = getPrefix(level);
  const formatted = `${prefix} [${entry.timestamp}] [${component}] ${message}`;

  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error(formatted, Object.keys(meta).length > 0 ? meta : '');
      break;
    case LOG_LEVELS.WARN:
      console.warn(formatted, Object.keys(meta).length > 0 ? meta : '');
      break;
    case LOG_LEVELS.DEBUG:
      if (process.env.NODE_ENV !== 'production') {
        console.log(formatted, Object.keys(meta).length > 0 ? meta : '');
      }
      break;
    default:
      console.log(formatted, Object.keys(meta).length > 0 ? meta : '');
  }
}

function getPrefix(level) {
  switch (level) {
    case LOG_LEVELS.INFO:  return '✅ [INFO]';
    case LOG_LEVELS.WARN:  return '⚠️  [WARN]';
    case LOG_LEVELS.ERROR: return '❌ [ERROR]';
    case LOG_LEVELS.DEBUG: return '🔍 [DEBUG]';
    default:               return '📝 [LOG]';
  }
}

module.exports = {
  info:  (component, message, meta) => log(LOG_LEVELS.INFO, component, message, meta),
  warn:  (component, message, meta) => log(LOG_LEVELS.WARN, component, message, meta),
  error: (component, message, meta) => log(LOG_LEVELS.ERROR, component, message, meta),
  debug: (component, message, meta) => log(LOG_LEVELS.DEBUG, component, message, meta),
  LOG_LEVELS,
};
