import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Displayed width/height of media with object-fit: contain inside cw×ch. */
function containedDisplaySize(intrinsicW, intrinsicH, cw, ch) {
  if (!intrinsicW || !intrinsicH || !cw || !ch) return null;
  const scale = Math.min(cw / intrinsicW, ch / intrinsicH);
  return { w: intrinsicW * scale, h: intrinsicH * scale };
}

function containedVideoDisplaySize(video, cw, ch) {
  return containedDisplaySize(video.videoWidth, video.videoHeight, cw, ch);
}

/**
 * Gray box + browser toolbar image + full-width video or static site image + play/restart controls + bottom-left caption.
 * Same pattern as HSA/FSA Solution “Web desktop” (toolbar defaults to that case study asset).
 */
export default function DesktopVideoWithToolbar({
  src,
  /** Static screenshot in the same chrome as video (e.g. Bridg dashboard PNG). */
  imageSrc,
  subtitle,
  ariaLabel,
  toolbarSrc = '/hsafsa/toolbar.png',
  /** Larger framed area + contain fit (Bridg thesis hero) */
  tallFrame = false,
  poster,
}) {
  const mediaRef = useRef(null);
  const videoInnerRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [heroStackWidthPx, setHeroStackWidthPx] = useState(null);

  const isImage = Boolean(imageSrc);

  useLayoutEffect(() => {
    if (!tallFrame) {
      setHeroStackWidthPx(null);
      return;
    }
    const inner = videoInnerRef.current;
    const media = mediaRef.current;
    if (!inner) return;

    const updateStackWidth = () => {
      const m = mediaRef.current;
      if (!m) return;
      const cw = inner.clientWidth;
      const ch = inner.clientHeight;
      let size = null;
      if (isImage) {
        size = containedDisplaySize(m.naturalWidth, m.naturalHeight, cw, ch);
      } else {
        size = containedVideoDisplaySize(m, cw, ch);
      }
      if (size && size.w >= 2) {
        setHeroStackWidthPx(Math.round(size.w));
      }
    };

    const ro = new ResizeObserver(() => {
      window.requestAnimationFrame(updateStackWidth);
    });
    ro.observe(inner);

    if (isImage) {
      media?.addEventListener('load', updateStackWidth);
    } else if (media) {
      media.addEventListener('loadedmetadata', updateStackWidth);
      media.addEventListener('loadeddata', updateStackWidth);
    }

    updateStackWidth();

    return () => {
      ro.disconnect();
      const m = mediaRef.current;
      if (isImage) {
        m?.removeEventListener('load', updateStackWidth);
      } else if (m) {
        m.removeEventListener('loadedmetadata', updateStackWidth);
        m.removeEventListener('loadeddata', updateStackWidth);
      }
    };
  }, [tallFrame, src, imageSrc, isImage]);

  useEffect(() => {
    if (isImage) return;
    const el = mediaRef.current;
    if (!el || el.tagName !== 'VIDEO') return;

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
  }, [src, isImage]);

  const handleEnded = () => {
    const el = mediaRef.current;
    if (!el || el.tagName !== 'VIDEO') return;
    setTimeout(() => {
      el.currentTime = 0;
      el.play().catch(() => {});
      setIsPaused(false);
    }, 1000);
  };

  const handleRewind = () => {
    const el = mediaRef.current;
    if (!el || el.tagName !== 'VIDEO') return;
    el.currentTime = 0;
    el.play().catch(() => {});
    setIsPaused(false);
  };

  const handlePausePlay = () => {
    const el = mediaRef.current;
    if (!el || el.tagName !== 'VIDEO') return;
    if (el.paused) {
      el.play().catch(() => {});
      setIsPaused(false);
    } else {
      el.pause();
      setIsPaused(true);
    }
  };

  const mediaNode = isImage ? (
    <img
      ref={mediaRef}
      src={imageSrc}
      alt={ariaLabel ?? ''}
      className="thesis-desktop-video"
      decoding="async"
    />
  ) : (
    <video
      ref={mediaRef}
      src={src}
      poster={poster}
      className="thesis-desktop-video"
      playsInline
      muted
      autoPlay
      loop={false}
      preload={tallFrame ? 'auto' : 'metadata'}
      aria-label={ariaLabel}
      onEnded={handleEnded}
    >
      Your browser does not support the video tag.
    </video>
  );

  return (
    <div
      className={`thesis-iphone-gray-box thesis-desktop-video-wrap${tallFrame ? ' thesis-desktop-video-wrap--hero' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {showControls && !isImage && (
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
              {mediaNode}
            </div>
          </div>
        ) : (
          <>
            <img src={toolbarSrc} alt="" className="thesis-desktop-toolbar" role="presentation" />
            {mediaNode}
          </>
        )}
        <div className="thesis-iphone-video-bottom">
          {subtitle && <figcaption className="thesis-iphone-video-subtitle">{subtitle}</figcaption>}
        </div>
      </figure>
    </div>
  );
}
