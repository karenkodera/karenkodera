import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { RollingChar } from './RollingText';
import './RollingText.css';
import './IntroSplash.css';

const ROLL_SPEED = 0.05;
const ROLL_DURATION = 2.8;
const HOLD_MS = 700;
const CURVE_DEPTH = 300;
const EASE = [0.76, 0, 0.24, 1];

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
 * Full-screen name intro with Skiper8 / Dennis Snellenberg–style
 * curved SVG exit (bend + elastic slide up).
 */
const IntroSplash = ({ onComplete }) => {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(true);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (!show) return undefined;
    const rollMs = reduceMotion ? 200 : (ROLL_DURATION + 0.35) * 1000;
    const t = window.setTimeout(() => setShow(false), rollMs + HOLD_MS);
    return () => window.clearTimeout(t);
  }, [show, reduceMotion]);

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

  return (
    <AnimatePresence mode="wait" onExitComplete={() => onComplete?.()}>
      {show && (
        <motion.div
          className="intro-splash"
          role="presentation"
          variants={slideUp}
          initial="initial"
          exit="exit"
        >
          <div className="intro-splash-panel">
            <h1 className="intro-splash-title">
              <RollingWord text="KAREN" />
              <RollingWord text="KODERA" />
            </h1>
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
    </AnimatePresence>
  );
};

export default IntroSplash;
