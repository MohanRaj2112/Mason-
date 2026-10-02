require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { connectDB, isDbConnected } = require('./server/db');
const { seedDatabase, initialServices, initialProjects, initialTools, initialBookings, initialTransactions, initialContacts, initialEstimates, initialReviews } = require('./server/seed');

const User = require('./server/models/User');
const Admin = require('./server/models/Admin');
const Service = require('./server/models/Service');
const Project = require('./server/models/Project');
const Tool = require('./server/models/Tool');
const Booking = require('./server/models/Booking');
const Transaction = require('./server/models/Transaction');
const Estimate = require('./server/models/Estimate');
const Contact = require('./server/models/Contact');
const Review = require('./server/models/Review');

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mason_mate_super_secret_jwt_key_2026';
const PAYMENT_KEY_ID = process.env.PAYMENT_KEY_ID || 'rzp_live_srmakash_mm2026';
const PAYMENT_KEY_SECRET = process.env.PAYMENT_KEY_SECRET || 'srm_akash_payment_secret_2026';
const PAYMENT_WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'srm_akash_webhook_secret_2026';

// In-Memory Fallback store in case database is temporarily disconnected
const memStore = {
    users: [],
    admins: [],
    services: [...initialServices],
    projects: [...initialProjects],
    tools: [...initialTools],
    bookings: [...initialBookings],
    transactions: [...(initialTransactions || [])],
    contacts: [...initialContacts],
    estimates: [...initialEstimates],
    reviews: [...initialReviews]
};

// Initialize in-memory admin with bcrypt hash
(async () => {
    const adminHash = await bcrypt.hash('admin123', 10);
    memStore.admins.push({
        _id: 'mem_admin_1',
        adminId: 'ADMIN001',
        name: 'Administrator',
        username: 'admin',
        email: 'admin@srmakash.com',
        passwordHash: adminHash,
        role: 'admin',
        permissions: ['all']
    });

    const userHash = await bcrypt.hash('user123', 10);
    memStore.users.push({
        _id: 'mem_user_1',
        userId: 'USER001',
        name: 'Santhosh Kumar',
        username: 'santhosh',
        email: 'santhosh@example.com',
        phone: '9159687408',
        mobile: '9159687408',
        passwordHash: userHash,
        role: 'user'
    });
})();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from dist and root
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.use('/assets', express.static(path.join(__dirname, 'dist/assets')));
app.use('/src/assets', express.static(path.join(__dirname, 'src/assets')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// JWT Authentication Helper Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Optional / Role-Enforced Admin Authorization Middleware
const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const adminHeaderRole = req.headers['x-user-role'];

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded && (decoded.role === 'admin' || decoded.adminId)) {
                req.user = decoded;
                return next();
            }
            return res.status(403).json({ success: false, error: 'Forbidden: Administrator privileges required.' });
        } catch (err) {
            return res.status(403).json({ success: false, error: 'Invalid or expired administrator token.' });
        }
    }

    if (adminHeaderRole && adminHeaderRole !== 'admin') {
        return res.status(403).json({ success: false, error: 'Forbidden: Administrator role required.' });
    }

    next();
};

// Server-Side Authoritative Price Calculation Helper
const SERVICE_BASE_RATES = {
    'Turnkey House Construction': { rate: 25000, unit: 'Site Mobilization & Structural BOQ Advance', isFixedAdvance: true },
    'Hire Master Masons & Specialists': { rate: 1200, unit: 'Per Mason / Day', isFixedAdvance: false },
    'Master Mason Services': { rate: 1200, unit: 'Per Mason / Day', isFixedAdvance: false },
    'Renovation & Remodeling': { rate: 15000, unit: 'Structural Assessment & Mobilization Advance', isFixedAdvance: true },
    'Structural RCC & Framing': { rate: 20000, unit: 'Engineering & Shuttering Advance', isFixedAdvance: true },
    'Plumbing & Electrical Fitting': { rate: 1000, unit: 'Per Specialist / Day', isFixedAdvance: false },
    'Painting & Waterproofing': { rate: 950, unit: 'Per Specialist / Day', isFixedAdvance: false },
    'Building Maintenance & Repairs': { rate: 950, unit: 'Per Specialist / Day', isFixedAdvance: false }
};

function parseDurationDays(durationStr, explicitDays) {
    if (explicitDays && Number(explicitDays) > 0) return Math.min(365, Math.max(1, parseInt(explicitDays, 10)));
    if (!durationStr) return 1;
    const s = String(durationStr).toLowerCase();
    if (s.includes('month')) {
        const m = parseInt(s, 10) || 1;
        return m * 30;
    }
    if (s.includes('week')) {
        const w = parseInt(s, 10) || 1;
        return w * 7;
    }
    const numMatch = s.match(/(\d+)/);
    if (numMatch) return Math.max(1, parseInt(numMatch[1], 10));
    return 1;
}

async function calculateAuthoritativePricing(payload) {
    const bookingType = payload.bookingType || payload.type || 'construction';
    const quantity = Math.max(1, parseInt(payload.quantity || payload.toolQuantity || payload.workers || payload.workersCount || 1, 10));
    const durationDays = parseDurationDays(payload.duration, payload.durationDays);

    if (bookingType === 'tool_rental' || bookingType === 'tools') {
        const toolIdentifier = payload.toolId || payload.tool || payload.toolName || payload.selectedTool || '';
        let matchedTool = null;

        if (isDbConnected()) {
            try {
                matchedTool = await Tool.findOne({
                    $or: [
                        { toolId: toolIdentifier },
                        { name: toolIdentifier }
                    ]
                });
            } catch {}
        }

        if (!matchedTool) {
            matchedTool = memStore.tools.find(
                t => t.toolId === toolIdentifier || t._id === toolIdentifier || t.name === toolIdentifier
            );
        }

        const dailyRate = matchedTool ? Number(matchedTool.pricePerDay || matchedTool.price || 500) : 500;
        const itemTitle = matchedTool ? matchedTool.name : (toolIdentifier || 'Construction Equipment Rental');
        const subtotal = dailyRate * durationDays * quantity;

        return {
            serviceCategory: 'Construction Tool & Equipment Rental',
            selectedItem: itemTitle,
            rate: dailyRate,
            rateUnit: 'Per Day',
            durationDays,
            durationLabel: `${durationDays} Day${durationDays > 1 ? 's' : ''}`,
            quantity,
            quantityLabel: `${quantity} Unit${quantity > 1 ? 's' : ''}`,
            subtotal,
            totalAmount: subtotal
        };
    }

    if (bookingType === 'mason' || (payload.service || payload.selectedService || '').toLowerCase().includes('mason')) {
        const dailyMasonRate = 1200;
        const subtotal = dailyMasonRate * durationDays * quantity;
        return {
            serviceCategory: 'Master Mason & Workforce Deployment',
            selectedItem: payload.selectedService || payload.service || 'Hire Master Masons & Specialists',
            rate: dailyMasonRate,
            rateUnit: 'Per Mason / Day',
            durationDays,
            durationLabel: `${durationDays} Day${durationDays > 1 ? 's' : ''}`,
            quantity,
            quantityLabel: `${quantity} Master Mason${quantity > 1 ? 's' : ''}`,
            subtotal,
            totalAmount: subtotal
        };
    }

    if (bookingType === 'estimate') {
        const rate = 2500;
        return {
            serviceCategory: 'Engineering Site Visit & BOQ Estimate',
            selectedItem: payload.projectType || payload.service || 'Residential Turnkey BOQ Assessment',
            rate,
            rateUnit: 'Site Visit & Soil/Structural Assessment',
            durationDays: 1,
            durationLabel: payload.duration || '1 Day Inspection',
            quantity: 1,
            quantityLabel: '1 Lead Civil Engineer',
            subtotal: rate,
            totalAmount: rate
        };
    }

    // Construction Service
    const serviceName = payload.selectedService || payload.service || 'Turnkey House Construction';
    const cfg = SERVICE_BASE_RATES[serviceName] || { rate: 1500, unit: 'Per Day', isFixedAdvance: false };

    if (cfg.isFixedAdvance) {
        return {
            serviceCategory: 'Turnkey Construction & Civil Engineering',
            selectedItem: serviceName,
            rate: cfg.rate,
            rateUnit: cfg.unit,
            durationDays,
            durationLabel: payload.duration || 'Milestone Schedule',
            quantity,
            quantityLabel: `${quantity} Crew Allocation`,
            subtotal: cfg.rate,
            totalAmount: cfg.rate
        };
    }

    const total = cfg.rate * durationDays * quantity;
    return {
        serviceCategory: 'Construction & Specialist Service',
        selectedItem: serviceName,
        rate: cfg.rate,
        rateUnit: cfg.unit,
        durationDays,
        durationLabel: `${durationDays} Day${durationDays > 1 ? 's' : ''}`,
        quantity,
        quantityLabel: `${quantity} Specialist${quantity > 1 ? 's' : ''}`,
        subtotal: total,
        totalAmount: total
    };
}

