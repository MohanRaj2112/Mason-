import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

export const RentalModal = ({ isOpen, onClose, tool, onSuccess }) => {
  const { showToast } = useToast();

  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryType, setDeliveryType] = useState('site_delivery');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Initialize dates and reset on modal open
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDate(tomorrow.toISOString().split('T')[0]);
      setDurationDays(3);
      setQuantity(1);
      setDeliveryType('site_delivery');
      setNotes('');
      setErrors({});
      setIsSubmitting(false);
      setBookingConfirmed(null);

      // Pre-fill user details from localStorage if available
      try {
        const savedAuth = localStorage.getItem('mm_user');
        if (savedAuth) {
          const user = JSON.parse(savedAuth);
          if (user.username && !customerName) setCustomerName(user.username);
          if (user.mobile && !phone) setPhone(user.mobile);
        }
      } catch {}
    }
  }, [isOpen, tool]);

  if (!isOpen || !tool) return null;

  const pricePerDay = Number(tool.price || 0);
  const totalRent = pricePerDay * durationDays * quantity;

  const validate = () => {
    const errs = {};
    if (!customerName.trim()) {
      errs.customerName = 'Please enter your full name.';
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit phone number.';
    }
    if (!location.trim()) {
      errs.location = 'Please enter your site delivery / project location.';
    }
    if (!startDate) {
      errs.startDate = 'Please select a rental start date.';
    }
    if (durationDays < 1) {
      errs.duration = 'Rental duration must be at least 1 day.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDurationPreset = (days) => {
    setDurationDays(days);
    if (errors.duration) {
      setErrors(prev => ({ ...prev, duration: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const bookingId = 'MM-TR-' + Math.floor(100000 + Math.random() * 900000);
    const bookingPayload = {
      bookingId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      service: `Tool Rental: ${tool.name}`,
      toolName: tool.name,
      toolId: tool._id || tool.id,
      quantity,
      duration: `${durationDays} Day${durationDays > 1 ? 's' : ''}`,
      durationDays,
      startDate,
      location: location.trim(),
      deliveryType,
      amount: totalRent,
      paymentMode: 'Cash / UPI on Site Delivery',
      notes: notes.trim() || 'Direct equipment rental via fast transaction flow',
      status: 'Confirmed',
      bookingType: 'tool_rental',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save to local storage for instant Admin visibility
      const existing = JSON.parse(localStorage.getItem('cp_my_bookings') || '[]');
      existing.unshift(bookingPayload);
      localStorage.setItem('cp_my_bookings', JSON.stringify(existing));

      // 2. Transmit to backend API
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      }).catch(err => {
        console.warn('Backend sync saved to client store:', err);
      });

      setBookingConfirmed(bookingPayload);
      setIsSubmitting(false);
      showToast(`Rental request for ${tool.name} submitted! 🎉`, 'success');
      if (onSuccess) onSuccess(bookingPayload);
    } catch (err) {
      console.error('Rental submission failed:', err);
      setIsSubmitting(false);
      setErrors({ form: 'Submission failed. Please check your network connection.' });
      showToast('Could not complete rental request', 'error');
    }
  };

  const openWhatsAppConfirmation = () => {
    if (!bookingConfirmed) return;
    const phoneNum = '919159687408';
    const text = encodeURIComponent(
      `Hello Mason Mate! I have submitted a Tool Rental request (ID: ${bookingConfirmed.bookingId}) for:\n` +
      `🛠️ Tool: ${bookingConfirmed.toolName}\n` +
      `📅 Start Date: ${bookingConfirmed.startDate} (${bookingConfirmed.duration})\n` +
      `💰 Total: ₹${bookingConfirmed.amount.toLocaleString('en-IN')}\n` +
      `📍 Location: ${bookingConfirmed.location}\n` +
      `👤 Name: ${bookingConfirmed.customerName} (${bookingConfirmed.phone})\n` +
      `Please confirm equipment dispatch timing.`
    );
    window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rental-modal-overlay" onClick={onClose} id="rental-modal-backdrop">
      <div 
        className="rental-modal-container" 
        onClick={(e) => e.stopPropagation()}
        id="rental-modal-content"
      >
        {/* Modal Header */}
        <div className="rental-modal-header">
          <div>
            <span className="rental-modal-eyebrow">EQUIPMENT RENTAL</span>
            <h3 className="rental-modal-title">
              {bookingConfirmed ? 'Rental Request Confirmed' : `Rent ${tool.name}`}
            </h3>
          </div>
          <button 
            className="rental-modal-close" 
            onClick={onClose} 
            title="Close"
            id="close-rental-modal-btn"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Either Confirmed Success Screen or Step-by-Step Form */}
        {bookingConfirmed ? (
          <div className="rental-success-view">
            <div className="rental-success-icon">✓</div>
            <h4 className="rental-success-title">Rental Request Submitted</h4>
            <p className="rental-success-desc">
              Your tool rental request has been successfully submitted to the Mason Mate equipment yard.
            </p>

            <div className="rental-summary-box">
              <div className="summary-row">
                <span className="summary-label">Reference ID:</span>
                <strong className="summary-val text-accent">{bookingConfirmed.bookingId}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Equipment:</span>
                <strong className="summary-val">{bookingConfirmed.toolName}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Quantity:</span>
                <span className="summary-val">{bookingConfirmed.quantity} Unit(s)</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Start Date:</span>
                <span className="summary-val">{bookingConfirmed.startDate}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Duration:</span>
                <span className="summary-val">{bookingConfirmed.duration}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Site Location:</span>
                <span className="summary-val">{bookingConfirmed.location}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total-row">
                <span>Estimated Total:</span>
                <strong className="summary-total-price">₹{bookingConfirmed.amount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <p className="rental-contact-note">
              Our equipment dispatcher will contact you at <strong>{bookingConfirmed.phone}</strong> to confirm delivery logistics.
            </p>

            <div className="rental-success-actions">
              <button 
                className="btn btn-accent btn-full"
                onClick={openWhatsAppConfirmation}
                id="whatsapp-confirm-btn"
              >
                💬 Confirm on WhatsApp
              </button>
              <button 
                className="btn btn-outline btn-full" 
                onClick={onClose}
                id="done-rental-btn"
              >
                Back to Tools Catalog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rental-form-body">
            {/* Tool Summary Snippet */}
            <div className="rental-tool-snippet">
              <div className="rental-tool-thumb">
                {tool.image ? (
                  <img src={tool.image} alt={tool.name} />
                ) : (
                  <span style={{ fontSize: '1.6rem' }}>{tool.icon || '🔨'}</span>
                )}
              </div>
              <div className="rental-tool-info">
                <div className="rental-tool-name">{tool.name}</div>
                <div className="rental-tool-rate">
                  <span className="rate-val">₹{pricePerDay.toLocaleString('en-IN')}</span>
                  <span className="rate-period"> / Day</span>
                </div>
              </div>
            </div>

            {errors.form && (
              <div className="rental-error-banner">
                {errors.form}
              </div>
            )}

            {/* Step 1: Dates & Duration */}
            <div className="rental-form-section">
              <label className="rental-section-label">1. Rental Schedule</label>
              
              <div className="rental-row-2">
                <div className="rental-field">
                  <label className="rental-field-label">Start Date *</label>
                  <input
                    type="date"
                    className={`rental-input ${errors.startDate ? 'input-error' : ''}`}
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (errors.startDate) setErrors(prev => ({ ...prev, startDate: null }));
                    }}
                    required
                  />
                  {errors.startDate && <span className="field-error-text">{errors.startDate}</span>}
                </div>

                <div className="rental-field">
                  <label className="rental-field-label">Quantity</label>
                  <select
                    className="rental-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  >
                    <option value={1}>1 Unit</option>
                    <option value={2}>2 Units</option>
                    <option value={3}>3 Units</option>
                    <option value={4}>4 Units</option>
                    <option value={5}>5+ Units</option>
                  </select>
                </div>
              </div>

              <div className="rental-field" style={{ marginTop: '10px' }}>
                <label className="rental-field-label">
                  Duration (Days): <strong className="text-accent">{durationDays} Day{durationDays > 1 ? 's' : ''}</strong>
                </label>
                
                {/* Duration Presets */}
                <div className="duration-preset-pills">
                  {[1, 2, 3, 5, 7, 14, 30].map(days => (
                    <button
                      key={days}
                      type="button"
                      className={`duration-pill ${durationDays === days ? 'active' : ''}`}
                      onClick={() => handleDurationPreset(days)}
                    >
                      {days === 1 ? '1 Day' : days === 7 ? '1 Week' : days === 14 ? '2 Weeks' : days === 30 ? '1 Month' : `${days} Days`}
                    </button>
                  ))}
                </div>

                <div className="custom-days-row">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or enter custom days:</span>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    className="rental-input custom-days-input"
                    value={durationDays}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setDurationDays(val);
                      if (errors.duration) setErrors(prev => ({ ...prev, duration: null }));
                    }}
                  />
                </div>
                {errors.duration && <span className="field-error-text">{errors.duration}</span>}
              </div>
            </div>

            {/* Step 2: Customer Details */}
            <div className="rental-form-section">
              <label className="rental-section-label">2. Contact &amp; Site Details</label>

              <div className="rental-row-2">
                <div className="rental-field">
                  <label className="rental-field-label">Full Name *</label>
                  <input
                    type="text"
                    className={`rental-input ${errors.customerName ? 'input-error' : ''}`}
                    placeholder="e.g. S. Karthik"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors(prev => ({ ...prev, customerName: null }));
                    }}
                    required
                  />
                  {errors.customerName && <span className="field-error-text">{errors.customerName}</span>}
                </div>

                <div className="rental-field">
                  <label className="rental-field-label">Phone Number *</label>
                  <input
                    type="tel"
                    className={`rental-input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                    }}
                    required
                  />
                  {errors.phone && <span className="field-error-text">{errors.phone}</span>}
                </div>
              </div>

              <div className="rental-field" style={{ marginTop: '10px' }}>
                <label className="rental-field-label">Site / Delivery Address *</label>
                <input
                  type="text"
                  className={`rental-input ${errors.location ? 'input-error' : ''}`}
                  placeholder="e.g. Site #42, Fairlands, Salem or Saravanampatti, CBE"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors(prev => ({ ...prev, location: null }));
                  }}
                  required
                />
                {errors.location && <span className="field-error-text">{errors.location}</span>}
              </div>
            </div>

            {/* Real-time Calculation Summary Banner */}
            <div className="rental-calculation-card">
              <div className="calc-row">
                <span>Daily Rent ({quantity} unit × ₹{pricePerDay}/day):</span>
                <span>₹{(pricePerDay * quantity).toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-row">
                <span>Rental Duration:</span>
                <span>× {durationDays} Day{durationDays > 1 ? 's' : ''}</span>
              </div>
              <div className="calc-divider" />
              <div className="calc-row calc-total-row">
                <span className="calc-total-label">Estimated Total:</span>
                <span className="calc-total-val">₹{totalRent.toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-note">
                ✓ Pay on site delivery &bull; Zero security deposit for verified contractors
              </div>
            </div>

            {/* Modal Actions */}
            <div className="rental-modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
                disabled={isSubmitting}
                style={{ flex: '1' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-accent"
                disabled={isSubmitting}
                style={{ flex: '2' }}
                id="submit-rental-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-inline" /> Processing...
                  </>
                ) : (
                  <>
                    Confirm Rental Request &bull; ₹{totalRent.toLocaleString('en-IN')} →
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
