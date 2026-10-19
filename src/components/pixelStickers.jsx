/** Tiny pixel-art sticker SVGs (16×16), crispEdges */

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

function px(x, y, w, h, fill) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

/** Waving Japan flag — thinner black edge */
export function StickerJapan({ label = 'Japan flag' }) {
  return (
    <PixelSvg label={label}>
      {/* pole */}
      {px(1, 2, 1, 12, '#3a3a3a')}
      {/* waving cloth rows */}
      {px(3, 3, 11, 2, '#fff')}
      {px(2, 5, 12, 2, '#fff')}
      {px(3, 7, 11, 2, '#fff')}
      {px(2, 9, 12, 2, '#fff')}
      {px(3, 11, 10, 2, '#fff')}
      {/* thin black outline accents */}
      {px(3, 3, 11, 1, '#222')}
      {px(2, 13, 11, 1, '#222')}
      {px(13, 4, 1, 8, '#222')}
      {/* sun */}
      {px(6, 6, 4, 4, '#bc002d')}
      {px(7, 5, 2, 6, '#bc002d')}
      {px(5, 7, 6, 2, '#bc002d')}
    </PixelSvg>
  );
}

/** Salmon nigiri — drawn tilted; CSS also rotates 45° */
export function StickerSushi({ label = 'Salmon nigiri' }) {
  return (
    <PixelSvg label={label} className="sticker-art--tilt45">
      {px(4, 8, 8, 3, '#f4efe4')}
      {px(5, 11, 6, 1, '#e6dfd0')}
      {px(3, 5, 10, 3, '#ff8a6a')}
      {px(4, 4, 8, 1, '#ff8a6a')}
      {px(3, 6, 10, 1, '#ff6b4a')}
      {px(5, 5, 2, 1, '#ffc4b0')}
      {px(9, 7, 2, 1, '#ffc4b0')}
    </PixelSvg>
  );
}

/** Sewing needle + thread */
export function StickerNeedle({ label = 'Sewing needle and thread' }) {
  return (
    <PixelSvg label={label}>
      {/* thread coil */}
      {px(9, 2, 4, 4, '#5b8def')}
      {px(10, 3, 2, 2, '#fff')}
      {px(8, 5, 1, 1, '#5b8def')}
      {px(7, 6, 1, 1, '#5b8def')}
      {px(6, 7, 1, 1, '#5b8def')}
      {px(5, 8, 1, 1, '#5b8def')}
      {/* needle */}
      {px(3, 4, 2, 9, '#c0c4c8')}
      {px(3, 3, 2, 1, '#9aa0a6')}
      {px(4, 13, 1, 2, '#9aa0a6')}
      {/* eye */}
      {px(3, 5, 2, 2, '#fff')}
      {px(4, 5, 1, 2, '#c0c4c8')}
    </PixelSvg>
  );
}

/** Cat face */
export function StickerCat({ label = 'Cat' }) {
  return (
    <PixelSvg label={label}>
      {/* ears */}
      {px(2, 2, 3, 3, '#f0b27a')}
      {px(11, 2, 3, 3, '#f0b27a')}
      {px(3, 3, 1, 1, '#e8919a')}
      {px(12, 3, 1, 1, '#e8919a')}
      {/* head */}
      {px(2, 5, 12, 9, '#f0b27a')}
      {px(3, 4, 10, 1, '#f0b27a')}
      {/* eyes */}
      {px(4, 8, 2, 2, '#222')}
      {px(10, 8, 2, 2, '#222')}
      {px(5, 8, 1, 1, '#fff')}
      {px(11, 8, 1, 1, '#fff')}
      {/* nose / mouth */}
      {px(7, 10, 2, 1, '#e8919a')}
      {px(6, 11, 1, 1, '#222')}
      {px(9, 11, 1, 1, '#222')}
      {px(7, 12, 2, 1, '#222')}
      {/* whiskers */}
      {px(1, 9, 2, 1, '#222')}
      {px(13, 9, 2, 1, '#222')}
      {px(1, 11, 2, 1, '#222')}
      {px(13, 11, 2, 1, '#222')}
    </PixelSvg>
  );
}

