import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData, masterMasonsData } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';

export const Services = () => {
  return (
    <div className="services-page">
      {/* ── HERO BANNER ── */}
      <section className="hero" style={{ padding: '60px 0 72px' }}>
        <div className="container">
          <div className="hero-content">
            <span className="section-eyebrow">SRM AKASH CONSTRUCTION</span>
            <h1 style={{ fontSize: '2.8rem', marginBottom: '16px' }}>
              Comprehensive Construction &amp; Engineering Services
            </h1>
            <p className="hero-desc">
              From turnkey house construction and skilled workforce deployment to calibrated machinery rentals, we deliver certified structural engineering across Tamil Nadu.
            </p>
          </div>
        </div>
      </section>

      {/* ── ALL SERVICES GRID ── */}
      <section className="section" id="all-services">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">OUR CAPABILITIES</span>
            <h2>Construction Services Overview</h2>
            <p>
              Engineered for longevity, Vastu compliance, and complete cost transparency.
            </p>
          </div>

          <div className="grid-3">
            {servicesData.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MASTER MASONS WORKFORCE CATALOG ── */}
      <section className="section section-alt" id="masons">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">CERTIFIED WORKFORCE</span>
            <h2>Hire Master Masons &amp; Specialists</h2>
            <p>
              Trade-tested mistris, bricklayers, plasterers, and tile specialists available for daily wage or contract deployment.
            </p>
          </div>

          <div className="grid-3">
            {masterMasonsData.map(mason => (
              <div 
                key={mason.id} 
                className="card"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ 
                    fontSize: '2rem', 
                    width: '54px', 
                    height: '54px', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {mason.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '2px' }}>
                      {mason.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700 }}>
                      {mason.spec}
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flexGrow: 1, marginBottom: '20px', lineHeight: '1.55' }}>
                  {mason.description}
                </p>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  border: '1px solid var(--border-light)'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Rate</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>{mason.rate}</span>
                </div>

                <Link 
                  to={mason.bookingLink} 
                  className="btn btn-outline btn-full"
                >
                  {mason.buttonText} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE SITE VISIT CTA ── */}
      <section className="cta-banner" style={{ margin: '0 24px 80px' }}>
        <div className="container">
          <h2>Need a Custom BOQ or Soil Assessment?</h2>
          <p>
            Our senior civil engineer will visit your plot, conduct structural feasibility measurements, and present a transparent Bill of Quantities (BOQ) with zero commitment.
          </p>
          <div className="flex gap-16" style={{ flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-accent btn-lg">
              📅 Book Free Site Visit Now
            </Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">
              💬 Speak with Our Lead Engineer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
