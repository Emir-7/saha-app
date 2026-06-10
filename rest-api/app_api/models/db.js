const mongoose = require('mongoose');
const logger = require('../utils/logger');

// dotenv yüklemesini garanti altına almak için process.env kontrolü
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SahaAppDB';

mongoose.connect(dbURI)
    .catch((err) => {
<<<<<<< Updated upstream
        logger.error('MongoDB', 'MongoDB bağlantı hatası', { error: err.message, uri: dbURI });
=======
        console.error('MongoDB bağlantı hatası:', err.message);
>>>>>>> Stashed changes
    });

// Mongoose olay (event) dinleyicileri
mongoose.connection.on('connected', () => {
<<<<<<< Updated upstream
    logger.info('MongoDB', `Mongoose bağlantısı başarılı.`, { uri: dbURI, status: 'connected' });
});
mongoose.connection.on('error', err => {
    logger.error('MongoDB', `Mongoose bağlantı hatası`, { error: err.message, uri: dbURI });
=======
    console.log(`Mongoose bağlantısı başarılı. Bağlanılan adres: ${dbURI}`);
});
mongoose.connection.on('error', err => {
    console.log(`Mongoose bağlantı hatası: ${err.message}`);
>>>>>>> Stashed changes
});
mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB', 'Mongoose bağlantısı kesildi', { uri: dbURI, status: 'disconnected' });
});

// Şemaları (Modelleri) projeye dahil et
require('./user');
require('./field');
require('./booking');
require('./ticket');
