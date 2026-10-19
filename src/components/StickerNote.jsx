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
  { id: 'japan', label: 'Japan flag', Icon: StickerJapan },
  { id: 'sushi', label: 'Salmon nigiri', Icon: StickerSushi },
  { id: 'needle', label: 'Sewing needle and thread', Icon: StickerNeedle },
  { id: 'cat', label: 'Cat', Icon: StickerCat },
  { id: 'climber', label: 'Climber', Icon: StickerClimber },
  { id: 'liberty', label: 'Statue of Liberty', Icon: StickerLiberty },
  { id: 'mountain', label: 'Mountain', Icon: StickerMountain },
  { id: 'note', label: 'Music note', Icon: StickerMusicNote },
];

function StickerFace({ Icon, label }) {
  return (
    <span className="sticker-face">
      <Icon label={label} />
    </span>
  );
}

const StickerNote = ({ setCursorVariant }) => {
  const noteId = useId();
  const rootRef = useRef(null);
  const [placed, setPlaced] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [peelingId, setPeelingId] = useState(null);
  const dragRef = useRef(null);

  const resetStickers = () => {
    setPlaced([]);
    setDragging(null);
    setPeelingId(null);
  };

  const toLocalPoint = (clientX, clientY) => {
    const root = rootRef.current;
    if (!root) return { x: clientX, y: clientY };
    const rect = root.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
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
      const local = toLocalPoint(e.clientX, e.clientY);
      const rotate = -12 + Math.random() * 24;
      const scale = 0.95 + Math.random() * 0.2;
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
              <StickerFace Icon={sticker.Icon} label={sticker.label} />
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
          <StickerFace Icon={dragSticker.Icon} label={dragSticker.label} />
        </div>
      )}

      <aside className="sticker-note" aria-label="Sticker pad" aria-labelledby={noteId}>
        <p className="sticker-note-title" id={noteId}>
          peel to decorate
        </p>
        <div className="sticker-note-grid" role="group" aria-label="Choose a sticker">
          {STICKERS.map((sticker) => {
            const { id, label, Icon } = sticker;
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
                  <StickerFace Icon={Icon} label={label} />
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
    </div>
  );
};

export default StickerNote;
