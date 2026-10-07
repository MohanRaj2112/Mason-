import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  MapPin,
  Mail,
  Clock,
  ShieldCheck,
  Hammer,
  Building2,
  HardHat,
  Wrench
} from 'lucide-react';
import { servicesData } from '../data/services';
import { projectsData } from '../data/projects';
import { initialToolsData, toolCategories } from '../data/tools';
import { ServiceCard } from '../components/ServiceCard';
import { ProjectCard } from '../components/ProjectCard';
import { ToolCard } from '../components/ToolCard';
import { SectionHeading } from '../components/SectionHeading';
import { AdminOwnerCard } from '../components/AdminOwnerCard';
import { ContactItem } from '../components/ContactItem';
import heroBgImg from '../assets/images/hero_construction_site_1790694659406.jpg';
import villaImg from '../assets/images/project_luxury_villa_1790694687569.jpg';
import masonryImg from '../assets/images/service_masonry_work_1790694699452.jpg';

export const Home = () => {
  const [selectedToolCat, setSelectedToolCat] = useState('all');

  const openWhatsApp = (msg) => {
    const phone = '919159687408';
    const text = encodeURIComponent(
      msg || 'Hello SRM Akash Construction (MasonMate), I would like to inquire about residential construction and equipment rentals.'
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const featuredProjects = projectsData.slice(0, 6);

  const displayedTools = useMemo(() => {
    if (selectedToolCat === 'all') {
      return initialToolsData.slice(0, 9);
    }
    return initialToolsData.filter((t) => t.category === selectedToolCat);
  }, [selectedToolCat]);

  return (
    <div className="home-page">
      {/* ── 1. HERO SECTION ── */}
      <section
        className="hero hero-home"
        id="hero"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(10, 14, 23, 0.92) 0%, rgba(15, 23, 42, 0.84) 55%, rgba(234, 88, 12, 0.35) 100%), url(${heroBgImg})`
        }}
      >
        <div className="container">
          <div className="hero-content">
            <div className="hero-kicker">
              <span>SRM AKASH CONSTRUCTION</span>
              <span aria-hidden="true">·</span>
              <span>MASONMATE PLATFORM</span>
            </div>

            <h1 className="hero-main-title">
              Building Your Vision With
              <br />
              <span>Strength &amp; Quality</span>
            </h1>

            <p className="hero-desc">
              Trusted turnkey house construction, certified master mason workforce deployment, and commercial construction tools &amp; equipment rentals across Salem and Coimbatore.
            </p>

            <div className="hero-actions">
              <Link to="/services" className="btn btn-quote-cta btn-lg">
                <span>Explore Services</span>
                <ArrowRight size={18} className="cta-arrow" />
              </Link>
              <Link to="/booking?type=mason" className="btn btn-outline-white btn-lg">
                <HardHat size={18} />
                <span>Book a Mason</span>
              </Link>
              <a
                href="#tools"
                className="btn btn-outline-white btn-lg"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Wrench size={17} />
                <span>Construction Tools</span>
              </a>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <div className="hero-stat-num tabular-nums">500+</div>
                <div className="hero-stat-lbl">Projects Completed</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-num tabular-nums">15+</div>
                <div className="hero-stat-lbl">Years Experience</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-num tabular-nums">100%</div>
                <div className="hero-stat-lbl">Quality Assured</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-num tabular-nums">4.9★</div>
                <div className="hero-stat-lbl">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SERVICES SECTION ── */}
      <section className="section" id="services">
        <div className="container">
          <SectionHeading
            eyebrow="SRM AKASH CONSTRUCTION SERVICES"
            title="Professional Construction & Mason Services"
            subtitle="End-to-end civil engineering, master masonry workforce deployment, structural renovations, building maintenance, and heavy equipment rentals."
          />

          <div className="grid-3">
            {servicesData.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>

          <div className="section-bottom-cta">
            <Link to="/services" className="btn btn-primary btn-lg">
              <span>View Turnkey Packages &amp; Workforce Rates</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. DEDICATED CONSTRUCTION TOOLS & EQUIPMENT SECTION ── */}
      <section className="section section-alt" id="tools">
        <div className="container">
          <SectionHeading
            eyebrow="CONSTRUCTION TOOLS & EQUIPMENT"
            title="Construction Tools & Site Machinery"
            subtitle="Rent calibrated construction tools and site equipment—including hammers, rotary drills, extension ladders, shovels, cement mixers, cutting machines, wheelbarrows, measuring tools, and safety gear."
            align="left"
            action={
              <Link to="/products" className="btn btn-accent">
                <span>View Full Rental Catalog ({initialToolsData.length} Tools)</span>
                <ArrowRight size={16} />
              </Link>
            }
          />

          {/* Interactive Category Filter Bar (No emojis) */}
          <div className="home-tools-filter-bar">
            {toolCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`tools-cat-pill ${selectedToolCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedToolCat(cat.id)}
              >
                <span className="tools-cat-label">{cat.label}</span>
                {selectedToolCat === cat.id && <span className="tools-cat-active-line" />}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {displayedTools.map((tool) => (
              <ToolCard key={tool._id || tool.id} tool={tool} />
            ))}
          </div>

          <div className="section-bottom-cta">
            <Link to="/products" className="btn btn-outline btn-lg">
              <span>Explore All Equipment &amp; Bulk Rental Rates</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. ABOUT / BUSINESS SECTION ── */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-business-grid">
            {/* Left: Construction & Architectural Visuals */}
            <div className="about-visual-column">
              <div className="about-primary-photo">
                <img
                  src={villaImg}
                  alt="Completed residential duplex villa by SRM Akash Construction"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="about-secondary-row">
                <div className="about-secondary-photo">
                  <img
                    src={masonryImg}
                    alt="Master mason bricklaying craftsmanship on site"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="about-stat-callout">
                  <span className="about-callout-num tabular-nums">15+</span>
                  <span className="about-callout-label">
                    Years of Civil Engineering &amp; Contracting Excellence Since 2009
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Business Story, Quality & Stats */}
            <div className="about-copy-column">
              <span className="section-eyebrow">ABOUT SRM AKASH CONSTRUCTION</span>
              <h2 className="about-heading">
                Engineering Dependable Homes &amp; Infrastructure Across Tamil Nadu
              </h2>
              <p className="about-lead-copy">
                Founded under <strong>SRM Akash Construction</strong>, MasonMate unites licensed civil engineering oversight, trade-tested master masons, and a calibrated construction machinery fleet under one accountable platform.
              </p>
              <p className="about-body-copy">
                Whether you are constructing a custom independent duplex villa from the ground up, remodeling an existing structure, or hiring specialized masonry crews and equipment on a daily schedule, every project is governed by strict IS 456 structural compliance, transparent Bill of Quantities (BOQ) pricing, and milestone sign-offs.
              </p>

              <div className="about-pillars-grid">
                <div className="about-pillar-item">
                  <div className="about-pillar-icon-wrap">
                    <Building2 size={20} className="about-pillar-icon" />
                  </div>
                  <div>
                    <strong>Turnkey Residential Builds</strong>
                    <p>Soil testing, structural RCC framing, Fe550D TMT steel, and key-in-hand execution.</p>
                  </div>
                </div>
                <div className="about-pillar-item">
                  <div className="about-pillar-icon-wrap">
                    <HardHat size={20} className="about-pillar-icon" />
                  </div>
                  <div>
                    <strong>Vetted Master Masons</strong>
                    <p>Experienced chief mistris, bricklayers, plasterers, and tile artisans on demand.</p>
                  </div>
                </div>
                <div className="about-pillar-item">
                  <div className="about-pillar-icon-wrap">
                    <Hammer size={20} className="about-pillar-icon" />
                  </div>
                  <div>
                    <strong>Commercial Tool Fleet</strong>
                    <p>Concrete mixers, scaffolding sets, drills, ladders, and breakers delivered to site.</p>
                  </div>
                </div>
                <div className="about-pillar-item">
                  <div className="about-pillar-icon-wrap">
                    <ShieldCheck size={20} className="about-pillar-icon" />
                  </div>
                  <div>
                    <strong>Transparent Sign-Offs</strong>
                    <p>Itemized stage billing, weekly progress logs, and a 10-year structural warranty.</p>
                  </div>
                </div>
              </div>

              {/* Verified Business Statistics */}
              <div className="about-metrics-bar">
                <div className="about-metric-cell">
                  <strong className="tabular-nums">15+</strong>
                  <span>Years Experience</span>
                </div>
                <div className="about-metric-cell">
                  <strong className="tabular-nums">500+</strong>
                  <span>Projects Completed</span>
                </div>
                <div className="about-metric-cell">
                  <strong className="tabular-nums">12+</strong>
                  <span>Tool Categories</span>
                </div>
                <div className="about-metric-cell">
                  <strong className="tabular-nums">4.9★</strong>
                  <span>Client Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── LEADERSHIP SECTION ── */}
          <div className="leadership-section-wrap" id="leadership">
            <AdminOwnerCard
              name="S. SIVAJI"
              role="Founder & Owner"
              company="SRM Akash Construction"
              location="Salem & Coimbatore, Tamil Nadu"
              experience="15+ Years Field Leadership"
              description="With over 15 years of hands-on site supervision and civil contracting across Salem and Coimbatore, S. SIVAJI personally oversees structural quality checks, foundation reinforcements, and transparent client handovers."
              phone="+91 9159687408"
              onWhatsAppClick={() =>
                openWhatsApp(
                  'Hello S. SIVAJI / SRM Akash Construction! I would like to consult about our upcoming house construction project.'
                )
              }
            />
          </div>
        </div>
      </section>

      {/* ── 5. LANDMARK PROJECTS / WORK SECTION ── */}
      <section className="section section-alt" id="projects">
        <div className="container">
          <SectionHeading
            eyebrow="PROJECT PORTFOLIO"
            title="Featured Construction & Structural Work"
            subtitle="Explore our completed residential villas, structural RCC apartment frames, and architectural renovations across Salem and Coimbatore."
            align="left"
            action={
              <Link to="/booking?type=construction" className="btn btn-primary">
                <span>Start Your Project</span>
                <ArrowRight size={16} />
              </Link>
            }
          />

          <div className="grid-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CLIENT TESTIMONIALS ── */}
      <section className="section" id="testimonials">
        <div className="container">
          <SectionHeading
            eyebrow="CLIENT FEEDBACK"
            title="Trusted by Homeowners & Builders"
            subtitle="Verified project outcomes from residential homeowners and contracting partners across Tamil Nadu."
          />

          <div className="grid-3">
            <div className="testimonial-card">
              <div className="testimonial-meta">
                <span>Fairlands, Salem</span>
                <span aria-hidden="true">·</span>
                <span>3BHK Duplex Turnkey Build</span>
              </div>
              <p className="testimonial-quote">
                "SRM Akash Construction built our 3BHK duplex in Salem in just 8 months. Their weekly WhatsApp photo logs and structural stage approvals gave us complete peace of mind."
              </p>
              <div className="testimonial-author">
                <strong>Rajesh Kumar</strong>
                <span>Residential Villa Owner · ★★★★★</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-meta">
                <span>RS Puram, Coimbatore</span>
                <span aria-hidden="true">·</span>
                <span>Master Masonry &amp; Flooring</span>
              </div>
              <p className="testimonial-quote">
                "We hired 4 master masons through MasonMate for plastering and granite flooring. The team was punctual, highly skilled, and maintained a clean site with zero material wastage."
              </p>
              <div className="testimonial-author">
                <strong>Dr. Meenakshi Sundaram</strong>
                <span>Homeowner · ★★★★★</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-meta">
                <span>Erode &amp; Coimbatore</span>
                <span aria-hidden="true">·</span>
                <span>Commercial Fleet Rental</span>
              </div>
              <p className="testimonial-quote">
                "Rented diesel concrete mixers, rotary drills, and steel scaffolding for our commercial complex. Machinery arrived on schedule in calibrated condition with prompt support."
              </p>
              <div className="testimonial-author">
                <strong>Murugan Builders</strong>
                <span>Civil Contracting Partner · ★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CORPORATE CONTACT & CONSULTATION SECTION ── */}
      <section className="section section-alt" id="home-contact">
        <div className="container">
          <div className="home-contact-strip-card">
            <div className="home-contact-header">
              <div>
                <span className="section-eyebrow" style={{ color: '#FDBA74' }}>
                  DIRECT CONSULTATION DESK
                </span>
                <h2>Ready to Start Your Construction Project?</h2>
                <p>
                  Connect directly with SRM Akash Construction for a complimentary site inspection, structural consultation, master mason booking, or equipment dispatch.
                </p>
              </div>
              <div className="home-contact-cta-group">
                <Link to="/booking" className="btn btn-quote-cta btn-lg">
                  <span>Book a Mason / Site Visit</span>
                  <ArrowRight size={17} className="cta-arrow" />
                </Link>
                <Link to="/contact" className="btn btn-outline-white btn-lg">
                  <span>Send an Inquiry</span>
                </Link>
              </div>
            </div>

            <div className="home-contact-items-grid">
              <ContactItem
                light
                icon={MapPin}
                label="Office & Service Coverage"
                value="Salem & Coimbatore"
                subtext="Tamil Nadu, India"
              />
              <ContactItem
                light
                icon={Phone}
                label="Direct Engineering Helpline"
                value="+91 9159687408"
                subtext="Call or WhatsApp Direct"
                href="tel:+919159687408"
              />
              <ContactItem
                light
                icon={Mail}
                label="Email Address"
                value="contact@masonmate.in"
                subtext="2-Hour Response Window"
                href="mailto:contact@masonmate.in"
              />
              <ContactItem
                light
                icon={Clock}
                label="Working Hours"
                value="Mon – Sat: 8:00 AM – 7:30 PM"
                subtext="On-Site Inspections Daily"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
