import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import footerBgImg from '../assets/images/footer_architecture_bg_1790694673575.jpg';

export const Footer = () => {
  const openWhatsApp = (msg) => {
    const phone = '919159687408';
    const text = encodeURIComponent(
      msg || 'Hello Mason Mate, I would like to inquire about your construction services and get a quote.'
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer
      className="site-footer"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(10, 14, 23, 0.94) 0%, rgba(22, 16, 20, 0.91) 50%, rgba(145, 34, 16, 0.84) 100%), url(${footerBgImg})`
      }}
    >
      <div className="container">
        {/* ── TOP CONTACT INFORMATION ROW (Reference Inspired) ── */}
        <div className="footer-contact-banner">
          <div className="footer-banner-heading">
            <span className="footer-banner-kicker">DIRECT ENGINEERING DESK</span>
            <h3>Contact Information</h3>
          </div>

          <div className="footer-contact-strip">
            <div className="footer-strip-item">
              <div className="footer-strip-icon">
                <MapPin size={20} />
              </div>
              <div>
                <span className="footer-strip-label">Office &amp; Service Region</span>
                <strong className="footer-strip-val">Salem &amp; Coimbatore, Tamil Nadu</strong>
              </div>
            </div>

            <div className="footer-strip-item">
              <div className="footer-strip-icon">
                <Phone size={20} />
              </div>
              <div>
                <span className="footer-strip-label">Direct Phone Helpline</span>
                <a href="tel:+919159687408" className="footer-strip-val tabular-nums">
                  +91 9159687408
                </a>
              </div>
            </div>

            <div className="footer-strip-item">
              <div className="footer-strip-icon">
                <Mail size={20} />
              </div>
              <div>
                <span className="footer-strip-label">Email Correspondence</span>
                <a href="mailto:contact@masonmate.in" className="footer-strip-val">
                  contact@masonmate.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN FOOTER COLUMNS ── */}
        <div className="footer-grid">
          {/* Col 1: About Us */}
          <div className="footer-col footer-col-about">
            <Link to="/" className="footer-brand-logo">
              Mason <span>Mate</span>
            </Link>
            <div className="footer-sub-brand">SRM AKASH CONSTRUCTION</div>
            <p className="footer-about-text">
              Established civil engineering and turnkey house construction contractors delivering IS 456 structural builds, verified master masons, and heavy equipment rentals across Tamil Nadu since 2009.
            </p>
            <div className="footer-social-row">
              <button
                type="button"
                onClick={() => openWhatsApp('Hello Mason Mate!')}
                className="footer-social-btn"
                title="Chat on WhatsApp"
              >
                <MessageSquare size={16} />
                <span>WhatsApp</span>
              </button>
              <a
                href="tel:+919159687408"
                className="footer-social-btn"
                title="Call Direct"
              >
                <Phone size={16} />
                <span>Call Direct</span>
              </a>
              <a
                href="mailto:contact@masonmate.in"
                className="footer-social-btn"
                title="Email Us"
              >
                <Mail size={16} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Col 2: Our Services */}
          <div className="footer-col">
            <h5>Our Services</h5>
            <ul>
              <li><Link to="/services#all-services">Turnkey House Construction</Link></li>
              <li><Link to="/services#masons">Master Mason Services</Link></li>
              <li><Link to="/services#all-services">Renovation &amp; Structural Retrofit</Link></li>
              <li><Link to="/products">Construction Equipment &amp; Tool Rental</Link></li>
              <li><Link to="/services#all-services">Plumbing &amp; Electrical Systems</Link></li>
              <li><Link to="/services#all-services">3D Elevation &amp; Vastu Planning</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/#about">About Us</Link></li>
              <li><Link to="/services">Services &amp; Packages</Link></li>
              <li><Link to="/#projects">Landmark Projects</Link></li>
              <li><Link to="/products">Tools Rental Catalog</Link></li>
              <li><Link to="/booking">Book a Site Visit</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/admin">Admin / Login</Link></li>
            </ul>
          </div>

          {/* Col 4: Consultation Callout */}
          <div className="footer-col">
            <h5>Site Consultation</h5>
            <p style={{ marginBottom: '20px' }}>
              Planning a new residential build or structural renovation? Schedule a complimentary plot inspection and itemized BOQ estimate with our lead engineer.
            </p>
            <Link to="/booking" className="btn btn-accent btn-full">
              <span>Request Free Estimate</span>
              <ArrowRight size={16} />
            </Link>
            <div className="footer-hours-note">
              Working Hours: Mon – Sat · 8:00 AM to 7:30 PM
            </div>
          </div>
        </div>

        {/* ── COPYRIGHT BAR ── */}
        <div className="footer-bottom">
          <p>
            Copyright © {new Date().getFullYear()} <strong>Mason Mate (SRM AKASH CONSTRUCTION)</strong>. All Rights Reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/services">Services</Link>
            <span aria-hidden="true">·</span>
            <Link to="/products">Equipment</Link>
            <span aria-hidden="true">·</span>
            <Link to="/booking">Booking</Link>
            <span aria-hidden="true">·</span>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
