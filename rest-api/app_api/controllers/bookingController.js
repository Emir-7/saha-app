const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');
const Field = mongoose.model('Field');

// 6 - Yeni Rezervasyon Talebi Oluşturma
const createBooking = async (req, res) => {
    try {
        // 1. ESNEK VERİ YAKALAMA
        const actualField = req.body.fieldId || req.body.field || req.body.sahaId;
        const actualUser  = req.body.userId  || req.body.user  || req.body.kullaniciId;
        const date        = req.body.date     || null;
        const timeSlot    = req.body.timeSlot || null;

        if (!actualField) {
            return res.status(400).json({ error: 'Saha ID (fieldId) değeri eksik.' });
        }
        if (!actualUser) {
            return res.status(400).json({ error: 'Kullanıcı ID (userId veya user) değeri eksik.' });
        }

        if (!mongoose.Types.ObjectId.isValid(actualField)) {
            return res.status(400).json({ error: 'Geçersiz saha ID formatı.' });
        }
        if (!mongoose.Types.ObjectId.isValid(actualUser)) {
            return res.status(400).json({ error: 'Geçersiz kullanıcı ID formatı.' });
        }

        // Kontrol: Saha var mı?
        const existingField = await Field.findById(actualField);
        if (!existingField) {
            return res.status(404).json({ error: 'Rezervasyon yapılmak istenen saha sistemde bulunamadı.' });
        }

        // Kontrol: O sahanın istenen saati başka bir rezervasyonda (İptal edilmemiş haliyle) dolu mu?
        const isOccupied = await Booking.findOne({ field: actualField, date, timeSlot, status: { $ne: 'İptal Edildi' } });
        if (isOccupied) {
            return res.status(400).json({ error: 'Bu saha seçilen saat aralığında zaten dolu/rezerve edilmiş.' });
        }

        const newBooking = await Booking.create({
            field:    actualField,
            user:     actualUser,
            date,
            timeSlot,
            status:   'Onay Bekliyor'
        });

        // 2. GÜVENLİ SİMÜLASYON - RabbitMQ (mqChannel)
        try {
            if (typeof mqChannel !== 'undefined' && mqChannel) {
                mqChannel.sendToQueue(
                    'booking_created',
                    Buffer.from(JSON.stringify({ bookingId: newBooking._id, field: actualField, user: actualUser }))
                );
            }
        } catch (mqError) {
            // mqChannel hatası ana akışı kesmez; yalnızca loglanır
            console.error('[MQ] Rezervasyon mesajı kuyruğa gönderilemedi:', mqError.message);
        }

        // 2. GÜVENLİ SİMÜLASYON - Redis (redisClient)
        try {
            if (typeof redisClient !== 'undefined' && redisClient) {
                await redisClient.set(
                    `booking:${newBooking._id}`,
                    JSON.stringify(newBooking),
                    { EX: 3600 }
                );
            }
        } catch (redisError) {
            // redisClient hatası ana akışı kesmez; yalnızca loglanır
            console.error('[Redis] Rezervasyon önbelleğe alınamadı:', redisError.message);
        }

        // 3. KESİN BAŞARI MESAJI
        res.status(201).json({ message: 'saha kiralama işlemi başarıyla tamamlandı', booking: newBooking });
    } catch (error) {
        res.status(500).json({ error: 'Rezervasyon isteği işlenirken hata oluştu.', details: error.message });
    }
};

// 7/8 - Kişisel Maç ve Randevu Geçmişi Görüntüleme
const listUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ user: userId }).populate('field', 'name address pricePerHour');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcının maç randevu geçmişi getirilemedi.', details: error.message });
    }
};

// 7/8 - Rezervasyon İptal İşlemi
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'İptal edilmek istenen rezervasyon bulunamadı.' });
        }

        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: 'Rezervasyon kaydı sistemden başarıyla silindi/iptal edildi.' });
    } catch (error) {
        res.status(500).json({ error: 'Rezervasyon silinirken hata oluştu.', details: error.message });
    }
};

// 14 - Rezervasyon Onayı (Emirhan Fidan)
const confirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        let { status, isConfirmed } = req.body;

        // Frontend'den isConfirmed boolean/string gelirse onu status formatına çevir
        if (isConfirmed !== undefined) {
            // "true" veya true ise Onaylandı, aksi halde (false/"false") İptal Edildi
            status = (isConfirmed === true || isConfirmed === 'true') ? 'Onaylandı' : 'İptal Edildi';
        }

        // Büyük/küçük harf toleransı
        if (typeof status === 'string') {
            const lowerStatus = status.toLowerCase().trim();
            if (lowerStatus === 'onaylandı' || lowerStatus === 'onaylandi') status = 'Onaylandı';
            else if (lowerStatus === 'iptal edİldİ' || lowerStatus === 'iptal edildi') status = 'İptal Edildi';
            else if (lowerStatus === 'onay bekliyor') status = 'Onay Bekliyor';
        }

        const validStatuses = ['Onay Bekliyor', 'Onaylandı', 'İptal Edildi'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Geçersiz rezervasyon durumu (status).' });
        }

        // 1. Önce rezervasyonu bul (durumunu kontrol etmek için)
        const existingBooking = await Booking.findById(bookingId);
        
        if (!existingBooking) {
            return res.status(404).json({ error: 'Güncellenecek rezervasyon bulunamadı.' });
        }

        // 2. Eğer zaten onaylanmış veya iptal edilmişse müdahale etmeye izin verme
        if (existingBooking.status !== 'Onay Bekliyor') {
            return res.status(400).json({ 
                error: `İşlem başarısız. Bu rezervasyon zaten '${existingBooking.status}' durumunda.` 
            });
        }

        // 3. Durumu güncelle ve kaydet
        existingBooking.status = status;
        const updatedBooking = await existingBooking.save();

        res.status(200).json({ message: 'Rezervasyon durumu başarıyla güncellendi.', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ error: 'Rezervasyon onaylanırken hata oluştu.', details: error.message });
    }
};

module.exports = {
    createBooking,
    listUserBookings,
    cancelBooking,
    confirmBooking
};
