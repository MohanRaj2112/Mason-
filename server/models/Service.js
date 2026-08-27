const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: 'construction' },
    icon: { type: String, default: '🏗️' },
    tag: { type: String },
    description: { type: String, required: true },
    features: [{ type: String }],
    priceRange: { type: String },
    image: { type: String },
    link: { type: String },
    buttonText: { type: String, default: 'Get Quote →' },
    status: { type: String, default: 'Active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'services'
});

module.exports = mongoose.model('Service', serviceSchema);
