
# Hilmi Sinan Kaplan'ın REST API Metotları

**API Test Videosu:** [https://youtu.be/mFirscZeRek]

## 1. Üye Olma
- **Endpoint:** `POST /auth/register`
- **Request Body:** ```json
  {
    "email": "hskaplan@example.com",
    "password": "GuvenliSifre123!",
    "firstName": "Hilmi Sinan",
    "lastName": "Kaplan"
  }
  ```
- **Response:** `201 Create` - Kullanıcı başarıyla oluşturuldu
## 2. Giriş Yapma ve Yetkilendirme
- **Endpoint:** `POST /auth/login`
- **Request Body:** 
```json
{
  "email": "hskaplan@example.com",
  "password": "GuvenliSifre123!"
}
```
- **Response:** `200 OK` - Giriş başarılı, erişim anahtarı döndürüldü

## 3. Profil Görüntüleme ve Yönetimi
- **Endpoint:** `GET /users/{userId}`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcının benzersiz kimliği
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Profil bilgileri başarıyla getirildi

## 4. Profil Bilgilerini Güncelleme
- **Endpoint:** `PUT /users/{userId}`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Request Body:** 
```json
{
  "firstName": "Sinan",
  "lastName": "Kaplan",
  "phone": "+905551112233"
}
```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Profil başarıyla güncellendi

## 5. Güvenli Şifre Değiştirme
- **Endpoint:** `PATCH /users/{userId}/password`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Request Body:** 
```json
{
  "oldPassword": "EskiSifre123!",
  "newPassword": "YeniSifre456!"
}
```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Şifre başarıyla güncellendi

## 6. Yeni Rezervasyon Talebi Oluşturma
- **Endpoint:** `POST /bookings`
- **Request Body:** 
```json
{
  "fieldId": "saha_id_123",
  "date": "2026-03-15",
  "timeSlot": "20:00-21:00"
}
```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Rezervasyon talebi başarıyla oluşturuldu

## 7. Rezervasyon İptal İşlemi
- **Endpoint:** `DELETE /bookings/{bookingId}`
- **Path Parameters:** 
  - `bookingId` (string, required) - Rezervasyon ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Rezervasyon başarıyla silindi

## 8. Kişisel Maç ve Randevu Geçmişi
- **Endpoint:** `GET /users/{userId}/bookings`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Randevu geçmişi başarıyla listelendi
