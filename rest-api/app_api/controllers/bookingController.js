const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');
const Field = mongoose.model('Field');

// 6 - Yeni Rezervasyon Talebi Oluşturma
const createBooking = async (req, res) => {
    try {
        const { field, fieldId, sahaId, user, userId, kullaniciId, date, timeSlot } = req.body;
        
        // Frontend'den field, fieldId veya sahaId gelme ihtimaline karşı:
        const targetFieldId = field || fieldId || sahaId;
        const targetUserId = user || userId || kullaniciId;

        if (!targetFieldId) {
            return res.status(400).json({ error: 'Saha ID (fieldId) değeri eksik.' });
        }
        if (!targetUserId) {
            return res.status(400).json({ error: 'Kullanıcı ID (userId veya user) değeri eksik.' });
        }

        if (!mongoose.Types.ObjectId.isValid(targetFieldId)) {
            return res.status(400).json({ error: 'Geçersiz saha ID formatı.' });
        }
        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ error: 'Geçersiz kullanıcı ID formatı.' });
        }

        // Kontrol: Saha var mı?
        const existingField = await Field.findById(targetFieldId);
        if (!existingField) {
            return res.status(404).json({ error: 'Rezervasyon yapılmak istenen saha sistemde bulunamadı.' });
        }

        // Kontrol: O sahanın istenen saati başka bir rezervasyonda (İptal edilmemiş haliyle) dolu mu?
        const isOccupied = await Booking.findOne({ field: targetFieldId, date, timeSlot, status: { $ne: 'İptal Edildi' } });
        if (isOccupied) {
            return res.status(400).json({ error: 'Bu saha seçilen saat aralığında zaten dolu/rezerve edilmiş.' });
        }

        const newBooking = await Booking.create({
            field: targetFieldId,
            user: targetUserId,
            date,
            timeSlot,
            status: 'Onay Bekliyor'
        });

        res.status(201).json({ message: 'Rezervasyon talebi başarıyla oluşturuldu.', booking: newBooking });
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
