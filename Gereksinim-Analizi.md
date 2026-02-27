PROJE GEREKSİNİMLERİ VE API DOKÜMANTASYONU

9- Saha ve Tesis Listeleme (Emirhan Fidan)
   API Metodu: GET /fields
   Açıklama: Sistemdeki tüm halı sahaların; isim, konum, zemin türü ve özellik bazlı olarak listelenmesini sağlar.

10- Detaylı Saha Verisi Görüntüleme (Emirhan Fidan)
   API Metodu: GET /fields/{fieldId}
   Açıklama: Belirli bir sahanın fotoğrafları, saatlik ücreti, sunduğu imkanlar (duş, otopark vb.) gibi detayları gösterir.

11- Yeni Saha Tanımlama ve Ekleme (Emirhan Fidan)
   API Metodu: POST /fields
   Açıklama: İşletme sahibinin sisteme yeni bir halı saha birimi, çalışma saatleri ve teknik özelliklerini tanımlamasını sağlar.

12- Saha Bilgilerini ve Fiyatları Güncelleme (Emirhan Fidan)
   API Metodu: PUT /fields/{fieldId}
   Açıklama: Mevcut bir sahanın fiyat, açıklama veya tesis imkanları gibi bilgilerinin dinamik olarak değiştirilmesini sağlar.

13- Müsaitlik Durumu Sorgulama (Emirhan Fidan)
   API Metodu: GET /fields/{fieldId}/availability
   Açıklama: Belirli bir tarihte hangi saat dilimlerinin boş veya dolu olduğunun takvim üzerinde kontrol edilmesini sağlar.

14- Randevu Taleplerini Yönetme ve Onaylama (Emirhan Fidan)
   API Metodu: PATCH /bookings/{bookingId}/confirm
   Açıklama: İşletmecinin kullanıcıdan gelen bekleyen randevu isteklerini inceleyerek onaylamasını veya reddetmesini sağlar.

15- İşletme Finansal (Emirhan Fidan)
   API Metodu: GET /admin/reports
   Açıklama: İşletmecinin günlük/aylık toplam kazancını kontrol etmesini sağlar.

16- Destek Talebi (Emirhan Fidan)
   API Metodu: POST /support/tickets
   Açıklama: Kullanıcının sistem veya saha ile ilgili sorunlarını iletebileceği bir destek talebi (ticket) oluşturmasını sağlar.

17- Yönetici Paneli Giriş ve Yetkilendirme (Emirhan Fidan)
   API Metodu: POST /admin/login
   Açıklama: İşletme sahibinin kendisine özel yönetim paneline erişim sağlamasını sağlar.
   