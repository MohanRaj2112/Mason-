require('dotenv').config({ path: require('path').join(__dirname, '.env') });
<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { connectDB, isDbConnected } = require('./server/db');
const { seedDatabase, initialServices, initialProjects, initialTools, initialBookings, initialContacts, initialEstimates, initialReviews } = require('./server/seed');

const User = require('./server/models/User');
const Admin = require('./server/models/Admin');
const Service = require('./server/models/Service');
const Project = require('./server/models/Project');
const Tool = require('./server/models/Tool');
const Booking = require('./server/models/Booking');
const Estimate = require('./server/models/Estimate');
const Contact = require('./server/models/Contact');
const Review = require('./server/models/Review');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mason_mate_super_secret_jwt_key_2026';

// In-Memory Fallback store in case database is temporarily disconnected
const memStore = {
    users: [],
    admins: [],
    services: [...initialServices],
    projects: [...initialProjects],
    tools: [...initialTools],
    bookings: [...initialBookings],
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
=======
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// Serve static assets from dist
const distPath = path.join(__dirname, 'dist');
=======
// Serve static files (React dist build if present, or root static files)
const distPath = path.join(__dirname, "dist");
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}
app.use(express.static(__dirname));

<<<<<<< HEAD
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
    const amountVal = parseFloat(req.body.amount || req.body.estimatedAmount || 2500);
    const bookingData = {
        bookingId: req.body.bookingId || ('MM-' + Math.floor(100000 + Math.random() * 900000)),
        userId: req.body.userId || '',
        customerName: req.body.customerName || req.body.name || 'Customer',
        phone: req.body.phone || req.body.mobile || '',
        email: req.body.email || '',
        bookingType: req.body.bookingType || req.body.type || 'construction',
        service: req.body.service || 'Turnkey House Construction',
        tool: req.body.tool || '',
        startDate: req.body.startDate || new Date().toISOString().split('T')[0],
        duration: req.body.duration || '1 Month',
        location: req.body.location || 'Salem, Tamil Nadu',
        workers: parseInt(req.body.workers || 1),
        paymentMode: req.body.paymentMode || 'Cash on Visit',
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
                booking: newBooking
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
        booking: mem
    });
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

=======
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
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
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
<<<<<<< HEAD
    console.error('[Server Error]:', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message });
});

// ─────────────────────────────────────────────────────────────
// 11. STARTUP & DATABASE SEEDING
// ─────────────────────────────────────────────────────────────

async function startServer() {
    // Attempt database connection
    const connected = await connectDB();
    if (connected) {
        await seedDatabase();
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[Mason Mate] Server running on http://0.0.0.0:${PORT}`);
    });
}

startServer();
=======
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SRM AKASH CONSTRUCTION server running on http://0.0.0.0:${PORT}`);
});
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
