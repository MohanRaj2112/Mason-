// ── MASON MATE – PRODUCTS & TOOLS RENTAL ENGINE (HIGH PERFORMANCE) ── //

let productsList = [
    {
        _id: 'p1',
        name: 'Heavy-Duty Rotary Hammer Drill (800W)',
        category: 'power-tools',
        price: 450,
        period: 'Per Day',
        description: 'High performance SDS-Plus rotary hammer drill for concrete demolition, chiseling, and core drilling.',
        icon: '🔨',
        imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=75&w=600&auto=format&fit=crop',
        available: true,
        availabilityStatus: 'Available',
        contactOption: 'Immediate Dispatch',
        badge: 'Popular'
    },
    {
        _id: 'p2',
        name: 'Commercial Cement Mixer Drum (200L)',
        category: 'mixing',
        price: 850,
        period: 'Per Day',
        description: 'Heavy diesel/electric driven drum mixer for smooth batching, plastering mortar, and site slab pours.',
        icon: '🪣',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=75&w=600&auto=format&fit=crop',
        available: true,
        availabilityStatus: 'Available',
        contactOption: 'Site Delivery',
        badge: 'High Demand'
    },
    {
        _id: 'p3',
        name: 'Heavy Steel Scaffolding Set (50 Sq.Ft)',
        category: 'roofing',
        price: 600,
        period: 'Per Day',
        description: 'Heavy-gauge modular scaffolding frames with cross-braces, base plates, and safety locking pins.',
        icon: '🏗️',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?q=75&w=600&auto=format&fit=crop',
        available: true,
        availabilityStatus: 'Available',
        contactOption: 'On-Site Delivery',
        badge: ''
    },
    {
        _id: 'p4',
        name: 'Vibratory Concrete Needle Compactor',
        category: 'power-tools',
        price: 500,
        period: 'Per Day',
        description: 'Gasoline needle vibrator for flawless air-pocket removal and ultra-dense RCC column/slab pouring.',
        icon: '⚡',
        imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=75&w=600&auto=format&fit=crop',
        available: true,
        availabilityStatus: 'Available',
        contactOption: 'Immediate Dispatch',
        badge: ''
    },
    {
        _id: 'p5',
        name: 'Safety Helmet & Full Body Harness Kit',
        category: 'safety',
        price: 150,
        period: 'Per Day',
        description: 'ISI certified heavy duty head protection and full body fall arrest safety belt with double lanyard.',
        icon: '🦺',
        imageUrl: 'https://images.unsplash.com/photo-1535732820275-9ffd99922673?q=75&w=600&auto=format&fit=crop',
        available: true,
        availabilityStatus: 'Available',
        contactOption: 'Immediate Dispatch',
        badge: 'Essential'
    },
    {
        _id: 'p6',
        name: 'High Pressure Hydraulic Pipe Bender',
        category: 'plumbing',
        price: 350,
        period: 'Per Day',
        description: 'Precision hydraulic bender for up to 2-inch GI, SS and conduit piping without pipe crimping.',
        icon: '🔧',
        imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=75&w=600&auto=format&fit=crop',
        available: true,
        availabilityStatus: 'Available',
        contactOption: 'Immediate Dispatch',
        badge: ''
    },
    {
        _id: 'p7',
        name: 'Dual Flush Portable Sanitary Commode Unit',
        category: 'sanitary',
        price: 300,
        period: 'Per Day',
        description: 'Self-contained temporary hygienic sanitary restroom unit with water reservoir for construction staff.',
        icon: '🚿',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=75&w=600&auto=format&fit=crop',
        available: true,
        availabilityStatus: 'Available',
        contactOption: 'Site Delivery',
        badge: ''
    },
    {
        _id: 'p8',
        name: 'Precision Marble & Tile Cutting Machine',
        category: 'power-tools',
        price: 400,
        period: 'Per Day',
        description: '4-inch high-precision diamond blade water-cooled cutter for vitrified tiles, granite, and marble slabs.',
        icon: '🪚',
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?q=75&w=600&auto=format&fit=crop',
        available: true,
        availabilityStatus: 'Available',
        contactOption: 'Immediate Dispatch',
        badge: ''
    }
];

let cart = [];
let activeCategory = 'all';
let currentUploadedImageData = '';
let searchDebounceTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    initCachedProducts();
    fetchProducts();
    initFilters();
    updateCartBadges();
});

