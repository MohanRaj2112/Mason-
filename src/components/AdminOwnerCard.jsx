import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, MapPin, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import daddyImg from '../assets/images/daddy.jpeg';
import founderImg from '../assets/images/founder_portrait_1786882840416.jpg';

export const AdminOwnerCard = ({
  name = 'S. SIVAJI',
  role = 'Founder & Owner',
  company = 'SRM Akash Construction',
  location = 'Salem & Coimbatore, Tamil Nadu',
  experience = '15+ Years Field Leadership',
  description = 'Directing residential turnkey projects, structural RCC execution, and skilled master mason deployment with uncompromising engineering standards and transparent client communication.',
  phone = '+91 9159687408',
  onWhatsAppClick
}) => {
  return (
    <div className="leadership-profile-card">
      {/* Top / Left Photo Column */}
      <div className="leadership-photo-frame">
        <div className="leadership-img-container">
          <img
            src="/images/daddy.png"
            alt={`${name} – ${role}`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              if (e.currentTarget.src.includes('daddy.png')) {
                e.currentTarget.src = daddyImg;
              } else {
                e.currentTarget.onerror = null;
                e.currentTarget.src = founderImg;
              }
            }}
          />
          <div className="leadership-img-scrim" />
          <div className="leadership-exp-caption">
            <Award size={15} />
            <span>{experience}</span>
          </div>
        </div>
      </div>

      {/* Content / Details Column */}
      <div className="leadership-card-body">
        <div className="leadership-meta-kicker">
          <span>COMPANY LEADERSHIP</span>
          <span aria-hidden="true">·</span>
          <span>PRINCIPAL CONTRACTOR</span>
        </div>

        <h3 className="leadership-name">{name}</h3>
        <div className="leadership-role">{role}</div>
        <div className="leadership-company">{company}</div>

        <p className="leadership-bio">{description}</p>

        <div className="leadership-credentials">
          <div className="leadership-cred-item">
            <MapPin size={15} />
            <span>{location}</span>
          </div>
          <div className="leadership-cred-item">
            <ShieldCheck size={15} />
            <span>IS 456 Structural Compliance &amp; Quality Sign-Off</span>
          </div>
        </div>

        <div className="leadership-card-actions">
          <Link to="/booking" className="btn schedule-consultation-btn">
            <span>Schedule Consultation</span>
            <ArrowRight size={16} />
          </Link>
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn btn-outline">
            <Phone size={15} />
            <span>{phone}</span>
          </a>
          {onWhatsAppClick && (
            <button
              type="button"
              onClick={onWhatsAppClick}
              className="btn btn-secondary"
            >
              <MessageSquare size={15} />
              <span>WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOwnerCard;
