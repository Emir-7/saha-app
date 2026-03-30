import React, { useState, useEffect } from 'react';
import { User, Key, CalendarClock, History, Settings, X, CheckCircle, CreditCard, ChevronDown } from 'lucide-react';
import { fetchApi } from '../utils/api';

const UserProfile = ({ session }) => {
    const [activeTab, setActiveTab] = useState('bookings');
    
    const [userData, setUserData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [fields, setFields] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    
    // Form States
    const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '' });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
    const [bookingForm, setBookingForm] = useState({ field: '', date: '', timeSlot: '' });

    // Verileri Yükle
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [userRes, bookingsRes, fieldsRes] = await Promise.all([
                    fetchApi(`/users/${session.userId}`),
                    fetchApi(`/users/${session.userId}/bookings`),
                    fetchApi('/fields')
                ]);
                
                setUserData(userRes);
                setProfileForm({ firstName: userRes.firstName, lastName: userRes.lastName, phone: userRes.phone || '' });
                setBookings(bookingsRes);
                setFields(fieldsRes);
                
            } catch (err) {
                showAlert('Hata: Bilgiler yüklenemedi.', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [session.userId]);

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 4000);
    };

    // 1. Profil Güncelleme (PUT)
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const updated = await fetchApi(`/users/${session.userId}`, {
                method: 'PUT',
                body: JSON.stringify(profileForm)
            });
            setUserData(updated);
            showAlert('Profil başarıyla güncellendi!');
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    // 2. Şifre Değiştirme (PATCH)
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchApi(`/users/${session.userId}/password`, {
                method: 'PATCH',
                body: JSON.stringify(passwordForm)
            });
            showAlert(res.message);
            setPasswordForm({ oldPassword: '', newPassword: '' });
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    // 3. Rezervasyon İstemi (POST)
    const handleCreateBooking = async (e) => {
        e.preventDefault();
        try {
            const newBooking = await fetchApi('/bookings', {
                method: 'POST',
                body: JSON.stringify({ ...bookingForm, user: session.userId })
            });
            showAlert(newBooking.message);
            setBookingForm({ field: '', date: '', timeSlot: '' }); // Reset
            
            // Listeyi yenile
            const freshBookings = await fetchApi(`/users/${session.userId}/bookings`);
            setBookings(freshBookings);
            setActiveTab('bookings');
            
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    // 4. Rezervasyon İptali (DELETE)
    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) return;
        
        try {
            const res = await fetchApi(`/bookings/${bookingId}`, { method: 'DELETE' });
            showAlert(res.message);
            setBookings(bookings.filter(b => b._id !== bookingId));
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#64748b' }}>Bilgileriniz yükleniyor...</div>;

    const navBtnStyle = (tab) => ({
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px',
        fontWeight: 'bold', fontSize: '15px', border: 'none', background: 'transparent',
        borderBottom: activeTab === tab ? '3px solid #3b82f6' : '3px solid transparent',
        color: activeTab === tab ? '#3b82f6' : '#64748b', cursor: 'pointer',
        transition: 'all 0.2s', whiteSpace: 'nowrap'
    });

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            
            {/* Üst Karşılama Alanı */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', padding: '25px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
                    {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                </div>
                <div>
                    <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#1e293b' }}>Merhaba, {userData?.firstName}</h1>
                    <p style={{ margin: 0, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={16}/> Standart Oyuncu</p>
                </div>
            </div>

            {/* Uyarı Mesajları */}
            {alert && (
                <div style={{ background: alert.type === 'error' ? '#fee2e2' : '#dcfce3', color: alert.type === 'error' ? '#b91c1c' : '#15803d', padding: '15px 20px', borderRadius: '10px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    {alert.type === 'error' ? <X size={20}/> : <CheckCircle size={20}/>}
                    {alert.message}
                </div>
            )}

            {/* İçerik Paneli */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                
                {/* Menü Bar */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', overflowX: 'auto' }}>
                    <button style={navBtnStyle('bookings')} onClick={() => setActiveTab('bookings')}><History size={18}/> Maç Geçmişim</button>
                    <button style={navBtnStyle('new-booking')} onClick={() => setActiveTab('new-booking')}><CalendarClock size={18}/> Saha Kirala</button>
                    <button style={navBtnStyle('profile')} onClick={() => setActiveTab('profile')}><Settings size={18}/> Profil Ayarları</button>
                    <button style={navBtnStyle('security')} onClick={() => setActiveTab('security')}><Key size={18}/> Şifre Değiştir</button>
                </div>

                <div style={{ padding: '30px' }}>
                    
                    {/* TAB: Maç Geçmişim (Rezervasyonlar) */}
                    {activeTab === 'bookings' && (
                        <div>
                            <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', color: '#1e293b' }}>Mevcut ve Geçmiş Randevularım</h2>
                            {bookings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', color: '#94a3b8' }}>Henüz hesapta bir rezervasyon kaydı bulunmuyor.</div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                    {bookings.map(b => (
                                        <div key={b._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', position: 'relative', transition: 'box-shadow 0.2s', cursor: 'default' }} onMouseEnter={(e)=>e.currentTarget.style.boxShadow='0 10px 25px rgba(0,0,0,0.05)'} onMouseLeave={(e)=>e.currentTarget.style.boxShadow='none'}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                                <div>
                                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#1e293b' }}>{b.field?.name || 'Saha Silinmiş'}</h3>
                                                    <span style={{ fontSize: '13px', background: b.status==='Onaylandı' ? '#dcfce3' : b.status==='İptal Edildi' ? '#fee2e2' : '#fef9c3', color: b.status==='Onaylandı' ? '#15803d' : b.status==='İptal Edildi' ? '#b91c1c' : '#854d0e', padding: '4px 8px', borderRadius: '20px', fontWeight: 'bold' }}>
                                                        {b.status}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>₺{b.field?.pricePerHour || '?'}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>
                                                <div style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px' }}>📅 {new Date(b.date).toLocaleDateString('tr-TR')}</div>
                                                <div style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px' }}>⏰ {b.timeSlot}</div>
                                            </div>
                                            
                                            {b.status !== 'İptal Edildi' && (
                                                <button onClick={() => handleCancelBooking(b._id)} style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.target.style.background='#fecaca'} onMouseLeave={(e)=>e.target.style.background='#fee2e2'}>
                                                    İptal Et
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: Saha Kirala */}
                    {activeTab === 'new-booking' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', color: '#1e293b' }}>Yeni Rezervasyon Talebi</h2>
                            <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Saha Seçimi</label>
                                    <select required value={bookingForm.field} onChange={e => setBookingForm({...bookingForm, field: e.target.value})} style={inputStyle}>
                                        <option value="">-- Listeden Bir Saha Seçin --</option>
                                        {fields.map(f => (<option key={f._id} value={f._id}>{f.name} (₺{f.pricePerHour}/Saat) - {f.location}</option>))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Tarih</label>
                                        <input type="date" required value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} style={inputStyle} min={new Date().toISOString().split('T')[0]}/>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Saat Aralığı</label>
                                        <select required value={bookingForm.timeSlot} onChange={e => setBookingForm({...bookingForm, timeSlot: e.target.value})} style={inputStyle}>
                                            <option value="">Saat Seçin</option>
                                            <option value="18:00 - 19:00">18:00 - 19:00</option>
                                            <option value="19:00 - 20:00">19:00 - 20:00</option>
                                            <option value="20:00 - 21:00">20:00 - 21:00</option>
                                            <option value="21:00 - 22:00">21:00 - 22:00</option>
                                            <option value="22:00 - 23:00">22:00 - 23:00</option>
                                            <option value="23:00 - 00:00">23:00 - 00:00</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" style={btnPrimary}>Müsaitlik Sor ve Rezervasyon Yap</button>
                            </form>
                        </div>
                    )}

                    {/* TAB: Profil Ayarları */}
                    {activeTab === 'profile' && (
                        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                            <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', color: '#1e293b' }}>Kişisel Bilgileriniz</h2>
                            <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Adınız</label>
                                        <input type="text" value={profileForm.firstName} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} style={inputStyle} required/>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Soyadınız</label>
                                        <input type="text" value={profileForm.lastName} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} style={inputStyle} required/>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Telefon Numaranız</label>
                                    <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} style={inputStyle} />
                                </div>
                                <div style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                    <label style={labelStyle}>Kayıtlı E-posta (Değiştirilemez)</label>
                                    <input type="email" value={userData?.email} disabled style={inputStyle} />
                                </div>
                                <button type="submit" style={btnPrimary}>Değişiklikleri Kaydet</button>
                            </form>
                        </div>
                    )}

                    {/* TAB: Şifre Değiştirme */}
                    {activeTab === 'security' && (
                        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                            <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><Key color="#f59e0b"/> Güvenlik Ayarları</h2>
                            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Mevcut Şifreniz</label>
                                    <input type="password" value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} style={inputStyle} required minLength="6"/>
                                </div>
                                <div>
                                    <label style={labelStyle}>Yeni Şifreniz</label>
                                    <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} style={inputStyle} required minLength="6"/>
                                </div>
                                <button type="submit" style={{...btnPrimary, background: '#f59e0b', color: 'white'}}>Güvenli Olarak Şifreyi Güncelle</button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#1e293b', boxSizing: 'border-box', outline: 'none' };
const labelStyle = { display: 'block', marginBottom: '6px', color: '#475569', fontWeight: 'bold', fontSize: '13px' };
const btnPrimary = { width: '100%', padding: '14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' };

export default UserProfile;
