import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RESUME_URL } from '../components/Hero';
import './Play.css';
import './ProjectsIndex.css';
import './Home.css';

const isVideoSrc = (src) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(src || '');

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
  {
    id: 'sewing-clothes',
    title: 'Sewing my climbing closet from scratch',
    subtitle: "Learning how to use my mother's sewing machine in my free time!",
    cover: '/play/sewing-clothes/video.mov',
    coverPortrait: true,
    coverVideo: true,
    modalTitle: 'Sewing my climbing closet from scratch',
    modalBody: "Learning how to use my mother's sewing machine in my free time!",
    slides: ['/play/sewing-clothes/video.mov'],
  },
];

function PlayModal({ project, onClose, setCursorVariant }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const videoRef = useRef(null);
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

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isVideoSrc(currentSrc)) return undefined;
    el.muted = true;
    const tryPlay = () => {
      el.play().catch(() => {});
    };
    tryPlay();
    el.addEventListener('canplay', tryPlay);
    return () => el.removeEventListener('canplay', tryPlay);
  }, [currentSrc, project?.id, slideIndex]);

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
              {isVideoSrc(currentSrc) ? (
                <motion.video
                  key={`${project.id}-${slideIndex}`}
                  ref={videoRef}
                  src={currentSrc}
                  className="play-modal-image play-modal-video"
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
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
              )}
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className={`play-card-content play-card-content--cover-only${isHovered ? ' is-hovered' : ''}`}
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
              {project.coverVideo || isVideoSrc(project.cover) ? (
                <video
                  src={project.cover}
                  className="play-card-image"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              ) : (
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
              )}
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="projects-index play-page">
      <nav className="home-section-nav" aria-label="Sections">
        <button
          type="button"
          className="home-section-btn"
          onClick={() => navigate('/#work')}
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          work
        </button>
        <button
          type="button"
          className="home-section-btn"
          aria-current="page"
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          <span className="home-section-dot" aria-hidden />
          play
        </button>
        <button
          type="button"
          className="home-section-btn"
          onClick={() => navigate('/#about')}
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          about
        </button>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="home-section-btn home-section-btn--resume"
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          resume
          <span className="home-section-btn-arrow" aria-hidden>↗</span>
        </a>
      </nav>

      <div className="play-stage">
        <div className="play-row" aria-label="Play projects">
          {PLAY_PROJECTS.map((project, index) => (
              <motion.div
                key={project.id}
                className="play-row-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: index * 0.06,
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
          ))}
        </div>
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