/** Climber (iOS-style person on rock) */
export function StickerClimber({ label = 'Climber' }) {
  return (
    <PixelSvg label={label}>
      {/* rock */}
      {px(1, 8, 7, 7, '#8b7355')}
      {px(2, 7, 5, 1, '#8b7355')}
      {px(0, 10, 2, 4, '#6e5a44')}
      {px(6, 12, 3, 3, '#6e5a44')}
      {/* head */}
      {px(9, 2, 3, 3, '#f1c27d')}
      {/* hair */}
      {px(9, 1, 3, 1, '#3b2a1a')}
      {px(8, 2, 1, 2, '#3b2a1a')}
      {/* body / tank */}
      {px(9, 5, 3, 4, '#5dade2')}
      {/* arm up */}
      {px(12, 4, 2, 1, '#f1c27d')}
      {px(13, 3, 1, 1, '#f1c27d')}
      {px(14, 2, 1, 1, '#f1c27d')}
      {/* arm to rock */}
      {px(7, 6, 2, 1, '#f1c27d')}
      {px(6, 7, 1, 1, '#f1c27d')}
      {/* legs */}
      {px(9, 9, 2, 3, '#2c3e50')}
      {px(11, 9, 1, 2, '#2c3e50')}
      {px(8, 11, 1, 2, '#f1c27d')}
      {px(12, 10, 1, 2, '#f1c27d')}
    </PixelSvg>
  );
}

/** Clearer Statue of Liberty */
export function StickerLiberty({ label = 'Statue of Liberty' }) {
  return (
    <PixelSvg label={label}>
      {/* crown spikes */}
      {px(5, 1, 1, 2, '#3f8f6b')}
      {px(7, 0, 2, 2, '#3f8f6b')}
      {px(10, 1, 1, 2, '#3f8f6b')}
      {/* head */}
      {px(6, 2, 4, 3, '#3f8f6b')}
      {/* torch arm + flame */}
      {px(11, 4, 2, 4, '#3f8f6b')}
      {px(12, 2, 2, 2, '#f5d76e')}
      {px(13, 1, 1, 1, '#f5d76e')}
      {/* tablet arm */}
      {px(3, 7, 2, 3, '#3f8f6b')}
      {px(2, 8, 2, 2, '#d5d8dc')}
      {/* robe body */}
      {px(5, 5, 6, 8, '#3f8f6b')}
      {px(4, 8, 1, 4, '#3f8f6b')}
      {px(11, 8, 1, 4, '#3f8f6b')}
      {/* base */}
      {px(4, 13, 8, 2, '#2f6b50')}
      {px(6, 6, 1, 5, '#2f6b50')}
    </PixelSvg>
  );
}

/** Mountain */
export function StickerMountain({ label = 'Mountain' }) {
  return (
    <PixelSvg label={label}>
      {px(0, 12, 16, 3, '#6f8f5a')}
      {px(1, 8, 6, 4, '#7b8a9a')}
      {px(2, 5, 4, 3, '#7b8a9a')}
      {px(3, 3, 2, 2, '#7b8a9a')}
      {px(3, 2, 2, 1, '#fff')}
      {px(2, 4, 1, 1, '#fff')}
      {px(4, 3, 1, 1, '#fff')}
      {px(8, 7, 7, 5, '#5e6d7a')}
      {px(10, 4, 4, 3, '#5e6d7a')}
      {px(11, 3, 2, 1, '#5e6d7a')}
      {px(11, 2, 2, 1, '#fff')}
      {px(10, 4, 1, 1, '#fff')}
    </PixelSvg>
  );
}

/** Music note */
export function StickerNote({ label = 'Music note' }) {
  return (
    <PixelSvg label={label}>
      {px(9, 2, 2, 8, '#222')}
      {px(11, 2, 3, 2, '#222')}
      {px(12, 4, 2, 1, '#222')}
      {px(4, 9, 4, 4, '#222')}
      {px(5, 8, 3, 1, '#222')}
      {px(5, 10, 2, 2, '#fff')}
    </PixelSvg>
  );
}
