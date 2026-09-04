const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    contactId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, trim: true },
    phone: { type: String, required: true },
    subject: { type: String },
    service: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Replied', 'Converted', 'Closed'], default: 'New' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'contacts'
});

module.exports = mongoose.model('Contact', contactSchema);
