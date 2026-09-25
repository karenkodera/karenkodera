import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Play.css';
import './ProjectsIndex.css';

const PLAY_PROJECTS = [
  {
    id: 'grand-piano',
    title: 'Grand Piano',
    subtitle: 'A 2-player working floor piano that leads players through songs with light-up keys.',
    cover: '/play/grand-piano/demo.png',
    coverPortrait: true,
    modalTitle: 'Grand Piano',
    modalBody:
      'A 2-player working floor piano that leads players through songs with light-up keys.',
    slides: [
      '/play/grand-piano/demo.png',
      '/play/grand-piano/cover.png',
      '/play/grand-piano/build.png',
    ],
  },
  {
    id: 'carrot',
    title: 'CARROT',
    subtitle:
      'Transforming the ordinary act of grocery shopping into an unexpected moment with sewn stuffed carrot installation art.',
    cover: '/play/carrot/cover.png',
    coverPortrait: true,
    coverZoom: true,
    modalTitle: 'CARROT',
    modalBody:
      'Transforming the ordinary act of grocery shopping into an unexpected moment with sewn stuffed carrot installation art.',
    slides: [
      '/play/carrot/cover.png',
      '/play/carrot/01.png',
      '/play/carrot/02.png',
      '/play/carrot/03.png',
    ],
  },
  {
    id: 'weight-of-a-heart',
    title: 'WEIGHT OF A HEART',
    subtitle: '2024',
    cover: '/play/weight-of-a-heart/cover.png',
    coverPortrait: true,
    coverZoom: true,
    coverFocus: 'bl',
    modalTitle: 'WEIGHT OF A HEART: 2024',
    modalBody: 'WEIGHT OF A HEART: 2024',
    slides: ['/play/weight-of-a-heart/cover.png'],
  },
];

function PlayModal({ project, onClose, setCursorVariant }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = project?.slides ?? [];
  const currentSrc = slides[slideIndex];

  const goPrev = useCallback(() => {
    setSlideIndex((i) => (i <= 0 ? slides.length - 1 : i - 1));
  }, [slides.length]);

  const goNext = useCallback(() => {
    setSlideIndex((i) => (i >= slides.length - 1 ? 0 : i + 1));
  }, [slides.length]);

  useEffect(() => {
    setSlideIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose, goPrev, goNext]);

  if (!project || !currentSrc) return null;

  return (
    <motion.div
      className="play-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        className="play-modal"
        role="dialog"
        aria-modal="true"
        aria-label={project.modalTitle || project.title}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="play-modal-close"
          onClick={onClose}
          aria-label="Close"
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          ×
        </button>

        <div className="play-modal-image-row">
          <button
            type="button"
            className="play-modal-nav play-modal-nav-prev"
            onClick={goPrev}
            aria-label="Previous image"
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            ←
          </button>

          <div className="play-modal-media">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${project.id}-${slideIndex}`}
                src={currentSrc}
                alt=""
                className="play-modal-image"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="play-modal-nav play-modal-nav-next"
            onClick={goNext}
            aria-label="Next image"
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            →
          </button>
        </div>

        <div className="play-modal-footer">
          <div className="play-modal-dots" role="tablist" aria-label="Slides">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === slideIndex}
                className={`play-modal-dot${i === slideIndex ? ' active' : ''}`}
                onClick={() => setSlideIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="play-modal-copy">
            <h2 className="play-modal-title">{project.modalTitle}</h2>
            <p className="play-modal-body">{project.modalBody}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PlayCard({ project, index, setCursorVariant, onOpen, stacked = false }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`play-card${stacked ? ' play-card--stacked' : ''}`}
      initial={stacked ? false : { opacity: 0, y: 24 }}
      animate={stacked ? undefined : { opacity: 1, y: 0 }}
      transition={
        stacked
          ? undefined
          : {
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              delay: index * 0.06,
            }
      }
    >
      <button
        type="button"
        className="play-card-link"
        onClick={() => onOpen(project)}
        aria-label={`${project.title}. ${project.subtitle}`}
        onMouseEnter={() => {
          setIsHovered(true);
          if (!stacked) setCursorVariant?.('project');
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!stacked) setCursorVariant?.('default');
        }}
      >
        <motion.div
          className="play-card-content play-card-content--cover-only"
          animate={
            stacked
              ? undefined
              : {
                  padding: isHovered ? 6 : 0,
                  margin: isHovered ? -6 : 0,
                }
          }
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="play-card-inner play-card-inner--cover-only">
            <div
              className={`play-card-image-wrap${project.coverPortrait ? ' play-card-image-wrap--portrait' : ''}`}
            >
              <img
                src={project.cover}
                alt=""
                className={[
                  'play-card-image',
                  project.coverZoom ? 'play-card-image--zoom' : '',
                  project.coverFocus ? `play-card-image--focus-${project.coverFocus}` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

const Play = ({ setCursorVariant }) => {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="projects-index play-page">
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
      </header>

      <div className="play-stack" aria-label="Play projects">
        {PLAY_PROJECTS.map((project, index) => {
          const isHovered = hoveredId === project.id;
          const stackX = index * 22;
          const stackY = index * 28;
          const stackRotate = (index - 1) * 4;

          return (
            <motion.div
              key={project.id}
              className="play-stack-item"
              style={{ zIndex: isHovered ? 20 : index + 1 }}
              initial={{ opacity: 0, y: 24 }}
              animate={{
                opacity: 1,
                x: isHovered ? stackX + 36 : stackX,
                y: isHovered ? stackY - 28 : stackY,
                rotate: isHovered ? stackRotate - 3 : stackRotate,
                scale: isHovered ? 1.06 : 1,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onMouseEnter={() => {
                setHoveredId(project.id);
                setCursorVariant?.('project');
              }}
              onMouseLeave={() => {
                setHoveredId(null);
                setCursorVariant?.('default');
              }}
            >
              <PlayCard
                project={project}
                index={index}
                setCursorVariant={setCursorVariant}
                onOpen={setActiveProject}
                stacked
              />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeProject && (
          <PlayModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
            setCursorVariant={setCursorVariant}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export { PLAY_PROJECTS, PlayModal, PlayCard };
export default Play;
