import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { initialToolsData } from '../data/tools';
import { servicesData } from '../data/services';

const BOOKING_TYPES = [
  {
    id: 'construction',
    title: 'Construction Service',
    icon: '🏗️',
    description: 'Turnkey building, structural RCC, masonry, renovations, or plumbing & electrical work.',
    badge: 'Popular'
  },
  {
    id: 'tool_rental',
    title: 'Tool Rental',
    icon: '🛠️',
    description: 'Calibrated machinery: concrete mixers, hammer drills, scaffolding, and submersible pumps.',
    badge: 'Equipment'
  },
  {
    id: 'estimate',
    title: 'Project Estimate',
    icon: '📋',
    description: 'Free architectural & civil engineering BOQ estimate and structural site feasibility report.',
    badge: 'Free Site Visit'
  },
  {
    id: 'enquiry',
    title: 'General Enquiry',
    icon: '💬',
    description: 'Soil testing, structural drawing inquiries, contractor advice, or consultation requests.',
    badge: 'Consultation'
  }
];

const CONSTRUCTION_SERVICES = [
  'Turnkey House Construction',
  'Hire Master Masons & Specialists',
  'Renovation & Remodeling',
  'Structural RCC & Framing',
  'Plumbing & Electrical Fitting',
  'Painting & Waterproofing'
];

const PROJECT_TYPES = [
  'Residential Independent Villa',
  'Duplex / Row House Build',
  'Commercial Complex / Office',
  'Floor Addition / Renovation',
  'Boundary Wall & Structural RCC',
  'Heritage Masonry & Stone Work'
];

