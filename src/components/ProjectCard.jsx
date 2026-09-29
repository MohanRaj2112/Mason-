import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';
import villaImg from '../assets/images/project_luxury_villa_1790694687569.jpg';

export const ProjectCard = ({ project, featured = false }) => {
  if (!project) return null;

  const isFeatured = featured || project.featured;

  return (
    <article
      className={`project-card ${isFeatured ? 'project-card-featured' : ''}`}
      id={`project-${project.id || project.projectId}`}
    >
      <div className="project-img-wrapper">
        <img
          src={project.image || villaImg}
          alt={project.title}
          className="project-img"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = villaImg;
          }}
        />
        <div className="project-hover-overlay">
          <Link to="/booking?type=construction" className="project-overlay-cta">
            <span>Inquire Similar Build</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="project-body">
        <div className="project-meta-row">
          <span>{project.tag || project.category || 'Residential Build'}</span>
          {project.specs && (
            <>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{project.specs.replace('|', '·')}</span>
            </>
          )}
        </div>

        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        <div className="project-footer-bar">
          <div className="project-location">
            <MapPin size={15} className="project-loc-icon" />
            <span>{project.location}</span>
          </div>
          <Link to="/booking?type=estimate" className="project-text-link">
            <span>Request Specs</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
