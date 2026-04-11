import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Displayed width/height of video with object-fit: contain inside cw×ch. */
function containedVideoDisplaySize(video, cw, ch) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh || !cw || !ch) return null;
  const scale = Math.min(cw / vw, ch / vh);
  return { w: vw * scale, h: vh * scale };
}

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
  const videoInnerRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [heroStackWidthPx, setHeroStackWidthPx] = useState(null);

  useLayoutEffect(() => {
    if (!tallFrame) {
      setHeroStackWidthPx(null);
      return;
    }
    const video = videoRef.current;
    const inner = videoInnerRef.current;
    if (!video || !inner) return;

    const updateStackWidth = () => {
      const cw = inner.clientWidth;
      const ch = inner.clientHeight;
      const size = containedVideoDisplaySize(video, cw, ch);
      if (size && size.w >= 2) {
        setHeroStackWidthPx(Math.round(size.w));
      }
    };

    const ro = new ResizeObserver(() => {
      window.requestAnimationFrame(updateStackWidth);
    });
    ro.observe(inner);

    const onVideoMeta = () => {
      requestAnimationFrame(updateStackWidth);
    };
    video.addEventListener('loadedmetadata', onVideoMeta);
    video.addEventListener('loadeddata', onVideoMeta);

    updateStackWidth();

    return () => {
      ro.disconnect();
      video.removeEventListener('loadedmetadata', onVideoMeta);
      video.removeEventListener('loadeddata', onVideoMeta);
    };
  }, [tallFrame, src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute('muted', '');

    const tryPlay = () => {
      el.play().catch(() => {});
      setIsPaused(false);
    };

    const playIfInView = () => {
      const rect = el.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) tryPlay();
    };

    const onReady = () => {
      playIfInView();
    };

    el.addEventListener('canplay', onReady);
    el.addEventListener('loadeddata', onReady);
    el.addEventListener('loadedmetadata', onReady);

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

    const timers = [0, 120, 400, 1000].map((ms) => window.setTimeout(playIfInView, ms));

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      observer.disconnect();
      el.removeEventListener('canplay', onReady);
      el.removeEventListener('loadeddata', onReady);
      el.removeEventListener('loadedmetadata', onReady);
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
        {tallFrame ? (
          <div
            className="thesis-desktop-hero-window-stack"
            style={
              heroStackWidthPx != null
                ? { width: heroStackWidthPx, maxWidth: '100%' }
                : { width: '100%', maxWidth: '100%' }
            }
          >
            <div className="thesis-desktop-toolbar-pane">
              <img src={toolbarSrc} alt="" className="thesis-desktop-toolbar" role="presentation" />
            </div>
            <div className="thesis-desktop-video-inner" ref={videoInnerRef}>
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="thesis-desktop-video"
                playsInline
                muted
                autoPlay
                loop={false}
                preload="auto"
                aria-label={ariaLabel}
                onEnded={handleEnded}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <>
            <img src={toolbarSrc} alt="" className="thesis-desktop-toolbar" role="presentation" />
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              className="thesis-desktop-video"
              playsInline
              muted
              autoPlay
              loop={false}
              preload="metadata"
              aria-label={ariaLabel}
              onEnded={handleEnded}
            >
              Your browser does not support the video tag.
            </video>
          </>
        )}
        <div className="thesis-iphone-video-bottom">
          {subtitle && <figcaption className="thesis-iphone-video-subtitle">{subtitle}</figcaption>}
        </div>
      </figure>
    </div>
  );
}