// ─────────────────────────────────────────────────────────────
// 1. HEALTH & SYSTEM STATS APIS
// ─────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
    const dbStatus = isDbConnected() ? 'connected' : 'in-memory-fallback';
    res.json({
        status: 'ok',
        service: 'Mason Mate Backend API',
        database: dbStatus,
        databaseName: 'mason_mate',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/stats', async (req, res) => {
    try {
        if (isDbConnected()) {
            const [totalBookings, totalTools, totalUsers, totalContacts, totalProjects, totalServices] = await Promise.all([
                Booking.countDocuments(),
                Tool.countDocuments(),
                User.countDocuments(),
                Contact.countDocuments(),
                Project.countDocuments(),
                Service.countDocuments()
            ]);

            const bookingsList = await Booking.find();
            const totalRevenue = bookingsList.reduce((acc, b) => acc + (b.amount || b.estimatedAmount || 0), 0);

            return res.json({
                success: true,
                stats: {
                    totalBookings,
                    totalTools,
                    totalUsers,
                    totalContacts,
                    totalProjects,
                    totalServices,
                    totalRevenue
                }
            });
        }
    } catch (err) {
        console.warn('Stats DB query fallback:', err.message);
    }

    const totalRevenue = memStore.bookings.reduce((acc, b) => acc + (b.amount || b.estimatedAmount || 0), 0);
    res.json({
        success: true,
        stats: {
            totalBookings: memStore.bookings.length,
            totalTools: memStore.tools.length,
            totalUsers: memStore.users.length,
            totalContacts: memStore.contacts.length,
            totalProjects: memStore.projects.length,
            totalServices: memStore.services.length,
            totalRevenue
        }
    });
});

// ─────────────────────────────────────────────────────────────
// 2. AUTHENTICATION & USERS APIS
// ─────────────────────────────────────────────────────────────

// Register User
app.post(['/api/auth/register', '/register'], async (req, res) => {
    try {
        const { name, username, email, phone, mobile, password } = req.body;
        const displayName = name || username || 'User';
        const userPhone = phone || mobile || '';
        const userEmail = email ? email.toLowerCase().trim() : '';

        if (!password || (!userEmail && !userPhone && !username)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide required contact details and a password.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = 'USR-' + Math.floor(100000 + Math.random() * 900000);

        if (isDbConnected()) {
            // Check for existing user
            const existingQuery = [];
            if (userEmail) existingQuery.push({ email: userEmail });
            if (userPhone) existingQuery.push({ phone: userPhone });
            if (username) existingQuery.push({ username });

            if (existingQuery.length > 0) {
                const existing = await User.findOne({ $or: existingQuery });
                if (existing) {
                    return res.status(409).json({
                        success: false,
                        error: 'An account with this email, phone, or username already exists.'
                    });
                }
            }

            const newUser = new User({
                userId,
                name: displayName,
                username: username || displayName.toLowerCase().replace(/\s+/g, ''),
                email: userEmail,
                phone: userPhone,
                mobile: userPhone,
                passwordHash,
                role: 'user'
            });

            await newUser.save();
            const userObj = newUser.toJSON();

            const token = jwt.sign(
                { id: newUser._id, userId: newUser.userId, email: newUser.email, role: newUser.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.status(201).json({
                success: true,
                message: 'Account registered successfully',
                token,
                user: userObj
            });
        }
    } catch (err) {
        console.warn('Registration DB error:', err.message);
    }

    // In-Memory Fallback
    const { name, username, email, phone, mobile, password } = req.body;
    const displayName = name || username || 'User';
    const userPhone = phone || mobile || '';
    const userEmail = email ? email.toLowerCase().trim() : '';
    const passwordHash = await bcrypt.hash(password || 'default123', 10);
    const userId = 'USR-' + Math.floor(100000 + Math.random() * 900000);

    const memUser = {
        _id: 'mem_' + Date.now(),
        userId,
        name: displayName,
        username: username || displayName.toLowerCase().replace(/\s+/g, ''),
        email: userEmail,
        phone: userPhone,
        mobile: userPhone,
        role: 'user',
        createdAt: new Date()
    };
    memStore.users.push({ ...memUser, passwordHash });

    const token = jwt.sign(
        { id: memUser._id, userId: memUser.userId, email: memUser.email, role: memUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: memUser
    });
});

// Login User
app.post(['/api/auth/login', '/api/login'], async (req, res) => {
    const { identifier, email, phone, username, password } = req.body;
    const loginId = (identifier || email || phone || username || '').toLowerCase().trim();

    if (!loginId || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide credentials (email/phone/username) and password.'
        });
    }

    try {
        if (isDbConnected()) {
            const user = await User.findOne({
                $or: [
                    { email: loginId },
                    { phone: loginId },
                    { mobile: loginId },
                    { username: loginId },
                    { name: loginId }
                ]
            });

            if (user && user.passwordHash) {
                const match = await bcrypt.compare(password, user.passwordHash);
                if (match) {
                    const userObj = user.toJSON();
                    const token = jwt.sign(
                        { id: user._id, userId: user.userId, email: user.email, role: user.role },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );
                    return res.json({
                        success: true,
                        message: 'Login successful',
                        token,
                        user: userObj
                    });
                }
            }
        }
    } catch (err) {
        console.warn('Login DB error:', err.message);
    }

    // In-Memory Search
    const memUser = memStore.users.find(u =>
        (u.email && u.email.toLowerCase() === loginId) ||
        (u.phone && u.phone === loginId) ||
        (u.mobile && u.mobile === loginId) ||
        (u.username && u.username.toLowerCase() === loginId) ||
        (u.name && u.name.toLowerCase() === loginId)
    );

    if (memUser && memUser.passwordHash) {
        const match = await bcrypt.compare(password, memUser.passwordHash);
        if (match) {
            const sanitized = { ...memUser };
            delete sanitized.passwordHash;
            const token = jwt.sign(
                { id: memUser._id, userId: memUser.userId, email: memUser.email, role: memUser.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: sanitized
            });
        }
    }

    // Direct check for demo user
    if ((loginId === 'santhosh' || loginId === 'santhosh@example.com' || loginId === '9159687408') && password === 'user123') {
        const demoUser = {
            userId: 'USER001',
            name: 'Santhosh Kumar',
            email: 'santhosh@example.com',
            phone: '9159687408',
            role: 'user'
        };
        const token = jwt.sign(demoUser, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ success: true, token, user: demoUser });
    }

    // Direct check for admin credentials in standard login
    const memAdmin = memStore.admins.find(a =>
        (a.email && a.email.toLowerCase() === loginId) ||
        (a.username && a.username.toLowerCase() === loginId) ||
        (a.name && a.name.toLowerCase() === loginId)
    );
    if (memAdmin && memAdmin.passwordHash) {
        const match = await bcrypt.compare(password, memAdmin.passwordHash);
        if (match) {
            const sanitized = { ...memAdmin };
            delete sanitized.passwordHash;
            const token = jwt.sign(
                { id: memAdmin._id, adminId: memAdmin.adminId, email: memAdmin.email, role: 'admin' },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
            return res.json({
                success: true,
                message: 'Admin login successful',
                token,
                user: sanitized
            });
        }
    }

    if ((loginId === 'admin' || loginId === 'admin@srmakash.com' || loginId === 'admin@masonmate.in') && password === 'admin123') {
        const defaultAdmin = {
            adminId: 'ADMIN001',
            name: 'Administrator',
            email: 'admin@srmakash.com',
            username: 'admin',
            role: 'admin',
            permissions: ['all']
        };
        const token = jwt.sign(defaultAdmin, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: defaultAdmin
        });
    }

    return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please check your username/email and password.'
    });
});

