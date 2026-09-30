import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Calendar, Wrench, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { RentalModal } from './RentalModal';
import equipmentImg from '../assets/images/equipment_rental_fleet_1790694712199.jpg';

export const ToolCard = ({ tool }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [showRentalModal, setShowRentalModal] = useState(false);

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

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(tool);
  };

  const handleRentNowClick = (e) => {
    e.stopPropagation();
    if (statusClass === 'maintenance') {
      showToast('This tool is currently undergoing calibration and maintenance.', 'error');
      return;
    }
    setShowRentalModal(true);
  };

  return (
    <>
      <article className="tool-card" id={`tool-${toolId}`}>
        <div className="tool-card-media">
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

        <div className="tool-card-body">
          <div className="tool-card-info">
            <h3 className="tool-title">{tool.name}</h3>
            <p className="tool-desc">
              {tool.desc || tool.description || 'Heavy-duty construction tool calibrated for reliable on-site performance.'}
            </p>
            {tool.specs && (
              <div className="tool-specs-line">
                <strong>Specs:</strong> {tool.specs}
              </div>
            )}
          </div>

          <div className="tool-card-footer">
            <div className="tool-price-row">
              <div className="tool-price-block tabular-nums">
                <span className="tool-price-label">Rental Rate</span>
                <div className="tool-price-figure">
                  <span className="tool-price-val">
                    ₹{(Number(tool.price) || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="tool-price-period">/ {cleanPeriod}</span>
                </div>
              </div>
              <span className="tool-delivery-note">
                {tool.contactOption || 'Site Delivery'}
              </span>
            </div>

            <div className="tool-card-actions">
              <button
                type="button"
                className="btn btn-accent btn-tool-rent"
                onClick={handleRentNowClick}
                disabled={statusClass === 'maintenance'}
              >
                <Wrench size={15} />
                <span>Rent Tool</span>
              </button>
              <div className="tool-card-subactions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAddToCart}
                  disabled={statusClass === 'maintenance'}
                  title="Add to Equipment Cart"
                >
                  <ShoppingCart size={14} />
                  <span>Add to Cart</span>
                </button>
                <Link
                  to={`/booking?type=tool_rental&tool=${encodeURIComponent(tool.name)}`}
                  className="btn btn-outline btn-sm"
                  title="Book with Site Schedule"
                >
                  <Calendar size={14} />
                  <span>Schedule</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

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
