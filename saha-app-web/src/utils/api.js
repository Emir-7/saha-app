
export const fetchApi = async (endpoint, options = {}) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        console.log(`📡 API İsteği: ${url}`); // Debug için terminalde/konsolda görünecek

        const response = await fetch(url, {
            ...options,

            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '', // Token'ı otomatik ekler
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
