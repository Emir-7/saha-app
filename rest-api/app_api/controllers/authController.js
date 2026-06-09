const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

// 1 - Kullanıcı Kaydı (Register)
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, role } = req.body;

        // E-posta önceden kullanılmış mı?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Bu e-posta adresi sistemde zaten kayıtlı.' });
        }

        // Şifreyi bcrypt ile hashle (şifreleme)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            role: role || 'user'
        });

        res.status(201).json({ message: 'Kullanıcı kaydı başarıyla oluşturuldu.', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ error: 'Kayıt olurken sistemde bir hata oluştu.', details: error.message });
    }
};

// 2 - Kullanıcı Girişi (Login)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.' });
        }

        // Şifre doğrulama
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Hatalı şifre.' });
        }

        // Başarılı girişte Token dönebilir, şimdilik basit bilgi dönülüyor
        res.status(200).json({ message: 'Giriş başarılı', userId: user._id, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Giriş işlemi gerçekleştirilirken hata oluştu.', details: error.message });
    }
};

// 3 - Profil Görüntüleme
const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        // Şifrenin response içinde gitmemesi için password çıkarılır (-password)
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Profil bilgisi getirilirken hata oluştu.', details: error.message });
    }
};

// 4 - Profil Güncelleme (Hocanın listesinde atlanmış olsa da mantıken olması gereken put)
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, phone },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'Güncellenecek kullanıcı bulunamadı.' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'Profil bilgileri güncellenirken hata oluştu.', details: error.message });
    }
};

// 5 - Şifre Değiştirme
const changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mevcut şifreniz yanlış.' });
        }

        // Yeni şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Şifreniz güvenlik önlemleri alınarak başarıyla değiştirildi.' });
    } catch (error) {
        res.status(500).json({ error: 'Şifre değiştirilirken hata oluştu.', details: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};
