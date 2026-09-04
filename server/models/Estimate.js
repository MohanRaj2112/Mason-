const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
    estimateId: { type: String, required: true, unique: true, index: true },
    userId: { type: String },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, trim: true },
    projectType: { type: String, default: 'Residential Independent Villa' },
    service: { type: String },
    location: { type: String },
    budget: { type: String },
    duration: { type: String },
    description: { type: String },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'estimates'
});

module.exports = mongoose.model('Estimate', estimateSchema);
