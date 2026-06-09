### 👤 Kullanıcı ve Rezervasyon İşlemleri (Hilmi Sinan Kaplan)

1. **Üye Olma**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Yeni kullanıcıların ad, soyad ve iletişim bilgileriyle sisteme kayıt olmasını sağlar. Kişisel bilgilerin toplanması ve sisteme ilk adımın atılması sürecidir.

2. **Giriş Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kayıtlı olan kullanıcıların bilgilerini kullanarak sisteme güvenli bir şekilde erişmesini sağlar. Kimlik doğrulama işlemi gerçekleştirilir.

3. **Profil Görüntüleme**
   - **API Metodu:** `GET /users/{userId}`
   - **Açıklama:** Kullanıcının kendi bilgilerini, iletişim detaylarını ve üyelik durumunu ekranda görmesini sağlar.

4. **Profil Güncelleme**
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcının değişen telefon numarası veya isim gibi kişisel bilgilerini sistem üzerinde güncel tutmasına imkan tanır.

5. **Şifre Değiştirme**
   - **API Metodu:** `PATCH /users/{userId}/password`
   - **Açıklama:** Kullanıcının hesap güvenliğini sağlamak amacıyla mevcut şifresini yeni ve daha güçlü bir şifre ile değiştirmesini sağlar.

6. **Rezervasyon Yapma**
   - **API Metodu:** `POST /bookings`
   - **Açıklama:** Kullanıcının istediği halı sahayı, günü ve saati seçerek maç randevusu oluşturmasını sağlar.

7. **Rezervasyon İptal Etme**
   - **API Metodu:** `DELETE /bookings/{bookingId}`
   - **Açıklama:** Kullanıcının henüz süresi gelmemiş olan randevularını listeden kaldırmasını ve iptal etmesini sağlar.

8. **Maç Geçmişini İzleme**
   - **API Metodu:** `GET /users/{userId}/bookings`
   - **Açıklama:** Kullanıcının geçmişte yaptığı maçları ve gelecekteki randevularını bir liste halinde görmesini sağlar.

---