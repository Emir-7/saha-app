require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 📥 REDIS VE AMQPLIB (RABBITMQ) KÜTÜPHANELERİNİ DAHİL ET
const { createClient } = require('redis');
const amqp = require('amqplib');

// 📊 MODERNIZATION: Yapılandırılmış Logger & Middleware
const logger = require('./app_api/utils/logger');
const observabilityMiddleware = require('./app_api/middlewares/observability');
const { runHealthCheck, startHealthCheckLoop } = require('./app_api/utils/healthCheck');

// Veritabanı bağlantısı ve Mongoose modellerini projeye dahil et
require('./app_api/models/db');

// Rota (Router) tanımlamalarını içe aktar
const routesApi = require('./app_api/routes/index');

const app = express();

// ==========================================
// 🔭 OBSERVABILITY MIDDLEWARE — 1. KATMAN (EN ÜSTTE)
// app oluşturulur oluşturulmaz, express.json() ve cors()'tan ÖNCE tanımlanır.
// OPTIONS (CORS preflight) dahil HER isteği yakalar.
// ==========================================
app.use(observabilityMiddleware);

app.use(express.json());

const allowedOrigins = [
  'https://saha-app.onrender.com',
  'https://saha-app-3iwt.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS mismatch'));
    }
  },
  credentials: true,
}));

// ==========================================
// 🏥 HEALTH CHECK ENDPOINT
// Servislerin canlı durumunu döndüren REST endpoint.
// ==========================================
app.get('/api/health', async (req, res) => {
  const report = await runHealthCheck(app);
  const statusCode = report.overallStatus === 'HEALTHY' ? 200 : 503;
  res.status(statusCode).json(report);
});

// ==========================================
// 🛡️ 5. MADDE: ADVANCED TECHNOLOGIES BAĞLANTI KATMANLARI
// ==========================================

// 🟥 1. REDIS BAĞLANTI AYARI (Yapılandırılmış Loglama ile)
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.connect()
  .then(() => {
    logger.info('Redis', '🚀 Redis Hafıza Katmanı Başarıyla Bağlandı.', {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      status: 'connected',
    });
    // Gerçek Redis bağlandıysa, mock'u override et
    app.set('redisClient', redisClient);
  })
  .catch(err => {
    logger.error('Redis', '⚠️ Redis Bağlantı Hatası — Sistem MongoDB ile devam ediyor.', {
      error: err.message,
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      fallback: 'mock-redis',
    });
  });

// İsteklerin route dosyalarında kullanılabilmesi için redisClient'ı express'e bağlıyoruz
app.set('redisClient', redisClient);

// ==========================================
// 🛡️ BAŞLANGIÇ GÜVENLİ VARSAYILANLAR — initRabbitMQ'dan ÖNCE set edilmeli!
// initRabbitMQ() async olduğu için önce mock tanımlanır.
// Bağlantı başarılı olursa app.set() gerçek channel'ı yazar.
// ==========================================
app.set('mqChannel', {
  _isMock: true,
  sendToQueue: (queue, message) => {
    logger.debug('RabbitMQ-Mock', `[Başlangıç geçici mock] '${queue}' kuyruğuna mesaj`, { message: message.toString() });
    return true;
  },
  assertQueue: () => Promise.resolve(),
});

app.set('redisClient', {
  isOpen: false,
  _isMock: true,
  del: async (key) => {
    logger.debug('Redis-Mock', `[Başlangıç geçici mock] Önbellek temizlendi: ${key}`);
    return 1;
  },
});

// 🟨 RABBITMQ BAĞLANTI VE KUYRUK OLUŞTURMA AYARI
// NOT: Başlangıç mock'u YUKARDA set edildi. Bu fonksiyon başarılı bağlantıda
//      app.set('mqChannel', channel) ile gerçek channel'ı yazar.
async function initRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'booking_queue';

    await channel.assertQueue(queue, { durable: true });

    logger.info('RabbitMQ', `🚀 RabbitMQ '${queue}' Mesaj Kuyruğu Başarıyla Tetiklendi.`, {
      url: process.env.RABBITMQ_URL || 'amqp://localhost',
      queue,
      status: 'connected',
      durable: true,
    });

    // ✅ Gerçek channel → mock'un üzerine yaz
    app.set('mqChannel', channel);
  } catch (err) {
    logger.error('RabbitMQ', '⚠️ RabbitMQ Bağlantı Hatası — HealthCheck auto-recovery devralacak.', {
      error: err.message,
      url: process.env.RABBITMQ_URL || 'amqp://localhost',
      bilgi: 'Periyodik HealthCheck döngüsü her 20 saniyede yeniden bağlantı dener.',
    });
    // Mock zaten yukarıda set edildi, burada tekrar set etmeye gerek yok.
  }
}
initRabbitMQ();

// ==========================================
// 🛣️ ROTA TANIMI — observabilityMiddleware rotaya da ekleniyor
// app.use seviyesinde zaten yukarıda tanımlı, burada da redundant
// olarak ekleniyor — router-level bypass ihtimalini tamamen ortadan kaldırır.
// ==========================================
app.use('/api', observabilityMiddleware, routesApi);

// ==========================================
// 🚀 SUNUCU DİNLEME BLOĞU
// Docker ve lokal geliştirme: PORT env değişkeni varsa her zaman dinle.
// Vercel serverless: PORT yoktur, module.exports ile çalışır.
// NOT: NODE_ENV !== 'production' kontrolü KALDIRILDI —
//      docker-compose.yaml'da NODE_ENV=production tanımlı olduğu için
//      bu kontrol Docker'da app.listen()'i engellerdi!
// ==========================================
const SERVER_PORT = process.env.PORT || 9000;
app.listen(SERVER_PORT, () => {
  logger.info('Server', `🚀 Saha-App API ${SERVER_PORT} portunda başarıyla çalışıyor.`, {
    port: SERVER_PORT,
    env: process.env.NODE_ENV || 'development',
    observability: 'ACTIVE ✅',
  });

  // ⏱️ Periyodik HealthCheck döngüsünü başlat (her 10 saniyede bir)
  // setInterval tabanlı — konteyner durduğunda anında DOWN tespit edilir.
  setTimeout(() => {
    startHealthCheckLoop(app);
  }, 2000);
});

// Vercel serverless için export
module.exports = app;