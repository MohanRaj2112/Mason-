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

  const categoryFormatted = (tool.category || 'Equipment')
    .replace('-', ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const priceNum = Number(tool.price || 0);

  return (
    <>
      <div 
        className="tool-card-clean" 
        id={`tool-card-${tool._id || tool.id}`}
      >
        {/* 1. Tool Image Container with 4:3 Aspect Ratio, 14px Radius, Soft Background */}
        <div className="tool-card-image-wrap">
          {/* Availability Badge */}
          <div className={`tool-clean-avail ${isAvailable ? 'avail-in-stock' : isMaintenance ? 'avail-maintenance' : 'avail-rented'}`}>
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
              className="tool-clean-image"
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
            className="tool-clean-fallback-icon"
            style={{ display: tool.image ? 'none' : 'flex' }}
          >
            <span>{tool.icon || '🛠️'}</span>
          </div>
        </div>

        {/* 2. Tool Card Body */}
        <div className="tool-card-clean-body">
          {/* Category */}
          <div className="tool-clean-category">
            {categoryFormatted}
          </div>

          {/* Tool Name */}
          <h3 className="tool-clean-name" title={tool.name}>
            {tool.name}
          </h3>

          {/* Brief specs / description if available */}
          {tool.specs && (
            <div className="tool-clean-specs">
              {tool.specs.split(',')[0]}
            </div>
          )}

          {/* Price & Availability Row */}
          <div className="tool-clean-price-row">
            <div className="tool-clean-price">
              <span className="price-currency">₹</span>
              <span className="price-amount">{priceNum.toLocaleString('en-IN')}</span>
              <span className="price-unit"> / Day</span>
            </div>
          </div>

          {/* Primary Action Button: Rent Now */}
          <div className="tool-clean-actions">
            <button
              type="button"
              className="btn btn-accent btn-full btn-rent-now"
              onClick={handleRentNowClick}
              disabled={isMaintenance}
              id={`rent-now-btn-${tool._id || tool.id}`}
            >
              {isMaintenance ? 'Under Maintenance' : '⚡ Rent Now'}
            </button>
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
