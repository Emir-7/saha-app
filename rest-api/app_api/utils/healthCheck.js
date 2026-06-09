/**
 * 🏥 HEALTH CHECK UTILITY
 * ==========================================
 * Docker servislerin (MongoDB, Redis, RabbitMQ, API)
 * bağlantı durumlarını kontrol eden ve raporlayan
 * diagnostik fonksiyon.
 * 
 * Uygulama başlangıcında otomatik olarak çalışır ve
 * tüm altyapı servislerinin durumunu raporlar.
 * ==========================================
 */

const mongoose = require('mongoose');
const logger = require('./logger');

/**
 * Tüm altyapı servislerinin sağlık durumunu kontrol eder.
 * @param {object} app - Express app instance
 * @returns {object} Servis durumları raporu
 */
async function runHealthCheck(app) {
  logger.info('HealthCheck', '🏥 Altyapı Servis Sağlık Kontrolü başlatılıyor...');
  logger.info('HealthCheck', '═══════════════════════════════════════════════');

  const report = {
    timestamp: new Date().toISOString(),
    services: {},
    overallStatus: 'HEALTHY',
  };

  // 1️⃣ MongoDB Durum Kontrolü
  report.services.mongodb = checkMongoDB();

  // 2️⃣ Redis Durum Kontrolü
  report.services.redis = await checkRedis(app);

  // 3️⃣ RabbitMQ Durum Kontrolü
  report.services.rabbitmq = checkRabbitMQ(app);

  // 4️⃣ API Durum Kontrolü (Express kendisi)
  report.services.api = {
    status: 'UP',
    message: 'Express API sunucusu aktif',
    port: process.env.PORT || 9000,
  };
  logger.info('HealthCheck', `  ✅ API Server     → UP (Port: ${report.services.api.port})`);

  // Genel durum hesaplama
  const downServices = Object.entries(report.services)
    .filter(([, svc]) => svc.status === 'DOWN')
    .map(([name]) => name);

  if (downServices.length > 0) {
    report.overallStatus = 'DEGRADED';
    logger.warn('HealthCheck', `═══════════════════════════════════════════════`);
    logger.warn('HealthCheck', `⚠️  Sistem DEGRADED modda çalışıyor. Erişilemeyen servisler: ${downServices.join(', ')}`);
  } else {
    logger.info('HealthCheck', `═══════════════════════════════════════════════`);
    logger.info('HealthCheck', '🎉 Tüm servisler HEALTHY — Sistem tam kapasiteyle çalışıyor.');
  }

  return report;
}

/**
 * MongoDB bağlantı durumunu kontrol eder.
 */
function checkMongoDB() {
  const state = mongoose.connection.readyState;
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  const stateMap = { 0: 'DOWN', 1: 'UP', 2: 'CONNECTING', 3: 'DISCONNECTING' };
  const status = stateMap[state] || 'UNKNOWN';
  const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SahaAppDB';

  if (status === 'UP') {
    logger.info('HealthCheck', `  ✅ MongoDB        → UP (${dbUri})`);
  } else {
    logger.error('HealthCheck', `  ❌ MongoDB        → ${status} (${dbUri})`);
  }

  return { status, uri: dbUri };
}

/**
 * Redis bağlantı durumunu kontrol eder.
 */
async function checkRedis(app) {
  const redisClient = app.get('redisClient');
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  if (!redisClient) {
    logger.error('HealthCheck', `  ❌ Redis          → DOWN (Client bulunamadı)`);
    return { status: 'DOWN', message: 'Redis client mevcut değil' };
  }

  // Mock obje kontrolü (isOpen property'si var ama gerçek ping yok)
  if (typeof redisClient.ping === 'function') {
    try {
      await redisClient.ping();
      logger.info('HealthCheck', `  ✅ Redis          → UP (${redisUrl})`);
      return { status: 'UP', uri: redisUrl };
    } catch (err) {
      logger.error('HealthCheck', `  ❌ Redis          → DOWN (${err.message})`);
      return { status: 'DOWN', message: err.message };
    }
  } else {
    // Mock Redis kullanılıyorsa
    logger.warn('HealthCheck', `  ⚠️  Redis          → MOCK (Simüle mod aktif)`);
    return { status: 'MOCK', message: 'Mock Redis kullanılıyor' };
  }
}

/**
 * RabbitMQ bağlantı durumunu kontrol eder.
 */
function checkRabbitMQ(app) {
  const mqChannel = app.get('mqChannel');
  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

  if (!mqChannel) {
    logger.error('HealthCheck', `  ❌ RabbitMQ       → DOWN (Channel bulunamadı)`);
    return { status: 'DOWN', message: 'MQ channel mevcut değil' };
  }

  // Gerçek channel vs mock obje ayrımı
  if (typeof mqChannel.checkQueue === 'function') {
    logger.info('HealthCheck', `  ✅ RabbitMQ       → UP (${rabbitUrl})`);
    return { status: 'UP', uri: rabbitUrl };
  } else {
    logger.warn('HealthCheck', `  ⚠️  RabbitMQ       → MOCK (Simüle mod aktif)`);
    return { status: 'MOCK', message: 'Mock RabbitMQ kullanılıyor' };
  }
}

module.exports = { runHealthCheck };
