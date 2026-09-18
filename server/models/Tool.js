const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    toolId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    desc: { type: String },
    specs: { type: String },
    pricePerDay: { type: Number, required: true, default: 0 },
    price: { type: Number },
    period: { type: String, default: 'Per Day' },
    image: { type: String },
    icon: { type: String, default: '🛠️' },
    availability: { type: Boolean, default: true },
    available: { type: Boolean, default: true },
    availabilityStatus: { type: String, default: 'Available' }, // 'Available', 'Rented', 'Maintenance'
    quantity: { type: Number, default: 1 },
    contactOption: { type: String, default: 'Site Delivery' },
    rating: { type: Number, default: 4.8 },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'tools'
});

// Middleware to keep alias fields synchronized
toolSchema.pre('save', function(next) {
    if (this.pricePerDay && !this.price) this.price = this.pricePerDay;
    if (this.price && !this.pricePerDay) this.pricePerDay = this.price;
    if (this.desc && !this.description) this.description = this.desc;
    if (this.description && !this.desc) this.desc = this.description;
    if (this.available !== undefined) this.availability = this.available;
    if (this.availability !== undefined) this.available = this.availability;
    next();
});

module.exports = mongoose.model('Tool', toolSchema);
