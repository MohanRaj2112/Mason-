import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Phone, X } from 'lucide-react';

export const ServiceDetailsModal = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <div className="modal-overlay active" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal modal-service-details"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: 'min(680px, calc(100% - 32px))',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close details"
          style={{ top: '16px', right: '16px', zIndex: 10 }}
        >
          <X size={18} />
        </button>

        {/* Modal Image Header */}
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', margin: '-28px -28px 20px -28px' }}>
          <img
            src={service.image}
            alt={service.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%)'
            }}
          />
          <div style={{ position: 'absolute', bottom: '16px', left: '24px', right: '24px' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(217, 119, 6, 0.9)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px'
              }}
            >
              {service.tag || service.category || 'Civil Engineering'}
            </span>
            <h2 style={{ color: '#FFFFFF', fontSize: '1.45rem', margin: 0, fontWeight: 700 }}>
              {service.title}
            </h2>
          </div>
        </div>

        {/* Pricing / Rate Banner */}
        {service.priceRange && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-main)',
              border: '1px solid var(--border-light)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px'
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Standard Service Rate:
            </span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }} className="tabular-nums">
              {service.priceRange}
            </strong>
          </div>
        )}

        {/* Full Detailed Description */}
        <div style={{ marginBottom: '22px' }}>
          <h4 style={{ fontSize: '0.92rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 700 }}>
            Service Overview
          </h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.65, margin: 0 }}>
            {service.description}
          </p>
        </div>

        {/* Features Checklist */}
        {Array.isArray(service.features) && service.features.length > 0 && (
          <div style={{ marginBottom: '26px' }}>
            <h4 style={{ fontSize: '0.92rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 700 }}>
              What&apos;s Included &amp; Specifications
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {service.features.map((feat, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.45
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px'
                    }}
                  >
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '18px',
            flexWrap: 'wrap'
          }}
        >
          <a
            href="tel:+919159687408"
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Phone size={15} />
            <span>Consult Engineer</span>
          </a>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Close
            </button>
            <Link
              to={service.link || '/booking'}
              className="btn btn-accent"
              onClick={onClose}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Book Service</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
