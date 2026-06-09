const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');
const Field = mongoose.model('Field');

/**
 * 🚀 KULLANICI REZERVASYON OLUŞTURMA FONKSİYONU (createBooking)
 */
const createBooking = async (req, res) => {

    try {
        console.log("🚨 [DEBUG] Frontend'den Gelen İstek Verisi (req.body):", req.body);
        // 1. ESNEK VERİ YAKALAMA
        const actualField = req.body.fieldId || req.body.field || req.body.sahaId;
        const actualUser  = req.body.userId  || req.body.user  || req.body.kullaniciId;
        const date        = req.body.date     || null;
        const timeSlot    = req.body.timeSlot || null;

        if (!actualField) {
            return res.status(400).json({ success: false, message: "Eksik veri var! (Saha ID eksik)", reqBody: req.body });
        }
        if (!actualUser) {
            return res.status(400).json({ success: false, message: "Eksik veri var! (Kullanıcı ID eksik)", reqBody: req.body });
        }
        if (!date) {
            return res.status(400).json({ success: false, message: "Eksik veri var! (Tarih - date eksik)", reqBody: req.body });
        }
        if (!timeSlot) {
            return res.status(400).json({ success: false, message: "Eksik veri var! (Saat - timeSlot eksik)", reqBody: req.body });
        }

        if (!mongoose.Types.ObjectId.isValid(actualField)) {
            return res.status(400).json({ error: 'Geçersiz saha ID formatı.' });
        }
        if (!mongoose.Types.ObjectId.isValid(actualUser)) {
            return res.status(400).json({ error: 'Geçersiz kullanıcı ID formatı.' });
        }

        // Kontrol: Saha var mı?
        const existingField = await Field.findById(actualField);
        if (!existingField) {
            return res.status(404).json({ error: 'Rezervasyon yapılmak istenen saha sistemde bulunamadı.' });
        }

        // Kontrol: O sahanın istenen saati başka bir rezervasyonda (İptal edilmemiş haliyle) dolu mu?
        const isOccupied = await Booking.findOne({ field: actualField, date, timeSlot, status: { $ne: 'İptal Edildi' } });
        if (isOccupied) {
            return res.status(400).json({ error: 'Bu saha seçilen saat aralığında zaten dolu/rezerve edilmiş.' });
        }

        const newBooking = await Booking.create({
            field:    actualField,
            user:     actualUser,
            date,
            timeSlot,
            status:   'Onay Bekliyor'
        });

        // Sunum için: RabbitMQ event producer
        try {
            const mqChannel = req.app.get('mqChannel');
            if (mqChannel) {
                mqChannel.sendToQueue(
                    'booking_queue',
                    Buffer.from(JSON.stringify({ bookingId: newBooking._id, field: actualField, user: actualUser, date, timeSlot }))
                );
                console.log(`🚀 [TEST-LOG] Mesaj RabbitMQ kuyruğuna başarıyla iletildi: ${newBooking._id}`);
            }
        } catch (mqError) {
            console.error('[MQ] Rezervasyon mesajı kuyruğa gönderilemedi:', mqError.message);
        }

        // Sunum için: Redis Cache entegrasyonu
        try {
            const redisClient = req.app.get('redisClient');
            if (redisClient) {
                await redisClient.set(
                    `booking:${newBooking._id}`,
                    JSON.stringify(newBooking),
                    { EX: 3600 }
                );
                console.log("💾 [Redis] Yeni rezervasyon önbelleğe alındı.");
            }
        } catch (redisError) {
            console.error('[Redis] Rezervasyon önbelleğe alınamadı:', redisError.message);
        }

        // 3. KESİN BAŞARI MESAJI
        res.status(201).json({ message: 'saha kiralama işlemi başarıyla tamamlandı', booking: newBooking });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Backend'de kritik bir hata oluştu", 
            error: error.message,
            stack: error.stack
        });

  try {
    // 1. ESNEK VERİ YAKALAMA (Çökmeyi Önleme)
    const actualField = req.body.fieldId || req.body.field || req.body.sahaId;
    const actualUser = req.body.userId || req.body.user || req.body.kullaniciId;
    
    // Tarih ve saat gelmezse varsayılan değerler ata
    const actualDate = req.body.date || new Date().toISOString().split('T')[0];
    const actualTimeSlot = req.body.timeSlot || '12:00 - 13:00';

    if (!actualField || !actualUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Eksik parametre! Lütfen saha ve kullanıcı bilgilerini kontrol edin." 
      });

    }

    if (!mongoose.Types.ObjectId.isValid(actualField)) {
        return res.status(400).json({ error: 'Geçersiz saha ID formatı.' });
    }
    if (!mongoose.Types.ObjectId.isValid(actualUser)) {
        return res.status(400).json({ error: 'Geçersiz kullanıcı ID formatı.' });
    }

    // Saha ve Saat çakışma kontrolleri (opsiyonel tutulabilir, ancak veri bütünlüğü için burada)
    const existingField = await Field.findById(actualField);
    if (!existingField) {
        return res.status(404).json({ error: 'Rezervasyon yapılmak istenen saha sistemde bulunamadı.' });
    }

    const isOccupied = await Booking.findOne({ field: actualField, date: actualDate, timeSlot: actualTimeSlot, status: { $ne: 'İptal Edildi' } });
    if (isOccupied) {
        return res.status(400).json({ error: 'Bu saha seçilen saat aralığında zaten dolu/rezerve edilmiş.' });
    }

    // 2. REZERVASYONU VERİTABANINA(MONGODB) KAYIT
    const newBooking = await Booking.create({
      field: actualField,
      user: actualUser,
      date: actualDate,
      timeSlot: actualTimeSlot,
      status: 'Onay Bekliyor'
    });

    // 3. GÜVENLİ SERVİS SİMÜLASYONU: 🟨 RABBITMQ
    try {
      const mqChannel = req.app.get('mqChannel');
      const queueName = 'booking_queue';

      if (mqChannel && typeof mqChannel.sendToQueue === 'function') {
        const messageData = Buffer.from(JSON.stringify({
          bookingId: newBooking._id,
          fieldId: newBooking.field,
          date: newBooking.date,
          timeSlot: newBooking.timeSlot,
          createdAt: new Date()
        }));

        mqChannel.sendToQueue(queueName, messageData, { persistent: true });
        console.log(`[Kuyruk Tetiklendi] Rezervasyon mesajı '${queueName}' kuyruğuna başarıyla iletildi.`);
      } else {
        console.log('⚠️ Uyarı: mqChannel nesnesine ulaşılamadı. İşlem Devam Ediyor.');
      }
    } catch (mqError) {
      console.error('⚠️ RabbitMQ Mesaj İletim Hatası (Yutuldu):', mqError.message);
    }

    // 4. GÜVENLİ SERVİS SİMÜLASYONU: 🔴 REDIS ÖNBELLEK TEMİZLİĞİ
    try {
      const redisClient = req.app.get('redisClient');
      if (redisClient && typeof redisClient.del === 'function') {
        await redisClient.del('all_fields'); 
        console.log('[Redis Cache] Yeni rezervasyon nedeniyle "all_fields" cache temizlendi.');
      }
    } catch (redisError) {
      console.error('⚠️ Redis Önbellek Temizleme Hatası (Yutuldu):', redisError.message);
    }

    // 5. KESİN BAŞARI MESAJI (KRİTİK - FRONTEND BEKLENTİSİ)
    return res.status(201).json({
      success: true,
      message: "saha kiralama işlemi başarıyla tamamlandı",
      data: newBooking
    });

  } catch (error) {
    console.error('❌ Rezervasyon Oluşturulurken Hata:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Sunucu hatası nedeniyle rezervasyon işlemi gerçekleştirilemedi.",
      error: error.message 
    });
  }
};
// 7/8 - Kişisel Maç ve Randevu Geçmişi Görüntüleme
const listUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ user: userId }).populate('field', 'name address pricePerHour');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcının maç randevu geçmişi getirilemedi.', details: error.message });
    }
};

