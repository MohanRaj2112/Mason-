import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { RentalModal } from './RentalModal';

export const ToolCard = ({ tool, onRentNow }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [localModalOpen, setLocalModalOpen] = useState(false);

  if (!tool) return null;

  // Determine canonical status based on tool availability data
  const rawStatus = (tool.availabilityStatus || '').trim();
  let statusText = 'Available';
  let statusClass = 'status-available';
  let isActionable = true;

  if (tool.available === false || rawStatus.toLowerCase() === 'rented' || rawStatus.toLowerCase() === 'in use') {
    statusText = rawStatus.toLowerCase() === 'in use' ? 'In Use' : 'Rented';
    statusClass = 'status-rented';
    isActionable = false;
  } else if (rawStatus.toLowerCase() === 'limited' || rawStatus.toLowerCase() === 'low stock') {
    statusText = 'Limited';
    statusClass = 'status-limited';
    isActionable = true;
  } else if (rawStatus.toLowerCase() === 'maintenance' || rawStatus.toLowerCase() === 'unavailable') {
    statusText = rawStatus.toLowerCase() === 'maintenance' ? 'Maintenance' : 'Unavailable';
    statusClass = 'status-unavailable';
    isActionable = false;
  } else if (rawStatus.toLowerCase() === 'available' || tool.available === true) {
    statusText = 'Available';
    statusClass = 'status-available';
    isActionable = true;
  } else if (rawStatus) {
    statusText = rawStatus;
    statusClass = 'status-available';
    isActionable = true;
  }

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isActionable) return;
    addToCart(tool);
    showToast(`Added ${tool.name} to equipment cart! 🛒`, 'success');
  };

  const handleRentNowClick = (e) => {
    e.stopPropagation();
    if (!isActionable) return;
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
        {/* 1. Tool Image Container with Fixed Consistent Height & Aspect */}
        <div className="tool-card-media">
          {/* Compact Professional Status Badge (Top-Left) */}
          <div 
            className={`tool-status-badge ${statusClass}`} 
            id={`tool-status-${tool._id || tool.id}`}
            title={`Status: ${statusText}`}
          >
            <span className="tool-status-dot" aria-hidden="true" />
            <span className="tool-status-text">{statusText}</span>
          </div>

          {/* Polished Quick Add to Cart Button (Top-Right) */}
          <button 
            type="button"
            className="tool-quick-cart-btn"
            onClick={handleAddToCart}
            title={isActionable ? "Add to Cart" : "Item Unavailable"}
            disabled={!isActionable}
            id={`add-cart-btn-${tool._id || tool.id}`}
            aria-label={`Add ${tool.name} to cart`}
          >
            <svg 
              className="tool-cart-svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="tool-cart-plus" aria-hidden="true">+</span>
          </button>

          {/* Tool Image */}
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
          
          {/* Fallback Icon */}
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

            {/* Description */}
            <p className="tool-desc">
              {tool.specs ? tool.specs.split(',').slice(0, 2).join(', ') : (tool.desc || 'Heavy-duty construction equipment calibrated for dependable site performance.')}
            </p>
          </div>

          {/* Footer Area: Price & Actions */}
          <div className="tool-footer-content">
            {/* Price & Delivery Row */}
            <div className="tool-price-row">
              <div className="tool-price-block">
                <span className="tool-price-currency">₹</span>
                <span className="tool-price-amount">{priceNum.toLocaleString('en-IN')}</span>
                <span className="tool-price-period">/day</span>
              </div>
              <div className="tool-delivery-tag">
                <span className="delivery-icon">🚚</span>
                <span>{tool.contactOption || 'Site Delivery'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="tool-actions">
              <button
                type="button"
                className="btn-rent-primary"
                onClick={handleRentNowClick}
                disabled={!isActionable}
                id={`rent-now-btn-${tool._id || tool.id}`}
              >
                <span>{!isActionable ? (statusText === 'Rented' ? 'Currently Rented' : 'Unavailable') : '⚡ Rent Now'}</span>
              </button>

              <button
                type="button"
                className="btn-inquire-secondary"
                onClick={openWhatsAppQuote}
                title="Quick WhatsApp Inquiry"
                id={`inquire-btn-${tool._id || tool.id}`}
              >
                <span>💬 WhatsApp Inquiry</span>
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
