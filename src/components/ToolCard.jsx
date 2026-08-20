<<<<<<< HEAD
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { RentalModal } from './RentalModal';

export const ToolCard = ({ tool, onRentNow }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [localModalOpen, setLocalModalOpen] = useState(false);
=======
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const ToolCard = ({ tool }) => {
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7

  if (!tool) return null;

  const status = tool.availabilityStatus || (tool.available !== false ? 'Available' : 'Rented');
  const isAvailable = status === 'Available';
  const isMaintenance = status === 'Maintenance';
<<<<<<< HEAD

  const handleAddToCart = (e) => {
    e.stopPropagation();
=======
  const isRented = status === 'Rented' || status === 'Booked' || status === 'In Use';

  const handleAddToCart = () => {
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
    addToCart(tool);
    showToast(`Added ${tool.name} to equipment cart! 🛒`, 'success');
  };

<<<<<<< HEAD
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
=======
  const handleRentNow = () => {
    addToCart(tool);
    navigate(`/booking?type=tools&tool=${encodeURIComponent(tool.name)}`);
  };

  const openWhatsAppQuote = () => {
    const phone = '919159687408';
    const text = encodeURIComponent(
      `Hello Mason Mate! I want to inquire about renting: ${tool.name} (₹${tool.price}/${tool.period || 'day'}). Is it available for site delivery?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const categoryFormatted = (tool.category || 'Equipment').replace('-', ' ');

  return (
    <div className="tool-card" id={`tool-${tool._id || tool.id}`}>
      <div className="tool-card-media">
        {/* Category Badge */}
        <span className="tool-badge-pill">
          {categoryFormatted}
        </span>

        {/* Availability Badge */}
        <span className={`tool-avail-badge ${isAvailable ? 'available' : isMaintenance ? 'maintenance' : 'in-use'}`}>
          <span className="tool-avail-dot" />
          <span>{status}</span>
        </span>

        {/* Image or Icon */}
        {tool.image ? (
          <img 
            src={tool.image} 
            alt={tool.name} 
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display = 'block';
              }
            }}
          />
        ) : null}
        <div 
          className="tool-fallback-icon"
          style={{ display: tool.image ? 'none' : 'block' }}
        >
          {tool.icon || '🔨'}
        </div>
      </div>

      <div className="tool-card-body">
        <div>
          <div className="tool-category-label">
            {tool.specs ? tool.specs.split(',')[0] : categoryFormatted}
          </div>
          <h3 className="tool-title" title={tool.name}>
            {tool.name}
          </h3>
          <p className="tool-desc">
            {tool.desc || tool.description || 'Heavy-duty construction equipment calibrated for dependable job site performance.'}
          </p>
        </div>

        <div>
          <div className="tool-price-row">
            <div>
              <div className="tool-price-val">
                ₹{Number(tool.price || 0).toLocaleString('en-IN')}
                <span className="tool-price-period"> / {tool.period || 'day'}</span>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, background: 'var(--bg-main)', padding: '3px 8px', borderRadius: '4px' }}>
              🚚 {tool.contactOption || 'Site Delivery'}
            </div>
          </div>

          <div className="tool-card-actions">
            <button
              className="btn btn-accent btn-sm"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
              disabled={isMaintenance}
              title={isMaintenance ? 'Under maintenance' : 'Add to cart'}
            >
              🛒 Cart
            </button>
            <button
              className="btn btn-outline btn-sm"
              style={{ flex: 1 }}
              onClick={handleRentNow}
              disabled={isMaintenance}
              title={isMaintenance ? 'Under maintenance' : 'Rent now'}
            >
              ⚡ Rent Now
            </button>
          </div>

          <button
            className="btn btn-outline btn-sm btn-full"
            style={{ 
              marginTop: '8px', 
              fontSize: '0.78rem', 
              padding: '6px 10px',
              border: '1px dashed var(--border-light)',
              color: 'var(--text-muted)'
            }}
            onClick={openWhatsAppQuote}
          >
            💬 WhatsApp Quick Inquiry
          </button>
        </div>
      </div>
    </div>
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
  );
};
