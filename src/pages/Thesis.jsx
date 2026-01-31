import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Thesis.css';

const Thesis = ({ setCursorVariant }) => {
  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  return (
    <div className="thesis-page">
      <motion.header
        className="thesis-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          to="/"
          className="thesis-back"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          ← Back
        </Link>
      </motion.header>

      <article className="thesis-article">
        <motion.section
          className="thesis-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="thesis-title">Bridg</h1>
          <p className="thesis-tagline">
            A B2B2C feedback service to help retail brands produce only what customers really want and reduce overproduction as a result.
          </p>
          <dl className="thesis-meta">
            <div>
              <dt>Responsibilities</dt>
              <dd>Design Researcher, Product and Service Designer</dd>
              <dd className="meta-sub">UX Research, Competitive Analysis, User testing, Wireframing, Prototyping, Business Strategy</dd>
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
              <dd>Figma, Jitter</dd>
            </div>
          </dl>
          <p className="thesis-summary">
            The Earth has suffered long enough from rampant clothing overproduction. Bridg transforms customer feedback into smarter production decisions. Through interactive mini games, Bridg helps brands produce only what customers want, minimizing unsold inventory, and keeping excess clothing out of landfills. The result? A more sustainable fashion industry, driven by conscious creation.
          </p>
        </motion.section>

        <ThesisSection
          label="PROBLEM"
          heading="The fashion industry is in the top 5 most polluting industries in the world..."
          body="Fast fashion items are created out of low quality materials called synthetic fibers. Not only do these pieces fall apart after 1–2 uses, synthetic fibers contain tiny pieces of plastic. When these fast fashion pieces are put through the wash, they release plastic into the water, which end up in our oceans."
        />

        <ThesisSection
          label="USER"
          heading="The main offender of fashion trends is the avid female shopper aged 18–35."
          body="As proven by a survey by Vogue Business, these people are early in their career, they aren't making a lot of money yet so they want to spend less to stay on trend."
        />

        <ThesisSection
          label="RESEARCH METHODS"
          heading="I conducted primary and secondary research to understand my user."
          list={[
            'interviewed/tested 30+ users',
            'interviewed experts in retail — buyers, influencer marketing managers, fashion designers',
            'worked at H&M as a sales advisor',
          ]}
        />

        <ThesisSection
          label="INSIGHT"
          heading="Style First, Sustainability Second."
          body="While many consumers feel guilt over shopping fast fashion, these feelings rarely translate into action."
          quote="I think about sustainability, but then I think, eh it's cheaper"
        />

        <ThesisSection
          label="QUESTION TO ANSWER"
          heading="How might we encourage mindful clothing consumption while keeping in mind the average consumer's focus on trends and budget?"
        />

        <ThesisSection
          label="COMPETITIVE ANALYSIS"
          heading="Most successful competitors focus on rewear, but that model fails for fast fashion that isn't made to last."
          body="Ideally, what we want for a perfectly sustainable world is a circular fashion economy. Items are recycled so that we don't need to keep making new products. Competitors that are successful at hitting people's needs for affordability, trendiness and sustainability that are on the market right now focus on getting the most wears out of items before being sent to landfill. But, this doesn't work for fast fashion items that are so low quality that they fall apart and can't be resold."
        />

        <ThesisSection
          label="PROBLEM SOLVING"
          heading="The only way to stop the flow of items into landfill is to stop the flow of product production. Therefore, the solution has to target brands not consumers."
          body="Ideally, what we want for a perfectly sustainable world is a circular fashion economy. Items are recycled so that we don't need to keep making new products. Competitors that are successful at hitting people's needs for affordability, trendiness and sustainability that are on the market right now focus on getting the most wears out of items before being sent to landfill. But, this doesn't work for fast fashion items that are so low quality that they fall apart and can't be resold."
          quote="Consumers have been trained to think you can get anything at all times. Responsibility ultimately falls to the brands to create mindfully rather than to the consumer to consume less."
          quoteAttribution="Amanda McFee, Director and Fashion Designer of Evoshield at Wilson Sporting Goods"
        />

        <ThesisSection
          label="SOLUTION"
          heading="INTRODUCING BRIDG: A three part system for gathering feedback, placing orders and factory production."
          body="This gamified feedback service helps brands produce only what is desired by integrating a series of games directly into their websites. By understanding consumer demand, brands can cut down on unsold inventory and save money on production, leading to less clothing being made and sent to landfill."
          list={[
            'Interactive Game: An engaging tool for customers to vote on their favorite designs, giving brands real-time insights into consumer preferences.',
            'Pre-Order Platform: A system where customers can purchase items won in games before production begins, creating a sense of exclusivity.',
            'Brand-Side Dashboard: A platform for businesses to see the analytics behind customer-facing games and make smart production decisions.',
          ]}
        />

        <ThesisSection
          label="EXISTING BRAND INTEGRATION"
          heading="Bridg integrates seamlessly into brand websites through using a white label model."
          body="All these models have the same content and information but change depending on existing brand language. White label branding allows Bridg to integrate seamlessly into different retail brands' ecosystems without disrupting their existing identity which makes adoption easier for brands. It also increases scalability for Bridg, since it can be adapted across multiple brands without needing to reinvent the core experience each time."
        />

        <ThesisSection
          label="USER TESTING AND RETURNING TO RESEARCH"
          heading="A pre-order model can work if customers are given incentive."
          body="Since Bridg sells with pre-order, this means that users must wait a little longer for their items to get them. Traditional model: Items arrive at door in around 2–4 weeks. Bridg pre-order model: Items arrive at door in around 4–6 weeks. During user testing, a question that came up often was: In a world of instant gratification, are people really willing to wait for their items? I surveyed 24 young adult shoppers and found that they were! If given incentive."
          list={[
            'items are exclusive',
            'items are made with consumer input',
            'items are cheaper',
            'items are more environmentally friendly',
          ]}
          listTitle="Bridg's Incentives"
        />

        <ThesisSection
          label="IMPACT"
          heading="Both brands and consumers benefit, and as a result, the environment as well."
          twoColumns={[
            { title: 'Brands', items: ['reduces unsold inventory', 'saves money on production', 'come off as eco-conscious to public eye'] },
            { title: 'Consumers', items: ['receives early access', 'personal connection to brand', 'feels sustainable'] },
          ]}
        />

        <ThesisSection
          label="FINAL OUTCOME"
          heading="Learning to own the process!"
          body="Tackling this project solo was my biggest design challenge yet. Over the course of six months, I learned how to manage my time, stay accountable, and keep momentum without external pressure. Meeting my own goals and holding myself to them became just as important as the final outcome. Here is an image from the big presentation day!"
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
          <div className="thesis-links">
            <Link to="/" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Work</Link>
            <Link to="/play" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Play</Link>
            <Link to="/about" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>About</Link>
            <a href="/karengpt" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>RESUME</a>
          </div>
        </motion.section>
      </article>
    </div>
  );
};

function ThesisSection({
  label,
  heading,
  body,
  list,
  listTitle,
  quote,
  quoteAttribution,
  twoColumns,
}) {
  return (
    <motion.section
      className="thesis-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
    >
      <span className="thesis-section-label">{label}</span>
      <h2 className="thesis-section-heading">{heading}</h2>
      {body && <p className="thesis-section-body">{body}</p>}
      {quote && (
        <blockquote className="thesis-quote">
          "{quote}"
          {quoteAttribution && <cite>— {quoteAttribution}</cite>}
        </blockquote>
      )}
      {list && (
        <div className="thesis-list-wrap">
          {listTitle && <h3 className="thesis-list-title">{listTitle}</h3>}
          <ul className="thesis-list">
            {list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {twoColumns && (
        <div className="thesis-two-col">
          {twoColumns.map((col, i) => (
            <div key={i} className="thesis-col">
              <h3 className="thesis-col-title">{col.title}</h3>
              <ul>
                {col.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

export default Thesis;
