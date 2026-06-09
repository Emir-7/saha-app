👤 Kullanıcı ve Rezervasyon İşlemleri (Hilmi Sinan Kaplan)

**Frontend Test Videosu:** [https://youtu.be/ZMJudHuWofk?si=5GUlc_5cDPVnSULL]

1. Üye Olma ve Kullanıcı Kaydı

    Sayfa / Bileşen: RegisterPage / RegisterForm bileşeni

    Açıklama: Yeni oyuncuların sisteme ad, soyad, e-posta ve iletişim bilgileriyle dahil olmasını sağlayan ilk kayıt ekranı (REQ-1).

    Frontend Görevleri:

        Kayıt formunun (Ad, Soyad, E-posta, Şifre, Telefon) tasarlanması.

        Şifre uzunluğu ve e-posta formatı için istemci tarafı (client-side) doğrulamaların yapılması.

        API üzerinden POST /auth/register isteğinin yönetilmesi ve başarılı kayıt sonrası kullanıcıyı Giriş sayfasına yönlendirme.

        Hata durumlarında (Örn: Zaten kayıtlı e-posta) kullanıcıya uyarı mesajlarının gösterilmesi.

2. Giriş Yapma ve Yetkilendirme

    Sayfa / Bileşen: LoginPage / LoginForm bileşeni

    Açıklama: Kayıtlı kullanıcıların e-posta ve şifreleri ile sisteme erişerek kimlik doğrulama token'ı alması (REQ-2).

    Frontend Görevleri:

        Giriş formunun ve "Şifremi Unuttum" bağlantısının hazırlanması.

        API'den dönen JWT Token'ın localStorage veya sessionStorage üzerinde güvenli şekilde saklanması.

        Giriş yapan kullanıcının rolüne göre (User/Admin) doğru sayfaya yönlendirilmesini sağlayan mantığın kurulması.

3. Profil Görüntüleme ve Yönetimi

    Sayfa / Bileşen: ProfilePage / UserSummaryCard bileşeni

    Açıklama: Kullanıcının kendi profil bilgilerini, iletişim detaylarını ve üyelik seviyesini tek bir ekranda görmesini sağlayan alan (REQ-3).

    Frontend Görevleri:

        API'den gelen kullanıcı verilerinin (userId bazlı) bileşene aktarılması ve listelenmesi.

        Profil fotoğrafı alanı (varsa) ve temel kimlik bilgilerinin görselleştirilmesi.

        Sayfa yüklenirken "Loading" animasyonu ile kullanıcı deneyiminin iyileştirilmesi.

4. Profil Bilgilerini Güncelleme

    Sayfa / Bileşen: ProfilePage / EditProfileForm

    Açıklama: Kullanıcının telefon numarası, ad veya soyad gibi dinamik verilerini güncel tutmasını sağlar (REQ-4).

    Frontend Görevleri:

        Mevcut verilerin form alanlarına otomatik olarak (pre-fill) doldurulması.

        API üzerinden PUT /users/{userId} isteği ile güncellenen verilerin sunucuya gönderilmesi.

        Güncelleme işlemi başarılı olduğunda arayüzdeki verilerin anlık (state yönetimiyle) yenilenmesi.

5. Güvenli Şifre Değiştirme

    Sayfa / Bileşen: Settings / ChangePasswordForm

    Açıklama: Hesap güvenliğini sağlamak adına mevcut şifrenin yeni ve güçlü bir şifre ile güncellenmesi süreci (REQ-5).

    Frontend Görevleri:

        Eski şifre, yeni şifre ve yeni şifre onay alanlarının tasarlanması.

        İki yeni şifrenin birbiriyle eşleştiğinin frontend tarafında kontrol edilmesi.

        Şifre başarıyla değiştiğinde kullanıcının tekrar giriş yapması için sistemden güvenli çıkışının (logout) tetiklenmesi.

6. Yeni Rezervasyon Talebi Oluşturma

    Sayfa / Bileşen: FieldDetailPage / BookingForm

    Açıklama: Kullanıcının seçtiği saha, tarih ve saat dilimi için randevu isteği göndermesi (REQ-6).

    Frontend Görevleri:

        Seçilen saati ve tarihi içeren özet bir rezervasyon onay ekranının tasarlanması.

        API'ye POST /bookings isteği gönderilirken fieldId, userId, date ve timeSlot verilerinin doğru şekilde paketlenmesi.

        Çakışan saatler veya geçersiz işlemler için API'den dönen hata mesajlarının (Örn: "Saha dolu") kullanıcıya iletilmesi.

7. Rezervasyon İptal İşlemi

    Sayfa / Bileşen: MyBookings / BookingCancelModal

    Açıklama: Kullanıcının süresi gelmemiş veya işletme kurallarına uygun randevularını listeden kaldırmasını sağlar (REQ-7).

    Frontend Görevleri:

        "İptal Et" butonu tıklandığında kullanıcıdan onay alan bir modal (popup) yapısının tasarlanması.

        API üzerinden DELETE /bookings/{bookingId} isteğinin gönderilmesi.

        Silme işlemi sonrası listenin anlık güncellenerek iptal edilen maçın ekrandan kaldırılması.

8. Kişisel Maç ve Randevu Geçmişi

    Sayfa / Bileşen: MyBookingsPage / MatchHistoryList

    Açıklama: Kullanıcının geçmişte yaptığı ve gelecekteki tüm randevularını kronolojik olarak listeler (REQ-8).

    Frontend Görevleri:

        Randevuların "Beklemede", "Onaylı" veya "İptal" durumlarına göre görsel etiketlerle (badge) listelenmesi.

        Maç kartı içerisinde saha ismi, tarih ve saat bilgilerinin okunabilir şekilde sunulması.

        API'den gelen geniş maç listesinin performanslı bir şekilde map edilerek gösterilmesi.