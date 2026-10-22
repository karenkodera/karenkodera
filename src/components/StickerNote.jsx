import { useEffect, useRef, useState } from 'react';
import {
  HOVER_PEEL,
  PRESS_PEEL,
  RELEASE_AT,
  analyzeSticker,
  maxPeelLength,
  paintPeel,
  peelDirection,
  pickCorner,
} from '../utils/stickerPeel';
import { playPeelSnap, startPeelRustle } from '../utils/peelSound';
import './StickerNote.css';

const NOTE_TILT = (2.5 * Math.PI) / 180;

export const STICKERS = [
  { id: 'japan', label: 'Japan flag' },
  { id: 'sushi', label: 'Salmon nigiri' },
  { id: 'sewing', label: 'Sewing machine' },
  { id: 'cat', label: 'Ginger tabby' },
  { id: 'climber', label: 'Rock climber' },
  { id: 'liberty', label: 'Statue of Liberty' },
  { id: 'mountain', label: 'Mount Fuji' },
  { id: 'note', label: 'Music note' },
].map((s) => ({
  ...s,
  src: `/stickers/regular/${s.id}.png`,
}));

function clientToLocal(el, clientX, clientY) {
  const rect = el.getBoundingClientRect();
  const dx = clientX - (rect.left + rect.width / 2);
  const dy = clientY - (rect.top + rect.height / 2);
  const c = Math.cos(-NOTE_TILT);
  const s = Math.sin(-NOTE_TILT);
  return [
    el.offsetWidth / 2 + dx * c - dy * s,
    el.offsetHeight / 2 + dx * s + dy * c,
  ];
}

function screenDeltaToLocal(dx, dy) {
  const c = Math.cos(-NOTE_TILT);
  const s = Math.sin(-NOTE_TILT);
  return [dx * c - dy * s, dx * s + dy * c];
}

function easeOut(t) {
  return 1 - (1 - t) ** 3;
}

// Survives a remount so grabbing the next sticker cannot wipe the ones already down.
let rememberedStickers = [];

