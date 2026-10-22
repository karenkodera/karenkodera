import { useRef } from 'react';
import { STICKERS } from './StickerNote';
import './ImageCursorTrail.css';

const DEFAULT_ITEMS = STICKERS.map((s) => s.src);

/**
 * Skiper18 / BeFreaky–style image cursor trail.
 * Pre-pools images and activates the next one when the pointer
 * travels farther than `window.innerWidth / distance`.
 */
const ImageCursorTrail = ({
  items = DEFAULT_ITEMS,
  maxNumberOfImages = 8,
  distance = 20,
  fadeAnimation = false,
  className = '',
  children,
}) => {
  const containerRef = useRef(null);
  const imgRefs = useRef([]);
  const stateRef = useRef({
    globalIndex: 0,
    last: { x: 0, y: 0 },
    z: 1,
    fadeTimers: new Map(),
  });

  const deactivate = (image) => {
    if (!image) return;
    image.dataset.status = 'inactive';
    const timers = stateRef.current.fadeTimers;
    const existing = timers.get(image);
    if (existing) {
      window.clearTimeout(existing);
      timers.delete(image);
    }
  };

  const activate = (image, x, y) => {
    const container = containerRef.current;
    if (!container || !image) return;
    const rect = container.getBoundingClientRect();
    const state = stateRef.current;

    image.style.left = `${x - rect.left}px`;
    image.style.top = `${y - rect.top}px`;
    if (state.z > 40) state.z = 1;
    image.style.zIndex = String(state.z);
    state.z += 1;
    image.style.setProperty('--trail-rot', `${(Math.random() - 0.5) * 30}deg`);
    image.dataset.status = 'active';

    const timers = state.fadeTimers;
    const existing = timers.get(image);
    if (existing) window.clearTimeout(existing);
    if (fadeAnimation) {
      timers.set(
        image,
        window.setTimeout(() => {
          image.dataset.status = 'inactive';
          timers.delete(image);
        }, 1500)
      );
    }

    state.last = { x, y };
  };

  const handleOnMove = (point) => {
    if (!point) return;
    const { clientX: x, clientY: y } = point;
    const state = stateRef.current;
    const threshold = window.innerWidth / distance;
    if (Math.hypot(x - state.last.x, y - state.last.y) <= threshold) return;

    const pool = imgRefs.current;
    const len = pool.length;
    if (!len) return;

    const lead = pool[state.globalIndex % len];
    const tailIndex = state.globalIndex - maxNumberOfImages;
    if (tailIndex >= 0) deactivate(pool[tailIndex % len]);
    activate(lead, x, y);
    state.globalIndex += 1;
  };

  return (
    <div
      ref={containerRef}
      className={`image-cursor-trail ${className}`.trim()}
      onMouseMove={(e) => handleOnMove(e)}
      onTouchMove={(e) => handleOnMove(e.touches[0])}
    >
      {items.map((src, index) => (
        <img
          key={`${src}-${index}`}
          ref={(el) => {
            imgRefs.current[index] = el;
          }}
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          data-status="inactive"
          className="image-cursor-trail-img"
        />
      ))}
      <div className="image-cursor-trail-content">{children}</div>
    </div>
  );
};

export default ImageCursorTrail;
