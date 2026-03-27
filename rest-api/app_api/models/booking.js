const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true // Örnek: "18:00-19:00"
    },
    status: {
        type: String,
        enum: ['Onay Bekliyor', 'Onaylandı', 'İptal Edildi'],
        default: 'Onay Bekliyor'
    }
});

mongoose.model('Booking', bookingSchema);
