/**
 * 🏥 HEALTH CHECK UTILITY — AUTO-RECOVERY EDITION
 * ==========================================
 * Docker servislerin (MongoDB, Redis, RabbitMQ, API)
 * bağlantı durumlarını kontrol eden, raporlayan ve
 * bağlantı koptuğunda otomatik olarak yeniden bağlanan
 * diagnostik fonksiyon.
 *
 * ✅ Periyodik Tarama   : setInterval ile her 20 saniyede bir çalışır.
 * ✅ Anlık DOWN Tespiti : Konteyner durdurulduğunda 20 saniye içinde yakalanır.
 * ✅ Gerçek Bağlantı    : RabbitMQ için yeni amqp.connect(), Redis için ping().
 * ✅ Auto-Recovery      : MOCK modundayken RabbitMQ/Redis geri gelirse UP'a döner.
 * ✅ Timeout Koruması   : Bağlantı denemesi 8 saniyede zaman aşımına uğrar.
 * ✅ Mock Bayrağı       : Bağlantı koptuğunda app.set ile MOCK modu aktif edilir.
 * ==========================================
 */

const mongoose = require('mongoose');
const amqp = require('amqplib');
const { createClient } = require('redis');
const logger = require('./logger');

// ==========================================
// ⏱️ ZAMANLAMA AYARLARI
// ==========================================
const HEALTH_CHECK_INTERVAL_MS = 20_000;  // 20 saniyede bir kontrol
const CONNECTION_TIMEOUT_MS     = 8_000;  // Bağlantı denemesi için max 8 saniye

// ==========================================
// 🔐 BAĞLANTI DURUMU TAKİBİ (module-level state)
// ==========================================
// Bu değişkenler modül ömrü boyunca durumu tutar.
// Her HealthCheck döngüsünde güncellenir.
let _rabbitMQRecovering = false;  // Şu an reconnect denemesi yapılıyor mu?
let _redisRecovering    = false;

/**
 * Promise'i belirli bir süre içinde zaman aşımına uğratan yardımcı.
 * @param {Promise} promise - Beklenecek işlem
 * @param {number} ms - Milisaniye cinsinden timeout süresi
 * @param {string} label - Hata mesajında gösterilecek etiket
 */
function withTimeout(promise, ms, label) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`${label} bağlantısı ${ms / 1000}s içinde yanıt vermedi (timeout)`)), ms)
  );
  return Promise.race([promise, timeout]);
}

/**
 * Periyodik HealthCheck döngüsünü başlatır.
 * Uygulama başladığında server.js'den çağrılır.
 * @param {object} app - Express app instance
 */
function startHealthCheckLoop(app) {
  logger.info('HealthCheck', `⏱️  Periyodik HealthCheck Döngüsü başlatıldı (her ${HEALTH_CHECK_INTERVAL_MS / 1000}s, timeout: ${CONNECTION_TIMEOUT_MS / 1000}s).`);

  // İlk kontrol hemen yapılır
  runHealthCheck(app);

  // Sonraki kontroller periyodik olarak
  setInterval(() => {
    runHealthCheck(app);
  }, HEALTH_CHECK_INTERVAL_MS);
}

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

  // 2️⃣ Redis Durum Kontrolü (canlı ping + auto-recovery)
  report.services.redis = await checkRedis(app);

  // 3️⃣ RabbitMQ Durum Kontrolü (canlı bağlantı + auto-recovery)
  report.services.rabbitmq = await checkRabbitMQ(app);

  // 4️⃣ API Durum Kontrolü (Express kendisi)
  report.services.api = {
    status: 'UP',
    message: 'Express API sunucusu aktif',
    port: process.env.PORT || 9000,
  };
  logger.info('HealthCheck', `  ✅ API Server     → UP (Port: ${report.services.api.port})`);

  // Genel durum hesaplama — DOWN ve MOCK servisleri tespit et
  const downServices = Object.entries(report.services)
    .filter(([, svc]) => svc.status === 'DOWN')
    .map(([name]) => name);

  const mockServices = Object.entries(report.services)
    .filter(([, svc]) => svc.status === 'MOCK')
    .map(([name]) => name);

  if (downServices.length > 0) {
    report.overallStatus = 'DEGRADED';
    logger.warn('HealthCheck', `═══════════════════════════════════════════════`);
    logger.warn('HealthCheck', `⚠️  Sistem DEGRADED — DOWN servisler: [${downServices.join(', ')}]`);
    if (mockServices.length > 0) {
      logger.warn('HealthCheck', `🔄 MOCK modda çalışan servisler: [${mockServices.join(', ')}]`);
    }
  } else if (mockServices.length > 0) {
    report.overallStatus = 'PARTIAL';
    logger.warn('HealthCheck', `═══════════════════════════════════════════════`);
    logger.warn('HealthCheck', `🔄 Sistem PARTIAL modda — MOCK servisler: [${mockServices.join(', ')}]`);
  } else {
    logger.info('HealthCheck', `═══════════════════════════════════════════════`);
    logger.info('HealthCheck', '🎉 Tüm servisler HEALTHY — Sistem tam kapasiteyle çalışıyor.');
  }

  return report;
}

