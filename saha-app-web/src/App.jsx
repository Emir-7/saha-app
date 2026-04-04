import React, { useState, useEffect } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import AdminLogin from './pages/AdminLogin';
import { fetchApi } from './utils/api';

function App() {
    const [view, setView] = useState('home');
    const [session, setSession] = useState(null); // { userId: string, role: string }
    const [pendingCount, setPendingCount] = useState(0); // Admin Onay Bildirimi (REQ-14)

    useEffect(() => {
        if (session?.role === 'admin') {
            const getPending = async () => {
                try {
                    const data = await fetchApi('/admin/pending-bookings');
                    setPendingCount(data.length);
                } catch (e) {
                    console.error('Badge hatası', e);
                }
            };
            getPending();
            
            // Gerçek zamanlı bildirim hissi için 10 saniyede bir kontrol et
            const interval = setInterval(getPending, 10000);
            return () => clearInterval(interval);
        } else {
            setPendingCount(0);
        }
    }, [session, view]);

    const handleLogout = () => {
        setSession(null);
        setView('home');
    };

    const navBtnStyle = (isActive, activeColor = '#3b82f6') => ({
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: isActive ? activeColor : 'transparent',
        color: isActive ? 'white' : '#cbd5e1',
        fontWeight: 'bold',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
            {/* Premium Navigasyon Çubuğu */}
            <nav style={{ 
                backgroundColor: '#1e293b', padding: '15px 40px', display: 'flex', 
                justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                position: 'sticky', top: 0, zIndex: 100
            }}>
                <h2 onClick={() => setView('home')} style={{ color: 'white', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    ⚽ Saha-App
                </h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => setView('home')} style={navBtnStyle(view === 'home')}>Ana Sayfa</button>
                    
                    {/* Admin Butonu */}
                    {session?.role === 'admin' && (
                        <button onClick={() => setView('admin')} style={{...navBtnStyle(view === 'admin', '#f59e0b'), display: 'flex', alignItems: 'center'}}>
                            Yönetici Paneli
                            {pendingCount > 0 && (
                                <span style={{ marginLeft: '8px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)' }}>
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                    )}

                    {!session ? (
                        <>
                            <button onClick={() => setView('login')} style={navBtnStyle(view === 'login')}>Giriş Yap</button>
                            <button onClick={() => setView('register')} style={{...navBtnStyle(view === 'register'), background: '#10b981', color: 'white'}}>Ücretsiz Kayıt Ol</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setView('profile')} style={navBtnStyle(view === 'profile')}>Profilim</button>
                            <button onClick={handleLogout} style={{...navBtnStyle(false), color: '#f87171'}}>Çıkış Yap</button>
                        </>
                    )}
                </div>
            </nav>

            {/* Dinamik Sayfa Yönlendirmesi (Routing) */}
            <div style={{ padding: '20px' }}>
                {view === 'admin' && session?.role === 'admin' && <AdminDashboard session={session} />}
                {view === 'admin' && session?.role !== 'admin' && <div style={{textAlign:'center', marginTop: '50px', color: 'red'}}>Bu sayfaya erişim yetkiniz yok. (Admin girişi gereklidir)</div>}
                {view === 'login' && <Login setView={setView} setSession={setSession} />}
                {view === 'admin-login' && <AdminLogin setView={setView} setSession={setSession} />}
                {view === 'register' && <Register setView={setView} />}
                {view === 'profile' && session && <UserProfile session={session} />}
                
                {view === 'home' && (
                    <div style={{ textAlign: 'center', marginTop: '80px' }}>
                        <h1 style={{ color: '#1e293b', fontSize: '42px', margin: '0 0 20px 0' }}>Saha Rezervasyonlarına Modern Çözüm</h1>
                        <p style={{ fontSize: '20px', color: '#64748b', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                            Türkiye'nin en gelişmiş halı saha rezervasyon sistemine hoş geldiniz. Tesisimizi inceleyebilir, müsait saatleri anında görüntüleyip güvenle dakikalar içinde maçınızı ayarlayabilirsiniz.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
