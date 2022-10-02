const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
    from_creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please enter a creator'],
        ref: 'User',
        trim: true
    },
    to_creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please enter a creator'],
        ref: 'User',
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please enter the amount of donation'],
        trim: true,
        min: [1, 'Donation amount must be a positive number']
    },
    currency: {
        type: String,
        required: true,
        trim: true,
        default: 'USD'
    },
    name: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = { Donation };
