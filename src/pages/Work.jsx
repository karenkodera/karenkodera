import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { WORK_PROJECTS } from '../data/workProjects';
import './ProjectsIndex.css';

const Work = ({ setCursorVariant }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="projects-index">
      <header className="projects-index-header">
        <button
          type="button"
          className="projects-index-back"
          onClick={() => navigate('/')}
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          ← back
        </button>
        <h1 className="projects-index-title">Work</h1>
      </header>

      <div className="projects-index-grid">
        {WORK_PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            setCursorVariant={setCursorVariant}
          />
        ))}
      </div>
    </div>
  );
};

export default Work;
