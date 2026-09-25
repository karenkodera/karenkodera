import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import './About.css';

const About = ({ setCursorVariant }) => {
  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  return (
    <>
      <Hero setCursorVariant={setCursorVariant} />
      <div className="about-page" id="aboutme">
      <motion.section
        className="about-bio-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="about-bio-layout">
          <div className="about-photo-wrap" aria-hidden="true">
            <img
              src="/about-photo.png"
              alt=""
              className="about-photo"
              loading="eager"
            />
          </div>
          <div className="about-bio-content">
            <p className="about-bio">
              I&apos;ve always loved creating, starting in high school with choreographing dances to designing buildings for my architecture degree. When I discovered product design, I fell in love with its iterative nature and human impact. Today, I design Kroger&apos;s ecommerce interface, to help 11 million shoppers buy groceries online easier daily.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.div
        className="about-details-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <section className="about-experience-section">
          <h2 className="about-section-label">EXPERIENCE</h2>
          <div className="about-experience-list">
            <div className="about-experience-item">
              <div className="about-experience-role">Product Design</div>
              <div className="about-experience-company">Kroger</div>
              <div className="about-experience-date">2024 – now</div>
            </div>
            <div className="about-experience-item">
              <div className="about-experience-role">Product Design</div>
              <div className="about-experience-company">Dick&apos;s Sporting Goods</div>
              <div className="about-experience-date">2023</div>
            </div>
          </div>
        </section>

        <section className="about-education-section">
          <h2 className="about-section-label">EDUCATION</h2>
          <div className="about-education-list">
            <div className="about-education-item">
              <div className="about-education-degree">M.S. Engineering Design Innovation</div>
              <div className="about-education-school">Northwestern University</div>
              <div className="about-education-date">2023 – 2025</div>
            </div>
            <div className="about-education-item">
              <div className="about-education-degree">B.S. Architecture</div>
              <div className="about-education-school">Georgia Institute of Technology</div>
              <div className="about-education-date">2018 – 2023</div>
            </div>
          </div>
        </section>
      </motion.div>
      </div>
    </>
  );
};

export default About;
