<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
<<<<<<< HEAD
import {
  X,
  Menu,
  ShoppingCart,
  Home,
  Briefcase,
  Layers,
  Wrench,
  Calendar,
  Info,
  Phone,
  Shield,
  User,
  LogOut,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
=======
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { currentUser, logout } = useAuth();
  const { totalCount, openCart } = useCart();
  const { showToast } = useToast();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
=======
  const { currentUser, logout, isAdmin } = useAuth();
  const { totalCount, openCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

<<<<<<< HEAD
  // Close mobile menu on page navigation or hash change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  // Close mobile menu on Escape key press or background lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);
=======
  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully 👋', 'success');
    navigate('/');
  };

<<<<<<< HEAD
  // Dynamic route active check
  const isLinkActive = (key) => {
    const pathname = location.pathname;
    const hash = location.hash;

    switch (key) {
      case 'home':
        return pathname === '/' && (!hash || hash === '' || hash === '#' || hash === '#hero');
      case 'services':
        return pathname.startsWith('/services');
      case 'projects':
        return (pathname === '/' && hash === '#projects') || pathname.startsWith('/projects');
      case 'tools':
        return (
          pathname.startsWith('/products') ||
          pathname.startsWith('/tools') ||
          pathname.startsWith('/tools-rental')
        );
      case 'booking':
        return pathname.startsWith('/booking');
      case 'about':
        return (pathname === '/' && hash === '#about') || pathname.startsWith('/about');
      case 'contact':
        return pathname.startsWith('/contact');
      case 'admin':
        return pathname.startsWith('/admin');
      default:
        return false;
    }
  };

  const handleNavClick = (path, hashTarget) => {
    setMobileOpen(false);
    if (hashTarget && location.pathname === '/') {
      const element = document.getElementById(hashTarget.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
=======
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
  };

  return (
    <>
      {/* Notice Bar */}
      <div className="notice-bar">
        <div className="container notice-bar-inner">
          <div>
            🏗️ <strong>Certified Structural Engineering Guarantee</strong> — Call: <a href="tel:+919159687408">+91 9159687408</a>
          </div>
          <div>
            🎁 <span>Book online for 10% discount on first milestone labor charges!</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
<<<<<<< HEAD
      <nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`} 
        id="navbar"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="navbar-inner">
          {/* Brand Logo */}
          <Link to="/" className="logo" aria-label="Mason Mate Home">
            <div className="logo-badge" aria-hidden="true">🏗️</div>
            <div className="logo-text">Mason <span>Mate</span></div>
          </Link>

          {/* Desktop Navigation Links (Exact order preserved) */}
          <ul className="nav-links" id="desktopNavLinks">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isLinkActive('home') ? 'active' : ''}`}
                onClick={() => handleNavClick('/')}
              >
=======
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <div className="logo-badge">🏗️</div>
            <div className="logo-text">Mason <span>Mate</span></div>
          </Link>

          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') && location.hash === '' ? 'active' : ''}`}>
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
                Home
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link 
                to="/services" 
                className={`nav-link ${isLinkActive('services') ? 'active' : ''}`}
                onClick={() => handleNavClick('/services')}
              >
=======
              <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
                Services
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link 
                to="/#projects" 
                className={`nav-link ${isLinkActive('projects') ? 'active' : ''}`}
                onClick={() => handleNavClick('/#projects', '#projects')}
              >
=======
              <Link to="/#projects" className="nav-link">
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
                Projects
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link 
                to="/products" 
                className={`nav-link ${isLinkActive('tools') ? 'active' : ''}`}
                onClick={() => handleNavClick('/products')}
              >
=======
              <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
                Tools Rental
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link 
                to="/booking" 
                className={`nav-link ${isLinkActive('booking') ? 'active' : ''}`}
                onClick={() => handleNavClick('/booking')}
              >
=======
              <Link to="/booking" className={`nav-link ${isActive('/booking') ? 'active' : ''}`}>
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
                Booking
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link 
                to="/#about" 
                className={`nav-link ${isLinkActive('about') ? 'active' : ''}`}
                onClick={() => handleNavClick('/#about', '#about')}
              >
=======
              <Link to="/#about" className="nav-link">
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
                About
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link 
                to="/contact" 
                className={`nav-link ${isLinkActive('contact') ? 'active' : ''}`}
                onClick={() => handleNavClick('/contact')}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className={`nav-link nav-link-admin ${isLinkActive('admin') ? 'active' : ''}`}
                onClick={() => handleNavClick('/admin')}
              >
                Admin Panel
              </Link>
            </li>
          </ul>

          {/* Desktop Action Controls */}
          <div className="nav-cta-desktop">
            <button
              type="button"
              className="btn-nav-action btn-nav-cart"
              onClick={openCart}
              title="View Equipment Cart"
              id="desktop-cart-btn"
            >
              <ShoppingCart size={16} />
              <span>Cart</span>
              {totalCount > 0 && <span className="nav-cart-badge">{totalCount}</span>}
            </button>

            {currentUser ? (
              <>
                <Link
                  to="/admin"
                  className="btn-nav-action btn-nav-user"
                  title="Admin Dashboard"
                >
                  <User size={15} />
                  <span>{currentUser.role === 'admin' || currentUser.username?.toLowerCase() === 'admin' ? 'Admin' : currentUser.username}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-nav-action btn-nav-logout"
                  title="Log Out"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/admin"
                  className="btn-nav-action btn-nav-user"
                  title="Admin Access"
                >
                  <User size={15} />
                  <span>Admin</span>
                </Link>
                <Link
                  to="/auth"
                  className="btn-nav-action btn-nav-logout"
                  title="Sign In / Logout"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </Link>
              </>
            )}

            <Link
              to="/booking"
              id="nav-book-now-btn"
              className="btn btn-quote-cta btn-nav-cta"
            >
              <span>GET A QUOTE</span>
              <span className="cta-arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Tablet / Split-Screen / Mobile Action Header Bar */}
          <div className="nav-mobile-bar">
            <button
              type="button"
              className="btn-nav-action btn-nav-cart btn-nav-cart-mobile"
              onClick={openCart}
              title="View Equipment Cart"
              aria-label={`Cart with ${totalCount} items`}
              id="mobile-header-cart-btn"
            >
              <ShoppingCart size={17} />
              {totalCount > 0 && <span className="nav-cart-badge">{totalCount}</span>}
            </button>

            <button
              type="button"
              className={`hamburger-btn ${mobileOpen ? 'active' : ''}`}
              id="hamburger"
              aria-label={mobileOpen ? "Close navigation drawer" : "Open navigation drawer"}
              aria-expanded={mobileOpen}
              aria-controls="navDrawer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Split-Screen & Mobile Overlay Backdrop */}
      <div 
        className={`mobile-menu-backdrop ${mobileOpen ? 'visible' : ''}`} 
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Modern Split-Screen & Mobile Side Drawer Navigation */}
      <aside 
        className={`nav-drawer ${mobileOpen ? 'open' : ''}`} 
        id="navDrawer"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation Drawer"
      >
        {/* Drawer Header */}
        <div className="nav-drawer-header">
          <Link to="/" className="drawer-logo" onClick={() => setMobileOpen(false)}>
            <div className="logo-badge" aria-hidden="true">🏗️</div>
            <div className="logo-text">Mason <span>Mate</span></div>
          </Link>
          <button
            type="button"
            className="btn-drawer-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Body: Clean Navigation List */}
        <div className="nav-drawer-body">
          <div className="drawer-nav-list">
            <Link 
              to="/" 
              className={`drawer-nav-link ${isLinkActive('home') ? 'active' : ''}`} 
              onClick={() => handleNavClick('/')}
            >
              <div className="drawer-link-left">
                <Home size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Home</span>
              </div>
              {isLinkActive('home') ? (
                <span className="drawer-active-pill">Active</span>
              ) : (
                <ChevronRight size={16} className="drawer-link-chevron" />
              )}
            </Link>

            <Link 
              to="/services" 
              className={`drawer-nav-link ${isLinkActive('services') ? 'active' : ''}`} 
              onClick={() => handleNavClick('/services')}
            >
              <div className="drawer-link-left">
                <Briefcase size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Services</span>
              </div>
              {isLinkActive('services') ? (
                <span className="drawer-active-pill">Active</span>
              ) : (
                <ChevronRight size={16} className="drawer-link-chevron" />
              )}
            </Link>

            <Link 
              to="/#projects" 
              className={`drawer-nav-link ${isLinkActive('projects') ? 'active' : ''}`} 
              onClick={() => handleNavClick('/#projects', '#projects')}
            >
              <div className="drawer-link-left">
                <Layers size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Projects</span>
              </div>
              {isLinkActive('projects') ? (
                <span className="drawer-active-pill">Active</span>
              ) : (
                <ChevronRight size={16} className="drawer-link-chevron" />
              )}
            </Link>

            <Link 
              to="/products" 
              className={`drawer-nav-link ${isLinkActive('tools') ? 'active' : ''}`} 
              onClick={() => handleNavClick('/products')}
            >
              <div className="drawer-link-left">
                <Wrench size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Tools Rental</span>
              </div>
              {totalCount > 0 ? (
                <span className="drawer-tool-badge">{totalCount} reserved</span>
              ) : isLinkActive('tools') ? (
                <span className="drawer-active-pill">Active</span>
              ) : (
                <ChevronRight size={16} className="drawer-link-chevron" />
              )}
            </Link>

            <Link 
              to="/booking" 
              className={`drawer-nav-link ${isLinkActive('booking') ? 'active' : ''}`} 
              onClick={() => handleNavClick('/booking')}
            >
              <div className="drawer-link-left">
                <Calendar size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Booking</span>
              </div>
              {isLinkActive('booking') ? (
                <span className="drawer-active-pill">Active</span>
              ) : (
                <ChevronRight size={16} className="drawer-link-chevron" />
              )}
            </Link>

            <Link 
              to="/#about" 
              className={`drawer-nav-link ${isLinkActive('about') ? 'active' : ''}`} 
              onClick={() => handleNavClick('/#about', '#about')}
            >
              <div className="drawer-link-left">
                <Info size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">About</span>
              </div>
              {isLinkActive('about') ? (
                <span className="drawer-active-pill">Active</span>
              ) : (
                <ChevronRight size={16} className="drawer-link-chevron" />
              )}
            </Link>

            <Link 
              to="/contact" 
              className={`drawer-nav-link ${isLinkActive('contact') ? 'active' : ''}`} 
              onClick={() => handleNavClick('/contact')}
            >
              <div className="drawer-link-left">
                <Phone size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Contact</span>
              </div>
              {isLinkActive('contact') ? (
                <span className="drawer-active-pill">Active</span>
              ) : (
                <ChevronRight size={16} className="drawer-link-chevron" />
              )}
            </Link>

            <Link 
              to="/admin" 
              className={`drawer-nav-link drawer-nav-link-admin ${isLinkActive('admin') ? 'active' : ''}`} 
              onClick={() => handleNavClick('/admin')}
            >
              <div className="drawer-link-left">
                <Shield size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Admin Panel</span>
              </div>
              <span className="admin-chip">PORTAL</span>
            </Link>
          </div>
        </div>

        {/* Drawer Sticky Footer: Cart Card, User Buttons & Quote CTA */}
        <div className="nav-drawer-footer">
          {/* Quick Equipment Cart Card */}
          <button
            type="button"
            className="drawer-cart-card"
            onClick={() => { setMobileOpen(false); openCart(); }}
            title="Open Equipment Cart"
          >
            <div className="drawer-cart-card-left">
              <div className="drawer-cart-badge-icon">
                <ShoppingCart size={17} />
              </div>
              <div className="drawer-cart-card-text">
                <strong>Equipment Cart</strong>
                <small>{totalCount > 0 ? `${totalCount} item${totalCount > 1 ? 's' : ''} in cart` : 'No items added yet'}</small>
              </div>
            </div>
            <span className="drawer-cart-open-btn">
              {totalCount > 0 ? `${totalCount} items` : 'Open'}
            </span>
          </button>

          {/* User Row */}
          <div className="drawer-user-row">
            {currentUser ? (
              <>
                <Link 
                  to="/admin" 
                  className="btn-drawer-action btn-drawer-user" 
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={15} />
                  <span>{currentUser.role === 'admin' || currentUser.username?.toLowerCase() === 'admin' ? 'Admin' : currentUser.username}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="btn-drawer-action btn-drawer-logout"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/admin" 
                  className="btn-drawer-action btn-drawer-user" 
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={15} />
                  <span>Admin</span>
                </Link>
                <Link 
                  to="/auth" 
                  className="btn-drawer-action btn-drawer-logout" 
                  onClick={() => setMobileOpen(false)}
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </Link>
              </>
            )}
          </div>

          {/* Primary Call-to-Action */}
          <Link
            to="/booking"
            id="drawer-book-now-btn"
            className="btn btn-quote-cta drawer-quote-btn"
            onClick={() => setMobileOpen(false)}
          >
            <span>GET A QUOTE</span>
            <ArrowRight size={17} className="cta-arrow" />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
=======
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ color: 'var(--accent)', fontWeight: 800 }}>
                  ⚙️ Admin Panel
                </Link>
              </li>
            )}
          </ul>

          <div className="flex gap-12 nav-cta-desktop" style={{ alignItems: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={openCart} title="View Cart">
              🛒 Cart {totalCount > 0 && <span style={{ background: 'var(--accent)', color: '#fff', padding: '1px 6px', borderRadius: '50px', fontSize: '0.75rem', marginLeft: '4px' }}>{totalCount}</span>}
            </button>

            {currentUser ? (
              <div className="flex gap-8" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', padding: '6px 12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  👤 {currentUser.username || 'Client'}
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log Out">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-outline btn-sm">
                Sign In
              </Link>
            )}

            <Link to="/booking" id="nav-book-now-btn" className="btn btn-quote-cta btn-sm" style={{ fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Get a Quote <span className="cta-arrow">→</span>
            </Link>
          </div>

          <button
            className={`hamburger ${mobileOpen ? 'active' : ''}`}
            id="hamburger"
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobileMenu">
        <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>🏠 Home</Link>
        <Link to="/services" className="nav-link" onClick={() => setMobileOpen(false)}>🔧 Services</Link>
        <Link to="/#projects" className="nav-link" onClick={() => setMobileOpen(false)}>📁 Projects</Link>
        <Link to="/products" className="nav-link" onClick={() => setMobileOpen(false)}>🔨 Tools Rental {totalCount > 0 && `(${totalCount})`}</Link>
        <Link to="/booking" className="nav-link" onClick={() => setMobileOpen(false)}>📅 Booking</Link>
        <Link to="/#about" className="nav-link" onClick={() => setMobileOpen(false)}>🏢 About</Link>
        <Link to="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>📞 Contact</Link>
        
        {isAdmin && (
          <Link to="/admin" className="nav-link" onClick={() => setMobileOpen(false)} style={{ color: 'var(--accent)', fontWeight: 800 }}>
            ⚙️ Admin Dashboard
          </Link>
        )}

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-light)', marginTop: '12px' }}>
          <Link
            to="/booking"
            id="mobile-nav-book-now-btn"
            className="btn btn-quote-cta btn-full"
            onClick={() => setMobileOpen(false)}
            style={{ justifyContent: 'center', fontWeight: 800, textTransform: 'uppercase' }}
          >
            📅 Book Now <span className="cta-arrow">→</span>
          </Link>
          
          {currentUser ? (
            <div className="flex justify-between items-center" style={{ marginTop: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>👤 {currentUser.username}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-outline btn-full" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center' }}>
              🔐 Sign In / Register
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
