import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare, ArrowRight, HardHat } from 'lucide-react';
import footerBgImg from '../assets/images/footer_architecture_bg_1790694673575.jpg';

export const Footer = () => {
  const openWhatsApp = (msg) => {
    const phone = '919159687408';
    const text = encodeURIComponent(
      msg || 'Hello SRM Akash Construction (MasonMate), I would like to inquire about your construction services and get a quote.'
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer
      className="site-footer"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(10, 14, 23, 0.96) 0%, rgba(15, 23, 42, 0.94) 60%, rgba(124, 45, 18, 0.88) 100%), url(${footerBgImg})`
      }}
    >
      <div className="container">
        {/* ── TOP CONTACT INFORMATION ROW ── */}
        <div className="footer-contact-banner">
          <div className="footer-banner-heading">
            <span className="footer-banner-kicker">SRM AKASH CONSTRUCTION DESK</span>
            <h3>Direct Engineering &amp; Site Support</h3>
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
              Professional construction management and civil contracting platform by SRM Akash Construction—delivering IS 456 structural builds, verified master masons, construction tools, and heavy equipment rentals since 2009.
            </p>
            <div className="footer-social-row">
              <button
                type="button"
                onClick={() => openWhatsApp('Hello SRM Akash Construction!')}
                className="footer-social-btn"
                title="Chat on WhatsApp"
              >
                <MessageSquare size={15} />
                <span>WhatsApp</span>
              </button>
              <a
                href="tel:+919159687408"
                className="footer-social-btn"
                title="Call Direct"
              >
                <Phone size={15} />
                <span>Call Direct</span>
              </a>
              <a
                href="mailto:contact@masonmate.in"
                className="footer-social-btn"
                title="Email Us"
              >
                <Mail size={15} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Col 2: Our Services */}
          <div className="footer-col">
            <h5>Construction Services</h5>
            <ul>
              <li><Link to="/services#all-services">Turnkey House Construction</Link></li>
              <li><Link to="/services#masons">Master Mason Services</Link></li>
              <li><Link to="/services#all-services">Renovation &amp; Structural Retrofit</Link></li>
              <li><Link to="/#tools">Construction Tools Catalog</Link></li>
              <li><Link to="/products">Heavy Equipment Rentals</Link></li>
              <li><Link to="/services#all-services">Building Maintenance &amp; MEP</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="footer-col">
            <h5>Quick Navigation</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/#about">About SRM Akash</Link></li>
              <li><Link to="/services">Services &amp; Packages</Link></li>
              <li><Link to="/#tools">Construction Tools</Link></li>
              <li><Link to="/products">Equipment Rentals</Link></li>
              <li><Link to="/#projects">Landmark Projects</Link></li>
              <li><Link to="/booking">Book a Mason / Quote</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 4: Consultation Callout */}
          <div className="footer-col">
            <h5>Site Consultation</h5>
            <p className="footer-consult-text">
              Planning a residential build, renovation, or equipment rental? Schedule a free plot inspection and itemized BOQ estimate with our lead civil engineer.
            </p>
            <Link to="/booking" className="btn btn-quote-cta btn-full">
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
            © {new Date().getFullYear()} <strong>MasonMate — SRM Akash Construction</strong>. Crafted by <strong>Sivaji</strong>. All Rights Reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/services">Services</Link>
            <span aria-hidden="true">·</span>
            <Link to="/products">Tools &amp; Rentals</Link>
            <span aria-hidden="true">·</span>
            <Link to="/booking">Booking</Link>
            <span aria-hidden="true">·</span>
            <Link to="/contact">Contact</Link>
            <span aria-hidden="true">·</span>
            <Link to="/auth">Portal Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
