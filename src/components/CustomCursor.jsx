import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = ({ cursorVariant, hoveredElement }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [elementBounds, setElementBounds] = useState(null);
  const [dotTarget, setDotTarget] = useState(null);
  
  // Smooth spring physics for organic cursor movement
  const springConfig = { stiffness: 400, damping: 28, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      // Update spring targets for smooth following
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, cursorX, cursorY]);

  useEffect(() => {
    if (hoveredElement && cursorVariant === 'text') {
      const bounds = hoveredElement.getBoundingClientRect();
      setElementBounds(bounds);
    } else {
      setElementBounds(null);
    }
  }, [hoveredElement, cursorVariant]);

  // Handle navDot variant - extract dot position from hoveredElement
  useEffect(() => {
    if (cursorVariant === 'navDot' && hoveredElement?.dotPosition) {
      setDotTarget(hoveredElement.dotPosition);
    } else {
      setDotTarget(null);
    }
  }, [cursorVariant, hoveredElement]);

  const padding = 16;
  const isProjectVariant = cursorVariant === 'project';
  const isTextVariant = cursorVariant === 'text';
  const isNavDotVariant = cursorVariant === 'navDot';

  // When in navDot mode, cursor snaps fully to the dot position
  const getDotCursorPosition = () => {
    if (!isNavDotVariant || !dotTarget) {
      return { x: mousePosition.x - 4, y: mousePosition.y - 4 };
    }
    // Snap completely to dot position
    return {
      x: dotTarget.x - 4,
      y: dotTarget.y - 4,
    };
  };

  const dotCursorPos = getDotCursorPosition();

  // When hovering a project card: dot hops to left of "view project" pill and becomes white (header-style)
  const projectDotSize = 6;
  const projectDotX = mousePosition.x - 37 - projectDotSize / 2; // center dot at x-37
  const projectDotY = mousePosition.y - 20 + 10 - projectDotSize / 2; // vertically center in pill (pill ~40px tall)
  const projectPillX = mousePosition.x - 37 + projectDotSize / 2 + 8; // pill starts after dot + 8px gap
  const projectPillY = mousePosition.y - 20;

  return (
    <>
      {/* Default cursor dot - morphs into nav dot, or hops into project pill as white dot */}
      <motion.div
        className={`custom-cursor ${isTextVariant ? 'cursor-hidden' : ''} ${isNavDotVariant ? 'nav-dot-cursor' : ''} ${isProjectVariant ? 'project-dot' : ''}`}
        animate={{
          x: isProjectVariant ? projectDotX : dotCursorPos.x,
          y: isProjectVariant ? projectDotY : dotCursorPos.y,
          width: isProjectVariant ? 6 : 8,
          height: isProjectVariant ? 6 : 8,
          opacity: isVisible ? 1 : 0,
          scale: isNavDotVariant ? 1.1 : 1,
          backgroundColor: isProjectVariant ? '#fff' : '#191919',
        }}
        transition={{
          type: 'spring',
          stiffness: isProjectVariant ? 500 : isNavDotVariant ? 300 : 400,
          damping: isProjectVariant ? 28 : isNavDotVariant ? 22 : 30,
          mass: isProjectVariant ? 0.5 : isNavDotVariant ? 0.6 : 0.8,
        }}
        style={{
          borderRadius: '50%',
        }}
      />


      {/* Hover ring cursor */}
      <AnimatePresence>
        {cursorVariant === 'hover' && (
          <motion.div
            className="custom-cursor hover-cursor"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              x: mousePosition.x - 24,
              y: mousePosition.y - 24,
              width: 48,
              height: 48,
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
          />
        )}
      </AnimatePresence>

      {/* Text highlight cursor */}
      {isTextVariant && elementBounds && (
        <motion.div
          className="custom-cursor text-cursor"
          animate={{
            x: elementBounds.left - padding,
            y: elementBounds.top - padding,
            width: elementBounds.width + padding * 2,
            height: elementBounds.height + padding * 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
        />
      )}

      {/* View Project cursor - pill to the right of the dot (header-style) */}
      <AnimatePresence>
        {isProjectVariant && (
          <motion.div
            className="custom-cursor project-cursor"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              x: projectPillX,
              y: projectPillY,
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            style={{
              opacity: isVisible ? 1 : 0,
            }}
          >
            view project
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
