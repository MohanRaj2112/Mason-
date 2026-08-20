import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';
import { projectsData } from '../data/projects';
import { initialToolsData } from '../data/tools';
import { ServiceCard } from '../components/ServiceCard';
import { ProjectCard } from '../components/ProjectCard';
import { ToolCard } from '../components/ToolCard';
<<<<<<< HEAD
import founderImg from '../assets/images/founder_portrait_1786882840416.jpg';
=======
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7

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
              <h2 style={{ fontSize: '2.25rem', color: 'var(--text-main)' }}>
                Construction Tools &amp; Equipment Rentals
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px' }}>
                Heavy-duty concrete mixers, needle vibrators, demolition breakers, and safety kits for rent.
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

<<<<<<< HEAD
      {/* ── ABOUT / FOUNDER & EXCELLENCE ── */}
      <section className="section section-about-premium" id="about">
        <div className="container">
          <div className="about-grid">
            {/* LEFT COLUMN: Father's / Founder's Professional Photo */}
            <div className="about-media-col">
              <div className="about-image-wrapper">
                <img
                  src={founderImg}
                  alt="Mason Mate Founder & Admin"
                  className="about-image"
                  loading="lazy"
                />
                <div className="about-image-badge">
                  <div className="about-badge-icon">🏗️</div>
                  <div className="about-badge-info">
                    <span className="about-badge-role">Founder &amp; Admin</span>
                    <span className="about-badge-sub">SRM AKASH CONSTRUCTION</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Story, Expertise, and Direct Action */}
            <div className="about-content-col">
              <span className="section-eyebrow">ABOUT MASON MATE</span>
              <h2 className="about-main-heading">
                Building Trust Through <span className="text-accent">Quality Construction</span>
              </h2>

              <div className="about-story-text">
                <p>
                  Founded under <strong>SRM AKASH CONSTRUCTION</strong>, Mason Mate was established to deliver genuine craftsmanship, licensed civil engineering standards, and dependable project execution for homeowners across Salem, Coimbatore, and Tamil Nadu.
                </p>
                <p>
                  We believe building a home is a lifetime milestone. We eliminate contractor delays, hidden costs, and workmanship concerns through structured milestone billing, strict IS 456 compliance, and dedicated on-site supervision.
                </p>
              </div>

              {/* Founder / Admin Introduction Card */}
              <div className="about-founder-intro-card">
                <div className="founder-intro-label">Meet the Person Behind Mason Mate</div>
                <p className="founder-intro-quote">
                  "Every project receives personal oversight and our complete commitment to structural durability, honest communication, and punctual delivery."
                </p>
              </div>

              {/* Qualifications & Expertise Checklist */}
              <div className="about-expertise-list">
                <div className="about-expertise-item">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Turnkey Residential Construction</strong>
                    <p>Complete house builds with civil engineering oversight.</p>
                  </div>
                </div>
                <div className="about-expertise-item">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Master Mason Craftsmanship</strong>
                    <p>Vetted artisans for brickwork, plastering, and finishing.</p>
                  </div>
                </div>
                <div className="about-expertise-item">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Construction Equipment Rentals</strong>
                    <p>Mixers, vibrators, and demolition tools on demand.</p>
                  </div>
                </div>
                <div className="about-expertise-item">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Transparent Milestone Billing</strong>
                    <p>Stage-wise payments with zero hidden extra charges.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="about-actions">
                <Link to="/booking" className="btn btn-quote-cta btn-lg">
                  Get a Quote <span className="cta-arrow">→</span>
                </Link>
                <Link to="/contact" className="btn btn-outline btn-lg">
=======
      {/* ── ABOUT / EXCELLENCE ── */}
      <section className="section section-alt" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="section-eyebrow">ENGINEERING INTEGRITY</span>
              <h2>Building Strong Foundations for Over 15 Years</h2>
              <p>
                Founded under <strong>SRM AKASH CONSTRUCTION</strong>, Mason Mate has established itself as the benchmark for residential engineering excellence in Salem and Coimbatore.
              </p>
              <p>
                We believe that every home is a lifetime investment. That's why we eliminate the traditional uncertainty of contractor delays, fluctuating raw material costs, and subpar workmanship through transparent milestone billing and structural quality checklists.
              </p>
              <div className="flex gap-16" style={{ marginTop: '24px', flexWrap: 'wrap' }}>
                <Link to="/booking" className="btn btn-quote-cta">
                  Schedule On-Site Consultation <span className="cta-arrow">→</span>
                </Link>
                <Link to="/contact" className="btn btn-outline">
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
                  Contact Civil Engineers
                </Link>
              </div>
            </div>
<<<<<<< HEAD
=======
            
            <div className="about-stats-grid">
              <div className="about-stat-box">
                <div className="about-stat-box-num">500+</div>
                <div className="about-stat-box-label">Homes &amp; Villas Built</div>
              </div>
              <div className="about-stat-box">
                <div className="about-stat-box-num">120+</div>
                <div className="about-stat-box-label">Vetted Master Masons</div>
              </div>
              <div className="about-stat-box">
                <div className="about-stat-box-num">100%</div>
                <div className="about-stat-box-label">IS 456 Compliant</div>
              </div>
              <div className="about-stat-box">
                <div className="about-stat-box-num">0</div>
                <div className="about-stat-box-label">Hidden Extra Charges</div>
              </div>
            </div>
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
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
