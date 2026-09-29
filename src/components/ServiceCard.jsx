import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import heroSiteImg from '../assets/images/hero_construction_site_1790694659406.jpg';

export const ServiceCard = ({ service, index = 0 }) => {
  if (!service) return null;

  const numLabel = service.number || String(index + 1).padStart(2, '0');
  const imgSrc = service.image || heroSiteImg;

  return (
    <article className="service-card" id={`service-${service.id}`}>
      {/* Visual Image Header */}
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

      {/* Card Body */}
      <div className="service-card-content">
        {/* Clean Unboxed Metadata Line */}
        <div className="service-meta-line">
          <span>{service.tag || service.category || 'Engineering Service'}</span>
          {service.priceRange && (
            <>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{service.priceRange}</span>
            </>
          )}
        </div>

        <h3 className="service-title">{service.title}</h3>
        <p className="service-desc">{service.description}</p>

        {Array.isArray(service.features) && service.features.length > 0 && (
          <ul className="service-features">
            {service.features.map((feature, idx) => (
              <li key={idx}>
                <Check size={15} className="service-check-icon" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="service-card-footer">
          <Link to={service.link || '/booking'} className="btn btn-outline btn-full service-cta-btn">
            <span>{service.buttonText ? service.buttonText.replace('→', '').trim() : 'Learn More'}</span>
            <ArrowRight size={16} className="cta-arrow" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
