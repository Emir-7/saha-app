import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, AlertCircle } from 'lucide-react';
import { fetchApi } from '../utils/api';

const AdminLogin = ({ setView, setSession }) => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Emirhan Fidan - POST /admin/login Endpoint'i çağırılır (Gereksinim 17)
            const response = await fetchApi('/admin/login', {
                method: 'POST',
                body: JSON.stringify(loginData),
            });
            
            // Başarılı giriş: Kullanıcıyı admin rolüyle session'a kaydet ve Admin Panosuna yönlendir
            setSession({ userId: response.adminId, role: 'admin' });
            setView('admin');
        } catch (err) {
            setError(err.message || "Yönetici hesabı doğrulanamadı.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{
                background: '#0f172a', /* Koyu Tema, normal loginden ayırmak için */
                backdropFilter: 'blur(10px)',
                width: '100%',
                maxWidth: '420px',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                border: '1px solid #334155',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                    }}>
                        <ShieldAlert color="white" size={28} />
                    </div>
                </div>
                
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 10px 0' }}>Saha Yönetim Paneli</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '25px' }}>Sadece yetkili tesis yöneticileri içindir.</p>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail color="#64748b" size={20} style={{ position: 'absolute', top: '14px', left: '14px' }} />
                        <input 
                            type="email" name="email" placeholder="Yönetici E-posta" value={loginData.email} onChange={handleChange} required
                            style={inputStyle}
                        />
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <Lock color="#64748b" size={20} style={{ position: 'absolute', top: '14px', left: '14px' }} />
                        <input 
                            type="password" name="password" placeholder="Yönetici Şifresi" value={loginData.password} onChange={handleChange} required
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={btnStyle(loading)}>
                        {loading ? 'Doğrulanıyor...' : 'Yönetici Girişi Yap'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', fontSize: '14px', color: '#64748b' }}>
                    <span onClick={() => setView('login')} style={{ color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>← Müşteri Girişine Dön</span>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%', padding: '14px 14px 14px 45px', borderRadius: '8px', 
    background: '#1e293b', border: '1px solid #334155', fontSize: '15px', color: 'white', 
    boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s'
};

const btnStyle = (loading) => ({
    background: loading ? '#f87171' : '#ef4444',
    color: 'white', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
    border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)', transition: 'background 0.2s'
});

export default AdminLogin;
