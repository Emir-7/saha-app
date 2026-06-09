// 🌐 API Konfigürasyonu
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

// İsteğe bağlı olarak diğer konfigürasyonları da burada tutabilirsiniz
export const API_TIMEOUT = 10000; // 10 saniye
export const API_RETRY_COUNT = 3;
