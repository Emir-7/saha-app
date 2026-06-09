const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    features: {
        type: [String], // duş, otopark vb. array olarak tutulur
        default: []
    },
    imageUrl: {
        type: String
    }
});

mongoose.model('Field', fieldSchema);
