const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');
const Field = mongoose.model('Field');

// 6 - Yeni Rezervasyon Talebi Oluşturma
const createBooking = async (req, res) => {
    try {
        const { field, user, date, timeSlot } = req.body;

        // Kontrol: Saha var mı?
        const existingField = await Field.findById(field);
        if (!existingField) {
            return res.status(404).json({ error: 'Rezervasyon yapılmak istenen saha sistemde bulunamadı.' });
        }

        // Kontrol: O sahanın istenen saati başka bir rezervasyonda (İptal edilmemiş haliyle) dolu mu?
        const isOccupied = await Booking.findOne({ field, date, timeSlot, status: { $ne: 'İptal Edildi' } });
        if (isOccupied) {
            return res.status(400).json({ error: 'Bu saha seçilen saat aralığında zaten dolu/rezerve edilmiş.' });
        }

        const newBooking = await Booking.create({
            field,
            user,
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

module.exports = {
    createBooking,
    listUserBookings,
    cancelBooking
};
