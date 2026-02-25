import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DottedGridBackground from '../components/DottedGridBackground';
import './About.css';

const About = ({ setCursorVariant }) => {
  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  return (
    <div className="about-page" id="aboutme">
      <DottedGridBackground />
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
            <p className="about-bio-lead">
              Designer, lifelong student, lover of small trinkets, and outdoor enthusiast.
            </p>
            <p className="about-bio">
              Growing up with two artists as parents, I like to think I was born with creativity in my blood. My design journey began when I majored in architecture at Georgia Tech, building a foundation for technical precision and an ability to balance constraints with creative vision.
            </p>
            <p className="about-bio">
              I find myself energized by creating for people, so when I discovered product design, I fell in love with its iterative nature and human impact. In design, I see an opportunity to redefine what technology can do for people.
            </p>
            <p className="about-bio">
              I earned my M.S. in Engineering Design Innovation at Northwestern, where I deepened my practice as a human-centered designer, learning to ground every solution in research and translate insights into meaningful products and services. Today, I design and develop Kroger&apos;s ecommerce interface, to help 11 million shoppers buy groceries online easier daily.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="about-experience-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="about-section-label">EXPERIENCE</h2>
        <div className="about-experience-list">
          <div className="about-experience-item">
            <div className="about-experience-role">Product Design</div>
            <div className="about-experience-company">Kroger</div>
            <div className="about-experience-date">Jun 2024 – now</div>
          </div>
          <div className="about-experience-item">
            <div className="about-experience-role">Product Design</div>
            <div className="about-experience-company">Dick&apos;s Sporting Goods</div>
            <div className="about-experience-date">Jun 2023 – Nov 2023</div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="about-education-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="about-section-label">EDUCATION</h2>
        <div className="about-education-list">
          <div className="about-education-item">
            <div className="about-education-degree">M.S. Engineering Design Innovation</div>
            <div className="about-education-school">Northwestern University</div>
            <div className="about-education-date">Sept 2023 – Mar 2025</div>
          </div>
          <div className="about-education-item">
            <div className="about-education-degree">B.S. Architecture</div>
            <div className="about-education-school">Georgia Institute of Technology</div>
            <div className="about-education-date">Aug 2018 – Aug 2023</div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
