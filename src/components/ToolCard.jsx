import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { RentalModal } from './RentalModal';

export const ToolCard = ({ tool, onRentNow }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [localModalOpen, setLocalModalOpen] = useState(false);

  if (!tool) return null;

  const status = tool.availabilityStatus || (tool.available !== false ? 'Available' : 'Rented');
  const isAvailable = status === 'Available';
  const isMaintenance = status === 'Maintenance';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(tool);
    showToast(`Added ${tool.name} to equipment cart! 🛒`, 'success');
  };

  const handleRentNowClick = (e) => {
    e.stopPropagation();
    if (onRentNow) {
      onRentNow(tool);
    } else {
      setLocalModalOpen(true);
    }
  };

  const openWhatsAppQuote = (e) => {
    e.stopPropagation();
    const phone = '919159687408';
    const text = encodeURIComponent(
      `Hello Mason Mate! I want to inquire about renting: ${tool.name} (₹${tool.price || 0}/${tool.period || 'day'}). Is it available for site delivery?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const categoryFormatted = (tool.category || 'Equipment')
    .replace('-', ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const priceNum = Number(tool.price || 0);

  return (
    <>
      <div 
        className="tool-card" 
        id={`tool-card-${tool._id || tool.id}`}
      >
        {/* 1. Tool Image Container with 4:3 Aspect Ratio, 14px Radius, Soft Background */}
        <div className="tool-card-media">
          {/* Availability Badge */}
          <div className={`tool-avail-badge ${isAvailable ? 'avail-in-stock' : isMaintenance ? 'avail-maintenance' : 'avail-rented'}`}>
            <span className="avail-dot" />
            <span>{status}</span>
          </div>

          {/* Quick Cart Button */}
          <button 
            type="button"
            className="tool-quick-cart-btn"
            onClick={handleAddToCart}
            title="Add to Cart"
            disabled={isMaintenance}
            id={`add-cart-btn-${tool._id || tool.id}`}
          >
            🛒 +
          </button>

          {tool.image ? (
            <img 
              src={tool.image} 
              alt={tool.name} 
              className="tool-card-img"
              loading="lazy"
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
            style={{ display: tool.image ? 'none' : 'flex' }}
          >
            <span>{tool.icon || '🛠️'}</span>
          </div>
        </div>

        {/* 2. Tool Card Body */}
        <div className="tool-card-body">
          <div className="tool-card-info">
            {/* Category */}
            <div className="tool-category">
              {categoryFormatted}
            </div>

            {/* Tool Name */}
            <h3 className="tool-name" title={tool.name}>
              {tool.name}
            </h3>

            {/* Specs / Description snippet */}
            <p className="tool-desc">
              {tool.specs ? tool.specs.split(',').slice(0, 2).join(', ') : (tool.desc || 'Heavy-duty construction equipment calibrated for dependable site performance.')}
            </p>
          </div>

          {/* Price & Delivery Row */}
          <div className="tool-footer-content">
            <div className="tool-price-row">
              <div className="tool-price">
                <span className="price-currency">₹</span>
                <span className="price-amount">{priceNum.toLocaleString('en-IN')}</span>
                <span className="price-unit"> / Day</span>
              </div>
              <div className="tool-delivery-tag">
                🚚 {tool.contactOption || 'Site Delivery'}
              </div>
            </div>

            {/* Actions */}
            <div className="tool-actions">
              <button
                type="button"
                className="btn btn-accent btn-full btn-rent-now"
                onClick={handleRentNowClick}
                disabled={isMaintenance}
                id={`rent-now-btn-${tool._id || tool.id}`}
              >
                {isMaintenance ? 'Under Maintenance' : '⚡ Rent Now'}
              </button>

              <button
                type="button"
                className="btn btn-outline btn-full btn-sm btn-tool-inquire"
                onClick={openWhatsAppQuote}
                title="Quick WhatsApp Inquiry"
              >
                💬 WhatsApp Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback local rental modal if not triggered from parent container */}
      {!onRentNow && (
        <RentalModal 
          isOpen={localModalOpen} 
          onClose={() => setLocalModalOpen(false)} 
          tool={tool}
        />
      )}
    </>
  );
};

export default ToolCard;
