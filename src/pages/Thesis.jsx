import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CaseStudySection from '../components/CaseStudySection';
import { get_case_study_for_path } from '../data/caseStudies';
import './Thesis.css';

// Local images saved from https://karenkodera.com/thesis (same order as on the page)
const THESIS_IMAGES = {
  hero: '/thesis/thesis-hero.png',
  problem: '/thesis/thesis-1.png',
  garmentsLandfill: '/thesis/thesis-garments-landfill.png',
  interviewing: '/thesis/thesis-interviewing.png',
  wilson: '/thesis/thesis-wilson.png',
  hm: '/thesis/thesis-hm.png',
  venn: '/thesis/thesis-venn.png',
  competitiveLandscape: '/thesis/thesis-competitive-landscape.png',
  solution: '/thesis/thesis-5.jpg',
  equation: '/thesis/thesis-equation.png',
  gatherFeedback: '/thesis/thesis-gather-feedback.png',
  ordersPlaced: '/thesis/thesis-orders-placed.png',
  garmentProduction: '/thesis/thesis-garment-production.png',
  game: '/thesis/thesis-game.png',
  platformHome: '/thesis/thesis-platform-home.png',
  brandDashboard: '/thesis/thesis-brand-dashboard.png',
  existingBrand: '/thesis/thesis-10.png',
  whiteLabelModel: '/thesis/thesis-white-label-model.png',
  traditionalModel: '/thesis/thesis-traditional-model.png',
  preOrderModel: '/thesis/thesis-pre-order-model.png',
  finalOutcome: '/thesis/thesis-28.png',
  brandsIcon: '/thesis/brands.svg',
  consumersIcon: '/thesis/consumer.svg',
};

// Section labels for left nav (same order as on page)
const THESIS_NAV_SECTIONS = [
  { label: 'Problem', id: 'problem' },
  { label: 'User', id: 'user' },
  { label: 'Research Methods', id: 'research-methods' },
  { label: 'Insight', id: 'insight' },
  { label: 'Question to Answer', id: 'question-to-answer' },
  { label: 'Competitive Analysis', id: 'competitive-analysis' },
  { label: 'Problem Solving', id: 'problem-solving' },
  { label: 'Solution', id: 'solution' },
  { label: 'Existing Brand Integration', id: 'existing-brand-integration' },
  { label: 'User Testing & Research', id: 'user-testing-and-returning-to-research' },
  { label: 'Impact', id: 'impact' },
  { label: 'Conclusion', id: 'final-outcome' },
];

const SCROLL_SPY_TOP_OFFSET = 160;

