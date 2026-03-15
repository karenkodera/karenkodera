import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudySection from '../components/CaseStudySection';
import { get_case_study_for_path } from '../data/caseStudies';
import './Thesis.css';

function VideoInZebraDevice({ src, ariaLabel }) {
  const videoRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.currentTime = 0;
          el.play().catch(() => {});
          setIsPaused(false);
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleEnded = () => {
    const el = videoRef.current;
    if (!el) return;
    setTimeout(() => {
      el.currentTime = 0;
      el.play().catch(() => {});
      setIsPaused(false);
    }, 1000);
  };

  const handleRewind = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
    setIsPaused(false);
  };

  const handlePausePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setIsPaused(false);
    } else {
      el.pause();
      setIsPaused(true);
    }
  };

  return (
    <div
      className="kroger-zebra-video-wrap"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {showControls && (
        <div className="thesis-iphone-video-controls" aria-hidden="true">
          <button
            type="button"
            className="thesis-iphone-video-control-btn"
            onClick={handlePausePlay}
            aria-label={isPaused ? 'Play video' : 'Pause video'}
          >
            {isPaused ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="thesis-iphone-video-control-btn"
            onClick={handleRewind}
            aria-label="Restart video"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      )}
      <div className="thesis-video-device-wrap">
        <div className="thesis-video-screen">
          <video
            ref={videoRef}
            src={src}
            className="thesis-video"
            playsInline
            muted
            loop={false}
            aria-label={ariaLabel}
            onEnded={handleEnded}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <img className="thesis-device-frame" src="/dsg/zebra-device.png" alt="" role="presentation" />
      </div>
    </div>
  );
}

const KROGER_IMAGES = {
  rideAlong: '/kroger/ride-along.png',
};

const KROGER_NAV_SECTIONS = [
  { label: 'Problem', id: 'problem' },
  { label: 'Solution', id: 'solution' },
  { label: 'Learnings', id: 'conclusion' },
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
                <figure className="thesis-figure thesis-figure-gray-box kroger-solution-toast-figure">
                  <img
                    src="/kroger/DxP3N89EhUDnq0ZRcXxPN2t8hvo.webp"
                    alt="Offline Mode toast: You are in Offline Mode. Route summary information is available while you are offline."
                    className="thesis-image"
                    loading="lazy"
                  />
                  <figcaption className="thesis-figcaption">
                    Offline mode toast messaging
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
                    <figure className="thesis-figure thesis-figure-gray-box kroger-route-summary-figure">
                      <VideoInZebraDevice
                        src="/kroger/1p8AYsmlzX6JBkMlPC2IXtQMU.mp4"
                        ariaLabel="Route summary sheet experience demo video"
                      />
                      <figcaption className="thesis-figcaption">
                        Route summary sheet flow
                      </figcaption>
                    </figure>
                  </div>
                  <div className="kroger-solution-item">
                    <h2 className="thesis-section-heading thesis-heading2 kroger-solution-title">
                      Offline Routing
                    </h2>
                    <p className="kroger-solution-text">
                      Currently, drivers use their personal devices to route themselves when they lose service on their
                      Zebra. Offline Mode allows drivers to see the route on the map even without service.
                    </p>
                    <figure className="thesis-figure thesis-figure-gray-box kroger-offline-routing-figure">
                      <VideoInZebraDevice
                        src="/kroger/offline routing.mp4"
                        ariaLabel="Offline routing experience demo video"
                      />
                      <figcaption className="thesis-figcaption">
                        Offline routing flow
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </>
            }
          />

          <CaseStudySection
            id="conclusion"
            label="LEARNINGS"
            heading="In the few months, I spent on this team, I learned a lot about the way design works in a corporate environment."
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
