import { useEffect, useRef, useState } from 'react';
import './ScrollRuler.css';

const TICK_COUNT = 56;
const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => ({
  key: i,
  major: i % 5 === 0,
}));

/**
 * Bottom-center ruler pill: ticks slide with scroll.
 * At the start/end of the page, ticks run out past the center mark
 * so the empty side makes the boundary obvious.
 */
const ScrollRuler = ({ scrollerRef, setCursorVariant }) => {
  const [trackX, setTrackX] = useState(0);
  const pillRef = useRef(null);
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const sync = () => {
      const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const progress = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0;
      const pill = pillRef.current;
      const track = trackRef.current;
      if (!pill || !track) return;

      const half = pill.clientWidth / 2;
      const strip = track.scrollWidth;
      // p=0 → first tick under center (empty to the left)
      // p=1 → last tick under center (empty to the right)
      setTrackX(half - progress * strip);
    };

    sync();
    scroller.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      scroller.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [scrollerRef]);

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
    setCursorVariant?.('ruler');
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const scroller = scrollerRef.current;
    const pill = pillRef.current;
    const track = trackRef.current;
    if (!scroller || !pill || !track) return;

    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const travel = Math.max(1, track.scrollWidth);
    const next = scroller.scrollLeft - dx * (maxScroll / travel);
    scroller.scrollLeft = Math.max(0, Math.min(maxScroll, next));
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
      ref={pillRef}
      className="home-scroll-ruler"
      role="scrollbar"
      aria-orientation="horizontal"
      aria-label="Scroll ruler"
      aria-controls="home-scroller"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => setCursorVariant?.('ruler')}
      onMouseLeave={() => {
        if (!draggingRef.current) setCursorVariant?.('default');
      }}
    >
      <div
        ref={trackRef}
        className="home-scroll-ruler-track"
        style={{ transform: `translate3d(${trackX}px, 0, 0)` }}
        aria-hidden
      >
        {TICKS.map((tick) => (
          <span
            key={tick.key}
            className={`home-scroll-ruler-tick${tick.major ? ' home-scroll-ruler-tick--major' : ''}`}
          />
        ))}
      </div>
      <span className="home-scroll-ruler-mark" aria-hidden />
    </div>
  );
};

export default ScrollRuler;
