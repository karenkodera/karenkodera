import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { RollingChar } from './RollingText';
import './RollingText.css';
import './IntroSplash.css';

const ROLL_SPEED = 0.05;
const ROLL_DURATION = 2.8;
const HOLD_MS = 700;
const EXIT_MS = 1100;

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
 * Full-screen name intro (huyml-style reveal), using the rolling letter scramble
 * instead of a character pushing the panel away.
 */
const IntroSplash = ({ onComplete }) => {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState('enter'); // enter | exit | done

  useEffect(() => {
    if (phase !== 'enter') return undefined;

    const rollMs = reduceMotion ? 200 : (ROLL_DURATION + 0.35) * 1000;
    const t = window.setTimeout(() => setPhase('exit'), rollMs + HOLD_MS);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== 'exit') return undefined;
    const t = window.setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, reduceMotion ? 200 : EXIT_MS);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion, onComplete]);

  useEffect(() => {
    if (phase === 'done') return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="intro-splash"
          role="presentation"
          aria-hidden={phase === 'exit'}
          initial={{ y: 0 }}
          animate={phase === 'exit' ? { y: '-105%' } : { y: 0 }}
          transition={{
            duration: reduceMotion ? 0.2 : EXIT_MS / 1000,
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          <div className="intro-splash-panel">
            <h1 className="intro-splash-title">
              <RollingWord text="KAREN" />
              <RollingWord text="KODERA" />
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroSplash;