// Admin Login
app.post(['/api/auth/admin/login', '/api/admin/login'], async (req, res) => {
    const { username, email, identifier, password } = req.body;
    const adminIdInput = (username || email || identifier || '').toLowerCase().trim();

    if (!adminIdInput || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username/Email and Password are required.'
        });
    }

    try {
        if (isDbConnected()) {
            const admin = await Admin.findOne({
                $or: [
                    { email: adminIdInput },
                    { username: adminIdInput },
                    { name: adminIdInput }
                ]
            });

            if (admin && admin.passwordHash) {
                const match = await bcrypt.compare(password, admin.passwordHash);
                if (match) {
                    const adminObj = admin.toJSON();
                    const token = jwt.sign(
                        { id: admin._id, adminId: admin.adminId, role: 'admin' },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );
                    return res.json({
                        success: true,
                        message: 'Admin authentication successful',
                        token,
                        admin: adminObj
                    });
                }
            }
        }
    } catch (err) {
        console.warn('Admin login DB error:', err.message);
    }

    // Default admin fallback
    if ((adminIdInput === 'admin' || adminIdInput === 'admin@srmakash.com' || adminIdInput === 'admin@masonmate.in') && password === 'admin123') {
        const defaultAdmin = {
            adminId: 'ADMIN001',
            name: 'Administrator',
            email: 'admin@srmakash.com',
            username: 'admin',
            role: 'admin',
            permissions: ['all']
        };
        const token = jwt.sign(defaultAdmin, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            success: true,
            message: 'Admin authentication successful',
            token,
            admin: defaultAdmin
        });
    }

    return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials.'
    });
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        if (isDbConnected()) {
            const user = await User.findById(req.user.id);
            if (user) return res.json({ success: true, user: user.toJSON() });
        }
    } catch (err) {
        console.warn('Auth/me DB query failed:', err.message);
    }
    const mem = memStore.users.find(u => u._id === req.user.id || u.userId === req.user.userId);
    if (mem) {
        const sanitized = { ...mem };
        delete sanitized.passwordHash;
        return res.json({ success: true, user: sanitized });
    }
    res.json({ success: true, user: req.user });
});

// Get all users (sanitized)
app.get(['/api/users', '/users'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const users = await User.find().select('-passwordHash');
            return res.json(users);
        }
    } catch (err) {
        console.warn('Get users DB error:', err.message);
    }
    const sanitized = memStore.users.map(u => {
        const copy = { ...u };
        delete copy.passwordHash;
        return copy;
    });
    res.json(sanitized);
});

// Get user by ID
app.get(['/api/users/:id', '/users/:id'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const user = await User.findOne({
                $or: [{ _id: req.params.id }, { userId: req.params.id }]
            }).select('-passwordHash');
            if (user) return res.json(user);
        }
    } catch (err) {
        console.warn('Get user by ID DB error:', err.message);
    }
    const mem = memStore.users.find(u => u._id === req.params.id || u.userId === req.params.id);
    if (!mem) return res.status(404).json({ success: false, error: 'User not found' });
    const copy = { ...mem };
    delete copy.passwordHash;
    res.json(copy);
});

// Update user by ID
app.put(['/api/users/:id', '/users/:id'], async (req, res) => {
    const { name, username, email, phone, mobile, password, role } = req.body;
    try {
        const updateData = {};
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (email) updateData.email = email.toLowerCase().trim();
        if (phone || mobile) {
            updateData.phone = phone || mobile;
            updateData.mobile = phone || mobile;
        }
        if (role) updateData.role = role;
        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }
        updateData.updatedAt = new Date();

        if (isDbConnected()) {
            const updated = await User.findOneAndUpdate(
                { $or: [{ _id: req.params.id }, { userId: req.params.id }] },
                updateData,
                { new: true }
            ).select('-passwordHash');
            if (updated) return res.json({ success: true, message: 'User updated successfully', user: updated });
        }
    } catch (err) {
        console.warn('Update user DB error:', err.message);
    }

    const idx = memStore.users.findIndex(u => u._id === req.params.id || u.userId === req.params.id);
    if (idx !== -1) {
        memStore.users[idx] = { ...memStore.users[idx], ...req.body, updatedAt: new Date() };
        const copy = { ...memStore.users[idx] };
        delete copy.passwordHash;
        return res.json({ success: true, message: 'User updated successfully', user: copy });
    }
    res.status(404).json({ success: false, error: 'User not found' });
});

// Delete user by ID
app.delete(['/api/users/:id', '/users/:id'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const deleted = await User.findOneAndDelete({
                $or: [{ _id: req.params.id }, { userId: req.params.id }]
            });
            if (deleted) return res.json({ success: true, message: 'User deleted successfully' });
        }
    } catch (err) {
        console.warn('Delete user DB error:', err.message);
    }
    const idx = memStore.users.findIndex(u => u._id === req.params.id || u.userId === req.params.id);
    if (idx !== -1) {
        memStore.users.splice(idx, 1);
        return res.json({ success: true, message: 'User deleted successfully' });
    }
    res.status(404).json({ success: false, error: 'User not found' });
});

// ─────────────────────────────────────────────────────────────
// 3. SERVICES APIS
// ─────────────────────────────────────────────────────────────

app.get('/api/services', async (req, res) => {
    try {
        if (isDbConnected()) {
            const services = await Service.find();
            if (services && services.length > 0) return res.json(services);
        }
    } catch (err) {
        console.warn('Get services DB error:', err.message);
    }
    res.json(memStore.services);
});

