<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { RentalModal } from './RentalModal';

export const ToolCard = ({ tool, onRentNow }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [localModalOpen, setLocalModalOpen] = useState(false);
<<<<<<< HEAD

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
=======
<<<<<<< HEAD
=======
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
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7

  if (!tool) return null;

  const status = tool.availabilityStatus || (tool.available !== false ? 'Available' : 'Rented');
  const isAvailable = status === 'Available';
  const isMaintenance = status === 'Maintenance';
<<<<<<< HEAD

  const handleAddToCart = (e) => {
    e.stopPropagation();
=======
<<<<<<< HEAD

  const handleAddToCart = (e) => {
    e.stopPropagation();
=======
  const isRented = status === 'Rented' || status === 'Booked' || status === 'In Use';

  const handleAddToCart = () => {
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
    addToCart(tool);
    showToast(`Added ${tool.name} to equipment cart! 🛒`, 'success');
  };

<<<<<<< HEAD
  const handleRentNowClick = (e) => {
    e.stopPropagation();
    if (!isActionable) return;
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
  const handleRentNowClick = (e) => {
    e.stopPropagation();
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
    if (onRentNow) {
      onRentNow(tool);
    } else {
      setLocalModalOpen(true);
    }
  };

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
  const openWhatsAppQuote = (e) => {
    e.stopPropagation();
    const phone = '919159687408';
    const text = encodeURIComponent(
      `Hello Mason Mate! I want to inquire about renting: ${tool.name} (₹${tool.price || 0}/${tool.period || 'day'}). Is it available for site delivery?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

<<<<<<< HEAD
=======
=======
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
  const categoryFormatted = (tool.category || 'Equipment')
    .replace('-', ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const priceNum = Number(tool.price || 0);

  return (
    <>
      <div 
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
        className="tool-card" 
        id={`tool-card-${tool._id || tool.id}`}
      >
        {/* 1. Tool Image Container with 4:3 Aspect Ratio, 14px Radius, Soft Background */}
        <div className="tool-card-media">
          {/* Availability Badge */}
          <div className={`tool-avail-badge ${isAvailable ? 'avail-in-stock' : isMaintenance ? 'avail-maintenance' : 'avail-rented'}`}>
=======
        className="tool-card-clean" 
        id={`tool-card-${tool._id || tool.id}`}
      >
        {/* 1. Tool Image Container with 4:3 Aspect Ratio, 14px Radius, Soft Background */}
        <div className="tool-card-image-wrap">
          {/* Availability Badge */}
          <div className={`tool-clean-avail ${isAvailable ? 'avail-in-stock' : isMaintenance ? 'avail-maintenance' : 'avail-rented'}`}>
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
            <span className="avail-dot" />
            <span>{status}</span>
          </div>

          {/* Quick Cart Button */}
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
          <button 
            type="button"
            className="tool-quick-cart-btn"
            onClick={handleAddToCart}
<<<<<<< HEAD
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
=======
            title="Add to Cart"
            disabled={isMaintenance}
            id={`add-cart-btn-${tool._id || tool.id}`}
          >
            🛒 +
          </button>

>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
          {tool.image ? (
            <img 
              src={tool.image} 
              alt={tool.name} 
<<<<<<< HEAD
              className="tool-card-img"
=======
<<<<<<< HEAD
              className="tool-card-img"
=======
              className="tool-clean-image"
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          
<<<<<<< HEAD
          {/* Fallback Icon */}
          <div 
            className="tool-fallback-icon"
=======
          <div 
<<<<<<< HEAD
            className="tool-fallback-icon"
=======
            className="tool-clean-fallback-icon"
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
            style={{ display: tool.image ? 'none' : 'flex' }}
          >
            <span>{tool.icon || '🛠️'}</span>
          </div>
        </div>

        {/* 2. Tool Card Body */}
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
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

<<<<<<< HEAD
            {/* Description */}
=======
            {/* Specs / Description snippet */}
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
            <p className="tool-desc">
              {tool.specs ? tool.specs.split(',').slice(0, 2).join(', ') : (tool.desc || 'Heavy-duty construction equipment calibrated for dependable site performance.')}
            </p>
          </div>

<<<<<<< HEAD
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
=======
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
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
              </button>

              <button
                type="button"
<<<<<<< HEAD
                className="btn-inquire-secondary"
                onClick={openWhatsAppQuote}
                title="Quick WhatsApp Inquiry"
                id={`inquire-btn-${tool._id || tool.id}`}
              >
                <span>💬 WhatsApp Inquiry</span>
              </button>
            </div>
=======
                className="btn btn-outline btn-full btn-sm btn-tool-inquire"
                onClick={openWhatsAppQuote}
                title="Quick WhatsApp Inquiry"
              >
                💬 WhatsApp Inquiry
              </button>
            </div>
=======
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
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
  );
};

export default ToolCard;
<<<<<<< HEAD
=======
=======
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
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
>>>>>>> e10a3db42ed8ad8ba5257ceebb959b77dd75f7b1
