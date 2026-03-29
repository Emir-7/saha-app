import React, { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';

function App() {
    const [view, setView] = useState('home');
    const [session, setSession] = useState(null); // { userId: string, role: string }

    const handleLogout = () => {
        setSession(null);
        setView('home');
    };

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
                        <button onClick={() => setView('admin')} style={navBtnStyle(view === 'admin', '#f59e0b')}>Yönetici Paneli</button>
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
                {view === 'admin' && session?.role === 'admin' && <AdminDashboard />}
                {view === 'admin' && session?.role !== 'admin' && <div style={{textAlign:'center', marginTop: '50px', color: 'red'}}>Bu sayfaya erişim yetkiniz yok. (Admin girişi gereklidir)</div>}
                {view === 'login' && <Login setView={setView} setSession={setSession} />}
                {view === 'register' && <Register setView={setView} />}
                {view === 'profile' && session && <UserProfile session={session} />}
                
                {view === 'home' && (
                    <div style={{ textAlign: 'center', marginTop: '80px' }}>
                        <h1 style={{ color: '#1e293b', fontSize: '42px', margin: '0 0 20px 0' }}>Saha Rezervasyonlarına Modern Çözüm</h1>
                        <p style={{ fontSize: '20px', color: '#64748b', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                            Türkiye'nin en gelişmiş halı saha rezervasyon sistemine hoş geldiniz. Tesisimizi inceleyebilir, müsait saatleri anında görüntüleyip güvenle dakikalar içinde maçınızı ayarlayabilirsiniz.
                        </p>
                        
                        {!session ? (
                            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                <button onClick={() => setView('register')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 15px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }} onMouseEnter={(e)=>e.target.style.transform='translateY(-3px)'} onMouseLeave={(e)=>e.target.style.transform='translateY(0)'}>
                                    Hemen Üye Ol
                                </button>
                                <button onClick={() => setView('login')} style={{ background: 'white', color: '#1e293b', border: '2px solid #e2e8f0', padding: '16px 32px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.target.style.borderColor='#cbd5e1'} onMouseLeave={(e)=>e.target.style.borderColor='#e2e8f0'}>
                                    Zaten Hesabım Var
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setView('profile')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 15px rgba(59, 130, 246, 0.3)' }}>
                                Panelime Git ve Saha Kirala
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const navBtnStyle = (isActive, activeBg = '#3b82f6') => ({
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? activeBg : 'transparent',
    color: isActive ? 'white' : '#cbd5e1',
    fontWeight: 'bold',
    fontSize: '15px',
    transition: 'all 0.2s',
});

export default App;