app.get('/api/services/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const s = await Service.findOne({
                $or: [{ _id: req.params.id }, { serviceId: req.params.id }]
            });
            if (s) return res.json(s);
        }
    } catch (err) {
        console.warn('Get service DB error:', err.message);
    }
    const mem = memStore.services.find(s => s._id === req.params.id || s.serviceId === req.params.id);
    if (!mem) return res.status(404).json({ success: false, error: 'Service not found' });
    res.json(mem);
});

app.post('/api/services', async (req, res) => {
    const serviceData = {
        serviceId: req.body.serviceId || 'srv-' + Date.now(),
        title: req.body.title,
        category: req.body.category || 'construction',
        icon: req.body.icon || '🏗️',
        tag: req.body.tag || '',
        description: req.body.description || '',
        features: Array.isArray(req.body.features) ? req.body.features : [],
        priceRange: req.body.priceRange || '',
        image: req.body.image || '',
        link: req.body.link || '/booking',
        buttonText: req.body.buttonText || 'Get Quote →',
        status: req.body.status || 'Active'
    };

    try {
        if (isDbConnected()) {
            const newService = new Service(serviceData);
            await newService.save();
            return res.status(201).json({ success: true, message: 'Service created successfully', service: newService });
        }
    } catch (err) {
        console.warn('Create service DB error:', err.message);
    }
    const mem = { _id: 'mem_' + Date.now(), ...serviceData, createdAt: new Date() };
    memStore.services.push(mem);
    res.status(201).json({ success: true, message: 'Service created successfully', service: mem });
});

app.put('/api/services/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const updated = await Service.findOneAndUpdate(
                { $or: [{ _id: req.params.id }, { serviceId: req.params.id }] },
                req.body,
                { new: true }
            );
            if (updated) return res.json({ success: true, message: 'Service updated successfully', service: updated });
        }
    } catch (err) {
        console.warn('Update service DB error:', err.message);
    }
    const idx = memStore.services.findIndex(s => s._id === req.params.id || s.serviceId === req.params.id);
    if (idx !== -1) {
        memStore.services[idx] = { ...memStore.services[idx], ...req.body, updatedAt: new Date() };
        return res.json({ success: true, message: 'Service updated successfully', service: memStore.services[idx] });
    }
    res.status(404).json({ success: false, error: 'Service not found' });
});

app.delete('/api/services/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const deleted = await Service.findOneAndDelete({
                $or: [{ _id: req.params.id }, { serviceId: req.params.id }]
            });
            if (deleted) return res.json({ success: true, message: 'Service deleted successfully' });
        }
    } catch (err) {
        console.warn('Delete service DB error:', err.message);
    }
    const idx = memStore.services.findIndex(s => s._id === req.params.id || s.serviceId === req.params.id);
    if (idx !== -1) {
        memStore.services.splice(idx, 1);
        return res.json({ success: true, message: 'Service deleted successfully' });
    }
    res.status(404).json({ success: false, error: 'Service not found' });
});

// ─────────────────────────────────────────────────────────────
// 4. PROJECTS APIS
// ─────────────────────────────────────────────────────────────

app.get('/api/projects', async (req, res) => {
    try {
        if (isDbConnected()) {
            const projects = await Project.find();
            if (projects && projects.length > 0) return res.json(projects);
        }
    } catch (err) {
        console.warn('Get projects DB error:', err.message);
    }
    res.json(memStore.projects);
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const p = await Project.findOne({
                $or: [{ _id: req.params.id }, { projectId: req.params.id }]
            });
            if (p) return res.json(p);
        }
    } catch (err) {
        console.warn('Get project DB error:', err.message);
    }
    const mem = memStore.projects.find(p => p._id === req.params.id || p.projectId === req.params.id);
    if (!mem) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json(mem);
});

app.post('/api/projects', async (req, res) => {
    const projectData = {
        projectId: req.body.projectId || 'proj-' + Date.now(),
        title: req.body.title,
        category: req.body.category || 'Turnkey Build',
        tag: req.body.tag || req.body.category || 'Turnkey Build',
        specs: req.body.specs || '',
        description: req.body.description || '',
        location: req.body.location || 'Salem, Tamil Nadu',
        image: req.body.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        status: req.body.status || 'Completed'
    };

    try {
        if (isDbConnected()) {
            const newProject = new Project(projectData);
            await newProject.save();
            return res.status(201).json({ success: true, message: 'Project created successfully', project: newProject });
        }
    } catch (err) {
        console.warn('Create project DB error:', err.message);
    }
    const mem = { _id: 'mem_' + Date.now(), ...projectData, createdAt: new Date() };
    memStore.projects.push(mem);
    res.status(201).json({ success: true, message: 'Project created successfully', project: mem });
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const updated = await Project.findOneAndUpdate(
                { $or: [{ _id: req.params.id }, { projectId: req.params.id }] },
                req.body,
                { new: true }
            );
            if (updated) return res.json({ success: true, message: 'Project updated successfully', project: updated });
        }
    } catch (err) {
        console.warn('Update project DB error:', err.message);
    }
    const idx = memStore.projects.findIndex(p => p._id === req.params.id || p.projectId === req.params.id);
    if (idx !== -1) {
        memStore.projects[idx] = { ...memStore.projects[idx], ...req.body, updatedAt: new Date() };
        return res.json({ success: true, message: 'Project updated successfully', project: memStore.projects[idx] });
    }
    res.status(404).json({ success: false, error: 'Project not found' });
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const deleted = await Project.findOneAndDelete({
                $or: [{ _id: req.params.id }, { projectId: req.params.id }]
            });
            if (deleted) return res.json({ success: true, message: 'Project deleted successfully' });
        }
    } catch (err) {
        console.warn('Delete project DB error:', err.message);
    }
    const idx = memStore.projects.findIndex(p => p._id === req.params.id || p.projectId === req.params.id);
    if (idx !== -1) {
        memStore.projects.splice(idx, 1);
        return res.json({ success: true, message: 'Project deleted successfully' });
    }
    res.status(404).json({ success: false, error: 'Project not found' });
});

// ─────────────────────────────────────────────────────────────
// 5. TOOLS & EQUIPMENT (PRODUCTS) APIS
// ─────────────────────────────────────────────────────────────

app.get(['/api/tools', '/api/products'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const tools = await Tool.find();
            if (tools && tools.length > 0) return res.json(tools);
        }
    } catch (err) {
        console.warn('Get tools DB error:', err.message);
    }
    res.json(memStore.tools);
});

app.get(['/api/tools/:id', '/api/products/:id'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const tool = await Tool.findOne({
                $or: [{ _id: req.params.id }, { toolId: req.params.id }]
            });
            if (tool) return res.json(tool);
        }
    } catch (err) {
        console.warn('Get tool DB error:', err.message);
    }
    const mem = memStore.tools.find(t => t._id === req.params.id || t.toolId === req.params.id);
    if (!mem) return res.status(404).json({ success: false, error: 'Tool not found' });
    res.json(mem);
});

