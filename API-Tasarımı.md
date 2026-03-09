# API Tasarımı - OpenAPI Specification (Saha-app)

**OpenAPI Spesifikasyon Dosyası:** [Rest-API.yaml](Rest-API.yaml)

Bu doküman, Saha-app Akıllı Halı Saha Rezervasyon ve İşletme Sistemi için OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış API tasarımını içermektedir.

## Proje Hakkında
Bu API; halı saha oyuncularının kolayca randevu almasını, işletmecilerin ise sahalarını, fiyatlarını ve gelirlerini yönetmesini sağlayan merkezi bir sistemdir.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Saha-app Akıllı Halı Saha Rezervasyon Sistemi
  description: |
    Saha-app platformu için RESTful API tasarımı.
    
    ## Özellikler
    - Kullanıcı Kaydı ve Giriş İşlemleri (JWT)
    - Saha ve Tesis Yönetimi
    - Akıllı Rezervasyon ve Müsaitlik Sorgulama
    - İşletme Finansal Raporlama
  version: 1.0.0
  contact:
    name: Emirhan Fidan & Hilmi Sinan Kaplan
    email: emirhanfidan@sdu.edu.tr

servers:
  - url: http://localhost:5000/api/v1
    description: Yerel Geliştirme Sunucusu

tags:
  - name: auth
    description: Kayıt ve Giriş işlemleri
  - name: users
    description: Profil ve maç geçmişi işlemleri
  - name: fields
    description: Saha ve tesis yönetim işlemleri
  - name: bookings
    description: Rezervasyon ve onay süreçleri
  - name: admin
    description: Raporlama ve destek işlemleri

paths:
  /auth/register:
    post:
      tags: [auth]
      summary: Üye Olma
      description: Yeni kullanıcıların ad, soyad ve iletişim bilgileriyle sisteme kayıt olmasını sağlar.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegisterInput'
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu

  /auth/login:
    post:
      tags: [auth]
      summary: Giriş Yapma
      description: Email ve şifre ile giriş yapılarak erişim anahtarı (JWT) alınır.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginInput'
      responses:
        '200':
          description: Giriş başarılı

  /fields:
    get:
      tags: [fields]
      summary: Sahaları Listeleme
      description: Sistemdeki tüm sahaların isim, konum ve özelliklerini listeler.
      responses:
        '200':
          description: Başarılı

  /fields/{fieldId}/availability:
    get:
      tags: [fields]
      summary: Boş Saatleri Sorgulama
      parameters:
        - name: date
          in: query
          required: true
          schema:
            type: string
            format: date
      responses:
        '200':
          description: Müsait saatler listelendi

  /bookings:
    post:
      tags: [bookings]
      summary: Rezervasyon Yapma
      description: Belirli bir saha ve saat dilimi için randevu talebi oluşturur.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookingCreateInput'
      responses:
        '201':
          description: Rezervasyon oluşturuldu

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    UserRegisterInput:
      type: object
      required: [email, password, firstName, lastName]
      properties:
        email: { type: string, format: email }
        password: { type: string, minLength: 6 }
        firstName: { type: string }
        lastName: { type: string }

    LoginInput:
      type: object
      required: [email, password]
      properties:
        email: { type: string, format: email }
        password: { type: string }

    BookingCreateInput:
      type: object
      required: [fieldId, date, timeSlot]
      properties:
        fieldId: { type: string }
        date: { type: string, format: date }
        timeSlot: { type: string, example: "21:00-22:00" }