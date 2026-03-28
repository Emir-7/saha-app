import React, { useEffect, useState } from 'react';

function App() {
    const [apiStatus, setApiStatus] = useState('Yükleniyor...');
    const [error, setError] = useState(false);

    useEffect(() => {
        // Port 9000'e yapacağımız istek (Backend'te tanımlı olan "/api/fields" endpointini kullanıyoruz)
        fetch('http://localhost:9000/api/fields')
            .then((res) => {
                if (!res.ok) throw new Error('Sunucudan hatalı yanıt geldi');
                return res.json();
            })
            .then((data) => {
                setApiStatus('Bağlantı Başarılı! (✓) API Ayakta');
                setError(false);
            })
            .catch((err) => {
                console.error(err);
                setApiStatus('API Bağlantı Hatası veya Sunucu Kapalı');
                setError(true);
            });
    }, []);

    return (
        <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ color: '#2c3e50' }}>Saha-App Rezervasyon Sistemi</h1>

            <div style={{
                padding: '20px 40px',
                background: 'white',
                display: 'inline-block',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
                    Sistem Durumu
                </h2>

                <p style={{ fontSize: '18px' }}>
                    <strong>Frontend (React):</strong> <span style={{ color: '#27ae60' }}>Çalışıyor</span>
                </p>

                <p style={{ fontSize: '18px' }}>
                    <strong>Backend (API) (Port 9000):</strong> <span style={{ color: error ? '#c0392b' : '#27ae60' }}>{apiStatus}</span>
                </p>
            </div>
        </div>
    );
}

export default App;
