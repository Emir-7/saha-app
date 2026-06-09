require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Veritabanı bağlantısı ve Mongoose modellerini projeye dahil et (Yollar rest-api içindeki dosyalara göre güncellendi)
require('../rest-api/app_api/models/db');

// Rota (Router) tanımlamalarını içe aktar
const routesApi = require('../rest-api/app_api/routes/index');

const app = express();

app.use(express.json());
const allowedOrigins = ['https://saha-app.onrender.com', 'http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS mismatch'));
    }
  },
  credentials: true
}));

// Yönlendirme (Router) kullanımı
app.use('/api', routesApi);

// Vercel serverless için export
module.exports = app;
