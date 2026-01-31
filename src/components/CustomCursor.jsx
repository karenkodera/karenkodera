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

  // View project pill position - only update while over card so pill doesn't follow cursor to corner on leave
  const projectPillX = mousePosition.x - 50;
  const projectPillY = mousePosition.y - 20;
  const [pillPosition, setPillPosition] = useState({ x: projectPillX, y: projectPillY });

  useEffect(() => {
    if (isProjectVariant) {
      setPillPosition({ x: projectPillX, y: projectPillY });
    }
  }, [isProjectVariant, projectPillX, projectPillY]);

  return (
    <>
      {/* Default cursor dot - hidden when project pill is shown (pill has its own dot inside) */}
      <motion.div
        className={`custom-cursor ${isTextVariant ? 'cursor-hidden' : ''} ${isNavDotVariant ? 'nav-dot-cursor' : ''}`}
        animate={{
          x: dotCursorPos.x,
          y: dotCursorPos.y,
          width: 8,
          height: 8,
          opacity: isProjectVariant ? 0 : (isVisible ? 1 : 0),
          scale: isNavDotVariant ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: isNavDotVariant ? 300 : 400,
          damping: isNavDotVariant ? 22 : 30,
          mass: isNavDotVariant ? 0.6 : 0.8,
        }}
        style={{
          backgroundColor: '#191919',
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

      {/* View Project cursor - stays at card position, disappears in place when cursor leaves */}
      <AnimatePresence>
        {isProjectVariant && (
          <motion.div
            className="custom-cursor project-cursor"
            initial={{
              x: pillPosition.x,
              y: pillPosition.y,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              x: pillPosition.x,
              y: pillPosition.y,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              x: pillPosition.x,
              y: pillPosition.y,
              opacity: 0,
              scale: 0.5,
              transition: { duration: 0 },
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            style={{
              opacity: isVisible ? undefined : 0,
            }}
          >
            <span className="project-cursor-dot" />
            view project
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
