require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Veritabanı bağlantısı ve Mongoose modellerini projeye dahil et
require('./app_api/models/db');

// Rota (Router) tanımlamalarını içe aktar
const routesApi = require('./app_api/routes/index');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'https://saha-app.onrender.com' }));

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
