import React, { useEffect } from 'react';
import { Wrench, ShoppingCart, Calendar, CheckCircle2, Clock, AlertCircle, ShieldAlert, Sparkles, Truck, X } from 'lucide-react';
import { getToolSpecifications } from '../utils/specsParser';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import equipmentImg from '../assets/images/srm_equipment_rental_1791445442334.jpg';

export const ToolDetailsModal = ({ isOpen, onClose, tool, onRentClick }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !tool) return null;

  const specsList = getToolSpecifications(tool);
  const status = tool.availabilityStatus || (tool.available !== false ? 'Available' : 'Rented');
  let statusClass = 'available';
  let statusText = 'Available for Rent';

  if (status === 'Rented' || status === 'In Use') {
    statusClass = 'rented';
    statusText = 'Currently In Use On-Site';
  } else if (status === 'Maintenance') {
    statusClass = 'maintenance';
    statusText = 'Under Calibration / Maintenance';
  }

  const cleanPeriod = tool.period ? tool.period.replace(/^Per\s+/i, '') : 'Day';
  const priceVal = Number(tool.price || tool.pricePerDay || 0);
  const imageSrc = tool.image || tool.imageUrl || equipmentImg;
  const descriptionText = tool.desc || tool.description || 'Professional-grade construction equipment calibrated for civil engineering and masonry sites.';

  // Contextual safety & usage details based on category
  const getSafetyGuideline = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('power') || cat.includes('cut')) {
      return 'Wear ISI-approved eye protection, safety gloves, and heavy-duty ear muffs. Inspect cables for grounding before connecting to site generator/mains.';
    }
    if (cat.includes('mix') || cat.includes('concrete')) {
      return 'Ensure steady level ground positioning. Check diesel engine oil and Greaves lubrication before starting drum rotation. Wear splash goggles.';
    }
    if (cat.includes('roof') || cat.includes('ladder') || cat.includes('scaffold')) {
      return 'Anchor base shoes firmly on solid ground. Use full-body safety harness with dual lanyards when working at heights exceeding 2 meters.';
    }
    if (cat.includes('pump') || cat.includes('plumb')) {
      return 'Keep electric switch box dry and elevated above standing water. Clear suction strainer of large stones before continuous operation.';
    }
    return 'Inspect tool integrity before use. Wear safety footwear and protective gloves in all active construction zones.';
  };

  const handleAddToCart = () => {
    addToCart(tool);
    showToast(`Added ${tool.name} to equipment cart.`, 'success');
  };

  const handleRentNow = () => {
    if (statusClass === 'maintenance') {
      showToast('This tool is currently undergoing maintenance.', 'error');
      return;
    }
    onRentClick(tool);
  };

  return (
    <div
      className="modal-overlay active"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-details-title"
      style={{ zIndex: 1000 }}
    >
      <div
        className="tool-details-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="tool-details-header">
          <div className="tool-details-header-text">
            <span className="tool-details-eyebrow">EQUIPMENT DOSSIER</span>
            <h2 id="tool-details-title" className="tool-details-title">
              {tool.name}
            </h2>
          </div>
          <button
            type="button"
            className="tool-details-close-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="tool-details-body">
          {/* Top Visual & Rate Banner */}
          <div className="tool-details-visual-row">
            <div className="tool-details-image-container">
              <img
                src={imageSrc}
                alt={tool.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = equipmentImg;
                }}
              />
              <span className={`tool-availability-badge ${statusClass} tool-details-badge`}>
                {statusClass === 'available' && <CheckCircle2 size={14} />}
                {statusClass === 'rented' && <Clock size={14} />}
                {statusClass === 'maintenance' && <AlertCircle size={14} />}
                <span>{statusText}</span>
              </span>
            </div>

            <div className="tool-details-meta-card">
              <div className="tool-meta-item">
                <span className="tool-meta-label">Category</span>
                <span className="tool-meta-val" style={{ textTransform: 'capitalize' }}>
                  {tool.category ? tool.category.replace(/-/g, ' ') : 'Site Equipment'}
                </span>
              </div>

              <div className="tool-meta-item">
                <span className="tool-meta-label">Rental Rate</span>
                <div className="tool-rate-display">
                  <span className="tool-rate-currency">₹{priceVal.toLocaleString('en-IN')}</span>
                  <span className="tool-rate-unit">/ {cleanPeriod}</span>
                </div>
              </div>

              <div className="tool-meta-item">
                <span className="tool-meta-label">Site Logistics</span>
                <span className="tool-meta-val">
                  <Truck size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-2px', color: 'var(--accent)' }} />
                  {tool.contactOption || 'Site Delivery Available (Salem & Coimbatore)'}
                </span>
              </div>

              <div className="tool-meta-actions">
                <button
                  type="button"
                  className="btn btn-accent btn-full"
                  onClick={handleRentNow}
                  disabled={statusClass === 'maintenance'}
                >
                  <Wrench size={16} />
                  <span>Rent This Tool</span>
                </button>

                <div className="tool-meta-subactions">
                  <button
                    type="button"
                    className="btn btn-outline btn-full"
                    onClick={handleAddToCart}
                    disabled={statusClass === 'maintenance'}
                  >
                    <ShoppingCart size={15} />
                    <span>Add to Cart</span>
                  </button>
                  <a
                    href={`/booking?type=tool_rental&tool=${encodeURIComponent(tool.name)}`}
                    className="btn btn-secondary btn-full"
                    style={{ textAlign: 'center', textDecoration: 'none' }}
                  >
                    <Calendar size={15} />
                    <span>Site Schedule</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Table / Grid */}
          <div className="tool-details-section">
            <div className="tool-section-title-wrap">
              <Sparkles size={17} className="tool-section-icon" />
              <h3 className="tool-section-title">Specifications</h3>
            </div>

            {specsList.length > 0 ? (
              <div className="tool-specs-table-wrap">
                <table className="tool-specs-table">
                  <tbody>
                    {specsList.map((spec, idx) => (
                      <tr key={idx}>
                        <td className="spec-label-col">{spec.key}</td>
                        <td className="spec-value-col">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="tool-specs-fallback">
                {tool.specs || 'Standard industrial specifications verified for heavy construction use.'}
              </div>
            )}
          </div>

          {/* Full Detailed Description */}
          <div className="tool-details-section">
            <h3 className="tool-section-title">Description &amp; Overview</h3>
            <div className="tool-full-description-text">
              <p>{descriptionText}</p>
            </div>
          </div>

          {/* Safety & Operational Information */}
          <div className="tool-details-section">
            <div className="tool-section-title-wrap">
              <ShieldAlert size={17} style={{ color: '#D97706' }} />
              <h3 className="tool-section-title">Safety &amp; Compliance Guidelines</h3>
            </div>
            <div className="tool-safety-callout">
              <p>{getSafetyGuideline(tool.category)}</p>
              <div className="tool-safety-notes">
                <span>&bull; Checked &amp; calibrated by SRM Akash Construction certified technicians prior to dispatch.</span>
                <span>&bull; On-site operator demo provided upon request at time of delivery.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="tool-details-footer">
          <div className="tool-footer-price-info">
            <span className="footer-price-label">Rental Price:</span>
            <span className="footer-price-val">₹{priceVal.toLocaleString('en-IN')} <small>/ {cleanPeriod}</small></span>
          </div>
          <div className="tool-footer-btn-group">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={handleRentNow}
              disabled={statusClass === 'maintenance'}
            >
              <Wrench size={16} />
              <span>Rent Tool</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailsModal;
