import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Wrench, Eye } from 'lucide-react';
import { RentalModal } from './RentalModal';
import { ToolDetailsModal } from './ToolDetailsModal';
import { getToolSpecifications } from '../utils/specsParser';
import { useToast } from '../context/ToastContext';
import equipmentImg from '../assets/images/equipment_rental_fleet_1790694712199.jpg';

export const ToolCard = ({ tool }) => {
  const { showToast } = useToast();
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (!tool) return null;

  const toolId = tool._id || tool.id || 'tool';
  const status = tool.availabilityStatus || (tool.available !== false ? 'Available' : 'Rented');
  let statusClass = 'available';
  let statusText = 'Available';

  if (status === 'Rented' || status === 'In Use') {
    statusClass = 'rented';
    statusText = 'In Use';
  } else if (status === 'Maintenance') {
    statusClass = 'maintenance';
    statusText = 'Maintenance';
  }

  const cleanPeriod = tool.period ? tool.period.replace(/^Per\s+/i, '') : 'Day';
  const imageSrc = tool.image || tool.imageUrl || equipmentImg;
  const priceVal = Number(tool.price || tool.pricePerDay || 0);

  // Extract real specifications only (limit to top 3-4 for clean compact card presentation)
  const allSpecs = getToolSpecifications(tool);
  const displaySpecs = allSpecs.slice(0, 4);

  const handleRentNowClick = (e) => {
    e.stopPropagation();
    if (statusClass === 'maintenance') {
      showToast('This tool is currently undergoing calibration and maintenance.', 'error');
      return;
    }
    setShowRentalModal(true);
  };

  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    setShowDetailsModal(true);
  };

  return (
    <>
      <article className="tool-compact-card" id={`tool-${toolId}`}>
        {/* Tool Media */}
        <div className="tool-card-media" onClick={handleViewDetailsClick} role="button" tabIndex={0} title="Click to view details">
          <img
            src={imageSrc}
            alt={tool.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = equipmentImg;
            }}
          />
          <div className="tool-media-scrim" />
          <div className="tool-media-top-bar">
            <span className="tool-category-tag">
              {tool.category ? tool.category.replace(/-/g, ' ') : 'Equipment'}
            </span>
            <span className={`tool-availability-badge ${statusClass}`}>
              {statusClass === 'available' && <CheckCircle2 size={13} />}
              {statusClass === 'rented' && <Clock size={13} />}
              {statusClass === 'maintenance' && <AlertCircle size={13} />}
              <span>{statusText}</span>
            </span>
          </div>
        </div>

        {/* Tool Card Content */}
        <div className="tool-compact-body">
          {/* Prominent Tool Name */}
          <div className="tool-title-wrap">
            <h3 className="tool-prominent-name" title={tool.name}>
              {tool.name}
            </h3>
          </div>

          {/* Specifications Section (No long descriptions) */}
          <div className="tool-compact-specs-box">
            <div className="tool-specs-heading">Specifications</div>
            {displaySpecs.length > 0 ? (
              <div className="tool-specs-compact-grid">
                {displaySpecs.map((spec, idx) => (
                  <div key={idx} className="tool-spec-row">
                    <span className="tool-spec-key">{spec.key}</span>
                    <span className="tool-spec-val" title={spec.value}>{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : tool.specs ? (
              <div className="tool-spec-single-line" title={tool.specs}>
                {tool.specs}
              </div>
            ) : (
              <div className="tool-spec-placeholder">
                Site Calibrated &bull; Heavy-Duty
              </div>
            )}
          </div>

          {/* Price / Availability */}
          <div className="tool-price-avail-section">
            <div className="tool-compact-price">
              <span className="tool-compact-price-figure">
                ₹{priceVal.toLocaleString('en-IN')}
              </span>
              <span className="tool-compact-period">/ {cleanPeriod}</span>
            </div>
            <div className={`tool-status-inline ${statusClass}`}>
              <span className="status-indicator-dot" />
              <span>{statusText}</span>
            </div>
          </div>

          {/* Action Buttons: [View Details] [Rent Tool] */}
          <div className="tool-compact-actions">
            <button
              type="button"
              className="btn btn-tool-details"
              onClick={handleViewDetailsClick}
              title="View full description and specifications"
            >
              <Eye size={15} />
              <span>View Details</span>
            </button>
            <button
              type="button"
              className="btn btn-accent btn-tool-rent-action"
              onClick={handleRentNowClick}
              disabled={statusClass === 'maintenance'}
              title="Rent this equipment"
            >
              <Wrench size={15} />
              <span>Rent Tool</span>
            </button>
          </div>
        </div>
      </article>

      {/* Tool Details Modal */}
      <ToolDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        tool={tool}
        onRentClick={() => {
          setShowDetailsModal(false);
          setShowRentalModal(true);
        }}
      />

      {/* Rental Booking Modal */}
      <RentalModal
        isOpen={showRentalModal}
        onClose={() => setShowRentalModal(false)}
        tool={tool}
        onSuccess={() => {
          setShowRentalModal(false);
          showToast(`Rental booking confirmed for ${tool.name}!`, 'success');
        }}
      />
    </>
  );
};

export default ToolCard;