function PadSticker({ sticker, setCursorVariant, sessionRef, onFreeMove, onFreeEnd }) {
  const peelRef = useRef(null);
  const frontRef = useRef(null);
  const flapRef = useRef(null);
  const shadeRef = useRef(null);
  const backWrapRef = useRef(null);
  const creaseRef = useRef(null);
  const modelRef = useRef({
    bb: [0, 0, 1, 1],
    coverage: [1, 1, 1, 1],
    corner: [1, 1],
    dir: [-Math.SQRT1_2, -Math.SQRT1_2],
    amount: 0,
    raf: 0,
  });

  useEffect(() => {
    let cancelled = false;
    analyzeSticker(sticker.src).then((info) => {
      if (cancelled) return;
      modelRef.current.bb = info.bb;
      modelRef.current.coverage = info.coverage;
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(modelRef.current.raf);
    };
  }, [sticker.src]);

  const paint = (amount, dir = modelRef.current.dir) => {
    const model = modelRef.current;
    model.amount = amount;
    return paintPeel(
      {
        front: frontRef.current,
        flap: flapRef.current,
        backWrap: backWrapRef.current,
        shade: shadeRef.current,
        crease: creaseRef.current,
      },
      {
        bb: model.bb,
        corner: model.corner,
        dir,
        amount,
      }
    );
  };

  const animateAmount = (target, ms) => {
    const model = modelRef.current;
    cancelAnimationFrame(model.raf);
    const from = model.amount;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / ms);
      paint(from + (target - from) * easeOut(t));
      if (t < 1) model.raf = requestAnimationFrame(step);
    };
    model.raf = requestAnimationFrame(step);
  };

  const aimAt = (clientX, clientY) => {
    const box = peelRef.current;
    const model = modelRef.current;
    if (!box) return;
    const [x, y] = clientToLocal(box, clientX, clientY);
    model.corner = pickCorner(model.coverage, x, y, box.offsetWidth || 1);
    model.dir = peelDirection(model.corner);
  };

  const onPointerEnter = (event) => {
    if (sessionRef.current) return;
    if (event.pointerType !== 'mouse' || event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
    aimAt(event.clientX, event.clientY);
    const box = peelRef.current;
    const model = modelRef.current;
    const reach = maxPeelLength(model.bb, box?.offsetWidth || 70);
    animateAmount(HOVER_PEEL * 2 * reach, 280);
    setCursorVariant?.('hover');
  };

  const onPointerLeave = (event) => {
    if (sessionRef.current) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
    animateAmount(0, 320);
    setCursorVariant?.('default');
  };

  const onPointerDown = (event) => {
    if (sessionRef.current) return;
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    // React nulls currentTarget after the handler returns; keep our own handles.
    const target = event.currentTarget;
    const pointerId = event.pointerId;
    try {
      target.setPointerCapture?.(pointerId);
    } catch {
      /* capture is a nicety, not required */
    }
    sessionRef.current = sticker.id;
    setCursorVariant?.('hover');

    const box = peelRef.current;
    const model = modelRef.current;
    aimAt(event.clientX, event.clientY);
    cancelAnimationFrame(model.raf);

    const size = box?.offsetWidth || 70;
    const reach = maxPeelLength(model.bb, size);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rustle = startPeelRustle();
    const rot = Math.random() * 24 - 12;
    let freed = false;
    let origin = { x: event.clientX, y: event.clientY };
    let last = { x: event.clientX, y: event.clientY, t: performance.now() };
    let pending = null;
    let frame = 0;

    const release = () => {
      if (freed) return;
      freed = true;
      playPeelSnap();
      rustle.stop();
      paint(0);
      onFreeMove?.({
        id: sticker.id,
        src: sticker.src,
        x: last.x,
        y: last.y,
        rot,
        size,
      });
    };

    if (reduced) {
      release();
    } else {
      const base = PRESS_PEEL * 2 * reach;
      paint(base);
      model.dragBase = base;
    }

    const applyMove = (e) => {
      const now = performance.now();
      const dt = Math.max(8, now - last.t);
      const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt;
      last = { x: e.clientX, y: e.clientY, t: now };
      if (freed) {
        onFreeMove?.({
          id: sticker.id,
          src: sticker.src,
          x: e.clientX,
          y: e.clientY,
          rot,
          size,
        });
        return;
      }
      const [ldx, ldy] = screenDeltaToLocal(e.clientX - origin.x, e.clientY - origin.y);
      const vx = model.dir[0] * model.dragBase + ldx;
      const vy = model.dir[1] * model.dragBase + ldy;
      const amount = Math.max(0, Math.hypot(vx, vy));
      const liveDir = amount > 0.5 ? [vx / amount, vy / amount] : model.dir;
      const stuck = paint(amount, liveDir);
      rustle.set(Math.min(1, 1 - stuck), speed * 12);
      if (stuck <= RELEASE_AT) release();
    };

    const onMove = (e) => {
      pending = e;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (pending) {
          const next = pending;
          pending = null;
          applyMove(next);
        }
      });
    };

    const onUp = (e) => {
      window.removeEventListener('pointermove', onMove, true);
      window.removeEventListener('pointerup', onUp, true);
      window.removeEventListener('pointercancel', onUp, true);
      if (frame) cancelAnimationFrame(frame);
      try {
        if (pending) applyMove(pending);
      } catch {
        /* never let a last move block the drop */
      }
      rustle.stop();
      try {
        if (target.hasPointerCapture?.(pointerId)) {
          target.releasePointerCapture(pointerId);
        }
      } catch {
        /* pointer may already be gone */
      }
      sessionRef.current = null;
      if (freed) {
        onFreeEnd?.({
          id: sticker.id,
          src: sticker.src,
          x: e.clientX,
          y: e.clientY,
          rot,
          size,
        });
      } else {
        animateAmount(0, 380);
      }
      setCursorVariant?.('default');
    };

    window.addEventListener('pointermove', onMove, true);
    window.addEventListener('pointerup', onUp, true);
    window.addEventListener('pointercancel', onUp, true);
  };

  return (
    <button
      type="button"
      className="sticker-note-cell"
      aria-label={`Peel and place ${sticker.label}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
    >
      <span className="sticker-peel" ref={peelRef} aria-hidden>
        <img className="sticker-peel-residue" src={sticker.src} alt="" draggable={false} />
        <span className="sticker-peel-front" ref={frontRef}>
          <img src={sticker.src} alt="" draggable={false} />
        </span>
        <span className="sticker-peel-shade" ref={shadeRef}>
          <span className="sticker-peel-flap" ref={flapRef}>
            <span className="sticker-peel-back-wrap" ref={backWrapRef}>
              <img className="sticker-peel-back" src={sticker.src} alt="" draggable={false} />
              <span
                className="sticker-peel-crease"
                ref={creaseRef}
                style={{ '--sticker': `url(${sticker.src})` }}
              />
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

function PlacedSticker({ item, rootRef, sessionRef, setCursorVariant, onMove }) {
  const onPointerDown = (event) => {
    if (sessionRef.current) return;
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    sessionRef.current = item.key;
    setCursorVariant?.('hover');

    const startX = event.clientX;
    const startY = event.clientY;
    const root = rootRef.current;
    const rect = root?.getBoundingClientRect();
    const originX = rect ? startX - rect.left : startX;
    const originY = rect ? startY - rect.top : startY;
    const grabX = originX - item.x;
    const grabY = originY - item.y;

    const move = (e) => {
      const box = rootRef.current?.getBoundingClientRect();
      if (!box) return;
      onMove(item.key, {
        x: e.clientX - box.left - grabX,
        y: e.clientY - box.top - grabY,
      });
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      sessionRef.current = null;
      setCursorVariant?.('default');
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  return (
    <div
      className="sticker-placed"
      style={{
        left: item.x,
        top: item.y,
        width: item.size,
        height: item.size,
        transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
        filter: 'none',
        boxShadow: 'none',
        pointerEvents: item.held ? 'none' : 'auto',
        zIndex: item.held ? 5 : 1,
      }}
      onPointerDown={onPointerDown}
      onMouseEnter={() => {
        if (!sessionRef.current) setCursorVariant?.('hover');
      }}
      onMouseLeave={() => {
        if (!sessionRef.current) setCursorVariant?.('default');
      }}
    >
      <img src={item.src} alt="" draggable={false} />
    </div>
  );
}

const StickerNote = ({ setCursorVariant }) => {
  const rootRef = useRef(null);
  const noteRef = useRef(null);
  const sessionRef = useRef(null);
  const carryKeyRef = useRef(null);
  const placedRef = useRef(rememberedStickers);
  const [placed, setPlaced] = useState(rememberedStickers);

  const commitPlaced = (next) => {
    rememberedStickers = next;
    placedRef.current = next;
    setPlaced(next);
  };

  const resetStickers = () => {
    sessionRef.current = null;
    carryKeyRef.current = null;
    commitPlaced([]);
  };

  const toLocalPoint = (clientX, clientY) => {
    const root = rootRef.current;
    if (!root) return { x: clientX, y: clientY };
    const rect = root.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  return (
    <div className="sticker-note-root" ref={rootRef}>
      <div className="sticker-layer">
        {placed.map((item) => (
          <PlacedSticker
            key={item.key}
            item={item}
            rootRef={rootRef}
            sessionRef={sessionRef}
            setCursorVariant={setCursorVariant}
            onMove={(key, pos) => {
              commitPlaced(
                placedRef.current.map((sticker) =>
                  sticker.key === key ? { ...sticker, ...pos } : sticker
                )
              );
            }}
          />
        ))}
      </div>

      <aside className="sticker-note" ref={noteRef} aria-label="Sticker pad">
        <div className="sticker-note-grid" role="group" aria-label="Choose a sticker">
          {STICKERS.map((sticker) => (
            <PadSticker
              key={sticker.id}
              sticker={sticker}
              setCursorVariant={setCursorVariant}
              sessionRef={sessionRef}
              onFreeMove={(info) => {
                if (sessionRef.current !== sticker.id) return;
                const local = toLocalPoint(info.x, info.y);
                const existing = carryKeyRef.current;
                const stillHeld =
                  existing && placedRef.current.some((item) => item.key === existing && item.held);
                if (!stillHeld) {
                  const key = `${info.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
                  carryKeyRef.current = key;
                  commitPlaced([
                    ...placedRef.current,
                    {
                      key,
                      src: info.src,
                      x: local.x,
                      y: local.y,
                      rotate: info.rot,
                      size: info.size,
                      held: true,
                    },
                  ]);
                  return;
                }
                commitPlaced(
                  placedRef.current.map((item) =>
                    item.key === existing ? { ...item, x: local.x, y: local.y } : item
                  )
                );
              }}
              onFreeEnd={() => {
                carryKeyRef.current = null;
                // Settle anything still flagged as held so it sticks and becomes grabbable.
                commitPlaced(
                  placedRef.current.map((item) => (item.held ? { ...item, held: false } : item))
                );
              }}
            />
          ))}
          <button
            type="button"
            className="sticker-note-cell sticker-note-cell--reset"
            aria-label="Reset stickers"
            onClick={resetStickers}
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            <span className="sticker-note-reset-label">reset</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default StickerNote;
