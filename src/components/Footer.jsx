import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Footer.css';

const Footer = ({ setCursorVariant }) => {
  const [copied, setCopied] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  const copyEmail = () => {
    navigator.clipboard.writeText('karen@kodera.us');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'LinkedIn', url: '#', icon: '↗' },
    { name: 'Dribbble', url: '#', icon: '↗' },
    { name: 'Twitter', url: '#', icon: '↗' },
    { name: 'Read.cv', url: '#', icon: '↗' },
  ];

  const footerLinks = [
    { name: 'Work', path: '/' },
    { name: 'Play', path: '/play' },
    { name: 'About', path: '/about' },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Main CTA Section */}
        <motion.div 
          className="footer-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="footer-heading"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Let's work together
            <motion.span 
              className="wave-emoji"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              👋
            </motion.span>
          </motion.h2>
          
          <p className="footer-subtext">
            Currently open for new opportunities and exciting projects
          </p>

          <motion.button
            className="email-btn"
            onClick={copyEmail}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="email-text">karen@kodera.us</span>
            <motion.span 
              className="copy-indicator"
              animate={{ opacity: copied ? 1 : 0.6 }}
            >
              {copied ? '✓ Copied!' : 'Click to copy'}
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Links Grid */}
        <div className="footer-grid">
          <div className="footer-column">
            <h4 className="footer-column-title">Navigate</h4>
            <nav className="footer-nav">
              {footerLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className="footer-link"
                    onMouseEnter={() => {
                      handleMouseEnter();
                      setHoveredLink(link.name);
                    }}
                    onMouseLeave={() => {
                      handleMouseLeave();
                      setHoveredLink(null);
                    }}
                  >
                    <motion.span
                      animate={{ x: hoveredLink === link.name ? 6 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                    <motion.span 
                      className="link-arrow"
                      animate={{ 
                        opacity: hoveredLink === link.name ? 1 : 0,
                        x: hoveredLink === link.name ? 0 : -8 
                      }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">Connect</h4>
            <nav className="footer-nav">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  className="footer-link social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  whileHover={{ x: 6 }}
                >
                  {link.name}
                  <span className="external-icon">{link.icon}</span>
                </motion.a>
              ))}
            </nav>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">Back to top</h4>
            <motion.button
              className="back-to-top"
              onClick={scrollToTop}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="arrow-up"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↑
              </motion.span>
              <span>Scroll up</span>
            </motion.button>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="footer-bottom-left">
            <Link
              to="/"
              className="footer-logo"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.img
                src="https://framerusercontent.com/images/CTmSY8MITcYG5EkE8CeIlxzGbSM.png?scale-down-to=512"
                alt="Karen Kodera"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </Link>
            <span className="copyright">
              © {new Date().getFullYear()} Karen Kodera
            </span>
          </div>
          
          <motion.p 
            className="made-with"
            whileHover={{ scale: 1.05 }}
          >
            Made with <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
            >♥</motion.span> in Chicago
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
