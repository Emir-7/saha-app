import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, Dimensions, Platform
} from 'react-native';
import axios from 'axios';
// HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI
// import DateTimePicker from '@react-native-community/datetimepicker';

// Canlı API Bağlantısı
const BASE_URL = 'https://saha-app.onrender.com/api';

// --- 🚀 YENİ: WEB VE MOBİL %100 GARANTİLİ UYARI SİSTEMİ ---
const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// Backend Hatalarını Yakalayan Yardımcı Fonksiyon
const getErrorMessage = (err) => {
  return err.response?.data?.message || err.response?.data?.error || err.message || "Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.";
};

export default function App() {
  const [view, setView] = useState('home');
  const [session, setSession] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  // HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI
  // const [showDatePicker, setShowDatePicker] = useState(false);

  // --------------- KULLANICI STATE'LERİ ---------------
  // HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI
  // const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  // const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  // const [userProfile, setUserProfile] = useState({});
  // const [userBookings, setUserBookings] = useState([]);
  // const [userActiveTab, setUserActiveTab] = useState('bookings');
  // 
  // const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '' });
  // const [bookingForm, setBookingForm] = useState({ field: '', date: '', timeSlot: '' });
  // const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  
  // Destek talebi formu Emirhan Fidan'ın sorumluluğundadır
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '' });

  // --------------- ADMİN STATE'LERİ ---------------
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [adminActiveTab, setAdminActiveTab] = useState('command-center');
  const [adminFields, setAdminFields] = useState([]);
  const [adminReport, setAdminReport] = useState({ totalRevenue: 0, totalBookingsCount: 0 });
  const [pendingBookings, setPendingBookings] = useState([]);
  const [adminTickets, setAdminTickets] = useState([]);
  const [newFieldForm, setNewFieldForm] = useState({ name: '', pricePerHour: '', address: '' });
  const [adminProfile, setAdminProfile] = useState({ firstName: '', lastName: '', email: '', password: '' });

  // HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI
  // const loadUserData = async () => {
  //   if (!session?.userId) return;
  //   try {
  //     setGlobalLoading(true);
  //     const [userRes, bookingsRes, fieldsRes] = await Promise.all([
  //       axios.get(`${BASE_URL}/users/${session.userId}`).catch(() => ({ data: {} })),
  //       axios.get(`${BASE_URL}/users/${session.userId}/bookings`).catch(() => ({ data: [] })),
  //       axios.get(`${BASE_URL}/fields`).catch(() => ({ data: [] }))
  //     ]);
  //     setUserProfile(userRes.data);
  //     setProfileForm({ firstName: userRes.data.firstName || '', lastName: userRes.data.lastName || '', phone: userRes.data.phone || '' });
  //     setUserBookings(bookingsRes.data || []);
  //     setAdminFields(fieldsRes.data || []);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setGlobalLoading(false);
  //   }
  // };

  const loadAdminData = async () => {
    if (!session?.userId) return;
    try {
      setGlobalLoading(true);
      const [fieldsData, reportData, pendingData, ticketsData, profileData] = await Promise.all([
        axios.get(`${BASE_URL}/fields`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/admin/reports`).catch(() => ({ data: {} })),
        axios.get(`${BASE_URL}/admin/pending-bookings`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/support/tickets`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/users/${session.userId}`).catch(() => ({ data: {} }))
      ]);
      setAdminFields(fieldsData.data || []);
      setAdminReport(reportData.data || { totalRevenue: 0, totalBookingsCount: 0 });
      setPendingBookings(pendingData.data || []);
      setPendingCount(pendingData.data?.length || 0);
      setAdminTickets(ticketsData.data || []);
      setAdminProfile({ firstName: profileData.data.firstName || '', lastName: profileData.data.lastName || '', email: profileData.data.email || '', password: '' });
    } catch (err) {
      console.log(err);
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      if (session.role === 'admin') loadAdminData();
      // HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI
      // else loadUserData();
    }
  }, [session, view]);

  // --------------- AUTH & KONTROLLER ---------------
  // HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI
  // const handleUserLogin = async () => {
  //   if (!loginForm.email || !loginForm.password) {
  //     return showAlert("⚠️ Eksik Bilgi", "Lütfen e-posta ve şifrenizi giriniz.");
  //   }
  //   try {
  //     setGlobalLoading(true);
  //     const res = await axios.post(`${BASE_URL}/auth/login`, loginForm);
  // 
  //     // Backend 200 dönüp gövdede hata mesajı yollarsa diye ekstra koruma
  //     if (res.data && res.data.error) {
  //       return showAlert("❌ Giriş Başarısız", res.data.error);
  //     }
  // 
  //     setSession({ userId: res.data.userId, role: res.data.role });
  //     setView('profile');
  //     showAlert("✅ Başarılı", "Sisteme giriş yapıldı.");
  //   } catch (err) {
  //     showAlert("❌ Giriş Başarısız", getErrorMessage(err));
  //   } finally {
  //     setGlobalLoading(false);
  //   }
  // };

  const handleAdminLogin = async () => {
    if (!adminLoginForm.email || !adminLoginForm.password) {
      return showAlert("⚠️ Eksik Bilgi", "Lütfen yönetici e-posta ve şifrenizi giriniz.");
    }
    try {
      setGlobalLoading(true);
      const res = await axios.post(`${BASE_URL}/admin/login`, adminLoginForm);

      if (res.data && res.data.error) {
        return showAlert("❌ Giriş Başarısız", res.data.error);
      }

      setSession({ userId: res.data.adminId, role: 'admin' });
      setView('admin');
      showAlert("✅ Başarılı", "Yönetici paneline geçiş yapıldı.");
    } catch (err) {
      showAlert("❌ Yönetici Girişi Başarısız", getErrorMessage(err));
    } finally {
      setGlobalLoading(false);
    }
  };

  // HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI
  // const handleRegister = async () => {
  //   if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password) {
  //     return showAlert("⚠️ Eksik Bilgi", "Lütfen tüm zorunlu alanları eksiksiz doldurunuz.");
  //   }
  //   if (registerForm.password !== registerForm.confirmPassword) {
  //     return showAlert("❌ Hata", "Şifreler birbiriyle eşleşmiyor!");
  //   }
  //   try {
  //     setGlobalLoading(true);
  //     const res = await axios.post(`${BASE_URL}/auth/register`, registerForm);
  // 
  //     if (res.data && res.data.error) {
  //       return showAlert("❌ Kayıt Olunamadı", res.data.error);
  //     }
  // 
  //     showAlert("✅ Kayıt Başarılı", res.data?.message || "Hesabınız oluşturuldu. Lütfen giriş yapınız.");
  //     setView('login');
  //   } catch (err) {
  //     showAlert("❌ Kayıt Olunamadı", getErrorMessage(err));
  //   } finally {
  //     setGlobalLoading(false);
  //   }
  // };

  // HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI
  // const handleCreateBooking = async () => {
  //   if (!bookingForm.field) return showAlert("⚠️ Eksik Seçim", "Lütfen kiralamak istediğiniz sahayı seçiniz.");
  //   if (!bookingForm.date) return showAlert("⚠️ Eksik Seçim", "Lütfen oynamak istediğiniz tarihi seçiniz.");
  //   if (!bookingForm.timeSlot) return showAlert("⚠️ Eksik Seçim", "Lütfen oynamak istediğiniz saat aralığını seçiniz.");
  // 
  //   try {
  //     setGlobalLoading(true);
  //     const payload = {
  //       fieldId: bookingForm.field, field: bookingForm.field,
  //       userId: session.userId, user: session.userId,
  //       date: bookingForm.date,
  //       timeSlot: bookingForm.timeSlot,
  //     };
  //     const res = await axios.post(`${BASE_URL}/bookings`, payload);
  // 
  //     if (res.data && res.data.error) {
  //       return showAlert("❌ Rezervasyon Hatası", res.data.error);
  //     }
  // 
  //     showAlert('✅ Rezervasyon Başarılı', res.data?.message || 'Saha kiralama talebiniz başarıyla alındı.');
  //     setBookingForm({ field: '', date: '', timeSlot: '' });
  //     loadUserData();
  //     setUserActiveTab('bookings');
  //   } catch (err) {
  //     showAlert("❌ Rezervasyon Hatası", getErrorMessage(err));
  //   } finally {
  //     setGlobalLoading(false);
  //   }
  // };
  // 
  // const handleCancelBooking = async (bookingId) => {
  //   try {
  //     const res = await axios.delete(`${BASE_URL}/bookings/${bookingId}`);
  //     showAlert("ℹ️ Bilgi", res.data?.message || "Rezervasyonunuz başarıyla iptal edildi.");
  //     loadUserData();
  //   } catch (err) {
  //     showAlert("❌ İptal Hatası", getErrorMessage(err));
  //   }
  // };
  // 
  // const handleProfileUpdate = async () => {
  //   if (!profileForm.firstName || !profileForm.lastName) {
  //     return showAlert("⚠️ Uyarı", "Ad ve Soyad alanları boş bırakılamaz.");
  //   }
  //   try {
  //     const res = await axios.put(`${BASE_URL}/users/${session.userId}`, profileForm);
  //     showAlert("✅ Güncellendi", res.data?.message || "Profil bilgileriniz kaydedildi.");
  //     loadUserData();
  //   } catch (err) {
  //     showAlert("❌ Hata", getErrorMessage(err));
  //   }
  // };
  // 
  // const handlePasswordChange = async () => {
  //   if (!passwordForm.oldPassword || !passwordForm.newPassword) {
  //     return showAlert("⚠️ Uyarı", "Lütfen eski ve yeni şifrenizi giriniz.");
  //   }
  //   try {
  //     const res = await axios.patch(`${BASE_URL}/users/${session.userId}/password`, passwordForm);
  //     showAlert("✅ Şifre Değiştirildi", res.data?.message || "Şifreniz güvenli bir şekilde güncellendi.");
  //     setPasswordForm({ oldPassword: '', newPassword: '' });
  //   } catch (err) {
  //     showAlert("❌ Hata", getErrorMessage(err));
  //   }
  // };

  const handleTicketSubmit = async () => {
    if (!ticketForm.subject || !ticketForm.message) {
      return showAlert("⚠️ Uyarı", "Lütfen destek talebi için konu ve mesaj alanlarını doldurunuz.");
    }
    try {
      const res = await axios.post(`${BASE_URL}/support/tickets`, { user: session.userId, subject: ticketForm.subject, message: ticketForm.message });
      showAlert("✅ Talep İletildi", res.data?.message || "Destek talebiniz yöneticilere ulaştı.");
      setTicketForm({ subject: '', message: '' });
    } catch (err) {
      showAlert("❌ Gönderim Hatası", getErrorMessage(err));
    }
  };

  // --------------- ADMİN FONKSİYONLARI VE KONTROLLERİ ---------------
  const handleBookingStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${BASE_URL}/bookings/${id}/confirm`, { status });
      showAlert("ℹ️ İşlem Tamam", `Rezervasyon durumu '${status}' olarak güncellendi.`);
      loadAdminData();
    } catch (err) {
      showAlert("❌ Hata", getErrorMessage(err));
    }
  };

  const handleAddField = async () => {
    if (!newFieldForm.name || !newFieldForm.pricePerHour) {
      return showAlert("⚠️ Uyarı", "Saha adı ve saatlik ücret zorunludur.");
    }
    try {
      const res = await axios.post(`${BASE_URL}/fields`, { name: newFieldForm.name, pricePerHour: Number(newFieldForm.pricePerHour), address: newFieldForm.address });
      showAlert("✅ Saha Eklendi", res.data?.message || "Sisteme yeni bir tesis başarıyla tanımlandı.");
      setNewFieldForm({ name: '', pricePerHour: '', address: '' });
      loadAdminData();
    } catch (err) {
      showAlert("❌ Ekleme Hatası", getErrorMessage(err));
    }
  };

  const handleDeleteField = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/fields/${id}`);
      showAlert("ℹ️ Silindi", res.data?.message || "Tesis sistemden başarıyla kaldırıldı.");
      loadAdminData();
    } catch (err) {
      showAlert("❌ Silme Hatası", getErrorMessage(err));
    }
  };

  const handleAdminProfileUpdate = async () => {
    if (!adminProfile.firstName || !adminProfile.lastName || !adminProfile.email) {
      return showAlert("⚠️ Uyarı", "Ad, soyad ve e-posta zorunludur.");
    }
    try {
      const res = await axios.put(`${BASE_URL}/admin/profile/${session.userId}`, adminProfile);
      showAlert("✅ Güncellendi", res.data?.message || "Yönetici profiliniz güncellendi.");
      setAdminProfile({ ...adminProfile, password: '' });
    } catch (err) {
      showAlert("❌ Profil Hatası", getErrorMessage(err));
    }
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.navbar}>
        <Text style={styles.navLogo} onPress={() => setView('home')}>⚽ Saha-App</Text>
        <Text style={{ color: '#64748b', fontSize: 11, fontWeight: 'bold' }}>SDU CE projesi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.mainScroll} keyboardShouldPersistTaps="handled">
        {globalLoading && <ActivityIndicator size="large" color="#3b82f6" style={{ marginVertical: 10 }} />}

        {view === 'home' && (
          <View style={styles.centeredHero}>
            <Text style={styles.heroTitle}>Saha Rezervasyonlarına Modern Çözüm</Text>
            <Text style={styles.heroSubtitle}>Süleyman Demirel Üniversitesi Bilgisayar Mühendisliği projesidir.</Text>
            {!session ? (
              <View style={{ width: '100%', gap: 10 }}>
                {/* HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI */}
                {/* <TouchableOpacity style={styles.btnGreen} onPress={() => setView('register')}><Text style={styles.navBtnText}>Hemen Üye Ol</Text></TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.btnOutline} onPress={() => setView('login')}><Text style={styles.navBtnTextDark}>Zaten Hesabım Var</Text></TouchableOpacity> */}
                
                {/* Ekip İzolasyonu için doğrudan Tesis Yöneticisi Girişi aktif edilmiştir */}
                <TouchableOpacity style={styles.btnBlue} onPress={() => setView('admin-login')}><Text style={styles.navBtnText}>Yönetici Girişi</Text></TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.btnBlue} onPress={() => setView(session.role === 'admin' ? 'admin' : 'home')}><Text style={styles.navBtnText}>Panelime Git</Text></TouchableOpacity>
            )}
          </View>
        )}

        {/* HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI */}
        {/*
        {view === 'login' && (
          <View style={styles.authCard}>
            <Text style={styles.cardTitle}>Sisteme Giriş Yap</Text>
            <TextInput style={styles.input} placeholder="E-posta" value={loginForm.email} onChangeText={t => setLoginForm({ ...loginForm, email: t })} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={loginForm.password} onChangeText={t => setLoginForm({ ...loginForm, password: t })} />
            <TouchableOpacity style={styles.btnBlue} onPress={handleUserLogin}><Text style={styles.navBtnText}>Giriş Yap</Text></TouchableOpacity>
            <Text style={styles.adminLink} onPress={() => setView('register')}>Hesabınız yok mu? Kayıt Olun</Text>
            <Text style={styles.adminLink} onPress={() => setView('admin-login')}>Tesis Yöneticisi Girişi →</Text>
          </View>
        )}
        */}

        {/* HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI */}
        {/*
        {view === 'register' && (
          <View style={styles.authCard}>
            <Text style={styles.cardTitle}>Hesap Oluştur</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Adınız" value={registerForm.firstName} onChangeText={t => setRegisterForm({ ...registerForm, firstName: t })} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Soyadınız" value={registerForm.lastName} onChangeText={t => setRegisterForm({ ...registerForm, lastName: t })} />
            </View>
            <TextInput style={styles.input} placeholder="E-posta" value={registerForm.email} onChangeText={t => setRegisterForm({ ...registerForm, email: t })} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Telefon" value={registerForm.phone} onChangeText={t => setRegisterForm({ ...registerForm, phone: t })} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={registerForm.password} onChangeText={t => setRegisterForm({ ...registerForm, password: t })} />
            <TextInput style={styles.input} placeholder="Şifre (Tekrar)" secureTextEntry value={registerForm.confirmPassword} onChangeText={t => setRegisterForm({ ...registerForm, confirmPassword: t })} />
            <TouchableOpacity style={styles.btnGreen} onPress={handleRegister}><Text style={styles.navBtnText}>Ücretsiz Kayıt Ol</Text></TouchableOpacity>
            <Text style={styles.adminLink} onPress={() => setView('login')}>Zaten hesabınız var mı? Giriş Yapın</Text>
          </View>
        )}
        */}

        {view === 'admin-login' && (
          <View style={[styles.authCard, { backgroundColor: '#0f172a' }]}>
            <Text style={[styles.cardTitle, { color: 'white' }]}>Saha Yönetim Paneli</Text>
            <TextInput style={[styles.input, { backgroundColor: '#1e293b', color: 'white', borderColor: '#334155' }]} placeholder="Yönetici E-posta" placeholderTextColor="#64748b" value={adminLoginForm.email} onChangeText={t => setAdminLoginForm({ ...adminLoginForm, email: t })} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={[styles.input, { backgroundColor: '#1e293b', color: 'white', borderColor: '#334155' }]} placeholder="Şifre" placeholderTextColor="#64748b" secureTextEntry value={adminLoginForm.password} onChangeText={t => setAdminLoginForm({ ...adminLoginForm, password: t })} />
            <TouchableOpacity style={[styles.btnBlue, { backgroundColor: '#ef4444' }]} onPress={handleAdminLogin}><Text style={styles.navBtnText}>Yönetici Girişi Yap</Text></TouchableOpacity>
            {/* HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI */}
            {/* <Text style={[styles.adminLink, { color: '#ef4444' }]} onPress={() => setView('login')}>← Müşteri Girişine Dön</Text> */}
          </View>
        )}

        {/* HİLMİ SİNAN KAPLAN KODU - GEÇİCİ OLARAK YORUMA ALINDI */}
        {/*
        {view === 'profile' && (
          <View style={styles.panelCard}>
            <Text style={styles.welcomeTitle}>Merhaba, {userProfile?.firstName}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBarScroll}>
              <TouchableOpacity onPress={() => setUserActiveTab('bookings')} style={[styles.tabBtn, userActiveTab === 'bookings' && styles.activeTabBlue]}><Text style={styles.tabText}>Maç Geçmişim</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setUserActiveTab('new-booking')} style={[styles.tabBtn, userActiveTab === 'new-booking' && styles.activeTabBlue]}><Text style={styles.tabText}>Saha Kirala</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setUserActiveTab('profile')} style={[styles.tabBtn, userActiveTab === 'profile' && styles.activeTabBlue]}><Text style={styles.tabText}>Profil Ayarları</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setUserActiveTab('security')} style={[styles.tabBtn, userActiveTab === 'security' && styles.activeTabBlue]}><Text style={styles.tabText}>Şifre Değiştir</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setUserActiveTab('support')} style={[styles.tabBtn, userActiveTab === 'support' && styles.activeTabBlue]}><Text style={styles.tabText}>Destek Talebi</Text></TouchableOpacity>
            </ScrollView>

            {userActiveTab === 'bookings' && (
              <View style={styles.tabContentArea}>
                <Text style={styles.sectionTitle}>Mevcut Randevularım</Text>
                {userBookings.length === 0 ? <Text style={styles.emptyText}>Henüz rezervasyonunuz yok.</Text> : userBookings.map(b => (
                  <View key={b._id} style={styles.dataItemCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.itemBoldTitle}>{b.field?.name || 'Saha Silinmiş'}</Text>
                      <Text style={{ fontWeight: 'bold', color: '#3b82f6' }}>₺{b.field?.pricePerHour || '?'}</Text>
                    </View>
                    <Text style={styles.itemSubText}>Durum: <Text style={{ fontWeight: 'bold', color: b.status === 'Onaylandı' ? '#10b981' : b.status === 'İptal Edildi' ? '#ef4444' : '#f59e0b' }}>{b.status}</Text></Text>
                    <Text style={styles.itemSubText}>Tarih: {new Date(b.date).toLocaleDateString('tr-TR')} | Saat: {b.timeSlot}</Text>
                    {b.status !== 'İptal Edildi' && (
                      <TouchableOpacity style={[styles.btnDangerSmall, { marginTop: 10 }]} onPress={() => handleCancelBooking(b._id)}>
                        <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>İptal Et</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

            {userActiveTab === 'new-booking' && (
              <View style={[styles.tabContentArea, { zIndex: 10 }]}>
                <Text style={styles.sectionTitle}>Yeni Rezervasyon Talebi</Text>

                <Text style={styles.label}>1. Saha Seçimi</Text>
                {adminFields.map(f => (
                  <TouchableOpacity key={f._id} style={[styles.selectorItem, bookingForm.field === f._id && styles.selectedItemStyle]} onPress={() => setBookingForm({ ...bookingForm, field: f._id })}>
                    <Text style={{ fontWeight: 'bold', color: bookingForm.field === f._id ? '#1d4ed8' : '#334155' }}>⚽ {f.name} (₺{f.pricePerHour}/Saat)</Text>
                  </TouchableOpacity>
                ))}

                {/* 📅 TAKVİM BÖLÜMÜ */}
                <Text style={styles.label}>2. Tarih Seçimi (Takvim)</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', color: '#334155', outline: 'none', fontFamily: 'inherit', marginBottom: '15px', backgroundColor: '#fff' }}
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  />
                ) : (
                  <>
                    <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowDatePicker(true)}>
                      <Text style={{ color: bookingForm.date ? '#1e293b' : '#94a3b8', fontSize 15 }}>{bookingForm.date || 'Takvimden tarih seçiniz...'}</Text>
                      <Text>📅</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={bookingForm.date ? new Date(bookingForm.date) : new Date()}
                        mode="date" display="default" minimumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) setBookingForm({ ...bookingForm, date: selectedDate.toISOString().split('T')[0] });
                        }}
                      />
                    )}
                  </>
                )}

                {/* ⏰ SAAT DROPDOWN BÖLÜMÜ (TAM GÜN) */}
                <Text style={styles.label}>3. Saat Aralığı</Text>
                <View style={{ zIndex: 100, marginBottom: 20 }}>
                  <TouchableOpacity style={styles.dropdownHeader} activeOpacity={0.8} onPress={() => setShowTimeDropdown(!showTimeDropdown)}>
                    <Text style={{ color: bookingForm.timeSlot ? '#1e293b' : '#94a3b8', fontSize: 15 }}>{bookingForm.timeSlot || 'Lütfen saat seçiniz...'}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>{showTimeDropdown ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {showTimeDropdown && (
                    <View style={styles.dropdownList}>
                      <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }}>
                        {[
                          "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00",
                          "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00",
                          "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00",
                          "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"
                        ].map((slot, index) => (
                          <TouchableOpacity
                            key={slot}
                            style={[styles.dropdownItem, index === 14 && { borderBottomWidth: 0 }]}
                            onPress={() => {
                              setBookingForm({ ...bookingForm, timeSlot: slot });
                              setShowTimeDropdown(false);
                            }}
                          >
                            <Text style={{ color: '#334155', fontSize: 15, fontWeight: bookingForm.timeSlot === slot ? 'bold' : 'normal' }}>⏰ {slot}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={styles.btnBlue} onPress={handleCreateBooking}><Text style={styles.navBtnText}>Rezervasyon Yap</Text></TouchableOpacity>
              </View>
            )}

            {userActiveTab === 'profile' && (
              <View style={styles.tabContentArea}>
                <Text style={styles.sectionTitle}>Kişisel Bilgileriniz</Text>
                <TextInput style={styles.input} placeholder="Ad" value={profileForm.firstName} onChangeText={t => setProfileForm({ ...profileForm, firstName: t })} />
                <TextInput style={styles.input} placeholder="Soyad" value={profileForm.lastName} onChangeText={t => setProfileForm({ ...profileForm, lastName: t })} />
                <TextInput style={styles.input} placeholder="Telefon" value={profileForm.phone} onChangeText={t => setProfileForm({ ...profileForm, phone: t })} keyboardType="phone-pad" />
                <TouchableOpacity style={styles.btnBlue} onPress={handleProfileUpdate}><Text style={styles.navBtnText}>Değişiklikleri Kaydet</Text></TouchableOpacity>
              </View>
            )}

            {userActiveTab === 'security' && (
              <View style={styles.tabContentArea}>
                <Text style={styles.sectionTitle}>Güvenlik Ayarları</Text>
                <TextInput style={styles.input} placeholder="Mevcut Şifreniz" secureTextEntry value={passwordForm.oldPassword} onChangeText={t => setPasswordForm({ ...passwordForm, oldPassword: t })} />
                <TextInput style={styles.input} placeholder="Yeni Şifreniz" secureTextEntry value={passwordForm.newPassword} onChangeText={t => setPasswordForm({ ...passwordForm, newPassword: t })} />
                <TouchableOpacity style={[styles.btnBlue, { backgroundColor: '#f59e0b' }]} onPress={handlePasswordChange}><Text style={styles.navBtnText}>Güvenli Olarak Güncelle</Text></TouchableOpacity>
              </View>
            )}

            {userActiveTab === 'support' && (
              <View style={styles.tabContentArea}>
                <Text style={styles.sectionTitle}>Destek Merkezi</Text>
                <TextInput style={styles.input} placeholder="Konu Başlığı" value={ticketForm.subject} onChangeText={t => setTicketForm({ ...ticketForm, subject: t })} />
                <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Yaşadığınız sorunu açıklayın..." multiline value={ticketForm.message} onChangeText={t => setTicketForm({ ...ticketForm, message: t })} />
                <TouchableOpacity style={styles.btnBlue} onPress={handleTicketSubmit}><Text style={styles.navBtnText}>Destek Talebi Gönder</Text></TouchableOpacity>
              </View>
            )}
          </View>
        )}
        */}

        {view === 'admin' && (
          <View style={styles.panelCard}>
            <Text style={[styles.welcomeTitle, { color: '#ef4444' }]}>🛡️ Operasyon Merkezi</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBarScroll}>
              <TouchableOpacity onPress={() => setAdminActiveTab('command-center')} style={[styles.tabBtn, adminActiveTab === 'command-center' && styles.activeTabRed]}><Text style={styles.tabText}>Talepler {pendingCount > 0 && `(${pendingCount})`}</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setAdminActiveTab('finance-fields')} style={[styles.tabBtn, adminActiveTab === 'finance-fields' && styles.activeTabRed]}><Text style={styles.tabText}>Finans ve Tesis</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setAdminActiveTab('support-tickets')} style={[styles.tabBtn, adminActiveTab === 'support-tickets' && styles.activeTabRed]}><Text style={styles.tabText}>Destek Talepleri</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setAdminActiveTab('account-settings')} style={[styles.tabBtn, adminActiveTab === 'account-settings' && styles.activeTabRed]}><Text style={styles.tabText}>Hesap Ayarları</Text></TouchableOpacity>
            </ScrollView>

            {adminActiveTab === 'command-center' && (
              <View style={styles.tabContentArea}>
                <Text style={styles.sectionTitle}>Onay Bekleyen Randevular</Text>
                {pendingBookings.length === 0 ? <Text style={styles.emptyText}>Bekleyen randevu yok.</Text> : pendingBookings.map(b => (
                  <View key={b._id} style={styles.dataItemCard}>
                    <Text style={styles.itemBoldTitle}>{b.field?.name}</Text>
                    <Text style={styles.itemSubText}>Müşteri: {b.user?.firstName} {b.user?.lastName} ({b.user?.phone || 'Yok'})</Text>
                    <Text style={styles.itemSubText}>Tarih: {new Date(b.date).toLocaleDateString('tr-TR')} | Saat: {b.timeSlot}</Text>
                    <Text style={[styles.itemSubText, { color: '#10b981', fontWeight: 'bold' }]}>Ücret: ₺{b.field?.pricePerHour}</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                      <TouchableOpacity style={[styles.btnDangerSmall, { flex: 1, padding: 10 }]} onPress={() => handleBookingStatus(b._id, 'İptal Edildi')}><Text style={{ textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>Reddet</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.btnGreen, { flex: 1, padding: 10 }]} onPress={() => handleBookingStatus(b._id, 'Onaylandı')}><Text style={styles.navBtnText}>Onayla</Text></TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {adminActiveTab === 'finance-fields' && (
              <View style={styles.tabContentArea}>
                <View style={styles.financeRow}>
                  <View style={styles.financeBox}><Text style={{ color: '#64748b', fontSize: 12 }}>Toplam Gelir</Text><Text style={styles.financeAmount}>{adminReport.totalRevenue} ₺</Text></View>
                  <View style={styles.financeBox}><Text style={{ color: '#64748b', fontSize: 12 }}>Aktif Saha</Text><Text style={styles.financeAmount}>{adminFields.length}</Text></View>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Saha (Tesis) Ekle</Text>
                <TextInput style={styles.input} placeholder="Saha Adı" value={newFieldForm.name} onChangeText={t => setNewFieldForm({ ...newFieldForm, name: t })} />
                <TextInput style={styles.input} placeholder="Saatlik Ücret (₺)" keyboardType="numeric" value={newFieldForm.pricePerHour} onChangeText={t => setNewFieldForm({ ...newFieldForm, pricePerHour: t })} />
                <TextInput style={styles.input} placeholder="Adres" value={newFieldForm.address} onChangeText={t => setNewFieldForm({ ...newFieldForm, address: t })} />
                <TouchableOpacity style={styles.btnBlue} onPress={handleAddField}><Text style={styles.navBtnText}>Veritabanına Kaydet</Text></TouchableOpacity>

                <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Aktif Sahalar</Text>
                {adminFields.length === 0 ? <Text style={styles.emptyText}>Aktif saha bulunamadı.</Text> : adminFields.map(field => (
                  <View key={field._id} style={[styles.dataItemCard, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View>
                      <Text style={styles.itemBoldTitle}>{field.name}</Text>
                      <Text style={styles.itemSubText}>{field.pricePerHour} ₺/Saat</Text>
                    </View>
                    <TouchableOpacity style={[styles.btnDangerSmall, { marginTop: 0 }]} onPress={() => handleDeleteField(field._id)}>
                      <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Sil</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {adminActiveTab === 'support-tickets' && (
              <View style={styles.tabContentArea}>
                <Text style={styles.sectionTitle}>Müşteri Destek Talepleri</Text>
                {adminTickets.length === 0 ? <Text style={styles.emptyText}>Bekleyen talep yok.</Text> : adminTickets.map(t => (
                  <View key={t._id} style={styles.dataItemCard}>
                    <Text style={styles.itemBoldTitle}>Konu: {t.subject}</Text>
                    <Text style={styles.itemSubText}>Gönderen: {t.user?.firstName} ({t.user?.email})</Text>
                    <Text style={[styles.itemSubText, { backgroundColor: '#f8fafc', padding: 8, borderRadius: 4, marginTop: 5, color: '#334155' }]}>{t.message}</Text>
                  </View>
                ))}
              </View>
            )}

            {adminActiveTab === 'account-settings' && (
              <View style={styles.tabContentArea}>
                <Text style={styles.sectionTitle}>Yönetici Hesap Ayarları</Text>
                <TextInput style={styles.input} placeholder="Adınız" value={adminProfile.firstName} onChangeText={t => setAdminProfile({ ...adminProfile, firstName: t })} />
                <TextInput style={styles.input} placeholder="Soyadınız" value={adminProfile.lastName} onChangeText={t => setAdminProfile({ ...adminProfile, lastName: t })} />
                <TextInput style={styles.input} placeholder="E-Posta (Giriş ID)" value={adminProfile.email} onChangeText={t => setAdminProfile({ ...adminProfile, email: t })} autoCapitalize="none" />
                <TextInput style={[styles.input, { borderColor: '#fcd34d', backgroundColor: '#fffbeb' }]} placeholder="Yeni Şifre (İsteğe Bağlı)" secureTextEntry value={adminProfile.password} onChangeText={t => setAdminProfile({ ...adminProfile, password: t })} />
                <TouchableOpacity style={[styles.btnBlue, { backgroundColor: '#1e293b' }]} onPress={handleAdminProfileUpdate}><Text style={styles.navBtnText}>Ayarları Kaydet</Text></TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* 📱 ALT NAVİGASYON */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabBarItem} onPress={() => setView('home')}>
          <Text style={[styles.tabBarIcon, view === 'home' && styles.activeIcon]}>🏠</Text>
          <Text style={[styles.tabBarLabel, view === 'home' && styles.activeLabel]}>Ana Sayfa</Text>
        </TouchableOpacity>
        {/* Ekip İzolasyonu için sadece Yöneticiye özel alt navigasyon aktif bırakılmıştır */}
        {!session ? (
          <TouchableOpacity style={styles.tabBarItem} onPress={() => setView('admin-login')}>
            <Text style={[styles.tabBarIcon, view === 'admin-login' && styles.activeIcon]}>🔑</Text>
            <Text style={[styles.tabBarLabel, view === 'admin-login' && styles.activeLabel]}>Yönetici Girişi</Text>
          </TouchableOpacity>
        ) : (
          <>
            {session.role === 'admin' && (
              <TouchableOpacity style={styles.tabBarItem} onPress={() => setView('admin')}>
                <Text style={[styles.tabBarIcon, view === 'admin' && styles.activeIcon]}>📊</Text>
                <Text style={[styles.tabBarLabel, view === 'admin' && styles.activeLabel]}>Yönetici Paneli</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.tabBarItem} onPress={() => { setSession(null); setView('home'); }}>
              <Text style={[styles.tabBarIcon, { color: '#ef4444' }]}>🚪</Text>
              <Text style={[styles.tabBarLabel, { color: '#ef4444' }]}>Çıkış Yap</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#f1f5f9' },
  mainScroll: { paddingVertical: 10, paddingBottom: 100, alignItems: 'center', width: '100%' },
  navbar: { backgroundColor: '#1e293b', paddingTop: 35, paddingBottom: 15, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navLogo: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  navBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  navBtnTextDark: { color: '#1e293b', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  bottomTabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderColor: '#334155', paddingBottom: 10, elevation: 10 },
  tabBarItem: { alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%' },
  tabBarIcon: { fontSize: 20, color: '#94a3b8', marginBottom: 2 },
  tabBarLabel: { fontSize: 11, color: '#94a3b8', fontWeight: 'bold' },
  activeIcon: { color: '#3b82f6', transform: [{ scale: 1.1 }] },
  activeLabel: { color: '#3b82f6' },
  centeredHero: { alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 12 },
  heroSubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 30 },
  btnOutline: { backgroundColor: 'white', padding: 14, borderRadius: 10, borderWidth: 2, borderColor: '#e2e8f0', width: '100%' },
  authCard: { backgroundColor: 'white', width: Dimensions.get('window').width * 0.9, maxWidth: 400, padding: 22, borderRadius: 16, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 14, fontSize: 15, color: '#334155', marginBottom: 15, width: '100%' },
  btnBlue: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 8, width: '100%', marginBottom: 10 },
  btnGreen: { backgroundColor: '#10b981', padding: 14, borderRadius: 8, width: '100%', marginBottom: 10 },
  adminLink: { textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 10, fontWeight: '500' },
  panelCard: { backgroundColor: 'white', width: Dimensions.get('window').width * 0.95, maxWidth: 500, padding: 20, borderRadius: 16, marginTop: 10, elevation: 2 },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  tabBarScroll: { borderBottomWidth: 1, borderColor: '#e2e8f0', marginBottom: 15, paddingBottom: 5 },
  tabBtn: { paddingVertical: 10, paddingHorizontal: 15, marginRight: 5 },
  tabText: { fontSize: 14, color: '#475569', fontWeight: 'bold' },
  activeTabBlue: { borderBottomWidth: 3, borderColor: '#3b82f6' },
  activeTabRed: { borderBottomWidth: 3, borderColor: '#ef4444' },
  tabContentArea: { width: '100%' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  emptyText: { color: '#94a3b8', textAlign: 'center', paddingVertical: 20, fontSize: 14 },
  dataItemCard: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 15, marginBottom: 12, width: '100%' },
  itemBoldTitle: { fontWeight: 'bold', fontSize: 16, color: '#1e293b', marginBottom: 5 },
  itemSubText: { color: '#64748b', fontSize: 13, marginTop: 4 },
  btnDangerSmall: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca', padding: 8, borderRadius: 6, alignItems: 'center' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 6, marginTop: 10 },
  selectorItem: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 8, backgroundColor: '#f8fafc', width: '100%' },
  selectedItemStyle: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  financeRow: { flexDirection: 'row', gap: 12, marginBottom: 15, width: '100%' },
  financeBox: { flex: 1, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', padding: 15, borderRadius: 10 },
  financeAmount: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginTop: 5 },

  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 5 },
  dropdownList: { borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }
});