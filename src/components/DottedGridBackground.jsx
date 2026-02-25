import { useState, useEffect } from 'react';

const SPOT_RADIUS = 140;

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
      <div className="dotted-grid-bg-base" />
      <div
        className="dotted-grid-bg-hover"
        style={{
          maskImage: `radial-gradient(circle ${SPOT_RADIUS}px at ${Number(mouse.x)}px ${Number(mouse.y)}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(circle ${SPOT_RADIUS}px at ${Number(mouse.x)}px ${Number(mouse.y)}px, black, transparent)`,
        }}
      />
    </div>
  );
}
