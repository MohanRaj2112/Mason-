import React from 'react';
import { Link } from 'react-router-dom';

export const ServiceCard = ({ service }) => {
  if (!service) return null;

  return (
    <div className="service-card" id={`service-${service.id}`}>
      <div className="service-icon" aria-hidden="true">
        {service.icon || '🏗️'}
      </div>
      
      {service.tag && (
        <span style={{ 
          display: 'inline-block',
          fontSize: '0.72rem', 
          fontWeight: 800, 
          textTransform: 'uppercase', 
          color: 'var(--accent)',
          letterSpacing: '0.06em',
          marginBottom: '8px'
        }}>
          {service.tag}
        </span>
      )}

      <h3 className="service-title">{service.title}</h3>
      <p className="service-desc">{service.description}</p>

      {Array.isArray(service.features) && service.features.length > 0 && (
        <ul className="service-features">
          {service.features.map((feature, idx) => (
            <li key={idx}>
              <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {service.priceRange && (
        <div style={{ 
          fontSize: '0.85rem', 
          fontWeight: 700, 
          color: 'var(--primary)', 
          background: 'var(--bg-main)', 
          padding: '6px 12px', 
          borderRadius: 'var(--radius-sm)',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid var(--border-light)'
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Pricing</span>
          <span>{service.priceRange}</span>
        </div>
      )}

      <Link 
        to={service.link || '/booking'} 
        className="btn btn-accent btn-full"
      >
        {service.buttonText || 'Learn More →'}
      </Link>
    </div>
  );
};