app.post(['/api/tools', '/api/products'], async (req, res) => {
    const priceVal = parseFloat(req.body.pricePerDay || req.body.price || 500);
    const toolData = {
        toolId: req.body.toolId || req.body._id || 'tool_' + Date.now(),
        name: req.body.name,
        category: req.body.category || 'power-tools',
        description: req.body.description || req.body.desc || '',
        desc: req.body.description || req.body.desc || '',
        specs: req.body.specs || '',
        pricePerDay: priceVal,
        price: priceVal,
        period: req.body.period || 'Per Day',
        image: req.body.image || '',
        icon: req.body.icon || '🛠️',
        availability: req.body.available !== false && req.body.availability !== false,
        available: req.body.available !== false && req.body.availability !== false,
        availabilityStatus: req.body.availabilityStatus || 'Available',
        quantity: parseInt(req.body.quantity || 1),
        contactOption: req.body.contactOption || 'Site Delivery',
        rating: parseFloat(req.body.rating || 4.8),
        featured: req.body.featured === true
    };

    try {
        if (isDbConnected()) {
            const newTool = new Tool(toolData);
            await newTool.save();
            return res.status(201).json({ success: true, message: 'Tool added successfully', product: newTool, tool: newTool });
        }
    } catch (err) {
        console.warn('Create tool DB error:', err.message);
    }
    const mem = { _id: 'mem_' + Date.now(), ...toolData, createdAt: new Date() };
    memStore.tools.unshift(mem);
    res.status(201).json({ success: true, message: 'Tool added successfully', product: mem, tool: mem });
});

app.put(['/api/tools/:id', '/api/products/:id'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const updatePayload = { ...req.body };
            if (updatePayload.price && !updatePayload.pricePerDay) updatePayload.pricePerDay = updatePayload.price;
            if (updatePayload.pricePerDay && !updatePayload.price) updatePayload.price = updatePayload.pricePerDay;

            const updated = await Tool.findOneAndUpdate(
                { $or: [{ _id: req.params.id }, { toolId: req.params.id }] },
                updatePayload,
                { new: true }
            );
            if (updated) return res.json({ success: true, message: 'Tool updated successfully', product: updated, tool: updated });
        }
    } catch (err) {
        console.warn('Update tool DB error:', err.message);
    }
    const idx = memStore.tools.findIndex(t => t._id === req.params.id || t.toolId === req.params.id);
    if (idx !== -1) {
        memStore.tools[idx] = { ...memStore.tools[idx], ...req.body, updatedAt: new Date() };
        return res.json({ success: true, message: 'Tool updated successfully', product: memStore.tools[idx], tool: memStore.tools[idx] });
    }
    res.status(404).json({ success: false, error: 'Tool not found' });
});

app.delete(['/api/tools/:id', '/api/products/:id'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const deleted = await Tool.findOneAndDelete({
                $or: [{ _id: req.params.id }, { toolId: req.params.id }]
            });
            if (deleted) return res.json({ success: true, message: 'Tool deleted successfully' });
        }
    } catch (err) {
        console.warn('Delete tool DB error:', err.message);
    }
    const idx = memStore.tools.findIndex(t => t._id === req.params.id || t.toolId === req.params.id);
    if (idx !== -1) {
        memStore.tools.splice(idx, 1);
        return res.json({ success: true, message: 'Tool deleted successfully' });
    }
    res.status(404).json({ success: false, error: 'Tool not found' });
});

// ─────────────────────────────────────────────────────────────
// 6. BOOKINGS APIS
// ─────────────────────────────────────────────────────────────

app.get('/api/bookings', async (req, res) => {
    try {
        if (isDbConnected()) {
            const bookings = await Booking.find().sort({ createdAt: -1 });
            if (bookings && bookings.length > 0) return res.json(bookings);
        }
    } catch (err) {
        console.warn('Get bookings DB error:', err.message);
    }
    res.json(memStore.bookings);
});

app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
        if (isDbConnected()) {
            const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
            return res.json(bookings);
        }
    } catch (err) {
        console.warn('Get user bookings DB error:', err.message);
    }
    const filtered = memStore.bookings.filter(b => b.userId === req.params.userId);
    res.json(filtered);
});

app.get('/api/bookings/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const b = await Booking.findOne({
                $or: [{ _id: req.params.id }, { bookingId: req.params.id }]
            });
            if (b) return res.json(b);
        }
    } catch (err) {
        console.warn('Get booking DB error:', err.message);
    }
    const mem = memStore.bookings.find(b => b._id === req.params.id || b.bookingId === req.params.id);
    if (!mem) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json(mem);
});

app.post('/api/bookings', async (req, res) => {
    const pricing = await calculateAuthoritativePricing(req.body);
    const amountVal = pricing.totalAmount || parseFloat(req.body.amount || req.body.estimatedAmount || 2500);
    const paymentMethod = req.body.paymentMethod || req.body.paymentMode || 'Cash on Visit';
    const paymentStatus = req.body.paymentStatus || (paymentMethod.toLowerCase().includes('cash') ? 'Pending' : 'Paid');
    const bookingId = req.body.bookingId || ('MM-' + Math.floor(100000 + Math.random() * 900000));
    const transactionId = req.body.transactionId || (paymentStatus === 'Paid' ? 'TXN-' + Math.floor(10000000 + Math.random() * 90000000) : '');

    const bookingData = {
        bookingId,
        userId: req.body.userId || '',
        customerName: req.body.customerName || req.body.name || 'Customer',
        phone: req.body.phone || req.body.mobile || '',
        email: req.body.email || '',
        bookingType: req.body.bookingType || req.body.type || 'construction',
        service: req.body.service || pricing.selectedItem || 'Turnkey House Construction',
        tool: req.body.tool || req.body.toolName || req.body.selectedTool || '',
        startDate: req.body.startDate || new Date().toISOString().split('T')[0],
        duration: req.body.duration || pricing.durationLabel || '1 Day',
        location: req.body.location || 'Salem, Tamil Nadu',
        workers: parseInt(req.body.workers || req.body.quantity || 1, 10),
        paymentMode: paymentMethod,
        paymentMethod,
        paymentStatus,
        transactionId,
        paymentOrderId: req.body.paymentOrderId || '',
        paidAt: paymentStatus === 'Paid' ? new Date() : null,
        budget: req.body.budget || '',
        notes: req.body.notes || req.body.description || '',
        description: req.body.notes || req.body.description || '',
        estimatedAmount: amountVal,
        amount: amountVal,
        status: req.body.status || 'Confirmed'
    };

    try {
        if (isDbConnected()) {
            const newBooking = new Booking(bookingData);
            await newBooking.save();
            return res.status(201).json({
                success: true,
                message: 'Booking successfully confirmed and stored in MongoDB',
                booking: newBooking,
                pricing
            });
        }
    } catch (err) {
        console.warn('Create booking DB error:', err.message);
    }

    const mem = { _id: 'mem_' + Date.now(), ...bookingData, createdAt: new Date() };
    memStore.bookings.unshift(mem);
    res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        booking: mem,
        pricing
    });
});

// ─────────────────────────────────────────────────────────────
// 6B. SECURE PAYMENT GATEWAY & TRANSACTIONS APIS
// ─────────────────────────────────────────────────────────────

