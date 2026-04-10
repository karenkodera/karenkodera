import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudySection, { ControlledVideoInDevice } from '../components/CaseStudySection';
import { get_case_study_for_path } from '../data/caseStudies';
import auditDiagramImg from '../assets/dsg/dsg-audit-diagram.png';
import stakeholderNeedsImg from '../assets/dsg/dsg-stakeholder-needs.png';
import './Thesis.css';

const DSG_NAV_SECTIONS = [
  { label: 'Context', id: 'context' },
  { label: 'Problem', id: 'problem' },
  { label: 'Understanding Business Needs', id: 'understanding-business-needs' },
  { label: 'Usability Testing', id: 'usability-testing' },
  { label: 'Heuristic Evaluation', id: 'heuristic-evaluation' },
  { label: 'Solution', id: 'solution' },
  { label: 'Learnings', id: 'conclusion' },
];

const SCROLL_SPY_TOP_OFFSET = 160;

const DicksSportingGoods = ({ setCursorVariant }) => {
  const [activeSectionId, setActiveSectionId] = useState(null);

  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sectionIds = DSG_NAV_SECTIONS.map((s) => s.id);
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
          {DSG_NAV_SECTIONS.map(({ label, id }) => (
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
            <h1 className="thesis-section-label thesis-hero-title">DICK&apos;s Sporting Goods</h1>
            <p className="thesis-tagline">
              Saving time for store associates through rethinking DICK&apos;s fulfillment audit process.
            </p>
            <div className="thesis-hero-image-wrap">
              <img
                src="https://framerusercontent.com/images/tQwaUHTuNBtjPuTDXDbT0SsxXf8.jpg"
                alt="DICK's Sporting Goods fulfillment audit"
                className="thesis-hero-image"
              />
            </div>
            <div className="thesis-hero-meta-row">
              <div className="thesis-background-col">
                <span className="thesis-section-label">BACKGROUND</span>
                <p className="thesis-summary">
                  Over the summer, I worked on the audit portion of Omnimobile, an app that handles preparing and delivering orders. It was an exciting time to work on this team since they were modernizing the whole application and I was handed responsibility over the audit screens.
                </p>
              </div>
              <div className="thesis-meta-box">
                <dl className="thesis-meta">
                  <div>
                    <dt>Team</dt>
                    <dd>Fulfillment innovation team</dd>
                  </div>
                  <div>
                    <dt>Tools</dt>
                    <dd>Figma, Miro</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>May 2023 – Nov 2023</dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.section>

          <CaseStudySection
            id="context"
            label="CONTEXT"
            heading="An audit is a process for checking order accuracy and location integrity of inline orders packed and stored in-store."
            body="Store associates scan each package and remove canceled/aged orders to keep holding areas accurate. BOPIS (Buy online pickup in store) and SDD (Same day delivery) orders are kept in holding areas together at the front of the store."
            images={[{ src: '/dsg/dsg-context-storage.png', alt: 'Store holding area with numbered bins for BOPIS and SDD orders', caption: 'Package Storage Room with Alphabetical Boxes', grayBox: true }]}
          />

          <CaseStudySection
            id="problem-intro"
            label=""
            heading="BOPIS and SDD audits are two separate processes that happen at different times and intervals, but have the same basic function: to check on order storage."
            body=""
          />

          <CaseStudySection
            id="problem"
            label="PROBLEM"
            heading="Duplicate audits for BOPIS and SDD create inefficiency and redundancy."
            body="I worked in-store alongside store associates and interviewed them to understand the audit process. I quickly realized that it was a repetitive process and combining the two into one would significantly save time for associates."
            images={[{ src: auditDiagramImg, alt: 'Current audit process (separate SDD and BOPIS flows) vs new proposed single audit process', noBorder: true }]}
          />

          <CaseStudySection
            id="understanding-business-needs"
            label="UNDERSTANDING BUSINESS NEEDS"
            heading="Talking to stakeholders revealed a set of requirements for the design based on their needs."
            body="I talked to leaders on eComm, Loss Prevention, Athlete Order Management and Store Ops teams. Stakeholders were excited since creating a quicker audit process would mean store associates would have time for other tasks such as interacting with consumers leading to higher profits for the company."
          />

          <CaseStudySection
            id="business-needs-goals"
            label=""
            heading=""
            body=""
            body2={
              <div className="dsg-business-needs-boxes">
                <div className="dsg-business-needs-box">
                  <span className="dsg-business-needs-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </span>
                  <span className="dsg-business-needs-text">Straight forward and fast audit process.</span>
                </div>
                <div className="dsg-business-needs-box">
                  <span className="dsg-business-needs-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                  </span>
                  <span className="dsg-business-needs-text">Ability to address canceled orders quickly.</span>
                </div>
                <div className="dsg-business-needs-box">
                  <span className="dsg-business-needs-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </span>
                  <span className="dsg-business-needs-text">Easy communication with stores.</span>
                </div>
              </div>
            }
          />

          <CaseStudySection
            id="usability-testing"
            label="USABILITY TESTING"
            heading="I designed my first wireframes based off these goals and then traveled with my team to conduct usability testing in stores."
            body="I went to Atlanta, Columbus and Pittsburgh, hitting 3–4 stores in each location. I learned that the current process was outdated. I noticed different workarounds being used at stores that lead me to make changes to the design."
            quote="The audit process is complicated to explain to new store associates when they first join."
            quoteAttribution="Pittsburgh store associate"
          />

          <CaseStudySection
            id="heuristic-evaluation"
            label="HEURISTIC EVALUATION"
            heading="The current experience was missing important features that needed to be included in the new audit."
            body="I looked at the current experience and found some aspects of the design that were lacking. This helped me find a good starting point for the designs."
            afterBody={
              <>
                <ul className="thesis-list">
                  <li>The original screens were list-heavy. The lack of hierarchy makes it difficult to understand information on page.</li>
                  <li>Teammates don&apos;t know to set aside orders unless they look at their screen and see the notification.</li>
                  <li>Store associates have to manually submit audits requiring them to check their screens to see when orders have been audited.</li>
                </ul>
                <div className="thesis-figure thesis-figure-gray-box dsg-heuristic-before-box">
                  <div className="thesis-video-caption">
                    <span className="thesis-video-label">MOCKUPS OF OLD DESIGNS</span>
                  </div>
                  <div className="thesis-before-after-row">
                    <div className="thesis-video-device-wrap">
                      <div className="thesis-video-screen">
                        <img src="/dsg/binbybinbefore.png" alt="Bin by bin before state" className="thesis-video" />
                      </div>
                      <img className="thesis-device-frame" src="/dsg/zebra-device.png" alt="" role="presentation" />
                    </div>
                    <div className="thesis-video-device-wrap">
                      <div className="thesis-video-screen">
                        <img src="/dsg/clearauditorderbefore.png" alt="Clear audit order before state" className="thesis-video" />
                      </div>
                      <img className="thesis-device-frame" src="/dsg/zebra-device.png" alt="" role="presentation" />
                    </div>
                    <div className="thesis-video-device-wrap">
                      <div className="thesis-video-screen">
                        <img src="/dsg/feedbackbefore.png" alt="Feedback before state" className="thesis-video" />
                      </div>
                      <img className="thesis-device-frame" src="/dsg/zebra-device.png" alt="" role="presentation" />
                    </div>
                  </div>
                </div>
              </>
            }
          />

          <CaseStudySection
            id="solution"
            label="SOLUTION"
            heading="Introducing The Front of House Audit"
            body="An agnostic audit process that combines the BOPIS and SDD flows into one, saving time for store associates."
            images={[{ src: '/dsg/dsg-foh-solution.png', alt: 'Omnimobile app showing Order Search, BOPIS Performance metrics, and To Do with Front of House Audit', noBorder: true, grayBox: true, caption: 'Front of House Audit' }]}
          />

          <CaseStudySection
            id="change-1"
            label=""
            heading="Bin by bin scanning"
            body="Orders to set aside are glued to the top of the list in yellow so it is easy to differentiate from regular orders."
            afterBody={
              <div className="dsg-change-after-full-width">
                <div className="thesis-change-video-box">
                  <ControlledVideoInDevice src="/dsg/binbybinafter.mp4" ariaLabel="Change 1 after video" />
                  <span className="thesis-figcaption dsg-change-video-subtitle">Bin by bin scanning flow</span>
                </div>
              </div>
            }
          />

          <CaseStudySection
            id="change-2"
            label=""
            heading="Clear audit order hierarchy"
            body="Orders to set aside are glued to the top of the list in yellow so it is easy to differentiate from regular orders."
            afterBody={
              <div className="dsg-change-after-full-width">
                <div className="thesis-change-video-box">
                  <ControlledVideoInDevice src="/dsg/clearauditorderafter.mp4" ariaLabel="Change 2 after video" />
                  <span className="thesis-figcaption dsg-change-video-subtitle">Clear audit order hierarchy flow</span>
                </div>
              </div>
            }
          />

          <CaseStudySection
            id="change-3"
            label=""
            heading="Feedback when tasks are completed"
            body="Automated process allows store associates to quickly move through audits, saving time."
            afterBody={
              <div className="dsg-change-after-full-width">
                <div className="thesis-change-video-box">
                  <ControlledVideoInDevice src="/dsg/feedbackafter.mp4" ariaLabel="Change 3 after video" />
                  <span className="thesis-figcaption dsg-change-video-subtitle">Feedback when tasks are completed flow</span>
                </div>
              </div>
            }
          />

          <CaseStudySection
            id="conclusion"
            label="LEARNINGS"
            heading="This was my first internship in UX design, working under other designers allowed me to pick up so much through observation."
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
                    Insights take time to uncover.
                  </p>
                  <p className="kroger-learning-text">
                    Important insights aren&apos;t always clear immediately. Often times, they require several rounds of
                    research and affinity mapping over and over again until patterns become clear.
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
                    User testing is essential.
                  </p>
                  <p className="kroger-learning-text">
                    What you thought will work the first time isn&apos;t always the best solution. Testing in person with
                    real people reveals a lot about customer behavior.
                  </p>
                </div>
              </div>
            }
          />

        </article>
      </div>

      <footer className="thesis-case-nav" aria-label="Other case studies">
        <div className="footer-content thesis-case-nav-inner">
          <Link to="/kroger" className="thesis-case-nav-link thesis-case-nav-prev" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="thesis-case-nav-content">
              <span className="thesis-case-nav-arrow" aria-hidden>←</span>
              <span className="thesis-case-nav-label">Previous case study</span>
            </div>
            {get_case_study_for_path('/kroger') && (
              <span className="thesis-case-nav-meta-subtitle">{get_case_study_for_path('/kroger').subtitle}</span>
            )}
          </Link>
          <Link to="/hsa-fsa" className="thesis-case-nav-link thesis-case-nav-next" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="thesis-case-nav-content">
              <span className="thesis-case-nav-label">Next case study</span>
              <span className="thesis-case-nav-arrow" aria-hidden>→</span>
            </div>
            {get_case_study_for_path('/hsa-fsa') && (
              <span className="thesis-case-nav-meta-subtitle">{get_case_study_for_path('/hsa-fsa').subtitle}</span>
            )}
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default DicksSportingGoods;
