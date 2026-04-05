🛡️ Saha Yönetimi ve Admin İşlemleri (Emirhan Fidan)

9. Sahaları Listeleme

    API Metodu: GET /fields

    Açıklama: Sistemde kayıtlı olan tüm aktif halı sahaların; isim, konum, zemin türü ve tesis özelliklerini içeren genel bir listenin kullanıcıya sunulmasını sağlar.

10. Detaylı Saha Verisi Görüntüleme

    API Metodu: GET /fields/{fieldId}

    Açıklama: Belirli bir sahanın fotoğrafları, saatlik ücreti, sunduğu imkanlar (duş, otopark, kantin vb.) gibi tüm teknik ve idari detaylarının tek bir sayfada incelenmesine olanak tanır.

11. Yeni Saha Tanımlama ve Ekleme

    API Metodu: POST /fields

    Açıklama: İşletmecinin sisteme yeni bir halı saha birimi, çalışma saatleri ve teknik özelliklerini tanımlayarak platformun hizmet kapasitesini genişletmesini sağlar.

12. Saha Bilgilerini ve Fiyatları Güncelleme

    API Metodu: PUT /fields/{fieldId}

    Açıklama: Mevcut bir sahanın saatlik ücret, açıklama metni veya tesis imkanları gibi değişken verilerinin yönetici tarafından dinamik olarak güncellenmesini sağlar.

13. Müsaitlik Durumu Sorgulama

    API Metodu: GET /fields/{fieldId}/availability

    Açıklama: Belirli bir tarih için sahanın hangi saat dilimlerinin boş veya dolu olduğunu sorgulayarak, kullanıcının doğru zamanda randevu almasına rehberlik eder.

14. Randevu Taleplerini Yönetme ve Onaylama

    API Metodu: PATCH /bookings/{bookingId}/confirm

    Açıklama: İşletmecinin, kullanıcılardan gelen bekleyen (Pending) rezervasyon isteklerini inceleyerek onaylama veya reddetme işlemlerini gerçekleştirdiği karar mekanizmasıdır.

15. İşletme Finansal ve Gelir Raporu

    API Metodu: GET /admin/reports

    Açıklama: İşletmecinin günlük ve aylık periyotlarda toplam kazancını, rezervasyon sayılarını ve finansal performansını kontrol etmesini sağlayan veri analizi servisidir.

16. Destek Talebi Oluşturma

    API Metodu: POST /support/tickets

    Açıklama: Kullanıcıların sistemle ilgili yaşadığı teknik sorunları veya sahalar hakkındaki şikayetlerini yönetime iletebileceği profesyonel bir iletişim (ticket) kanalı oluşturur.

17. Yönetici Paneli Giriş ve Yetkilendirme

    API Metodu: POST /admin/login

    Açıklama: İşletme sahibinin veya sistem yöneticisinin, kullanıcı yetkilerinden farklı olarak yönetimsel fonksiyonlara (Saha ekleme, onaylama vb.) erişebilmesi için gerekli güvenli girişi sağlar.