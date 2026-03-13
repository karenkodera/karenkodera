import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudySection from '../components/CaseStudySection';
import { get_case_study_for_path } from '../data/caseStudies';
import './Thesis.css';

const KROGER_IMAGES = {
  rideAlong: '/kroger/ride-along.png',
};

const KROGER_NAV_SECTIONS = [
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
      <div className="thesis-nav-wrap">
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
      </div>

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
              </div>
              <div className="thesis-meta-box">
                <dl className="thesis-meta">
                  <div>
                    <dt>Team</dt>
                    <dd>eComm POS team</dd>
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
            id="problem"
            label="PROBLEM"
            heading="Route summary sheets are used for recording information at every stop. Information that is already also being recorded in the app, wasting time and paper."
            body="I started my internship by spending a day riding alongside drivers. I noticed that drivers spent a lot of time writing redundant information at each stop on these papers; time that could be spent completing more deliveries."
            images={[
              {
                src: '/kroger/route-summary.png',
                alt: 'Route summary sheet with handwritten delivery stop details, times, and temperature readings',
                caption: 'Route summary sheets',
                fullWidth: true,
                grayBox: true,
              },
            ]}
          />

          <CaseStudySection
            id="problem-sheets"
            label=""
            heading="However, these sheets are important when drivers lose wifi and cannot access Fresco."
            body="I analyzed 100+ survey responses and found that:"
            body2={
              <>
                <div className="kroger-problem-sheets-stats-row">
                  <div className="kroger-problem-sheets-stat-box">
                    <p className="kroger-problem-sheets-stat-text">
                      <span className="kroger-problem-sheets-stat-number">65%</span> of drivers lose cell service at least one time during the week.
                    </p>
                  </div>
                  <div className="kroger-problem-sheets-stat-box">
                    <p className="kroger-problem-sheets-stat-text">
                      <span className="kroger-problem-sheets-stat-number">51%</span> of drivers rely on route summary sheets when they lose service.
                    </p>
                  </div>
                </div>
                <h2 className="thesis-section-heading thesis-heading2 kroger-problem-sheets-hmw">
                  How might we reduce paper usage in the delivery process while ensuring drivers have the information they need in the app when they lose cell service?
                </h2>
              </>
            }
            images={[
              {
                src: KROGER_IMAGES.rideAlong,
                alt: 'Ride-along day with Kroger delivery drivers',
                caption: 'Ride-along Day with Kroger Delivery Drivers',
                grayBox: true,
              },
            ]}
          />

          <CaseStudySection
            id="solution"
            label="SOLUTION"
            heading="Introducing Offline Mode: A feature that provides drivers with all information needed to complete deliveries without cell service."
            body=""
            body2={
              <>
                <figure className="thesis-figure thesis-figure-gray-box">
                  <img
                    src="/kroger/DxP3N89EhUDnq0ZRcXxPN2t8hvo.webp"
                    alt="Offline Mode toast: You are in Offline Mode. Route summary information is available while you are offline."
                    className="thesis-image"
                    loading="lazy"
                  />
                  <figcaption className="thesis-figcaption">
                    Toast showing Offline Mode status and what information is available while drivers are offline.
                  </figcaption>
                </figure>
                <div className="kroger-solution-details">
                  <div className="kroger-solution-item">
                    <h2 className="thesis-section-heading thesis-heading2 kroger-solution-title">
                      Route Summary Sheet Information
                    </h2>
                    <p className="kroger-solution-text">
                      Fresco downloads all information from route summary sheets before route begins so it is available
                      when drivers lose service. Drivers can remove orders as completed to clear up space in the device
                      memory.
                    </p>
                  </div>
                  <div className="kroger-solution-item">
                    <h2 className="thesis-section-heading thesis-heading2 kroger-solution-title">
                      Offline Routing
                    </h2>
                    <p className="kroger-solution-text">
                      Currently, drivers use their personal devices to route themselves when they lose service on their
                      Zebra. Offline Mode allows drivers to see the route on the map even without service.
                    </p>
                  </div>
                </div>
              </>
            }
          />

          <CaseStudySection
            id="conclusion"
            label="LEARNINGS"
            heading="What I learned"
            headingMedia={
              <div className="kroger-learnings">
                <div className="kroger-learning-box">
                  <p className="kroger-learning-title">
                    <span className="kroger-learning-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    Feasibility first.
                  </p>
                  <p className="kroger-learning-text">
                    Offline Mode was presented to stakeholders at my final presentation. While it has gathered lots of
                    interest, there is a lot of requirements that must be completed before this can be feasible. While
                    it is in progress, it may take many more months for Offline Mode to completely come to fruition.
                  </p>
                </div>
                <div className="kroger-learning-box">
                  <p className="kroger-learning-title">
                    <span className="kroger-learning-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    The double diamond method is not linear.
                  </p>
                  <p className="kroger-learning-text">
                    Stepping back to conduct more research and gather more information is ok! A lot of the time, new
                    information being uncovered meant having to go back and research further before moving forward.
                  </p>
                </div>
              </div>
            }
          />

          <footer className="thesis-case-nav">
            <Link to="/thesis" className="thesis-case-nav-link thesis-case-nav-prev" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <div className="thesis-case-nav-content">
                <span className="thesis-case-nav-arrow" aria-hidden>←</span>
                <span className="thesis-case-nav-label">Previous case study</span>
              </div>
              {get_case_study_for_path('/thesis') && (
                <span className="thesis-case-nav-meta-subtitle">{get_case_study_for_path('/thesis').subtitle}</span>
              )}
            </Link>
            <Link to="/dsg" className="thesis-case-nav-link thesis-case-nav-next" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <div className="thesis-case-nav-content">
                <span className="thesis-case-nav-label">Next case study</span>
                <span className="thesis-case-nav-arrow" aria-hidden>→</span>
              </div>
              {get_case_study_for_path('/dsg') && (
                <span className="thesis-case-nav-meta-subtitle">{get_case_study_for_path('/dsg').subtitle}</span>
              )}
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default Kroger;
