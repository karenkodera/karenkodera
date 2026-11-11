import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { SECTION_PATHS } from '../hooks/useSectionPager';
import './ScrollRuler.css';

function homeScroller() {
  return document.getElementById('home-scroller');
}

function homeScrollT() {
  const scroller = homeScroller();
  if (!scroller) return 0;
  const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  return maxScroll > 0 ? scroller.scrollTop / maxScroll : 0;
}

function readProgress(pathname) {
  if (pathname === '/play') return 1;
  if (pathname === '/') return homeScrollT();
  return 0;
}

/** Side progress bar — stays on the current page (work and play are separate). */
const ScrollRuler = ({ setCursorVariant }) => {
  const location = useLocation();
  const [progress, setProgress] = useState(() => readProgress(location.pathname));
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const visible = SECTION_PATHS.includes(location.pathname);

  useLayoutEffect(() => {
    if (!visible) return undefined;

    let cancelled = false;
    let scroller = null;
    let raf = 0;

    const sync = () => {
      if (cancelled) return;
      setProgress(readProgress(location.pathname));
    };

    const attachHome = () => {
      if (cancelled || location.pathname !== '/') return;
      scroller = homeScroller();
      if (!scroller) {
        raf = requestAnimationFrame(attachHome);
        return;
      }
      sync();
      scroller.addEventListener('scroll', sync, { passive: true });
    };

    sync();
    attachHome();
    window.addEventListener('resize', sync);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (scroller) scroller.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [location.pathname, visible]);

  const seekToClientY = (clientY) => {
    if (location.pathname !== '/') return;

    const track = trackRef.current;
    const scroller = homeScroller();
    if (!track || !scroller) return;

    const rect = track.getBoundingClientRect();
    const height = Math.max(1, rect.height);
    const next = Math.max(0, Math.min(1, (clientY - rect.top) / height));
    const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    scroller.scrollTop = next * maxScroll;
    setProgress(next);
  };

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    if (location.pathname !== '/') return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekToClientY(e.clientY);
    setCursorVariant?.('ruler');
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    seekToClientY(e.clientY);
  };

  const onPointerUp = (e) => {
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {
      /* already released */
    }
  };

  if (typeof document === 'undefined' || !visible) return null;

  return createPortal(
    <div
      className="home-scroll-ruler"
      role="scrollbar"
      aria-orientation="vertical"
      aria-label="Scroll ruler"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => setCursorVariant?.('ruler')}
      onMouseLeave={() => {
        if (!draggingRef.current) setCursorVariant?.('default');
      }}
    >
      <div ref={trackRef} className="home-scroll-ruler-track" aria-hidden>
        <span
          className="home-scroll-ruler-mark"
          style={{ top: `${progress * 100}%` }}
        />
      </div>
    </div>,
    document.body
  );
};

export default ScrollRuler;
