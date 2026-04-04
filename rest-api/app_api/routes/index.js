const express = require('express');
const router = express.Router();

// Controller dosyalarını içeri dahil et
const ctrlSaha = require('../controllers/sahaController');
const ctrlAdmin = require('../controllers/adminController');

// -------------------------------------------------------------
// Saha İşlemleri - Emirhan Fidan Sorumlulukları (sahaController)
// -------------------------------------------------------------
router.get('/fields', ctrlSaha.listFields);               // 9. Sahaları listeleme
router.get('/fields/:fieldId', ctrlSaha.getField);        // 10. Detay görüntüleme
router.post('/fields', ctrlSaha.addField);                // 11. Yeni saha ekleme
router.put('/fields/:fieldId', ctrlSaha.updateField);     // 12. Güncelleme
router.delete('/fields/:fieldId', ctrlSaha.deleteField);  // 13. Silme

const ctrlBooking = require('../controllers/bookingController');
const ctrlAuth = require('../controllers/authController');

// --- HİLMİ SİNAN KAPLAN (1-8) ---
// Not: Aşağıdaki 8 rota Hilmi Sinan Kaplan sorumluluğundadır.
router.post('/auth/register', ctrlAuth.register);                        // 1. Üye Olma
router.post('/auth/login', ctrlAuth.login);                              // 2. Giriş Yapma
router.get('/users/:userId', ctrlAuth.getProfile);                       // 3. Profil Görüntüleme
router.put('/users/:userId', ctrlAuth.updateProfile);                    // 4. Profil Güncelleme
router.patch('/users/:userId/password', ctrlAuth.changePassword);        // 5. Şifre Değiştirme
router.post('/bookings', ctrlBooking.createBooking);                     // 6. Rezervasyon Oluşturma
router.delete('/bookings/:bookingId', ctrlBooking.cancelBooking);        // 7. Rezervasyon İptal
router.get('/users/:userId/bookings', ctrlBooking.listUserBookings);     // 8. Kişisel Maç Geçmişi


// --- EMİRHAN FİDAN (9-17) ---
router.get('/fields', ctrlSaha.listFields);                               // 9. Sahaları Listele
router.get('/fields/:fieldId', ctrlSaha.getField);                        // 10. Detay
router.post('/fields', ctrlSaha.addField);                                // 11. Yeni Saha Ekle
router.put('/fields/:fieldId', ctrlSaha.updateField);                     // 12. Saha bilgisi güncelleme
router.delete('/fields/:fieldId', ctrlSaha.deleteField);                  // (Ekstra) Saha Silme
router.get('/fields/:fieldId/availability', ctrlAdmin.checkAvailability); // 13. Müsaitlik sorgulama
router.patch('/bookings/:bookingId/confirm', ctrlBooking.confirmBooking); // 14. Rezervasyon onayı
router.get('/admin/pending-bookings', ctrlAdmin.getPendingBookings);      // 14. Komuta Merkezi Bekleyenler
router.get('/admin/reports', ctrlAdmin.getReports);                       // 15. Finansal rapor
router.post('/support/tickets', ctrlAdmin.createTicket);                  // 16. Destek talebi
router.post('/admin/login', ctrlAdmin.adminLogin);                        // 17. Admin girişi
router.get('/support/tickets', ctrlAdmin.getSupportTickets);              // 16. Destek talepleri okuma
router.put('/admin/profile/:adminId', ctrlAdmin.updateAdminProfile);      // 17. Admin profil güncelleme

module.exports = router;
