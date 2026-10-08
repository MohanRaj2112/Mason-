import React, { useState } from 'react';
import { RentalModal } from './RentalModal';
import { ToolDetailsModal } from './ToolDetailsModal';
import { getOneLineSpecification } from '../utils/specsParser';
import { useToast } from '../context/ToastContext';
import equipmentImg from '../assets/images/srm_equipment_rental_1791445442334.jpg';

export const ToolCard = ({ tool, isRecommended: explicitRecommended }) => {
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

  // Exactly ONE short, accurate specification line based on real existing specs
  const oneLineSpec = getOneLineSpecification(tool);

  // Recommendation status
  const isRecommended = explicitRecommended !== undefined
    ? explicitRecommended
    : Boolean(tool.featured || tool.isRecommended);

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
        <div
          className="tool-card-media"
          onClick={handleViewDetailsClick}
          role="button"
          tabIndex={0}
          title="Click to view details"
        >
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
          <div className="tool-media-top-bar">
            <span className="tool-category-tag">
              {tool.category ? tool.category.replace(/-/g, ' ') : 'Equipment'}
            </span>
            {isRecommended && (
              <span className="tool-recommended-badge">
                Recommended
              </span>
            )}
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

          {/* Single-line Specification Rule: ONE line, no multiple lines */}
          <div className="tool-compact-spec-line" title={oneLineSpec || 'Industrial Grade • Calibrated'}>
            {oneLineSpec || 'Industrial Grade • Calibrated'}
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
              <span>View Details</span>
            </button>
            <button
              type="button"
              className="btn btn-tool-rent-action"
              onClick={handleRentNowClick}
              disabled={statusClass === 'maintenance'}
              title="Rent this equipment"
            >
              <span>Rent Tool</span>
            </button>
          </div>
        </div>
      </article>

      {/* Full Tool Details Modal */}
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
