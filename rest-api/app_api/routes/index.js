const express = require('express');
const router = express.Router();

// Controller dosyalarını içeri dahil et
const ctrlSaha = require('../controllers/sahaController');
const ctrlAdmin = require('../controllers/adminController');
const ctrlAuth = require('../controllers/authController');
const ctrlBooking = require('../controllers/bookingController');

// ------------------------------------------------------------------
// Auth ve Kullanıcı İşlemleri - HSKaplan Sorumlulukları (Gereksinim 1-5)
// ------------------------------------------------------------------
router.post('/auth/register', ctrlAuth.register);                 // 1. Kullanıcı kaydı
router.post('/auth/login', ctrlAuth.login);                       // 2. Sisteme giriş
router.get('/users/:userId', ctrlAuth.getProfile);                // 3. Profil bilgileri
router.put('/users/:userId', ctrlAuth.updateProfile);             // 4. Profil güncelleme
router.patch('/users/:userId/password', ctrlAuth.changePassword); // 5. Şifre değiştirme

// ------------------------------------------------------------------
// Rezervasyon İşlemleri - HSKaplan Sorumlulukları (Gereksinim 6-8)
// ------------------------------------------------------------------
router.post('/bookings', ctrlBooking.createBooking);                 // 6. Rezervasyon oluşturma
router.get('/users/:userId/bookings', ctrlBooking.listUserBookings); // 8. Randevu listesi
router.delete('/bookings/:bookingId', ctrlBooking.cancelBooking);    // 7. Randevu iptali

// ------------------------------------------------------------------
// Saha İşlemleri - Emirhan Fidan Sorumlulukları (Gereksinim 9-13)
// ------------------------------------------------------------------
router.get('/fields', ctrlSaha.listFields);               // 9. Sahaları listeleme
router.get('/fields/:fieldId', ctrlSaha.getField);        // 10. Detay görüntüleme
router.post('/fields', ctrlSaha.addField);                // 11. Yeni saha ekleme
router.put('/fields/:fieldId', ctrlSaha.updateField);     // 12. Güncelleme
router.delete('/fields/:fieldId', ctrlSaha.deleteField);  // 13. Silme

// ------------------------------------------------------------------
// Admin İşlemleri - Emirhan Fidan Sorumlulukları (Gereksinim 14-17)
// ------------------------------------------------------------------
router.get('/fields/:fieldId/availability', ctrlAdmin.checkAvailability); // 14. Müsaitlik sorgulama
router.get('/admin/reports', ctrlAdmin.getReports);                       // 15. Gelir raporu
router.post('/admin/login', ctrlAdmin.adminLogin);                        // 16. Admin girişi
router.patch('/admin/:adminId/password', ctrlAdmin.adminChangePassword);  // 17. Admin şifre değiştirme

module.exports = router;