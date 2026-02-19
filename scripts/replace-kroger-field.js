const fs = require('fs');
const path = 'src/pages/Kroger.jsx';
let s = fs.readFileSync(path, 'utf8');

// Match the exact block including possible curly apostrophe (don't)
const oldRegex = /          <CaseStudySection\s+id="field-research"[^/]*?images=\[\s*\{\s*src: KROGER_IMAGES\.rideAlong,[^}]+\}\s*\]\s*\/>\s*\{\/\* Field Research[^}]+\*\/\}\s*\n\s*<CaseStudySection\s+id="problem-finding-workshop"/s;

const newBlock = `          <motion.section
            id="field-research"
            className="thesis-section thesis-section-hmw-with-image"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
          >
            <span className="thesis-section-label">FIELD RESEARCH</span>
            <div className="thesis-section-hmw-wrap">
              <div className="thesis-section-hmw-content">
                <h2 className="thesis-section-heading">
                  I rode-along with drivers to observe as they completed orders.
                </h2>
                <p className="thesis-section-body">
                  I watched them complete their orders throughout the day, taking notes on what I noticed and asking lots of questions. I took these ideas back and deciphered patterns through affinity mapping. Then, arranged my insights into 3 problem spaces that I could potentially delve into.
                </p>
                <div className="thesis-list-wrap">
                  <ul className="thesis-list">
                    <li>HMW make destaging clearer so orders don't get forgotten</li>
                    <li>HMW make destaging customizable for driver preferences?</li>
                    <li>HMW reduce paper usage in the delivery process?</li>
                  </ul>
                </div>
              </div>
              <figure className="thesis-section-hmw-figure">
                <img
                  src={KROGER_IMAGES.rideAlong}
                  alt="Kroger delivery driver pulling a utility wagon from a branded delivery truck"
                  className="thesis-image"
                  loading="lazy"
                />
              </figure>
            </div>
          </motion.section>

          <CaseStudySection
            id="problem-finding-workshop"`;

if (oldRegex.test(s)) {
  s = s.replace(oldRegex, newBlock);
  fs.writeFileSync(path, s);
  console.log('Replaced successfully');
} else {
  console.log('Pattern not found');
  // Try simpler match
  const simple = s.indexOf('id="field-research"');
  console.log('field-research at', simple);
  console.log('snippet:', s.slice(simple, simple + 200));
}
