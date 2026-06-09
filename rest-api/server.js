require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 📥 REDIS VE AMQPLIB (RABBITMQ) KÜTÜPHANELERİNİ DAHİL ET
const { createClient } = require('redis');
const amqp = require('amqplib');

// 📊 MODERNIZATION: Yapılandırılmış Logger & Middleware
const logger = require('./app_api/utils/logger');
const observabilityMiddleware = require('./app_api/middlewares/observability');
const { runHealthCheck } = require('./app_api/utils/healthCheck');

// Veritabanı bağlantısı ve Mongoose modellerini projeye dahil et
require('./app_api/models/db');

// Rota (Router) tanımlamalarını içe aktar
const routesApi = require('./app_api/routes/index');

const app = express();

app.use(express.json());
const allowedOrigins = ['https://saha-app.onrender.com', 'https://saha-app-3iwt.vercel.app', 'http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS mismatch'));
    }
  },
  credentials: true
}));

// ==========================================
// 🔭 OBSERVABILITY MIDDLEWARE
// Tüm API rotalarından ÖNCE çalışır.
// Her isteğin METHOD, URL, Response Time ve Status Code bilgisini loglar.
// ==========================================
app.use(observabilityMiddleware);

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
  url: process.env.REDIS_URL || 'redis://localhost:6379'
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

// 🟨 2. RABBITMQ BAĞLANTI VE KUYRUK OLUŞTURMA AYARI (Yapılandırılmış Loglama ile)
async function initRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'booking_queue';

    // Kuyruğu hafızada garantile (Durable: True)
    await channel.assertQueue(queue, { durable: true });

    logger.info('RabbitMQ', `🚀 RabbitMQ '${queue}' Mesaj Kuyruğu Başarıyla Tetiklendi.`, {
      url: process.env.RABBITMQ_URL || 'amqp://localhost',
      queue,
      status: 'connected',
      durable: true,
    });
    
    // Controller dosyalarında erişebilmek için express nesnesine gömüyoruz
    app.set('mqChannel', channel);
  } catch (err) {
    logger.error('RabbitMQ', '⚠️ RabbitMQ Bağlantı Hatası — Sistem simüle moduna alınıyor.', {
      error: err.message,
      url: process.env.RABBITMQ_URL || 'amqp://localhost',
      fallback: 'mock-rabbitmq',
    });
    
    // 🛡️ LOKAL KORUMA: Bilgisayarda RabbitMQ yoksa uygulamanın kilitlenmesini önlemek için sahte (mock) bir obje bağlıyoruz
    app.set('mqChannel', {
      sendToQueue: (q, msg) => {
        logger.debug('RabbitMQ-Mock', `[Simüle Kuyruk] ${q} adresine mesaj gönderildi:`, { message: msg.toString() });
        return true;
      },
      assertQueue: () => Promise.resolve()
    });
  }
}
initRabbitMQ();

// ==========================================

// 🟨 RABBITMQ VE REDIS SIMÜLASYONU (Lokal Geliştirme İçin — Fallback)
app.set('mqChannel', {
  sendToQueue: (queue, message, options) => {
    logger.debug('RabbitMQ-Mock', `'${queue}' kuyruğuna mesaj gönderildi`, { message: JSON.parse(message.toString()) });
    return true;
  }
});

app.set('redisClient', {
  isOpen: true,
  del: async (key) => {
    logger.debug('Redis-Mock', `Önbellek temizlendi: ${key}`);
    return 1;
  }
});

// Yönlendirme (Router) kullanımı
app.use('/api', routesApi);

// Lokal geliştirme için dinleme (Vercel'de çalışmaz, module.exports kullanılır)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    logger.info('Server', `🚀 Saha-App API ${PORT} portunda başarıyla çalışıyor.`);

    // Uygulama başladıktan 2 saniye sonra HealthCheck raporunu çalıştır
    // (Tüm bağlantıların kurulması için bekleme süresi)
    setTimeout(async () => {
      await runHealthCheck(app);
    }, 2000);
  });
}

// Vercel serverless için export
module.exports = app;