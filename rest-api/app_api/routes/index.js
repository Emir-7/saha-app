const express = require('express');
const router = express.Router();

// Controller dosyalarını içeri dahil et
const ctrlSaha = require('../controllers/sahaController');
const ctrlAdmin = require('../controllers/adminController');
<<<<<<< HEAD

// -------------------------------------------------------------
// Saha İşlemleri - Emirhan Fidan Sorumlulukları (sahaController)
// -------------------------------------------------------------
=======
const ctrlAuth = require('../controllers/authController');
const ctrlBooking = require('../controllers/bookingController');

// ------------------------------------------------------------------
// Auth ve Kullanıcı İşlemleri - HSKaplan Sorumlulukları (Gereksinim 1-5)
// ------------------------------------------------------------------
router.post('/auth/register', ctrlAuth.register);                 // 1. Kullanıcı kaydı
router.post('/auth/login', ctrlAuth.login);                       // 2. Sisteme giriş
router.get('/users/:userId', ctrlAuth.getProfile);                // 3. Profil bilgileri
router.put('/users/:userId', ctrlAuth.updateProfile);             // 4. Profil güncelleme
router.patch('/users/:userId/password', ctrlAuth.changePassword); // 5. Şifre değiştirme (şifreli)

// ------------------------------------------------------------------
// Rezervasyon İşlemleri - HSKaplan Sorumlulukları (Gereksinim 6-8)
// ------------------------------------------------------------------
router.post('/bookings', ctrlBooking.createBooking);                 // 6. Rezervasyon oluşturma
router.get('/users/:userId/bookings', ctrlBooking.listUserBookings); // 8. Geçmiş/gelecek maç randevuları listesi
router.delete('/bookings/:bookingId', ctrlBooking.cancelBooking);    // 7. Randevu iptali / silme

// ------------------------------------------------------------------
// Saha İşlemleri - Emirhan Fidan Sorumlulukları (sahaController)
// ------------------------------------------------------------------
>>>>>>> HSKaplan
router.get('/fields', ctrlSaha.listFields);               // 9. Sahaları listeleme
router.get('/fields/:fieldId', ctrlSaha.getField);        // 10. Detay görüntüleme
router.post('/fields', ctrlSaha.addField);                // 11. Yeni saha ekleme
router.put('/fields/:fieldId', ctrlSaha.updateField);     // 12. Güncelleme
router.delete('/fields/:fieldId', ctrlSaha.deleteField);  // 13. Silme

<<<<<<< HEAD
// -------------------------------------------------------------
// Admin İşlemleri - Emirhan Fidan Sorumlulukları (adminController)
// -------------------------------------------------------------
=======
// ------------------------------------------------------------------
// Admin İşlemleri - Emirhan Fidan Sorumlulukları (adminController)
// ------------------------------------------------------------------
>>>>>>> HSKaplan
router.get('/fields/:fieldId/availability', ctrlAdmin.checkAvailability); // 14. Müsaitlik sorgulama
router.get('/admin/reports', ctrlAdmin.getReports);                       // 15. Günlük/Aylık Gelir raporu
router.post('/admin/login', ctrlAdmin.adminLogin);                        // 16. Admin girişi
router.patch('/admin/:adminId/password', ctrlAdmin.adminChangePassword);  // 17. Admin şifre değiştirme

module.exports = router;
