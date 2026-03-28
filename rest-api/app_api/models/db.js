const mongoose = require('mongoose');

// --- KRİTİK DEĞİŞİKLİK BURASI ---
// Eğer Render daki MONGODB_URI varsa onu kullan, yoksa local Docker adresiyle devam et.
const dbURI = process.env.MONGODB_URI || 'mongodb://mongodb_kapsayici:27017/SahaAppDB';

console.log("Bağlanılmaya çalışılan adres:", dbURI.includes("mongodb+srv") ? "Canlı MongoDB (Atlas)" : "Yerel Docker");

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
    console.log('✅ Veritabanı bağlantısı başarıyla kuruldu.');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ Veritabanı bağlantı hatası: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Veritabanı bağlantısı kesildi.');
});

// Modelleri dahil et
require('./field');
require('./user');
require('./booking');