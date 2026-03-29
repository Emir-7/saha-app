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

<<<<<<< Updated upstream
// -------------------------------------------------------------
// Admin İşlemleri - Emirhan Fidan Sorumlulukları (adminController)
// -------------------------------------------------------------
router.get('/fields/:fieldId/availability', ctrlAdmin.checkAvailability); // 14. Müsaitlik sorgulama
router.get('/admin/reports', ctrlAdmin.getReports);                       // 15. Günlük/Aylık Gelir raporu
router.post('/admin/login', ctrlAdmin.adminLogin);                        // 16. Admin girişi
router.patch('/admin/:adminId/password', ctrlAdmin.adminChangePassword);  // 17. Admin şifre değiştirme
=======
// --- EMİRHAN FİDAN (9-17) ---
router.get('/fields', ctrlSaha.listFields);                               // 9. Sahaları Listele
router.get('/fields/:fieldId', ctrlSaha.getField);                        // 10. Detay
router.post('/fields', ctrlSaha.addField);                                // 11. Yeni Saha Ekle
router.put('/fields/:fieldId', ctrlSaha.updateField);                     // 12. Saha bilgisi güncelleme
router.delete('/fields/:fieldId', ctrlSaha.deleteField);                  // (Ekstra) Saha Silme
router.get('/fields/:fieldId/availability', ctrlAdmin.checkAvailability); // 13. Müsaitlik sorgulama
router.patch('/bookings/:bookingId/confirm', ctrlBooking.confirmBooking); // 14. Rezervasyon onayı
router.get('/admin/reports', ctrlAdmin.getReports);                       // 15. Finansal rapor
router.post('/support/tickets', ctrlAdmin.createTicket);                  // 16. Destek talebi
router.post('/admin/login', ctrlAdmin.adminLogin);                        // 17. Admin girişi
>>>>>>> Stashed changes

module.exports = router;
