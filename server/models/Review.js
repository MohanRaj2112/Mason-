const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    loc: { type: String, default: 'Client' },
    rating: { type: Number, required: true, default: 5, min: 1, max: 5 },
    text: { type: String, required: true },
    date: { type: String },
    status: { type: String, default: 'Approved' },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'reviews'
});

module.exports = mongoose.model('Review', reviewSchema);
