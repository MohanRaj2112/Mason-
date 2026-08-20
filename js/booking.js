// ── MASON MATE – MULTI-STEP BOOKING & ESTIMATION ENGINE ── //

let currentStep = 1;
let bookingState = {
    service: 'Turnkey House Construction',
    rateEstimate: '₹1,799/sq.ft',
    custName: '',
    custPhone: '',
    custEmail: '',
    custAddress: '',
    startDate: '',
    endDate: '',
    workerCount: 1,
    projSize: 1200,
    specialNotes: '',
    paymentMode: 'UPI',
    estimatedAdvance: 0,
    bookingId: ''
};

document.addEventListener('DOMContentLoaded', () => {
    initBookingFromQueryParams();
    initFieldListeners();
    updateSummary();
});

// URL Query Param pre-selection (e.g. ?type=tools&tool=Drill)
function initBookingFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get('type');
    const specificTool = params.get('tool');
    const requestedService = params.get('service');

    if (specificTool) {
        bookingState.service = 'Tool & Equipment Rental: ' + decodeURIComponent(specificTool);
        highlightSelectedService('Tool & Equipment Rental');
    } else if (requestedService) {
        bookingState.service = decodeURIComponent(requestedService);
        highlightSelectedService(bookingState.service);
    } else if (serviceType === 'tools') {
        bookingState.service = 'Tool & Equipment Rental';
        highlightSelectedService('Tool & Equipment Rental');
    } else if (serviceType === 'mason') {
        bookingState.service = 'Master Mason Hiring';
        highlightSelectedService('Master Mason Hiring');
    } else {
        highlightSelectedService('Turnkey House Construction');
    }

    // Default start date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('startDate');
    if (dateInput && !dateInput.value) {
        dateInput.value = tomorrow.toISOString().split('T')[0];
        bookingState.startDate = dateInput.value;
    }
}

function highlightSelectedService(serviceName) {
    const cards = document.querySelectorAll('.stype-card');
    cards.forEach(card => {
        const title = card.querySelector('.sn')?.textContent?.trim() || '';
        if (title.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(title.toLowerCase())) {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        }
    });
}

function initFieldListeners() {
    ['custName', 'custPhone', 'custEmail', 'custAddress', 'custNotes'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                bookingState[id] = el.value.trim();
                updateSummary();
            });
        }
    });

    const startEl = document.getElementById('startDate');
    if (startEl) {
        startEl.addEventListener('change', () => {
            bookingState.startDate = startEl.value;
            updateSummary();
        });
    }

    const endEl = document.getElementById('endDate');
    if (endEl) {
        endEl.addEventListener('change', () => {
            bookingState.endDate = endEl.value;
            updateSummary();
        });
    }

    const workerEl = document.getElementById('workerCount');
    if (workerEl) {
        workerEl.addEventListener('change', () => {
            const val = workerEl.value;
            bookingState.workerCount = val.includes('+') ? 6 : parseInt(val || '1');
            updateSummary();
        });
    }

    const sizeEl = document.getElementById('projSize');
    if (sizeEl) {
        sizeEl.addEventListener('input', () => {
            bookingState.projSize = parseInt(sizeEl.value || '0');
            updateSummary();
        });
    }
}

// Step 1: Select Service
function selectService(cardEl, serviceName, rateEstimate) {
    document.querySelectorAll('.stype-card').forEach(c => c.classList.remove('selected'));
    if (cardEl) cardEl.classList.add('selected');

    bookingState.service = serviceName;
    bookingState.rateEstimate = rateEstimate;

    const err = document.getElementById('serviceError');
    if (err) err.style.display = 'none';

    updateSummary();
}

// Step 3: Select Payment Method
function selectPayMethod(el, method) {
    document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
    if (el) el.classList.add('selected');

    bookingState.paymentMode = method;

    const upi = document.getElementById('upiPanel');
    const card = document.getElementById('cardPanel');

    if (upi) upi.style.display = method === 'UPI' ? 'block' : 'none';
    if (card) card.style.display = method === 'Card' ? 'block' : 'none';

    updateSummary();
}

// Wizard Step Navigation
function goStep(step) {
    // Validate Step 1 -> Step 2
    if (step === 2 && currentStep === 1) {
        if (!bookingState.service) {
            const err = document.getElementById('serviceError');
            if (err) err.style.display = 'block';
            showToast('Please select a service to proceed.', 'error');
            return;
        }
    }

    // Validate Step 2 -> Step 3
    if (step === 3 && currentStep === 2) {
        const name = document.getElementById('custName')?.value.trim();
        const phone = document.getElementById('custPhone')?.value.trim();
        const address = document.getElementById('custAddress')?.value.trim();
        const start = document.getElementById('startDate')?.value.trim();

        if (!name || !phone || !address || !start) {
            const err = document.getElementById('detailsError');
            if (err) err.style.display = 'block';
            showToast('Please fill all required fields marked with *.', 'error');
            return;
        } else {
            const err = document.getElementById('detailsError');
            if (err) err.style.display = 'none';
        }

        bookingState.custName = name;
        bookingState.custPhone = phone;
        bookingState.custAddress = address;
        bookingState.startDate = start;
        bookingState.custEmail = document.getElementById('custEmail')?.value.trim() || '';
        const workerVal = document.getElementById('workerCount')?.value || '1';
        bookingState.workerCount = workerVal.includes('+') ? 6 : parseInt(workerVal);
        bookingState.projSize = parseInt(document.getElementById('projSize')?.value || '0');
    }

    currentStep = step;

    // Switch active panel
    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById(`panel${step}`);
    if (targetPanel) targetPanel.classList.add('active');

    // Update Progress Step Circles & Connectors
    for (let i = 1; i <= 4; i++) {
        const sc = document.getElementById(`sc${i}`);
        const sl = document.getElementById(`sl${i}`);
        const conn = document.getElementById(`conn${i}`);

        if (sc && sl) {
            if (i < step) {
                sc.className = 'step-circle done';
                sc.textContent = '✓';
                sl.className = 'step-label active';
            } else if (i === step) {
                sc.className = 'step-circle active';
                sc.textContent = i;
                sl.className = 'step-label active';
            } else {
                sc.className = 'step-circle';
                sc.textContent = i;
                sl.className = 'step-label';
            }
        }
        if (conn) {
            conn.className = i < step ? 'step-connector done' : 'step-connector';
        }
    }

    updateSummary();
    window.scrollTo({ top: 180, behavior: 'smooth' });
}

