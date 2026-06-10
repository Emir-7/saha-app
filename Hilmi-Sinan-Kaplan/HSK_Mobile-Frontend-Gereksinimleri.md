# Hilmi Sinan Kaplan - Mobil Frontend (Arayüz/Ekran) Gereksinim Dokümantasyonu

Bu doküman, projede Hilmi Sinan Kaplan'ın sorumluluğunda olan 1-8 numaralı gereksinimlerin mobil ön yüz (frontend) ekran tasarımları, kullanıcı arayüzü (UI) karşılıkları ve kullanıcı deneyimi (UX) akışlarını detaylandırmaktadır.

---

👤 Kullanıcı ve Rezervasyon Yönetimi (Hilmi Sinan Kaplan)

1. Üye Olma

    Arayüz/Ekran: Kayıt Ekranı (Register Screen)

    Açıklama: Yeni son kullanıcıların (oyuncuların) sisteme kayıt olduğu ekrandır. Ad, Soyad, E-posta, Telefon, Şifre ve Şifre Tekrarı giriş alanları, KVKK Onay Kutusu ve "Kayıt Ol" butonu içerir.

2. Giriş Yapma ve Yetkilendirme

    Arayüz/Ekran: Giriş Ekranı (Login Screen)

    Açıklama: Kayıtlı kullanıcıların sisteme giriş yaptığı ekrandır. E-posta ve Şifre alanları, "Beni Hatırla" seçeneği, "Şifremi Unuttum" bağlantısı ve "Giriş Yap" butonu bulunur. Giriş sonrası kullanıcı JWT token alır.

3. Profil Görüntüleme ve Yönetimi

    Arayüz/Ekran: Profil Ekranı (Profile Screen)

    Açıklama: Kullanıcının kişisel hesap detaylarını ve üyelik bilgilerini gördüğü ekrandır. Profil resmi alanı, ad-soyad, e-posta, telefon bilgileri listesi, "Profili Düzenle" ve "Çıkış Yap" butonları bulunur.

4. Profil Bilgilerini Güncelleme

    Arayüz/Ekran: Profil Düzenleme Ekranı (Edit Profile Screen)

    Açıklama: Kullanıcının ad, soyad ve telefon gibi kişisel bilgilerini güncellediği ekrandır. Girdiler mevcut bilgilerle dolu gelir. Düzenleme sonrası "Kaydet" butonu ile güncelleme tetiklenir.

5. Güvenli Şifre Değiştirme

    Arayüz/Ekran: Şifre Değiştirme Ekranı (Change Password Screen)

    Açıklama: Hesabın güvenliği için şifre güncelleme ekranıdır. Mevcut Şifre, Yeni Şifre ve Yeni Şifre Tekrarı giriş alanları bulunur. Şifre gücü dinamik olarak kontrol edilir.

6. Yeni Rezervasyon Talebi Oluşturma

    Arayüz/Ekran: Rezervasyon Ekranı (Booking Screen)

    Açıklama: Kullanıcının belirli bir saha için randevu oluşturduğu ekrandır. Tarih Seçici (DatePicker), Saat Dilimleri Listesi, Rezervasyon Özet Kartı (Saha adı, Seçilen Saat, Fiyat) ve "Rezervasyonu Tamamla" butonu bulunur.

7. Rezervasyon İptal İşlemi

    Arayüz/Ekran: Rezervasyon Detay / İptal Penceresi (Booking Details / Cancel Dialog)

    Açıklama: Kullanıcının aktif olan bir randevusunu iptal ettiği arayüzdür. İptal talebinde bulunulduğunda ekrana bir onay modalı (Popup Dialog) gelir. "İptal Et" butonuna basıldığında rezervasyon iptal edilir.

8. Kişisel Maç ve Randevu Geçmişi

    Arayüz/Ekran: Rezervasyon Geçmişi Ekranı (Booking History Screen)

    Açıklama: Kullanıcının geçmişte oynadığı ve gelecekte oynayacağı tüm maçları listelediği ekrandır. "Aktif Rezervasyonlar" ve "Geçmiş Rezervasyonlar" olarak iki sekme (Tab) halinde listeleme yapılır.

---

## İş Kanıtı

### Video Linki
[İş Kanıtı Videosunu İzlemek İçin Tıklayın (Boş Bırakılmıştır)]
