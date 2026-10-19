import { useId, useState } from 'react';
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
  { id: 'japan', label: 'Japan flag', Icon: StickerJapan },
  { id: 'sushi', label: 'Salmon nigiri', Icon: StickerSushi },
  { id: 'sewing', label: 'Sewing machine', Icon: StickerSewing },
  { id: 'miffy', label: "Miffy's face", Icon: StickerMiffy },
  { id: 'boulder', label: 'Bouldering hold', Icon: StickerBoulder },
  { id: 'liberty', label: 'Statue of Liberty', Icon: StickerLiberty },
  { id: 'carrot', label: 'Carrot', Icon: StickerCarrot },
  { id: 'piano', label: 'Piano', Icon: StickerPiano },
];

function randomPlace() {
  const left = 12 + Math.random() * 55;
  const top = 18 + Math.random() * 50;
  const rotate = -18 + Math.random() * 36;
  const scale = 0.9 + Math.random() * 0.35;
  return { left, top, rotate, scale };
}

const StickerNote = ({ setCursorVariant, visible = true }) => {
  const noteId = useId();
  const [placed, setPlaced] = useState([]);

  const placeSticker = (stickerId) => {
    const sticker = STICKERS.find((s) => s.id === stickerId);
    if (!sticker) return;
    setPlaced((prev) => [
      ...prev,
      {
        key: `${stickerId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        id: stickerId,
        ...randomPlace(),
      },
    ]);
  };

  const resetStickers = () => setPlaced([]);

  return (
    <>
      <div
        className={`sticker-layer${visible ? '' : ' sticker-layer--hidden'}`}
        aria-hidden={!visible}
      >
        {placed.map((item) => {
          const sticker = STICKERS.find((s) => s.id === item.id);
          if (!sticker) return null;
          const Icon = sticker.Icon;
          return (
            <div
              key={item.key}
              className="sticker-placed"
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotate}deg) scale(${item.scale})`,
              }}
            >
              <Icon label={sticker.label} />
            </div>
          );
        })}
      </div>

      <aside
        className={`sticker-note${visible ? '' : ' sticker-note--hidden'}`}
        aria-label="Sticker pad"
        aria-labelledby={noteId}
      >
        <p className="sticker-note-title" id={noteId}>
          peel to decorate
        </p>
        <div className="sticker-note-grid" role="group" aria-label="Choose a sticker">
          {STICKERS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className="sticker-note-cell"
              aria-label={`Place ${label}`}
              onClick={() => placeSticker(id)}
              onMouseEnter={() => setCursorVariant?.('hover')}
              onMouseLeave={() => setCursorVariant?.('default')}
            >
              <span className="sticker-note-glyph">
                <Icon />
              </span>
            </button>
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
    </>
  );
};

export default StickerNote;