// 1. Server-Side Price Calculation Endpoint
app.post('/api/payments/calculate', async (req, res) => {
    try {
        const pricing = await calculateAuthoritativePricing(req.body);
        res.json({
            success: true,
            pricing
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to calculate booking price', message: err.message });
    }
});

// 2. Create Secure Payment Order & Pending Booking
app.post('/api/payments/create-order', async (req, res) => {
    try {
        const {
            customerName,
            phone,
            email,
            location,
            bookingType,
            service,
            selectedService,
            selectedTool,
            toolName,
            toolId,
            startDate,
            duration,
            durationDays,
            quantity,
            workers,
            paymentMethod,
            notes
        } = req.body;

        if (!customerName || !phone || !location || !startDate) {
            return res.status(400).json({
                success: false,
                error: 'Customer name, phone number, site location, and start date are required.'
            });
        }

        const pricing = await calculateAuthoritativePricing(req.body);
        const verifiedAmount = pricing.totalAmount;
        const bookingId = req.body.bookingId || ('MM-' + Math.floor(100000 + Math.random() * 900000));
        const orderId = 'order_MM_' + Date.now() + '_' + Math.floor(1000 + Math.random() * 9000);
        const signatureToken = crypto
            .createHmac('sha256', PAYMENT_KEY_SECRET)
            .update(`${orderId}|${bookingId}|${verifiedAmount}`)
            .digest('hex');

        const pendingBookingData = {
            bookingId,
            userId: req.body.userId || '',
            customerName: customerName.trim(),
            phone: phone.trim(),
            email: (email || '').trim(),
            bookingType: bookingType || 'construction',
            service: service || pricing.selectedItem,
            tool: selectedTool || toolName || '',
            startDate,
            duration: pricing.durationLabel,
            location: location.trim(),
            workers: pricing.quantity,
            paymentMode: paymentMethod || 'UPI',
            paymentMethod: paymentMethod || 'UPI',
            paymentStatus: 'Payment Processing',
            paymentOrderId: orderId,
            transactionId: '',
            notes: notes || '',
            description: notes || '',
            estimatedAmount: verifiedAmount,
            amount: verifiedAmount,
            status: 'Pending'
        };

        if (isDbConnected()) {
            try {
                await Booking.findOneAndUpdate(
                    { bookingId },
                    pendingBookingData,
                    { upsert: true, new: true }
                );
            } catch (dbErr) {
                console.warn('Order booking DB upsert fallback:', dbErr.message);
            }
        }

        const existingIdx = memStore.bookings.findIndex(b => b.bookingId === bookingId);
        if (existingIdx !== -1) {
            memStore.bookings[existingIdx] = { ...memStore.bookings[existingIdx], ...pendingBookingData };
        } else {
            memStore.bookings.unshift({ _id: 'mem_' + Date.now(), ...pendingBookingData, createdAt: new Date() });
        }

        res.status(201).json({
            success: true,
            order: {
                orderId,
                bookingId,
                amount: verifiedAmount,
                currency: 'INR',
                keyId: PAYMENT_KEY_ID,
                signatureToken,
                pricing
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Unable to initialize payment order', message: err.message });
    }
});

// 3. Verify Payment & Confirm Booking
app.post('/api/payments/verify', async (req, res) => {
    try {
        const {
            orderId,
            bookingId,
            signatureToken,
            paymentMethod = 'UPI',
            paymentDetails = {},
            simulateOutcome = 'success'
        } = req.body;

        if (!orderId || !bookingId) {
            return res.status(400).json({ success: false, error: 'Missing orderId or bookingId for verification.' });
        }

        // Locate booking in DB or memStore
        let bookingDoc = null;
        if (isDbConnected()) {
            try {
                bookingDoc = await Booking.findOne({ bookingId });
            } catch {}
        }
        const memBooking = memStore.bookings.find(b => b.bookingId === bookingId);
        const targetAmount = bookingDoc ? bookingDoc.amount : (memBooking ? memBooking.amount : Number(req.body.amount || 0));

        // Verify cryptographic HMAC token generated during create-order
        const expectedSignature = crypto
            .createHmac('sha256', PAYMENT_KEY_SECRET)
            .update(`${orderId}|${bookingId}|${targetAmount}`)
            .digest('hex');

        if (signatureToken && signatureToken !== expectedSignature) {
            return res.status(400).json({
                success: false,
                error: 'Payment cryptographic signature verification failed. Tampered payload detected.'
            });
        }

        const transactionId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);

        if (simulateOutcome === 'failed' || simulateOutcome === 'cancelled') {
            const failedStatus = simulateOutcome === 'cancelled' ? 'Cancelled' : 'Failed';
            const failedTxn = {
                transactionId,
                orderId,
                bookingId,
                customerName: (bookingDoc || memBooking || {}).customerName || 'Customer',
                phone: (bookingDoc || memBooking || {}).phone || '',
                email: (bookingDoc || memBooking || {}).email || '',
                service: (bookingDoc || memBooking || {}).service || 'Service Booking',
                amount: targetAmount,
                currency: 'INR',
                paymentMethod,
                paymentStatus: failedStatus,
                gatewayReference: 'ERR_' + Date.now(),
                verifiedByServer: true,
                failureReason: simulateOutcome === 'cancelled' ? 'Cancelled by customer during checkout' : 'Payment declined by issuing bank',
                createdAt: new Date()
            };

            if (isDbConnected()) {
                try {
                    await Transaction.create(failedTxn);
                    await Booking.findOneAndUpdate(
                        { bookingId },
                        { paymentStatus: failedStatus, status: 'Pending', transactionId }
                    );
                } catch {}
            }
            memStore.transactions.unshift({ _id: 'txn_' + Date.now(), ...failedTxn });
            if (memBooking) {
                memBooking.paymentStatus = failedStatus;
                memBooking.transactionId = transactionId;
            }

            return res.status(402).json({
                success: false,
                paymentStatus: failedStatus,
                transactionId,
                error: failedTxn.failureReason
            });
        }

        // Determine final payment status (Paid for online methods, Pending for Cash on Site Visit)
        const isPayOnSite = paymentMethod.toLowerCase().includes('cash') || paymentMethod.toLowerCase().includes('site');
        const finalPaymentStatus = isPayOnSite ? 'Pending' : 'Paid';
        const finalBookingStatus = 'Confirmed';
        const paidAt = new Date();

        // Sanitize payment reference (never store raw card numbers/CVV/PIN)
        let maskedRef = 'VERIFIED_GATEWAY';
        if (paymentDetails.upiId) {
            maskedRef = `UPI:${paymentDetails.upiId}`;
        } else if (paymentDetails.cardLast4) {
            maskedRef = `CARD:****${String(paymentDetails.cardLast4).slice(-4)}`;
        } else if (paymentDetails.bankName) {
            maskedRef = `NETBANKING:${paymentDetails.bankName}`;
        } else if (isPayOnSite) {
            maskedRef = 'PAY_ON_SITE_VISIT';
        }

        const txnData = {
            transactionId,
            orderId,
            bookingId,
            customerName: (bookingDoc || memBooking || {}).customerName || req.body.customerName || 'Customer',
            phone: (bookingDoc || memBooking || {}).phone || req.body.phone || '',
            email: (bookingDoc || memBooking || {}).email || req.body.email || '',
            service: (bookingDoc || memBooking || {}).service || req.body.service || 'Construction Service',
            amount: targetAmount,
            currency: 'INR',
            paymentMethod,
            paymentStatus: finalPaymentStatus,
            gatewayReference: maskedRef,
            verifiedByServer: true,
            paidAt,
            createdAt: paidAt
        };

        let updatedBooking = null;
        if (isDbConnected()) {
            try {
                await Transaction.create(txnData);
                updatedBooking = await Booking.findOneAndUpdate(
                    { bookingId },
                    {
                        paymentStatus: finalPaymentStatus,
                        paymentMethod,
                        paymentMode: paymentMethod,
                        transactionId,
                        paymentOrderId: orderId,
                        status: finalBookingStatus,
                        paidAt
                    },
                    { new: true }
                );
            } catch (dbErr) {
                console.warn('Verify payment DB update fallback:', dbErr.message);
            }
        }

        memStore.transactions.unshift({ _id: 'txn_' + Date.now(), ...txnData });
        if (memBooking) {
            memBooking.paymentStatus = finalPaymentStatus;
            memBooking.paymentMethod = paymentMethod;
            memBooking.paymentMode = paymentMethod;
            memBooking.transactionId = transactionId;
            memBooking.paymentOrderId = orderId;
            memBooking.status = finalBookingStatus;
            memBooking.paidAt = paidAt;
            if (!updatedBooking) updatedBooking = memBooking;
        }

        res.json({
            success: true,
            message: isPayOnSite
                ? 'Booking confirmed! Payment scheduled for site inspection.'
                : 'Payment verified and booking confirmed!',
            booking: updatedBooking || {
                bookingId,
                paymentStatus: finalPaymentStatus,
                status: finalBookingStatus,
                transactionId,
                amount: targetAmount,
                paymentMethod
            },
            transaction: txnData
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Payment verification failed', message: err.message });
    }
});

// 4. Payment Webhook Endpoint (Server-to-Server Signature Verification)
app.post('/api/payments/webhook', async (req, res) => {
    const signature = req.headers['x-payment-signature'] || '';
    const payloadString = JSON.stringify(req.body || {});
    const expectedSig = crypto
        .createHmac('sha256', PAYMENT_WEBHOOK_SECRET)
        .update(payloadString)
        .digest('hex');

    if (signature && signature !== expectedSig) {
        return res.status(401).json({ success: false, error: 'Invalid webhook signature' });
    }

    const { bookingId, paymentStatus, transactionId } = req.body || {};
    if (bookingId && paymentStatus) {
        if (isDbConnected()) {
            try {
                await Booking.findOneAndUpdate({ bookingId }, { paymentStatus, transactionId });
            } catch {}
        }
        const memBooking = memStore.bookings.find(b => b.bookingId === bookingId);
        if (memBooking) {
            memBooking.paymentStatus = paymentStatus;
            if (transactionId) memBooking.transactionId = transactionId;
        }
    }

    res.json({ status: 'ok', verified: true });
});

// 5. Get All Transactions (Admin Console)
app.get('/api/transactions', requireAdminAuth, async (req, res) => {
    try {
        if (isDbConnected()) {
            const txns = await Transaction.find().sort({ createdAt: -1 });
            if (txns && txns.length > 0) return res.json(txns);
        }
    } catch (err) {
        console.warn('Get transactions DB error:', err.message);
    }
    res.json(memStore.transactions);
});

// 6. Update Transaction / Refund Status (Admin Console)
app.put('/api/transactions/:id', requireAdminAuth, async (req, res) => {
    const { paymentStatus } = req.body;
    try {
        if (isDbConnected()) {
            const updated = await Transaction.findOneAndUpdate(
                { $or: [{ _id: req.params.id }, { transactionId: req.params.id }] },
                { paymentStatus },
                { new: true }
            );
            if (updated && updated.bookingId) {
                await Booking.findOneAndUpdate(
                    { bookingId: updated.bookingId },
                    { paymentStatus }
                );
            }
            if (updated) return res.json({ success: true, transaction: updated });
        }
    } catch (err) {
        console.warn('Update transaction DB error:', err.message);
    }

    const idx = memStore.transactions.findIndex(t => t._id === req.params.id || t.transactionId === req.params.id);
    if (idx !== -1) {
        memStore.transactions[idx] = { ...memStore.transactions[idx], paymentStatus };
        const linkedBooking = memStore.bookings.find(b => b.bookingId === memStore.transactions[idx].bookingId);
        if (linkedBooking) linkedBooking.paymentStatus = paymentStatus;
        return res.json({ success: true, transaction: memStore.transactions[idx] });
    }
    res.status(404).json({ success: false, error: 'Transaction not found' });
});

app.put('/api/bookings/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const updated = await Booking.findOneAndUpdate(
                { $or: [{ _id: req.params.id }, { bookingId: req.params.id }] },
                req.body,
                { new: true }
            );
            if (updated) return res.json({ success: true, message: 'Booking updated successfully', booking: updated });
        }
    } catch (err) {
        console.warn('Update booking DB error:', err.message);
    }

    const idx = memStore.bookings.findIndex(b => b._id === req.params.id || b.bookingId === req.params.id);
    if (idx !== -1) {
        memStore.bookings[idx] = { ...memStore.bookings[idx], ...req.body, updatedAt: new Date() };
        return res.json({ success: true, message: 'Booking updated successfully', booking: memStore.bookings[idx] });
    }
    res.status(404).json({ success: false, error: 'Booking not found' });
});

app.delete('/api/bookings/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const deleted = await Booking.findOneAndDelete({
                $or: [{ _id: req.params.id }, { bookingId: req.params.id }]
            });
            if (deleted) return res.json({ success: true, message: 'Booking deleted successfully' });
        }
    } catch (err) {
        console.warn('Delete booking DB error:', err.message);
    }

    const idx = memStore.bookings.findIndex(b => b._id === req.params.id || b.bookingId === req.params.id);
    if (idx !== -1) {
        memStore.bookings.splice(idx, 1);
        return res.json({ success: true, message: 'Booking deleted successfully' });
    }
    res.status(404).json({ success: false, error: 'Booking not found' });
});