// Instant 0ms Initial Catalog Display
function initCachedProducts() {
    try {
        const localCustom = JSON.parse(localStorage.getItem('mm_custom_tools') || '[]');
        const cached = JSON.parse(sessionStorage.getItem('mm_cached_products') || 'null');
        if (cached && Array.isArray(cached) && cached.length > 0) {
            productsList = cached;
        } else if (localCustom.length > 0) {
            const merged = [...localCustom];
            productsList.forEach(p => {
                if (!merged.some(m => m._id === p._id || m.name === p.name)) {
                    merged.push(p);
                }
            });
            productsList = merged;
        }
    } catch {}
    renderProducts();
}

// Background API synchronization
async function fetchProducts() {
    try {
        const res = await fetch('/api/products');
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                const localCustom = JSON.parse(localStorage.getItem('mm_custom_tools') || '[]');
                const merged = [...localCustom];
                data.forEach(p => {
                    if (!merged.some(m => m._id === p._id || m.name === p.name)) {
                        merged.push(p);
                    }
                });
                if (merged.length > 0) {
                    productsList = merged;
                    try {
                        sessionStorage.setItem('mm_cached_products', JSON.stringify(productsList));
                    } catch {}
                }
                renderProducts();
            }
        }
    } catch (e) {
        console.warn('API sync using local memory state:', e);
    }
}

