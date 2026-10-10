import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { ServiceDetailsModal } from './ServiceDetailsModal';
import heroSiteImg from '../assets/images/srm_hero_site_1791445418459.jpg';

export const ServiceCard = ({ service, index = 0, onSelectService }) => {
  const [showModal, setShowModal] = useState(false);

  if (!service) return null;

  const numLabel = service.number || String(index + 1).padStart(2, '0');
  const imgSrc = service.image || heroSiteImg;
  // Use concise single sentence (8-15 words)
  const shortText = service.shortDescription || service.description;

  const handleOpenDetails = (e) => {
    e.preventDefault();
    if (onSelectService) {
      onSelectService(service);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <article className="service-card" id={`service-${service.id}`}>
        {/* Consistent Image Header */}
        <div className="service-card-media">
          <img
            src={imgSrc}
            alt={service.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = heroSiteImg;
            }}
          />
          <div className="service-card-media-overlay" />
          <div className="service-card-num">{numLabel}</div>
        </div>

        {/* Card Body: Title, Short Description, Action Buttons */}
        <div className="service-card-content">
          <div className="service-meta-line">
            <span>{service.tag || service.category || 'Civil Service'}</span>
            {service.priceRange && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{service.priceRange}</span>
              </>
            )}
          </div>

          <h3 className="service-title">{service.title}</h3>
          
          {/* Exactly ONE short sentence per service (8-15 words) */}
          <p className="service-desc">{shortText}</p>

          <div className="service-card-footer">
            <div className="service-card-btn-group">
              <button
                type="button"
                className="btn btn-secondary btn-sm service-details-btn"
                onClick={handleOpenDetails}
              >
                <Info size={14} />
                <span>View Details</span>
              </button>

              <Link
                to={service.link || '/booking'}
                className="btn btn-outline btn-sm service-book-btn"
              >
                <span>Request Quote</span>
                <ArrowRight size={14} className="cta-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {showModal && (
        <ServiceDetailsModal
          service={service}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ServiceCard;
