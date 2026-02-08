import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudySection from '../components/CaseStudySection';
import './Thesis.css';

const KROGER_NAV_SECTIONS = [
  { label: 'Background', id: 'background' },
  { label: 'Context', id: 'context' },
  { label: 'Problem', id: 'problem' },
  { label: 'Solution', id: 'solution' },
  { label: 'Conclusion', id: 'conclusion' },
];

const SCROLL_SPY_TOP_OFFSET = 160;

const Kroger = ({ setCursorVariant }) => {
  const [activeSectionId, setActiveSectionId] = useState(null);

  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sectionIds = KROGER_NAV_SECTIONS.map((s) => s.id);
    const updateActiveSection = () => {
      const trigger = SCROLL_SPY_TOP_OFFSET;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= trigger && bottom >= trigger) {
          setActiveSectionId(id);
          return;
        }
      }
      const first = document.getElementById(sectionIds[0]);
      if (first && first.getBoundingClientRect().bottom < trigger) {
        setActiveSectionId(sectionIds[sectionIds.length - 1]);
      } else {
        setActiveSectionId(sectionIds[0]);
      }
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="thesis-page">
      <nav className="thesis-nav" aria-label="Case study sections">
        <Link to="/" className="thesis-nav-back" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <span className="thesis-nav-back-arrow" aria-hidden>←</span>
          back to home
        </Link>
        <ul className="thesis-nav-list">
          {KROGER_NAV_SECTIONS.map(({ label, id }) => (
            <li key={id} className="thesis-nav-item">
              <button
                type="button"
                className={`thesis-nav-link${activeSectionId === id ? ' thesis-nav-link-active' : ''}`}
                onClick={() => scrollToSection(id)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="thesis-main">
        <article className="thesis-article">
          <motion.section
            className="thesis-hero"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="thesis-section-label thesis-hero-title">Kroger</h1>
            <p className="thesis-tagline">
              Reducing Paper in Grocery Delivery — Kroger Product Design Internship.
            </p>
            <div className="thesis-hero-image-wrap">
              <img
                src="https://framerusercontent.com/images/Ke9J7fdcwS3xhhp9DwcHEG9cHk.jpg"
                alt="Kroger grocery delivery"
                className="thesis-hero-image"
              />
            </div>
            <div className="thesis-hero-meta-row">
              <div className="thesis-background-col">
                <span className="thesis-section-label">BACKGROUND</span>
                <p className="thesis-summary">
                  Case study content from Kroger Product Design Internship. (Content from karenkodera.com/kroger is passcode protected — add your content here when available.)
                </p>
              </div>
              <div className="thesis-meta-box">
                <dl className="thesis-meta">
                  <div>
                    <dt>Responsibilities</dt>
                    <dd>Product Designer</dd>
                  </div>
                  <div>
                    <dt>Tools</dt>
                    <dd>Figma</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>2024</dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.section>

          <CaseStudySection
            id="background"
            label="BACKGROUND"
            heading="Kroger Product Design Internship"
            body="Placeholder — add content from your Kroger case study when you have access to karenkodera.com/kroger."
          />

          <CaseStudySection
            id="context"
            label="CONTEXT"
            heading="Project context"
            body="Add context about the Reducing Paper in Grocery Delivery project here."
          />

          <CaseStudySection
            id="problem"
            label="PROBLEM"
            heading="Problem statement"
            body="Add the problem you addressed in this project."
          />

          <CaseStudySection
            id="solution"
            label="SOLUTION"
            heading="Solution"
            body="Add your solution and key design decisions here."
          />

          <CaseStudySection
            id="conclusion"
            label="CONCLUSION"
            heading="Conclusion"
            body="Add learnings and outcomes from the Kroger internship project."
          />

          <footer className="thesis-case-nav">
            <Link to="/thesis" className="thesis-case-nav-link thesis-case-nav-prev" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span className="thesis-case-nav-arrow" aria-hidden>←</span>
              Previous case study
            </Link>
            <Link to="/dsg" className="thesis-case-nav-link thesis-case-nav-next" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              Next case study
              <span className="thesis-case-nav-arrow" aria-hidden>→</span>
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default Kroger;