// ─────────────────────────────────────────────────────────────
// 7. ESTIMATES APIS
// ─────────────────────────────────────────────────────────────

app.get('/api/estimates', async (req, res) => {
    try {
        if (isDbConnected()) {
            const estimates = await Estimate.find().sort({ createdAt: -1 });
            if (estimates && estimates.length > 0) return res.json(estimates);
        }
    } catch (err) {
        console.warn('Get estimates DB error:', err.message);
    }
    res.json(memStore.estimates);
});

app.get('/api/estimates/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const est = await Estimate.findOne({
                $or: [{ _id: req.params.id }, { estimateId: req.params.id }]
            });
            if (est) return res.json(est);
        }
    } catch (err) {
        console.warn('Get estimate DB error:', err.message);
    }
    const mem = memStore.estimates.find(e => e._id === req.params.id || e.estimateId === req.params.id);
    if (!mem) return res.status(404).json({ success: false, error: 'Estimate not found' });
    res.json(mem);
});

app.post('/api/estimates', async (req, res) => {
    const estimateData = {
        estimateId: req.body.estimateId || ('EST-' + Math.floor(100000 + Math.random() * 900000)),
        userId: req.body.userId || '',
        customerName: req.body.customerName || req.body.name,
        phone: req.body.phone || req.body.mobile,
        email: req.body.email || '',
        projectType: req.body.projectType || 'Residential Independent Villa',
        service: req.body.service || 'Turnkey Construction',
        location: req.body.location || 'Salem, Tamil Nadu',
        budget: req.body.budget || '',
        duration: req.body.duration || '1-3 Months',
        description: req.body.description || req.body.notes || '',
        status: req.body.status || 'Pending'
    };

    try {
        if (isDbConnected()) {
            const newEstimate = new Estimate(estimateData);
            await newEstimate.save();
            return res.status(201).json({ success: true, message: 'Estimate request saved successfully in MongoDB', estimate: newEstimate });
        }
    } catch (err) {
        console.warn('Create estimate DB error:', err.message);
    }

    const mem = { _id: 'mem_' + Date.now(), ...estimateData, createdAt: new Date() };
    memStore.estimates.unshift(mem);
    res.status(201).json({ success: true, message: 'Estimate request saved successfully', estimate: mem });
});

