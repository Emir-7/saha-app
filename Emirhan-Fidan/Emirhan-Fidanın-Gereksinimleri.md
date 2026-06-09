# Emirhan Fidanın Gereksinimleri (9-17)

Bu doküman, Saha-App projesinin 3. ve 4. aşamaları kapsamında Emirhan Fidan tarafından geliştirilen REST API noktalarını ve Frontend gereksinimlerini listelemektedir. Tüm API istekleri `https://saha-app.onrender.com/api` adresine yapılmaktadır.

| No | İşlem Adı | HTTP Metodu | Route (Endpoint) | Açıklama |
| --- | --- | --- | --- | --- |
| 9 | Sahaları Listeleme | `GET` | `/fields` | Sistemdeki tüm sahaları listeler. |
| 10 | Detay Görüntüleme | `GET` | `/fields/:fieldId` | ID'si verilen özel bir sahanın bilgilerini getirir. |
| 11 | Yeni Saha Ekleme | `POST` | `/fields` | Yeni bir saha kaydı oluşturur (Sadece admin paneli). |
| 12 | Saha Güncelleme | `PUT` | `/fields/:fieldId` | Mevcut bir sahanın fiyat, adres vb. bilgilerini günceller. |
| 13 | Müsaitlik Sorgulama | `GET` | `/fields/:fieldId/availability`| İlgili sahanın rezervasyon müsaitlik durumunu döndürür. |
| 14 | Rezervasyon Onayı | `PATCH` | `/bookings/:bookingId/confirm`| Adminin gelen bir rezervasyon talebini onaylamasını veya reddetmesini sağlar. |
| 15 | Finansal Rapor | `GET` | `/admin/reports` | Tüm onaylı rezervasyonlar üzerinden toplam hesaplanan günlük/aylık gelir grafikleri için veri sağlar. |
| 16 | Destek Talebi | `POST` | `/support/tickets` | Kullanıcıların sorun bildirmesi veya yardım istemesi için `Ticket` oluşturur. |
| 17 | Admin Girişi | `POST` | `/admin/login` | Yönetici paneline erişim için yetkilendirme sağlar. |

### Ek Olarak Geliştirilenler

*   **Saha Silme**: `DELETE /fields/:fieldId` -> Yanlış girilen sahaları panelden kalıcı olarak kaldırmak için.
*   **Ticket Modeli**: Mongoose üzerinde Destek Talebi işlemleri için oluşturulmuştur.
*   **Arayüz (Dashboard)**: Gelir, kayıtlı saha sayısı, API destekli saha ekleme/silme özelliklerine sahip `AdminDashboard.jsx` geliştirilmiştir.