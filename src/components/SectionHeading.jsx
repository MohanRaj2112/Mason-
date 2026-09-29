import React from 'react';

export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'center', // 'center' | 'left'
  light = false,
  action = null
}) => {
  if (action) {
    return (
      <div className="section-heading-row">
        <div className={`section-header text-left ${light ? 'section-header-light' : ''}`} style={{ marginBottom: 0 }}>
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="section-heading-action">{action}</div>
      </div>
    );
  }

  return (
    <div
      className={`section-header ${align === 'left' ? 'text-left' : ''} ${
        light ? 'section-header-light' : ''
      }`}
    >
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
