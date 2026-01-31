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

  return (
    <motion.div
      className="project-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
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
            padding: isHovered ? '16px 16px 8px 16px' : 0,
          }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
        >
          <div className="project-card-inner">
            <div className="project-image-wrapper">
              <img 
                src={project.image} 
                alt={project.title}
                className="project-image"
                loading="lazy"
              />
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
