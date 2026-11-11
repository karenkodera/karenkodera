import { useLayoutEffect, useRef, useState } from 'react';
import './ScrollRuler.css';

/**
 * Side progress bar for the vertical work scroller:
 * fixed tick track + cursor that moves with scroll.
 */
const ScrollRuler = ({ scrollerRef, setCursorVariant }) => {
  const [progress, setProgress] = useState(0);
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  useLayoutEffect(() => {
    let cancelled = false;
    let scroller = null;
    let raf = 0;

    const sync = () => {
      if (!scroller) return;
      const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      setProgress(maxScroll > 0 ? scroller.scrollTop / maxScroll : 0);
    };

    const attach = () => {
      if (cancelled) return;
      scroller = scrollerRef.current;
      if (!scroller) {
        raf = requestAnimationFrame(attach);
        return;
      }
      sync();
      scroller.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
    };

    attach();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (scroller) scroller.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [scrollerRef]);

  const seekToClientY = (clientY) => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    const rect = track.getBoundingClientRect();
    const height = Math.max(1, rect.height);
    const next = Math.max(0, Math.min(1, (clientY - rect.top) / height));
    const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    scroller.scrollTop = next * maxScroll;
    setProgress(next);
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

  return (
    <div
      className="home-scroll-ruler"
      role="scrollbar"
      aria-orientation="vertical"
      aria-label="Scroll ruler"
      aria-controls="home-scroller"
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
    </div>
  );
};

export default ScrollRuler;
