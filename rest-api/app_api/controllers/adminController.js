const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');
const User = mongoose.model('User');
const Field = mongoose.model('Field');

// 14 - Saha müsaitlik sorgulama
const checkAvailability = async (req, res) => {
    try {
        const { fieldId } = req.params;
        const { date } = req.query; // Sorgulama için opsiyonel tarih parametri (Örn: ?date=2023-10-15)

        let query = { field: fieldId };

        if (date) {
            // Sadece spesifik bir güne ait rezervasyonları kontrol et
            const startDate = new Date(date);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        // Seçili güne/saha değerine ait rezervasyonların sadece saat boşluklarını ve durumu getir
        const bookings = await Booking.find(query).select('timeSlot status date');
        res.status(200).json({ fieldId, bookings });
    } catch (error) {
        res.status(500).json({ error: 'Müsaitlik durumu sorgulanırken hata oluştu.', details: error.message });
    }
};

// 15 - Günlük/Aylık gelir raporu
const getReports = async (req, res) => {
    try {
        // Tüm onaylı rezervasyonları çekip saha fiyatı ile eşleştirme amacıyla find().populate() kullanılıyor
        const bookings = await Booking.find({ status: 'Onaylandı' }).populate('field', 'pricePerHour');

        let totalRevenue = 0;
        bookings.forEach(booking => {
            if (booking.field && booking.field.pricePerHour) {
                totalRevenue += booking.field.pricePerHour; // Varsayım: 1 slot = 1 saat fiyatlandırması
            }
        });

        res.status(200).json({
            reportInfo: "Tüm Onaylanmış Rezervasyonların Toplam Geliri",
            totalRevenue,
            totalBookingsCount: bookings.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Rapor oluşturulurken hata oluştu.', details: error.message });
    }
};

// 16 - Admin girişi
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminUser = await User.findOne({ email, role: 'admin' });
        if (!adminUser) {
            return res.status(404).json({ error: 'Admin hesabı bulunamadı.' });
        }

        // Basit String doğrulaması (Gerçekte crypto/bcrypt kullanılmalıdır)
        if (adminUser.password !== password) {
            return res.status(401).json({ error: 'Hatalı şifre girdiniz.' });
        }

        res.status(200).json({ message: 'Admin girişi başarılı', adminId: adminUser._id });
    } catch (error) {
        res.status(500).json({ error: 'Admin girişi sırasında sistemde hata oluştu.', details: error.message });
    }
};

// 17 - Admin şifre değiştirme
const adminChangePassword = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { oldPassword, newPassword } = req.body;

        const adminUser = await User.findOne({ _id: adminId, role: 'admin' });
        if (!adminUser) {
            return res.status(404).json({ error: 'Admin hesabı bulunamadı.' });
        }

        if (adminUser.password !== oldPassword) {
            return res.status(401).json({ error: 'Mevcut şifreniz yanlış.' });
        }

        // Yeni şifreyi kaydet
        adminUser.password = newPassword;
        await adminUser.save();

        res.status(200).json({ message: 'Admin şifresi başarıyla güncellendi.' });
    } catch (error) {
        res.status(500).json({ error: 'Şifre değiştirilirken hata oluştu.', details: error.message });
    }
};

module.exports = {
    checkAvailability,
    getReports,
    adminLogin,
    adminChangePassword
};