// 7/8 - Rezervasyon İptal İşlemi
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'İptal edilmek istenen rezervasyon bulunamadı.' });
        }

        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: 'Rezervasyon kaydı sistemden başarıyla silindi/iptal edildi.' });
    } catch (error) {
        res.status(500).json({ error: 'Rezervasyon silinirken hata oluştu.', details: error.message });
    }
};

// 14 - Rezervasyon Onayı (Emirhan Fidan)
const confirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        let { status, isConfirmed } = req.body;

        // Frontend'den isConfirmed boolean/string gelirse onu status formatına çevir
        if (isConfirmed !== undefined) {
            // "true" veya true ise Onaylandı, aksi halde (false/"false") İptal Edildi
            status = (isConfirmed === true || isConfirmed === 'true') ? 'Onaylandı' : 'İptal Edildi';
        }

        // Büyük/küçük harf toleransı
        if (typeof status === 'string') {
            const lowerStatus = status.toLowerCase().trim();
            if (lowerStatus === 'onaylandı' || lowerStatus === 'onaylandi') status = 'Onaylandı';
            else if (lowerStatus === 'iptal edİldİ' || lowerStatus === 'iptal edildi') status = 'İptal Edildi';
            else if (lowerStatus === 'onay bekliyor') status = 'Onay Bekliyor';
        }

        const validStatuses = ['Onay Bekliyor', 'Onaylandı', 'İptal Edildi'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Geçersiz rezervasyon durumu (status).' });
        }

        // 1. Önce rezervasyonu bul (durumunu kontrol etmek için)
        const existingBooking = await Booking.findById(bookingId);
        
        if (!existingBooking) {
            return res.status(404).json({ error: 'Güncellenecek rezervasyon bulunamadı.' });
        }

        // 2. Eğer zaten onaylanmış veya iptal edilmişse müdahale etmeye izin verme
        if (existingBooking.status !== 'Onay Bekliyor') {
            return res.status(400).json({ 
                error: `İşlem başarısız. Bu rezervasyon zaten '${existingBooking.status}' durumunda.` 
            });
        }

        // 3. Durumu güncelle ve kaydet
        existingBooking.status = status;
        const updatedBooking = await existingBooking.save();

        res.status(200).json({ message: 'Rezervasyon durumu başarıyla güncellendi.', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ error: 'Rezervasyon onaylanırken hata oluştu.', details: error.message });
    }
};

module.exports = {
    createBooking,
    listUserBookings,
    cancelBooking,
    confirmBooking
};
