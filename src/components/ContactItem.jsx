import React from 'react';

export const ContactItem = ({
  icon: Icon,
  label,
  value,
  subtext,
  href,
  onClick,
  light = false
}) => {
  const content = (
    <div className={`contact-item-block ${light ? 'contact-item-light' : ''}`}>
      <div className="contact-item-icon-box" aria-hidden="true">
        {Icon ? <Icon size={20} strokeWidth={2} /> : <span>•</span>}
      </div>
      <div className="contact-item-details">
        <span className="contact-item-label">{label}</span>
        <strong className="contact-item-value">{value}</strong>
        {subtext && <span className="contact-item-sub">{subtext}</span>}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className="contact-item-link">
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="contact-item-link contact-item-btn">
        {content}
      </button>
    );
  }

  return content;
};

export default ContactItem;
