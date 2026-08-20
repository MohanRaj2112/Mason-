import React from 'react';
import { Link } from 'react-router-dom';

export const ProjectCard = ({ project }) => {
  if (!project) return null;

  return (
    <div className="project-card" id={`project-${project.id}`}>
      <div className="project-img-wrapper">
        <img
          src={project.image}
          alt={project.title}
          className="project-img"
          loading="lazy"
        />
        {project.tag && (
          <span className="project-tag">
            {project.tag}
          </span>
        )}
      </div>

      <div className="project-body">
        <h3 className="project-title">{project.title}</h3>
        {project.specs && (
          <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '6px' }}>
            {project.specs}
          </div>
        )}
        <p>{project.description}</p>
        
        <div className="project-location">
          <span>📍</span>
          <span>{project.location}</span>
        </div>
      </div>
    </div>
  );
};
