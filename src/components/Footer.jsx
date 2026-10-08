import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare, HardHat, Globe } from 'lucide-react';
import footerBgImg from '../assets/images/srm_footer_bg_1791445429334.jpg';

export const Footer = () => {
  const openWhatsApp = () => {
    const phone = '919159687408';
    const text = encodeURIComponent(
      'Hello SRM Akash Construction (MasonMate), I would like to inquire about your construction services.'
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer
      className="site-footer"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(10, 14, 23, 0.97) 0%, rgba(15, 23, 42, 0.95) 65%, rgba(124, 45, 18, 0.9) 100%), url(${footerBgImg})`
      }}
    >
      <div className="container">
        {/* ── MAIN COMPACT FOOTER COLUMNS ── */}
        <div className="footer-grid">
          {/* Col 1: SRM AKASH CONSTRUCTION & Short Company Description */}
          <div className="footer-col footer-col-about">
            <Link to="/" className="footer-brand-block">
              <div className="footer-logo-icon">
                <HardHat size={20} />
              </div>
              <div>
                <div className="footer-brand-logo">
                  Mason<span>Mate</span>
                </div>
                <div className="footer-sub-brand">SRM AKASH CONSTRUCTION</div>
              </div>
            </Link>
            <p className="footer-about-text">
              Trusted civil engineering and residential contracting platform delivering turnkey home builds, certified master mason services, and calibrated site equipment rentals.
            </p>
            <div className="footer-social-row" aria-label="Social Links">
              <button
                type="button"
                onClick={openWhatsApp}
                className="footer-social-btn"
                title="WhatsApp"
              >
                <MessageSquare size={15} />
                <span>WhatsApp</span>
              </button>
              <Link
                to="/booking"
                className="footer-social-btn"
                title="Online Booking Portal"
              >
                <Globe size={15} />
                <span>Book Online</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/#about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/#tools">Tools</Link></li>
              <li><Link to="/products">Rentals</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              <li><Link to="/services#all-services">Construction</Link></li>
              <li><Link to="/services#masons">Mason Services</Link></li>
              <li><Link to="/#tools">Tool Rental</Link></li>
              <li><Link to="/products">Equipment Rental</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="footer-col">
            <h5>Contact</h5>
            <ul className="footer-contact-list">
              <li>
                <Phone size={15} className="footer-contact-icon" />
                <a href="tel:+919159687408" className="tabular-nums">+91 9159687408</a>
              </li>
              <li>
                <Mail size={15} className="footer-contact-icon" />
                <a href="mailto:contact@masonmate.in">contact@masonmate.in</a>
              </li>
              <li>
                <MapPin size={15} className="footer-contact-icon" />
                <span>Salem &amp; Coimbatore, Tamil Nadu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── COPYRIGHT & FOUNDER BAR ── */}
        <div className="footer-bottom">
          <div>
            <p className="footer-copyright-line">
              © 2026 <strong>SRM Akash Construction</strong>. All Rights Reserved.
            </p>
          </div>
          <div className="footer-founder-credit">
            <span>Founded / Managed by:</span>{' '}
            <strong>S. SIVAJI</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
