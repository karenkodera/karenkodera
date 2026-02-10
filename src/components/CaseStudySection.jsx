import { motion } from 'framer-motion';

export default function CaseStudySection({
  id,
  label,
  heading,
  body,
  body2,
  comparisonPairs,
  list,
  listTitle,
  listWithImages,
  listWithImagesTitleLeft,
  listWithIcons,
  equationImage,
  quote,
  quoteAttribution,
  twoColumns,
  images,
  textInBox,
  video,
}) {
  const titleLeftClass = listWithImages && listWithImages.length > 0 && listWithImagesTitleLeft ? ' thesis-section-title-left' : '';
  const solutionClass = equationImage ? ' thesis-section-solution' : '';
  const hasMediaRight = !!video;

  const labelEl = <span className="thesis-section-label">{label}</span>;
  const headingEl = <h2 className={`thesis-section-heading${titleLeftClass ? ' header1' : ''}`}>{heading}</h2>;
  const bodyEl = body ? <p className="thesis-section-body">{body}</p> : null;

  const twoColumnsEl = twoColumns && (
    <div className="thesis-two-col">
      {twoColumns.map((col, i) => (
        <div key={i} className="thesis-col">
          <div className="thesis-col-header">
            {col.iconSrc && (
              <img src={col.iconSrc} alt={col.iconAlt ?? col.title} className="thesis-col-icon" loading="lazy" />
            )}
            <h3 className="thesis-col-title">{col.title}</h3>
          </div>
          <ul>
            {col.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <motion.section
      id={id}
      className={`thesis-section${titleLeftClass}${solutionClass}${hasMediaRight ? ' thesis-section-media-right' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
    >
      {equationImage ? (
        <>
          <span className="thesis-section-label">{label}</span>
          <h2 className="thesis-section-heading thesis-solution-heading">{heading}</h2>
          {body && <p className="thesis-section-body thesis-solution-body">{body}</p>}
          <figure className="thesis-figure thesis-figure-equation">
            <img src={equationImage.src} alt={equationImage.alt} className="thesis-image" loading="lazy" />
          </figure>
        </>
      ) : video ? (
        <>
          <div className="thesis-section-content-box">
            {labelEl}
            {headingEl}
            {twoColumnsEl}
          </div>
          <figure className="thesis-section-media">
            <video src={video} controls className="thesis-video" playsInline>
              Your browser does not support the video tag.
            </video>
          </figure>
        </>
      ) : textInBox ? (
        <div className="thesis-section-text-box">
          {labelEl}
          {headingEl}
          {bodyEl}
        </div>
      ) : (
        <>
          {labelEl}
          {headingEl}
          {bodyEl}
        </>
      )}
      {comparisonPairs && comparisonPairs.length > 0 && (
        <div className="thesis-comparison-pairs">
          {comparisonPairs.map((pair, i) => {
            const colonIndex = pair.text.indexOf(':');
            const label = colonIndex > -1 ? pair.text.substring(0, colonIndex + 1) : '';
            const desc = colonIndex > -1 ? pair.text.substring(colonIndex + 1).trim() : pair.text;
            return (
              <div key={i} className="thesis-comparison-pair">
                <figure className="thesis-figure thesis-comparison-pair-image">
                  <img src={pair.src} alt={pair.alt} className="thesis-image" loading="lazy" />
                </figure>
                <p className="thesis-section-body thesis-comparison-pair-text">
                  {label && <span className="thesis-comparison-pair-label">{label}</span>}
                  {label && ' '}
                  <span className="thesis-comparison-pair-desc">{desc}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
      {body2 && <p className="thesis-section-body">{body2}</p>}
      {images && images.length > 0 && !(equationImage && listWithIcons && listWithIcons.length === images.length) && (
        <div className="thesis-section-images">
          {images.map((img, i) => (
            <figure key={i} className={`thesis-figure${img.flat ? ' thesis-figure-flat' : ''}${img.compact ? ' thesis-figure-compact' : ''}${img.wide ? ' thesis-figure-wide' : ''}${img.smaller ? ' thesis-figure-small' : ''}${img.whiteBg ? ' thesis-figure-white-bg' : ''}${img.noBorder ? ' thesis-figure-no-border' : ''}${img.grayBox ? ' thesis-figure-gray-box' : ''}`}>
              <img src={img.src} alt={img.alt} className="thesis-image" loading="lazy" />
              {img.caption && <figcaption className="thesis-figcaption">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
      {equationImage && listWithIcons && images && listWithIcons.length === images.length && (
        <div className="thesis-solution-rows">
          {listWithIcons.map((item, i) => (
            <div key={i} className="thesis-solution-row">
              <div className="thesis-solution-row-content">
                <img src={item.iconSrc} alt={item.iconAlt} className="thesis-list-with-icons-icon" loading="lazy" />
                <span className="thesis-list-with-icons-text">
                  {item.title ? (
                    <>
                      <span className="thesis-solution-row-title">{item.title}:</span>{' '}
                      <span className="thesis-solution-row-desc">{item.text}</span>
                    </>
                  ) : (
                    item.text
                  )}
                </span>
              </div>
              <figure className="thesis-figure thesis-solution-row-image">
                <img src={images[i].src} alt={images[i].alt} className="thesis-image" loading="lazy" />
              </figure>
            </div>
          ))}
        </div>
      )}
      {listWithIcons && listWithIcons.length > 0 && !(equationImage && images && listWithIcons.length === images.length) && (
        <ul className="thesis-list-with-icons">
          {listWithIcons.map((item, i) => (
            <li key={i} className="thesis-list-with-icons-item">
              <img src={item.iconSrc} alt={item.iconAlt} className="thesis-list-with-icons-icon" loading="lazy" />
              <span className="thesis-list-with-icons-text">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
      {quote && (
        <blockquote className="thesis-quote">
          "{quote}"
          {quoteAttribution && <cite>— {quoteAttribution}</cite>}
        </blockquote>
      )}
      {listWithImages && listWithImages.length > 0 && (
        <div className="thesis-list-with-images">
          {listWithImages.map((item, i) => (
            <div key={i} className="thesis-list-with-images-item">
              <figure className="thesis-figure">
                <img src={item.src} alt={item.alt} className="thesis-image" loading="lazy" />
              </figure>
              <div>
                <p className="thesis-list-with-images-text">{item.text}</p>
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="thesis-list-with-images-bullets">
                    {item.bullets.map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {list && (
        <div className="thesis-list-wrap">
          {listTitle && (
            <div className="thesis-list-title-section">
              <span className="thesis-list-title-icon">🏆</span>
              <h3 className="thesis-list-title">{listTitle}</h3>
            </div>
          )}
          <ul className="thesis-list">
            {list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {twoColumns && !video && twoColumnsEl}
    </motion.section>
  );
}
