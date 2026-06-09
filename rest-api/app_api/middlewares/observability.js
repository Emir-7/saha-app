/**
 * 🔭 OBSERVABILITY MIDDLEWARE
 * ==========================================
 * Gelen her HTTP isteğinin metodunu, URL'ini ve
 * yanıt süresini (response time) terminale basan
 * ve sistem loglarına kaydeden middleware.
 * 
 * Gravity Agent tarafından izlenebilir formatta
 * yapılandırılmış çıktı üretir.
 * ==========================================
 */

const logger = require('../utils/logger');

/**
 * Observability Middleware
 * Her gelen isteği loglar: METHOD, URL, Response Time, Status Code
 */
function observabilityMiddleware(req, res, next) {
  const startTime = process.hrtime.bigint();
  const requestId = generateRequestId();

  // İstek başlangıç bilgisini logla
  logger.info('HTTP', `➡️  ${req.method} ${req.originalUrl}`, {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get('User-Agent') || 'unknown',
  });

  // Yanıt tamamlandığında süreyi hesapla
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    const statusCode = res.statusCode;

    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    logger[level]('HTTP', `⬅️  ${req.method} ${req.originalUrl} → ${statusCode} (${durationMs.toFixed(2)}ms)`, {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      responseTimeMs: parseFloat(durationMs.toFixed(2)),
    });
  });

  next();
}

/**
 * Basit bir istek kimliği oluşturur (UUID benzeri kısa format)
 */
function generateRequestId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

module.exports = observabilityMiddleware;
