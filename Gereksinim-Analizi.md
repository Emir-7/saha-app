# Tüm Gereksinimler 

1- Üye Olma (Hilmi Sinan Kaplan)
   API Metodu: POST /auth/register
   Açıklama: Son kullanıcıların (oyuncuların) sisteme kaydolmasını sağlar. Ad, soyad, e-posta ve telefon bilgileriyle güvenli hesap oluşturulur.

2- Giriş Yapma ve Yetkilendirme (Hilmi Sinan Kaplan)
   API Metodu: POST /auth/login
   Açıklama: Kayıtlı kullanıcıların sisteme erişim sağlamasını ve sonraki işlemler için gerekli olan kimlik doğrulama token'ını almasını sağlar.

3- Profil Görüntüleme ve Yönetimi (Hilmi Sinan Kaplan)
   API Metodu: GET /users/{userId}
   Açıklama: Kullanıcının kendi profil bilgilerini, iletişim detaylarını ve üyelik seviyesini görüntülemesini sağlar.

4- Profil Bilgilerini Güncelleme (Hilmi Sinan Kaplan)
   API Metodu: PUT /users/{userId}
   Açıklama: Kullanıcının ad, soyad ve telefon gibi kişisel verilerini güncel tutmasına olanak tanır.

5- Güvenli Şifre Değiştirme (Hilmi Sinan Kaplan)
   API Metodu: PATCH /users/{userId}/password
   Açıklama: Kullanıcının mevcut şifresini güvenlik amacıyla yeni ve güçlü bir şifre ile güncellemesini sağlar.

6- Yeni Rezervasyon Talebi Oluşturma (Hilmi Sinan Kaplan)
   API Metodu: POST /bookings
   Açıklama: Kullanıcının seçtiği saha, tarih ve saat dilimi için sistem üzerinden randevu talebi oluşturmasını sağlar.

7- Rezervasyon İptal İşlemi (Hilmi Sinan Kaplan)
   API Metodu: DELETE /bookings/{bookingId}
   Açıklama: Kullanıcının henüz süresi geçmemiş veya işletme kurallarına uygun randevularını sistemden kaldırmasını sağlar.

8- Kişisel Maç ve Randevu Geçmişi (Hilmi Sinan Kaplan)
   API Metodu: GET /users/{userId}/bookings
   Açıklama: Kullanıcının geçmişte yaptığı ve gelecekteki tüm randevularını listeleyerek bir maç takvimi sunar.
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

   # Gereksinim Dağılımları

1. [Hilmi Sinan Kaplanın Gereksinimleri](Hilmi-Sinan-Kaplan/Hilmi-Sinan-Kaplanın-Gerksinimleri.md)
2. [Emirhan Fidanın Gereksinimleri](Emirhan-Fidan/Emirhan-Fidanın-Gereksinimleri.md)