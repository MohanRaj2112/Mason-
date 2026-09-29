import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Calendar, Zap } from 'lucide-react';
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
  const imageSrc = tool.image || tool.imageUrl || equipmentImg;

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
        </div>

        <div className="tool-card-body">
          <div>
            {/* Clean unboxed metadata row */}
            <div className="tool-meta-row">
              <span>{tool.category ? tool.category.replace('-', ' ') : 'Equipment'}</span>
              <span aria-hidden="true">·</span>
              <span className={`tool-status-text ${statusClass}`}>
                {statusText}
              </span>
            </div>

            <h3 className="tool-title">{tool.name}</h3>
            <p className="tool-desc">
              {tool.desc || tool.description || 'Professional site-ready equipment with guaranteed calibration.'}
            </p>
          </div>

          <div>
            <div className="tool-price-row">
              <div className="tabular-nums">
                <span className="tool-price-val">₹{(Number(tool.price) || 0).toLocaleString('en-IN')}</span>
                <span className="tool-price-period">{periodText}</span>
              </div>
              <span className="tool-delivery-note">
                {tool.contactOption || 'Site Delivery'}
              </span>
            </div>

            <div className="tool-card-actions">
              <button
                type="button"
                className="btn btn-primary btn-sm btn-tool-cart"
                onClick={handleAddToCart}
                disabled={statusClass === 'maintenance'}
              >
                <ShoppingCart size={15} />
                <span>Add to Cart</span>
              </button>
              <div className="tool-card-subactions">
                <button
                  type="button"
                  className="btn btn-accent btn-sm"
                  onClick={handleRentNowClick}
                  title="Rent Now"
                >
                  <Zap size={14} />
                  <span>Rent Now</span>
                </button>
                <Link
                  to={`/booking?type=tool_rental&tool=${encodeURIComponent(tool.name)}`}
                  className="btn btn-outline btn-sm"
                  title="Quick Quote"
                >
                  <Calendar size={14} />
                  <span>Quote</span>
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
          showToast(`Booking initiated for ${tool.name}!`, 'success');
        }}
      />
    </>
  );
};

export default ToolCard;
