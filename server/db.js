const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mason_mate';

let isConnected = false;

async function connectDB() {
    if (isConnected) return true;

    try {
        mongoose.set('strictQuery', false);
        mongoose.set('bufferCommands', false);

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 3000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        const dbName = mongoose.connection.name || 'mason_mate';
        console.log(`[MongoDB] Successfully connected to database: ${dbName} ✓`);
        return true;
    } catch (err) {
        isConnected = false;
        console.warn(`[MongoDB] Connection notice: ${err.message}. System operating with resilient in-memory data store.`);
        return false;
    }
}

mongoose.connection.on('connected', () => {
    isConnected = true;
});

mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.warn('[MongoDB] Runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[MongoDB] Disconnected.');
});

module.exports = {
    connectDB,
    isDbConnected: () => isConnected && mongoose.connection.readyState === 1
};
