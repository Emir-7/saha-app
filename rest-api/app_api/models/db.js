const mongoose = require('mongoose');

// docker-compose ortam değişkeni veya varsayılan bağlantı adresi (mongodb_kapsayici)
const dbURI = process.env.MONGO_URI || 'mongodb://mongodb_kapsayici:27017/SahaAppDB';

mongoose.connect(dbURI)
    .catch((err) => console.error('MongoDB bağlantı hatası:', err));

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
