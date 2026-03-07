import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudySection from '../components/CaseStudySection';
import { get_case_study_for_path } from '../data/caseStudies';
import './Thesis.css';

const HSA_FSA_NAV_SECTIONS = [
  { label: 'Context', id: 'context' },
  { label: 'Problem', id: 'problem' },
  { label: 'Competitive Research', id: 'competitive-research' },
  { label: 'Concept Development', id: 'concept-development' },
  { label: 'Assumption 1', id: 'assumption-1' },
  { label: 'Assumption 2', id: 'assumption-2' },
  { label: 'Assumption 3', id: 'assumption-3' },
  { label: 'Assumption 4', id: 'assumption-4' },
  { label: 'Feedback', id: 'usability-testing' },
  { label: 'Solution', id: 'solution' },
  { label: 'Business Goals', id: 'business-goals' },
  { label: 'Learnings', id: 'learnings' },
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
                    <dd>Wallet and Checkout teams</dd>
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
            heading="What are HSA/FSA cards?"
            body="HSA/FSA cards are linked to tax-advantaged accounts that can be used to buy medications, personal health care products, vision and dental items, etc."
          />

          <CaseStudySection
            id="problem"
            label="PROBLEM"
            heading="Kroger does not have a place for HSA/FSA cards in the app so customers work around this by adding their cards into the credit card section."
            headingPlaceholder={{ text: 'Put a gif that is the old wallet with new section popping in' }}
            bodyHeading2
            body="This limitation prevents customers from utilizing their benefit funds conveniently."
            calloutBoxes={[
              'Customers cannot tell what items are eligible to buy with their cards.',
              'Customers do not know their total HSA/FSA amount at checkout.',
              'There is no split-payment functionality yet so customers have to place two separate orders to use their HSA/FSA funds.',
              'Customers have trouble quickly identifying their HSA/FSA cards during checkout.',
            ]}
          />

          <motion.section
            id="competitive-research"
            className="thesis-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
          >
            <span className="thesis-section-label">COMPETITIVE RESEARCH</span>
            <p className="thesis-section-body thesis-heading2">Research showed that this was a gap that key competitors had already addressed.</p>
            <div className="thesis-section-images thesis-competitive-images">
              <figure className="thesis-figure">
                <img src="/hsafsa/design-req-1-product-search.png" alt="Product and search: Amazon HSA or FSA eligible filter and product eligibility label" className="thesis-image" loading="lazy" />
                <figcaption className="thesis-figcaption">Amazon has filters and tags for product search optimization.</figcaption>
              </figure>
              <figure className="thesis-figure">
                <img src="/hsafsa/design-req-2-eligible-amount.png" alt="Eligible dollar amount: Walgreens payment screen showing FSA eligible order amount" className="thesis-image" loading="lazy" />
                <figcaption className="thesis-figcaption">Walgreens shows eligible HSA/FSA amount at checkout.</figcaption>
              </figure>
              <figure className="thesis-figure">
                <img src="/hsafsa/design-req-3-split-payment.png" alt="Split payment: Target checkout tip to split payment with two cards" className="thesis-image" loading="lazy" />
                <figcaption className="thesis-figcaption">Target enables split-payment options.</figcaption>
              </figure>
              <figure className="thesis-figure">
                <img src="/hsafsa/design-req-4-managing-cards.png" alt="Managing cards: Wallet with Fidelity HSA debit card in cards and accounts" className="thesis-image" loading="lazy" />
                <figcaption className="thesis-figcaption">Amazon clearly shows HSA/FSA card options in Wallet.</figcaption>
              </figure>
            </div>
          </motion.section>

          <CaseStudySection
            id="concept-development"
            label="CONCEPT DEVELOPMENT"
            heading="In order to bring HSA/FSA implementation to customers, I had to validate a series of assumptions."
            body="I led the teams through a service blueprint to figure out what work needs to be done on back-end and front-end to make this feature happen. We talked about risks, edge cases, and any support we would need on each step."
            images={[
              {
                src: '/hsafsa/service-blueprint.png',
                alt: 'HSA/FSA service blueprint mapping cart to order with customer actions, frontstage, backstage, support process, and edge cases',
                caption: 'Service blueprint',
                noBorder: true,
              },
            ]}
          />

          <CaseStudySection
            id="assumption-1"
            label="ASSUMPTION 1"
            heading="Split payments are possible."
            body="Customers can split payment in this order: SNAP EBT, HSA/FSA, Gift Card, Bank card. Designs must also reflect this order for customers to understand the hierarchy of payment methods."
            imagePlaceholder={{ text: 'Image placeholder' }}
          />
          <CaseStudySection
            id="assumption-2"
            label="ASSUMPTION 2"
            heading="Delivery fees can be covered but tips are not."
            body="We needed clear messaging so customers could clearly understand the amount being put on their HSA/FSA cards."
            imagePlaceholder={{ text: 'Image placeholder' }}
          />
          <CaseStudySection
            id="assumption-3"
            label="ASSUMPTION 3"
            heading="Substitutions will still be handled."
            body="We had to think through modifications too. Since there was a chance a substituted item may not be HSA/FSA eligible, customers must have backup bank cards in their order for other unexpected fees."
            imagePlaceholder={{ text: 'Image placeholder' }}
          />
          <CaseStudySection
            id="assumption-4"
            label="ASSUMPTION 4"
            heading="Customers who have already added HSA/FSA cards in the credit card section need their cards moved to the new section."
            body="There were edge cases designed that moved existing HSA/FSA cards saved into the credit section into the correct new section without confusing customers."
            imagePlaceholder={{ text: 'Image placeholder' }}
          />

          <motion.section
            id="usability-testing"
            className="thesis-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
          >
            <span className="thesis-section-label">FEEDBACK</span>
            <h2 className="thesis-section-heading">I ran usability testing to validate the designs and a workshop with designers to identify friction points before moving forward with designs.</h2>
            <div className="thesis-feedback-two-boxes">
              <div className="thesis-feedback-box thesis-feedback-design-box">
                <figure className="thesis-figure">
                  <img
                    src="/hsafsa/usability-flow-map.png"
                    alt="Design review flow map showing annotated user journey through cart, payment selection, HSA/FSA card add, and checkout"
                    className="thesis-image"
                    loading="lazy"
                  />
                </figure>
                <span className="thesis-feedback-box-subtitle">Design feedback</span>
              </div>
              <div className="thesis-feedback-box thesis-feedback-testing-box">
                <figure className="thesis-figure">
                  <img
                    src="/hsafsa/usability-testing.png"
                    alt="Usability testing session: participant navigating cart and identifying HSA/FSA eligible items on mobile"
                    className="thesis-image"
                    loading="lazy"
                  />
                </figure>
                <span className="thesis-feedback-box-subtitle">Usability testing</span>
              </div>
            </div>
          </motion.section>

          <CaseStudySection
            id="solution"
            label="SOLUTION"
            heading="Final flows"
            headingHeading2
            imagePlaceholder={{ text: 'Image placeholder' }}
          />

          <motion.section
            id="business-goals"
            className="thesis-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
          >
            <span className="thesis-section-label">BUSINESS GOALS</span>
            <h2 className="thesis-section-heading thesis-section-intro-heading">
              This feature was just introduced in 2026. The team is predicting that this feature will:
            </h2>
            <div className="thesis-prediction-boxes">
              <div className="thesis-context-stat-box" aria-label="Prediction">
                <span className="thesis-context-stat-box-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </span>
                <p className="thesis-context-stat-box-text">Improve customer satisfaction by reducing friction in purchasing eligible items</p>
              </div>
              <div className="thesis-context-stat-box" aria-label="Prediction">
                <span className="thesis-context-stat-box-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 20 7 16 11 20 15 14 19 18 23 12" />
                    <polyline points="21 14 23 12 21 10" />
                  </svg>
                </span>
                <p className="thesis-context-stat-box-text">Drive $71M in incremental sales over four years</p>
              </div>
              <div className="thesis-context-stat-box" aria-label="Prediction">
                <span className="thesis-context-stat-box-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </span>
                <p className="thesis-context-stat-box-text">Leverage opportunity with 26.5% of Kroger households holding HSA/FSA cards</p>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="learnings"
            className="thesis-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
          >
            <span className="thesis-section-label">LEARNINGS</span>
            <h2 className="thesis-section-heading thesis-section-intro-heading">
              As a full-time product designer, I was able to level up my skills in a real-world experience.
            </h2>
            <div className="thesis-prediction-boxes">
              <div className="thesis-context-stat-box" aria-label="Learning">
                <span className="thesis-context-stat-box-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <p className="thesis-context-stat-box-text">Collaborating closely with developers taught me how important clear, detailed design handoffs are for seamless implementation.</p>
              </div>
              <div className="thesis-context-stat-box" aria-label="Learning">
                <span className="thesis-context-stat-box-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </span>
                <p className="thesis-context-stat-box-text">Adding accessibility tags to my designs reinforced how critical it is to build products everyone can use.</p>
              </div>
              <div className="thesis-context-stat-box" aria-label="Learning">
                <span className="thesis-context-stat-box-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </span>
                <p className="thesis-context-stat-box-text">Thorough documentation, including edge cases and desk checks, made handoff smoother and implementation more reliable.</p>
              </div>
            </div>
          </motion.section>

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
