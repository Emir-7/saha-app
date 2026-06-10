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

// ✅ MODÜL YÜKLENDİ KONTROLÜ
// Docker loglarında bu satır görünüyorsa dosya başarıyla import edilmiş demektir.
console.log('[OBSERVABILITY] Middleware yüklendi ✅');

/**
 * Observability Middleware
 * Her gelen isteği loglar: METHOD, URL, Response Time, Status Code
 */
function observabilityMiddleware(req, res, next) {
  // 🐛 DEBUG: logger'dan tamamen bağımsız, direkt process.stdout'a yazar.
  // Postman'den istek atıldığında bu satır görünmüyorsa middleware hiç devreye girmiyordur.
  process.stdout.write(`[OBSERVABILITY] ➡️  ${req.method} ${req.originalUrl} — ${new Date().toISOString()}\n`);

  const startTime = process.hrtime.bigint();
  const requestId = generateRequestId();

  // İstek başlangıç bilgisini yapılandırılmış logger ile logla
  logger.info('HTTP', `➡️  ${req.method} ${req.originalUrl}`, {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.socket?.remoteAddress,
    userAgent: req.get('User-Agent') || 'unknown',
  });

  // Yanıt tamamlandığında süreyi hesapla ve logla
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    const statusCode = res.statusCode;

    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    process.stdout.write(`[OBSERVABILITY] ⬅️  ${req.method} ${req.originalUrl} → ${statusCode} (${durationMs.toFixed(2)}ms)\n`);

    logger[level]('HTTP', `⬅️  ${req.method} ${req.originalUrl} → ${statusCode} (${durationMs.toFixed(2)}ms)`, {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      responseTimeMs: parseFloat(durationMs.toFixed(2)),
    });
  });

  // ✅ Her koşulda next() çağrılır — hata olsa bile istek asla bloklanmaz
  try {
    next();
  } catch (err) {
    process.stderr.write(`[OBSERVABILITY] ❌ next() hatası: ${err.message}\n`);
    next(err);
  }
}

/**
 * Basit bir istek kimliği oluşturur (UUID benzeri kısa format)
 */
function generateRequestId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

module.exports = observabilityMiddleware;
