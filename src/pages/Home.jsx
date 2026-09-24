import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';
import { projectsData } from '../data/projects';
import { initialToolsData } from '../data/tools';
import { ServiceCard } from '../components/ServiceCard';
import { ProjectCard } from '../components/ProjectCard';
import { ToolCard } from '../components/ToolCard';
import founderImg from '../assets/images/founder_portrait_1786882840416.jpg';
import daddyImg from '../assets/images/daddy.jpeg';

export const Home = () => {
  const openWhatsApp = (msg) => {
    const phone = '919159687408';
    const text = encodeURIComponent(msg || 'Hello Mason Mate, I would like to inquire about residential construction and equipment rentals.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // Top 3 featured services for home
  const featuredServices = servicesData.slice(0, 3);
  // Featured projects
  const featuredProjects = projectsData.slice(0, 6);
  // Featured rental tools
  const featuredTools = initialToolsData.filter(t => t.featured).slice(0, 3);

  return (
    <div className="home-page">
      {/* ── HERO SECTION ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="section-eyebrow">SRM AKASH CONSTRUCTION</span>
            <h1>
              End-to-End House Construction &amp; Master Mason Services
            </h1>
            <p className="hero-desc">
              From foundation soil testing to turnkey handovers, we deliver licensed civil engineering, vetted master masons, and commercial-grade tool rentals across Tamil Nadu.
            </p>
            
            <div className="hero-actions">
              <Link to="/booking" className="btn btn-quote-cta btn-lg">
                Get a Quote <span className="cta-arrow">→</span>
              </Link>
              <Link to="/services" className="btn btn-outline-white btn-lg">
                Explore Services
              </Link>
              <button
                onClick={() => openWhatsApp('Hello Mason Mate! I would like to get a construction quote.')}
                className="btn btn-outline-white btn-lg"
              >
                💬 WhatsApp Us
              </button>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <div className="hero-stat-num">500+</div>
                <div className="hero-stat-lbl">Projects Completed</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-num">15+</div>
                <div className="hero-stat-lbl">Years Experience</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-lbl">Quality Assured</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-num">4.9★</div>
                <div className="hero-stat-lbl">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION (DATA-DRIVEN & REUSABLE) ── */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">SERVICES</span>
            <h2>Professional Construction Services</h2>
            <p>Professional construction services for every type of residential, commercial, and renovation project.</p>
          </div>

          <div className="grid-3">
            {featuredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/services" className="btn btn-outline btn-lg">
              View All Construction Services &amp; Packages →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED TOOLS RENTAL MARKETPLACE PREVIEW ── */}
      <section className="section section-alt" id="tool-rentals-preview">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
            <div>
              <span className="section-eyebrow">EQUIPMENT MARKETPLACE</span>
              <h2 style={{ fontSize: '2.25rem', color: 'var(--text-main)', marginTop: '4px' }}>
                Tools Rental
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px' }}>
                Professional equipment for every construction requirement.
              </p>
            </div>

            <Link to="/products" className="btn btn-accent">
              Browse Full Catalog ({initialToolsData.length}+ Tools) →
            </Link>
          </div>

          <div className="grid-3">
            {featuredTools.map(tool => (
              <ToolCard key={tool._id || tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS PORTFOLIO (DATA-DRIVEN) ── */}
      <section className="section" id="projects">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">PORTFOLIO</span>
            <h2>Recent Landmark Projects</h2>
            <p>Take a look at some of our residential builds and structural remodeling work across Tamil Nadu.</p>
          </div>

          <div className="project-grid">
            {featuredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION — OWNER & FOUNDER ── */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">OWNER / FOUNDER</span>
            <h2>Built on Practical Construction Experience</h2>
            <p>Direct field leadership, licensed civil engineering standards, and dependable on-site execution.</p>
          </div>

          <div className="about-owner-grid">
            {/* LEFT: OWNER IMAGE CARD */}
            <div className="about-owner-image-card">
              <div className="about-owner-img-wrapper">
                <img
                  src="/images/daddy.png"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = daddyImg;
                  }}
                  alt="Mohanraj – Founder & Chief Contractor, Mason Mate"
                  loading="lazy"
                />
                <div className="about-owner-badge-pill">
                  <span>15+ Years Field Leadership</span>
                </div>
              </div>
              <div className="about-owner-caption">
                <h4>Mohanraj</h4>
                <p>Founder &amp; Chief Contractor • SRM AKASH CONSTRUCTION</p>
                <div className="about-owner-loc">📍 Salem &amp; Coimbatore, Tamil Nadu</div>
              </div>
            </div>

            {/* RIGHT: MASON MATE STORY, INTRODUCTION & EXPERTISE */}
            <div className="about-owner-content">
              <div className="about-story-badge">ABOUT MASON MATE</div>
              <h3>Delivering Reliable Construction &amp; Heavy Equipment Across Tamil Nadu</h3>

              <p className="about-lead">
                Mason Mate is built with practical construction experience and a focus on delivering reliable construction services.
              </p>

              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                Founded under SRM AKASH CONSTRUCTION, Mason Mate bridges the gap between homeowners, commercial developers, and trustworthy on-site execution. What began over 15 years ago as dedicated civil engineering contracting has evolved into an integrated platform offering turnkey residential construction, trade-tested master mason hiring, and commercial tool equipment rentals.
              </p>

              <div className="about-highlights-grid">
                <div className="about-highlight-item">
                  <span className="about-hl-icon">🏗️</span>
                  <div>
                    <strong>Turnkey Residential Builds</strong>
                    <p>Complete structural drafting, IS 456 compliant RCC framing, stage-wise inspections, and key-in-hand handover.</p>
                  </div>
                </div>
                <div className="about-highlight-item">
                  <span className="about-hl-icon">👷</span>
                  <div>
                    <strong>Trade-Tested Master Masons</strong>
                    <p>Vetted chief mistris, bricklayers, plasterers, and tile artisans available on daily or contract milestone basis.</p>
                  </div>
                </div>
                <div className="about-highlight-item">
                  <span className="about-hl-icon">🛠️</span>
                  <div>
                    <strong>Heavy Tools &amp; Machinery Fleet</strong>
                    <p>Concrete mixers, scaffold frames, needle vibrators, and core cutters delivered on-site with operator guidance.</p>
                  </div>
                </div>
                <div className="about-highlight-item">
                  <span className="about-hl-icon">📋</span>
                  <div>
                    <strong>Transparent Project Sign-Offs</strong>
                    <p>Itemized BOQ billing, stage-by-stage engineering approvals, weekly WhatsApp site logs, and zero hidden costs.</p>
                  </div>
                </div>
              </div>

              <div className="about-actions">
                <Link to="/booking" className="btn btn-accent btn-lg">
                  📅 Book Free Site Visit
                </Link>
                <button
                  type="button"
                  onClick={() => openWhatsApp('Hello Mohanraj / Mason Mate! I would like to consult about our upcoming house construction project.')}
                  className="btn btn-outline btn-lg"
                >
                  💬 Chat on WhatsApp (+91 9159687408)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">TESTIMONIALS</span>
            <h2>What Our Clients Say</h2>
            <p>Real feedback from homeowners who built with Mason Mate.</p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div style={{ color: 'var(--accent)', fontSize: '1.2rem', marginBottom: '12px' }}>★★★★★</div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>
                "Mason Mate built our 3BHK duplex in Salem in just 8 months. Their weekly WhatsApp photo logs and structural stage approvals gave us total peace of mind!"
              </p>
              <strong>Rajesh Kumar</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Villa Owner, Fairlands Salem</div>
            </div>

            <div className="card">
              <div style={{ color: 'var(--accent)', fontSize: '1.2rem', marginBottom: '12px' }}>★★★★★</div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>
                "We hired 4 master masons for plastering and granite flooring. The team was prompt, skilled, and clean. No material wastage whatsoever."
              </p>
              <strong>Dr. Meenakshi Sundaram</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Coimbatore</div>
            </div>

            <div className="card">
              <div style={{ color: 'var(--accent)', fontSize: '1.2rem', marginBottom: '12px' }}>★★★★★</div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>
                "Rented concrete mixers and scaffolding for our commercial project. Machinery arrived on time in immaculate condition with prompt on-site support."
              </p>
              <strong>Murugan Builders</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contractor, Erode</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner" style={{ margin: '0 24px 80px' }}>
        <div className="container">
          <h2>Ready to Build Your Dream Home?</h2>
          <p>
            Get in touch with our civil engineering consultants today for a free site inspection and customized estimation report.
          </p>
          <div className="flex gap-16" style={{ flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-accent btn-lg">
              📅 Book Free Site Visit
            </Link>
            <a href="tel:+919159687408" className="btn btn-outline-white btn-lg">
              📞 Call +91 9159687408
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
