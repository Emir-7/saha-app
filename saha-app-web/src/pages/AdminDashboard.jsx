import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, DollarSign, List } from 'lucide-react';

const AdminDashboard = () => {
    const [fields, setFields] = useState([]);
    const [report, setReport] = useState({ totalRevenue: 0, totalBookingsCount: 0 });
    const [loading, setLoading] = useState(true);

    const [newField, setNewField] = useState({
        name: '',
        address: '',
        pricePerHour: '',
        imageUrl: ''
    });

    const loadData = async () => {
        try {
            const fieldsData = await fetchApi('/fields');
            setFields(fieldsData);

            const reportData = await fetchApi('/admin/reports');
            setReport(reportData);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

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
                body: JSON.stringify({
                    ...newField,
                    pricePerHour: Number(newField.pricePerHour)
                })
            });
            setNewField({ name: '', address: '', pricePerHour: '', imageUrl: '' });
            loadData();
        } catch (error) {
            alert("Saha ekleme hatası");
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Yükleniyor...</div>;

    const chartData = [
        { name: 'Rezervasyon Geliri', Kazaç: report.totalRevenue },
        { name: 'Toplam Kayıtlı Saha', Saha: fields.length }
    ];

    return (
        <div style={{ padding: '40px', fontFamily: 'Inter, sans-serif', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <h1 style={{ color: '#1e293b', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Yönetici Paneli (Dashboard)
            </h1>

            {/* İstatistik Kartları */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <DollarSign color="#10b981" size={28} />
                        <h3 style={{ color: '#64748b', margin: 0 }}>Toplam Gelir</h3>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#0f172a' }}>
                        {report.totalRevenue} ₺
                    </p>
                </div>

                <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <List color="#3b82f6" size={28} />
                        <h3 style={{ color: '#64748b', margin: 0 }}>Toplam Saha</h3>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#0f172a' }}>
                        {fields.length}
                    </p>
                </div>
            </div>

            {/* Grafikler */}
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: '#334155' }}>Analiz Grafiği</h3>
                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="Kazaç" fill="#10b981" />
                            <Bar dataKey="Saha" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Saha Ekleme Formu */}
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={20} /> Yeni Saha Ekle
                </h3>
                <form onSubmit={handleAddField} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input type="text" placeholder="Saha Adı" required style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                           value={newField.name} onChange={e => setNewField({...newField, name: e.target.value})} />
                    <input type="number" placeholder="Saatlik Ücret (₺)" required style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                           value={newField.pricePerHour} onChange={e => setNewField({...newField, pricePerHour: e.target.value})} />
                    <input type="text" placeholder="Adres" style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', gridColumn: 'span 2', outline: 'none' }}
                           value={newField.address} onChange={e => setNewField({...newField, address: e.target.value})} />
                    <button type="submit" style={{ gridColumn: 'span 2', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#2563eb' } }}>
                        Sahayı Kaydet
                    </button>
                </form>
            </div>

            {/* Sahalar Listesi */}
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <h3 style={{ marginBottom: '20px', color: '#334155' }}>Mevcut Sahalar ({fields.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {fields.map(field => (
                        <div key={field._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <div>
                                <h4 style={{ margin: 0, color: '#0f172a' }}>{field.name}</h4>
                                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>{field.address} - {field.pricePerHour}₺/Saat</p>
                            </div>
                            <button onClick={() => handleDelete(field._id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Trash2 size={16} /> Sil
                            </button>
                        </div>
                    ))}
                    {fields.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', margin: '20px 0' }}>Henüz kayıtlı bir saha bulunmamaktadır.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
