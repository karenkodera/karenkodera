/** Tiny pixel-art stickers (16×16) with white silhouette + light gray outline */

function PixelSvg({ children, label, className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {children}
    </svg>
  );
}

/** Expand rects into a Set of "x,y" pixels */
function coverPixels(rects) {
  const set = new Set();
  rects.forEach(([x, y, w, h]) => {
    for (let py = y; py < y + h; py += 1) {
      for (let px = x; px < x + w; px += 1) {
        if (px >= 0 && px < 16 && py >= 0 && py < 16) set.add(`${px},${py}`);
      }
    }
  });
  return set;
}

function neighbors(set) {
  const out = new Set();
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  set.forEach((key) => {
    const [x, y] = key.split(',').map(Number);
    dirs.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx > 15 || ny < 0 || ny > 15) return;
      const nkey = `${nx},${ny}`;
      if (!set.has(nkey)) out.add(nkey);
    });
  });
  return out;
}

/**
 * rects: [x, y, w, h, fill]
 * Builds gray outline → white fill (shape) → colored art
 */
function PixelSticker({ label, className = '', rects }) {
  const artRects = rects.map(([x, y, w, h]) => [x, y, w, h]);
  const filled = coverPixels(artRects);
  const outline = neighbors(filled);

  return (
    <PixelSvg label={label} className={className}>
      {[...outline].map((key) => {
        const [x, y] = key.split(',').map(Number);
        return <rect key={`o-${key}`} x={x} y={y} width={1} height={1} fill="#cfcbc3" />;
      })}
      {[...filled].map((key) => {
        const [x, y] = key.split(',').map(Number);
        return <rect key={`w-${key}`} x={x} y={y} width={1} height={1} fill="#ffffff" />;
      })}
      {rects.map(([x, y, w, h, fill], i) => (
        <rect key={`a-${i}-${x}-${y}`} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </PixelSvg>
  );
}

/** Waving Japan flag */
export function StickerJapan({ label = 'Japan flag' }) {
  return (
    <PixelSticker
      label={label}
      rects={[
        [1, 2, 1, 12, '#3a3a3a'],
        [3, 3, 11, 2, '#fff'],
        [2, 5, 12, 2, '#fff'],
        [3, 7, 11, 2, '#fff'],
        [2, 9, 12, 2, '#fff'],
        [3, 11, 10, 2, '#fff'],
        [3, 3, 11, 1, '#333'],
        [2, 13, 11, 1, '#333'],
        [13, 4, 1, 8, '#333'],
        [6, 6, 4, 4, '#bc002d'],
        [7, 5, 2, 6, '#bc002d'],
        [5, 7, 6, 2, '#bc002d'],
      ]}
    />
  );
}

/** Salmon nigiri at 45° */
export function StickerSushi({ label = 'Salmon nigiri' }) {
  return (
    <PixelSticker
      label={label}
      className="sticker-art--tilt45"
      rects={[
        [4, 8, 8, 3, '#f4efe4'],
        [5, 11, 6, 1, '#e6dfd0'],
        [3, 5, 10, 3, '#ff8a6a'],
        [4, 4, 8, 1, '#ff8a6a'],
        [3, 6, 10, 1, '#ff6b4a'],
        [5, 5, 2, 1, '#ffc4b0'],
        [9, 7, 2, 1, '#ffc4b0'],
      ]}
    />
  );
}

/** Sewing needle + thread */
export function StickerNeedle({ label = 'Sewing needle and thread' }) {
  return (
    <PixelSticker
      label={label}
      rects={[
        [9, 2, 4, 4, '#5b8def'],
        [10, 3, 2, 2, '#fff'],
        [8, 5, 1, 1, '#5b8def'],
        [7, 6, 1, 1, '#5b8def'],
        [6, 7, 1, 1, '#5b8def'],
        [5, 8, 1, 1, '#5b8def'],
        [3, 4, 2, 9, '#c0c4c8'],
        [3, 3, 2, 1, '#9aa0a6'],
        [4, 13, 1, 2, '#9aa0a6'],
        [3, 5, 2, 2, '#fff'],
        [4, 5, 1, 2, '#c0c4c8'],
      ]}
    />
  );
}

/** Cat face */
export function StickerCat({ label = 'Cat' }) {
  return (
    <PixelSticker
      label={label}
      rects={[
        [2, 2, 3, 3, '#f0b27a'],
        [11, 2, 3, 3, '#f0b27a'],
        [3, 3, 1, 1, '#e8919a'],
        [12, 3, 1, 1, '#e8919a'],
        [2, 5, 12, 9, '#f0b27a'],
        [3, 4, 10, 1, '#f0b27a'],
        [4, 8, 2, 2, '#222'],
        [10, 8, 2, 2, '#222'],
        [5, 8, 1, 1, '#fff'],
        [11, 8, 1, 1, '#fff'],
        [7, 10, 2, 1, '#e8919a'],
        [6, 11, 1, 1, '#222'],
        [9, 11, 1, 1, '#222'],
        [7, 12, 2, 1, '#222'],
        [1, 9, 2, 1, '#222'],
        [13, 9, 2, 1, '#222'],
        [1, 11, 2, 1, '#222'],
        [13, 11, 2, 1, '#222'],
      ]}
    />
  );
}

/** Climber */
export function StickerClimber({ label = 'Climber' }) {
  return (
    <PixelSticker
      label={label}
      rects={[
        [1, 8, 7, 7, '#8b7355'],
        [2, 7, 5, 1, '#8b7355'],
        [0, 10, 2, 4, '#6e5a44'],
        [6, 12, 3, 3, '#6e5a44'],
        [9, 2, 3, 3, '#f1c27d'],
        [9, 1, 3, 1, '#3b2a1a'],
        [8, 2, 1, 2, '#3b2a1a'],
        [9, 5, 3, 4, '#5dade2'],
        [12, 4, 2, 1, '#f1c27d'],
        [13, 3, 1, 1, '#f1c27d'],
        [14, 2, 1, 1, '#f1c27d'],
        [7, 6, 2, 1, '#f1c27d'],
        [6, 7, 1, 1, '#f1c27d'],
        [9, 9, 2, 3, '#2c3e50'],
        [11, 9, 1, 2, '#2c3e50'],
        [8, 11, 1, 2, '#f1c27d'],
        [12, 10, 1, 2, '#f1c27d'],
      ]}
    />
  );
}

/** Statue of Liberty */
export function StickerLiberty({ label = 'Statue of Liberty' }) {
  return (
    <PixelSticker
      label={label}
      rects={[
        [5, 1, 1, 2, '#3f8f6b'],
        [7, 0, 2, 2, '#3f8f6b'],
        [10, 1, 1, 2, '#3f8f6b'],
        [6, 2, 4, 3, '#3f8f6b'],
        [11, 4, 2, 4, '#3f8f6b'],
        [12, 2, 2, 2, '#f5d76e'],
        [13, 1, 1, 1, '#f5d76e'],
        [3, 7, 2, 3, '#3f8f6b'],
        [2, 8, 2, 2, '#d5d8dc'],
        [5, 5, 6, 8, '#3f8f6b'],
        [4, 8, 1, 4, '#3f8f6b'],
        [11, 8, 1, 4, '#3f8f6b'],
        [4, 13, 8, 2, '#2f6b50'],
        [6, 6, 1, 5, '#2f6b50'],
      ]}
    />
  );
}

/** Mountain */
export function StickerMountain({ label = 'Mountain' }) {
  return (
    <PixelSticker
      label={label}
      rects={[
        [0, 12, 16, 3, '#6f8f5a'],
        [1, 8, 6, 4, '#7b8a9a'],
        [2, 5, 4, 3, '#7b8a9a'],
        [3, 3, 2, 2, '#7b8a9a'],
        [3, 2, 2, 1, '#fff'],
        [2, 4, 1, 1, '#fff'],
        [4, 3, 1, 1, '#fff'],
        [8, 7, 7, 5, '#5e6d7a'],
        [10, 4, 4, 3, '#5e6d7a'],
        [11, 3, 2, 1, '#5e6d7a'],
        [11, 2, 2, 1, '#fff'],
        [10, 4, 1, 1, '#fff'],
      ]}
    />
  );
}

/** Music note */
export function StickerNote({ label = 'Music note' }) {
  return (
    <PixelSticker
      label={label}
      rects={[
        [9, 2, 2, 8, '#222'],
        [11, 2, 3, 2, '#222'],
        [12, 4, 2, 1, '#222'],
        [4, 9, 4, 4, '#222'],
        [5, 8, 3, 1, '#222'],
        [5, 10, 2, 2, '#fff'],
      ]}
    />
  );
}
