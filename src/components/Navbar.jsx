import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();
  const { totalCount, openCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully 👋', 'success');
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
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
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <div className="logo-badge">🏗️</div>
            <div className="logo-text">Mason <span>Mate</span></div>
          </Link>

          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') && location.hash === '' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/#projects" className="nav-link">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
                Tools Rental
              </Link>
            </li>
            <li>
              <Link to="/booking" className={`nav-link ${isActive('/booking') ? 'active' : ''}`}>
                Booking
              </Link>
            </li>
            <li>
              <Link to="/#about" className="nav-link">
                About
              </Link>
            </li>
            <li>
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
