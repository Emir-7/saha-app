const mongoose = require('mongoose');

// dotenv yüklemesini garanti altına almak için process.env kontrolü
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SahaAppDB';

mongoose.connect(dbURI)
    .catch((err) => {
        console.error('MongoDB bağlantı hatası:', err.message);
    });

// Mongoose olay (event) dinleyicileri
mongoose.connection.on('connected', () => {
    console.log(`Mongoose bağlantısı başarılı. Bağlanılan adres: ${dbURI}`);
});
mongoose.connection.on('error', err => {
    console.log(`Mongoose bağlantı hatası: ${err.message}`);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose bağlantısı kesildi');
});

// Şemaları (Modelleri) projeye dahil et
require('./user');
require('./field');
require('./booking');
require('./ticket');