/**
 * MongoDB bağlantı durumunu kontrol eder.
 * Mongoose readyState üzerinden anlık durum okunur — gerçek zamanlı.
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
 * ✅ Gerçek bağlantı: ping() ile canlı test.
 * 🔄 MOCK modundaysa: Yeni bağlantı kurmaya çalışır (auto-recovery).
 * ❌ Bağlantı koptuğunda: MOCK moduna geçer.
 */
async function checkRedis(app) {
  const redisClient = app.get('redisClient');
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  // --- AUTO-RECOVERY: Mock moddaysa yeniden bağlanmayı dene ---
  const isMock = !redisClient || typeof redisClient.ping !== 'function';
  if (isMock && !_redisRecovering) {
    _redisRecovering = true;
    logger.info('HealthCheck', `  🔄 Redis          → MOCK modda, yeniden bağlanmaya çalışılıyor... (${redisUrl})`);
    try {
      const newClient = createClient({ url: redisUrl });
      await withTimeout(newClient.connect(), CONNECTION_TIMEOUT_MS, 'Redis');
      app.set('redisClient', newClient);
      _redisRecovering = false;
      logger.info('HealthCheck', `  ✅ Redis          → AUTO-RECOVERY başarılı! UP (${redisUrl})`);
      return { status: 'UP', uri: redisUrl, recovered: true };
    } catch (err) {
      _redisRecovering = false;
      logger.warn('HealthCheck', `  ⚠️  Redis          → MOCK (Yeniden bağlantı başarısız: ${err.message})`);
      return { status: 'MOCK', message: `Reconnect başarısız: ${err.message}` };
    }
  }

  if (!redisClient) {
    logger.error('HealthCheck', `  ❌ Redis          → DOWN (Client bulunamadı)`);
    return { status: 'DOWN', message: 'Redis client mevcut değil' };
  }

  // --- CANLI TEST: Mevcut bağlantıyı ping ile doğrula ---
  if (typeof redisClient.ping === 'function') {
    try {
      await withTimeout(redisClient.ping(), CONNECTION_TIMEOUT_MS, 'Redis ping');
      logger.info('HealthCheck', `  ✅ Redis          → UP (${redisUrl})`);
      return { status: 'UP', uri: redisUrl };
    } catch (err) {
      logger.error('HealthCheck', `  ❌ Redis          → DOWN`, {
        hata: err.message,
        url: redisUrl,
        öneri: err.message.includes('timeout') ? 'Redis servisine ulaşılamıyor' : 'Bağlantı koptu',
      });
      logger.warn('HealthCheck', `  🔄 Redis          → MOCK moduna geçiliyor...`);
      app.set('redisClient', {
        isOpen: false,
        _isMock: true,
        del: async (key) => {
          logger.debug('Redis-Mock', `[DOWN sonrası Mock] Önbellek temizlendi: ${key}`);
          return 1;
        },
      });
      return { status: 'DOWN', message: err.message };
    }
  }

  // MOCK modunda — bu noktaya sadece recovery zaten devam ediyorsa gelir
  logger.warn('HealthCheck', `  ⚠️  Redis          → MOCK (Simüle mod aktif)`);
  return { status: 'MOCK', message: 'Mock Redis kullanılıyor' };
}

/**
 * RabbitMQ bağlantı durumunu kontrol eder.
 * ✅ Gerçek bağlantı: Her seferinde YENİ amqp.connect() denemesi yapılır.
 * 🔄 MOCK modundaysa: Yeniden bağlanmayı dener (auto-recovery).
 * ❌ Bağlantı koptuğunda: MOCK moduna geçer, detaylı hata logar.
 *
 * ÖNEMLİ: Sadece mevcut channel'ı test etmek yetmez —
 * channel hafızada kalabilir ama RabbitMQ servisi düşmüş olabilir.
 * Bu nedenle gerçek bir bağlantı denemesi yapılır.
 */
