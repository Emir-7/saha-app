const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Açık', 'Yanıtlandı', 'Kapalı'],
        default: 'Açık'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Ticket', ticketSchema);
