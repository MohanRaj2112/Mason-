import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const openWhatsApp = (msg) => {
    const phone = '919159687408';
    const text = encodeURIComponent(msg || 'Hello Mason Mate, I would like to inquire about your services and get a quote.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand */}
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: '16px', color: 'var(--text-white)' }}>
              <div className="logo-badge">🏗️</div>
              <div className="logo-text">Mason <span style={{ color: 'var(--accent)' }}>Mate</span></div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Your trusted engineering partner for residential house construction, master mason hiring, and commercial tool rentals since 2009.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => openWhatsApp('Hello Mason Mate!')}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Chat on WhatsApp"
              >
                💬
              </button>
              <a
                href="tel:+919159687408"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Call Direct"
              >
                📞
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services &amp; Workforce</Link></li>
              <li><Link to="/products">Tool Rentals Catalog</Link></li>
              <li><Link to="/booking">Get a Quote / Book</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/auth">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              <li><Link to="/services#construction">Turnkey House Construction</Link></li>
              <li><Link to="/booking?type=mason">Master Mason Hiring</Link></li>
              <li><Link to="/products?cat=power-tools">Power Tool Rentals</Link></li>
              <li><Link to="/products?cat=mixing">Cement Mixers &amp; Scaffolding</Link></li>
              <li><Link to="/services#renovation">Renovation &amp; Repairs</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="footer-col">
            <h5>Contact Information</h5>
            <div className="footer-contact-item">
              <span>📞</span>
              <span><a href="tel:+919159687408" style={{ color: 'rgba(255,255,255,0.7)' }}>+91 9159687408</a></span>
            </div>
            <div className="footer-contact-item">
              <span>💬</span>
              <span><a href="#" onClick={(e) => { e.preventDefault(); openWhatsApp(); }} style={{ color: 'rgba(255,255,255,0.7)' }}>WhatsApp Direct</a></span>
            </div>
            <div className="footer-contact-item">
              <span>📧</span>
              <span><a href="mailto:contact@masonmate.in" style={{ color: 'rgba(255,255,255,0.7)' }}>contact@masonmate.in</a></span>
            </div>
            <div className="footer-contact-item">
              <span>📍</span>
              <span>Salem &amp; Coimbatore, Tamil Nadu</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 <span>Mason Mate</span> (SRM AKASH CONSTRUCTION). All rights reserved.</p>
          <p>Privacy Policy &nbsp;|&nbsp; Terms of Service &nbsp;|&nbsp; Site Map</p>
        </div>
      </div>
    </footer>
  );
};
