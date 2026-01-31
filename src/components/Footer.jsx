import { motion } from 'framer-motion';
import { useState } from 'react';
import './Footer.css';

const Footer = ({ setCursorVariant }) => {
  const [isBackToTopHovered, setIsBackToTopHovered] = useState(false);
  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <motion.div
          className="footer-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="footer-links">
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ y: -2 }}
            >
              LinkedIn
              <span className="external-icon">↗</span>
            </motion.a>
            <motion.a
              href="mailto:karen@kodera.us"
              className="footer-link"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ y: -2 }}
            >
              Email
              <span className="external-icon">↗</span>
            </motion.a>
          </div>

          <span className="made-with made-with-center">
            Made with <motion.span
              className="heart"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
            >♥</motion.span> in Chicago
          </span>

          <motion.button
            className="back-to-top"
            onClick={scrollToTop}
            onMouseEnter={() => {
              handleMouseEnter();
              setIsBackToTopHovered(true);
            }}
            onMouseLeave={() => {
              handleMouseLeave();
              setIsBackToTopHovered(false);
            }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="arrow-up"
              animate={{
                y: isBackToTopHovered ? [0, -3, 0] : 0,
              }}
              transition={{
                duration: 1.5,
                repeat: isBackToTopHovered ? Infinity : 0,
              }}
            >
              ↑
            </motion.span>
            Back to top
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
