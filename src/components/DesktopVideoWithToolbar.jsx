import { useEffect, useRef, useState } from 'react';

/**
 * Gray box + browser toolbar image + full-width video + play/restart controls + bottom-left caption.
 * Same pattern as HSA/FSA Solution “Web desktop” (toolbar defaults to that case study asset).
 */
export default function DesktopVideoWithToolbar({
  src,
  subtitle,
  ariaLabel,
  toolbarSrc = '/hsafsa/toolbar.png',
  /** Larger framed area + contain fit (Bridg thesis hero) */
  tallFrame = false,
  poster,
}) {
  const videoRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => {
      if (el.readyState < 2) return; /* HAVE_CURRENT_DATA */
      el.play().catch(() => {});
      setIsPaused(false);
    };

    const playFromStartIfInView = () => {
      const rect = el.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) {
        el.currentTime = 0;
        tryPlay();
      }
    };

    const onReady = () => {
      playFromStartIfInView();
    };

    el.addEventListener('canplay', onReady);
    el.addEventListener('loadeddata', onReady);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.currentTime = 0;
          tryPlay();
        }
      },
      { threshold: 0.05, rootMargin: '120px 0px' }
    );
    observer.observe(el);

    // Hero / above-the-fold: IO may race before metadata; one tick retry
    const t = window.setTimeout(playFromStartIfInView, 100);

    return () => {
      window.clearTimeout(t);
      observer.disconnect();
      el.removeEventListener('canplay', onReady);
      el.removeEventListener('loadeddata', onReady);
    };
  }, [src]);

  const handleEnded = () => {
    const el = videoRef.current;
    if (!el) return;
    setTimeout(() => {
      el.currentTime = 0;
      el.play().catch(() => {});
      setIsPaused(false);
    }, 1000);
  };

  const handleRewind = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
    setIsPaused(false);
  };

  const handlePausePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setIsPaused(false);
    } else {
      el.pause();
      setIsPaused(true);
    }
  };

  return (
    <div
      className={`thesis-iphone-gray-box thesis-desktop-video-wrap${tallFrame ? ' thesis-desktop-video-wrap--hero' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {showControls && (
        <div className="thesis-iphone-video-controls" aria-hidden="true">
          <button
            type="button"
            className="thesis-iphone-video-control-btn"
            onClick={handlePausePlay}
            aria-label={isPaused ? 'Play video' : 'Pause video'}
          >
            {isPaused ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="thesis-iphone-video-control-btn"
            onClick={handleRewind}
            aria-label="Restart video"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      )}
      <figure className="thesis-figure thesis-desktop-video-figure">
        <img src={toolbarSrc} alt="" className="thesis-desktop-toolbar" role="presentation" />
        {tallFrame ? (
          <div className="thesis-desktop-video-inner">
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              className="thesis-desktop-video"
              playsInline
              muted
              loop={false}
              preload="auto"
              aria-label={ariaLabel}
              onEnded={handleEnded}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="thesis-desktop-video"
            playsInline
            muted
            loop={false}
            preload="metadata"
            aria-label={ariaLabel}
            onEnded={handleEnded}
          >
            Your browser does not support the video tag.
          </video>
        )}
        <div className="thesis-iphone-video-bottom">
          {subtitle && <figcaption className="thesis-iphone-video-subtitle">{subtitle}</figcaption>}
        </div>
      </figure>
    </div>
  );
}
