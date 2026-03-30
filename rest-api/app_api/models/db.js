const mongoose = require('mongoose');

// Bağlantı adresi (Vercel/Atlas için MONGO_URI, Lokal için localhost)
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SahaAppDB';

mongoose.connect(dbURI)
    .catch((err) => {
        console.error('MongoDB bağlantı hatası:', err);
        console.log('Lütfen yerel MongoDB servisinin (localhost:27017) çalıştığından emin olun.');
    });

// Mongoose olay (event) dinleyicileri
mongoose.connection.on('connected', () => {
    console.log(`Mongoose ${dbURI} adresine başarıyla bağlandı`);
});
mongoose.connection.on('error', err => {
    console.log(`Mongoose bağlantı hatası: ${err}`);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose bağlantısı kesildi');
});

// Şemaları (Modelleri) projeye dahil et
require('./user');
require('./field');
require('./booking');
require('./ticket');
