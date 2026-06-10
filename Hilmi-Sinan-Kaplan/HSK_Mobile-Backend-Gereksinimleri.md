# Hilmi Sinan Kaplan - Mobil Backend (API & Veritabanı) Gereksinim Dokümantasyonu

Bu doküman, projede Hilmi Sinan Kaplan'ın sorumluluğunda olan 1-8 numaralı gereksinimlerin arka uç (backend) mimarisi, RESTful API uç noktaları (endpoints) ve veritabanı işlemlerini detaylandırmaktadır.

---

👤 Kullanıcı ve Rezervasyon Yönetimi (Hilmi Sinan Kaplan)

1. Üye Olma

    API Metodu: POST /auth/register

    Açıklama: İstemciden gelen ad, soyad, e-posta, telefon ve şifre bilgilerini alır. E-postanın benzersiz olduğunu kontrol eder. Şifreyi `bcrypt` kütüphanesi kullanarak tuzlar ve hashler. Yeni kullanıcıyı `users` koleksiyonuna ekler.

2. Giriş Yapma ve Yetkilendirme

    API Metodu: POST /auth/login

    Açıklama: Gönderilen e-posta adresiyle veritabanında kullanıcı arar. Şifreyi doğrular (`bcrypt.compare`). Giriş başarılıysa, kullanıcının id ve rol bilgisini içeren, süreli bir JWT (JSON Web Token) üretir ve döner.

3. Profil Görüntüleme ve Yönetimi

    API Metodu: GET /users/{userId}

    Açıklama: Giriş yapmış kullanıcının token doğrulamasını yaptıktan sonra, URL parametresindeki `{userId}` değerine göre veritabanından kullanıcı bilgilerini çeker (Güvenlik gereği şifre alanı hariç tutulur: `.select('-password')`).

4. Profil Bilgilerini Güncelleme

    API Metodu: PUT /users/{userId}

    Açıklama: Kullanıcının güncellemek istediği verileri (ad, soyad, telefon vb.) doğrular. Veritabanındaki ilgili kullanıcı kaydını bulup günceller (`findOneAndUpdate`). Güncellenmiş kullanıcı bilgisini döner.

5. Güvenli Şifre Değiştirme

    API Metodu: PATCH /users/{userId}/password

    Açıklama: İstek gövdesinde gelen mevcut şifreyi veritabanındaki şifre hash'i ile karşılaştırır. Doğruysa yeni şifreyi hashleyerek veritabanında günceller. Başarılı işlemde şifrenin güncellendiği bilgisini döner.

6. Yeni Rezervasyon Talebi Oluşturma

    API Metodu: POST /bookings

    Açıklama: Kullanıcı kimliğini doğrular. Seçilen saha, tarih ve saat için veritabanında daha önce oluşturulmuş çakışan bir rezervasyon (`status: 'Confirmed'`) olup olmadığını kontrol eder. Çakışma yoksa rezervasyonu `status: 'Pending'` (Beklemede) olarak kaydeder.

7. Rezervasyon İptal İşlemi

    API Metodu: DELETE /bookings/{bookingId}

    Açıklama: Kullanıcının iptal etmek istediği rezervasyon kaydını `{bookingId}` ile sorgular. Rezervasyonun bu kullanıcıya ait olduğunu doğrular. İptal kurallarına (süre sınırı vb.) uygunluğu kontrol eder, uygunsa kaydı siler veya `status: 'Cancelled'` yapar.

8. Kişisel Maç ve Randevu Geçmişi

    API Metodu: GET /users/{userId}/bookings

    Açıklama: `{userId}` parametresiyle eşleşen kullanıcının tüm rezervasyon kayıtlarını veritabanında sorgular. Randevuları tarih sırasına göre (yaklaşan randevular en üstte olacak şekilde) sıralayarak JSON formatında döner.

---

## İş Kanıtı

### API İsteği/Terminal Log Videosu
[İş Kanıtı Videosunu İzlemek İçin Tıklayın (Boş Bırakılmıştır)]
