require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (React dist build if present, or root static files)
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}
app.use(express.static(__dirname));

// MongoDB Setup with fail-safe bufferCommands
mongoose.set('bufferCommands', false);

let isDbConnected = false;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ThingsDB";

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        isDbConnected = true;
        console.log("MongoDB Connected ✓");
    })
    .catch(err => {
        isDbConnected = false;
        console.warn("MongoDB connection offline — using in-memory fallback store:", err.message);
    });

// Mongoose Schemas & Models
const userSchema = new mongoose.Schema({
    username: String,
    mobile: String,
    email: String,
    password: String,
    role: { type: String, default: "customer" },
    createdAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
    bookingId: String,
    customerName: String,
    phone: String,
    service: String,
    startDate: String,
    workers: Number,
    paymentMode: String,
    status: { type: String, default: "Pending" },
    amount: Number,
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    icon: String,
    available: { type: Boolean, default: true }
});

const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Product = mongoose.model("Product", productSchema);

// In-Memory Fallback Stores
const memoryUsers = [];
const memoryBookings = [
    { _id: "b1", bookingId: "SAC-1001", customerName: "Rajesh Kumar", phone: "+91 98765 43210", service: "House Construction (2BHK)", startDate: "2026-09-01", workers: 8, paymentMode: "UPI", status: "In Progress", amount: 45000 },
    { _id: "b2", bookingId: "SAC-1002", customerName: "Priya Sundar", phone: "+91 98765 12345", service: "Mason Hiring (3 Workers)", startDate: "2026-08-20", workers: 3, paymentMode: "Cash", status: "Confirmed", amount: 3600 },
    { _id: "b3", bookingId: "SAC-1003", customerName: "Murugan Doss", phone: "+91 91234 56789", service: "Cement Mixer Rental", startDate: "2026-08-15", workers: 1, paymentMode: "Card", status: "Pending", amount: 1500 }
];
const memoryProducts = [
    { _id: "p1", name: "Heavy-Duty Rotary Hammer Drill", category: "power-tools", price: 450, description: "High performance SDS-Plus rotary hammer drill for concrete demolition.", icon: "🔨", available: true },
    { _id: "p2", name: "Commercial Cement Mixer (200L)", category: "mixing", price: 850, description: "Diesel / Electric driven mortar & concrete mixer machine.", icon: "🪣", available: true },
    { _id: "p3", name: "Heavy Steel Scaffolding Set (50 Sq.Ft)", category: "roofing", price: 600, description: "Heavy-gauge modular scaffolding frames with cross-braces.", icon: "🏗️", available: true },
    { _id: "p4", name: "Vibratory Concrete Compactor", category: "power-tools", price: 500, description: "Gasoline needle vibrator for flawless concrete compaction.", icon: "⚡", available: true },
    { _id: "p5", name: "Safety Helmet & Harness Kit", category: "safety", price: 150, description: "ISI certified head protection and full body fall arrest safety belt.", icon: "🦺", available: true },
    { _id: "p6", name: "High Pressure Pipe Bender", category: "plumbing", price: 350, description: "Hydraulic pipe bender for GI and stainless steel pipes.", icon: "🔧", available: true }
];

// ──────────────── USER API ROUTES ────────────────

// Register user
app.post("/register", async (req, res) => {
    const { username, mobile, email, password } = req.body;
    try {
        if (isDbConnected) {
            const newUser = new User({ username, mobile, email, password });
            await newUser.save();
            return res.status(201).json({ message: "User Saved Successfully", user: newUser });
        }
    } catch (error) {
        console.warn("DB write failed, using memory store:", error.message);
    }
    const memUser = { _id: Date.now().toString(), username, mobile, email, password, role: "customer", createdAt: new Date() };
    memoryUsers.push(memUser);
    res.status(201).json({ message: "User Saved Successfully", user: memUser });
});

// Get all users
app.get("/users", async (req, res) => {
    try {
        if (isDbConnected) {
            const users = await User.find();
            return res.status(200).json(users);
        }
    } catch (error) {
        console.warn("DB query failed, returning memory users:", error.message);
    }
    res.status(200).json(memoryUsers);
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
    try {
        if (isDbConnected) {
            const user = await User.findById(req.params.id);
            if (user) return res.status(200).json(user);
        }
    } catch (error) {
        console.warn("DB query failed:", error.message);
    }
    const memUser = memoryUsers.find(u => u._id === req.params.id);
    if (!memUser) return res.status(404).json({ message: "User Not Found" });
    res.status(200).json(memUser);
});

