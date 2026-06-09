const mongoose = require('mongoose');
const Field = mongoose.model('Field');

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
                    console.log('⚡ [TEST-LOG] Veri Redis Cache\'ten getirildi.');
                    return res.status(200).json(JSON.parse(cachedFields));
                }
            } catch (cacheErr) {
                console.error('⚠️ [Redis Cache] Cache okuma hatası:', cacheErr.message);
            }
        }

        const fields = await Field.find();
        console.log("🔍 [TEST-LOG] Veri MongoDB'den getirildi.");

        if (redisClient) {
            try {
                // Sunum için: Redis Cache entegrasyonu
                await redisClient.set(cacheKey, JSON.stringify(fields), { EX: 3600 });
                console.log('💾 [Redis Cache] Sahalar cache\'e kaydedildi.');
            } catch (cacheErr) {
                console.error('⚠️ [Redis Cache] Cache yazma hatası:', cacheErr.message);
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
        const field = await Field.findById(fieldId);

        if (!field) {
            return res.status(404).json({ error: 'İstenilen saha bulunamadı.' });
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
            await redisClient.del('fields:all').catch(err => console.error('⚠️ [Redis Cache] Cache silme hatası:', err.message));
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

        // Sunum için: Redis Cache entegrasyonu (Saha güncellenince önbelleği geçersiz kıl)
        const redisClient = req.app.get('redisClient');
        if (redisClient) {
            await redisClient.del('fields:all').catch(err => console.error('⚠️ [Redis Cache] Cache silme hatası:', err.message));
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

        // Sunum için: Redis Cache entegrasyonu (Saha silinince önbelleği geçersiz kıl)
        const redisClient = req.app.get('redisClient');
        if (redisClient) {
            await redisClient.del('fields:all').catch(err => console.error('⚠️ [Redis Cache] Cache silme hatası:', err.message));
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
