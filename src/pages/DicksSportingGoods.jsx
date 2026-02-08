import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Thesis.css';

const DSG_NAV_SECTIONS = [
  { label: 'Context', id: 'context' },
  { label: 'Problem', id: 'problem' },
  { label: 'Understanding Business Needs', id: 'understanding-business-needs' },
  { label: 'Usability Testing', id: 'usability-testing' },
  { label: 'Solution', id: 'solution' },
  { label: 'Change #1', id: 'change-1' },
  { label: 'Change #2', id: 'change-2' },
  { label: 'Change #3', id: 'change-3' },
  { label: 'Conclusion', id: 'conclusion' },
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
      <nav className="thesis-nav thesis-nav-dsg" aria-label="Case study sections">
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
                    <dt>Responsibilities</dt>
                    <dd>Product Designer</dd>
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

          <DsgSection
            id="context"
            label="CONTEXT"
            heading="An audit is a process for checking order accuracy and location integrity of inline orders packed and stored in-store."
            body="Store associates scan each package and remove canceled/aged orders to keep holding areas accurate. BOPIS (Buy online pickup in store) and SDD (Same day delivery) orders are kept in holding areas together at the front of the store."
            images={[{ src: '/dsg/dsg-context-storage.png', alt: 'Store holding area with numbered bins for BOPIS and SDD orders' }]}
            layout="contextWithImage"
          />

          <DsgSection
            id="problem"
            label="PROBLEM"
            heading="BOPIS and SDD audits are two separate processes that happen at different times and intervals, but have the same basic function: to check on order storage. There is opportunity to make the structure more efficient and less redundant."
            body="First, I worked in-store alongside store associates and interviewed them to understand the audit process. I quickly realized that it was a repetitive process and combining the two into one would significantly save time for associates."
            images={[{ src: '/dsg/dsg-audit-diagram.png', alt: 'Current audit process (separate SDD and BOPIS flows) vs new proposed single audit process', whiteBg: true }]}
          />

          <DsgSection
            id="understanding-business-needs"
            label="UNDERSTANDING BUSINESS NEEDS"
            heading="I interviewed stakeholders to understand their expectations in audit."
            body="I talked to leaders on eComm, Loss Prevention, Athlete Order Management and Store Ops teams. Stakeholders were excited since creating a quicker audit process would mean store associates would have time for other tasks such as interacting with consumers leading to higher profits for the company."
            images={[{ src: '/dsg/dsg-stakeholder-needs.png', alt: 'Stakeholder needs: straightforward fast audit, address canceled orders quickly, easy communication with stores', whiteBg: true }]}
          />

          <DsgSection
            id="usability-testing"
            label="USABILITY TESTING"
            heading="I designed my first wireframes based off these goals and then traveled with my team to conduct usability testing in stores."
            body="I went to Atlanta, Columbus and Pittsburgh, hitting 3–4 stores in each location. I learned that the current process was outdated. I noticed different workarounds being used at stores that lead me to make changes to the design. The designs were primal and there was opportunity to show hierarchy and give feedback to store associates to make the app easier for new store associates."
            quote="The audit process is complicated to explain to new store associates when they first join."
            quoteAttribution="Pittsburgh store associate"
          />

          <DsgSection
            id="solution"
            label="SOLUTION"
            heading="INTRODUCING The Front of House Audit"
            body="An agnostic audit process that combines the BOPIS and SDD flows into one, saving time for store associates."
          />

          <DsgSection
            id="change-1"
            label="CHANGE #1"
            heading="BIN BY BIN SCANNING"
            body="BEFORE: The original screens were list-heavy. The lack of hierarchy makes it difficult to understand information on page. AFTER: The orders have been broken down location by location to decrease lost orders. BEFORE: Store associates don't know to set aside orders unless they look at their screen and see the notification. AFTER: Orders to set aside are glued to the top of the list in yellow so it is easy to differentiate from regular orders."
          />

          <DsgSection
            id="change-2"
            label="CHANGE #2"
            heading="CLEAR AUDIT ORDER HIERARCHY"
            body="The orders have been restructured to show clear hierarchy and make the audit process easier to follow."
          />

          <DsgSection
            id="change-3"
            label="CHANGE #3"
            heading="FEEDBACK WHEN TASKS ARE COMPLETED"
            body="BEFORE: Store associates have to manually submit audits requiring them to check their screens to see when orders have been audited. AFTER: Automated process allows store associates to quickly move through audits, saving time."
          />

          <DsgSection
            id="conclusion"
            label="CONCLUSION"
            heading="Conclusion"
            body="Reimagining the audit process as one unified flow helped store associates save time and reduced redundancy for the business."
          />

          <motion.section
            className="thesis-footer-cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="thesis-thanks">Thanks for visiting!</p>
            <p className="thesis-email">
              <a href="mailto:karen@kodera.us" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>karen@kodera.us</a>
            </p>
            <div className="thesis-other-cases">
              <Link to="/" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Work</Link>
              <span className="thesis-cta-sep">·</span>
              <Link to="/thesis" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Thesis</Link>
              <span className="thesis-cta-sep">·</span>
              <Link to="/play" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Play</Link>
              <span className="thesis-cta-sep">·</span>
              <Link to="/about" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>About</Link>
            </div>
            <p className="thesis-more-cases">
              <Link to="/thesis" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Thesis Case Study</Link>
              {' · '}
              <Link to="/" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Back to Work</Link>
            </p>
          </motion.section>
        </article>
      </div>
    </div>
  );
};

function DsgSection({
  id,
  label,
  heading,
  body,
  images,
  quote,
  quoteAttribution,
  layout,
}) {
  const isContextWithImage = layout === 'contextWithImage' && images && images.length > 0;

  return (
    <motion.section
      id={id}
      className={`thesis-section${isContextWithImage ? ' thesis-section-context-with-image' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
    >
      <span className="thesis-section-label">{label}</span>
      <h2 className="thesis-section-heading">{heading}</h2>
      {body && <p className="thesis-section-body">{body}</p>}
      {images && images.length > 0 && (
        <div className="thesis-section-images">
          {images.map((img, i) => (
            <figure key={i} className={`thesis-figure${img.whiteBg ? ' thesis-figure-white-bg' : ''}`}>
              <img src={img.src} alt={img.alt} className="thesis-image" loading="lazy" />
              {img.caption && <figcaption className="thesis-figcaption">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
      {quote && (
        <blockquote className="thesis-quote">
          &ldquo;{quote}&rdquo;
          {quoteAttribution && <cite>— {quoteAttribution}</cite>}
        </blockquote>
      )}
    </motion.section>
  );
}

export default DicksSportingGoods;
