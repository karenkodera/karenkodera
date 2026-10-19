import { useEffect, useId, useRef, useState } from 'react';
import {
  StickerJapan,
  StickerSushi,
  StickerSewing,
  StickerMiffy,
  StickerBoulder,
  StickerLiberty,
  StickerCarrot,
  StickerPiano,
} from './pixelStickers';
import './StickerNote.css';

const STICKERS = [
  { id: 'japan', label: 'Japan flag', Icon: StickerJapan, outline: 0 },
  { id: 'sushi', label: 'Salmon nigiri', Icon: StickerSushi, outline: 1 },
  { id: 'sewing', label: 'Sewing machine', Icon: StickerSewing, outline: 2 },
  { id: 'miffy', label: "Miffy's face", Icon: StickerMiffy, outline: 0 },
  { id: 'boulder', label: 'Bouldering hold', Icon: StickerBoulder, outline: 1 },
  { id: 'liberty', label: 'Statue of Liberty', Icon: StickerLiberty, outline: 2 },
  { id: 'carrot', label: 'Carrot', Icon: StickerCarrot, outline: 0 },
  { id: 'piano', label: 'Piano', Icon: StickerPiano, outline: 1 },
];

/** Loose die-cut outlines (viewBox 0 0 40 40) */
const OUTLINES = [
  'M8 6 C14 2 26 2 32 7 C37 12 38 20 34 28 C30 36 18 38 10 34 C3 29 2 16 8 6 Z',
  'M10 5 C18 1 30 3 35 11 C39 18 36 30 28 35 C18 39 6 34 4 22 C2 12 5 7 10 5 Z',
  'M7 10 C12 3 28 2 34 10 C39 17 37 29 29 34 C19 39 5 33 5 20 C5 14 5 12 7 10 Z',
];

function DieCutBacking({ outline = 0 }) {
  const d = OUTLINES[outline] || OUTLINES[0];
  return (
    <svg className="sticker-diecut" viewBox="0 0 40 40" aria-hidden="true">
      <path d={d} className="sticker-diecut-fill" />
      <path d={d} className="sticker-diecut-stroke" />
    </svg>
  );
}

function StickerFace({ Icon, outline, label }) {
  return (
    <span className="sticker-face">
      <DieCutBacking outline={outline} />
      <span className="sticker-face-art">
        <Icon label={label} />
      </span>
    </span>
  );
}

const StickerNote = ({ setCursorVariant, visible = true }) => {
  const noteId = useId();
  const [placed, setPlaced] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [peelingId, setPeelingId] = useState(null);
  const dragRef = useRef(null);

  const resetStickers = () => {
    setPlaced([]);
    setDragging(null);
    setPeelingId(null);
  };

  useEffect(() => {
    if (!dragging) return undefined;

    const onMove = (e) => {
      setDragging((prev) =>
        prev
          ? {
              ...prev,
              x: e.clientX,
              y: e.clientY,
              peeled: true,
            }
          : prev
      );
    };

    const onUp = (e) => {
      const current = dragRef.current;
      if (!current) {
        setDragging(null);
        setPeelingId(null);
        return;
      }
      const rotate = -12 + Math.random() * 24;
      const scale = 0.95 + Math.random() * 0.2;
      setPlaced((prev) => [
        ...prev,
        {
          key: `${current.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          id: current.id,
          x: e.clientX,
          y: e.clientY,
          rotate,
          scale,
        },
      ]);
      setDragging(null);
      setPeelingId(null);
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
    setPeelingId(sticker.id);
    setCursorVariant?.('hover');

    const start = {
      id: sticker.id,
      x: event.clientX,
      y: event.clientY,
      peeled: false,
    };
    setDragging(start);

    // After peel wind-up, mark fully peeled for drag shadow
    window.setTimeout(() => {
      setDragging((prev) => (prev && prev.id === sticker.id ? { ...prev, peeled: true } : prev));
    }, 180);
  };

  const dragSticker = dragging ? STICKERS.find((s) => s.id === dragging.id) : null;

  return (
    <>
      <div
        className={`sticker-layer${visible ? '' : ' sticker-layer--hidden'}`}
        aria-hidden={!visible}
      >
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
              <StickerFace
                Icon={sticker.Icon}
                outline={sticker.outline}
                label={sticker.label}
              />
            </div>
          );
        })}
      </div>

      {dragSticker && dragging && (
        <div
          className={`sticker-drag${dragging.peeled ? ' sticker-drag--peeled' : ' sticker-drag--peeling'}`}
          style={{
            left: dragging.x,
            top: dragging.y,
          }}
          aria-hidden
        >
          <StickerFace
            Icon={dragSticker.Icon}
            outline={dragSticker.outline}
            label={dragSticker.label}
          />
        </div>
      )}

      <aside
        className={`sticker-note${visible ? '' : ' sticker-note--hidden'}`}
        aria-label="Sticker pad"
        aria-labelledby={noteId}
      >
        <p className="sticker-note-title" id={noteId}>
          peel to decorate
        </p>
        <div className="sticker-note-grid" role="group" aria-label="Choose a sticker">
          {STICKERS.map((sticker) => {
            const { id, label, Icon, outline } = sticker;
            const isPeeling = peelingId === id && dragging;
            return (
              <button
                key={id}
                type="button"
                className={`sticker-note-cell${isPeeling ? ' sticker-note-cell--lifting' : ''}`}
                aria-label={`Peel and place ${label}`}
                onPointerDown={(e) => startPeelDrag(sticker, e)}
                onMouseEnter={() => setCursorVariant?.('hover')}
                onMouseLeave={() => {
                  if (!dragging) setCursorVariant?.('default');
                }}
              >
                <span className="sticker-pad-glue" aria-hidden />
                <span className={`sticker-peel${isPeeling ? ' sticker-peel--off' : ''}`}>
                  <StickerFace Icon={Icon} outline={outline} label={label} />
                </span>
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
    </>
  );
};

export default StickerNote;
