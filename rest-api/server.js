const express = require('express');
const cors = require('cors');

// Veritabanı bağlantısı ve modelleri dahil et
require('./app_api/models/db');

// Rota tanımlamalarını içe aktar
const routesApi = require('./app_api/routes/index');

const app = express();

// --- KRİTİK AYARLAR ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Ayarları (Frontend portu 3000 için özel olarak yapılandırıldı)
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Yönlendirmesi
app.use('/api', routesApi);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Saha-App API ${PORT} portunda başarıyla çalışıyor.`);
});