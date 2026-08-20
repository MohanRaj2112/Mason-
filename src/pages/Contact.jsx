import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const defaultReviews = [
  { name: 'Rajesh Kumar', loc: 'Salem', rating: 5, text: 'Mason Mate completed our 3BHK home on time in 8 months. High quality and weekly progress reports!', date: 'January 2026' },
  { name: 'Priya Sundar', loc: 'Coimbatore', rating: 5, text: 'Rented a drum cement mixer and scaffolding set. Serviced equipment and delivered right on site!', date: 'December 2025' },
  { name: 'Murugan Doss', loc: 'Salem', rating: 5, text: 'Hired 3 master masons for floor tile cladding. Punctual, polite, and skilled professionals.', date: 'November 2025' }
];

export const Contact = () => {
  const { showToast } = useToast();

  // Inquiry Form state
  const [inquiry, setInquiry] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [sendingInquiry, setSendingInquiry] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cp_reviews') || '[]');
      return [...stored.reverse(), ...defaultReviews];
    } catch {
      return defaultReviews;
    }
  });

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [revName, setRevName] = useState('');
  const [revLocation, setRevLocation] = useState('');
  const [revText, setRevText] = useState('');

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.phone || !inquiry.message) {
      showToast('Please fill all required fields marked with *', 'error');
      return;
    }

    setSendingInquiry(true);
    setTimeout(() => {
      showToast('Inquiry sent! Our engineers will call you within 2 hours. 📞', 'success', 5000);
      setInquiry({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: ''
      });
      setSendingInquiry(false);
    }, 1000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!revName.trim() || !revText.trim() || reviewRating === 0) {
      showToast('Please fill out your name, star rating, and review text.', 'error');
      return;
    }

    const newRev = {
      name: revName.trim(),
      loc: revLocation.trim() || 'Client',
      rating: reviewRating,
      text: revText.trim(),
      date: 'Just now'
    };

    try {
      const stored = JSON.parse(localStorage.getItem('cp_reviews') || '[]');
      stored.push(newRev);
      localStorage.setItem('cp_reviews', JSON.stringify(stored));
    } catch {}

    setReviews([newRev, ...reviews]);
    setRevName('');
    setRevLocation('');
    setRevText('');
    setReviewRating(5);
    showToast('Thank you for your review! ⭐', 'success');
  };

  const openWhatsApp = (msg) => {
    const phone = '919159687408';
    const text = encodeURIComponent(msg || 'Hello Mason Mate, I would like to get in touch with your site engineers.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="contact-page">
      {/* ── HERO ── */}
      <section className="hero" style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <div className="hero-content">
            <span className="section-eyebrow">GET IN TOUCH</span>
            <h1 style={{ fontSize: '2.8rem', marginBottom: '16px' }}>Contact Mason Mate Engineering</h1>
            <p className="hero-desc">
              Have questions regarding an upcoming residential build, worker dispatch, or commercial tool delivery? Reach our site engineers direct.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO & FORM ── */}
      <section className="section" style={{ paddingTop: '48px' }}>
        <div className="container">
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '40px', alignItems: 'start' }}>
            {/* Info Column */}
            <div>
              <div className="contact-info-card" style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-xl)', padding: '40px', color: 'var(--text-white)', border: '1px solid rgba(217, 119, 6, 0.3)', boxShadow: 'var(--shadow-xl)' }}>
                <h3 style={{ color: 'var(--accent)', marginBottom: '8px' }}>Mason Mate Headquarters</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', marginBottom: '28px' }}>
                  Our civil engineering consultants are available Monday through Saturday.
                </p>

                <div className="ci-item" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="ci-icon" style={{ width: '48px', height: '48px', background: 'rgba(217,119,6,0.18)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'var(--accent)', flexShrink: 0 }}>📞</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Helpline Phone</strong>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      <a href="tel:+919159687408" style={{ color: 'var(--accent)' }}>+91 9159687408</a>
                    </span>
                  </div>
                </div>

                <div className="ci-item" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="ci-icon" style={{ width: '48px', height: '48px', background: 'rgba(217,119,6,0.18)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'var(--accent)', flexShrink: 0 }}>💬</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>WhatsApp Support</strong>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); openWhatsApp('Hello Mason Mate! I need site information.'); }} style={{ color: 'var(--accent)' }}>Instant WhatsApp Chat</a>
                    </span>
                  </div>
                </div>

                <div className="ci-item" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="ci-icon" style={{ width: '48px', height: '48px', background: 'rgba(217,119,6,0.18)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'var(--accent)', flexShrink: 0 }}>📧</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Email Contact</strong>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      contact@masonmate.in
                    </span>
                  </div>
                </div>

                <div className="ci-item" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px 0' }}>
                  <div className="ci-icon" style={{ width: '48px', height: '48px', background: 'rgba(217,119,6,0.18)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'var(--accent)', flexShrink: 0 }}>📍</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Service Locations</strong>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      Salem &amp; Coimbatore, Tamil Nadu, India
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '28px' }}>
                  <button onClick={() => openWhatsApp()} className="btn btn-accent btn-full">
                    💬 Chat on WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="card">
              <h3>Send Us a Direct Message</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Fill out the form below to receive a response within 2 business hours:
              </p>

              <form onSubmit={handleInquirySubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your name"
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

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@email.com"
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
                    <option>Home Renovation</option>
                    <option>Hire Master Mason</option>
                    <option>Tool &amp; Equipment Rental</option>
                    <option>Free Site Visit Request</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Details / Message *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Mention project location, built-up area, or specific tools needed..."
                    value={inquiry.message}
                    onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-accent btn-full btn-lg"
                  disabled={sendingInquiry}
                >
                  {sendingInquiry ? '⏳ Sending Inquiry...' : '📨 Send Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS SECTION ── */}
      <section className="section section-alt" id="reviews">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">CLIENT FEEDBACK</span>
            <h2>Verified Customer Reviews</h2>
            <p>Read what homeowners and partner contractors say about Mason Mate.</p>
          </div>

          <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '32px' }}>
            {reviews.map((r, i) => (
              <div key={i} className="card">
                <div style={{ color: 'var(--accent)', marginBottom: '8px', fontSize: '1.2rem' }}>
                  {'★'.repeat(r.rating || 5)}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                  "{r.text}"
                </p>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>{r.name}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.loc || 'Client'} • {r.date}</span>
              </div>
            ))}
          </div>

          {/* Write Review Form */}
          <div className="card" style={{ marginTop: '40px', textAlign: 'center', maxWidth: '650px', margin: '40px auto 0' }}>
            <h3>Share Your Experience</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Worked with Mason Mate on a project? Leave us your review:
            </p>

            <div className="star-input" style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '16px 0', fontSize: '2.2rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  onClick={() => setReviewRating(star)}
                  style={{ color: star <= reviewRating ? 'var(--accent)' : 'var(--border-light)', transition: 'var(--transition)' }}
                >
                  ★
                </span>
              ))}
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your name *"
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City / Area (e.g. Salem)"
                    value={revLocation}
                    onChange={(e) => setRevLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Share your experience..."
                  value={revText}
                  onChange={(e) => setRevText(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-accent btn-lg">
                ⭐ Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
