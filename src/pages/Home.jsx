import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { WORK_PROJECTS } from '../data/workProjects';
import './Home.css';

const Home = ({ setCursorVariant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const onKeyDown = (e) => {
      if (
        document.querySelector('.play-modal-overlay') ||
        document.querySelector('.password-gate')
      ) {
        return;
      }
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
        return;
      }

      const page = Math.max(240, Math.floor(window.innerHeight * 0.55));
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
        if (scroller.scrollTop < max - 2) {
          e.preventDefault();
          scroller.scrollTop = Math.min(max, scroller.scrollTop + page);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (scroller.scrollTop > 2) {
          e.preventDefault();
          scroller.scrollTop = Math.max(0, scroller.scrollTop - page);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        scroller.scrollTop = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        scroller.scrollTop = scroller.scrollHeight;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Legacy hashes: /#about → /, /#play → /play, /#work → /work
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'about') {
      navigate('/', { replace: true });
      return;
    }
    if (hash === 'play') {
      navigate('/play', { replace: true });
      return;
    }
    if (hash === 'work' || hash) {
      if (window.history.replaceState) {
        window.history.replaceState(null, '', '/work');
      }
    }
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [location.hash, navigate]);

  return (
    <div className="home home--vertical">
      <div className="home-scroller" id="home-scroller" ref={scrollerRef}>
        <div className="home-work-grid">
          {WORK_PROJECTS.map((project, index) => (
            <div key={project.id} className="home-work-cell">
              <ProjectCard
                project={project}
                index={index}
                setCursorVariant={setCursorVariant}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
