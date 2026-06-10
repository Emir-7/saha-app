# Emirhan Fidan - Mobil Backend (API & Veritabanı) Gereksinim Dokümantasyonu

Bu doküman, projede Emirhan Fidan'ın sorumluluğunda olan 9-17 numaralı gereksinimlerin arka uç (backend) mimarisi, RESTful API uç noktaları (endpoints) ve veritabanı işlemlerini detaylandırmaktadır.

---

🛡️ Saha Yönetimi ve Admin İşlemleri (Emirhan Fidan)

9. Sahaları Listeleme

    API Metodu: GET /fields

    Açıklama: Veritabanındaki `fields` koleksiyonundan tüm aktif saha kayıtlarını çeker. İstekle gelen arama ve filtreleme (zemin türü, konum vb.) parametrelerine göre verileri filtreleyerek JSON dizisi olarak istemciye döner.

10. Detaylı Saha Verisi Görüntüleme

    API Metodu: GET /fields/{fieldId}

    Açıklama: URL parametresinden alınan `{fieldId}` değerine göre veritabanında arama yapar (`findById`). Sahaya ait resim yolları, saatlik kiralama bedeli, adres ve sosyal olanak verilerini tek bir nesne olarak döner. Kayıt bulunamazsa 404 hatası döndürür.

11. Yeni Saha Tanımlama ve Ekleme

    API Metodu: POST /fields

    Açıklama: İstek gövdesinden (Request Body) gelen yeni saha verilerini doğrular. İşletmeci yetkisine sahip kullanıcıyı (JWT aracılığıyla) doğruladıktan sonra `fields` tablosuna yeni saha kaydını ekler. Başarılı eklemede 201 Created döner.

12. Saha Bilgilerini ve Fiyatları Güncelleme

    API Metodu: PUT /fields/{fieldId}

    Açıklama: İstek gövdesinde gelen güncel saha bilgilerini (isim, fiyat, olanaklar vb.) doğrular. Veritabanındaki ilgili kaydı `{fieldId}` ile bulup günceller (`findOneAndUpdate`). İşlem sonrası güncel saha nesnesini istemciye yanıt olarak döner.

13. Müsaitlik Durumu Sorgulama

    API Metodu: GET /fields/{fieldId}/availability

    Açıklama: Belirli bir sahanın rezervasyon durumunu sorgular. Query parametresinden gelen tarih bilgisine göre veritabanında o sahaya ait onaylanmış rezervasyonları filtreler. Dolu ve boş saat dilimlerini hesaplayıp JSON olarak istemciye servis eder.

14. Randevu Taleplerini Yönetme ve Onaylama

    API Metodu: PATCH /bookings/{bookingId}/confirm (ve listeleme için GET /admin/pending-bookings)

    Açıklama: Yönetici yetkisi kontrol edildikten sonra, `{bookingId}` parametresine sahip rezervasyon kaydının durumu `status: 'Confirmed'` (veya reddedilirse `Rejected`) olarak güncellenir. Eğer onaylandı ise, çakışan diğer bekleyen talepler otomatik olarak reddedilir.

15. İşletme Finansal ve Gelir Raporu

    API Metodu: GET /admin/reports

    Açıklama: Veritabanındaki `bookings` tablosundan tamamlanmış ve onaylanmış rezervasyonları çeker. Tarih bazlı gruplandırma yaparak toplam gelir, rezervasyon sayısı ve doluluk oranlarını hesaplar. JSON formatında analitik veri döner.

16. Destek Talebi Oluşturma

    API Metodu: POST /support/tickets (ve okuma için GET /support/tickets)

    Açıklama: Kullanıcının bildirdiği destek talebini `tickets` tablosuna `status: 'Open'` olarak ekler. Yöneticilerin sistemdeki tüm destek taleplerini veya durumuna göre filtrelenmiş talepleri listelemesini sağlar.

17. Yönetici Paneli Giriş ve Yetkilendirme

    API Metodu: POST /admin/login (ve profil için PUT /admin/profile/{adminId})

    Açıklama: Gönderilen yönetici e-posta ve şifresini veritabanındaki `admins` tablosuyla eşleştirir. Şifre doğrulanırsa (`bcrypt.compare`), yönetici rolü barındıran bir JWT (JSON Web Token) üretir ve döner. Yöneticinin profil bilgilerini günceller.

---

## İş Kanıtı

### API İsteği/Terminal Log Videosu
[İş Kanıtı Videosunu İzlemek İçin Tıklayın (Boş Bırakılmıştır)]
