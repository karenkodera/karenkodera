import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlaySwipeCarousel from '../components/PlaySwipeCarousel';
import './Play.css';
import './ProjectsIndex.css';

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

const Play = ({ setCursorVariant }) => {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="projects-index play-page">
      <div className="play-stage">
        <PlaySwipeCarousel
          projects={PLAY_PROJECTS}
          onOpen={setActiveProject}
          setCursorVariant={setCursorVariant}
        />
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

export { PLAY_PROJECTS, PlayModal };
export default Play;
