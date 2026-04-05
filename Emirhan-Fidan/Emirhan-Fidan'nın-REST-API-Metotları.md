
# Emirhan Fidan'ın REST API Metotları

**API Test Videosu:** [https://www.youtube.com/watch?v=qnAWRXh4Dp0] 
## 9. Saha ve Tesis Listeleme
- **Endpoint:** `GET /fields`
- **Response:** `200 OK` - Tüm sahalar başarıyla listelendi

## 10. Detaylı Saha Verisi Görüntüleme
- **Endpoint:** `GET /fields/{fieldId}`
- **Path Parameters:**  
  - `fieldId` (string, required) - Saha ID'si
- **Response:** `200 OK` - Saha detayları başarıyla getirildi

## 11. Yeni Saha Tanımlama ve Ekleme
- **Endpoint:** `POST /fields`
- **Request Body:** 
```json
{
  "name": "Isparta Arena",
  "address": "Merkez, Isparta",
  "pricePerHour": 1500,
  "features": ["Duş", "Otopark"]
}
```
- **Authentication:** Bearer Token gerekli (Admin)
- **Response:** `201 Created` - Yeni saha başarıyla eklendi

## 12. Saha Bilgilerini ve Fiyatları Güncelleme
- **Endpoint:** `PUT /fields/{fieldId}`
- **Path Parameters:**  
  - `fieldId` (string, required) - Saha ID'si
- **Request Body:** 
```json
{
  "pricePerHour": 1600,
  "features": ["Duş", "Otopark", "Kafeterya"]
}
```
- **Authentication:** Bearer Token gerekli (Admin)
- **Response:** `200 OK` - Saha başarıyla güncellendi

## 13. Müsaitlik Durumu Sorgulama
- **Endpoint:** `GET /fields/{fieldId}/availability`
- **Path Parameters:**  
  - `fieldId` (string, required) - Saha ID'si
- **Query Parameters:**  
  - `date` (string, required) - Tarih (YYYY-MM-DD)
- **Response:** `200 OK` - Boş saat dilimleri listelendi

## 14. Randevu Taleplerini Yönetme ve Onaylama
- **Endpoint:** `PATCH /bookings/{bookingId}/confirm`
- **Path Parameters:**  
  - `bookingId` (string, required) - Rezervasyon ID'si
- **Request Body:** 
```json
{
  "status": "Confirmed"
}
```
- **Authentication:** Bearer Token gerekli (Admin)
- **Response:** `200 OK` - Rezervasyon durumu güncellendi

## 15. İşletme Finansal Raporlama
- **Endpoint:** `GET /admin/reports`
- **Authentication:** Bearer Token gerekli (Admin)
- **Response:** `200 OK` - Finansal raporlar başarıyla getirildi

## 16. Destek Talebi Oluşturma
- **Endpoint:** `POST /support/tickets`
- **Request Body:** 
```json
{
  "subject": "Ödeme Sorunu",
  "message": "Kredi kartı işlemi sırasında hata aldım."
}
```
- **Response:** `201 Created` - Destek talebi başarıyla oluşturuldu

## 17. Yönetici Paneli Giriş ve Yetkilendirme
- **Endpoint:** `POST /admin/login`
- **Request Body:** 
```json
{
  "email": "admin@sahaapp.com",
  "password": "AdminSifre123!"
}
```
- **Response:** `200 OK` - Yönetici girişi başarılı
