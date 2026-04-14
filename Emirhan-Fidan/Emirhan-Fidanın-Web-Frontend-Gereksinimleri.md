🛡️ Saha Yönetimi ve Admin Paneli (Emirhan Fidan)

**Frontend Test Videosu:** [https://www.youtube.com/watch?v=ZZq1CLFn3YQ] 

9. Saha Listeleme (Saha Adı Odaklı)

    Sayfa / Bileşen: BookingPage / FieldSelector bileşeni

    Açıklama: Kullanıcının kiralama sürecinde sahaları isimleri üzerinden listeleyebildiği ve seçim yapabildiği arayüz (REQ-9).

    Frontend Görevleri:

        API'den gelen saha isimlerinin listelenmesi ve kullanıcıya seçim imkanı sunulması.

        Saha kiralama ekranında karmaşıklığı önlemek adına sadece saha adının ön planda tutulması.

        Kullanıcının doğru sahayı ismiyle ayırt edip kiralama işlemine devam etmesinin sağlanması.

        Mobil uyumlu (responsive) liste görünümünün sade bir yapıda korunması.

10. Saha Bilgisi İnceleme (Kimlik Doğrulama)

    Sayfa / Bileşen: FieldInfo / DetailCard

    Açıklama: Seçilen sahanın sistemdeki temel tanımlayıcı bilgilerinin (özellikle isminin) kontrol edildiği alan (REQ-10).

    Frontend Görevleri:

        Kiralama öncesi seçilen saha isminin kullanıcıya onay ekranında gösterilmesi.

        API'den gelen saha ID'sine göre sadece ilgili sahanın adının ekrana yansıtılması.

        Saha detay sayfasının şu anki aşamada sadece isim ve temel kimlik bilgileriyle çalışır hale getirilmesi.

11. Yeni Saha Tanımlama ve Ekleme

    Sayfa / Bileşen: AdminDashboard / AddFieldForm

    Açıklama: Yönetici tarafından sisteme yeni halı sahaların isimleri ve fiyatlarıyla kaydedilmesi (REQ-11).

    Frontend Görevleri:

        Yeni saha kaydı için isim ve fiyat giriş alanlarının (input) tasarlanması.

        Kayıt işlemi sırasında veritabanında oluşacak benzersiz saha adının doğrulanması.

        Formun gönderilmesi sonrası başarılı kayıt bildiriminin (toast/alert) kullanıcıya iletilmesi.

12. Saha Bilgilerini ve Fiyatları Güncelleme

    Sayfa / Bileşen: AdminDashboard / EditFieldForm

    Açıklama: Mevcut sahaların isim veya saatlik kira ücretlerinin güncellenmesini sağlayan arayüz (REQ-12).

    Frontend Görevleri:

        Güncellenecek sahanın adının form içerisinde otomatik olarak doldurulması (pre-fill).

        Fiyat güncellemeleri için sayısal giriş (number input) kontrollerinin yapılması.

        Değişiklikler sonrası API üzerinden PUT isteğiyle verilerin senkronize edilmesi.

13. Müsaitlik Durumu Sorgulama

    Sayfa / Bileşen: AvailabilityCalendar

    Açıklama: İsim bazlı seçilen sahanın, belirlenen tarihteki dolu ve boş saatlerinin kontrolü (REQ-13).

    Frontend Görevleri:

        Tarih seçimi sonrası seçili saha adına bağlı olarak saat dilimlerinin listelenmesi.

        Dolu saatlerin pasif (disabled), boş saatlerin ise seçilebilir halde sunulması.

14. Randevu Taleplerini Yönetme ve Onaylama

    Sayfa / Bileşen: AdminPanel / BookingApproval

    Açıklama: Adminin, hangi sahanın (isim bazlı) kim tarafından kiralandığını görüp onayladığı ekran (REQ-14).

    Frontend Görevleri:

        Gelen taleplerde saha isminin açıkça belirtildiği onay butonlarının tasarlanması.

        İşlem sonrası randevu durumunun (Onaylandı/Reddedildi) anlık olarak güncellenmesi.

15. İşletme Finansal ve Gelir Raporu

    Sayfa / Bileşen: AdminDashboard / FinanceCharts

    Açıklama: Onaylı rezervasyonlar üzerinden toplam gelirin ve en çok kiralanan saha isimlerinin takibi (REQ-15).

    Frontend Görevleri:

        Finansal verilerin grafiklerle (Chart.js vb.) görselleştirilmesi.

        Saha isimlerine göre gelir dağılımının istatistik kartlarında gösterilmesi.

16. Destek Talebi (Ticket) Sistemi

    Sayfa / Bileşen: Support / TicketForm

    Açıklama: Kullanıcının yaşadığı kiralama veya ödeme sorunlarını iletebileceği bilet oluşturma alanı (REQ-16).

    Frontend Görevleri:

        Konu, Mesaj ve Öncelik seviyesi (Düşük/Orta/Yüksek) alanlarının tasarlanması.

        API üzerinden POST /support/tickets entegrasyonunun tamamlanması.

17. Yönetici Paneli Giriş ve Yetkilendirme

    Sayfa / Bileşen: AdminLogin

    Açıklama: Sadece admin yetkisine sahip kullanıcıların yönetimsel verilere erişmesini sağlayan koruma katmanı (REQ-17).

    Frontend Görevleri:

        Admin özel giriş formunun tasarlanması ve Role-based Access (Rol bazlı erişim) kontrolünün yapılması.

        Yetkisiz kullanıcıların admin sayfalarına girişinin frontend tarafında (Guard) engellenmesi.