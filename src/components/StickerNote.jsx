import { useEffect, useId, useRef, useState } from 'react';
import './StickerNote.css';

const STICKERS = [
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
  regular: `/stickers/regular/${s.id}.png`,
  slight: `/stickers/slight-peel/${s.id}.png`,
  peeled: `/stickers/peeled/${s.id}.png`,
}));

function StickerFrames({ sticker, phase }) {
  return (
    <span className={`sticker-frames sticker-frames--${phase}`}>
      <img
        className="sticker-frame sticker-frame--regular"
        src={sticker.regular}
        alt=""
        draggable={false}
      />
      <img
        className="sticker-frame sticker-frame--slight"
        src={sticker.slight}
        alt=""
        draggable={false}
      />
      <img
        className="sticker-frame sticker-frame--peeled"
        src={sticker.peeled}
        alt=""
        draggable={false}
      />
      {/* Synthetic mid frames via blended layers */}
      <img
        className="sticker-frame sticker-frame--mid-a"
        src={sticker.slight}
        alt=""
        draggable={false}
      />
      <img
        className="sticker-frame sticker-frame--mid-b"
        src={sticker.peeled}
        alt=""
        draggable={false}
      />
    </span>
  );
}

const StickerNote = ({ setCursorVariant }) => {
  const noteId = useId();
  const rootRef = useRef(null);
  const dragRef = useRef(null);
  const peelTimerRef = useRef(null);

  const [placed, setPlaced] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [padPhase, setPadPhase] = useState({}); // id -> flat | hover | peel-1 | peel-2 | peel-3 | gone

  const resetStickers = () => {
    if (peelTimerRef.current) {
      peelTimerRef.current.forEach(clearTimeout);
      peelTimerRef.current = null;
    }
    setPlaced([]);
    setDragging(null);
    setPadPhase({});
  };

  const setPhase = (id, phase) => {
    setPadPhase((prev) => ({ ...prev, [id]: phase }));
  };

  const toLocalPoint = (clientX, clientY) => {
    const root = rootRef.current;
    if (!root) return { x: clientX, y: clientY };
    const rect = root.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  useEffect(() => {
    // Preload all frames so peel animation never flashes empty
    STICKERS.forEach((s) => {
      [s.regular, s.slight, s.peeled].forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  useEffect(() => {
    if (!dragging) return undefined;

    const onMove = (e) => {
      setDragging((prev) =>
        prev
          ? {
              ...prev,
              x: e.clientX,
              y: e.clientY,
            }
          : prev
      );
    };

    const onUp = (e) => {
      const current = dragRef.current;
      if (!current) {
        setDragging(null);
        return;
      }
      // Only place once peel finished and we're in drag-regular mode
      if (!current.ready) {
        setDragging(null);
        setPhase(current.id, 'flat');
        setCursorVariant?.('default');
        return;
      }
      const local = toLocalPoint(e.clientX, e.clientY);
      const rotate = -10 + Math.random() * 20;
      const scale = 0.95 + Math.random() * 0.18;
      setPlaced((prev) => [
        ...prev,
        {
          key: `${current.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          id: current.id,
          x: local.x,
          y: local.y,
          rotate,
          scale,
        },
      ]);
      setPhase(current.id, 'flat');
      setDragging(null);
      setCursorVariant?.('default');
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragging, setCursorVariant]);

  useEffect(() => {
    dragRef.current = dragging;
  }, [dragging]);

  const startPeelDrag = (sticker, event) => {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setCursorVariant?.('hover');

    if (peelTimerRef.current) {
      peelTimerRef.current.forEach(clearTimeout);
    }

    // Begin drag shell immediately so cursor tracking feels live,
    // but keep showing peel frames until sequence completes.
    setDragging({
      id: sticker.id,
      x: event.clientX,
      y: event.clientY,
      ready: false,
      frame: 'slight',
    });

    setPhase(sticker.id, 'peel-1');

    const t1 = window.setTimeout(() => {
      setPhase(sticker.id, 'peel-2');
      setDragging((prev) =>
        prev && prev.id === sticker.id ? { ...prev, frame: 'mid' } : prev
      );
    }, 90);

    const t2 = window.setTimeout(() => {
      setPhase(sticker.id, 'peel-3');
      setDragging((prev) =>
        prev && prev.id === sticker.id ? { ...prev, frame: 'peeled' } : prev
      );
    }, 200);

    const t3 = window.setTimeout(() => {
      // Peel complete → switch to regular for free dragging/placement
      setPhase(sticker.id, 'gone');
      setDragging((prev) =>
        prev && prev.id === sticker.id
          ? { ...prev, ready: true, frame: 'regular' }
          : prev
      );
    }, 360);

    peelTimerRef.current = [t1, t2, t3];
  };

  const dragSticker = dragging ? STICKERS.find((s) => s.id === dragging.id) : null;

  return (
    <div className="sticker-note-root" ref={rootRef}>
      <div className="sticker-layer" aria-hidden>
        {placed.map((item) => {
          const sticker = STICKERS.find((s) => s.id === item.id);
          if (!sticker) return null;
          return (
            <div
              key={item.key}
              className="sticker-placed"
              style={{
                left: item.x,
                top: item.y,
                transform: `translate(-50%, -50%) rotate(${item.rotate}deg) scale(${item.scale})`,
              }}
            >
              <img src={sticker.regular} alt="" draggable={false} />
            </div>
          );
        })}
      </div>

      {dragSticker && dragging && (
        <div
          className={`sticker-drag sticker-drag--${dragging.frame}${
            dragging.ready ? ' sticker-drag--ready' : ''
          }`}
          style={{ left: dragging.x, top: dragging.y }}
          aria-hidden
        >
          <StickerFrames
            sticker={dragSticker}
            phase={
              dragging.frame === 'regular'
                ? 'flat'
                : dragging.frame === 'slight'
                  ? 'peel-1'
                  : dragging.frame === 'mid'
                    ? 'peel-2'
                    : 'peel-3'
            }
          />
        </div>
      )}

      <aside className="sticker-note" aria-label="Sticker pad" aria-labelledby={noteId}>
        <p className="sticker-note-title" id={noteId}>
          peel to decorate
        </p>
        <div className="sticker-note-grid" role="group" aria-label="Choose a sticker">
          {STICKERS.map((sticker) => {
            const phase = padPhase[sticker.id] || 'flat';
            const isBusy = phase.startsWith('peel') || phase === 'gone';
            return (
              <button
                key={sticker.id}
                type="button"
                className={`sticker-note-cell sticker-note-cell--${phase}`}
                aria-label={`Peel and place ${sticker.label}`}
                onPointerDown={(e) => startPeelDrag(sticker, e)}
                onMouseEnter={() => {
                  if (!isBusy && !dragging) {
                    setPhase(sticker.id, 'hover');
                    setCursorVariant?.('hover');
                  }
                }}
                onMouseLeave={() => {
                  if (!isBusy && !dragging) {
                    setPhase(sticker.id, 'flat');
                    setCursorVariant?.('default');
                  }
                }}
              >
                <span className="sticker-pad-glue" aria-hidden />
                {/* While peeling/dragging, frames live on the cursor ghost so the pad isn't doubled */}
                {!isBusy && (
                  <StickerFrames sticker={sticker} phase={phase} />
                )}
              </button>
            );
          })}
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
