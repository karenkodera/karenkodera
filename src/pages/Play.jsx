import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import './Play.css';

const PLAY_PROJECTS = [
  {
    id: 'interaction-art',
    title: 'Interaction Art',
    subtitle: 'Installation',
    cover: 'https://placehold.co/800x500/e8e4df/6b6560?text=Interaction+Art',
    modalTitle: 'Interaction Art',
    modalBody:
      'For my installation art class. Exploring how people move through space, leave traces, and change the piece just by being there.',
    slides: [
      'https://placehold.co/1200x800/e8e4df/6b6560?text=Slide+1',
      'https://placehold.co/1200x800/d9d4ce/6b6560?text=Slide+2',
      'https://placehold.co/1200x800/cdc7c0/6b6560?text=Slide+3',
    ],
  },
  {
    id: 'weekend-ui',
    title: 'Weekend UI',
    subtitle: 'Interface sketches',
    cover: 'https://placehold.co/800x500/e4ebe8/5f6b66?text=Weekend+UI',
    modalTitle: 'Weekend UI',
    modalBody:
      'Quick interface sketches from weekends between projects. Loose explorations of empty states, motion, and little moments of delight.',
    slides: [
      'https://placehold.co/1200x800/e4ebe8/5f6b66?text=Slide+1',
      'https://placehold.co/1200x800/d5ddd9/5f6b66?text=Slide+2',
      'https://placehold.co/1200x800/c6d0cb/5f6b66?text=Slide+3',
    ],
  },
  {
    id: 'photo-walks',
    title: 'Photo Walks',
    subtitle: 'Personal archive',
    cover: 'https://placehold.co/800x500/ebe6e0/6a645e?text=Photo+Walks',
    modalTitle: 'Photo Walks',
    modalBody:
      'A personal archive of walks and light. Color, material, and quiet details that end up informing product work later.',
    slides: [
      'https://placehold.co/1200x800/ebe6e0/6a645e?text=Slide+1',
      'https://placehold.co/1200x800/ddd7d0/6a645e?text=Slide+2',
    ],
  },
  {
    id: 'object-studies',
    title: 'Object Studies',
    subtitle: 'Form & material',
    cover: 'https://placehold.co/800x500/e7e9ec/5e636a?text=Object+Studies',
    modalTitle: 'Object Studies',
    modalBody:
      'Still-life and form studies looking at edges, joins, and materials. Reference for future product stories and physical prototypes.',
    slides: [
      'https://placehold.co/1200x800/e7e9ec/5e636a?text=Slide+1',
      'https://placehold.co/1200x800/d8dbe0/5e636a?text=Slide+2',
      'https://placehold.co/1200x800/c9ced4/5e636a?text=Slide+3',
      'https://placehold.co/1200x800/bac0c8/5e636a?text=Slide+4',
    ],
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

function PlayCard({ project, index, setCursorVariant, onOpen }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="play-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.06,
      }}
    >
      <button
        type="button"
        className="play-card-link"
        onClick={() => onOpen(project)}
        onMouseEnter={() => {
          setIsHovered(true);
          setCursorVariant?.('project');
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setCursorVariant?.('default');
        }}
      >
        <motion.div
          className="play-card-content"
          animate={{
            padding: isHovered ? 8 : 0,
            margin: isHovered ? -8 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="play-card-inner">
            <div className="play-card-image-wrap">
              <img src={project.cover} alt="" className="play-card-image" loading="lazy" />
            </div>
            <div className="play-card-text">
              <h3 className="play-card-title">{project.title}</h3>
              <p className="play-card-subtitle">{project.subtitle}</p>
            </div>
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

const Play = ({ setCursorVariant }) => {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="play-page">
      <Hero setCursorVariant={setCursorVariant} />

      <section className="play-projects" id="play">
        <div className="play-grid">
          {PLAY_PROJECTS.map((project, index) => (
            <PlayCard
              key={project.id}
              project={project}
              index={index}
              setCursorVariant={setCursorVariant}
              onOpen={setActiveProject}
            />
          ))}
        </div>
      </section>

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
