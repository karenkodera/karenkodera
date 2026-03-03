import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudySection from '../components/CaseStudySection';
import { get_case_study_for_path } from '../data/caseStudies';
import './Thesis.css';

const HSA_FSA_NAV_SECTIONS = [
  { label: 'Context', id: 'context' },
  { label: 'Problem', id: 'problem' },
  { label: 'Design Requirements', id: 'design-requirements' },
  { label: 'Concept Development', id: 'concept-development' },
  { label: 'Checking Feasibility', id: 'checking-feasibility' },
  { label: 'Solution', id: 'solution' },
  { label: 'Feedback', id: 'usability-testing' },
  { label: 'Business Goals', id: 'business-goals' },
  { label: 'Conclusion', id: 'conclusion' },
];

const SCROLL_SPY_TOP_OFFSET = 160;

const HsaFsa = ({ setCursorVariant }) => {
  const [activeSectionId, setActiveSectionId] = useState(null);

  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sectionIds = HSA_FSA_NAV_SECTIONS.map((s) => s.id);
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
          {HSA_FSA_NAV_SECTIONS.map(({ label, id }) => (
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
              Unlocking HSA/FSA capabilities in Grocery Checkout.
            </p>
            <div className="thesis-hero-image-wrap">
              <img
                src="/hsafsa/cover.png"
                alt="Kroger checkout and payment selection with HSA/FSA card options on web and mobile"
                className="thesis-hero-image"
              />
            </div>
            <div className="thesis-hero-meta-row">
              <div className="thesis-background-col">
                <span className="thesis-section-label">SUMMARY</span>
                <p className="thesis-summary">
                  As a product designer on Kroger's Shop and Order team, I led the design of HSA/FSA payment integration within Wallet and Checkout, introducing a new card type and split-payment functionality to support health-related purchases.
                </p>
              </div>
              <div className="thesis-meta-box">
                <dl className="thesis-meta">
                  <div>
                    <dt>Team</dt>
                    <dd>Adria Griffin (PM), Angelene Langeslay (PD), Diana Mosley (PM)</dd>
                  </div>
                  <div>
                    <dt>Tools</dt>
                    <dd>Dovetail, Figma, Mural, Jira</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>May 2025 – Feb 2026</dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.section>

          <CaseStudySection
            id="context"
            label="CONTEXT"
            heading="What are HSA and FSA cards?"
            body="HSA and FSA cards are linked to tax-advantaged accounts that can be used to buy medications, personal health care products, vision and dental items, etc."
          />
          <div className="thesis-context-stat-box" aria-label="Statistic">
            <span className="thesis-context-stat-box-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
            </span>
            <p className="thesis-context-stat-box-text">37% of Americans report using either an HSA or FSA to pay for medical expenses.</p>
          </div>

          <CaseStudySection
            id="problem"
            label="PROBLEM"
            heading="Currently, HSA and FSA cards are not supported for online transactions."
            body="This limitation prevents customers from utilizing their benefit funds conveniently and contributes to a competitive disadvantage."
            images={[
              {
                src: '/hsafsa/comp-analysis.png',
                alt: 'Competitive analysis matrix comparing Amazon, CVS, Target, Walgreens, and Walmart across Benefit Overview, FSA, and HSA e-commerce experience',
                caption: 'Competitive analysis showed that Kroger was at a disadvantage without online HSA/FSA support, a gap that key competitors had already addressed.',
              },
            ]}
          />

          <CaseStudySection
            id="design-requirements"
            label="DESIGN REQUIREMENTS"
            heading="Competitive analysis helped determine a set of design and business requirements for the designs."
            listWithImages={[
              { src: '/hsafsa/design-req-1-product-search.png', alt: 'Product and search: Amazon FSA or HSA eligible filter and product eligibility label', text: 'Add filters and tags for product search optimization' },
              { src: '/hsafsa/design-req-2-eligible-amount.png', alt: 'Eligible dollar amount: Walgreens payment screen showing FSA eligible order amount', text: 'Show eligible FSA/HSA amount at checkout' },
              { src: '/hsafsa/design-req-3-split-payment.png', alt: 'Split payment: Target checkout tip to split payment with two cards', text: 'Enable split-payment options' },
              { src: '/hsafsa/design-req-4-managing-cards.png', alt: 'Managing cards: Wallet with Fidelity HSA debit card in cards and accounts', text: 'Ensure FSA/HSA card options are clearly visible' },
            ]}
          />

          <CaseStudySection
            id="concept-development"
            label="CONCEPT DEVELOPMENT"
            heading="Guided by these requirements, I moved into concept development, ideating and creating wireframes to align the team around a shared direction."
            images={[
              {
                src: '/hsafsa/concept-wireframes.png',
                alt: 'Checkout and payment wireframes: cart with FSA/HSA items, payment method selection, FSA/HSA card add, split payment, and order confirmation',
                whiteBg: true,
              },
            ]}
          />

          <CaseStudySection
            id="checking-feasibility"
            label="CHECKING FEASIBILITY"
            heading="I led the teams through a service blueprint to figure out what work needs to be done on back-end and front-end to make this feature happen."
            imageRight={{
              src: '/hsafsa/service-blueprint.png',
              alt: 'HSA/FSA service blueprint mapping cart to order with customer actions, frontstage, backstage, support process, and edge cases',
            }}
          />

          <CaseStudySection
            id="solution"
            label="SOLUTION"
            heading="Solution"
            body="Add your solution and key design decisions here."
          />

          <CaseStudySection
            id="usability-testing"
            label="FEEDBACK"
            heading="I ran usability testing to validate the wireframes and a workshop with designers to identify friction points before moving forward with designs."
            imageRight={{
              src: '/hsafsa/usability-testing.png',
              alt: 'Usability testing session: participant navigating cart and identifying HSA/FSA eligible items on mobile',
            }}
            imageInLeft={{
              src: '/hsafsa/usability-flow-map.png',
              alt: 'Design review flow map showing annotated user journey through cart, payment selection, FSA/HSA card add, and checkout',
            }}
          />

          <CaseStudySection
            id="business-goals"
            label="BUSINESS GOALS"
            heading="Business Goals"
            list={[
              'Improve customer satisfaction by reducing friction in purchasing eligible items',
              'Drive $71M in incremental sales over four years (eComm $21M)',
              'Leverage opportunity with 26.5% of Kroger households holding HSA/FSA cards (70% HSA, 29% FSA)',
            ]}
          />

          <CaseStudySection
            id="conclusion"
            label="CONCLUSION"
            heading="Conclusion"
            body="Add learnings and outcomes from the HSA/FSA checkout project here."
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
            <Link to="/kroger" className="thesis-case-nav-link thesis-case-nav-next" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <div className="thesis-case-nav-content">
                <span className="thesis-case-nav-label">Next case study</span>
                <span className="thesis-case-nav-arrow" aria-hidden>→</span>
              </div>
              {get_case_study_for_path('/kroger') && (
                <span className="thesis-case-nav-meta-subtitle">{get_case_study_for_path('/kroger').subtitle}</span>
              )}
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default HsaFsa;
