import { motion } from 'framer-motion';
import './Hero.css';

const Hero = ({ setCursorVariant }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="hero">
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-avatar-container" variants={itemVariants}>
          <motion.img
            src="https://framerusercontent.com/images/CTmSY8MITcYG5EkE8CeIlxzGbSM.png?scale-down-to=512"
            alt="Karen Kodera"
            className="hero-avatar"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          />
        </motion.div>

        <motion.h1
          className="hero-title"
          variants={itemVariants}
        >
          Hi, I'm Karen Kodera.
        </motion.h1>

        <motion.p
          className="hero-description"
          variants={itemVariants}
        >
          A product designer with a background in architecture, turning complex problems into intuitive, human-centered solutions.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Hero;