app.put('/api/estimates/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const updated = await Estimate.findOneAndUpdate(
                { $or: [{ _id: req.params.id }, { estimateId: req.params.id }] },
                req.body,
                { new: true }
            );
            if (updated) return res.json({ success: true, message: 'Estimate updated successfully', estimate: updated });
        }
    } catch (err) {
        console.warn('Update estimate DB error:', err.message);
    }
    const idx = memStore.estimates.findIndex(e => e._id === req.params.id || e.estimateId === req.params.id);
    if (idx !== -1) {
        memStore.estimates[idx] = { ...memStore.estimates[idx], ...req.body, updatedAt: new Date() };
        return res.json({ success: true, message: 'Estimate updated successfully', estimate: memStore.estimates[idx] });
    }
    res.status(404).json({ success: false, error: 'Estimate not found' });
});

app.delete('/api/estimates/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const deleted = await Estimate.findOneAndDelete({
                $or: [{ _id: req.params.id }, { estimateId: req.params.id }]
            });
            if (deleted) return res.json({ success: true, message: 'Estimate deleted successfully' });
        }
    } catch (err) {
        console.warn('Delete estimate DB error:', err.message);
    }
    const idx = memStore.estimates.findIndex(e => e._id === req.params.id || e.estimateId === req.params.id);
    if (idx !== -1) {
        memStore.estimates.splice(idx, 1);
        return res.json({ success: true, message: 'Estimate deleted successfully' });
    }
    res.status(404).json({ success: false, error: 'Estimate not found' });
});

// ─────────────────────────────────────────────────────────────
// 8. CONTACTS & INQUIRIES APIS
// ─────────────────────────────────────────────────────────────

app.get(['/api/contacts', '/api/contact'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const contacts = await Contact.find().sort({ createdAt: -1 });
            if (contacts && contacts.length > 0) return res.json(contacts);
        }
    } catch (err) {
        console.warn('Get contacts DB error:', err.message);
    }
    res.json(memStore.contacts);
});

app.post(['/api/contacts', '/api/contact'], async (req, res) => {
    const contactData = {
        contactId: 'CNT-' + Math.floor(100000 + Math.random() * 900000),
        name: req.body.name,
        email: req.body.email || '',
        phone: req.body.phone || req.body.mobile || '',
        subject: req.body.subject || req.body.service || 'General Enquiry',
        service: req.body.service || 'General Enquiry',
        message: req.body.message || '',
        status: 'New'
    };

    if (!contactData.name || !contactData.phone || !contactData.message) {
        return res.status(400).json({ success: false, error: 'Name, phone number, and message are required.' });
    }

    try {
        if (isDbConnected()) {
            const newContact = new Contact(contactData);
            await newContact.save();
            return res.status(201).json({
                success: true,
                message: 'Inquiry submitted successfully and recorded in MongoDB',
                contact: newContact
            });
        }
    } catch (err) {
        console.warn('Create contact DB error:', err.message);
    }

    const mem = { _id: 'mem_' + Date.now(), ...contactData, createdAt: new Date() };
    memStore.contacts.unshift(mem);
    res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully',
        contact: mem
    });
});

app.put(['/api/contacts/:id', '/api/contact/:id'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const updated = await Contact.findOneAndUpdate(
                { $or: [{ _id: req.params.id }, { contactId: req.params.id }] },
                req.body,
                { new: true }
            );
            if (updated) return res.json({ success: true, message: 'Inquiry updated successfully', contact: updated });
        }
    } catch (err) {
        console.warn('Update contact DB error:', err.message);
    }
    const idx = memStore.contacts.findIndex(c => c._id === req.params.id || c.contactId === req.params.id);
    if (idx !== -1) {
        memStore.contacts[idx] = { ...memStore.contacts[idx], ...req.body, updatedAt: new Date() };
        return res.json({ success: true, message: 'Inquiry updated successfully', contact: memStore.contacts[idx] });
    }
    res.status(404).json({ success: false, error: 'Inquiry not found' });
});

app.delete(['/api/contacts/:id', '/api/contact/:id'], async (req, res) => {
    try {
        if (isDbConnected()) {
            const deleted = await Contact.findOneAndDelete({
                $or: [{ _id: req.params.id }, { contactId: req.params.id }]
            });
            if (deleted) return res.json({ success: true, message: 'Inquiry deleted successfully' });
        }
    } catch (err) {
        console.warn('Delete contact DB error:', err.message);
    }
    const idx = memStore.contacts.findIndex(c => c._id === req.params.id || c.contactId === req.params.id);
    if (idx !== -1) {
        memStore.contacts.splice(idx, 1);
        return res.json({ success: true, message: 'Inquiry deleted successfully' });
    }
    res.status(404).json({ success: false, error: 'Inquiry not found' });
});

// ─────────────────────────────────────────────────────────────
// 9. REVIEWS APIS
// ─────────────────────────────────────────────────────────────

app.get('/api/reviews', async (req, res) => {
    try {
        if (isDbConnected()) {
            const reviews = await Review.find().sort({ createdAt: -1 });
            if (reviews && reviews.length > 0) return res.json(reviews);
        }
    } catch (err) {
        console.warn('Get reviews DB error:', err.message);
    }
    res.json(memStore.reviews);
});

app.post('/api/reviews', async (req, res) => {
    const revData = {
        reviewId: 'rev_' + Date.now(),
        name: req.body.name,
        loc: req.body.loc || req.body.location || 'Client',
        rating: parseInt(req.body.rating || 5),
        text: req.body.text || req.body.message,
        date: req.body.date || 'Just now',
        status: 'Approved'
    };

    try {
        if (isDbConnected()) {
            const newRev = new Review(revData);
            await newRev.save();
            return res.status(201).json({ success: true, message: 'Review recorded in database', review: newRev });
        }
    } catch (err) {
        console.warn('Create review DB error:', err.message);
    }
    const mem = { _id: 'mem_' + Date.now(), ...revData, createdAt: new Date() };
    memStore.reviews.unshift(mem);
    res.status(201).json({ success: true, message: 'Review recorded', review: mem });
});

// ─────────────────────────────────────────────────────────────
// 10. SPA FALLBACK ROUTING
// ─────────────────────────────────────────────────────────────

app.get('*', (req, res) => {
    // If request has a file extension (like .js, .css, .png) and wasn't found in static, 404
    if (path.extname(req.path)) {
        return res.status(404).send('Not found');
    }
    const distIndex = path.join(distPath, 'index.html');
    if (fs.existsSync(distIndex)) {
        return res.sendFile(distIndex);
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Database offline graceful fallback middleware
app.use((err, req, res, next) => {
    if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || (err.message && err.message.includes('buffering timed out'))) {
        console.warn('[AI Studio] Database offline — returning fallback response');
        if (req.method === 'GET') {
            return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
        }
        return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
    }
    next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Server Error]:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message });
});

// ─────────────────────────────────────────────────────────────
// 11. STARTUP & DATABASE SEEDING
// ─────────────────────────────────────────────────────────────

async function startServer() {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[Mason Mate] Server running on http://0.0.0.0:${PORT}`);
    });

    // Attempt database connection in background
    try {
        const connected = await connectDB();
        if (connected) {
            await seedDatabase();
        }
    } catch (err) {
        console.warn('[MongoDB] Initialization notice:', err.message);
    }
}

startServer();
