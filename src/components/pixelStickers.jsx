/** Tiny pixel-art sticker SVGs (16×16), crispEdges */

function PixelSvg({ children, label }) {
  return (
    <svg
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

function px(x, y, w, h, fill) {
  return <rect key={`${x}-${y}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

/** Japan flag */
export function StickerJapan({ label = 'Japan flag' }) {
  return (
    <PixelSvg label={label}>
      {px(1, 2, 14, 12, '#fff')}
      {px(1, 2, 14, 1, '#111')}
      {px(1, 13, 14, 1, '#111')}
      {px(1, 2, 1, 12, '#111')}
      {px(14, 2, 1, 12, '#111')}
      {px(6, 5, 4, 6, '#bc002d')}
      {px(5, 6, 6, 4, '#bc002d')}
    </PixelSvg>
  );
}

/** Salmon nigiri */
export function StickerSushi({ label = 'Salmon nigiri' }) {
  return (
    <PixelSvg label={label}>
      {px(3, 9, 10, 4, '#f4efe4')}
      {px(4, 8, 8, 1, '#f4efe4')}
      {px(3, 12, 10, 1, '#e6dfd0')}
      {px(2, 5, 12, 4, '#ff8a6a')}
      {px(3, 4, 10, 1, '#ff8a6a')}
      {px(2, 6, 12, 1, '#ff6b4a')}
      {px(4, 5, 2, 1, '#ffc4b0')}
      {px(9, 7, 2, 1, '#ffc4b0')}
    </PixelSvg>
  );
}

/** Sewing machine */
export function StickerSewing({ label = 'Sewing machine' }) {
  return (
    <PixelSvg label={label}>
      {px(2, 12, 12, 2, '#3a3a3a')}
      {px(3, 10, 9, 2, '#5c5c5c')}
      {px(10, 4, 3, 8, '#5c5c5c')}
      {px(7, 4, 4, 2, '#5c5c5c')}
      {px(6, 5, 2, 3, '#2e2e2e')}
      {px(6, 8, 1, 2, '#111')}
      {px(11, 5, 1, 1, '#c9a227')}
      {px(4, 11, 2, 1, '#888')}
    </PixelSvg>
  );
}

/** Miffy-like rabbit face */
export function StickerMiffy({ label = "Miffy's face" }) {
  return (
    <PixelSvg label={label}>
      {px(3, 1, 3, 5, '#fff')}
      {px(10, 1, 3, 5, '#fff')}
      {px(4, 2, 1, 3, '#f7c6d0')}
      {px(11, 2, 1, 3, '#f7c6d0')}
      {px(2, 6, 12, 9, '#fff')}
      {px(3, 5, 10, 1, '#fff')}
      {px(5, 9, 2, 2, '#111')}
      {px(9, 9, 2, 2, '#111')}
      {px(7, 11, 2, 1, '#111')}
      {px(6, 12, 4, 1, '#111')}
    </PixelSvg>
  );
}

/** Bouldering hold */
export function StickerBoulder({ label = 'Bouldering hold' }) {
  return (
    <PixelSvg label={label}>
      {px(3, 4, 10, 8, '#d4573c')}
      {px(2, 6, 1, 4, '#d4573c')}
      {px(13, 6, 1, 4, '#d4573c')}
      {px(4, 3, 8, 1, '#d4573c')}
      {px(5, 11, 6, 1, '#b3442e')}
      {px(6, 6, 2, 2, '#8f3322')}
      {px(9, 8, 2, 1, '#8f3322')}
      {px(4, 5, 2, 1, '#e8846a')}
    </PixelSvg>
  );
}

/** Statue of Liberty torch silhouette */
export function StickerLiberty({ label = 'Statue of Liberty' }) {
  return (
    <PixelSvg label={label}>
      {px(7, 1, 2, 2, '#f5d76e')}
      {px(6, 3, 4, 1, '#f5d76e')}
      {px(7, 4, 2, 2, '#3f8f6b')}
      {px(5, 6, 6, 2, '#3f8f6b')}
      {px(4, 8, 8, 5, '#3f8f6b')}
      {px(3, 10, 1, 2, '#3f8f6b')}
      {px(12, 9, 2, 3, '#f5d76e')}
      {px(13, 7, 1, 2, '#f5d76e')}
      {px(5, 13, 6, 2, '#2f6b50')}
    </PixelSvg>
  );
}

/** Carrot (play) */
export function StickerCarrot({ label = 'Carrot' }) {
  return (
    <PixelSvg label={label}>
      {px(7, 1, 2, 3, '#3f8f4a')}
      {px(6, 2, 1, 2, '#3f8f4a')}
      {px(9, 2, 1, 2, '#3f8f4a')}
      {px(6, 4, 4, 9, '#f4843a')}
      {px(5, 5, 1, 6, '#f4843a')}
      {px(10, 5, 1, 6, '#f4843a')}
      {px(7, 13, 2, 2, '#e06a22')}
      {px(6, 7, 1, 1, '#ffb07a')}
    </PixelSvg>
  );
}

/** Tiny grand piano */
export function StickerPiano({ label = 'Piano' }) {
  return (
    <PixelSvg label={label}>
      {px(2, 5, 12, 8, '#1a1a1a')}
      {px(3, 6, 2, 5, '#fff')}
      {px(6, 6, 2, 5, '#fff')}
      {px(9, 6, 2, 5, '#fff')}
      {px(12, 6, 1, 5, '#fff')}
      {px(5, 6, 1, 3, '#111')}
      {px(8, 6, 1, 3, '#111')}
      {px(11, 6, 1, 3, '#111')}
    </PixelSvg>
  );
}

/** Reset — circular arrows */
export function StickerReset({ label = 'Reset stickers' }) {
  return (
    <PixelSvg label={label}>
      {px(6, 2, 4, 1, '#333')}
      {px(10, 3, 2, 1, '#333')}
      {px(12, 4, 1, 3, '#333')}
      {px(11, 7, 2, 1, '#333')}
      {px(4, 3, 2, 1, '#333')}
      {px(3, 4, 1, 3, '#333')}
      {px(3, 8, 2, 1, '#333')}
      {px(6, 13, 4, 1, '#333')}
      {px(4, 12, 2, 1, '#333')}
      {px(3, 9, 1, 3, '#333')}
      {px(10, 12, 2, 1, '#333')}
      {px(12, 9, 1, 3, '#333')}
      {px(9, 4, 2, 2, '#c0392b')}
      {px(5, 10, 2, 2, '#c0392b')}
    </PixelSvg>
  );
}
