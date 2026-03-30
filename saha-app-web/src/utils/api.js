// Lokal: VITE_API_URL=http://localhost:9000/api (.env.local)
// Vercel: Aynı domain üzerinden /api kullanılır
export const BASE_URL = import.meta.env.VITE_API_URL || '/api';
// İsteğe bağlı merkezi bir fetch veya axios yapısı kurabiliriz
export const fetchApi = async (endpoint, options = {}) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API İsteği başarısız');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
