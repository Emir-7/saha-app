import React, { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    const [view, setView] = useState('home');

    return (
        <div>
            {/* Navigasyon Çubuğu */}
            <nav style={{ backgroundColor: '#1e293b', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: 'white', margin: 0 }}>Saha-App</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setView('home')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: view === 'home' ? '#3b82f6' : 'transparent', color: view === 'home' ? 'white' : '#cbd5e1', fontWeight: 'bold' }}>
                        Ana Sayfa
                    </button>
                    <button 
                        onClick={() => setView('admin')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: view === 'admin' ? '#3b82f6' : 'transparent', color: view === 'admin' ? 'white' : '#cbd5e1', fontWeight: 'bold' }}>
                        Yönetici Paneli (Emirhan)
                    </button>
                </div>
            </nav>

            {/* İçerik */}
            {view === 'admin' ? (
                <AdminDashboard />
            ) : (
                <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', textAlign: 'center', marginTop: '50px' }}>
                    <h1 style={{ color: '#2c3e50' }}>Saha-App Rezervasyon Sistemi</h1>
                    
                    <div style={{
                        padding: '40px',
                        background: 'white',
                        display: 'inline-block',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        maxWidth: '600px',
                        lineHeight: '1.6'
                    }}>
                        <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
                            Sisteme Hoş Geldiniz
                        </h2>
                        <p style={{ fontSize: '18px', color: '#64748b' }}>
                            Yukarıdaki menüden <strong>Yönetici Paneli</strong>'ne geçerek sahaları ekleyebilir, silebilir ve 
                            yapılan rezervasyonların finansal analiz grafiklerini görüntüleyebilirsiniz. API bağlantıları `https://saha-app.onrender.com/api` adresine ayarlanmıştır.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
