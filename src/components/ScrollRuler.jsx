import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  SECTION_PATHS,
  sectionDirection,
  navigateSection,
} from '../hooks/useSectionPager';
import './ScrollRuler.css';

function workScroller() {
  return document.getElementById('home-scroller');
}

function readProgress(pathname) {
  if (pathname === '/') return 0;
  if (pathname === '/play') return 1;
  if (pathname === '/work') {
    const scroller = workScroller();
    if (!scroller) return 0;
    const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    return maxScroll > 0 ? scroller.scrollTop / maxScroll : 0;
  }
  return 0;
}

/**
 * Side progress bar for section pages.
 * About / play show section position; work tracks the project scroller.
 */
const ScrollRuler = ({ setCursorVariant }) => {
  const location = useLocation();
  const navigate = useNavigate();
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

    const attachWork = () => {
      if (cancelled || location.pathname !== '/work') return;
      scroller = workScroller();
      if (!scroller) {
        raf = requestAnimationFrame(attachWork);
        return;
      }
      sync();
      scroller.addEventListener('scroll', sync, { passive: true });
    };

    sync();
    attachWork();
    window.addEventListener('resize', sync);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (scroller) scroller.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [location.pathname, visible]);

  const seekToClientY = (clientY) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const height = Math.max(1, rect.height);
    const next = Math.max(0, Math.min(1, (clientY - rect.top) / height));
    setProgress(next);

    if (location.pathname === '/work') {
      const scroller = workScroller();
      if (scroller) {
        const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
        scroller.scrollTop = next * maxScroll;
      }
      return;
    }

    const targetIndex = Math.round(next * (SECTION_PATHS.length - 1));
    const targetPath = SECTION_PATHS[targetIndex];
    if (!targetPath || targetPath === location.pathname) return;
    const dir = sectionDirection(location.pathname, targetPath);
    navigateSection(navigate, targetPath, dir);
  };

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
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