// Category filter tabs & search with 100ms debounce
function initFilters() {
    // Check URL parameters for initial category
    const params = new URLSearchParams(window.location.search);
    const urlCat = params.get('cat');
    if (urlCat) {
        activeCategory = urlCat;
        const targetBtn = document.querySelector(`.cat-btn[data-cat="${urlCat}"]`);
        if (targetBtn) {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
        }
    }

    const filterButtons = document.querySelectorAll('.cat-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-cat') || 'all';
            renderProducts();
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                renderProducts();
            }, 100);
        });
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            renderProducts();
        });
    }
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const countDisplay = document.getElementById('countDisplay');
    if (!grid) return;

    const searchInput = document.getElementById('searchInput');
    const searchTerm = (searchInput?.value || '').toLowerCase().trim();
    const sortVal = document.getElementById('sortSelect')?.value || 'default';

    let filtered = productsList.filter(p => {
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        const matchSearch = !searchTerm || 
            (p.name && p.name.toLowerCase().includes(searchTerm)) || 
            (p.description && p.description.toLowerCase().includes(searchTerm)) ||
            (p.category && p.category.toLowerCase().includes(searchTerm));
        return matchCat && matchSearch;
    });

    if (sortVal === 'price-asc') {
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortVal === 'price-desc') {
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortVal === 'name-asc') {
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    if (countDisplay) {
        countDisplay.textContent = filtered.length;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
                <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
                <h3 style="font-size: 1.3rem; color: var(--primary); margin-bottom: 8px;">No tools found</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Try adjusting your search query or category filter, or add a new tool to the catalog.</p>
                <button class="btn btn-accent btn-sm" onclick="openAddToolModal()">+ Add New Tool</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const status = p.availabilityStatus || (p.available !== false ? 'Available' : 'Maintenance');
        let statusClass = 'available';
        let statusText = 'Available';

        if (status === 'In Use') {
            statusClass = 'in-use';
            statusText = 'In Use';
        } else if (status === 'Maintenance') {
            statusClass = 'maintenance';
            statusText = 'Maintenance';
        }

        const categoryFormatted = formatCategory(p.category);
        const periodText = p.period ? `/${p.period.replace('Per ', '')}` : '/Day';
        const imageSrc = p.imageUrl || '';
        const fallbackIcon = p.icon || '🔨';

        return `
            <div class="tool-card" id="tool-${p._id}">
                <div class="tool-card-media">
                    ${p.badge ? `<span class="tool-badge-pill">${p.badge}</span>` : ''}
                    <span class="tool-avail-badge ${statusClass}">
                        <span class="tool-avail-dot"></span> ${statusText}
                    </span>
                    ${imageSrc ? `
                        <img src="${imageSrc}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                        <div class="tool-fallback-icon" style="display:none;">${fallbackIcon}</div>
                    ` : `
                        <div class="tool-fallback-icon">${fallbackIcon}</div>
                    `}
                </div>
                <div class="tool-card-body">
                    <div>
                        <div class="tool-category-label">${categoryFormatted}</div>
                        <h3 class="tool-title">${escapeHtml(p.name)}</h3>
                        <p class="tool-desc">${escapeHtml(p.description || 'Professional site-ready equipment with guaranteed calibration.')}</p>
                    </div>
                    <div>
                        <div class="tool-price-row">
                            <div>
                                <span class="tool-price-val">₹${(p.price || 0).toLocaleString('en-IN')}</span>
                                <span class="tool-price-period">${periodText}</span>
                            </div>
                            <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">
                                ${escapeHtml(p.contactOption || 'Site Delivery')}
                            </span>
                        </div>
                        <div class="tool-card-actions">
                            <button class="btn btn-primary btn-sm btn-full" onclick="addToCart('${p._id}', this)" ${statusClass === 'maintenance' ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}>
                                🛒 Rent Now
                            </button>
                            <a href="booking.html?type=tools&tool=${encodeURIComponent(p.name)}" class="btn btn-outline btn-sm" title="Quick Quote">
                                📅 Quote
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function formatCategory(cat) {
    if (!cat) return 'Equipment';
    const map = {
        'power-tools': '⚡ Power Tools',
        'mixing': '🪣 Mixing Equipment',
        'roofing': '🏗️ Scaffolding & Roofing',
        'plumbing': '🔧 Plumbing & Pipes',
        'safety': '🦺 Safety Gear',
        'sanitary': '🚿 Sanitary Units',
        'cutting': '🪚 Cutting & Grinding'
    };
    return map[cat] || cat.toUpperCase();
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

// ── ADD NEW TOOL MODAL & FORM HANDLERS ── //

function openAddToolModal() {
    const overlay = document.getElementById('addToolOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            document.getElementById('toolName')?.focus();
        });
    }
}

function closeAddToolModal() {
    const overlay = document.getElementById('addToolOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleImageFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 3 * 1024 * 1024) {
            showToast('Image size should be under 3MB', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
            currentUploadedImageData = evt.target.result;
            showImagePreview(currentUploadedImageData);
        };
        reader.readAsDataURL(file);
    }
}

function handleImageUrlInput(e) {
    const url = e.target.value.trim();
    if (url) {
        currentUploadedImageData = url;
        showImagePreview(url);
    }
}

function showImagePreview(src) {
    const placeholder = document.getElementById('previewPlaceholder');
    const img = document.getElementById('toolImagePreviewImg');
    if (placeholder && img) {
        placeholder.style.display = 'none';
        img.src = src;
        img.style.display = 'block';
    }
}

function resetAddToolForm() {
    const form = document.getElementById('addToolForm');
    if (form) form.reset();
    currentUploadedImageData = '';
    const placeholder = document.getElementById('previewPlaceholder');
    const img = document.getElementById('toolImagePreviewImg');
    if (placeholder && img) {
        placeholder.style.display = 'block';
        img.src = '';
        img.style.display = 'none';
    }
}

async function handleAddNewTool(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitToolBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Saving Tool...';
    }

    const name = document.getElementById('toolName')?.value.trim();
    const category = document.getElementById('toolCategory')?.value || 'power-tools';
    const period = document.getElementById('toolPeriod')?.value || 'Per Day';
    const price = parseInt(document.getElementById('toolPrice')?.value || '500');
    const availabilityStatus = document.getElementById('toolAvailability')?.value || 'Available';
    const description = document.getElementById('toolDescription')?.value.trim();
    const contactOption = document.getElementById('toolContactOption')?.value || 'Immediate Dispatch';
    const icon = document.getElementById('toolIcon')?.value || '🔨';
    const imageUrl = currentUploadedImageData || document.getElementById('toolImageUrlInput')?.value.trim() || '';

    if (!name || !price || !description) {
        showToast('Please fill all required tool fields (*)', 'error');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span style="font-weight: 800;">+</span> Add Tool to Rental Catalog';
        }
        return;
    }

    const newTool = {
        _id: 'tool_' + Date.now(),
        name,
        category,
        period,
        price,
        availabilityStatus,
        available: availabilityStatus !== 'Maintenance',
        description,
        contactOption,
        icon,
        imageUrl,
        badge: 'Newly Added',
        createdAt: new Date().toISOString()
    };

    // Immediate addition to in-memory state
    productsList.unshift(newTool);

    // Save custom tools to localStorage
    try {
        const localCustom = JSON.parse(localStorage.getItem('mm_custom_tools') || '[]');
        localCustom.unshift(newTool);
        localStorage.setItem('mm_custom_tools', JSON.stringify(localCustom));
        sessionStorage.setItem('mm_cached_products', JSON.stringify(productsList));
    } catch (err) {
        console.error(err);
    }

    // Close modal and reset form
    closeAddToolModal();
    resetAddToolForm();

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span style="font-weight: 800;">+</span> Add Tool to Rental Catalog';
    }

    // Dynamically re-render product grid
    renderProducts();

    // Show celebratory feedback
    showToast(`"${name}" added to rental catalog! 🔨`, 'success', 4000);

    // Background API Sync
    try {
        fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTool)
        }).then(res => res.json()).then(data => {
            if (data?.product?._id) {
                newTool._id = data.product._id;
            }
        }).catch(err => {
            console.warn('API background sync:', err);
        });
    } catch {}
}

// ── CART MANAGEMENT (INSTANT & SMOOTH) ── //

function addToCart(productId, btnEl) {
    const item = productsList.find(p => p._id === productId);
    if (!item) return;

    if (item.availabilityStatus === 'Maintenance') {
        showToast('This tool is currently undergoing calibration/maintenance.', 'error');
        return;
    }

    // Instant Visual Click Feedback
    if (btnEl) {
        const origText = btnEl.innerHTML;
        btnEl.innerHTML = '✓ Added!';
        btnEl.style.transform = 'scale(0.96)';
        setTimeout(() => {
            btnEl.innerHTML = origText;
            btnEl.style.transform = '';
        }, 500);
    }

    const existing = cart.find(c => c._id === productId);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCartToStorage();
    updateCartBadges();
    showToast(`Added ${item.name} to cart! 🛒`, 'success', 2000);
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(c => c._id !== productId);
    saveCartToStorage();
    updateCartBadges();
    renderCart();
}

function updateCartQty(productId, delta) {
    const item = cart.find(c => c._id === productId);
    if (!item) return;
    item.qty = (item.qty || 1) + delta;
    if (item.qty <= 0) {
        removeFromCart(productId);
    } else {
        saveCartToStorage();
        updateCartBadges();
        renderCart();
    }
}

function renderCart() {
    const body = document.getElementById('cartBody');
    const totalEl = document.getElementById('cartTotal');
    if (!body) return;

    if (cart.length === 0) {
        body.innerHTML = `
            <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
                <div style="font-size: 3rem; margin-bottom: 12px;">🛒</div>
                <p style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Your rental cart is empty</p>
                <p style="font-size: 0.85rem;">Select tools or equipment from the catalog to book for your site.</p>
            </div>
        `;
        if (totalEl) totalEl.textContent = '₹0';
        return;
    }

    let total = 0;
    body.innerHTML = cart.map(item => {
        const itemTotal = (item.price || 0) * (item.qty || 1);
        total += itemTotal;
        return `
            <div class="cart-item">
                <div style="font-size: 1.6rem; width: 44px; height: 44px; background: var(--bg-main); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    ${item.icon || '🔨'}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main); line-height: 1.3;">${escapeHtml(item.name)}</div>
                    <div style="font-size: 0.82rem; color: var(--accent); font-weight: 700; margin-top: 2px;">
                        ₹${(item.price || 0).toLocaleString('en-IN')} <span style="color: var(--text-muted); font-weight: normal;">/ ${item.period || 'Day'}</span>
                    </div>
                    <div class="flex gap-8 items-center" style="margin-top: 8px;">
                        <button class="cart-qty-btn" onclick="updateCartQty('${item._id}', -1)">-</button>
                        <span style="font-weight: 800; font-size: 0.88rem; min-width: 20px; text-align: center;">${item.qty || 1}</span>
                        <button class="cart-qty-btn" onclick="updateCartQty('${item._id}', 1)">+</button>
                    </div>
                </div>
                <div style="text-align: right; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end;">
                    <button class="cart-item-remove" onclick="removeFromCart('${item._id}')" title="Remove item">✕</button>
                    <span style="font-weight: 800; font-size: 0.95rem; color: var(--primary);">₹${itemTotal.toLocaleString('en-IN')}</span>
                </div>
            </div>
        `;
    }).join('');

    if (totalEl) {
        totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    }
}

function openCart() {
    renderCart();
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if (overlay && sidebar) {
        overlay.classList.add('active');
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if (overlay && sidebar) {
        overlay.classList.remove('active');
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateCartBadges() {
    const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const fabBadge = document.getElementById('cartCountBadge');
    const navBadge = document.getElementById('navCartCount');
    if (fabBadge) fabBadge.textContent = totalCount;
    if (navBadge) navBadge.textContent = totalCount;
}

function saveCartToStorage() {
    try {
        localStorage.setItem('mm_cart', JSON.stringify(cart));
    } catch (e) {
        console.error(e);
    }
}

function loadCartFromStorage() {
    try {
        cart = JSON.parse(localStorage.getItem('mm_cart') || '[]');
    } catch {
        cart = [];
    }
}
