import { useEffect, useId, useRef, useState } from 'react';
import {
  StickerJapan,
  StickerSushi,
  StickerNeedle,
  StickerCat,
  StickerClimber,
  StickerLiberty,
  StickerMountain,
  StickerNote as StickerMusicNote,
} from './pixelStickers';
import './StickerNote.css';

const STICKERS = [
  { id: 'japan', label: 'Japan flag', Icon: StickerJapan, outline: 0 },
  { id: 'sushi', label: 'Salmon nigiri', Icon: StickerSushi, outline: 1 },
  { id: 'needle', label: 'Sewing needle and thread', Icon: StickerNeedle, outline: 2 },
  { id: 'cat', label: 'Cat', Icon: StickerCat, outline: 0 },
  { id: 'climber', label: 'Climber', Icon: StickerClimber, outline: 1 },
  { id: 'liberty', label: 'Statue of Liberty', Icon: StickerLiberty, outline: 2 },
  { id: 'mountain', label: 'Mountain', Icon: StickerMountain, outline: 0 },
  { id: 'note', label: 'Music note', Icon: StickerMusicNote, outline: 1 },
];

/** Tighter die-cut outlines hugging the sticker (viewBox 0 0 40 40) */
const OUTLINES = [
  'M11 7 C15 5 25 5 29 8 C33 11 34 17 32 23 C30 29 24 33 18 33 C12 33 7 28 7 21 C7 14 8 9 11 7 Z',
  'M12 8 C17 5 27 6 31 11 C34 15 33 24 28 29 C22 33 13 32 9 26 C6 21 7 12 12 8 Z',
  'M10 9 C14 5 26 5 30 10 C34 15 33 25 27 30 C20 34 10 31 8 23 C7 16 8 11 10 9 Z',
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

    setDragging({
      id: sticker.id,
      x: event.clientX,
      y: event.clientY,
      peeled: false,
    });

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
                  <span className="sticker-peel-flap" aria-hidden />
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
