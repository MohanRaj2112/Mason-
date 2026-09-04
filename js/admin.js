// ── MASON MATE – ADMIN CONTROL PANEL SCRIPT ── //

let adminBookings = [];
let adminProducts = [];
let adminCustomers = [];
let adminReviews = [];

document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
});

async function initAdmin() {
    renderDefaultStats();
    await Promise.allSettled([
        loadBookings(),
        loadProducts(),
        loadCustomers(),
        loadReviews()
    ]);
    renderStats();
}

function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

function showPage(pageName, btnEl) {
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) targetPage.classList.add('active');

    if (btnEl) {
        btnEl.classList.add('active');
    } else {
        const matchingBtn = document.querySelector(`.sidebar-link[onclick*="'${pageName}'"]`);
        if (matchingBtn) matchingBtn.classList.add('active');
    }

    const titleEl = document.getElementById('pageTitle');
    const titles = {
        overview: '📊 Management Overview',
        bookings: '📅 Site Service Bookings',
        products: '🔨 Tools & Equipment Inventory Catalog',
        customers: '👥 Registered Customers',
        reviews: '⭐ Client Reviews Management'
    };
    if (titleEl) titleEl.textContent = titles[pageName] || 'Admin Dashboard';

    // Close sidebar on mobile
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

// ── STATS CARDS ── //

