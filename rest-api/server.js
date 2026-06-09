require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 📥 REDIS VE AMQPLIB (RABBITMQ) KÜTÜPHANELERİNİ DAHİL ET
const { createClient } = require('redis');
const amqp = require('amqplib');

// Observability Middleware ve Gravity Agent Logger'ı dahil et
const { logger, observabilityMiddleware } = require('./app_api/middleware/gravityLogger');

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
// 🛡️ 5. MADDE: ADVANCED TECHNOLOGIES BAĞLANTI KATMANLARI
// ==========================================

// 🟥 1. REDIS BAĞLANTI AYARI (Sistem Çökmesini Önleyen Catch Yapılı)
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

let redisConnected = false;
redisClient.connect()
  .then(() => {
    redisConnected = true;
    logger.info('Redis Hafıza Katmanı Başarıyla Bağlandı.');
  })
  .catch(err => {
    redisConnected = false;
    logger.error(`Redis Bağlantı Hatası (Sistem MongoDB ile devam ediyor): ${err.message}`);
  });

// İsteklerin route dosyalarında kullanılabilmesi için redisClient'ı express'e bağlıyoruz
app.set('redisClient', redisClient);

// 🟨 2. RABBITMQ BAĞLANTI VE KUYRUK OLUŞTURMA AYARI (Lokal Koruma Güvenlik Protokolü)
async function initRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'booking_queue';

    // Kuyruğu hafızada garantile (Durable: True)
    await channel.assertQueue(queue, { durable: true });
    logger.info(`RabbitMQ '${queue}' Mesaj Kuyruğu Başarıyla Tetiklendi.`);
    
    // Controller dosyalarında erişebilmek için express nesnesine gömüyoruz
    app.set('mqChannel', channel);
    app.set('rabbitmqConnected', true);
  } catch (err) {
    logger.error(`RabbitMQ Lokal Modda: Gerçek kuyruk sunucusu bulunamadı. Sistem simüle moduna alınıyor. Hata: ${err.message}`);
    
    // 🛡️ LOKAL KORUMA: Bilgisayarda RabbitMQ yoksa uygulamanın kilitlenmesini önlemek için sahte (mock) bir obje bağlıyoruz
    app.set('mqChannel', {
      sendToQueue: (q, msg) => logger.info(`[Simüle Kuyruk] ${q} adresine mesaj gönderildi: ${msg.toString()}`),
      assertQueue: () => Promise.resolve()
    });
    app.set('rabbitmqConnected', false);
  }
}
initRabbitMQ();

// 🔍 DOCKER ENTEGRASYON KANITI: Uygulama başlangıcında tüm servislerin durumunu kontrol eden HealthCheck fonksiyonu
async function runHealthCheck() {
  setTimeout(async () => {
    logger.info('--- 🏥 SİSTEM SAĞLIK VE BAĞLANTI RAPORU (HEALTH CHECK) ---');
    
    // 1. API Servisi Durumu
    logger.info('API Servisi: ÇALIŞIYOR (UP)');
    
    // 2. MongoDB Durumu
    const mongoState = mongoose.connection.readyState;
    const mongoStatus = mongoState === 1 ? 'BAĞLI (UP)' : 'BAĞLI DEĞİL (DOWN)';
    if (mongoState === 1) {
      logger.info(`MongoDB Servis Durumu: ${mongoStatus}`);
    } else {
      logger.error(`MongoDB Servis Durumu: ${mongoStatus}`);
    }
    
    // 3. Redis Durumu
    const redisStatus = redisConnected ? 'BAĞLI (UP)' : 'BAĞLI DEĞİL (DOWN)';
    if (redisConnected) {
      logger.info(`Redis Servis Durumu: ${redisStatus}`);
    } else {
      logger.error(`Redis Servis Durumu: ${redisStatus}`);
    }
    
    // 4. RabbitMQ Durumu
    const rabbitmqConnected = app.get('rabbitmqConnected');
    const rabbitmqStatus = rabbitmqConnected ? 'BAĞLI (UP)' : 'BAĞLI DEĞİL / SİMÜLE (DOWN)';
    if (rabbitmqConnected) {
      logger.info(`RabbitMQ Servis Durumu: ${rabbitmqStatus}`);
    } else {
      logger.error(`RabbitMQ Servis Durumu: ${rabbitmqStatus}`);
    }
    
    logger.info('---------------------------------------------------------');
  }, 3500);
}
runHealthCheck();

// ==========================================
// Observability Middleware: Rota işlemlerinden önce gelen istekleri izler
app.use(observabilityMiddleware);

// Yönlendirme (Router) kullanımı
app.use('/api', routesApi);

// Lokal geliştirme için dinleme (Vercel'de çalışmaz, module.exports kullanılır)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    logger.info(`Saha-App API ${PORT} portunda başarıyla çalışıyor.`);
  });
}

// Vercel serverless için export
module.exports = app;