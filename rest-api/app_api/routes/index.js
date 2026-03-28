const express = require('express');
const router = express.Router();

const ctrlAuth = require('../controllers/authController');
const ctrlBooking = require('../controllers/bookingController');
const ctrlSaha = require('../controllers/sahaController');
const ctrlAdmin = require('../controllers/adminController');

// --- HİLMİ SİNAN KAPLAN (1-8) ---
router.post('/auth/register', ctrlAuth.register);       // 1. Kayıt
router.post('/auth/login', ctrlAuth.login);             // 2. Giriş
router.get('/users/:userId', ctrlAuth.getProfile);      // 3. Profil
router.put('/users/:userId', ctrlAuth.updateProfile);   // 4. Güncelleme
router.patch('/users/:userId/password', ctrlAuth.changePassword); // 5. Şifre
router.post('/bookings', ctrlBooking.createBooking);    // 6. Rezervasyon
router.delete('/bookings/:bookingId', ctrlBooking.cancelBooking); // 7. İptal
router.get('/users/:userId/bookings', ctrlBooking.listUserBookings); // 8. Randevu Listesi

// --- EMİRHAN FİDAN (9-17) ---
router.get('/fields', ctrlSaha.listFields);             // 9. Sahaları Listele
router.get('/fields/:fieldId', ctrlSaha.getField);      // 10. Detay
router.post('/fields', ctrlSaha.addField);              // 11. Yeni Saha Ekle
router.put('/fields/:fieldId', ctrlSaha.updateField);   // 12. Güncelleme
router.delete('/fields/:fieldId', ctrlSaha.deleteField); // 13. Silme
router.get('/fields/:fieldId/availability', ctrlAdmin.checkAvailability); // 14. Müsaitlik
router.get('/admin/reports', ctrlAdmin.getReports);     // 15. Gelir Raporu
router.post('/admin/login', ctrlAdmin.adminLogin);      // 16. Admin Girişi
router.patch('/admin/:adminId/password', ctrlAdmin.adminChangePassword); // 17. Şifre Değişimi

module.exports = router;