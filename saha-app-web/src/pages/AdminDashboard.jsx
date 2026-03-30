import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, DollarSign, List, ShieldAlert, CheckCircle, XCircle, Users, Edit2, X, Save } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('command-center');
    const [fields, setFields] = useState([]);
    const [report, setReport] = useState({ totalRevenue: 0, totalBookingsCount: 0 });
    const [pendingBookings, setPendingBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newField, setNewField] = useState({ name: '', address: '', pricePerHour: '', imageUrl: '' });

    // REQ-12: Düzenleme modal state'leri
    const [editingField, setEditingField] = useState(null); // Düzenlenen saha objesi
    const [editForm, setEditForm] = useState({ name: '', address: '', pricePerHour: '', features: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const [fieldsData, reportData, pendingData] = await Promise.all([
                fetchApi('/fields'),
                fetchApi('/admin/reports'),
                fetchApi('/admin/pending-bookings') // REQ 14 - Komuta Merkezi Data
            ]);
            setFields(fieldsData);
            setReport(reportData);
            setPendingBookings(pendingData);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // REQ-14 Rezervasyon Onaylama / Reddetme Fonksiyonu
    const handleBookingStatus = async (bookingId, status) => {
        const actionName = status === 'Onaylandı' ? 'onaylamak' : 'reddetmek';
        if (!window.confirm(`Bu rezervasyonu ${actionName} istediğinize emin misiniz?`)) return;
        
        try {
            await fetchApi(`/bookings/${bookingId}/confirm`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
            loadData();
        } catch (error) {
            alert("İşlem sırasında hata oluştu: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu sahayı silmek istediğinize emin misiniz?")) return;
        try {
            await fetchApi(`/fields/${id}`, { method: 'DELETE' });
            loadData();
        } catch (error) {
            alert("Silme hatası");
        }
    };

    const handleAddField = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/fields', {
                method: 'POST',
                body: JSON.stringify({ ...newField, pricePerHour: Number(newField.pricePerHour) })
            });
            setNewField({ name: '', address: '', pricePerHour: '', imageUrl: '' });
            loadData();
        } catch (error) {
            alert("Saha ekleme hatası");
        }
    };

    // REQ-12: Düzenleme modalını aç
    const handleEditOpen = (field) => {
        setEditingField(field);
        setEditSuccess(false);
        setEditForm({
            name: field.name || '',
            address: field.address || '',
            pricePerHour: field.pricePerHour || '',
            features: (field.features || []).join(', ')
        });
    };

    // REQ-12: Saha Bilgisi Güncelleme (PUT /api/fields/:fieldId)
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const payload = {
                name: editForm.name,
                address: editForm.address,
                pricePerHour: Number(editForm.pricePerHour),
                features: editForm.features
                    ? editForm.features.split(',').map(f => f.trim()).filter(Boolean)
                    : []
            };
            await fetchApi(`/fields/${editingField._id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            setEditSuccess(true);
            loadData();
            setTimeout(() => {
                setEditingField(null);
                setEditSuccess(false);
            }, 1200);
        } catch (error) {
            alert("Güncelleme hatası: " + error.message);
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#64748b'}}>Güvenli Yönetim Paneli Yükleniyor...</div>;

    const chartData = [
        { name: 'Rezervasyon Geliri', Kazaç: report.totalRevenue },
        { name: 'Toplam Kayıtlı Saha', Saha: fields.length }
    ];

    const tabBtnStyle = (tab) => ({
        padding: '16px 24px', fontSize: '16px', fontWeight: 'bold', border: 'none', background: 'transparent',
        borderBottom: activeTab === tab ? '3px solid #ef4444' : '3px solid transparent',
        color: activeTab === tab ? '#ef4444' : '#64748b', cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', gap: '8px'
    });

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', padding: '20px 0' }}>
            
            {/* REQ-12: Düzenleme Modalı */}
            {editingField && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', padding: '32px',
                        width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                        animation: 'none'
                    }}>
                        {/* Modal Başlık */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Edit2 size={20} color="#3b82f6" /> Saha Bilgilerini Düzenle
                                </h3>
                                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>{editingField.name}</p>
                            </div>
                            <button
                                onClick={() => setEditingField(null)}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex' }}
                            >
                                <X size={18} color="#64748b" />
                            </button>
                        </div>

                        {/* Başarı mesajı */}
                        {editSuccess && (
                            <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                                <CheckCircle size={18} /> Saha başarıyla güncellendi!
                            </div>
                        )}

                        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={modalLabelStyle}>Saha Adı</label>
                                <input
                                    type="text" required style={modalInputStyle}
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={modalLabelStyle}>Saatlik Ücret (₺)</label>
                                <input
                                    type="number" required min="0" style={modalInputStyle}
                                    value={editForm.pricePerHour}
                                    onChange={e => setEditForm({ ...editForm, pricePerHour: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={modalLabelStyle}>Adres</label>
                                <input
                                    type="text" style={modalInputStyle}
                                    value={editForm.address}
                                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={modalLabelStyle}>Özellikler (virgülle ayırın)</label>
                                <input
                                    type="text" style={modalInputStyle}
                                    placeholder="Örn: Duş, Otopark, Kafeterya"
                                    value={editForm.features}
                                    onChange={e => setEditForm({ ...editForm, features: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingField(null)}
                                    style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    style={{ flex: 2, padding: '12px', background: editLoading ? '#93c5fd' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: editLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <Save size={16} /> {editLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Yönetici Menüsü (Sekmeler) */}
            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '30px' }}>
                <button style={tabBtnStyle('command-center')} onClick={() => setActiveTab('command-center')}>
                    <ShieldAlert size={20} /> Komuta Merkezi (Onay Bekleyenler)
                    {pendingBookings.length > 0 && (
                        <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '12px', marginLeft: '5px' }}>
                            {pendingBookings.length}
                        </span>
                    )}
                </button>
                <button style={tabBtnStyle('finance-fields')} onClick={() => setActiveTab('finance-fields')}>
                    <DollarSign size={20} /> Finans ve Tesis Ayarları
                </button>
            </div>

            {/* SEKME 1: KOMUTA MERKEZİ (REQ-14 & 17) */}
            {activeTab === 'command-center' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <div>
                            <h2 style={{ color: '#0f172a', margin: '0 0 5px 0', fontSize: '26px' }}>Operasyon Merkezi</h2>
                            <p style={{ color: '#64748b', margin: 0 }}>Müşterilerden gelen saha rezervasyon isteklerini anında yönetin.</p>
                        </div>
                    </div>

                    {pendingBookings.length === 0 ? (
                        <div style={{ background: 'white', padding: '60px 40px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                            <CheckCircle color="#10b981" size={48} style={{ marginBottom: '15px' }} />
                            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>İşlem Bekleyen Randevu Yok</h3>
                            <p style={{ color: '#64748b', margin: 0 }}>Şu an tüm talepler yanıtsız bırakılmadı, kahvenizi yudumlayabilirsiniz!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {pendingBookings.map(b => (
                                <div key={b._id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                                        <div style={{ background: '#fef2f2', padding: '15px', borderRadius: '12px' }}>
                                            <Users color="#ef4444" size={32} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '18px' }}>{b.field?.name}</h3>
                                            <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                                                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>Müşteri: {b.user?.firstName} {b.user?.lastName}</span>
                                                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>📞 {b.user?.phone || 'Yok'}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '15px', color: '#475569', fontWeight: 'bold', fontSize: '15px' }}>
                                                <span>📅 {new Date(b.date).toLocaleDateString('tr-TR')}</span>
                                                <span>⏰ Saat: {b.timeSlot}</span>
                                                <span style={{ color: '#10b981' }}>💵 {b.field?.pricePerHour} ₺</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleBookingStatus(b._id, 'İptal Edildi')} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }} onMouseEnter={e=>e.target.style.background='#fee2e2'} onMouseLeave={e=>e.target.style.background='#fef2f2'}>
                                            <XCircle size={18} /> Reddet
                                        </button>
                                        <button onClick={() => handleBookingStatus(b._id, 'Onaylandı')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }} onMouseEnter={e=>e.target.style.transform='translateY(-2px)'} onMouseLeave={e=>e.target.style.transform='translateY(0)'}>
                                            <CheckCircle size={18} /> Onayla ve Kazanca Ekle
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* SEKME 2: FİNANS VE TESİS AYARLARI */}
            {activeTab === 'finance-fields' && (
                <div>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><DollarSign color="#10b981" size={28} /><h3 style={{ color: '#64748b', margin: 0 }}>Toplam Gelir</h3></div>
                            <p style={{ fontSize: '36px', fontWeight: 'black', margin: '10px 0 0 0', color: '#0f172a' }}>{report.totalRevenue} ₺</p>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Sistemdeki toplam onaylanmış fatura tutarı.</p>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><List color="#3b82f6" size={28} /><h3 style={{ color: '#64748b', margin: 0 }}>Toplam Saha</h3></div>
                            <p style={{ fontSize: '36px', fontWeight: 'black', margin: '10px 0 0 0', color: '#0f172a' }}>{fields.length}</p>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Aktif kiralama profilindeki sahalar.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '30px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '30px' }}>
                                <h3 style={{ marginBottom: '20px', color: '#334155', display: 'flex', gap:'8px', alignItems:'center' }}><PlusCircle size={20}/> Tesis (Saha) Ekle</h3>
                                <form onSubmit={handleAddField} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <input type="text" placeholder="Saha Adı (Örn: Merkez Spor Tesisi)" required style={inputStyle} value={newField.name} onChange={e => setNewField({...newField, name: e.target.value})} />
                                    <input type="number" placeholder="Saatlik Ücret (₺)" required style={inputStyle} value={newField.pricePerHour} onChange={e => setNewField({...newField, pricePerHour: e.target.value})} />
                                    <input type="text" placeholder="Adres" style={inputStyle} value={newField.address} onChange={e => setNewField({...newField, address: e.target.value})} />
                                    <button type="submit" style={{ padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Sahayı Veritabanına Kaydet</button>
                                </form>
                            </div>
                            
                            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                                <h3 style={{ marginBottom: '20px', color: '#334155' }}>Analiz Grafiği</h3>
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="Kazaç" fill="#10b981" /><Bar dataKey="Saha" fill="#3b82f6" /></BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* REQ-12: Aktif Sahalar - Düzenle + Sil butonları */}
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', alignSelf: 'flex-start' }}>
                            <h3 style={{ marginBottom: '20px', color: '#334155' }}>Aktif Sahalar ({fields.length})</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {fields.map(field => (
                                    <div key={field._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.06)'} onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                                        <div>
                                            <h4 style={{ margin: 0, color: '#0f172a', fontSize: '16px' }}>{field.name}</h4>
                                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>{field.pricePerHour} ₺/Saat</p>
                                            {field.features?.length > 0 && (
                                                <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>
                                                    🏷️ {field.features.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {/* REQ-12: Düzenle Butonu */}
                                            <button
                                                onClick={() => handleEditOpen(field)}
                                                style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.background='#dbeafe'}
                                                onMouseLeave={e => e.currentTarget.style.background='#eff6ff'}
                                            >
                                                <Edit2 size={15} /> Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(field._id)}
                                                style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.background='#fee2e2'}
                                                onMouseLeave={e => e.currentTarget.style.background='#fef2f2'}
                                            >
                                                <Trash2 size={15} /> Sil
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const inputStyle = { padding: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '15px' };
const modalInputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', color: '#1e293b', boxSizing: 'border-box', outline: 'none' };
const modalLabelStyle = { display: 'block', marginBottom: '6px', color: '#475569', fontWeight: 'bold', fontSize: '13px' };

export default AdminDashboard;
