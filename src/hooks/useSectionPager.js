import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const SECTION_PATHS = ['/', '/about', '/play'];

/** Shared with App page transition — set before navigate so exit/enter match. */
export const pageDirRef = { current: 1 };

const THRESHOLD = 90;
const LOCK_MS = 580;
const DECAY = 0.86;

function isBlocked() {
  if (document.documentElement.getAttribute('data-intro') === '1') return true;
  if (document.querySelector('.play-modal-overlay')) return true;
  if (document.querySelector('.password-gate')) return true;
  return false;
}

export function sectionIndex(pathname) {
  return SECTION_PATHS.indexOf(pathname);
}

/** Shortest wrap direction: 1 = forward (down), -1 = back (up). */
export function sectionDirection(fromPath, toPath) {
  const from = sectionIndex(fromPath);
  const to = sectionIndex(toPath);
  if (from < 0 || to < 0 || from === to) return 1;
  const n = SECTION_PATHS.length;
  const forward = (to - from + n) % n;
  const backward = (from - to + n) % n;
  return forward <= backward ? 1 : -1;
}

export function navigateSection(navigate, path, dir) {
  pageDirRef.current = dir;
  navigate(path, { state: { pageDir: dir } });
}

/**
 * Discrete vertical section paging: work → about → play → work.
 * Accumulates wheel/touch delta with rubber-band tension, then navigates
 * once the threshold is crossed (same route transition as the pill tabs).
 */
export function useSectionPager() {
  const navigate = useNavigate();
  const location = useLocation();
  const accumRef = useRef(0);
  const lockUntilRef = useRef(0);
  const touchStartRef = useRef(null);
  const decayRafRef = useRef(0);

  useEffect(() => {
    const index = sectionIndex(location.pathname);
    if (index < 0) return undefined;

    accumRef.current = 0;

    const lock = () => {
      lockUntilRef.current = performance.now() + LOCK_MS;
    };

    const isLocked = () => performance.now() < lockUntilRef.current;

    const go = (dir) => {
      if (isLocked() || isBlocked()) return;
      const n = SECTION_PATHS.length;
      const next = (index + dir + n) % n;
      lock();
      accumRef.current = 0;
      navigateSection(navigate, SECTION_PATHS[next], dir);
    };

    const applyDelta = (rawDelta) => {
      if (!rawDelta || isLocked() || isBlocked()) return;

      accumRef.current += rawDelta;

      if (accumRef.current >= THRESHOLD) go(1);
      else if (accumRef.current <= -THRESHOLD) go(-1);
    };

    const startDecay = () => {
      if (decayRafRef.current) return;
      const tick = () => {
        decayRafRef.current = 0;
        if (isLocked() || Math.abs(accumRef.current) < 1) {
          accumRef.current = 0;
          return;
        }
        accumRef.current *= DECAY;
        if (Math.abs(accumRef.current) >= 1) {
          decayRafRef.current = requestAnimationFrame(tick);
        } else {
          accumRef.current = 0;
        }
      };
      decayRafRef.current = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      if (isBlocked()) return;

      let dx = e.deltaX;
      let dy = e.deltaY;
      if (e.deltaMode === 1) {
        dx *= 16;
        dy *= 16;
      } else if (e.deltaMode === 2) {
        dx *= window.innerWidth;
        dy *= window.innerHeight;
      }

      if (Math.abs(dx) > Math.abs(dy)) return;
      if (Math.abs(dy) < 1) return;

      e.preventDefault();
      applyDelta(dy);
      startDecay();
    };

    const onKeyDown = (e) => {
      if (isBlocked() || isLocked()) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        go(-1);
      }
    };

    const onTouchStart = (e) => {
      if (isBlocked() || e.touches.length !== 1) return;
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
    };

    const onTouchEnd = (e) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start || isBlocked() || isLocked()) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dy) < 56 || Math.abs(dy) < Math.abs(dx) * 1.15) return;
      go(dy > 0 ? -1 : 1);
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      if (decayRafRef.current) cancelAnimationFrame(decayRafRef.current);
    };
  }, [location.pathname, navigate]);
}
