import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  SECTION_PATHS,
  sectionDirection,
  sectionIndex,
  sectionTensionRef,
  navigateSection,
} from '../hooks/useSectionPager';
import './ScrollRuler.css';

function workScroller() {
  return document.getElementById('home-scroller');
}

function workScrollT() {
  const scroller = workScroller();
  if (!scroller) return 0;
  const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  return maxScroll > 0 ? scroller.scrollTop / maxScroll : 0;
}

/**
 * About → work → play as one vertical journey on the ruler.
 * Wheel tension on about/play nudges the mark before the page flips.
 */
function readProgress(pathname) {
  const i = sectionIndex(pathname);
  if (i < 0) return 0;
  const n = SECTION_PATHS.length - 1;
  const step = 1 / n;
  const tension = sectionTensionRef.current;

  if (pathname === '/work') {
    const t = workScrollT();
    return Math.max(0, Math.min(1, (i + t) / n + tension * step * 0.45));
  }

  return Math.max(0, Math.min(1, i / n + tension * step));
}

/**
 * Side progress bar for section pages.
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

    const attachWork = () => {
      if (cancelled || location.pathname !== '/work') return;
      scroller = workScroller();
      if (!scroller) {
        raf = requestAnimationFrame(attachWork);
        return;
      }
      scroller.addEventListener('scroll', sync, { passive: true });
    };

    sync();
    attachWork();
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

    const n = SECTION_PATHS.length - 1;
    const rawIndex = next * n;
    const targetIndex = Math.round(rawIndex);
    const targetPath = SECTION_PATHS[targetIndex];

    if (targetPath === '/work') {
      if (location.pathname !== '/work') {
        const dir = sectionDirection(location.pathname, '/work');
        navigateSection(navigate, '/work', dir);
      }
      const scroller = workScroller();
      if (scroller) {
        const local = Math.max(0, Math.min(1, rawIndex - 1));
        const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
        scroller.scrollTop = local * maxScroll;
      }
      return;
    }

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
