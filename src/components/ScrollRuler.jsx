import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  SECTION_PATHS,
  sectionDirection,
  sectionTensionRef,
  navigateSection,
} from '../hooks/useSectionPager';
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

/**
 * Landing scroll fills most of the ruler; play sits at the bottom.
 * Wheel tension toward play nudges the mark at the end of the landing page.
 */
function readProgress(pathname) {
  const tension = sectionTensionRef.current;

  if (pathname === '/play') {
    return Math.max(0, Math.min(1, 1 + tension * 0.08));
  }

  if (pathname === '/') {
    const t = homeScrollT();
    return Math.max(0, Math.min(1, t * 0.92 + Math.max(0, tension) * 0.08));
  }

  return 0;
}

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
    let pollRaf = 0;

    const sync = () => {
      if (cancelled) return;
      setProgress(readProgress(location.pathname));
    };

    const poll = () => {
      if (cancelled) return;
      sync();
      pollRaf = requestAnimationFrame(poll);
    };

    const attachHome = () => {
      if (cancelled || location.pathname !== '/') return;
      scroller = homeScroller();
      if (!scroller) {
        raf = requestAnimationFrame(attachHome);
        return;
      }
      scroller.addEventListener('scroll', sync, { passive: true });
    };

    sync();
    attachHome();
    pollRaf = requestAnimationFrame(poll);
    window.addEventListener('resize', sync);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pollRaf);
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

    if (next >= 0.92) {
      if (location.pathname !== '/play') {
        const dir = sectionDirection(location.pathname, '/play');
        navigateSection(navigate, '/play', dir);
      }
      return;
    }

    if (location.pathname !== '/') {
      const dir = sectionDirection(location.pathname, '/');
      navigateSection(navigate, '/', dir);
    }

    const scroller = homeScroller();
    if (scroller) {
      const local = Math.max(0, Math.min(1, next / 0.92));
      const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTop = local * maxScroll;
    }
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
