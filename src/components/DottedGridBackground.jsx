import { useState, useEffect } from 'react';

const SPOT_RADIUS = 160;

/** Soft black “flashlight” that follows the mouse. */
export default function DottedGridBackground() {
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    const handleLeave = () => setMouse({ x: -1000, y: -1000 });
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div className="dotted-grid-bg" aria-hidden>
      <div
        className="mouse-flashlight"
        style={{
          background: `radial-gradient(circle ${SPOT_RADIUS}px at ${Number(mouse.x)}px ${Number(mouse.y)}px, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0.06) 40%, transparent 70%)`,
        }}
      />
    </div>
  );
}
