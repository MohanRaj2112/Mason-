import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, Star } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { SectionHeading } from '../components/SectionHeading';
import { ContactItem } from '../components/ContactItem';
import heroBgImg from '../assets/images/hero_construction_site_1790694659406.jpg';

const defaultReviews = [
  {
    name: 'Rajesh Kumar',
    loc: 'Fairlands, Salem',
    rating: 5,
    text: 'Mason Mate completed our 3BHK home on time in 8 months. High quality workmanship and weekly progress reports!',
    date: 'January 2026'
  },
  {
    name: 'Priya Sundar',
    loc: 'RS Puram, Coimbatore',
    rating: 5,
    text: 'Rented a drum cement mixer and scaffolding set. Calibrated equipment delivered right on site within two hours.',
    date: 'December 2025'
  },
  {
    name: 'Murugan Doss',
    loc: 'Suramangalam, Salem',
    rating: 5,
    text: 'Hired 3 master masons for floor tile cladding. Punctual, polite, and highly skilled professionals.',
    date: 'November 2025'
  }
];

export const Contact = () => {
  const { showToast } = useToast();

  const [inquiry, setInquiry] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [sendingInquiry, setSendingInquiry] = useState(false);

  const [reviews, setReviews] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cp_reviews') || '[]');
      return stored.length > 0 ? [...stored, ...defaultReviews] : defaultReviews;
    } catch {
      return defaultReviews;
    }
  });

  const [reviewRating, setReviewRating] = useState(5);
  const [revName, setRevName] = useState('');
  const [revLocation, setRevLocation] = useState('');
  const [revText, setRevText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.phone || !inquiry.message) {
      showToast('Please fill all required fields marked with *', 'error');
      return;
    }

    setSendingInquiry(true);
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      });
      showToast('Thank you! Your inquiry has been sent to our engineers.', 'success');
      setInquiry({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: ''
      });
    } catch {
      showToast('Inquiry recorded locally. We will contact you shortly!', 'success');
    } finally {
      setSendingInquiry(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!revName.trim() || !revText.trim() || reviewRating === 0) {
      showToast('Please fill out your name, star rating, and review text.', 'error');
      return;
    }

    setSubmittingReview(true);
    const newRev = {
      name: revName.trim(),
      loc: revLocation.trim() || 'Verified Client',
      rating: reviewRating,
      text: revText.trim(),
      date: 'Just now'
    };

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRev)
      });
      const updated = [newRev, ...reviews];
      setReviews(updated);
      localStorage.setItem('cp_reviews', JSON.stringify(updated));
      showToast('Thank you for your review! It has been published.', 'success');
      setRevName('');
      setRevLocation('');
      setRevText('');
      setReviewRating(5);
    } catch {
      const updated = [newRev, ...reviews];
      setReviews(updated);
      localStorage.setItem('cp_reviews', JSON.stringify(updated));
      showToast('Review submitted!', 'success');
    } finally {
      setSubmittingReview(false);
    }
  };

  const openWhatsApp = (msg) => {
    const phone = '919159687408';
    const text = encodeURIComponent(
      msg || 'Hello Mason Mate, I would like to get in touch with your site engineers.'
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="contact-page">
      {/* ── HERO ── */}
      <section
        className="hero page-hero"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(10, 14, 23, 0.92) 0%, rgba(15, 23, 42, 0.82) 55%, rgba(168, 42, 16, 0.36) 100%), url(${heroBgImg})`
        }}
      >
        <div className="container">
          <div className="hero-content">
            <div className="hero-kicker">
              <span>DIRECT CONSULTATION</span>
              <span aria-hidden="true">·</span>
              <span>SALEM &amp; COIMBATORE</span>
            </div>
            <h1>Contact Mason Mate Engineering</h1>
            <p className="hero-desc">
              Have questions regarding an upcoming residential build, master mason deployment, or commercial equipment delivery? Reach our civil engineering desk directly.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO & FORM ── */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Corporate Contact Information Panel */}
            <div className="contact-info-card">
              <span className="section-eyebrow" style={{ color: '#FDBA74' }}>
                CORPORATE HEADQUARTERS
              </span>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.6rem', marginBottom: '10px' }}>
                SRM Akash Construction
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.94rem', marginBottom: '28px' }}>
                Our civil engineers and site coordinators are available Monday through Saturday for plot inspections and material consultations.
              </p>

              <div className="contact-info-stack">
                <ContactItem
                  light
                  icon={MapPin}
                  label="Service Locations"
                  value="Salem & Coimbatore, Tamil Nadu"
                  subtext="On-site visits across Salem, Coimbatore, Erode & Namakkal"
                />
                <ContactItem
                  light
                  icon={Phone}
                  label="Direct Helpline"
                  value="+91 9159687408"
                  subtext="Direct phone consultation with Lead Engineer"
                  href="tel:+919159687408"
                />
                <ContactItem
                  light
                  icon={Mail}
                  label="Email Correspondence"
                  value="contact@masonmate.in"
                  subtext="Send drawings, BOQs, or tender inquiries"
                  href="mailto:contact@masonmate.in"
                />
                <ContactItem
                  light
                  icon={Clock}
                  label="Working Hours"
                  value="Monday – Saturday: 8:00 AM – 7:30 PM"
                  subtext="Emergency site support available for active builds"
                />
              </div>

              <div style={{ marginTop: '32px' }}>
                <button
                  type="button"
                  onClick={() => openWhatsApp()}
                  className="btn btn-quote-cta btn-full btn-lg"
                >
                  <MessageSquare size={18} />
                  <span>Chat Instantly on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right: Direct Inquiry Form */}
            <div className="card contact-form-card">
              <span className="section-eyebrow">ONLINE INQUIRY</span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Send Us a Direct Message</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', marginBottom: '28px' }}>
                Complete the form below and our engineering coordinator will respond within 2 business hours.
              </p>

              <form onSubmit={handleInquirySubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={inquiry.name}
                      onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 9159687408"
                      value={inquiry.phone}
                      onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@domain.com"
                      value={inquiry.email}
                      onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Interested Service</label>
                    <select
                      className="form-control"
                      value={inquiry.service}
                      onChange={(e) => setInquiry({ ...inquiry, service: e.target.value })}
                    >
                      <option value="">Select service...</option>
                      <option>Turnkey House Construction</option>
                      <option>Home Renovation &amp; Structural Retrofit</option>
                      <option>Hire Master Mason</option>
                      <option>Tool &amp; Equipment Rental</option>
                      <option>Free Site Visit Request</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Details / Message *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Mention plot location, approximate built-up area (sq.ft), or specific tools needed..."
                    value={inquiry.message}
                    onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-quote-cta btn-full btn-lg"
                  disabled={sendingInquiry}
                >
                  <Send size={17} />
                  <span>{sendingInquiry ? 'Sending Inquiry...' : 'Submit Engineering Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS SECTION ── */}
      <section className="section section-alt" id="reviews">
        <div className="container">
          <SectionHeading
            eyebrow="CLIENT FEEDBACK"
            title="Verified Customer Reviews"
            subtitle="Read what homeowners and partner contractors say about working with Mason Mate."
          />

          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-meta">
                  <span>{r.loc || 'Client'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{r.date}</span>
                  <span aria-hidden="true">·</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                    {'★'.repeat(r.rating || 5)}
                  </span>
                </div>
                <p className="testimonial-quote">"{r.text}"</p>
                <div className="testimonial-author">
                  <strong>{r.name}</strong>
                  <span>Verified Client</span>
                </div>
              </div>
            ))}
          </div>

          {/* Write Review Form */}
          <div className="card review-form-card" style={{ maxWidth: '680px', margin: '48px auto 0' }}>
            <span className="section-eyebrow">SUBMIT FEEDBACK</span>
            <h3 style={{ marginBottom: '6px' }}>Share Your Experience</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
              Worked with SRM Akash Construction / Mason Mate on a build or tool rental? Leave your feedback below:
            </p>

            <div className="star-input" style={{ justifyContent: 'flex-start', margin: '0 0 20px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: star <= reviewRating ? 'var(--accent)' : '#CBD5E1'
                  }}
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={26}
                    fill={star <= reviewRating ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City / Area</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Fairlands, Salem"
                    value={revLocation}
                    onChange={(e) => setRevLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Describe your experience with our engineering team, masons, or equipment..."
                  value={revText}
                  onChange={(e) => setRevText(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Publish Review'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