export const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Booking Flow State
  const [bookingType, setBookingType] = useState('construction');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    // Step 2: Customer Details
    fullName: '',
    phone: '',
    email: '',
    location: '',

    // Step 3: Service Details (Dynamic)
    selectedService: 'Turnkey House Construction',
    selectedTool: 'Commercial Cement Mixer Drum (200L Diesel)',
    toolQuantity: '1',
    projectType: 'Residential Independent Villa',
    preferredDate: '',
    duration: '1-3 Months',
    workersCount: '2',
    enquirySubject: 'Free Site Inspection & Plot Feasibility',

    // Project Requirements
    projectDescription: '',
    estimatedBudget: '',
    additionalRequirements: '',

    // Payment / Advance Preference
    paymentMode: 'Cash on Site Consultation'
  });

  // Prepopulate from URL parameters
  useEffect(() => {
    const type = searchParams.get('type');
    const tool = searchParams.get('tool');
    const plan = searchParams.get('plan');
    const role = searchParams.get('role');

    if (type === 'tools' || tool) {
      setBookingType('tool_rental');
      if (tool) {
        setFormData(prev => ({
          ...prev,
          selectedTool: tool,
          projectDescription: `Rental request for equipment: ${tool}`
        }));
      }
    } else if (type === 'mason' || role) {
      setBookingType('construction');
      setFormData(prev => ({
        ...prev,
        selectedService: 'Hire Master Masons & Specialists',
        projectDescription: role ? `Interested in hiring ${role}` : 'Hiring master masons for civil project'
      }));
    } else if (type === 'estimate' || plan) {
      setBookingType('estimate');
      if (plan) {
        setFormData(prev => ({
          ...prev,
          projectDescription: `Interested in ${plan.toUpperCase()} Construction Package Estimation`
        }));
      }
    }

    // Default preferred date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, preferredDate: prev.preferredDate || dateStr }));
  }, [searchParams]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  // Form Submission Handler
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      showToast('Full Name is required', 'error');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setErrorMessage('Please enter a valid phone number.');
      showToast('Valid Phone Number is required', 'error');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Please enter your project / site location.');
      showToast('Site Location is required', 'error');
      return;
    }
    if (!formData.preferredDate) {
      setErrorMessage('Please select a preferred date.');
      showToast('Preferred Date is required', 'error');
      return;
    }

    setIsSubmitting(true);

    const generatedId = 'MM-' + Math.floor(100000 + Math.random() * 900000);
    const resolvedServiceName =
      bookingType === 'construction'
        ? formData.selectedService
        : bookingType === 'tool_rental'
        ? `Tool Rental: ${formData.selectedTool} (${formData.toolQuantity} Unit)`
        : bookingType === 'estimate'
        ? `Project Estimate: ${formData.projectType}`
        : `General Enquiry: ${formData.enquirySubject}`;

    const bookingPayload = {
      bookingId: generatedId,
      customerName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || 'Not Provided',
      location: formData.location.trim(),
      service: resolvedServiceName,
      bookingType: bookingType,
      startDate: formData.preferredDate,
      duration: formData.duration,
      workers: parseInt(formData.workersCount, 10) || 1,
      paymentMode: formData.paymentMode,
      budget: formData.estimatedBudget.trim() || 'Standard Quote',
      notes: [
        formData.projectDescription.trim(),
        formData.additionalRequirements.trim() ? `Additional Scope: ${formData.additionalRequirements.trim()}` : ''
      ].filter(Boolean).join(' | '),
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save to client storage for instantaneous Admin & user availability
      const existing = JSON.parse(localStorage.getItem('cp_my_bookings') || '[]');
      existing.unshift(bookingPayload);
      localStorage.setItem('cp_my_bookings', JSON.stringify(existing));

      // 2. Transmit to backend API
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      }).catch(err => {
        console.warn('Backend offline, saved locally to client store:', err);
      });

      setConfirmedBookingId(generatedId);
      setSubmittedSuccess(true);
      setIsSubmitting(false);
      showToast('Booking submitted successfully! 🎉', 'success');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
      setErrorMessage('Unable to submit your booking. Please check your network connection and try again.');
      showToast('Failed to submit booking', 'error');
    }
  };

  const handleResetForm = () => {
    setSubmittedSuccess(false);
    setConfirmedBookingId('');
    setFormData(prev => ({
      ...prev,
      projectDescription: '',
      estimatedBudget: '',
      additionalRequirements: ''
    }));
  };

  const openWhatsApp = (msg) => {
    const phone = '919159687408';
    const text = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="booking-page" style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* ── HEADER ── */}
      <section className="hero" style={{ padding: '56px 0 64px' }}>
        <div className="container">
          <div className="hero-content" style={{ maxWidth: '800px' }}>
            <span className="section-eyebrow">BOOK YOUR SERVICE</span>
            <h1 style={{ fontSize: 'clamp(2.1rem, 4.5vw, 3rem)', marginBottom: '14px', lineHeight: '1.2' }}>
              Plan Your Construction Requirement with Mason Mate
            </h1>
            <p className="hero-desc" style={{ fontSize: '1.05rem', margin: 0, opacity: 0.9 }}>
              Choose a service, provide your requirements, and submit your booking request for immediate on-site consultation and certified civil engineering support.
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN FORM SECTION ── */}
      <div className="container" style={{ marginTop: '-32px', position: 'relative', zIndex: 10 }}>
        {/* SUCCESS STATE */}
        {submittedSuccess ? (
          <div
            className="card"
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              padding: '48px 36px',
              textAlign: 'center',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-xl)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div
              style={{
                width: '76px',
                height: '76px',
                background: '#ECFDF5',
                color: '#059669',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                marginBottom: '20px',
                border: '2px solid #A7F3D0'
              }}
            >
              ✓
            </div>

            <h2 style={{ fontSize: '1.9rem', color: 'var(--primary)', marginBottom: '10px' }}>
              Booking Submitted Successfully
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 24px', lineHeight: '1.6' }}>
              Thank you, <strong>{formData.fullName}</strong>. Your construction booking request has been logged. Our lead civil engineer will contact you shortly to confirm site arrangements.
            </p>

            {/* Reference Badge */}
            <div
              style={{
                display: 'inline-block',
                background: 'var(--accent-light)',
                border: '2px solid var(--accent)',
                padding: '12px 28px',
                borderRadius: '12px',
                marginBottom: '32px'
              }}
            >
              <span style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--accent)' }}>
                Booking Reference ID
              </span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                {confirmedBookingId}
              </span>
            </div>

            {/* Dossier Breakdown */}
            <div
              style={{
                maxWidth: '560px',
                margin: '0 auto 36px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-light)',
                borderRadius: '14px',
                padding: '20px 24px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Booking Type:</span>
                <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{bookingType.replace('_', ' ')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Contact Phone:</span>
                <strong>{formData.phone}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Site Location:</span>
                <strong>{formData.location}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Scheduled Date:</span>
                <strong style={{ color: 'var(--accent)' }}>{formData.preferredDate}</strong>
              </div>
            </div>

            {/* Action CTAs */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-accent btn-lg"
                onClick={() => openWhatsApp(`Hello Mason Mate! I have submitted a booking with ID: ${confirmedBookingId}. Please share confirmation.`)}
              >
                💬 Chat on WhatsApp
              </button>
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={handleResetForm}
              >
                Done / Book Another
              </button>
              <Link to="/" className="btn btn-primary btn-lg">
                🏠 Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* BOOKING FORM CONTAINER */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1.15fr)',
              gap: '32px',
              alignItems: 'start'
            }}
            className="booking-form-wrapper"
          >
            {/* ── LEFT: FORM FIELDS ── */}
            <div
              className="card"
              style={{
                borderRadius: '20px',
                padding: '36px',
                boxShadow: 'var(--shadow-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)'
              }}
            >
              <form onSubmit={handleSubmitBooking}>
                {/* ERROR STATE BANNER */}
                {errorMessage && (
                  <div
                    style={{
                      background: '#FEF2F2',
                      border: '1.5px solid #F87171',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      marginBottom: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#991B1B', display: 'block', fontSize: '0.95rem' }}>Unable to submit your booking.</strong>
                      <span style={{ color: '#B91C1C', fontSize: '0.88rem' }}>{errorMessage}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ borderColor: '#F87171', color: '#991B1B', background: '#fff' }}
                      onClick={() => setErrorMessage('')}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* ──────────────────────────────────────────────────
                    STEP 1: BOOKING TYPE
                ────────────────────────────────────────────────── */}
                <div style={{ marginBottom: '36px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span
                      style={{
                        background: 'var(--primary)',
                        color: '#fff',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800
                      }}
                    >
                      1
                    </span>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0 }}>
                      STEP 1: Choose Booking Type
                    </h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 18px 38px' }}>
                    Select the service category that matches your immediate site requirement.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '14px'
                    }}
                  >
                    {BOOKING_TYPES.map(type => {
                      const isSelected = bookingType === type.id;
                      return (
                        <div
                          key={type.id}
                          onClick={() => setBookingType(type.id)}
                          style={{
                            padding: '18px',
                            borderRadius: '14px',
                            border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border-light)'}`,
                            background: isSelected ? 'var(--accent-light)' : 'var(--bg-main)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '1.8rem' }}>{type.icon}</span>
                            {type.badge && (
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '50px',
                                  background: isSelected ? 'var(--accent)' : 'var(--bg-surface)',
                                  color: isSelected ? '#fff' : 'var(--text-muted)',
                                  border: '1px solid ' + (isSelected ? 'var(--accent)' : 'var(--border-light)')
                                }}
                              >
                                {type.badge}
                              </span>
                            )}
                          </div>
                          <h4 style={{ fontSize: '1.02rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)', marginBottom: '4px' }}>
                            {type.title}
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                            {type.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ──────────────────────────────────────────────────
                    STEP 2: YOUR DETAILS
                ────────────────────────────────────────────────── */}
                <div style={{ marginBottom: '36px', paddingTop: '28px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span
                      style={{
                        background: 'var(--primary)',
                        color: '#fff',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800
                      }}
                    >
                      2
                    </span>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0 }}>
                      STEP 2: Your Details
                    </h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 18px 38px' }}>
                    Enter contact details so our Salem civil engineering coordination team can reach you.
                  </p>

                  <div className="grid-2">
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        Full Name <span style={{ color: 'var(--accent)' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control"
                        placeholder="e.g. Rajesh Kumar"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        style={{ height: '46px', borderRadius: '10px' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        Phone Number <span style={{ color: 'var(--accent)' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="e.g. +91 9159687408"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{ height: '46px', borderRadius: '10px' }}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        Email Address <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ height: '46px', borderRadius: '10px' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        Site / Project Location <span style={{ color: 'var(--accent)' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="e.g. Fairlands, Salem or Saravanampatti, CBE"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        style={{ height: '46px', borderRadius: '10px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* ──────────────────────────────────────────────────
                    STEP 3: SERVICE DETAILS (DYNAMIC)
                ────────────────────────────────────────────────── */}
                <div style={{ marginBottom: '36px', paddingTop: '28px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span
                      style={{
                        background: 'var(--primary)',
                        color: '#fff',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800
                      }}
                    >
                      3
                    </span>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0 }}>
                      STEP 3: Service Details
                    </h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 18px 38px' }}>
                    Provide specific parameters based on your selected booking type.
                  </p>

                  {/* ── CASE A: CONSTRUCTION SERVICE ── */}
                  {bookingType === 'construction' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Select Construction Service <span style={{ color: 'var(--accent)' }}>*</span>
                        </label>
                        <select
                          name="selectedService"
                          className="form-control"
                          value={formData.selectedService}
                          onChange={handleChange}
                          style={{ height: '46px', borderRadius: '10px' }}
                        >
                          {CONSTRUCTION_SERVICES.map(srv => (
                            <option key={srv} value={srv}>{srv}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid-2">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                            Preferred Start Date <span style={{ color: 'var(--accent)' }}>*</span>
                          </label>
                          <input
                            type="date"
                            name="preferredDate"
                            className="form-control"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            required
                            style={{ height: '46px', borderRadius: '10px' }}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                            Expected Duration
                          </label>
                          <select
                            name="duration"
                            className="form-control"
                            value={formData.duration}
                            onChange={handleChange}
                            style={{ height: '46px', borderRadius: '10px' }}
                          >
                            <option value="1-2 Weeks">1 – 2 Weeks (Minor Works)</option>
                            <option value="1-3 Months">1 – 3 Months (Structural/Finishing)</option>
                            <option value="6-9 Months">6 – 9 Months (Full Turnkey Villa)</option>
                            <option value="12+ Months">12+ Months (Commercial/Multi-Unit)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Workforce / Crew Size Needed
                        </label>
                        <select
                          name="workersCount"
                          className="form-control"
                          value={formData.workersCount}
                          onChange={handleChange}
                          style={{ height: '46px', borderRadius: '10px' }}
                        >
                          <option value="1">1 Master Mason / Mistri</option>
                          <option value="2">2 Masons + 2 Helpers (Standard Crew)</option>
                          <option value="4">4 Masons + 4 Helpers (Heavy Brickwork)</option>
                          <option value="8">8+ Specialized Structural Team</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* ── CASE B: TOOL RENTAL ── */}
                  {bookingType === 'tool_rental' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Select Tool / Machinery <span style={{ color: 'var(--accent)' }}>*</span>
                        </label>
                        <select
                          name="selectedTool"
                          className="form-control"
                          value={formData.selectedTool}
                          onChange={handleChange}
                          style={{ height: '46px', borderRadius: '10px' }}
                        >
                          {initialToolsData.map(tool => (
                            <option key={tool._id || tool.id} value={tool.name}>
                              {tool.icon} {tool.name} — ₹{tool.price}/Day
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid-2">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                            Rental Start Date <span style={{ color: 'var(--accent)' }}>*</span>
                          </label>
                          <input
                            type="date"
                            name="preferredDate"
                            className="form-control"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            required
                            style={{ height: '46px', borderRadius: '10px' }}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                            Rental Duration
                          </label>
                          <select
                            name="duration"
                            className="form-control"
                            value={formData.duration}
                            onChange={handleChange}
                            style={{ height: '46px', borderRadius: '10px' }}
                          >
                            <option value="1 Day">1 Day</option>
                            <option value="3 Days">3 Days</option>
                            <option value="1 Week">1 Week (7 Days)</option>
                            <option value="2 Weeks">2 Weeks</option>
                            <option value="1 Month">1 Month (30 Days)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Quantity Needed
                        </label>
                        <select
                          name="toolQuantity"
                          className="form-control"
                          value={formData.toolQuantity}
                          onChange={handleChange}
                          style={{ height: '46px', borderRadius: '10px' }}
                        >
                          <option value="1">1 Unit</option>
                          <option value="2">2 Units</option>
                          <option value="3">3 Units</option>
                          <option value="5+">5+ Units (Bulk On-Site Setup)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* ── CASE C: PROJECT ESTIMATE ── */}
                  {bookingType === 'estimate' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Select Project Classification <span style={{ color: 'var(--accent)' }}>*</span>
                        </label>
                        <select
                          name="projectType"
                          className="form-control"
                          value={formData.projectType}
                          onChange={handleChange}
                          style={{ height: '46px', borderRadius: '10px' }}
                        >
                          {PROJECT_TYPES.map(pt => (
                            <option key={pt} value={pt}>{pt}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid-2">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                            Target Start Date / Inspection Date <span style={{ color: 'var(--accent)' }}>*</span>
                          </label>
                          <input
                            type="date"
                            name="preferredDate"
                            className="form-control"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            required
                            style={{ height: '46px', borderRadius: '10px' }}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                            Project Time Horizon
                          </label>
                          <select
                            name="duration"
                            className="form-control"
                            value={formData.duration}
                            onChange={handleChange}
                            style={{ height: '46px', borderRadius: '10px' }}
                          >
                            <option value="Immediate (This Month)">Immediate (This Month)</option>
                            <option value="Next 1-3 Months">Next 1 – 3 Months</option>
                            <option value="Planning for Next Year">Planning Stage (Next Year)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── CASE D: GENERAL ENQUIRY ── */}
                  {bookingType === 'enquiry' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Enquiry Subject / Topic <span style={{ color: 'var(--accent)' }}>*</span>
                        </label>
                        <select
                          name="enquirySubject"
                          className="form-control"
                          value={formData.enquirySubject}
                          onChange={handleChange}
                          style={{ height: '46px', borderRadius: '10px' }}
                        >
                          <option value="Free Site Inspection & Plot Feasibility">Free Site Inspection &amp; Plot Feasibility</option>
                          <option value="Soil Testing & Structural Drawing Inquiry">Soil Testing &amp; Structural Drawing Inquiry</option>
                          <option value="Subcontractor & Equipment Fleet Requirement">Subcontractor &amp; Equipment Fleet Requirement</option>
                          <option value="Material Quality & Vastu Consultation">Material Quality &amp; Vastu Consultation</option>
                          <option value="General Question / Customer Support">General Question / Customer Support</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Preferred Callback / Visit Date <span style={{ color: 'var(--accent)' }}>*</span>
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          className="form-control"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          required
                          style={{ height: '46px', borderRadius: '10px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ──────────────────────────────────────────────────
                    PROJECT REQUIREMENTS
                ────────────────────────────────────────────────── */}
                <div style={{ marginBottom: '36px', paddingTop: '28px', borderTop: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '18px' }}>
                    PROJECT REQUIREMENTS
                  </h3>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Project Description
                    </label>
                    <textarea
                      name="projectDescription"
                      className="form-control"
                      rows={3}
                      placeholder="Describe your site condition, plot dimensions (e.g. 30x40 ft), structural requirements, or masonry scope..."
                      value={formData.projectDescription}
                      onChange={handleChange}
                      style={{ borderRadius: '10px', minHeight: '100px' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Estimated Budget (₹ INR)
                    </label>
                    <input
                      type="text"
                      name="estimatedBudget"
                      className="form-control"
                      placeholder="e.g. ₹25 Lakhs – ₹40 Lakhs or ₹5,000 / Day"
                      value={formData.estimatedBudget}
                      onChange={handleChange}
                      style={{ height: '46px', borderRadius: '10px' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Additional Requirements
                    </label>
                    <textarea
                      name="additionalRequirements"
                      className="form-control"
                      rows={2}
                      placeholder="Specific cement brand (e.g. UltraTech, Dalmia), Fe550D TMT steel grade, scaffolding delivery access, electricity connection on site..."
                      value={formData.additionalRequirements}
                      onChange={handleChange}
                      style={{ borderRadius: '10px', minHeight: '80px' }}
                    />
                  </div>

                  {/* Payment Preference */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Preferred Payment / Verification Mode
                    </label>
                    <select
                      name="paymentMode"
                      className="form-control"
                      value={formData.paymentMode}
                      onChange={handleChange}
                      style={{ height: '46px', borderRadius: '10px' }}
                    >
                      <option value="Cash on Site Consultation">Cash on Site Consultation (Zero Advance)</option>
                      <option value="UPI / Google Pay (Milestone Billing)">UPI / Google Pay (Milestone Billing)</option>
                      <option value="Bank NEFT / RTGS Transfer">Bank NEFT / RTGS Transfer</option>
                      <option value="Credit / Debit Card">Credit / Debit Card</option>
                    </select>
                  </div>
                </div>

                {/* ──────────────────────────────────────────────────
                    SUBMIT BUTTON
                ────────────────────────────────────────────────── */}
                <div style={{ paddingTop: '12px' }}>
                  <button
                    type="submit"
                    id="btn-submit-booking"
                    className="btn btn-quote-cta btn-lg btn-full"
                    disabled={isSubmitting}
                    style={{
                      height: '52px',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    {isSubmitting ? '⏳ Submitting Booking Request...' : 'Submit Booking Request →'}
                  </button>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
                    🔒 100% Free Initial Site Assessment • No Obligation • Salem &amp; Coimbatore Coverage
                  </p>
                </div>
              </form>
            </div>

            {/* ── RIGHT: SUMMARY CARD ── */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div
                style={{
                  background: 'var(--bg-dark)',
                  color: '#fff',
                  padding: '30px',
                  borderRadius: '20px',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📋 Booking Summary
                  </h4>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: 'rgba(217, 119, 6, 0.2)',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      padding: '3px 10px',
                      borderRadius: '50px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {bookingType.replace('_', ' ')}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Service Focus:</span>
                    <strong style={{ color: '#fff', textAlign: 'right', maxWidth: '180px' }}>
                      {bookingType === 'construction' && formData.selectedService}
                      {bookingType === 'tool_rental' && formData.selectedTool}
                      {bookingType === 'estimate' && formData.projectType}
                      {bookingType === 'enquiry' && formData.enquirySubject}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Site Location:</span>
                    <strong style={{ color: '#fff' }}>{formData.location || 'Not Specified'}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Scheduled Date:</span>
                    <strong style={{ color: 'var(--accent)' }}>{formData.preferredDate || 'Select Date'}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Timeline:</span>
                    <strong style={{ color: '#fff' }}>{formData.duration}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Payment Mode:</span>
                    <strong style={{ color: '#fff' }}>{formData.paymentMode}</strong>
                  </div>
                </div>

                {/* Assurance Box */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginTop: '24px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '3px' }}>
                        Mason Mate Assurance
                      </strong>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.45' }}>
                        Licensed civil engineer plot inspection, calibrated IS 456 standard materials, and transparent stage-wise signoffs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Contact Phone */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
                    Prefer instant assistance?
                  </span>
                  <a
                    href="tel:+919159687408"
                    style={{
                      color: 'var(--accent)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    📞 +91 9159687408
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
