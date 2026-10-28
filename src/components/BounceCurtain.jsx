import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import './BounceCurtain.css';

const CURVE_DEPTH = 300;
const EASE = [0.76, 0, 0.24, 1];

/**
 * Skiper8-style bounce curtain — full-screen panel slides up with a
 * curved bottom edge (same motion language as the name intro).
 * tone: 'tan' (work grid) | 'white' (case study)
 */
const BounceCurtain = ({ tone = 'tan', animKey, onComplete }) => {
  const reduceMotion = useReducedMotion();
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const doneRef = useRef(false);

  useEffect(() => {
    const measure = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    doneRef.current = false;
  }, [animKey]);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  };

  if (typeof document === 'undefined') return null;

  const { width, height } = dimension;
  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + CURVE_DEPTH} 0 ${height} L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height} L0 0`;

  const duration = reduceMotion ? 0.2 : 0.8;
  const pathDuration = reduceMotion ? 0.2 : 0.7;
  const delay = reduceMotion ? 0 : 0.08;
  const pathDelay = reduceMotion ? 0 : 0.18;

  return createPortal(
    <motion.div
      key={animKey}
      className={`bounce-curtain bounce-curtain--${tone}`}
      role="presentation"
      aria-hidden
      initial={{ top: 0 }}
      animate={{ top: '-100vh' }}
      transition={{ duration, ease: EASE, delay }}
      onAnimationComplete={finish}
    >
      <div className="bounce-curtain-panel" />
      {width > 0 && (
        <svg
          className="bounce-curtain-curve"
          viewBox={`0 0 ${width} ${height + CURVE_DEPTH}`}
          preserveAspectRatio="none"
          style={{ height: `calc(100% + ${CURVE_DEPTH}px)` }}
        >
          <motion.path
            initial={{ d: initialPath }}
            animate={{ d: targetPath }}
            transition={{ duration: pathDuration, ease: EASE, delay: pathDelay }}
          />
        </svg>
      )}
    </motion.div>,
    document.body
  );
};

export default BounceCurtain;
