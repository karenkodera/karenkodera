/** Corner-fold peel geometry for a square sticker cell. */

export const HOVER_PEEL = 0.15;
export const PRESS_PEEL = 0.22;
/** Stuck-area fraction at which the sticker comes free. */
export const RELEASE_AT = 0.14;

const CORNERS = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

export function analyzeSticker(src) {
  return new Promise((resolve) => {
    const fallback = { bb: [0, 0, 1, 1], coverage: [1, 1, 1, 1] };
    const img = new Image();
    img.onload = () => {
      try {
        const n = 48;
        const canvas = document.createElement('canvas');
        canvas.width = n;
        canvas.height = n;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const scale = Math.min(n / img.naturalWidth, n / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        ctx.clearRect(0, 0, n, n);
        ctx.drawImage(img, (n - w) / 2, (n - h) / 2, w, h);
        const data = ctx.getImageData(0, 0, n, n).data;
        let minX = n;
        let minY = n;
        let maxX = -1;
        let maxY = -1;
        for (let y = 0; y < n; y += 1) {
          for (let x = 0; x < n; x += 1) {
            if (data[(y * n + x) * 4 + 3] > 96) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX < 0) {
          resolve(fallback);
          return;
        }
        const reach = n * 0.2;
        const coverage = CORNERS.map(([cx, cy]) => {
          const ox = cx ? maxX + 1 : minX;
          const oy = cy ? maxY + 1 : minY;
          let total = 0;
          let ink = 0;
          for (let y = 0; y < n; y += 1) {
            for (let x = 0; x < n; x += 1) {
              const dx = cx ? ox - x : x + 1 - ox;
              const dy = cy ? oy - y : y + 1 - oy;
              if (dx > 0 && dy > 0 && dx + dy <= reach) {
                total += 1;
                if (data[(y * n + x) * 4 + 3] > 96) ink += 1;
              }
            }
          }
          return total ? ink / total : 0;
        });
        resolve({
          bb: [minX / n, minY / n, (maxX + 1) / n, (maxY + 1) / n],
          coverage,
        });
      } catch {
        resolve(fallback);
      }
    };
    img.onerror = () => resolve(fallback);
    img.src = src;
  });
}

export function pickCorner(coverage, localX, localY, size) {
  let index = (localY < size / 2 ? 0 : 2) + (localX < size / 2 ? 0 : 1);
  if ((coverage[index] ?? 1) < 0.1) {
    let best = 0;
    coverage.forEach((value, i) => {
      if (value > coverage[best]) best = i;
    });
    index = best;
  }
  return CORNERS[index];
}

export function peelDirection(corner) {
  return [
    (corner[0] ? -1 : 1) * Math.SQRT1_2,
    (corner[1] ? -1 : 1) * Math.SQRT1_2,
  ];
}

export function maxPeelLength(bb, size) {
  return (Math.SQRT2 * size * (bb[2] - bb[0] + (bb[3] - bb[1]))) / 2;
}

export function cornerPoint(bb, corner, size) {
  return [bb[corner[0] ? 2 : 0] * size, bb[corner[1] ? 3 : 1] * size];
}

function clipHalfPlane(poly, fold, normal, sign) {
  if (!poly.length) return [];
  const out = [];
  const side = (p) => sign * ((p[0] - fold[0]) * normal[0] + (p[1] - fold[1]) * normal[1]);
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const sa = side(a);
    const sb = side(b);
    if (sa >= -0.01) out.push(a);
    if (sa >= 0 !== sb >= 0) {
      const t = sa / (sa - sb);
      out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  }
  return out;
}

function polygonArea(pts) {
  let area = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    area += p[0] * q[1] - q[0] * p[1];
  }
  return Math.abs(area) / 2;
}

export function toClipPath(points) {
  if (points.length < 3) return 'polygon(0px 0px, 0px 0px, 0px 0px)';
  return `polygon(${points.map((p) => `${p[0].toFixed(2)}px ${p[1].toFixed(2)}px`).join(', ')})`;
}

export function reflectionMatrix(fold, normal) {
  const nx = normal[0];
  const ny = normal[1];
  const tidy = (n) => (Math.abs(n) < 1e-6 ? 0 : n);
  const sxx = tidy(1 - 2 * nx * nx);
  const sxy = tidy(-2 * nx * ny);
  const syy = tidy(1 - 2 * ny * ny);
  const along = 2 * (fold[0] * nx + fold[1] * ny);
  return `matrix(${sxx}, ${sxy}, ${sxy}, ${syy}, ${tidy(along * nx)}, ${tidy(along * ny)})`;
}

function reflectPoint(point, fold, normal) {
  const dist = 2 * ((point[0] - fold[0]) * normal[0] + (point[1] - fold[1]) * normal[1]);
  return [point[0] - dist * normal[0], point[1] - dist * normal[1]];
}

/**
 * Paint a peel of length `amount` (pixels) from `corner` along `dir`.
 * Returns the fraction of the sticker that is still stuck.
 */
export function paintPeel(els, { bb, corner, dir, amount }) {
  const { front, flap, backWrap, shade, crease } = els;
  const size = front?.offsetWidth || 0;
  if (!size) return 1;

  if (amount < 0.6) {
    front.style.clipPath = 'none';
    front.style.webkitClipPath = 'none';
    flap.style.visibility = 'hidden';
    shade.style.filter = 'none';
    return 1;
  }

  const tip = cornerPoint(bb, corner, size);
  const normal = [dir[0], dir[1]];
  const len = Math.hypot(normal[0], normal[1]) || 1;
  normal[0] /= len;
  normal[1] /= len;
  const fold = [tip[0] + normal[0] * amount * 0.5, tip[1] + normal[1] * amount * 0.5];

  const pad = 14;
  const square = [
    [-pad, -pad],
    [size + pad, -pad],
    [size + pad, size + pad],
    [-pad, size + pad],
  ];
  const stuck = clipHalfPlane(square, fold, normal, 1);
  const lifted = clipHalfPlane(square, fold, normal, -1).map((p) => reflectPoint(p, fold, normal));

  const stuckPath = toClipPath(stuck);
  const flapPath = toClipPath(lifted);
  front.style.clipPath = stuckPath;
  front.style.webkitClipPath = stuckPath;
  flap.style.clipPath = flapPath;
  flap.style.webkitClipPath = flapPath;
  flap.style.visibility = 'visible';

  shade.style.filter = 'none';

  const matrix = reflectionMatrix(fold, normal);
  backWrap.style.transform = matrix;

  const angle = (Math.atan2(normal[0], -normal[1]) * 180) / Math.PI;
  const span = size * (Math.abs(normal[0]) + Math.abs(normal[1]));
  const along = ((fold[0] + size * 0.15) * normal[0] + (fold[1] + size * 0.15) * normal[1]) / Math.max(1, span);
  const start = Math.max(0, Math.min(0.92, along)) * 100;
  crease.style.background = `linear-gradient(${angle.toFixed(1)}deg, rgba(0,0,0,0.2) ${start.toFixed(1)}%, rgba(0,0,0,0.06) ${(start + 5).toFixed(1)}%, rgba(0,0,0,0) ${(start + 16).toFixed(1)}%)`;

  const rect = [
    [bb[0] * size, bb[1] * size],
    [bb[2] * size, bb[1] * size],
    [bb[2] * size, bb[3] * size],
    [bb[0] * size, bb[3] * size],
  ];
  const stuckArt = clipHalfPlane(rect, fold, normal, 1);
  const full = Math.max(1, (bb[2] - bb[0]) * (bb[3] - bb[1]) * size * size);
  return polygonArea(stuckArt) / full;
}
