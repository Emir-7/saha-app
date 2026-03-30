import React, { useState } from 'react';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { fetchApi } from '../utils/api';

const Register = ({ setView }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError("Şifreler birbiriyle eşleşmiyor!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await fetchApi('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                }),
            });
            
            setSuccess(true);
            setTimeout(() => {
                setView('login');
            }, 2500);
            
        } catch (err) {
            setError(err.message || "Kayıt işlemi sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', padding: '20px' }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                width: '100%',
                maxWidth: '480px',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.4)',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        background: '#10b981',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)',
                        marginBottom: '15px'
                    }}>
                        <UserPlus color="white" size={28} />
                    </div>
                </div>
                
                <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 10px 0' }}>Hesap Oluştur</h2>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>Sistemden faydalanmak için hemen ücretsiz kayıt olun.</p>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{ background: '#d1fae5', color: '#047857', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <User color="#94a3b8" size={18} style={{ position: 'absolute', top: '15px', left: '14px' }} />
                            <input 
                                type="text" name="firstName" placeholder="Adınız" value={formData.firstName} onChange={handleChange} required
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input 
                                type="text" name="lastName" placeholder="Soyadınız" value={formData.lastName} onChange={handleChange} required
                                style={{...inputStyle, paddingLeft: '14px'}}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail color="#94a3b8" size={18} style={{ position: 'absolute', top: '15px', left: '14px' }} />
                        <input 
                            type="email" name="email" placeholder="E-posta Adresiniz" value={formData.email} onChange={handleChange} required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Phone color="#94a3b8" size={18} style={{ position: 'absolute', top: '15px', left: '14px' }} />
                        <input 
                            type="tel" name="phone" placeholder="Telefon Numaranız" value={formData.phone} onChange={handleChange} required
                            style={inputStyle}
                        />
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <Lock color="#94a3b8" size={18} style={{ position: 'absolute', top: '15px', left: '14px' }} />
                        <input 
                            type="password" name="password" placeholder="Şifreniz" value={formData.password} onChange={handleChange} required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock color="#94a3b8" size={18} style={{ position: 'absolute', top: '15px', left: '14px' }} />
                        <input 
                            type="password" name="confirmPassword" placeholder="Şifreniz (Tekrar)" value={formData.confirmPassword} onChange={handleChange} required
                            style={inputStyle}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || success}
                        style={{
                            background: loading ? '#6ee7b7' : '#10b981',
                            color: 'white',
                            padding: '14px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: (loading || success) ? 'not-allowed' : 'pointer',
                            marginTop: '10px',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            transition: 'background 0.3s',
                        }}
                    >
                        {loading ? 'Kaydediliyor...' : 'Ücretsiz Kayıt Ol'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
                    Zaten bir hesabınız var mı? <span onClick={() => setView('login')} style={{ color: '#10b981', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}>Giriş Yapın</span>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%', 
    padding: '14px 14px 14px 40px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    fontSize: '15px', 
    color: '#334155', 
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border 0.2s',
};

export default Register;
