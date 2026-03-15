import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, index, setCursorVariant }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setCursorVariant('project');
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setCursorVariant('default');
    setIsHovered(false);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 24,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.06
      }
    }
  };

  const CardWrapper = project.link ? Link : 'div';
  const cardProps = project.link ? { to: project.link } : {};

  const isWip = project.workInProgress === true;

  return (
    <motion.div
      className={`project-card${isWip ? ' project-card-wip' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <CardWrapper
        {...cardProps}
        className="project-card-link"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="project-card-content"
          animate={{
            padding: isHovered ? 8 : 0,
            margin: isHovered ? -8 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="project-card-inner">
            <div className="project-image-wrapper">
              <img 
                src={project.image} 
                alt={project.title}
                className="project-image"
                loading="lazy"
              />
              {isWip && (
                <div className="project-wip-badge" aria-hidden="true">
                  <svg className="project-wip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span>Work In Progress</span>
                </div>
              )}
            </div>
            
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <div className="project-meta">
                <p className="project-subtitle">{project.subtitle}</p>
                <span className="project-tag">{project.tags.slice(0, 2).join(' ')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </CardWrapper>
    </motion.div>
  );
};

export default ProjectCard;
