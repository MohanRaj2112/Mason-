const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true, index: true },
    bookingId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    service: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMethod: {
        type: String,
        enum: ['UPI', 'Google Pay', 'Paytm', 'Other supported methods', 'Net Banking', 'Card'],
        default: 'UPI'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Payment Processing', 'Paid', 'Failed', 'Cancelled', 'Refunded'],
        default: 'Pending'
    },
    gatewayReference: { type: String },
    signatureVerified: { type: Boolean, default: false },
    auditNote: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'transactions'
});

module.exports = mongoose.model('Transaction', transactionSchema);
