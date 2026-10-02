const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true, index: true },
    userId: { type: String },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, trim: true },
    bookingType: { 
        type: String, 
        default: 'construction' 
    },
    service: { type: String },
    tool: { type: String },
    startDate: { type: String },
    duration: { type: String },
    location: { type: String },
    workers: { type: Number, default: 1 },
    paymentMode: { type: String, default: 'Cash on Site Consultation' },
    budget: { type: String },
    notes: { type: String },
    description: { type: String },
    estimatedAmount: { type: Number },
    amount: { type: Number },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Payment Processing', 'Paid', 'Failed', 'Cancelled', 'Refunded'],
        default: 'Pending'
    },
    transactionId: { type: String, default: '' },
    paymentOrderId: { type: String, default: '' },
    paymentMethod: { type: String, default: 'UPI' },
    paidAt: { type: Date },
    idempotencyKey: { type: String, index: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Active', 'In Progress', 'Completed', 'Cancelled'], 
        default: 'Pending' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'bookings'
});

module.exports = mongoose.model('Booking', bookingSchema);
