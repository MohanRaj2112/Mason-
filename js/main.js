// ── MASON MATE – MAIN SHARED SCRIPT ── //

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollTop();
    checkAuthStatus();
    initInstantPrefetch();
    initModalKeyHandlers();
});

// Navbar & Mobile Menu with Throttled RAF & Passive Scroll
function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navbar = document.getElementById('navbar');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
        // Close mobile menu when clicking outside or clicking any link
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.remove('open');
            }
        });
    }

    if (navbar) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 40) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// Scroll To Top with Throttled RAF & Passive Scroll
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 300) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Instant Page Pre-fetcher on Hover / Touch
function initInstantPrefetch() {
    const prefetched = new Set();
    function prefetchUrl(url) {
        if (!url || prefetched.has(url) || url.startsWith('http') || url.startsWith('#') || url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('javascript:')) return;
        prefetched.add(url);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    document.addEventListener('mouseover', (e) => {
        const a = e.target.closest('a');
        if (a && a.getAttribute('href')) prefetchUrl(a.getAttribute('href'));
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
        const a = e.target.closest('a');
        if (a && a.getAttribute('href')) prefetchUrl(a.getAttribute('href'));
    }, { passive: true });
}

// Global Keyboard Handler for Modals & Overlays
function initModalKeyHandlers() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active, .cart-overlay.active').forEach(el => {
                el.classList.remove('active');
            });
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Auth State Management
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('cp_user') || 'null');
    } catch {
        return null;
    }
}

function checkAuthStatus() {
    const user = getCurrentUser();
    const loginBtn = document.getElementById('navLoginBtn');
    const userBtn = document.getElementById('navUserBtn');
    const logoutBtn = document.getElementById('navLogoutBtn');
    const adminLink = document.getElementById('navAdminLink');
    const mobileAdmin = document.getElementById('mobileAdminLink');
    const mobileLogout = document.getElementById('mobileLogoutLink');

    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userBtn) {
            userBtn.style.display = 'inline-flex';
            userBtn.textContent = `👤 ${user.username || user.first || 'Me'}`;
        }
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';

        if (user.role === 'admin' || user.username === 'admin' || user.username === 'Admin') {
            if (adminLink && adminLink.parentElement) adminLink.parentElement.style.display = 'inline-block';
            if (mobileAdmin) mobileAdmin.style.display = 'block';
        }
        if (mobileLogout) mobileLogout.style.display = 'block';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (userBtn) userBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (adminLink && adminLink.parentElement) adminLink.parentElement.style.display = 'none';
        if (mobileAdmin) mobileAdmin.style.display = 'none';
        if (mobileLogout) mobileLogout.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('cp_user');
    showToast('Logged out successfully 👋', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 400);
}

// Toast Notifications
function showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
    }, duration);
}

// Modal Helpers
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// WhatsApp Helper
function openWhatsApp(msg) {
    const phone = '919159687408';
    const text = encodeURIComponent(msg || 'Hello Mason Mate, I would like to inquire about your services and get a quote.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
}