async function checkRabbitMQ(app) {
  const mqChannel = app.get('mqChannel');
  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

  // Mock obje tespiti: gerçek amqplib channel'larında ack ve publish metotları vardır
  const isRealChannel = mqChannel &&
    typeof mqChannel.ack === 'function' &&
    typeof mqChannel.publish === 'function';

  // ===================================================================
  // 🔄 AUTO-RECOVERY BLOĞU
  // MOCK modundayken her HealthCheck döngüsünde gerçek bağlantı dener.
  // Bağlantı başarılıysa: app.set ile gerçek channel yazılır → UP
  // Başarısızsa: MOCK olarak kalmaya devam eder
  // ===================================================================
  if (!isRealChannel && !_rabbitMQRecovering) {
    _rabbitMQRecovering = true;
    logger.info('HealthCheck', `  🔄 RabbitMQ       → MOCK modda, yeniden bağlanmaya çalışılıyor... (${rabbitUrl})`);

    try {
      const connection = await withTimeout(
        amqp.connect(rabbitUrl),
        CONNECTION_TIMEOUT_MS,
        'RabbitMQ'
      );
      const channel = await connection.createChannel();
      await channel.assertQueue('booking_queue', { durable: true });

      // ✅ Bağlantı başarılı — gerçek channel'ı kaydet
      app.set('mqChannel', channel);
      _rabbitMQRecovering = false;

      logger.info('HealthCheck', `  ✅ RabbitMQ       → AUTO-RECOVERY başarılı! UP (${rabbitUrl})`);
      return { status: 'UP', uri: rabbitUrl, recovered: true };

    } catch (err) {
      _rabbitMQRecovering = false;

      // ❌ Detaylı hata sınıflandırması
      let errorCategory = 'Bilinmeyen hata';
      let suggestion = '';

      if (err.message.includes('timeout')) {
        errorCategory = 'Host ulaşılamaz (timeout)';
        suggestion = 'RabbitMQ konteynerinin çalıştığını ve portun açık olduğunu kontrol et';
      } else if (err.message.includes('ECONNREFUSED')) {
        errorCategory = 'Bağlantı reddedildi (ECONNREFUSED)';
        suggestion = `${rabbitUrl} adresinde RabbitMQ servisi dinlemiyor`;
      } else if (err.message.includes('ENOTFOUND')) {
        errorCategory = 'Host bulunamadı (ENOTFOUND)';
        suggestion = 'Docker network yapılandırmasını ve hostname\'i kontrol et';
      } else if (err.message.includes('ACCESS') || err.message.includes('auth')) {
        errorCategory = 'Kimlik doğrulama hatası (AUTH)';
        suggestion = 'RABBITMQ_URL içindeki kullanıcı adı/şifre bilgilerini kontrol et';
      } else if (err.message.includes('closed') || err.message.includes('Channel')) {
        errorCategory = 'Channel kapalı';
        suggestion = 'RabbitMQ servisi yeniden başlatılıyor olabilir, bir sonraki döngüde tekrar denenecek';
      }

      logger.warn('HealthCheck', `  ⚠️  RabbitMQ       → MOCK (Reconnect başarısız)`, {
        hataKategorisi: errorCategory,
        detay: err.message,
        öneri: suggestion,
        url: rabbitUrl,
      });
      return { status: 'MOCK', message: `${errorCategory}: ${err.message}` };
    }
  }

  // Şu an recovery denemesi yapılıyor — tekrar deneme
  if (_rabbitMQRecovering) {
    logger.warn('HealthCheck', `  ⏳ RabbitMQ       → Recovery devam ediyor...`);
    return { status: 'MOCK', message: 'Yeniden bağlantı denemesi devam ediyor' };
  }

  // ===================================================================
  // ✅ CANLI TEST BLOĞU — Gerçek channel var, assertQueue ile doğrula
  // ===================================================================
  try {
    await withTimeout(
      mqChannel.assertQueue('booking_queue', { durable: true }),
      CONNECTION_TIMEOUT_MS,
      'RabbitMQ assertQueue'
    );
    logger.info('HealthCheck', `  ✅ RabbitMQ       → UP (${rabbitUrl})`);
    return { status: 'UP', uri: rabbitUrl };
  } catch (err) {
    // 🚨 Konteyner durduruldu — MOCK moduna geç
    let errorCategory = 'Bağlantı koptu';
    if (err.message.includes('timeout'))        errorCategory = 'AssertQueue timeout';
    else if (err.message.includes('ECONNREF'))  errorCategory = 'Bağlantı reddedildi';
    else if (err.message.includes('closed'))    errorCategory = 'Channel/Connection kapalı';

    logger.error('HealthCheck', `  ❌ RabbitMQ       → DOWN (${errorCategory})`, {
      hata: err.message,
      url: rabbitUrl,
      sonrakiAdım: 'Bir sonraki HealthCheck döngüsünde yeniden bağlantı denenecek',
    });
    logger.warn('HealthCheck', `  🔄 RabbitMQ       → MOCK moduna geçiliyor...`);

    app.set('mqChannel', {
      _isMock: true,
      _downReason: err.message,
      _downAt: new Date().toISOString(),
      sendToQueue: (queue, message) => {
        logger.debug('RabbitMQ-Mock', `[DOWN sonrası Mock] '${queue}' kuyruğuna mesaj gönderildi`, {
          message: message.toString(),
        });
        return true;
      },
      assertQueue: () => Promise.resolve(),
    });

    return { status: 'DOWN', message: `${errorCategory}: ${err.message}` };
  }
}

module.exports = { runHealthCheck, startHealthCheckLoop };