// Update user
app.put("/users/:id", async (req, res) => {
    const { username, mobile, email } = req.body;
    try {
        if (isDbConnected) {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { username, mobile, email },
                { new: true }
            );
            if (updatedUser) return res.status(200).json({ message: "User Updated Successfully", user: updatedUser });
        }
    } catch (error) {
        console.warn("DB update failed:", error.message);
    }
    const idx = memoryUsers.findIndex(u => u._id === req.params.id);
    if (idx !== -1) {
        memoryUsers[idx] = { ...memoryUsers[idx], username, mobile, email };
        return res.status(200).json({ message: "User Updated Successfully", user: memoryUsers[idx] });
    }
    res.status(404).json({ message: "User Not Found" });
});

// Delete user
app.delete("/users/:id", async (req, res) => {
    try {
        if (isDbConnected) {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (deletedUser) return res.status(200).json({ message: "User Deleted Successfully" });
        }
    } catch (error) {
        console.warn("DB delete failed:", error.message);
    }
    const idx = memoryUsers.findIndex(u => u._id === req.params.id);
    if (idx !== -1) {
        memoryUsers.splice(idx, 1);
        return res.status(200).json({ message: "User Deleted Successfully" });
    }
    res.status(404).json({ message: "User Not Found" });
});

// ──────────────── BOOKINGS API ROUTES ────────────────

app.get("/api/bookings", async (req, res) => {
    try {
        if (isDbConnected) {
            const bookings = await Booking.find();
            return res.status(200).json(bookings);
        }
    } catch (e) {
        console.warn("DB booking fetch error:", e.message);
    }
    res.status(200).json(memoryBookings);
});

app.post("/api/bookings", async (req, res) => {
    const bookingData = {
        bookingId: "SAC-" + Math.floor(1000 + Math.random() * 9000),
        customerName: req.body.customerName || "Customer",
        phone: req.body.phone || "",
        service: req.body.service || "General Construction",
        startDate: req.body.startDate || new Date().toISOString().split('T')[0],
        workers: parseInt(req.body.workers || 1),
        paymentMode: req.body.paymentMode || "UPI",
        status: "Pending",
        amount: parseInt(req.body.amount || 2500)
    };
    try {
        if (isDbConnected) {
            const b = new Booking(bookingData);
            await b.save();
            return res.status(201).json({ message: "Booking Created", booking: b });
        }
    } catch (e) {
        console.warn("DB booking save error:", e.message);
    }
    const memBooking = { _id: Date.now().toString(), ...bookingData, createdAt: new Date() };
    memoryBookings.unshift(memBooking);
    res.status(201).json({ message: "Booking Created", booking: memBooking });
});

app.put("/api/bookings/:id", async (req, res) => {
    const { status } = req.body;
    try {
        if (isDbConnected) {
            const b = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
            if (b) return res.status(200).json({ message: "Status Updated", booking: b });
        }
    } catch (e) {
        console.warn("DB booking update error:", e.message);
    }
    const idx = memoryBookings.findIndex(b => b._id === req.params.id || b.bookingId === req.params.id);
    if (idx !== -1) {
        memoryBookings[idx].status = status;
        return res.status(200).json({ message: "Status Updated", booking: memoryBookings[idx] });
    }
    res.status(404).json({ message: "Booking Not Found" });
});

// ──────────────── PRODUCTS API ROUTES ────────────────

app.get("/api/products", async (req, res) => {
    try {
        if (isDbConnected) {
            const products = await Product.find();
            return res.status(200).json(products);
        }
    } catch (e) {
        console.warn("DB product fetch error:", e.message);
    }
    res.status(200).json(memoryProducts);
});

app.post("/api/products", async (req, res) => {
    const pData = {
        name: req.body.name,
        category: req.body.category || "power-tools",
        price: parseInt(req.body.price || 500),
        description: req.body.description || "",
        icon: req.body.icon || "🔨",
        available: req.body.available !== false
    };
    try {
        if (isDbConnected) {
            const p = new Product(pData);
            await p.save();
            return res.status(201).json({ message: "Product Added", product: p });
        }
    } catch (e) {
        console.warn("DB product save error:", e.message);
    }
    const memProd = { _id: Date.now().toString(), ...pData };
    memoryProducts.push(memProd);
    res.status(201).json({ message: "Product Added", product: memProd });
});

// Fallback route for SPA / direct HTML navigation
app.get('*', (req, res) => {
    const distIndex = path.join(distPath, 'index.html');
    if (fs.existsSync(distIndex)) {
        return res.sendFile(distIndex);
    }
    if (req.path.endsWith('.html') || req.path === '/') {
        const file = req.path === '/' ? 'index.html' : req.path.substring(1);
        res.sendFile(path.join(__dirname, file), err => {
            if (err) res.sendFile(path.join(__dirname, 'index.html'));
        });
    } else {
        res.sendFile(path.join(__dirname, req.path), err => {
            if (err) res.sendFile(path.join(__dirname, 'index.html'));
        });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SRM AKASH CONSTRUCTION server running on http://0.0.0.0:${PORT}`);
});
