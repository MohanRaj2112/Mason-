import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  MapPin,
  Mail,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Hammer,
  Building2,
  HardHat
} from 'lucide-react';
import { servicesData } from '../data/services';
import { projectsData } from '../data/projects';
import { initialToolsData } from '../data/tools';
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
  const openWhatsApp = (msg) => {
    const phone = '919159687408';
    const text = encodeURIComponent(
      msg || 'Hello Mason Mate, I would like to inquire about residential construction and equipment rentals.'
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const featuredProjects = projectsData.slice(0, 5);
  const featuredTools = initialToolsData.filter((t) => t.featured).slice(0, 3);

  return (
    <div className="home-page">
      {/* ── 1. HERO SECTION ── */}
      <section
        className="hero hero-home"
        id="hero"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(10, 14, 23, 0.91) 0%, rgba(15, 23, 42, 0.80) 52%, rgba(168, 42, 16, 0.38) 100%), url(${heroBgImg})`
        }}
      >
        <div className="container">
          <div className="hero-content">
            <div className="hero-kicker">
              <span>BUILDING YOUR VISION</span>
              <span aria-hidden="true">·</span>
              <span>SRM AKASH CONSTRUCTION</span>
            </div>

            <h1 className="hero-main-title">
              Quality Construction.
              <br />
              <span>Built to Last.</span>
            </h1>

            <p className="hero-desc">
              Professional construction services, skilled master masonry workmanship, and reliable commercial equipment solutions for your residential and commercial projects across Salem and Coimbatore.
            </p>

            <div className="hero-actions">
              <Link to="/services" className="btn btn-quote-cta btn-lg">
                <span>Explore Our Services</span>
                <ArrowRight size={18} className="cta-arrow" />
              </Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">
                <span>Contact Us</span>
              </Link>
              <Link to="/booking" className="btn btn-outline-white btn-lg">
                <span>Book Free Site Visit</span>
              </Link>
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
            eyebrow="CORE CAPABILITIES"
            title="Professional Construction Services"
            subtitle="End-to-end civil engineering, master masonry workforce deployment, structural renovations, and heavy equipment rentals."
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

      {/* ── 3. ABOUT / BUSINESS SECTION ── */}
      <section className="section section-alt" id="about">
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
                Founded under SRM AKASH CONSTRUCTION, Mason Mate unites licensed civil engineering oversight, trade-tested master masons, and a calibrated machinery fleet under one accountable roof.
              </p>
              <p className="about-body-copy">
                Whether you are constructing a custom independent duplex villa from the ground up, remodeling an existing structure, or hiring specialized masonry crews and equipment on a daily schedule, every project is governed by strict IS 456 structural compliance, transparent Bill of Quantities (BOQ) pricing, and milestone sign-offs.
              </p>

              <div className="about-pillars-grid">
                <div className="about-pillar-item">
                  <Building2 size={20} className="about-pillar-icon" />
                  <div>
                    <strong>Turnkey Residential Builds</strong>
                    <p>Soil testing, structural RCC framing, Fe550D TMT steel, and key-in-hand execution.</p>
                  </div>
                </div>
                <div className="about-pillar-item">
                  <HardHat size={20} className="about-pillar-icon" />
                  <div>
                    <strong>Vetted Master Masons</strong>
                    <p>Experienced chief mistris, bricklayers, plasterers, and tile artisans on demand.</p>
                  </div>
                </div>
                <div className="about-pillar-item">
                  <Hammer size={20} className="about-pillar-icon" />
                  <div>
                    <strong>Commercial Tool Fleet</strong>
                    <p>Concrete mixers, scaffolding sets, needle vibrators, and breakers delivered to site.</p>
                  </div>
                </div>
                <div className="about-pillar-item">
                  <ShieldCheck size={20} className="about-pillar-icon" />
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
                  <strong className="tabular-nums">6</strong>
                  <span>Core Services</span>
                </div>
                <div className="about-metric-cell">
                  <strong className="tabular-nums">4.9★</strong>
                  <span>Client Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. ADMIN / OWNER LEADERSHIP SECTION ── */}
          <div className="leadership-section-wrap" id="leadership">
            <AdminOwnerCard
              name="Er. Mohanraj"
              role="Founder & Chief Managing Contractor"
              company="SRM AKASH CONSTRUCTION · Mason Mate"
              location="Salem & Coimbatore, Tamil Nadu"
              experience="15+ Years Field Leadership"
              description="With over 15 years of hands-on site supervision and civil contracting across Salem and Coimbatore, Mohanraj personally oversees structural quality checks, foundation reinforcements, and transparent client handovers."
              phone="+91 9159687408"
              onWhatsAppClick={() =>
                openWhatsApp(
                  'Hello Mohanraj / Mason Mate! I would like to consult about our upcoming house construction project.'
                )
              }
            />
          </div>
        </div>
      </section>

      {/* ── 5. LANDMARK PROJECTS / WORK SECTION ── */}
      <section className="section" id="projects">
        <div className="container">
          <SectionHeading
            eyebrow="PROJECT PORTFOLIO"
            title="Featured Construction & Structural Work"
            subtitle="Explore our completed residential villas, structural RCC apartment frames, and architectural renovations across Salem and Coimbatore."
            align="left"
            action={
              <Link to="/booking?type=construction" className="btn btn-outline">
                <span>Start Your Project</span>
                <ArrowRight size={16} />
              </Link>
            }
          />

          <div className="project-showcase-grid">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. EQUIPMENT & TOOLS RENTAL PREVIEW ── */}
      <section className="section section-alt" id="tool-rentals-preview">
        <div className="container">
          <SectionHeading
            eyebrow="COMMERCIAL EQUIPMENT FLEET"
            title="Construction Machinery & Tool Rentals"
            subtitle="Daily serviced concrete mixers, scaffolding frames, demolition hammers, and de-watering pumps available for rapid site delivery."
            align="left"
            action={
              <Link to="/products" className="btn btn-accent">
                <span>Browse All {initialToolsData.length} Equipment Units</span>
                <ArrowRight size={16} />
              </Link>
            }
          />

          <div className="grid-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool._id || tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CLIENT TESTIMONIALS ── */}
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
                "Mason Mate built our 3BHK duplex in Salem in just 8 months. Their weekly WhatsApp photo logs and structural stage approvals gave us complete peace of mind."
              </p>
              <div className="testimonial-author">
                <strong>Rajesh Kumar</strong>
                <span>Residential Villa Owner</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-meta">
                <span>RS Puram, Coimbatore</span>
                <span aria-hidden="true">·</span>
                <span>Master Masonry &amp; Flooring</span>
              </div>
              <p className="testimonial-quote">
                "We hired 4 master masons for plastering and granite flooring. The team was punctual, highly skilled, and maintained a clean site with zero material wastage."
              </p>
              <div className="testimonial-author">
                <strong>Dr. Meenakshi Sundaram</strong>
                <span>Homeowner</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-meta">
                <span>Erode &amp; Coimbatore</span>
                <span aria-hidden="true">·</span>
                <span>Commercial Fleet Rental</span>
              </div>
              <p className="testimonial-quote">
                "Rented diesel concrete mixers and steel scaffolding for our commercial complex. Machinery arrived on schedule in calibrated condition with prompt support."
              </p>
              <div className="testimonial-author">
                <strong>Murugan Builders</strong>
                <span>Civil Contracting Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. CORPORATE CONTACT & CONSULTATION SECTION ── */}
      <section className="section section-alt" id="home-contact">
        <div className="container">
          <div className="home-contact-strip-card">
            <div className="home-contact-header">
              <div>
                <span className="section-eyebrow">GET IN TOUCH</span>
                <h2>Ready to Discuss Your Construction Project?</h2>
                <p>
                  Connect directly with our civil engineering desk for a complimentary site inspection, structural consultation, or equipment dispatch.
                </p>
              </div>
              <div className="home-contact-cta-group">
                <Link to="/booking" className="btn btn-quote-cta btn-lg">
                  <span>Book Free Site Visit</span>
                  <ArrowRight size={17} className="cta-arrow" />
                </Link>
                <Link to="/contact" className="btn btn-outline btn-lg">
                  <span>Send an Inquiry</span>
                </Link>
              </div>
            </div>

            <div className="home-contact-items-grid">
              <ContactItem
                icon={MapPin}
                label="Office & Service Coverage"
                value="Salem & Coimbatore"
                subtext="Tamil Nadu, India"
              />
              <ContactItem
                icon={Phone}
                label="Direct Engineering Helpline"
                value="+91 9159687408"
                subtext="Call or WhatsApp Direct"
                href="tel:+919159687408"
              />
              <ContactItem
                icon={Mail}
                label="Email Address"
                value="contact@masonmate.in"
                subtext="2-Hour Response Window"
                href="mailto:contact@masonmate.in"
              />
              <ContactItem
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
