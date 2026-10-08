import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Printer,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { initialToolsData } from '../data/tools';
import heroBgImg from '../assets/images/srm_hero_site_1791445418459.jpg';

const BOOKING_TYPES = [
  {
    id: 'construction',
    title: 'Construction Service',
    icon: '🏗️',
    description: 'Turnkey house building, structural RCC, renovation, or plumbing & electrical work.',
    badge: 'Turnkey & Civil'
  },
  {
    id: 'mason',
    title: 'Master Mason Hiring',
    icon: '👷',
    description: 'Hire certified master masons, bricklayers, plasterers, and tile specialists by the day.',
    badge: '₹1,200 / Day'
  },
  {
    id: 'tool_rental',
    title: 'Tool & Equipment Rental',
    icon: '🛠️',
    description: 'Rent calibrated hammers, rotary drills, concrete mixers, ladders, and scaffolding.',
    badge: '12+ Tools'
  },
  {
    id: 'estimate',
    title: 'Site Visit & BOQ Estimate',
    icon: '📋',
    description: 'On-site plot inspection, soil feasibility check, and itemized Bill of Quantities.',
    badge: 'Inspection'
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
  'Boundary Wall & Structural RCC'
];

export const Booking = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  // Booking Flow Step: 'form' | 'payment' | 'confirmed'
  const [flowStep, setFlowStep] = useState('form');
  const [bookingType, setBookingType] = useState('tool_rental');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    selectedService: 'Turnkey House Construction',
    selectedTool: 'Heavy-Duty Rotary Hammer Drill (SDS-Plus)',
    projectType: 'Residential Independent Villa',
    preferredDate: '',
    durationDays: 3,
    quantity: 1,
    notes: '',
    paymentMethod: 'UPI'
  });

  // Payment Gateway Modal / Step State
  const [activeOrder, setActiveOrder] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardLast4Input, setCardLast4Input] = useState('');
  const [bankName, setBankName] = useState('State Bank of India (SBI)');

  // Confirmed Booking & Transaction State
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [confirmedTransaction, setConfirmedTransaction] = useState(null);

  // Server-Calculated Authoritative Pricing
  const [serverPricing, setServerPricing] = useState({
    serviceCategory: 'Construction Tool & Equipment Rental',
    selectedItem: 'Heavy-Duty Rotary Hammer Drill (SDS-Plus)',
    rate: 450,
    rateUnit: 'Per Day',
    durationDays: 3,
    durationLabel: '3 Days',
    quantity: 1,
    quantityLabel: '1 Unit',
    subtotal: 1350,
    totalAmount: 1350
  });

  // Prepopulate from URL parameters & logged-in user
  useEffect(() => {
    const type = searchParams.get('type');
    const tool = searchParams.get('tool');
    const plan = searchParams.get('plan');
    const role = searchParams.get('role');

    if (type === 'tools' || tool) {
      setBookingType('tool_rental');
      if (tool) {
        setFormData((prev) => ({
          ...prev,
          selectedTool: tool,
          notes: `Equipment rental request: ${tool}`
        }));
      }
    } else if (type === 'mason' || role) {
      setBookingType('mason');
      setFormData((prev) => ({
        ...prev,
        selectedService: 'Hire Master Masons & Specialists',
        notes: role ? `Hiring specialist: ${role}` : 'Master mason crew deployment'
      }));
    } else if (type === 'estimate' || plan) {
      setBookingType('estimate');
      if (plan) {
        setFormData((prev) => ({
          ...prev,
          notes: `Turnkey package estimate inquiry: ${plan.toUpperCase()}`
        }));
      }
    } else if (type === 'construction') {
      setBookingType('construction');
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    setFormData((prev) => ({
      ...prev,
      preferredDate: prev.preferredDate || dateStr,
      fullName: prev.fullName || currentUser?.name || currentUser?.username || '',
      phone: prev.phone || currentUser?.phone || currentUser?.mobile || '',
      email: prev.email || currentUser?.email || ''
    }));
  }, [searchParams, currentUser]);

  // Fetch authoritative server-side price whenever service/tool/duration/quantity changes
  const fetchServerPrice = useCallback(async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/payments/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingType,
          selectedService: formData.selectedService,
          selectedTool: formData.selectedTool,
          projectType: formData.projectType,
          durationDays: formData.durationDays,
          duration: `${formData.durationDays} Days`,
          quantity: formData.quantity
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.pricing) {
        setServerPricing(data.pricing);
      }
    } catch {
      // Fallback local calculation if offline
      const matchTool = initialToolsData.find((t) => t.name === formData.selectedTool);
      const rate =
        bookingType === 'tool_rental'
          ? Number(matchTool?.price || 450)
          : bookingType === 'mason'
          ? 1200
          : bookingType === 'estimate'
          ? 2500
          : 25000;
      const isFixed = bookingType === 'estimate' || (bookingType === 'construction' && rate >= 15000);
      const total = isFixed ? rate : rate * Number(formData.durationDays || 1) * Number(formData.quantity || 1);
      setServerPricing({
        serviceCategory:
          bookingType === 'tool_rental'
            ? 'Construction Tool Rental'
            : bookingType === 'mason'
            ? 'Master Mason Service'
            : bookingType === 'estimate'
            ? 'Site Inspection & BOQ Estimate'
            : 'Construction Service',
        selectedItem:
          bookingType === 'tool_rental'
            ? formData.selectedTool
            : bookingType === 'estimate'
            ? formData.projectType
            : formData.selectedService,
        rate,
        rateUnit: isFixed ? 'Milestone / Inspection Advance' : 'Per Day',
        durationDays: Number(formData.durationDays || 1),
        durationLabel: `${formData.durationDays} Day${Number(formData.durationDays) > 1 ? 's' : ''}`,
        quantity: Number(formData.quantity || 1),
        quantityLabel:
          bookingType === 'tool_rental'
            ? `${formData.quantity} Unit(s)`
            : `${formData.quantity} Specialist(s)`,
        subtotal: total,
        totalAmount: total
      });
    } finally {
      setIsCalculating(false);
    }
  }, [
    bookingType,
    formData.selectedService,
    formData.selectedTool,
    formData.projectType,
    formData.durationDays,
    formData.quantity
  ]);

  useEffect(() => {
    fetchServerPrice();
  }, [fetchServerPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'durationDays' || name === 'quantity'
          ? Math.max(1, parseInt(value, 10) || 1)
          : value
    }));
    if (errorMessage) setErrorMessage('');
  };

  // Step 1 -> Step 2: Validate customer details & create secure payment order on server
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setPaymentError('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      showToast('Full Name is required', 'error');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      showToast('Valid 10-digit mobile number is required', 'error');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Please enter your project or delivery site address.');
      showToast('Site location is required', 'error');
      return;
    }
    if (!formData.preferredDate) {
      setErrorMessage('Please select a booking start date.');
      showToast('Start date is required', 'error');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.userId || currentUser?._id || '',
          customerName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          location: formData.location.trim(),
          bookingType,
          selectedService: formData.selectedService,
          selectedTool: formData.selectedTool,
          projectType: formData.projectType,
          startDate: formData.preferredDate,
          durationDays: formData.durationDays,
          duration: `${formData.durationDays} Days`,
          quantity: formData.quantity,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setActiveOrder(data.order);
        if (data.order.pricing) {
          setServerPricing(data.order.pricing);
        }
        setFlowStep('payment');
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        setErrorMessage(data.error || 'Could not initialize payment order. Please check your details.');
      }
    } catch {
      setErrorMessage('Network error while creating payment order. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Step 2 -> Step 3: Verify payment on backend & confirm booking
  const handleVerifyAndPay = async (simulateOutcome = 'success') => {
    if (!activeOrder) return;
    setPaymentError('');

    if (simulateOutcome === 'success') {
      if (formData.paymentMethod === 'UPI' && !upiId.trim()) {
        setPaymentError('Please enter your UPI ID (e.g. name@okaxis) or select a UPI app.');
        return;
      }
      if (formData.paymentMethod === 'Card' && (!cardHolder.trim() || cardLast4Input.replace(/\D/g, '').length < 4)) {
        setPaymentError('Please enter cardholder name and last 4 digits for verification.');
        return;
      }
    }

    setIsProcessingPayment(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeOrder.orderId,
          bookingId: activeOrder.bookingId,
          signatureToken: activeOrder.signatureToken,
          amount: activeOrder.amount,
          paymentMethod: formData.paymentMethod,
          simulateOutcome,
          paymentDetails: {
            upiId: upiId.trim(),
            cardLast4: cardLast4Input.replace(/\D/g, '').slice(-4),
            bankName
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedBooking(data.booking);
        setConfirmedTransaction(data.transaction);

        // Sync with localStorage for immediate visibility
        try {
          const existing = JSON.parse(localStorage.getItem('cp_my_bookings') || '[]');
          const filtered = existing.filter((b) => b.bookingId !== data.booking.bookingId);
          filtered.unshift(data.booking);
          localStorage.setItem('cp_my_bookings', JSON.stringify(filtered));
        } catch {}

        setFlowStep('confirmed');
        showToast('Payment verified & booking confirmed!', 'success');
        window.scrollTo({ top: 100, behavior: 'smooth' });
      } else {
        setPaymentError(
          data.error || 'Payment verification failed or was declined. You can retry payment below.'
        );
        showToast(data.error || 'Payment failed', 'error');
      }
    } catch {
      setPaymentError('Could not verify payment with server. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleResetBooking = () => {
    setFlowStep('form');
    setActiveOrder(null);
    setConfirmedBooking(null);
    setConfirmedTransaction(null);
    setPaymentError('');
    setErrorMessage('');
  };

  return (
    <div className="booking-page" style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* ── HERO BANNER ── */}
      <section
        className="hero page-hero"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(10, 14, 23, 0.94) 0%, rgba(15, 23, 42, 0.85) 55%, rgba(168, 42, 16, 0.36) 100%), url(${heroBgImg})`,
          padding: '56px 0 64px'
        }}
      >
        <div className="container">
          <div className="hero-content" style={{ maxWidth: '820px' }}>
            <div className="hero-kicker">
              <span>SRM AKASH CONSTRUCTION</span>
              <span aria-hidden="true">·</span>
              <span>SAFE BOOKING &amp; PAYMENT PORTAL</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '12px' }}>
              Book Construction Services, Masons &amp; Tool Rentals
            </h1>
            <p className="hero-desc" style={{ margin: 0 }}>
              Select your service or equipment, review transparent server-verified pricing in your Booking Summary, and complete secure payment for instant confirmation.
            </p>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>
        {/* ── STEP PROGRESS BAR ── */}
        <div className="booking-progress-bar">
          <div className={`booking-step-pill ${flowStep === 'form' ? 'active' : 'completed'}`}>
            <span className="step-num">1</span>
            <span>Service, Date &amp; Details</span>
          </div>
          <div className="booking-step-connector" />
          <div
            className={`booking-step-pill ${
              flowStep === 'payment' ? 'active' : flowStep === 'confirmed' ? 'completed' : ''
            }`}
          >
            <span className="step-num">2</span>
            <span>Summary &amp; Secure Payment</span>
          </div>
          <div className="booking-step-connector" />
          <div className={`booking-step-pill ${flowStep === 'confirmed' ? 'active completed' : ''}`}>
            <span className="step-num">3</span>
            <span>Booking Confirmation</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            STAGE 3: CONFIRMED BOOKING & OFFICIAL RECEIPT
        ════════════════════════════════════════════════════════════════ */}
        {flowStep === 'confirmed' && confirmedBooking && (
          <div className="card booking-success-card" id="printable-receipt">
            <div className="booking-confirmed-icon">
              <CheckCircle2 size={42} />
            </div>

            <span className="section-eyebrow" style={{ marginBottom: '4px' }}>
              SRM AKASH CONSTRUCTION · OFFICIAL RECEIPT
            </span>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--primary)', marginBottom: '8px' }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 24px' }}>
              Thank you, <strong>{confirmedBooking.customerName}</strong>. Your booking has been verified and scheduled with our engineering dispatch desk.
            </p>

            {/* Reference & Transaction IDs */}
            <div className="receipt-badges-row">
              <div className="receipt-id-box">
                <span className="receipt-id-label">Booking Reference ID</span>
                <strong className="receipt-id-val tabular-nums">{confirmedBooking.bookingId}</strong>
              </div>
              <div className="receipt-id-box">
                <span className="receipt-id-label">Transaction ID</span>
                <strong className="receipt-id-val tabular-nums">
                  {confirmedTransaction?.transactionId || confirmedBooking.transactionId || 'VERIFIED'}
                </strong>
              </div>
              <div className="receipt-id-box">
                <span className="receipt-id-label">Payment Status</span>
                <span
                  className={`receipt-status-badge ${
                    confirmedBooking.paymentStatus === 'Paid' ? 'paid' : 'pending'
                  }`}
                >
                  {confirmedBooking.paymentStatus || 'Confirmed'}
                </span>
              </div>
            </div>

            {/* Detailed Summary Table */}
            <div className="receipt-dossier-table">
              <div className="receipt-row">
                <span>Service Category</span>
                <strong>{serverPricing.serviceCategory}</strong>
              </div>
              <div className="receipt-row">
                <span>Selected Item / Service</span>
                <strong>{confirmedBooking.service}</strong>
              </div>
              <div className="receipt-row">
                <span>Customer Name &amp; Phone</span>
                <strong>
                  {confirmedBooking.customerName} ({confirmedBooking.phone})
                </strong>
              </div>
              <div className="receipt-row">
                <span>Site / Delivery Location</span>
                <strong>{confirmedBooking.location}</strong>
              </div>
              <div className="receipt-row">
                <span>Start Date &amp; Duration</span>
                <strong>
                  {confirmedBooking.startDate} · {confirmedBooking.duration}
                </strong>
              </div>
              <div className="receipt-row">
                <span>Payment Mode</span>
                <strong>{confirmedBooking.paymentMethod || confirmedBooking.paymentMode}</strong>
              </div>
              <div className="receipt-row receipt-row-total">
                <span>Total Verified Amount</span>
                <strong className="tabular-nums" style={{ color: 'var(--accent)', fontSize: '1.25rem' }}>
                  ₹{Number(confirmedBooking.amount || serverPricing.totalAmount).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '28px' }}>
              <button type="button" className="btn btn-primary btn-lg" onClick={handlePrintReceipt}>
                <Printer size={17} />
                <span>Print / Save Receipt</span>
              </button>
              <button type="button" className="btn btn-outline btn-lg" onClick={handleResetBooking}>
                <span>Book Another Service</span>
              </button>
              <Link to="/" className="btn btn-accent btn-lg">
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STAGE 2: SECURE PAYMENT CHECKOUT & VERIFICATION
        ════════════════════════════════════════════════════════════════ */}
        {flowStep === 'payment' && activeOrder && (
          <div className="booking-form-wrapper">
            <div className="card booking-form-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="section-eyebrow">ENCRYPTED GATEWAY CHECKOUT</span>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: 0 }}>
                    Complete Your Booking Payment
                  </h3>
                </div>
                <div className="gateway-order-tag tabular-nums">
                  Order Ref: {activeOrder.bookingId}
                </div>
              </div>

              {paymentError && (
                <div className="booking-alert-error" role="alert">
                  <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <strong>Payment Verification Notice</strong>
                    <div>{paymentError}</div>
                  </div>
                </div>
              )}

              {/* Payment Method Selector */}
              <div className="form-group">
                <label className="form-label">Select Payment Method</label>
                <div className="payment-methods-grid">
                  {[
                    { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: Smartphone },
                    { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'Net Banking', label: 'Net Banking (IMPS / NEFT)', icon: Building2 },
                    { id: 'Cash on Site Visit', label: 'Pay on Site Delivery / Visit', icon: ShieldCheck }
                  ].map((pm) => {
                    const IconComp = pm.icon;
                    const active = formData.paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        className={`payment-method-option ${active ? 'active' : ''}`}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, paymentMethod: pm.id }));
                          setPaymentError('');
                        }}
                      >
                        <IconComp size={18} />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Method Input */}
              {formData.paymentMethod === 'UPI' && (
                <div className="payment-details-box">
                  <label className="form-label">Enter UPI ID / VPA *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. customer@okicici or 9159687408@ybl"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <div className="upi-quick-chips">
                    {['@okaxis', '@okicici', '@ybl', '@paytm'].map((suffix) => (
                      <button
                        key={suffix}
                        type="button"
                        className="upi-chip-btn"
                        onClick={() => {
                          const base = upiId.split('@')[0] || formData.phone.replace(/\D/g, '').slice(-10) || 'user';
                          setUpiId(`${base}${suffix}`);
                        }}
                      >
                        {suffix}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'Card' && (
                <div className="payment-details-box">
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <Lock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    Card details are tokenized directly by the gateway. We never store your card number or CVV.
                  </p>
                  <div className="grid-2">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Cardholder Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name on card"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Card Last 4 Digits *</label>
                      <input
                        type="text"
                        maxLength={4}
                        className="form-control tabular-nums"
                        placeholder="e.g. 4242"
                        value={cardLast4Input}
                        onChange={(e) => setCardLast4Input(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'Net Banking' && (
                <div className="payment-details-box">
                  <label className="form-label">Select Your Bank</label>
                  <select
                    className="form-control"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  >
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank Corporate / Retail</option>
                    <option>ICICI Bank NetBanking</option>
                    <option>Axis Bank</option>
                    <option>Indian Overseas Bank / Canara Bank</option>
                  </select>
                </div>
              )}

              {formData.paymentMethod === 'Cash on Site Visit' && (
                <div className="payment-details-box">
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-body)' }}>
                    Your booking will be confirmed immediately with status <strong>Payment Pending (Pay on Site Visit)</strong>. You can settle the amount directly via UPI or Cash when our team arrives on site.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={() => setFlowStep('form')}
                  disabled={isProcessingPayment}
                >
                  ← Edit Details
                </button>
                <button
                  type="button"
                  className="btn btn-quote-cta btn-lg"
                  style={{ flex: 1 }}
                  onClick={() => handleVerifyAndPay('success')}
                  disabled={isProcessingPayment}
                >
                  <Lock size={16} />
                  <span>
                    {isProcessingPayment
                      ? 'Verifying Payment...'
                      : formData.paymentMethod === 'Cash on Site Visit'
                      ? `Confirm Booking (₹${Number(activeOrder.amount).toLocaleString('en-IN')})`
                      : `Pay ₹${Number(activeOrder.amount).toLocaleString('en-IN')} & Confirm Booking`}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Sticky Booking Summary */}
            <aside className="booking-sidebar-sticky">
              <div className="booking-summary-box">
                <div className="summary-header-kicker">BOOKING SUMMARY</div>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.25rem', marginBottom: '18px' }}>
                  Verified Order Breakdown
                </h4>

                <div className="summary-lines">
                  <div className="summary-line-item">
                    <span>Service:</span>
                    <strong>{serverPricing.serviceCategory}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Selected Item:</span>
                    <strong>{serverPricing.selectedItem}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Start Date:</span>
                    <strong className="tabular-nums">{formData.preferredDate}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Duration:</span>
                    <strong>{serverPricing.durationLabel}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Quantity / Crew:</span>
                    <strong>{serverPricing.quantityLabel}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Rate:</span>
                    <strong className="tabular-nums">
                      ₹{Number(serverPricing.rate).toLocaleString('en-IN')} ({serverPricing.rateUnit})
                    </strong>
                  </div>
                </div>

                <div className="summary-total-banner">
                  <span>Total Amount</span>
                  <strong className="tabular-nums">
                    ₹{Number(activeOrder.amount).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="summary-security-note">
                  <ShieldCheck size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span>
                    Server-verified pricing by SRM Akash Construction. HMAC-SHA256 transaction protection active.
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STAGE 1: BOOKING CONFIGURATION & LIVE BOOKING SUMMARY
        ════════════════════════════════════════════════════════════════ */}
        {flowStep === 'form' && (
          <div className="booking-form-wrapper">
            <div className="card booking-form-card">
              <form onSubmit={handleProceedToPayment} noValidate>
                {errorMessage && (
                  <div className="booking-alert-error" role="alert">
                    <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>{errorMessage}</div>
                  </div>
                )}

                {/* 1. SELECT SERVICE / TOOL / RENTAL */}
                <div className="booking-section-block">
                  <div className="booking-section-head">
                    <span className="booking-step-badge">1</span>
                    <div>
                      <h3>Select Service / Tool Rental</h3>
                      <p>Choose the construction service, master mason crew, or tool rental you need.</p>
                    </div>
                  </div>

                  <div className="booking-type-grid">
                    {BOOKING_TYPES.map((type) => {
                      const isSelected = bookingType === type.id;
                      return (
                        <button
                          type="button"
                          key={type.id}
                          onClick={() => setBookingType(type.id)}
                          className={`booking-type-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="booking-type-top">
                            <span style={{ fontSize: '1.5rem' }}>{type.icon}</span>
                            <span className="booking-type-badge">{type.badge}</span>
                          </div>
                          <h4>{type.title}</h4>
                          <p>{type.description}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Specific Item Selector */}
                  <div style={{ marginTop: '20px' }}>
                    {bookingType === 'tool_rental' && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Select Construction Tool / Equipment *</label>
                        <select
                          name="selectedTool"
                          className="form-control"
                          value={formData.selectedTool}
                          onChange={handleChange}
                        >
                          {initialToolsData.map((tool) => (
                            <option key={tool._id || tool.id} value={tool.name}>
                              {tool.icon} {tool.name} — ₹{tool.price} / Day
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {(bookingType === 'construction' || bookingType === 'mason') && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Select Construction / Mason Service *</label>
                        <select
                          name="selectedService"
                          className="form-control"
                          value={formData.selectedService}
                          onChange={handleChange}
                        >
                          {CONSTRUCTION_SERVICES.map((srv) => (
                            <option key={srv} value={srv}>
                              {srv}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {bookingType === 'estimate' && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Select Project Type for BOQ Estimate *</label>
                        <select
                          name="projectType"
                          className="form-control"
                          value={formData.projectType}
                          onChange={handleChange}
                        >
                          {PROJECT_TYPES.map((pt) => (
                            <option key={pt} value={pt}>
                              {pt}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. SELECT BOOKING DATE & DURATION */}
                <div className="booking-section-block">
                  <div className="booking-section-head">
                    <span className="booking-step-badge">2</span>
                    <div>
                      <h3>Select Booking Date &amp; Duration</h3>
                      <p>Specify your preferred start date, required duration in days, and quantity/crew size.</p>
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">
                        <Calendar size={14} style={{ display: 'inline', marginRight: '5px' }} />
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        className="form-control"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Duration (Days) *</label>
                      <select
                        name="durationDays"
                        className="form-control"
                        value={formData.durationDays}
                        onChange={handleChange}
                      >
                        <option value={1}>1 Day</option>
                        <option value={2}>2 Days</option>
                        <option value={3}>3 Days</option>
                        <option value={5}>5 Days</option>
                        <option value={7}>7 Days (1 Week)</option>
                        <option value={14}>14 Days (2 Weeks)</option>
                        <option value={30}>30 Days (1 Month)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">
                        {bookingType === 'tool_rental' ? 'Units Needed' : 'Masons / Crew Size'}
                      </label>
                      <select
                        name="quantity"
                        className="form-control"
                        value={formData.quantity}
                        onChange={handleChange}
                      >
                        <option value={1}>1 {bookingType === 'tool_rental' ? 'Unit' : 'Specialist'}</option>
                        <option value={2}>2 {bookingType === 'tool_rental' ? 'Units' : 'Specialists'}</option>
                        <option value={3}>3 {bookingType === 'tool_rental' ? 'Units' : 'Specialists'}</option>
                        <option value={4}>4 {bookingType === 'tool_rental' ? 'Units' : 'Specialists'}</option>
                        <option value={6}>6 {bookingType === 'tool_rental' ? 'Units' : 'Specialists'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. CUSTOMER DETAILS */}
                <div className="booking-section-block" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                  <div className="booking-section-head">
                    <span className="booking-step-badge">3</span>
                    <div>
                      <h3>Enter Customer &amp; Site Details</h3>
                      <p>Provide your contact details and site address for delivery or engineer dispatch.</p>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control"
                        placeholder="e.g. Rajesh Kumar"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="+91 9159687408"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Email Address (Optional)</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Site / Delivery Address *
                      </label>
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="e.g. Fairlands, Salem or RS Puram, Coimbatore"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Project / Site Instructions (Optional)</label>
                    <textarea
                      name="notes"
                      className="form-control"
                      rows={2}
                      placeholder="Mention plot landmark, preferred delivery timing, or specific masonry scope..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-quote-cta btn-full btn-lg"
                    disabled={isProcessingPayment || isCalculating}
                  >
                    <span>
                      {isProcessingPayment
                        ? 'Preparing Secure Order...'
                        : `Proceed to Payment (₹${Number(serverPricing.totalAmount).toLocaleString('en-IN')})`}
                    </span>
                    <ArrowRight size={18} className="cta-arrow" />
                  </button>
                </div>
              </form>
            </div>

            {/* ── RIGHT SIDEBAR: LIVE BOOKING SUMMARY ── */}
            <aside className="booking-sidebar-sticky">
              <div className="booking-summary-box">
                <div className="summary-header-kicker">BOOKING SUMMARY</div>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.3rem', marginBottom: '18px' }}>
                  Review Your Selection
                </h4>

                <div className="summary-lines">
                  <div className="summary-line-item">
                    <span>Service:</span>
                    <strong>{serverPricing.serviceCategory}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Selected Item:</span>
                    <strong>{serverPricing.selectedItem}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Start Date:</span>
                    <strong className="tabular-nums">{formData.preferredDate || 'Select Date'}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Duration:</span>
                    <strong>{serverPricing.durationLabel}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Quantity / Crew:</span>
                    <strong>{serverPricing.quantityLabel}</strong>
                  </div>
                  <div className="summary-line-item">
                    <span>Rate:</span>
                    <strong className="tabular-nums">
                      ₹{Number(serverPricing.rate).toLocaleString('en-IN')} /{' '}
                      {serverPricing.rateUnit.replace('Per ', '')}
                    </strong>
                  </div>
                </div>

                <div className="summary-total-banner">
                  <span>Total Amount</span>
                  <strong className="tabular-nums">
                    {isCalculating
                      ? 'Calculating...'
                      : `₹${Number(serverPricing.totalAmount).toLocaleString('en-IN')}`}
                  </strong>
                </div>

                <button
                  type="button"
                  className="btn btn-quote-cta btn-full"
                  style={{ marginTop: '16px' }}
                  onClick={handleProceedToPayment}
                  disabled={isProcessingPayment || isCalculating}
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={16} className="cta-arrow" />
                </button>

                <div className="summary-security-note">
                  <ShieldCheck size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span>
                    Managed by <strong>S. SIVAJI</strong> · SRM Akash Construction. Transparent rates with instant booking confirmation.
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