function renderDefaultStats() {
    const container = document.getElementById('statsCards');
    if (!container) return;

    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-card-icon">📅</div>
            <div>
                <div style="font-size:1.8rem;font-weight:800;color:var(--primary)" id="stBookings">0</div>
                <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700">Total Bookings</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon">⏳</div>
            <div>
                <div style="font-size:1.8rem;font-weight:800;color:var(--accent)" id="stPending">0</div>
                <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700">Pending Actions</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon">🔨</div>
            <div>
                <div style="font-size:1.8rem;font-weight:800;color:var(--primary)" id="stProducts">8</div>
                <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700">Active Tools in Catalog</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon">👥</div>
            <div>
                <div style="font-size:1.8rem;font-weight:800;color:var(--primary)" id="stCustomers">0</div>
                <div style="font-size:0.8rem;color:var(--text-muted);font-weight:700">Total Clients</div>
            </div>
        </div>
    `;
}

function renderStats() {
    const totalBookings = adminBookings.length;
    const pending = adminBookings.filter(b => (b.status || 'Pending').toLowerCase() === 'pending').length;
    const totalProducts = adminProducts.length;
    const totalCust = adminCustomers.length;

    const bEl = document.getElementById('stBookings');
    const pEl = document.getElementById('stPending');
    const prEl = document.getElementById('stProducts');
    const cEl = document.getElementById('stCustomers');
    const pendingBadge = document.getElementById('pendingCount');

    if (bEl) bEl.textContent = totalBookings;
    if (pEl) pEl.textContent = pending;
    if (prEl) prEl.textContent = totalProducts;
    if (cEl) cEl.textContent = totalCust;
    if (pendingBadge) pendingBadge.textContent = pending;
}

// ── BOOKINGS MANAGEMENT ── //

async function loadBookings() {
    try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
            adminBookings = await res.json();
        }
    } catch {
        console.warn('Using local fallback for bookings');
    }

    if (!Array.isArray(adminBookings) || adminBookings.length === 0) {
        try {
            adminBookings = JSON.parse(localStorage.getItem('cp_my_bookings') || '[]');
        } catch {}
    }

    if (adminBookings.length === 0) {
        adminBookings = [
            {
                bookingId: 'MM-883921',
                customerName: 'Santhosh Kumar',
                phone: '+91 9159687408',
                email: 'santhosh@example.com',
                service: 'Turnkey House Construction',
                startDate: '2026-08-20',
                workers: 4,
                paymentMode: 'UPI',
                amount: 107940,
                status: 'Confirmed'
            },
            {
                bookingId: 'MM-491024',
                customerName: 'Priya Rajan',
                phone: '+91 9840123456',
                email: 'priya.r@gmail.com',
                service: 'Renovation & Remodeling',
                startDate: '2026-08-25',
                workers: 2,
                paymentMode: 'Card',
                amount: 99875,
                status: 'Pending'
            },
            {
                bookingId: 'MM-310948',
                customerName: 'Karthik Raja',
                phone: '+91 9443210987',
                email: 'karthik.raja@outlook.com',
                service: 'Tool & Equipment Rental',
                startDate: '2026-08-18',
                workers: 1,
                paymentMode: 'Cash on Visit',
                amount: 1500,
                status: 'In Progress'
            }
        ];
    }

    renderRecentBookings();
    renderBookings();
}

function renderRecentBookings() {
    const tbody = document.getElementById('recentBookingsBody');
    if (!tbody) return;

    if (adminBookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:36px;color:var(--text-muted)">No recent site bookings found.</td></tr>`;
        return;
    }

    const recents = adminBookings.slice(0, 5);
    tbody.innerHTML = recents.map(b => {
        const st = b.status || 'Pending';
        const stClass = st.toLowerCase().replace(' ', '-');
        return `
            <tr>
                <td><strong>${escapeHtml(b.bookingId || 'MM-XXXX')}</strong></td>
                <td>
                    <div style="font-weight:700">${escapeHtml(b.customerName || 'Client')}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted)">${escapeHtml(b.phone || '—')}</div>
                </td>
                <td>${escapeHtml(b.service || 'House Construction')}</td>
                <td>${escapeHtml(b.startDate || '—')}</td>
                <td>
                    <span class="status-pill status-${stClass}">${escapeHtml(st)}</span>
                </td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewBooking('${b.bookingId}')">Inspect</button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderBookings() {
    const tbody = document.getElementById('allBookingsBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('bookingSearch')?.value || '').toLowerCase().trim();
    const filterStatus = document.getElementById('bookingFilter')?.value || 'all';

    const filtered = adminBookings.filter(b => {
        const matchSearch = !searchTerm || 
            (b.bookingId && b.bookingId.toLowerCase().includes(searchTerm)) ||
            (b.customerName && b.customerName.toLowerCase().includes(searchTerm)) ||
            (b.phone && b.phone.toLowerCase().includes(searchTerm)) ||
            (b.service && b.service.toLowerCase().includes(searchTerm));
        const matchStatus = filterStatus === 'all' || (b.status || 'Pending').toLowerCase() === filterStatus.toLowerCase();
        return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:48px;color:var(--text-muted)">No matching bookings found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(b => {
        const st = b.status || 'Pending';
        const stClass = st.toLowerCase().replace(' ', '-');
        return `
            <tr>
                <td><strong>${escapeHtml(b.bookingId || 'MM-XXXX')}</strong></td>
                <td>${escapeHtml(b.customerName || 'Client')}</td>
                <td>${escapeHtml(b.phone || '—')}</td>
                <td>${escapeHtml(b.service || 'House Construction')}</td>
                <td>${escapeHtml(b.startDate || '—')}</td>
                <td>${b.workers || 1} Worker(s)</td>
                <td>
                    <div>${escapeHtml(b.paymentMode || 'UPI')}</div>
                    <div style="font-weight:700;color:var(--accent)">₹${(b.amount || 0).toLocaleString('en-IN')}</div>
                </td>
                <td>
                    <select class="form-control" style="font-size:0.8rem;padding:4px 8px;width:auto;" onchange="updateBookingStatus('${b.bookingId}', this.value)">
                        <option value="Pending" ${st === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Confirmed" ${st === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="In Progress" ${st === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${st === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${st === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewBooking('${b.bookingId}')">Inspect</button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewBooking(bookingId) {
    const booking = adminBookings.find(b => b.bookingId === bookingId);
    if (!booking) return;

    const content = document.getElementById('bookingDetailContent');
    if (!content) return;

    content.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid var(--border-light)">
            <div>
                <span class="section-eyebrow">BOOKING DOSSIER</span>
                <h3 style="font-size:1.4rem;color:var(--primary)">${escapeHtml(booking.bookingId)}</h3>
            </div>
            <span class="status-pill status-${(booking.status || 'Pending').toLowerCase().replace(' ','-')}">${escapeHtml(booking.status || 'Pending')}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
            <div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Customer Name</div>
                <strong style="color:var(--primary)">${escapeHtml(booking.customerName || '—')}</strong>
            </div>
            <div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Phone Number</div>
                <strong style="color:var(--primary)"><a href="tel:${booking.phone}">${escapeHtml(booking.phone || '—')}</a></strong>
            </div>
            <div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Email Address</div>
                <div>${escapeHtml(booking.email || '—')}</div>
            </div>
            <div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Service Selected</div>
                <strong style="color:var(--accent)">${escapeHtml(booking.service || '—')}</strong>
            </div>
            <div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Scheduled Start Date</div>
                <div>${escapeHtml(booking.startDate || '—')}</div>
            </div>
            <div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Workers Assigned</div>
                <div>${booking.workers || 1} Masons/Workers</div>
            </div>
            <div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Payment Mode</div>
                <div>${escapeHtml(booking.paymentMode || 'UPI')}</div>
            </div>
            <div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Advance Amount</div>
                <strong style="font-size:1.1rem;color:var(--primary)">₹${(booking.amount || 0).toLocaleString('en-IN')}</strong>
            </div>
        </div>
        <div class="flex gap-12" style="justify-content:flex-end">
            <button class="btn btn-outline" onclick="closeModal('bookingDetailModal')">Close</button>
            <button class="btn btn-accent" onclick="openWhatsApp('Hello ${encodeURIComponent(booking.customerName || 'Client')}, confirming your Mason Mate booking ref: ${booking.bookingId}')">💬 Contact on WhatsApp</button>
        </div>
    `;

    openModal('bookingDetailModal');
}

async function updateBookingStatus(bookingId, newStatus) {
    const booking = adminBookings.find(b => b.bookingId === bookingId);
    if (booking) {
        booking.status = newStatus;
        showToast(`Booking ${bookingId} status changed to ${newStatus}`, 'success');
        renderStats();
        renderRecentBookings();
        renderBookings();

        try {
            await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch {}
    }
}

function exportBookings() {
    if (adminBookings.length === 0) {
        showToast('No bookings available to export.', 'error');
        return;
    }

    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Email', 'Service', 'Start Date', 'Workers', 'Payment Mode', 'Amount', 'Status'];
    const rows = adminBookings.map(b => [
        `"${b.bookingId || ''}"`,
        `"${b.customerName || ''}"`,
        `"${b.phone || ''}"`,
        `"${b.email || ''}"`,
        `"${b.service || ''}"`,
        `"${b.startDate || ''}"`,
        b.workers || 1,
        `"${b.paymentMode || ''}"`,
        b.amount || 0,
        `"${b.status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mason_mate_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Bookings exported to CSV! 📥', 'success');
}

// ── PRODUCTS & TOOLS CATALOG ── //

async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        if (res.ok) {
            adminProducts = await res.json();
        }
    } catch {}

    if (!Array.isArray(adminProducts) || adminProducts.length === 0) {
        try {
            const cached = JSON.parse(sessionStorage.getItem('mm_cached_products') || 'null');
            if (cached && Array.isArray(cached) && cached.length > 0) {
                adminProducts = cached;
            }
        } catch {}
    }

    if (!adminProducts || adminProducts.length === 0) {
        adminProducts = [
            { _id: 'p1', name: 'Heavy-Duty Rotary Hammer Drill', category: 'power-tools', price: 450, icon: '🔨', available: true },
            { _id: 'p2', name: 'Commercial Cement Mixer Drum (200L)', category: 'mixing', price: 850, icon: '🪣', available: true },
            { _id: 'p3', name: 'Heavy Steel Scaffolding Set', category: 'roofing', price: 600, icon: '🏗️', available: true },
            { _id: 'p4', name: 'Vibratory Concrete Needle Compactor', category: 'power-tools', price: 500, icon: '⚡', available: true },
            { _id: 'p5', name: 'Safety Helmet & Full Body Harness Kit', category: 'safety', price: 150, icon: '🦺', available: true },
            { _id: 'p6', name: 'High Pressure Hydraulic Pipe Bender', category: 'plumbing', price: 350, icon: '🔧', available: true }
        ];
    }

    renderAdminProducts();
}

function renderAdminProducts() {
    const grid = document.getElementById('adminProductGrid');
    if (!grid) return;

    if (adminProducts.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted)">No tools in inventory.</div>`;
        return;
    }

    grid.innerHTML = adminProducts.map(p => {
        return `
            <div class="card" style="display:flex;flex-direction:column;justify-content:space-between">
                <div>
                    <div style="font-size:2.2rem;margin-bottom:12px">${p.icon || '🔨'}</div>
                    <h4 style="font-size:1.05rem;color:var(--primary);margin-bottom:6px">${escapeHtml(p.name)}</h4>
                    <span style="font-size:0.8rem;text-transform:uppercase;color:var(--text-muted);font-weight:700">${escapeHtml(p.category || 'Tool')}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:12px;border-top:1px solid var(--border-light)">
                    <span style="font-size:1.1rem;font-weight:800;color:var(--accent)">₹${(p.price || 0).toLocaleString('en-IN')}/day</span>
                    <button class="btn btn-outline btn-sm" onclick="deleteProduct('${p._id}')" style="color:#DC2626;border-color:rgba(220,38,38,0.3)">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

async function addProduct() {
    const name = document.getElementById('apName')?.value.trim();
    const category = document.getElementById('apCat')?.value || 'power-tools';
    const price = parseInt(document.getElementById('apPrice')?.value || '0');
    const icon = document.getElementById('apIcon')?.value.trim() || '🔨';

    if (!name || !price) {
        showToast('Please enter tool name and rental price', 'error');
        return;
    }

    const newProd = {
        _id: 'tool_' + Date.now(),
        name,
        category,
        price,
        period: 'Per Day',
        icon,
        available: true,
        availabilityStatus: 'Available',
        contactOption: 'Site Delivery'
    };

    adminProducts.unshift(newProd);
    closeModal('addProductModal');
    document.getElementById('apName').value = '';
    document.getElementById('apPrice').value = '';

    renderAdminProducts();
    renderStats();
    showToast(`Added ${name} to inventory!`, 'success');

    try {
        sessionStorage.setItem('mm_cached_products', JSON.stringify(adminProducts));
        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProd)
        });
    } catch {}
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to remove this tool from the rental catalog?')) return;

    adminProducts = adminProducts.filter(p => p._id !== productId);
    renderAdminProducts();
    renderStats();
    showToast('Equipment removed from inventory.', 'success');

    try {
        sessionStorage.setItem('mm_cached_products', JSON.stringify(adminProducts));
        await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    } catch {}
}

// ── CUSTOMERS MANAGEMENT ── //

async function loadCustomers() {
    try {
        const res = await fetch('/api/customers');
        if (res.ok) {
            adminCustomers = await res.json();
        }
    } catch {}

    if (!Array.isArray(adminCustomers) || adminCustomers.length === 0) {
        adminCustomers = [
            { name: 'Santhosh Kumar', phone: '+91 9159687408', email: 'santhosh@example.com', joinedDate: '2026-07-10' },
            { name: 'Priya Rajan', phone: '+91 9840123456', email: 'priya.r@gmail.com', joinedDate: '2026-07-22' },
            { name: 'Karthik Raja', phone: '+91 9443210987', email: 'karthik.raja@outlook.com', joinedDate: '2026-08-01' },
            { name: 'Anand Sundaram', phone: '+91 9789012345', email: 'anand.s@yahoo.com', joinedDate: '2026-08-05' }
        ];
    }

    renderCustomers();
}

function renderCustomers() {
    const tbody = document.getElementById('customersBody');
    if (!tbody) return;

    if (adminCustomers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:48px;color:var(--text-muted)">No registered clients found.</td></tr>`;
        return;
    }

    tbody.innerHTML = adminCustomers.map(c => `
        <tr>
            <td><strong>${escapeHtml(c.name || c.username || 'Client')}</strong></td>
            <td><a href="tel:${c.phone}">${escapeHtml(c.phone || '—')}</a></td>
            <td>${escapeHtml(c.email || '—')}</td>
            <td>${escapeHtml(c.joinedDate || '2026-08-01')}</td>
        </tr>
    `).join('');
}

// ── REVIEWS MANAGEMENT ── //

async function loadReviews() {
    try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
            adminReviews = await res.json();
        }
    } catch {}

    if (!Array.isArray(adminReviews) || adminReviews.length === 0) {
        adminReviews = [
            { _id: 'r1', author: 'Ramesh V., Villa Owner', rating: 5, comment: 'Mason Mate built our 2400 sq.ft duplex in Erode on time with top-grade TMT steel and flawless brick alignments.', date: '2026-07-15' },
            { _id: 'r2', author: 'Dr. Meenakshi, Coimbatore', rating: 5, comment: 'Hired 4 master masons for our clinic expansion. Exceptional workmanship and zero material wastage.', date: '2026-07-28' },
            { _id: 'r3', author: 'Murugan Builders', rating: 5, comment: 'Rented concrete mixers and needle vibrators for 3 months. Fast site delivery and dependable machinery.', date: '2026-08-08' }
        ];
    }

    renderReviews();
}

function renderReviews() {
    const grid = document.getElementById('adminReviewsGrid');
    if (!grid) return;

    grid.innerHTML = adminReviews.map(r => `
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between">
            <div>
                <div style="color:#F59E0B;font-size:1.1rem;margin-bottom:8px">${'★'.repeat(r.rating || 5)}</div>
                <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:16px;line-height:1.5">"${escapeHtml(r.comment)}"</p>
                <strong>${escapeHtml(r.author)}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid var(--border-light)">
                <span style="font-size:0.75rem;color:var(--text-muted)">${escapeHtml(r.date || 'Recent')}</span>
                <button class="btn btn-outline btn-sm" onclick="deleteReview('${r._id}')" style="color:#DC2626;border-color:rgba(220,38,38,0.3)">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteReview(id) {
    if (!confirm('Are you sure you want to remove this client review?')) return;
    adminReviews = adminReviews.filter(r => r._id !== id);
    renderReviews();
    showToast('Review removed.', 'success');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m];
    });
}
