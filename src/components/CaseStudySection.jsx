import { motion } from 'framer-motion';

const ZEBRA_DEVICE_FRAME = '/dsg/zebra-device.png';

function VideoInDevice({ children }) {
  return (
    <div className="thesis-video-device-wrap">
      <div className="thesis-video-screen">
        {children}
      </div>
      <img className="thesis-device-frame" src={ZEBRA_DEVICE_FRAME} alt="" role="presentation" />
    </div>
  );
}

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
  videoAfter,
  videoLabel,
  videoBody,
  videoAfterLabel,
  videoAfterBody,
  videoLeft,
  videoLeftAfter,
  videoLeftLabel,
  videoLeftBody,
  videoLeftAfterLabel,
  videoLeftAfterBody,
  imageRight,
  imageLeft,
  imageInLeft,
  imagesBeforeBody2,
  solutionBox,
  statBox,
  calloutBoxes,
  headingPlaceholder,
  bodyHeading2,
  headingHeading2,
  imagePlaceholder,
}) {
  const titleLeftClass = listWithImages && listWithImages.length > 0 && listWithImagesTitleLeft ? ' thesis-section-title-left' : '';
  const solutionClass = equationImage ? ' thesis-section-solution' : '';
  const hasMediaRight = !!(video || videoAfter);
  const hasTwoVideos = !!(video && videoAfter);
  const hasMediaLeft = !!(videoLeft || videoLeftAfter);
  const hasTwoVideosLeft = !!(videoLeft && videoLeftAfter);
  const hasImageRight = !!(imageRight && imageRight.src);
  const hasImageLeft = !!(imageLeft && imageLeft.src);

  const labelEl = <span className="thesis-section-label">{label}</span>;
  const headingEl = <h2 className={`thesis-section-heading${titleLeftClass ? ' header1' : ''}${headingHeading2 ? ' thesis-heading2' : ''}`}>{heading}</h2>;
  const bodyEl = body ? <p className={`thesis-section-body${bodyHeading2 ? ' thesis-heading2' : ''}`}>{body}</p> : null;

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
          {col.video && (
            <figure className="thesis-col-video">
              <VideoInDevice>
                <video
                  src={col.video}
                  className="thesis-video"
                  playsInline
                  muted
                  loop
                  autoPlay
                  aria-label={`${col.title} video plays automatically`}
                >
                  Your browser does not support the video tag.
                </video>
              </VideoInDevice>
            </figure>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <motion.section
      id={id}
      className={`thesis-section${titleLeftClass}${solutionClass}${hasMediaRight ? ' thesis-section-media-right' : ''}${hasTwoVideos ? ' thesis-section-two-videos' : ''}${hasMediaLeft ? ' thesis-section-media-left' : ''}${hasTwoVideosLeft ? ' thesis-section-two-videos-left' : ''}${hasImageRight ? ' thesis-section-image-right' : ''}${hasImageLeft ? ' thesis-section-image-left' : ''}`}
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
      ) : hasImageRight ? (
        <>
          <div className="thesis-section-content-image-wrap">
            <div className="thesis-section-content-image-left">
              {labelEl}
              {headingEl}
              {bodyEl}
              {list && (
                <div className="thesis-list-wrap">
                  <ul className="thesis-list">
                    {list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {imageInLeft && (
                <figure className="thesis-figure thesis-figure-in-left">
                  <img src={imageInLeft.src} alt={imageInLeft.alt} className="thesis-image" loading="lazy" />
                  {imageInLeft.caption && <figcaption className="thesis-figcaption">{imageInLeft.caption}</figcaption>}
                </figure>
              )}
            </div>
            <figure className="thesis-section-content-image-right">
              <img src={imageRight.src} alt={imageRight.alt} className="thesis-image" loading="lazy" />
              {imageRight.caption && (
                <figcaption className="thesis-figcaption">{imageRight.caption}</figcaption>
              )}
            </figure>
          </div>
        </>
      ) : hasImageLeft ? (
        <>
          <div className="thesis-section-content-image-wrap">
            <figure className="thesis-section-content-image-left">
              <img src={imageLeft.src} alt={imageLeft.alt} className="thesis-image" loading="lazy" />
              {imageLeft.caption && (
                <figcaption className="thesis-figcaption">{imageLeft.caption}</figcaption>
              )}
            </figure>
            <div className="thesis-section-content-image-right">
              {labelEl}
              {headingEl}
              {bodyEl}
            </div>
          </div>
        </>
      ) : videoLeft || videoLeftAfter ? (
        <>
          <div className="thesis-section-title-wrap">
            {labelEl}
            {headingEl}
          </div>
          <div className="thesis-before-after-row">
            {videoLeft && (
              <div className="thesis-change-video-box">
                {(videoLeftLabel || videoLeftBody) && (
                  <div className="thesis-video-caption">
                    {videoLeftLabel && <span className="thesis-video-label">{videoLeftLabel}</span>}
                    {videoLeftBody && <p className="thesis-video-body">{videoLeftBody}</p>}
                  </div>
                )}
                <VideoInDevice>
                  <video
                    src={videoLeft}
                    className="thesis-video"
                    playsInline
                    muted
                    loop
                    autoPlay
                    aria-label="Video plays automatically"
                  >
                    Your browser does not support the video tag.
                  </video>
                </VideoInDevice>
              </div>
            )}
            {videoLeftAfter && (
              <div className="thesis-change-video-box">
                {(videoLeftAfterLabel || videoLeftAfterBody) && (
                  <div className="thesis-video-caption">
                    {videoLeftAfterLabel && <span className="thesis-video-label">{videoLeftAfterLabel}</span>}
                    {videoLeftAfterBody && <p className="thesis-video-body">{videoLeftAfterBody}</p>}
                  </div>
                )}
                <VideoInDevice>
                  <video
                    src={videoLeftAfter}
                    className="thesis-video"
                    playsInline
                    muted
                    loop
                    autoPlay
                    aria-label="After video plays automatically"
                  >
                    Your browser does not support the video tag.
                  </video>
                </VideoInDevice>
              </div>
            )}
          </div>
          {body && (
            <div className="thesis-section-content-box">
              {bodyEl}
            </div>
          )}
        </>
      ) : video || videoAfter ? (
        <>
          <div className="thesis-section-content-box">
            {labelEl}
            {headingEl}
          </div>
          <div className="thesis-before-after-row">
            {video && (
              <div className="thesis-change-video-box">
                {(videoLabel || videoBody) && (
                  <div className="thesis-video-caption">
                    {videoLabel && <span className="thesis-video-label">{videoLabel}</span>}
                    {videoBody && <p className="thesis-video-body">{videoBody}</p>}
                  </div>
                )}
                <VideoInDevice>
                  <video
                    src={video}
                    className="thesis-video"
                    playsInline
                    muted
                    loop
                    autoPlay
                    aria-label="Before video plays automatically"
                  >
                    Your browser does not support the video tag.
                  </video>
                </VideoInDevice>
              </div>
            )}
            {videoAfter && (
              <div className="thesis-change-video-box">
                {(videoAfterLabel || videoAfterBody) && (
                  <div className="thesis-video-caption">
                    {videoAfterLabel && <span className="thesis-video-label">{videoAfterLabel}</span>}
                    {videoAfterBody && <p className="thesis-video-body">{videoAfterBody}</p>}
                  </div>
                )}
                <VideoInDevice>
                  <video
                    src={videoAfter}
                    className="thesis-video"
                    playsInline
                    muted
                    loop
                    autoPlay
                    aria-label="After video plays automatically"
                  >
                    Your browser does not support the video tag.
                  </video>
                </VideoInDevice>
              </div>
            )}
          </div>
        </>
      ) : textInBox && images && images.length > 0 && solutionBox ? (
        <div className="thesis-solution-box thesis-change-video-box">
          <div className="thesis-section-text-box">
            {labelEl}
            {headingEl}
            {bodyEl}
          </div>
          <div className="thesis-section-images">
            {images.map((img, i) => (
              <figure key={i} className={`thesis-figure${img.flat ? ' thesis-figure-flat' : ''}${img.compact ? ' thesis-figure-compact' : ''}${img.wide ? ' thesis-figure-wide' : ''}${img.smaller ? ' thesis-figure-small' : ''}${img.whiteBg ? ' thesis-figure-white-bg' : ''}${img.noBorder ? ' thesis-figure-no-border' : ''}${img.grayBox ? ' thesis-figure-gray-box' : ''}`}>
                <img src={img.src} alt={img.alt} className="thesis-image" loading="lazy" />
                {img.caption && <figcaption className="thesis-figcaption">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      ) : textInBox && images && images.length > 0 ? (
        <>
          <div className="thesis-section-text-box">
            {labelEl}
            {headingEl}
            {bodyEl}
          </div>
          <div className="thesis-section-images">
            {images.map((img, i) => (
              <figure key={i} className={`thesis-figure${img.flat ? ' thesis-figure-flat' : ''}${img.compact ? ' thesis-figure-compact' : ''}${img.wide ? ' thesis-figure-wide' : ''}${img.smaller ? ' thesis-figure-small' : ''}${img.whiteBg ? ' thesis-figure-white-bg' : ''}${img.noBorder ? ' thesis-figure-no-border' : ''}${img.grayBox ? ' thesis-figure-gray-box' : ''}`}>
                <img src={img.src} alt={img.alt} className="thesis-image" loading="lazy" />
                {img.caption && <figcaption className="thesis-figcaption">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
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
          {headingPlaceholder && (
            <div className="thesis-heading-placeholder" aria-hidden="true">
              <span className="thesis-heading-placeholder-text">{headingPlaceholder.text}</span>
            </div>
          )}
          {bodyEl}
          {calloutBoxes && calloutBoxes.length > 0 && (
            <div className="thesis-callout-boxes">
              {calloutBoxes.map((text, i) => (
                <div key={i} className="thesis-callout-box">
                  <span className="thesis-callout-box-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                  </span>
                  <p className="thesis-callout-box-text">{text}</p>
                </div>
              ))}
            </div>
          )}
          {statBox && (
            <div className="thesis-stat-box">
              <span className="thesis-stat-box-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10" />
                  <path d="M12 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              </span>
              <p className="thesis-stat-box-text">{statBox.text}</p>
            </div>
          )}
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
      {imagesBeforeBody2 && images && images.length > 0 && !(equationImage && listWithIcons && listWithIcons.length === images.length) && !(textInBox && images.length > 0) && (
        <div className="thesis-section-images">
          {images.map((img, i) => (
            <figure key={i} className={`thesis-figure${img.flat ? ' thesis-figure-flat' : ''}${img.compact ? ' thesis-figure-compact' : ''}${img.wide ? ' thesis-figure-wide' : ''}${img.smaller ? ' thesis-figure-small' : ''}${img.whiteBg ? ' thesis-figure-white-bg' : ''}${img.noBorder ? ' thesis-figure-no-border' : ''}${img.grayBox ? ' thesis-figure-gray-box' : ''}${img.fullWidth ? ' thesis-figure-full-width' : ''}`}>
              <img src={img.src} alt={img.alt} className="thesis-image" loading="lazy" />
              {img.caption && <figcaption className="thesis-figcaption">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
      {body2 && <p className="thesis-section-body">{body2}</p>}
      {imagePlaceholder && (
        <div className="thesis-heading-placeholder" aria-hidden="true">
          <span className="thesis-heading-placeholder-text">{imagePlaceholder.text}</span>
        </div>
      )}
      {!imagesBeforeBody2 && images && images.length > 0 && !(equationImage && listWithIcons && listWithIcons.length === images.length) && !(textInBox && images.length > 0) && (
        <div className="thesis-section-images">
          {images.map((img, i) => (
            <figure key={i} className={`thesis-figure${img.flat ? ' thesis-figure-flat' : ''}${img.compact ? ' thesis-figure-compact' : ''}${img.wide ? ' thesis-figure-wide' : ''}${img.smaller ? ' thesis-figure-small' : ''}${img.whiteBg ? ' thesis-figure-white-bg' : ''}${img.noBorder ? ' thesis-figure-no-border' : ''}${img.grayBox ? ' thesis-figure-gray-box' : ''}${img.fullWidth ? ' thesis-figure-full-width' : ''}`}>
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
                <p className="thesis-list-with-images-text">
                  {(() => {
                    const colonIdx = item.text.indexOf(':');
                    if (colonIdx === -1) return item.text;
                    const title = item.text.substring(0, colonIdx + 1);
                    const desc = item.text.substring(colonIdx + 1).trim();
                    return (
                      <>
                        <span className="thesis-list-with-images-title">{title}</span>
                        {desc && <> {desc}</>}
                      </>
                    );
                  })()}
                </p>
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
      {list && !hasImageRight && (
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
      {twoColumns && !video && (twoColumns.some(col => col.video) ? (
        <div className="thesis-before-after-row">
          {twoColumns.map((col, i) => (
            <div key={i} className="thesis-change-video-box">
              <div className="thesis-video-caption">
                <span className="thesis-video-label">{col.title}</span>
                {col.items && col.items.length > 0 && (
                  <p className="thesis-video-body">{col.items.join(' ')}</p>
                )}
              </div>
              <VideoInDevice>
                <video
                  src={col.video}
                  className="thesis-video"
                  playsInline
                  muted
                  loop
                  autoPlay
                  aria-label={`${col.title} video plays automatically`}
                >
                  Your browser does not support the video tag.
                </video>
              </VideoInDevice>
            </div>
          ))}
        </div>
      ) : twoColumnsEl)}
    </motion.section>
  );
}
