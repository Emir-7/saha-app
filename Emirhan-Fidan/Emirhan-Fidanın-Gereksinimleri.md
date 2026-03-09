### 🏟️ Saha Yönetimi ve İşletme Paneli (Emirhan Fidan)

9. **Sahaları Listeleme**
   - **API Metodu:** `GET /fields`
   - **Açıklama:** Sistemdeki tüm halı sahaların isim, konum ve genel özelliklerine göre bir liste halinde sunulmasını sağlar.

10. **Saha Bilgisi İnceleme**
    - **API Metodu:** `GET /fields/{fieldId}`
    - **Açıklama:** Seçilen bir sahanın fotoğrafları, ücreti, konumu ve sunduğu ek imkanlar (duş, otopark vb.) hakkında detaylı bilgi verir.

11. **Yeni Saha Tanımlama**
    - **API Metodu:** `POST /fields`
    - **Açıklama:** İşletme sahibinin yeni bir halı saha birimini, çalışma saatlerini ve teknik detaylarını sisteme eklemesini sağlar.

12. **Saha Bilgisi Güncelleme**
    - **API Metodu:** `PUT /fields/{fieldId}`
    - **Açıklama:** Mevcut bir sahanın fiyatında, açıklamasında veya sunduğu imkanlarda değişiklik yapılmasına izin verir.

13. **Boş Saatleri Sorgulama**
    - **API Metodu:** `GET /fields/{fieldId}/availability`
    - **Açıklama:** Belirli bir tarihte sahanın hangi saat dilimlerinin boş olduğunu bir takvim üzerinde kontrol etmeyi sağlar.

14. **Randevu Yönetme**
    - **API Metodu:** `PATCH /bookings/{bookingId}/confirm`
    - **Açıklama:** İşletmecinin, kullanıcılardan gelen randevu isteklerini inceleyerek onaylamasına veya reddetmesine imkan tanır.

15. **Gelir Raporu Alma**
    - **API Metodu:** `GET /admin/reports`
    - **Açıklama:** İşletmecinin günlük veya aylık bazda ne kadar kazanç elde ettiğini ve sahaların doluluk oranlarını görmesini sağlar.

16. **Destek Talebi Açma**
    - **API Metodu:** `POST /support/tickets`
    - **Açıklama:** Kullanıcıların sistem veya sahalarla ilgili yaşadıkları sorunları yetkililere iletebileceği bir mesaj alanı sağlar.

17. **Yönetici Girişi Yapma**
    - **API Metodu:** `POST /admin/login`
    - **Açıklama:** İşletme sahiplerinin sadece kendilerine ait olan yönetim paneline erişebilmesi için kullanılan giriş yöntemidir.