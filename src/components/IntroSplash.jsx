import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { RollingChar } from './RollingText';
import ImageCursorTrail from './ImageCursorTrail';
import { STICKERS } from './StickerNote';
import './RollingText.css';
import './IntroSplash.css';

const ROLL_SPEED = 0.05;
const ROLL_DURATION = 2.8;
const HOLD_MS = 350;
const CURVE_DEPTH = 300;
const EASE = [0.76, 0, 0.24, 1];
const STICKER_TRAIL = STICKERS.map((s) => s.src);

function RollingWord({ text }) {
  const chars = Array.from(text);
  const total = chars.length;

  return (
    <span className="intro-splash-word rolling-text">
      <span className="sr-only">{text}</span>
      {chars.map((char, index) => (
        <RollingChar
          key={`${char}-${index}`}
          char={char}
          index={index}
          total={total}
          speed={ROLL_SPEED}
          duration={ROLL_DURATION}
          itemHeightEm={0.9}
          className="intro-splash-letter"
        />
      ))}
    </span>
  );
}

/**
 * Full-screen name intro with Skiper8 curved exit and
 * Skiper18 sticker cursor trail. Portaled to body so it isn't
 * trapped by page-transition transforms.
 */
const IntroSplash = ({ onComplete }) => {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(true);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete?.();
  };

  useEffect(() => {
    const measure = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    STICKER_TRAIL.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Single timer — do not restart when reduceMotion hydrates
  useEffect(() => {
    const prefersReduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rollMs = prefersReduce ? 200 : (ROLL_DURATION + 0.35) * 1000;
    const t = window.setTimeout(() => setShow(false), rollMs + HOLD_MS);
    // Hard failsafe if exit animation never completes
    const failsafe = window.setTimeout(finish, rollMs + HOLD_MS + 2000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(failsafe);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  useEffect(() => {
    if (!show) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  const { width, height } = dimension;
  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + CURVE_DEPTH} 0 ${height} L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height} L0 0`;

  const slideUp = {
    initial: { top: 0 },
    exit: reduceMotion
      ? { top: '-100vh', transition: { duration: 0.2 } }
      : {
          top: '-100vh',
          transition: { duration: 0.8, ease: EASE, delay: 0.2 },
        },
  };

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: reduceMotion ? 0.2 : 0.7, ease: EASE },
    },
    exit: {
      d: targetPath,
      transition: {
        duration: reduceMotion ? 0.2 : 0.7,
        ease: EASE,
        delay: reduceMotion ? 0 : 0.3,
      },
    },
  };

  const title = (
    <h1 className="intro-splash-title">
      <RollingWord text="KAREN" />
      <RollingWord text="KODERA" />
    </h1>
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait" onExitComplete={finish}>
      {show && (
        <motion.div
          className="intro-splash"
          role="presentation"
          variants={slideUp}
          initial="initial"
          exit="exit"
        >
          <div className="intro-splash-panel">
            {reduceMotion ? (
              <div className="intro-splash-title-wrap">{title}</div>
            ) : (
              <ImageCursorTrail
                items={STICKER_TRAIL}
                maxNumberOfImages={8}
                distance={20}
                fadeAnimation={false}
                className="intro-splash-trail"
              >
                {title}
              </ImageCursorTrail>
            )}
          </div>

          {width > 0 && (
            <svg
              className="intro-splash-curve"
              viewBox={`0 0 ${width} ${height + CURVE_DEPTH}`}
              preserveAspectRatio="none"
              style={{ height: `calc(100% + ${CURVE_DEPTH}px)` }}
            >
              <motion.path variants={curve} initial="initial" exit="exit" />
            </svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default IntroSplash;
