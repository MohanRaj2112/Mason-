import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
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
  ChevronRight,
  HardHat,
  Hammer
} from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { totalCount, openCart } = useCart();
  const { showToast } = useToast();
  const mobileMenuRef = useRef(null);

  const isAdmin =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.username?.toLowerCase() === 'admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

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

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const isLinkActive = (key) => {
    const pathname = location.pathname;
    const hash = location.hash;

    switch (key) {
      case 'home':
        return pathname === '/' && (!hash || hash === '' || hash === '#' || hash === '#hero');
      case 'about':
        return (pathname === '/' && hash === '#about') || pathname.startsWith('/about');
      case 'services':
        return pathname.startsWith('/services');
      case 'tools':
        return pathname === '/' && hash === '#tools';
      case 'rentals':
        return (
          pathname.startsWith('/products') ||
          pathname.startsWith('/tools') ||
          pathname.startsWith('/tools-rental')
        );
      case 'projects':
        return (pathname === '/' && hash === '#projects') || pathname.startsWith('/projects');
      case 'booking':
        return pathname.startsWith('/booking');
      case 'contact':
        return pathname.startsWith('/contact');
      case 'admin':
        return pathname.startsWith('/admin');
      case 'auth':
        return pathname.startsWith('/auth');
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
    } else if (!hashTarget && path === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        id="navbar"
        role="banner"
      >
        <div className="navbar-inner">
          {/* Zone 1: Brand Identity */}
          <Link
            to="/"
            className="logo-brand-block"
            aria-label="MasonMate - SRM Akash Construction Home"
            onClick={() => handleNavClick('/')}
          >
            <div className="logo-mark-box">
              <HardHat size={20} />
            </div>
            <div className="logo-text-stack">
              <span className="logo-title">
                Mason<span>Mate</span>
              </span>
              <span className="logo-subtitle">SRM Akash Construction</span>
            </div>
          </Link>

          {/* Zone 2: Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="navbar-nav-center">
            <ul className="nav-links" id="desktopNavLinks">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${isLinkActive('home') ? 'active' : ''}`}
                  onClick={() => handleNavClick('/')}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className={`nav-link ${isLinkActive('about') ? 'active' : ''}`}
                  onClick={() => handleNavClick('/#about', '#about')}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`nav-link ${isLinkActive('services') ? 'active' : ''}`}
                  onClick={() => handleNavClick('/services')}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/#tools"
                  className={`nav-link ${isLinkActive('tools') ? 'active' : ''}`}
                  onClick={() => handleNavClick('/#tools', '#tools')}
                >
                  Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className={`nav-link ${isLinkActive('rentals') ? 'active' : ''}`}
                  onClick={() => handleNavClick('/products')}
                >
                  Rentals
                </Link>
              </li>
              <li>
                <Link
                  to="/#projects"
                  className={`nav-link ${isLinkActive('projects') ? 'active' : ''}`}
                  onClick={() => handleNavClick('/#projects', '#projects')}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`nav-link ${isLinkActive('contact') ? 'active' : ''}`}
                  onClick={() => handleNavClick('/contact')}
                >
                  Contact
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className={`nav-link nav-link-admin ${isLinkActive('admin') ? 'active' : ''}`}
                    onClick={() => handleNavClick('/admin')}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Zone 3: Desktop Action Controls */}
          <div className="nav-cta-desktop">
            <button
              type="button"
              className="btn-nav-action btn-nav-cart"
              onClick={openCart}
              title="View Equipment Cart"
              id="desktop-cart-btn"
            >
              <ShoppingCart size={16} />
              <span>Cart{totalCount > 0 ? ` (${totalCount})` : ''}</span>
            </button>

            {currentUser ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="btn-nav-action btn-nav-user"
                    title="Admin Dashboard"
                  >
                    <Shield size={15} />
                    <span>Admin Dashboard</span>
                  </Link>
                ) : (
                  <span className="btn-nav-action btn-nav-user" title="Signed In User">
                    <User size={15} />
                    <span>{currentUser.username || 'Client'}</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-nav-action btn-nav-logout"
                  title="Log Out"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className={`btn-nav-action btn-nav-user ${isLinkActive('auth') ? 'active' : ''}`}
                title="Sign In to MasonMate"
              >
                <User size={15} />
                <span>Login</span>
              </Link>
            )}

            <Link
              to="/booking"
              id="nav-book-now-btn"
              className="btn btn-quote-cta btn-nav-cta"
            >
              <span>Book a Mason</span>
              <ArrowRight size={15} className="cta-arrow" />
            </Link>
          </div>

          {/* Mobile & Tablet Action Bar */}
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
              {totalCount > 0 && <span className="nav-cart-count-inline">{totalCount}</span>}
            </button>

            <button
              type="button"
              className={`hamburger-btn ${mobileOpen ? 'active' : ''}`}
              id="hamburger"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="navDrawer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Backdrop */}
      <div
        className={`mobile-menu-backdrop ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Side Drawer Navigation */}
      <aside
        className={`nav-drawer ${mobileOpen ? 'open' : ''}`}
        id="navDrawer"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation Drawer"
      >
        <div className="nav-drawer-header">
          <Link to="/" className="logo-brand-block" onClick={() => setMobileOpen(false)}>
            <div className="logo-mark-box">
              <HardHat size={18} />
            </div>
            <div className="logo-text-stack">
              <span className="logo-title">
                Mason<span>Mate</span>
              </span>
              <span className="logo-subtitle">SRM Akash Construction</span>
            </div>
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
              <ChevronRight size={16} className="drawer-link-chevron" />
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
              <ChevronRight size={16} className="drawer-link-chevron" />
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
              <ChevronRight size={16} className="drawer-link-chevron" />
            </Link>

            <Link
              to="/#tools"
              className={`drawer-nav-link ${isLinkActive('tools') ? 'active' : ''}`}
              onClick={() => handleNavClick('/#tools', '#tools')}
            >
              <div className="drawer-link-left">
                <Hammer size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Tools</span>
              </div>
              <ChevronRight size={16} className="drawer-link-chevron" />
            </Link>

            <Link
              to="/products"
              className={`drawer-nav-link ${isLinkActive('rentals') ? 'active' : ''}`}
              onClick={() => handleNavClick('/products')}
            >
              <div className="drawer-link-left">
                <Wrench size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Rentals</span>
              </div>
              <ChevronRight size={16} className="drawer-link-chevron" />
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
              <ChevronRight size={16} className="drawer-link-chevron" />
            </Link>

            <Link
              to="/booking"
              className={`drawer-nav-link ${isLinkActive('booking') ? 'active' : ''}`}
              onClick={() => handleNavClick('/booking')}
            >
              <div className="drawer-link-left">
                <Calendar size={18} className="drawer-link-icon" />
                <span className="drawer-link-title">Book Service</span>
              </div>
              <ChevronRight size={16} className="drawer-link-chevron" />
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
              <ChevronRight size={16} className="drawer-link-chevron" />
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`drawer-nav-link ${isLinkActive('admin') ? 'active' : ''}`}
                onClick={() => handleNavClick('/admin')}
              >
                <div className="drawer-link-left">
                  <Shield size={18} className="drawer-link-icon" />
                  <span className="drawer-link-title">Admin Dashboard</span>
                </div>
                <ChevronRight size={16} className="drawer-link-chevron" />
              </Link>
            )}
          </div>
        </div>

        <div className="nav-drawer-footer">
          <button
            type="button"
            className="drawer-cart-card"
            onClick={() => {
              setMobileOpen(false);
              openCart();
            }}
            title="Open Equipment Cart"
          >
            <div className="drawer-cart-card-left">
              <div className="drawer-cart-badge-icon">
                <ShoppingCart size={17} />
              </div>
              <div className="drawer-cart-card-text">
                <strong>Equipment Cart</strong>
                <small>
                  {totalCount > 0
                    ? `${totalCount} item${totalCount > 1 ? 's' : ''} in cart`
                    : 'No items added yet'}
                </small>
              </div>
            </div>
            <span className="drawer-cart-open-text">
              {totalCount > 0 ? `${totalCount} items` : 'View'}
            </span>
          </button>

          <div className="drawer-user-row">
            {currentUser ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="btn-drawer-action btn-drawer-user"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Shield size={15} />
                    <span>Admin Dashboard</span>
                  </Link>
                ) : (
                  <span className="btn-drawer-action btn-drawer-user">
                    <User size={15} />
                    <span>{currentUser.username || 'Client'}</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="btn-drawer-action btn-drawer-logout"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="btn-drawer-action btn-drawer-user"
                style={{ gridColumn: '1 / -1' }}
                onClick={() => setMobileOpen(false)}
              >
                <User size={15} />
                <span>Login / Sign Up</span>
              </Link>
            )}
          </div>

          <Link
            to="/booking"
            id="drawer-book-now-btn"
            className="btn btn-quote-cta drawer-quote-btn"
            onClick={() => setMobileOpen(false)}
          >
            <span>Book a Mason</span>
            <ArrowRight size={17} className="cta-arrow" />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