// Real-time Summary & Estimation Math
function updateSummary() {
    const sumService = document.getElementById('sumService');
    const sumDate = document.getElementById('sumDate');
    const sumDuration = document.getElementById('sumDuration');
    const sumWorkers = document.getElementById('sumWorkers');
    const sumSize = document.getElementById('sumSize');
    const sumPayment = document.getElementById('sumPayment');
    const sumTotal = document.getElementById('sumTotal');

    let estAdvance = 0;

    if (bookingState.service === 'Free Site Measurement') {
        estAdvance = 0;
    } else if (bookingState.service === 'Master Mason Hiring') {
        estAdvance = (bookingState.workerCount * 900) * 3; // 3-day deposit
    } else if (bookingState.service.includes('Tool') || bookingState.service.includes('Equipment')) {
        estAdvance = 1500;
    } else if (bookingState.service === 'Roofing & Waterproofing') {
        const sqft = bookingState.projSize || 800;
        estAdvance = Math.round(sqft * 350 * 0.3); // 30% advance
    } else if (bookingState.service === 'Renovation & Remodeling') {
        const sqft = bookingState.projSize || 500;
        estAdvance = Math.round(sqft * 799 * 0.25);
    } else {
        // Turnkey House Construction
        const sqft = bookingState.projSize || 1200;
        estAdvance = Math.round(sqft * 1799 * 0.05); // 5% token reservation
    }

    bookingState.estimatedAdvance = estAdvance;

    if (sumService) sumService.textContent = bookingState.service || 'House Construction';
    if (sumDate) sumDate.textContent = bookingState.startDate ? formatDate(bookingState.startDate) : 'Not Set';
    if (sumDuration) {
        if (bookingState.startDate && bookingState.endDate) {
            const diffDays = Math.ceil((new Date(bookingState.endDate) - new Date(bookingState.startDate)) / (1000 * 60 * 60 * 24));
            sumDuration.textContent = diffDays > 0 ? `${diffDays} Days` : '1 Month';
        } else {
            sumDuration.textContent = bookingState.service === 'Free Site Measurement' ? '1 Day (Site Visit)' : 'Standard Milestone';
        }
    }
    if (sumWorkers) sumWorkers.textContent = `${bookingState.workerCount} Worker${bookingState.workerCount > 1 ? 's' : ''}`;
    if (sumSize) sumSize.textContent = bookingState.projSize > 0 ? `${bookingState.projSize.toLocaleString('en-IN')} Sq.Ft` : '—';
    if (sumPayment) sumPayment.textContent = bookingState.paymentMode;
    if (sumTotal) {
        sumTotal.textContent = estAdvance === 0 ? '₹0 (Free Visit)' : `₹${estAdvance.toLocaleString('en-IN')}`;
    }
}

function formatDate(dStr) {
    try {
        const d = new Date(dStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return dStr;
    }
}

// Process Payment and Final Submission
async function processPayment() {
    const btn = event?.currentTarget;
    if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ Processing Booking...';
    }

    const bookingId = 'MM-' + Math.floor(100000 + Math.random() * 900000);
    bookingState.bookingId = bookingId;

    const payload = {
        bookingId: bookingId,
        customerName: bookingState.custName || 'Valued Client',
        phone: bookingState.custPhone || '+91 9159687408',
        email: bookingState.custEmail,
        service: bookingState.service,
        startDate: bookingState.startDate || new Date().toISOString().split('T')[0],
        workers: bookingState.workerCount,
        paymentMode: bookingState.paymentMode,
        amount: bookingState.estimatedAdvance,
        status: 'Pending'
    };

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data && data.booking && data.booking.bookingId) {
            bookingState.bookingId = data.booking.bookingId;
        }
    } catch (err) {
        console.warn('Booking API fetch error (using local storage fallback):', err);
    }

    // Save to localStorage for client-side persistence
    try {
        const userBookings = JSON.parse(localStorage.getItem('cp_my_bookings') || '[]');
        userBookings.unshift({ ...payload, bookingId: bookingState.bookingId, date: new Date().toISOString() });
        localStorage.setItem('cp_my_bookings', JSON.stringify(userBookings));
    } catch (e) {
        console.error(e);
    }

    // Update Confirmation screen
    const confirmEl = document.getElementById('confirmId');
    if (confirmEl) confirmEl.textContent = bookingState.bookingId;

    goStep(4);
    showToast(`Booking ${bookingState.bookingId} Confirmed! 🎉`, 'success', 5000);

    if (btn) {
        btn.disabled = false;
        btn.textContent = '🔒 Confirm Booking & Pay Advance';
    }
}
