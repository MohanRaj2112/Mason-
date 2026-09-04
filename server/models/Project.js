const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    tag: { type: String },
    specs: { type: String },
    description: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String },
    status: { type: String, default: 'Completed' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'projects'
});

module.exports = mongoose.model('Project', projectSchema);
