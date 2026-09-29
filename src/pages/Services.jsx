import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, HardHat, Phone } from 'lucide-react';
import { servicesData, turnkeyPackages, masterMasonsData } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { SectionHeading } from '../components/SectionHeading';
import heroBgImg from '../assets/images/hero_construction_site_1790694659406.jpg';

export const Services = () => {
  return (
    <div className="services-page">
      {/* ── PAGE HERO BANNER ── */}
      <section
        className="hero page-hero"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(10, 14, 23, 0.92) 0%, rgba(15, 23, 42, 0.82) 55%, rgba(168, 42, 16, 0.36) 100%), url(${heroBgImg})`
        }}
      >
        <div className="container">
          <div className="hero-content">
            <div className="hero-kicker">
              <span>SRM AKASH CONSTRUCTION</span>
              <span aria-hidden="true">·</span>
              <span>ENGINEERING CAPABILITIES</span>
            </div>
            <h1>Comprehensive Construction &amp; Masonry Services</h1>
            <p className="hero-desc">
              From turnkey residential construction and trade-tested master mason deployment to calibrated machinery rentals, we deliver certified structural execution across Tamil Nadu.
            </p>
            <div className="hero-actions" style={{ marginBottom: 0 }}>
              <Link to="/booking" className="btn btn-quote-cta btn-lg">
                <span>Request Project Quote</span>
                <ArrowRight size={17} className="cta-arrow" />
              </Link>
              <a href="tel:+919159687408" className="btn btn-outline-white btn-lg">
                <Phone size={16} />
                <span>+91 9159687408</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL SERVICES GRID ── */}
      <section className="section" id="all-services">
        <div className="container">
          <SectionHeading
            eyebrow="OUR CAPABILITIES"
            title="Construction & Engineering Divisions"
            subtitle="Engineered for structural longevity, Vastu compliance, and complete BOQ cost transparency."
          />

          <div className="grid-3">
            {servicesData.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TURNKEY CONSTRUCTION PACKAGES ── */}
      <section className="section section-alt" id="packages">
        <div className="container">
          <SectionHeading
            eyebrow="TRANSPARENT SPECIFICATION TIERS"
            title="Turnkey Residential Construction Packages"
            subtitle="Compare our standardized per-square-foot material and structural specifications with zero hidden charges."
          />

          <div className="grid-3">
            {turnkeyPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`package-card ${pkg.isPopular ? 'package-card-featured' : ''}`}
              >
                <div className="package-header">
                  <div className="package-meta-kicker">{pkg.tag}</div>
                  <h3>{pkg.title}</h3>
                  <div className="package-rate-row tabular-nums">
                    <span className="package-rate">{pkg.rate}</span>
                    <span className="package-unit">{pkg.unit}</span>
                  </div>
                  <p className="package-desc">{pkg.description}</p>
                </div>

                <ul className="package-features">
                  {pkg.features.map((feat, i) => (
                    <li key={i}>
                      <Check size={15} className="package-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={pkg.link}
                  className={`btn ${pkg.isPopular ? 'btn-quote-cta' : 'btn-primary'} btn-full`}
                >
                  <span>{pkg.buttonText.replace('→', '').trim()}</span>
                  <ArrowRight size={16} className="cta-arrow" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MASTER MASONS WORKFORCE CATALOG ── */}
      <section className="section" id="masons">
        <div className="container">
          <SectionHeading
            eyebrow="CERTIFIED WORKFORCE"
            title="Hire Master Masons & Trade Specialists"
            subtitle="Trade-tested mistris, bricklayers, plasterers, and tile specialists available for daily wage or milestone contract deployment."
          />

          <div className="grid-3">
            {masterMasonsData.map((mason) => (
              <div key={mason.id} className="mason-card">
                <div className="mason-card-top">
                  <div className="mason-icon-box">
                    <HardHat size={22} />
                  </div>
                  <div>
                    <div className="mason-spec-line">{mason.spec}</div>
                    <h3 className="mason-title">{mason.name}</h3>
                  </div>
                </div>

                <p className="mason-desc">{mason.description}</p>

                <div className="mason-rate-bar">
                  <span className="mason-rate-label">Daily Deployment Rate</span>
                  <strong className="mason-rate-val tabular-nums">{mason.rate}</strong>
                </div>

                <Link to={mason.bookingLink} className="btn btn-outline btn-full">
                  <span>{mason.buttonText}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE SITE VISIT CTA ── */}
      <section className="section section-alt" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-inner">
              <div>
                <span className="section-eyebrow" style={{ color: '#FDBA74' }}>
                  SITE ASSESSMENT &amp; BOQ
                </span>
                <h2>Need a Custom BOQ or Soil Feasibility Report?</h2>
                <p>
                  Our senior civil engineer will visit your plot, conduct structural feasibility measurements, and present a transparent Bill of Quantities with zero obligation.
                </p>
              </div>
              <div className="cta-banner-actions">
                <Link to="/booking" className="btn btn-quote-cta btn-lg">
                  <span>Book Free Site Visit</span>
                  <ArrowRight size={17} className="cta-arrow" />
                </Link>
                <Link to="/contact" className="btn btn-outline-white btn-lg">
                  <span>Speak with Our Lead Engineer</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
