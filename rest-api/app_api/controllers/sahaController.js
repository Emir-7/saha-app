const mongoose = require('mongoose');
const Field = mongoose.model('Field');
const { logger } = require('../middleware/gravityLogger');

// 9 - Sahaları listeleme
const listFields = async (req, res) => {
    try {
        // Sunum için: Redis Cache entegrasyonu
        const redisClient = req.app.get('redisClient');
        const cacheKey = 'fields:all';

        if (redisClient) {
            try {
                const cachedFields = await redisClient.get(cacheKey);
                if (cachedFields) {
                    logger.info("Veri Redis Cache'ten getirildi.", { cacheKey });
                    return res.status(200).json(JSON.parse(cachedFields));
                }
            } catch (cacheErr) {
                logger.error(`[Redis Cache] Cache okuma hatası: ${cacheErr.message}`);
            }
        }

        const fields = await Field.find();
        logger.info("Veri MongoDB'den getirildi.");

        if (redisClient) {
            try {
                // Sunum için: Redis Cache entegrasyonu
                await redisClient.set(cacheKey, JSON.stringify(fields), { EX: 3600 });
                logger.info("Sahalar cache'e kaydedildi.", { cacheKey });
            } catch (cacheErr) {
                logger.error(`[Redis Cache] Cache yazma hatası: ${cacheErr.message}`);
            }
        }

        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ error: 'Sahalar listelenirken bir hata oluştu.', details: error.message });
    }
};

// 10 - Detay görüntüleme
const getField = async (req, res) => {
    try {
        const { fieldId } = req.params;
        const redisClient = req.app.get('redisClient');
        const cacheKey = `fields:${fieldId}`;

        if (redisClient) {
            try {
                const cachedField = await redisClient.get(cacheKey);
                if (cachedField) {
                    logger.info(`Saha ${fieldId} detay verisi Redis Cache'ten getirildi.`, { fieldId });
                    return res.status(200).json(JSON.parse(cachedField));
                }
            } catch (cacheErr) {
                logger.error(`[Redis Cache] Cache okuma hatası: ${cacheErr.message}`);
            }
        }

        const field = await Field.findById(fieldId);

        if (!field) {
            return res.status(404).json({ error: 'İstenilen saha bulunamadı.' });
        }
        logger.info(`Saha ${fieldId} detay verisi MongoDB'den getirildi.`, { fieldId });

        if (redisClient) {
            try {
                await redisClient.set(cacheKey, JSON.stringify(field), { EX: 3600 });
                logger.info(`Saha ${fieldId} detay verisi cache'e kaydedildi.`, { fieldId });
            } catch (cacheErr) {
                logger.error(`[Redis Cache] Cache yazma hatası: ${cacheErr.message}`);
            }
        }

        res.status(200).json(field);
    } catch (error) {
        res.status(500).json({ error: 'Saha detayları getirilirken hata oluştu.', details: error.message });
    }
};

// 11 - Yeni saha ekleme
const addField = async (req, res) => {
    try {
        const newField = await Field.create(req.body);

        // Sunum için: Redis Cache entegrasyonu (Yeni saha eklenince önbelleği geçersiz kıl)
        const redisClient = req.app.get('redisClient');
        if (redisClient) {
            await redisClient.del('fields:all').catch(err => logger.error(`[Redis Cache] Cache silme hatası: ${err.message}`));
        }

        res.status(201).json(newField);
    } catch (error) {
        res.status(400).json({ error: 'Saha eklenirken hata oluştu. Lütfen gönderilen verileri kontrol edin.', details: error.message });
    }
};

// 12 - Saha bilgisi güncelleme
const updateField = async (req, res) => {
    try {
        const { fieldId } = req.params;
        const updatedField = await Field.findByIdAndUpdate(fieldId, req.body, { new: true, runValidators: true });

        if (!updatedField) {
            return res.status(404).json({ error: 'Güncellenecek saha bulunamadı.' });
        }

        // Sunum için: Redis Cache entegrasyonu (Saha güncellenince hem tüm listeyi hem de tekil önbelleği geçersiz kıl)
        const redisClient = req.app.get('redisClient');
        if (redisClient) {
            await Promise.all([
                redisClient.del('fields:all'),
                redisClient.del(`fields:${fieldId}`)
            ]).catch(err => logger.error(`[Redis Cache] Cache silme hatası: ${err.message}`));
        }

        res.status(200).json(updatedField);
    } catch (error) {
        res.status(400).json({ error: 'Saha bilgileri güncellenirken hata oluştu.', details: error.message });
    }
};

// 13 - Saha silme
const deleteField = async (req, res) => {
    try {
        const { fieldId } = req.params;
        const deletedField = await Field.findByIdAndDelete(fieldId);

        if (!deletedField) {
            return res.status(404).json({ error: 'Silinecek saha bulunamadı.' });
        }

        // Sunum için: Redis Cache entegrasyonu (Saha silinince hem tüm listeyi hem de tekil önbelleği geçersiz kıl)
        const redisClient = req.app.get('redisClient');
        if (redisClient) {
            await Promise.all([
                redisClient.del('fields:all'),
                redisClient.del(`fields:${fieldId}`)
            ]).catch(err => logger.error(`[Redis Cache] Cache silme hatası: ${err.message}`));
        }

        res.status(200).json({ message: 'Saha başarıyla silindi.', deletedId: fieldId });
    } catch (error) {
        res.status(500).json({ error: 'Saha silinirken hata oluştu.', details: error.message });
    }
};

module.exports = {
    listFields,
    getField,
    addField,
    updateField,
    deleteField
};
