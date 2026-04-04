const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Emirhan Fidan 17. Gereksinim Güvenliği
const Booking = mongoose.model('Booking');
const User = mongoose.model('User');
const Field = mongoose.model('Field');
const Ticket = mongoose.model('Ticket');

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

        // Emirhan Fidan: Bcrypt güvenlik entegrasyonu sağlandı
        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
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

        const isMatch = await bcrypt.compare(oldPassword, adminUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mevcut şifreniz yanlış.' });
        }

        // Emirhan Fidan: Yeni şifreyi kriptolayarak kaydet
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash(newPassword, salt);
        
        await adminUser.save();

        res.status(200).json({ message: 'Admin şifresi başarıyla güncellendi.' });
    } catch (error) {
        res.status(500).json({ error: 'Şifre değiştirilirken hata oluştu.', details: error.message });
    }
};

// 16 - Destek talebi
const createTicket = async (req, res) => {
    try {
        const { user, userId, kullaniciId, subject, message } = req.body;
        
        // Frontend'den user, userId veya kullaniciId gelme ihtimaline karşı:
        const targetUserId = user || userId || kullaniciId;

        if (!targetUserId) {
            return res.status(400).json({ error: 'Kullanıcı ID (userId veya user) değeri eksik.' });
        }

        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ error: 'Geçersiz kullanıcı ID formatı.' });
        }
        
        const newTicket = await Ticket.create({
            user: targetUserId,
            subject,
            message
        });

        res.status(201).json({ message: 'Destek talebiniz başarıyla oluşturuldu.', ticket: newTicket });
    } catch (error) {
        res.status(500).json({ error: 'Destek talebi oluşturulurken hata oluştu.', details: error.message });
    }
};

// 14 - Onay Bekleyen Rezervasyonlar (Komuta Merkezi)
const getPendingBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'Onay Bekliyor' })
            .populate('user', 'firstName lastName phone email')
            .populate('field', 'name pricePerHour address')
            .sort({ date: 1, timeSlot: 1 });
            
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Bekleyen rezervasyonlar getirilemedi.', details: error.message });
    }
};

// REQ-16: Destek taleplerini kronolojik olarak listele
const getSupportTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate('user', 'firstName lastName email phone')
            .sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Destek talepleri getirilirken hata oluştu.', details: error.message });
    }
};

// REQ-17: Admin Profil Yönetimi (Dinamik)
const updateAdminProfile = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { firstName, lastName, email, password } = req.body;

        const updateData = { firstName, lastName, email };

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedAdmin = await User.findOneAndUpdate(
            { _id: adminId, role: 'admin' },
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin hesabı bulunamadı veya güncelleme yetkiniz yok.' });
        }

        res.status(200).json({ message: 'Profiliniz başarıyla güncellendi.', admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ error: 'Profil güncellenirken hata oluştu.', details: error.message });
    }
};

module.exports = {
    checkAvailability,
    getReports,
    adminLogin,
    adminChangePassword,
    createTicket,
    getPendingBookings,
    getSupportTickets,
    updateAdminProfile
};
