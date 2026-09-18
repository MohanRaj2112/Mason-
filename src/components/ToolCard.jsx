import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { RentalModal } from './RentalModal';

export const ToolCard = ({ tool }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [showRentalModal, setShowRentalModal] = useState(false);

  if (!tool) return null;

  const toolId = tool._id || tool.id || 'tool';
  const status = tool.availabilityStatus || (tool.available ? 'Available' : 'Rented');
  let statusClass = 'available';
  let statusText = 'Available';

  if (status === 'Rented' || status === 'In Use') {
    statusClass = 'rented';
    statusText = 'In Use';
  } else if (status === 'Maintenance') {
    statusClass = 'maintenance';
    statusText = 'Maintenance';
  }

  const periodText = tool.period ? `/${tool.period.replace('Per ', '')}` : '/Day';
  const imageSrc = tool.image || tool.imageUrl || '';
  const fallbackIcon = tool.icon || '🔨';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(tool);
  };

  const handleRentNowClick = (e) => {
    e.stopPropagation();
    if (status === 'Maintenance') {
      showToast('This tool is currently undergoing maintenance.', 'error');
      return;
    }
    setShowRentalModal(true);
  };

  return (
    <>
      <div className="tool-card" id={`tool-${toolId}`}>
        <div className="tool-card-media">
          {tool.badge && <span className="tool-badge-pill">{tool.badge}</span>}
          <span className={`tool-avail-badge ${statusClass}`}>
            <span className="tool-avail-dot"></span> {statusText}
          </span>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={tool.name}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div
            className="tool-fallback-icon"
            style={{ display: imageSrc ? 'none' : 'flex' }}
          >
            {fallbackIcon}
          </div>
        </div>
        <div className="tool-card-body">
          <div>
            <div className="tool-category-label">
              {tool.category ? tool.category.replace('-', ' ').toUpperCase() : 'EQUIPMENT'}
            </div>
            <h3 className="tool-title">{tool.name}</h3>
            <p className="tool-desc">
              {tool.desc || tool.description || 'Professional site-ready equipment with guaranteed calibration.'}
            </p>
          </div>
          <div>
            <div className="tool-price-row">
              <div>
                <span className="tool-price-val">₹{(Number(tool.price) || 0).toLocaleString('en-IN')}</span>
                <span className="tool-price-period">{periodText}</span>
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {tool.contactOption || 'Site Delivery'}
              </span>
            </div>
            <div className="tool-card-actions">
              <button
                className="btn btn-primary btn-sm btn-tool-cart"
                onClick={handleAddToCart}
                disabled={statusClass === 'maintenance'}
              >
                🛒 Add to Cart
              </button>
              <div className="tool-card-subactions">
                <button
                  type="button"
                  className="btn btn-accent btn-sm"
                  onClick={handleRentNowClick}
                  title="Rent Now"
                >
                  ⚡ Rent
                </button>
                <Link
                  to={`/booking?type=tool_rental&tool=${encodeURIComponent(tool.name)}`}
                  className="btn btn-outline btn-sm"
                  title="Quick Quote"
                >
                  📅 Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RentalModal
        isOpen={showRentalModal}
        onClose={() => setShowRentalModal(false)}
        tool={tool}
        onSuccess={() => {
          setShowRentalModal(false);
          showToast(`Booking initiated for ${tool.name}!`, 'success');
        }}
      />
    </>
  );
};

