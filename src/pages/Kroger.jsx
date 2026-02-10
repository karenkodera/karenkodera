import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudySection from '../components/CaseStudySection';
import './Thesis.css';

const KROGER_NAV_SECTIONS = [
  { label: 'Learning About the Space', id: 'learning-about-the-space' },
  { label: 'Field Research', id: 'field-research' },
  { label: 'Problem Finding Workshop', id: 'problem-finding-workshop' },
  { label: 'Problem', id: 'problem' },
  { label: 'Survey Findings', id: 'survey-findings' },
  { label: 'Ideation Workshop', id: 'ideation-workshop' },
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
              Reducing paper in grocery delivery through digitizing driver experience with creation of Offline Mode.
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
                <span className="thesis-section-label">SUMMARY</span>
                <p className="thesis-summary">
                  Over the summer, I worked on Fresco, a driver-facing app that handles payments during deliveries. Offline mode was created to combat paper usage on trucks. It contains information needed in order to complete orders when drivers lose cell service.
                </p>
                <p className="thesis-summary">
                  Interns at Kroger are given a lot of ownership over their projects, and so I was tasked with everything from finding a problem space to leading research to running design sprints and critiques.
                </p>
              </div>
              <div className="thesis-meta-box">
                <dl className="thesis-meta">
                  <div>
                    <dt>Responsibilities</dt>
                    <dd>Product Designer</dd>
                    <dd className="meta-sub">UX Research, Workshop Facilitation, Wireframing, Prototyping</dd>
                  </div>
                  <div>
                    <dt>Tools</dt>
                    <dd>Figma, Mural, Qualtrics</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>Jun 2024 – Sept 2024</dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.section>

          <CaseStudySection
            id="learning-about-the-space"
            label="LEARNING ABOUT THE SPACE"
            heading="I started discovery by conducting research through…"
          />

          <CaseStudySection
            id="field-research"
            label="FIELD RESEARCH"
            heading="I rode-along with drivers to observe as they completed orders."
            body="I watched them complete their orders throughout the day, taking notes on what I noticed and asking lots of questions. I took these ideas back and deciphered patterns through affinity mapping. Then, arranged my insights into 3 problem spaces that I could potentially delve into."
            list={[
              'HMW make destaging clearer so orders don’t get forgotten',
              'HMW make destaging customizable for driver preferences?',
              'HMW reduce paper usage in the delivery process?',
            ]}
          />

          <CaseStudySection
            id="problem-finding-workshop"
            label="PROBLEM FINDING WORKSHOP"
            heading="I narrowed down by facilitating a problem-finding workshop."
            body="I led the team including product managers and engineers through a series of activities to narrow down on a feasible and impactful problem. During this meeting, the team expressed interest in pursuing idea 3: Reducing paper usage in the delivery process. They felt this project was both important and feasible for a 10 week project."
          />

          <CaseStudySection
            id="problem"
            label="PROBLEM"
            heading="Route summary sheets are used for recording information at every stop, wasting time and paper. However, these sheets are important when drivers lose wifi and cannot access Fresco."
            body="I noticed that drivers spent a lot of time writing redundant information at each stop on these papers; time that could be spent completing more deliveries."
          />

          <CaseStudySection
            id="survey-findings"
            label="SURVEY FINDINGS"
            heading="I conducted a survey to all US drivers which further proved this was a problem to solve."
            body="I analyzed 100+ survey responses and created a readable summary for my team with my insights. I learned…"
          />

          <CaseStudySection
            id="ideation-workshop"
            label="IDEATION WORKSHOP"
            heading="Next, I facilitated a workshop where I lead the Fresco team in activities to frame the problem and spur solutioning."
            body="I lead the team through Abstraction Laddering and a Crazy Eights exercise that lead to 3 main ideas. From there, I went forward with the idea that I felt would be most useful to the drivers."
            list={[
              'Camera capture fridge temp to minimize time spent writing it',
              'Start timer at arrival to reduce time spent writing',
              'Offline Mode reduces need for paper at all',
            ]}
          />

          <CaseStudySection
            id="solution"
            label="SOLUTION"
            heading="INTRODUCING OFFLINE MODE"
            body="A version of Fresco that provides drivers with all information needed to complete deliveries without cell service."
            list={[
              'Route Summary Sheet Information — Fresco downloads all information from route summary sheets before route begins so it is available when drivers lose service. Drivers can remove orders as completed to clear up space in the device memory.',
              'Offline Routing — Currently, drivers use their personal devices to route themselves when they lose service on their Zebra. Offline Mode allows drivers to see the route on the map even without service.',
            ]}
          />

          <CaseStudySection
            id="conclusion"
            label="CONCLUSION"
            heading="Offline Mode is in production!"
            body="Offline Mode was presented to stakeholders at my final presentation. It has been incorporated into the goals for this upcoming quarter. While there is much testing and designing still to be done, this is an exciting step in the next direction!"
            body2="The main learning from my project was that the double diamond method is not linear. Stepping back to conduct more research and gather more information is ok! I never realized how much goes on behind the scenes of an everyday grocery trip. I will never look at a quick run to Kroger the same."
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