const Thesis = ({ setCursorVariant }) => {
  const [activeSectionId, setActiveSectionId] = useState(null);

  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sectionIds = THESIS_NAV_SECTIONS.map((s) => s.id);

    const updateActiveSection = () => {
      let bestId = null;
      let bestTop = -Infinity;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= SCROLL_SPY_TOP_OFFSET && top > bestTop) {
          bestTop = top;
          bestId = id;
        }
      }
      setActiveSectionId(bestId ?? sectionIds[0]);
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
          <Link
            to="/"
            className="thesis-nav-back"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="thesis-nav-back-arrow" aria-hidden>←</span>
            back to home
          </Link>
          <ul className="thesis-nav-list">
          {THESIS_NAV_SECTIONS.map(({ label, id }) => (
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
            <h1 className="thesis-section-label thesis-hero-title">Bridg</h1>
            <p className="thesis-tagline">
              A feedback service to help retail brands reduce overproduction.
            </p>
            <div className="thesis-hero-image-wrap">
              <img
                src={THESIS_IMAGES.hero}
                alt="Bridg — minimizing overproduction in fashion retail"
                className="thesis-hero-image"
              />
            </div>
            <div className="thesis-hero-meta-row">
              <div className="thesis-background-col">
                <span className="thesis-section-label">BACKGROUND</span>
                <p className="thesis-summary">
                  Bridg transforms customer feedback into smarter production decisions. Through interactive mini games, Bridg helps brands produce only what customers want, minimizing unsold inventory, and keeping excess clothing out of landfills.
                </p>
              </div>
              <div className="thesis-meta-box">
                <dl className="thesis-meta">
                  <div>
                    <dt>Responsibilities</dt>
                    <dd>Design Researcher, Product and Service Designer</dd>
                  </div>
                  <div>
                    <dt>Mentors</dt>
                    <dd>Jim Wicks, Amy Schwartz, Susan Curtis</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>Sept 2024 – Mar 2025</dd>
                  </div>
                  <div>
                    <dt>Tools</dt>
                    <dd>Figma</dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.section>

          <CaseStudySection
            id="problem"
            label="PROBLEM"
            heading="The fashion industry is in the top 5 most polluting industries in the world..."
            body="Fast fashion items are created out of low quality materials called synthetic fibers. Not only do these pieces fall apart after 1–2 uses, synthetic fibers contain tiny pieces of plastic. When these fast fashion pieces are put through the wash, they release plastic into the water, which end up in our oceans."
            afterBody={
              <div className="thesis-problem-stat-box" aria-label="20% of garments go unsold and end up in landfill">
                <p className="thesis-problem-stat-box-text">20% of garments go unsold and end up in landfill</p>
                <div className="thesis-problem-stat-box-icon" aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M0 9 L6 9 L8 6.5 Q12 5 16 6.5 L18 9 L24 9 L24 24 L0 24 Z" />
                  </svg>
                </div>
              </div>
            }
            images={[
              { src: THESIS_IMAGES.garmentsLandfill, alt: 'Garments degrading to landfill', caption: '', flat: true }
            ]}
          />

          <CaseStudySection
            id="user"
            label="USER"
          heading="The main offender of fashion trends is the avid female shopper aged 18–35."
          body="As proven by a survey by Vogue Business, these people are early in their career, they aren't making a lot of money yet so they want to spend less to stay on trend."
        />

        <CaseStudySection
          id="research-methods"
          label="RESEARCH METHODS"
          heading="I conducted primary and secondary research to understand my user."
          listWithImages={[
            { src: THESIS_IMAGES.interviewing, alt: 'Interviewing and testing users', text: 'interviewed/tested 30+ users' },
            { src: THESIS_IMAGES.wilson, alt: 'Interviewing experts in retail at Wilson', text: 'interviewed experts in retail' },
            { src: THESIS_IMAGES.hm, alt: 'Worked at H&M as a sales advisor', text: 'worked at H&M as a sales advisor' },
          ]}
          listWithImagesTitleLeft
        />

        <CaseStudySection
          id="insight"
          label="INSIGHT"
          heading="Style First, Sustainability Second."
          body="While many consumers feel guilt over shopping fast fashion, these feelings rarely translate into action."
          quote="I think about sustainability, but then I think, eh it's cheaper"
        />

        <CaseStudySection
          id="question-to-answer"
          label="QUESTION TO ANSWER"
          heading={<><em>HMW</em> encourage mindful clothing consumption while keeping in mind the average consumer's focus on trends and budget?</>}
          images={[{ src: THESIS_IMAGES.venn, alt: 'Sustainable Venn diagram', compact: true }]}
        />

        <CaseStudySection
          id="competitive-analysis"
          label="COMPETITIVE ANALYSIS"
          heading="Most successful competitors focus on rewear, but that model fails for fast fashion that isn't made to last."
          body="Ideally, what we want is a circular fashion economy, items are recycled so that we don't need to keep making new products. Competitors that are successful at hitting people's needs for affordability, trendiness and sustainability focus on getting the most wears out of items before being sent to landfill. But, this doesn't work for fast fashion items that are so low quality that they fall apart and can't be resold."
          images={[{ src: THESIS_IMAGES.competitiveLandscape, alt: 'Competitive landscape: sustainable, affordable, and fashionable', wide: true }]}
        />

        <CaseStudySection
          id="problem-solving"
          label="PROBLEM SOLVING"
          heading="The only way to stop the flow of items into landfill is to stop the flow of product production. Therefore, the solution has to target brands not consumers."
          quote="Consumers have been trained to think you can get anything at all times. Responsibility ultimately falls to the brands to create mindfully rather than to the consumer to consume less."
          quoteAttribution="Amanda McFee, Director and Fashion Designer of Evoshield at Wilson Sporting Goods"
        />

        <CaseStudySection
          id="solution"
          label="SOLUTION"
          heading="INTRODUCING BRIDG: A three part system for gathering feedback, placing orders and factory production."
          body="This gamified feedback service helps brands produce only what is desired by integrating a series of games directly into their websites. By understanding consumer demand, brands can cut down on unsold inventory and save money on production, leading to less clothing being made and sent to landfill."
          equationImage={{ src: THESIS_IMAGES.equation, alt: 'Gather feedback, orders placed, garment production equals less waste to landfill' }}
          listWithIcons={[
            { iconSrc: THESIS_IMAGES.gatherFeedback, iconAlt: 'Gather feedback', title: 'Interactive Game', text: 'An engaging tool for customers to vote on their favorite designs, giving brands real-time insights into consumer preferences.' },
            { iconSrc: THESIS_IMAGES.ordersPlaced, iconAlt: 'Orders placed as needed', title: 'Pre-Order Platform', text: 'A system where customers can purchase items won in games before production begins, creating a sense of exclusivity.' },
            { iconSrc: THESIS_IMAGES.garmentProduction, iconAlt: 'Garment production', title: 'Brand-Side Dashboard', text: 'A platform for businesses to see the analytics behind customer-facing games and make smart production decisions.' },
          ]}
          images={[
            { src: THESIS_IMAGES.game, alt: 'Interactive game for gathering feedback' },
            { src: THESIS_IMAGES.platformHome, alt: 'Pre-order platform' },
            { src: THESIS_IMAGES.brandDashboard, alt: 'Brand-side dashboard' },
          ]}
        />

        <CaseStudySection
          id="existing-brand-integration"
          label="EXISTING BRAND INTEGRATION"
          heading="Bridg integrates seamlessly into brand websites through using a white label model."
          body="White label branding allows Bridg to integrate into different retail brands' ecosystems without disrupting their existing identity which makes adoption easier. It also increases scalability, since it can be adapted across multiple brands without needing to reinvent the core experience each time."
          images={[{ src: THESIS_IMAGES.whiteLabelModel, alt: 'White label model: Lululemon, Ralph Lauren, and Urban Outfitters brand integrations', whiteBg: true }]}
        />

        <CaseStudySection
          id="user-testing-and-returning-to-research"
          label="USER TESTING AND RETURNING TO RESEARCH"
          heading="A pre-order model can work if customers are given incentive."
          body="Since Bridg sells with pre-order, this means that users must wait a little longer for their items to get them."
          comparisonPairs={[
            { src: THESIS_IMAGES.traditionalModel, alt: 'Traditional model delivery timeline', text: 'Traditional model: Items arrive at door in around 2–4 weeks.' },
            { src: THESIS_IMAGES.preOrderModel, alt: 'Pre-order model delivery timeline', text: 'Bridg pre-order model: Items arrive at door in around 4–6 weeks.' },
          ]}
          body2={<>During user testing, a question that came up often was: <strong>In a world of instant gratification, are people really willing to wait for their items?</strong> I surveyed 24 young adult shoppers and found that they were! If given incentive.</>}
          list={[
            'items are exclusive',
            'items are made with consumer input',
            'items are cheaper',
            'items are more environmentally friendly',
          ]}
          listTitle="Bridg's Incentives"
        />

        <CaseStudySection
          id="impact"
          label="IMPACT"
          heading="Both brands and consumers benefit, and as a result, the environment as well."
          twoColumns={[
            { title: 'Brands', iconSrc: THESIS_IMAGES.brandsIcon, iconAlt: 'Brands', items: ['reduces unsold inventory', 'saves money on production', 'come off as eco-conscious to public eye'] },
            { title: 'Consumers', iconSrc: THESIS_IMAGES.consumersIcon, iconAlt: 'Consumers', items: ['receives early access', 'personal connection to brand', 'feels sustainable'] },
          ]}
        />

        <CaseStudySection
          id="final-outcome"
          label="CONCLUSION"
          heading="Learning to own the process!"
          body="Tackling this project solo was my biggest design challenge yet. Over the course of six months, I learned how to manage my time, stay accountable, and keep momentum without external pressure. Meeting my own goals and holding myself to them became just as important as the final outcome. Here is an image from the big presentation day!"
          images={[{ src: THESIS_IMAGES.finalOutcome, alt: 'Thesis presentation day' }]}
        />

        <footer className="thesis-case-nav">
          <Link
            to="/dsg"
            className="thesis-case-nav-link thesis-case-nav-prev"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="thesis-case-nav-content">
              <span className="thesis-case-nav-arrow" aria-hidden>←</span>
              <span className="thesis-case-nav-label">Previous case study</span>
            </div>
            {get_case_study_for_path('/dsg') && (
              <span className="thesis-case-nav-meta-subtitle">{get_case_study_for_path('/dsg').subtitle}</span>
            )}
          </Link>
          <Link
            to="/#work"
            className="thesis-case-nav-link thesis-case-nav-next"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="thesis-case-nav-content">
              <span className="thesis-case-nav-label">Next case study</span>
              <span className="thesis-case-nav-arrow" aria-hidden>→</span>
            </div>
            {get_case_study_for_path('/hsa-fsa') && (
              <span className="thesis-case-nav-meta-subtitle">{get_case_study_for_path('/hsa-fsa').subtitle}</span>
            )}
          </Link>
        </footer>
      </article>
    </div>
  </div>
  );
};


export default Thesis;
