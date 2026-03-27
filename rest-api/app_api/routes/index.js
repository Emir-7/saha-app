const express = require('express');
const router = express.Router();

// Controller dosyasını içeri dahil et
const ctrlSaha = require('../controllers/sahaController');

// Router üzerinde yolları (endpoints) belirle
router.get('/status', ctrlSaha.status);

module.exports = router;
