// API URL'ini ortama (canlı/lokal) göre otomatik ayarla
// Eğer tarayıcıda 'localhost' üzerinden çalışıyorsak localhost:9000'e gitsin (Lokal)
// Eğer canlıda (Vercel) ise, mevcut domain üzerinden /api yoluna gitsin (Canlı)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const BASE_URL = isLocalhost 
    ? 'http://localhost:9000/api'                           // Lokal geliştirme
    : 'https://saha-app.onrender.com/api';                  // Canlı (Render Backend)

export const fetchApi = async (endpoint, options = {}) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        console.log(`📡 API İsteği: ${url}`); // Debug için terminalde/konsolda görünecek

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const textData = await response.text();
            console.error('❌ Beklenmedik Yanıt (JSON Değil):', textData);
            throw new Error(`Sunucudan geçersiz yanıt alındı (HTML dönmüş olabilir). Detaylar konsolda.`);
        }
        
        if (!response.ok) {
            throw new Error(data.error || 'API İsteği başarısız');
        }

        return data;
    } catch (error) {
        console.error('❌ API Hatası:', error);
        throw error;
    }
};
