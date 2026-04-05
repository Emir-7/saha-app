import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { fetchApi } from '../utils/api';

const Login = ({ setView, setSession }) => {
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
            const response = await fetchApi('/auth/login', {
                method: 'POST',
                body: JSON.stringify(loginData),
            });
            
            // Başarılı giriş: Kullanıcıyı session'a kaydet ve Profile yönlendir
            setSession({ userId: response.userId, role: response.role });
            setView('profile');
        } catch (err) {
            setError(err.message || "Giriş yapılamadı. Tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                width: '100%',
                maxWidth: '420px',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                border: '1px solid rgba(255,255,255,0.4)',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        background: '#3b82f6',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)'
                    }}>
                        <LogIn color="white" size={28} />
                    </div>
                </div>
                
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 10px 0' }}>Sisteme Giriş Yap</h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>Saha rezervasyonlarına devam etmek için oturum açın.</p>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail color="#94a3b8" size={20} style={{ position: 'absolute', top: '14px', left: '14px' }} />
                        <input 
                            type="email" 
                            name="email"
                            placeholder="E-posta adresiniz" 
                            value={loginData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%', padding: '14px 14px 14px 45px', borderRadius: '8px', 
                                border: '1px solid #e2e8f0', fontSize: '15px', color: '#334155', boxSizing: 'border-box',
                                transition: 'all 0.3s'
                            }}
                        />
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <Lock color="#94a3b8" size={20} style={{ position: 'absolute', top: '14px', left: '14px' }} />
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Şifreniz" 
                            value={loginData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%', padding: '14px 14px 14px 45px', borderRadius: '8px', 
                                border: '1px solid #e2e8f0', fontSize: '15px', color: '#334155', boxSizing: 'border-box',
                                transition: 'all 0.3s'
                            }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            background: loading ? '#93c5fd' : '#2563eb',
                            color: 'white',
                            padding: '14px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '10px',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                            transition: 'all 0.2s',
                        }}
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

<<<<<<< HEAD
                <div style={{ marginTop: '25px', fontSize: '14px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>Hesabınız yok mu? <span onClick={() => setView('register')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}>Kayıt Olun</span></div>
                    <div onClick={() => setView('admin-login')} style={{ color: '#94a3b8', fontSize: '12px', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>
                        Tesis Yöneticisi Girişi
                    </div>
=======
                <div style={{ marginTop: '25px', fontSize: '14px', color: '#64748b' }}>
                    Hesabınız yok mu? <span onClick={() => setView('register')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}>Kayıt Olun</span>
>>>>>>> origin/HSKaplan
                </div>
            </div>
        </div>
    );
};

export default Login;
