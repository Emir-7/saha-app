require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 📥 REDIS VE AMQPLIB (RABBITMQ) KÜTÜPHANELERİNİ DAHİL ET
const { createClient } = require('redis');
const amqp = require('amqplib');

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

redisClient.connect()
  .then(() => console.log('🚀 Redis Hafıza Katmanı Başarıyla Bağlandı.'))
  .catch(err => console.log('⚠️ Redis Bağlantı Hatası (Sistem MongoDB ile devam ediyor):', err.message));

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
    console.log(`🚀 RabbitMQ '${queue}' Mesaj Kuyruğu Başarıyla Tetiklendi.`);
    
    // Controller dosyalarında erişebilmek için express nesnesine gömüyoruz
    app.set('mqChannel', channel);
  } catch (err) {
    console.log('⚠️ RabbitMQ Lokal Modda: Gerçek kuyruk sunucusu bulunamadı. Sistem simüle moduna alınıyor.');
    
    // 🛡️ LOKAL KORUMA: Bilgisayarda RabbitMQ yoksa uygulamanın kilitlenmesini önlemek için sahte (mock) bir obje bağlıyoruz
    app.set('mqChannel', {
      sendToQueue: (q, msg) => console.log(`[Simüle Kuyruk] ${q} adresine mesaj gönderildi:`, msg.toString()),
      assertQueue: () => Promise.resolve()
    });
  }
}
initRabbitMQ();

// ==========================================

// Yönlendirme (Router) kullanımı
app.use('/api', routesApi);

// Lokal geliştirme için dinleme (Vercel'de çalışmaz, module.exports kullanılır)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Saha-App API ${PORT} portunda başarıyla çalışıyor.`);
  });
}

// Vercel serverless için export
module.exports = app;