import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Skiper UI–style rolling letter animation (skiper27 / homepage “un-common”).
 * Letters roll vertically with more cycles toward the center, staggered center → edges.
 */
const ROLL_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function repeatsForIndex(index, total) {
  const center = (total - 1) / 2;
  const dist = Math.abs(index - center);
  const maxDist = Math.max(center, 0.001);
  const t = 1 - dist / maxDist;
  return Math.max(6, Math.round(6 + t * t * 16));
}

function buildStack(char, repeats, seed) {
  if (repeats <= 1) return [char];
  let n = seed;
  const stack = Array.from({ length: repeats - 1 }, () => {
    n = (n * 1664525 + 1013904223) >>> 0;
    let g = ROLL_GLYPHS[n % ROLL_GLYPHS.length];
    if (g === char) g = ROLL_GLYPHS[(ROLL_GLYPHS.indexOf(g) + 7) % ROLL_GLYPHS.length];
    return g;
  });
  stack.push(char);
  return stack;
}

function RollingChar({
  char,
  index,
  total,
  speed,
  duration,
  className = '',
  itemHeightEm = 1,
}) {
  const reduceMotion = useReducedMotion();
  const center = (total - 1) / 2;
  const delay = Math.abs(index - center) * speed;
  const repeats = reduceMotion ? 1 : repeatsForIndex(index, total);
  const stack = useMemo(
    () => buildStack(char, repeats, index * 97 + char.charCodeAt(0) * 13),
    [char, repeats, index],
  );

  if (char === ' ') {
    return <span className={`rolling-char rolling-char--space ${className}`} aria-hidden="true">&nbsp;</span>;
  }

  return (
    <span className={`rolling-char ${className}`.trim()} aria-hidden="true">
      <motion.span
        className="rolling-char-stack"
        initial={reduceMotion ? false : { y: '0em' }}
        animate={{ y: `-${(repeats - 1) * itemHeightEm}em` }}
        transition={{
          duration: reduceMotion ? 0 : duration,
          delay: reduceMotion ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {stack.map((c, i) => (
          <span key={`${c}-${i}`} className="rolling-char-item">
            {c}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * @param {object} props
 * @param {string} props.text
 * @param {number} [props.speed=0.05]
 * @param {number} [props.duration=4]
 * @param {string} [props.className]
 * @param {(char: string, index: number) => import('react').ReactNode} [props.renderChar]
 */
export function RollingText({
  text,
  speed = 0.05,
  duration = 4,
  className = '',
  renderChar,
}) {
  const chars = Array.from(text);

  return (
    <span className={`rolling-text ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      {chars.map((char, index) => {
        if (renderChar) {
          const custom = renderChar(char, index);
          if (custom != null) return <span key={`c-${index}`}>{custom}</span>;
        }
        return (
          <RollingChar
            key={`${char}-${index}`}
            char={char}
            index={index}
            total={chars.length}
            speed={speed}
            duration={duration}
          />
        );
      })}
    </span>
  );
}

export { RollingChar };
export default RollingText;
