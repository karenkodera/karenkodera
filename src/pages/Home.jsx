import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ScrollRuler from '../components/ScrollRuler';
import { WORK_PROJECTS } from '../data/workProjects';
import './Home.css';

function buildWorkStream() {
  return WORK_PROJECTS.map((project, workIdx) => {
    const float =
      workIdx % 4 === 0
        ? 'float-up'
        : workIdx % 4 === 1
          ? 'float-down'
          : workIdx % 4 === 2
            ? 'float-mid-up'
            : 'float-mid-down';
    return {
      kind: 'work',
      key: project.id,
      project,
      float,
    };
  });
}

const WORK_STREAM = buildWorkStream();

const Home = ({ setCursorVariant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollerRef = useRef(null);
  const [scrollEdge, setScrollEdge] = useState('start'); // start | middle | end

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

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const updateEdge = () => {
      const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const top = scroller.scrollTop;
      const edge = Math.min(window.innerHeight * 0.35, max * 0.35);
      if (top < edge) setScrollEdge('start');
      else if (top > max - edge) setScrollEdge('end');
      else setScrollEdge('middle');
    };

    updateEdge();
    scroller.addEventListener('scroll', updateEdge, { passive: true });
    window.addEventListener('resize', updateEdge);
    return () => {
      scroller.removeEventListener('scroll', updateEdge);
      window.removeEventListener('resize', updateEdge);
    };
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

  const goTop = () => {
    scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home home--vertical">
      <div
        className={`home-hero-chrome${scrollEdge === 'middle' ? ' home-hero-chrome--hidden' : ''}`}
      >
        {scrollEdge === 'end' ? (
          <button
            type="button"
            className="home-scroll-hint home-scroll-hint--action"
            onClick={goTop}
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            click to go back
          </button>
        ) : (
          <p className="home-scroll-hint" aria-hidden="true">
            scroll
          </p>
        )}
      </div>

      <div className="home-scroller" id="home-scroller" ref={scrollerRef}>
        {WORK_STREAM.map((item, index) => (
          <section
            key={item.key}
            className={`home-slide home-slide-card home-slide-${item.kind} ${item.float || ''}`}
          >
            <ProjectCard
              project={item.project}
              index={index}
              setCursorVariant={setCursorVariant}
            />
          </section>
        ))}
      </div>

      <ScrollRuler scrollerRef={scrollerRef} setCursorVariant={setCursorVariant} />
    </div>
  );
};

export default Home;
